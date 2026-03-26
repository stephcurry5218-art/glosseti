import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, styleCategory, photoType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const stylePrompts: Record<string, string> = {
      "full-style": "wearing an elegant outfit: silk blouse, tailored wide-leg trousers, strappy heels, dainty gold jewelry, and a structured crossbody bag. Soft glam makeup with rose tones.",
      streetwear: "wearing trendy streetwear: oversized graphic tee, black cargo pants, chunky white sneakers, a snapback cap, silver chain necklace, and a black crossbody sling bag.",
      minimalist: "wearing minimalist fashion: perfectly fitted white crewneck tee, black tailored trousers, clean white leather sneakers, thin gold chain necklace, and a structured black leather tote.",
      vintage: "wearing vintage-inspired fashion: floral print blouse with bell sleeves, high-waisted flare jeans, platform boots, oversized round sunglasses, and layered gold medallion necklaces.",
      athleisure: "wearing athleisure style: fitted black crop top, tapered grey joggers, white running sneakers, an Apple watch, and a belt bag worn crossbody.",
      formal: "wearing formal attire: tailored black blazer, crisp white dress shirt, slim-fit dress pants, polished oxford shoes, a silver watch, and a leather briefcase.",
      casual: "wearing casual everyday clothes: relaxed-fit crewneck sweater in oatmeal, straight-leg medium-wash jeans, clean white sneakers, and a canvas tote bag.",
      "makeup-only": "with a complete glam makeup look: flawless dewy skin, soft rose eyeshadow, defined brows, winged eyeliner, volumizing mascara, highlighted cheekbones, and a satin rose lipstick.",
    };

    const styleDesc = stylePrompts[styleCategory] || stylePrompts["full-style"];
    const editPrompt = photoType === "full-body"
      ? `Transform this person's outfit. Show them ${styleDesc} Keep the person's face, body, and background the same. Make the clothing and accessories look realistic and well-fitted. Professional fashion photography style with warm lighting.`
      : `Transform this person's look. Show them ${styleDesc} Keep the person's face shape, features, and background the same. Make everything look realistic and natural. Professional fashion portrait with warm lighting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: editPrompt },
              {
                type: "image_url",
                image_url: { url: imageBase64 },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "Failed to generate styled image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ imageUrl: generatedImage || null, description: textResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-styled-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
