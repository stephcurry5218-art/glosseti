import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, styleCategory, photoType, gender, generationMode, refinementContext, celebrityGuide } = await req.json();
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
      sexy: {
        female: "wearing a sultry, body-confident outfit: a fitted bodycon mini dress with cut-out details, strappy stiletto heels, layered gold body chains, bold smoky eye makeup, and a sleek clutch.",
        male: "wearing a confident, alluring outfit: a fitted black V-neck shirt showing off physique, slim dark jeans, polished Chelsea boots, a statement watch, and styled hair with subtle cologne vibes.",
      },
      swimwear: {
        female: "wearing ONLY a bikini swimsuit — a high-cut two-piece bikini set showing midriff and legs. NO regular clothes, NO pants, NO shirt. Beach setting with sand and ocean. Include a sheer sarong loosely tied at waist, strappy sandals, oversized sunglasses, sun hat, and woven beach tote. Sun-kissed skin, confident beach pose.",
        male: "wearing ONLY swim trunks — fitted board shorts with no shirt on, showing bare chest. Beach setting with sand and ocean. Open linen shirt draped on shoulders (not buttoned), slide sandals, aviator sunglasses, waterproof watch.",
      },
      "urban-hiphop": {
        female: "wearing urban hip-hop style: oversized graphic jersey, baggy low-rise jeans, chunky platform sneakers, layered gold chains, hoop earrings, and a designer belt bag.",
        male: "wearing urban hip-hop style: oversized designer tee or jersey, baggy distressed jeans, fresh high-top sneakers, heavy gold chains, a fitted cap, and a crossbody designer bag.",
      },
      rugged: {
        female: "wearing rugged workwear: fitted flannel shirt, high-waisted straight-leg jeans, leather ankle boots, a canvas belt, and minimal silver jewelry.",
        male: "wearing rugged workwear style: heavy flannel shirt layered over a henley, raw selvedge denim, leather work boots, a thick leather belt, and a field watch.",
      },
      techwear: {
        female: "wearing futuristic techwear: a black waterproof shell jacket, tapered cargo pants with straps, chunky trail running shoes, a tactical chest rig, and matte black accessories.",
        male: "wearing futuristic techwear: a modular black technical jacket, cargo joggers with utility straps, trail running shoes, a tactical sling bag, and all-black accessories.",
      },
      "date-night": {
        female: "wearing a date-night outfit: an elegant midi dress with a subtle slit, pointed-toe heels, delicate pendant necklace, a small clutch purse, and soft romantic makeup.",
        male: "wearing a date-night outfit: a slim-fit dark blazer over a crew-neck tee, tailored dark trousers, clean leather dress shoes, a sleek watch, and fresh cologne-ready grooming.",
      },
      lingerie: {
        female: "wearing ONLY lingerie — a delicate lace bralette and matching lace briefs/thong, NO regular clothes, NO pants, NO shirt over it. Include a sheer silk robe draped open (not covering the lingerie), satin mule slippers, dainty gold body chain jewelry. Boudoir setting with soft warm lighting and luxurious velvet/silk backdrop. Elegant and tasteful.",
        male: "wearing ONLY luxury loungewear — fitted silk boxer shorts and an open silk robe showing bare chest, NO regular clothes. Bedroom setting with soft warm lighting and elegant decor. Minimal accessories.",
      },
      y2k: {
        female: "wearing Y2K early-2000s fashion: low-rise flare jeans or a pleated mini skirt, a sparkly butterfly crop top or halter top, platform flip-flops or chunky sneakers, tinted rectangular sunglasses, layered belly chains, a tiny baguette bag, and frosted lip gloss with shimmery eyeshadow.",
        male: "wearing Y2K early-2000s fashion: baggy bootcut jeans with a studded belt, a fitted graphic baby tee or mesh tank, chunky skate shoes, frosted tips or spiky hair, layered chain necklaces, and a trucker hat.",
      },
      cottagecore: {
        female: "wearing cottagecore aesthetic: a flowing floral midi dress with puff sleeves and smocked bodice, a woven straw sun hat, brown leather mary-jane shoes, a wicker basket purse, dainty daisy chain jewelry, and natural dewy makeup with rosy cheeks. Countryside meadow setting with wildflowers.",
        male: "wearing cottagecore aesthetic: a relaxed linen button-up shirt in cream or sage, high-waisted brown corduroy trousers, brown leather boots, a woven straw hat, a canvas crossbody bag, and a simple leather-strap watch. Countryside setting with fields and greenery.",
      },
    };

    const styleDesc = stylePrompts[styleCategory]?.[isMale ? "male" : "female"] || stylePrompts["full-style"][isMale ? "male" : "female"];
    const genderWord = isMale ? "man" : "woman";

    const isMannequin = generationMode === "mannequin";

    // Add Gio's refinement context if available
    const refinementNote = refinementContext
      ? `\n\nIMPORTANT REFINEMENT from stylist: Apply these specific changes to the look: ${refinementContext.slice(0, 800)}`
      : "";

    // Add celebrity style guide if provided
    const celebrityNote = celebrityGuide
      ? `\n\nSTYLE INSPIRATION: Channel the fashion aesthetic and styling sensibility of ${celebrityGuide}. Adapt their signature style elements (color palette, fits, accessories, overall vibe) to this look. Do NOT replicate their face or identity.`
      : "";

    let editPrompt: string;
    let messages: any[];

    if (isMannequin) {
      // Mannequin mode: generate clothes on a mannequin/dress form without a user photo
      editPrompt = `Fashion photo of a ${isMale ? "male" : "female"} ${isMale ? "grey" : "white"} mannequin displaying: ${styleDesc} Clean studio backdrop, soft lighting, realistic fabric textures. High-end lookbook style.${celebrityNote}${refinementNote}`;

      messages = [
        {
          role: "user",
          content: [{ type: "text", text: editPrompt }],
        },
      ];
    } else {
      // On-me mode: restyle the user's photo
      const isRevealing = styleCategory === "swimwear" || styleCategory === "lingerie" || styleCategory === "sexy";
      const keepNote = isRevealing
        ? "Keep the person's face and body shape. COMPLETELY REPLACE all existing clothing with the described outfit. Change the background to match the setting described."
        : "Keep face, body, background. Realistic clothing, warm lighting.";
      editPrompt = photoType === "full-body"
        ? `Restyle this ${genderWord}'s outfit: ${styleDesc} ${keepNote}${celebrityNote}${refinementNote}`
        : `Restyle this ${genderWord}'s look: ${styleDesc} ${keepNote}${celebrityNote}${refinementNote}`;

      messages = [
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
      ];
    }

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
