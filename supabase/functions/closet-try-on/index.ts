import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, items, gender, outfit } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Photo required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!outfit || !outfit.items || outfit.items.length === 0) {
      return new Response(JSON.stringify({ error: "Outfit items required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isMale = gender === "male";
    const genderWord = isMale ? "man" : "woman";
    const outfitPieces = outfit.items.join(", ");

    const prompt = `You are a world-class fashion photo editor. The user has uploaded a full-body photo of themselves. Restyle this ${genderWord} wearing EXACTLY these specific clothing items from their own wardrobe: ${outfitPieces}.

Outfit name: "${outfit.description}"
Occasion: ${outfit.occasion}
Styling tip: ${outfit.tips}

CRITICAL REQUIREMENTS:
1. PRESERVE THE PERSON'S EXACT FACE — same eyes, nose, mouth, jawline, skin tone, hair color and texture. The person must be immediately recognizable.
2. PRESERVE THE PERSON'S EXACT BODY TYPE AND PROPORTIONS — same height, build, and physique.
3. Dress them in the EXACT items listed above — match the descriptions precisely (colors, types, styles).
4. Style the outfit naturally — proper fit, appropriate layering, realistic draping.
5. Keep the same pose or a natural standing pose.
6. Professional fashion editorial photography, clean background, beautiful lighting.
7. Full-body shot showing the complete outfit from head to toe.
8. All clothing must be ${isMale ? "men's/masculine" : "women's/feminine"} items.

Generate a single high-quality fashion editorial photo of this person wearing this exact outfit combination.`;

    const messages = [
      {
        role: "user" as const,
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: { url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` },
          },
        ],
      },
    ];

    // Retry logic with backoff
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 2000 * attempt));

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages,
          modalities: ["image", "text"],
        }),
      });

      if (response.status === 429) {
        console.warn(`Rate limited attempt ${attempt + 1}/${maxRetries}`);
        lastError = new Error("RATE_LIMITED");
        continue;
      }
      if (response.status === 402) throw new Error("CREDITS_EXHAUSTED");
      if (!response.ok) {
        const errText = await response.text();
        console.error("AI error:", response.status, errText);
        throw new Error("GENERATION_FAILED");
      }

      const data = await response.json();
      const firstImage = data.choices?.[0]?.message?.images?.[0];
      const generatedImage = firstImage?.image_url?.url ?? firstImage?.url ?? null;

      if (!generatedImage) throw new Error("NO_IMAGE_RETURNED");

      return new Response(JSON.stringify({ generatedImage }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw lastError || new Error("RATE_LIMITED");
  } catch (error) {
    console.error("Closet try-on error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    const status = msg === "RATE_LIMITED" ? 429 : msg === "CREDITS_EXHAUSTED" ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
