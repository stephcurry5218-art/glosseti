import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, styleCategory, photoType, gender } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isMale = gender === "male";

    const stylePrompts: Record<string, { male: string; female: string }> = {
      "full-style": {
        female: "wearing an elegant outfit: silk blouse, tailored wide-leg trousers, strappy heels, dainty gold jewelry, and a structured crossbody bag. Soft glam makeup with rose tones.",
        male: "wearing a sharp outfit: fitted oxford shirt, tailored chinos, clean leather loafers, a sleek watch, and a leather messenger bag. Well-groomed with a clean fade haircut.",
      },
      streetwear: {
        female: "wearing trendy streetwear: oversized graphic tee, black cargo pants, chunky white sneakers, a snapback cap, silver chain necklace, and a black crossbody sling bag.",
        male: "wearing streetwear: oversized graphic hoodie, black joggers, high-top sneakers, a fitted cap, layered silver chains, and a crossbody bag.",
      },
      minimalist: {
        female: "wearing minimalist fashion: perfectly fitted white crewneck tee, black tailored trousers, clean white leather sneakers, thin gold chain necklace, and a structured black leather tote.",
        male: "wearing minimalist fashion: fitted black crew-neck tee, tailored grey trousers, clean white leather sneakers, a simple silver watch, and a slim black leather wallet.",
      },
      vintage: {
        female: "wearing vintage-inspired fashion: floral print blouse with bell sleeves, high-waisted flare jeans, platform boots, oversized round sunglasses, and layered gold medallion necklaces.",
        male: "wearing vintage-inspired fashion: retro patterned button-up shirt, high-waisted straight-leg trousers, leather boots, aviator sunglasses, and a leather belt with a vintage buckle.",
      },
      athleisure: {
        female: "wearing athleisure style: fitted black crop top, tapered grey joggers, white running sneakers, an Apple watch, and a belt bag worn crossbody.",
        male: "wearing athleisure style: fitted performance tee, tapered joggers, clean running sneakers, a sport watch, and a sling bag.",
      },
      formal: {
        female: "wearing formal attire: tailored blazer dress, pointed-toe pumps, pearl earrings, a clutch purse, and polished makeup with a bold lip.",
        male: "wearing formal attire: tailored navy suit, crisp white dress shirt, silk tie, polished oxford shoes, a silver watch, and a leather briefcase.",
      },
      casual: {
        female: "wearing casual everyday clothes: relaxed-fit crewneck sweater in oatmeal, straight-leg medium-wash jeans, clean white sneakers, and a canvas tote bag.",
        male: "wearing casual everyday clothes: relaxed henley shirt, well-fitted dark jeans, clean suede desert boots, a simple watch, and a canvas backpack.",
      },
      "makeup-only": {
        female: "with a complete glam makeup look: flawless dewy skin, soft rose eyeshadow, defined brows, winged eyeliner, volumizing mascara, highlighted cheekbones, and a satin rose lipstick.",
        male: "with a refined grooming look: even skin tone with light concealer, shaped and groomed brows, subtle lip balm, well-moisturized skin, and a clean, fresh appearance.",
      },
    };

    const styleDesc = stylePrompts[styleCategory]?.[isMale ? "male" : "female"] || stylePrompts["full-style"][isMale ? "male" : "female"];
    const genderWord = isMale ? "man" : "woman";
    const editPrompt = photoType === "full-body"
      ? `Transform this ${genderWord}'s outfit. Show them ${styleDesc} Keep the person's face, body, and background the same. Make the clothing and accessories look realistic and well-fitted. Professional fashion photography style with warm lighting.`
      : `Transform this ${genderWord}'s look. Show them ${styleDesc} Keep the person's face shape, features, and background the same. Make everything look realistic and natural. Professional fashion portrait with warm lighting.`;

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
