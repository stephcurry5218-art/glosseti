import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, styleCategory, styleSubcategory, photoType, gender, generationMode, refinementContext, makeupPreference } = await req.json();
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
        female: "in a luxury fashion editorial beach photoshoot, wearing a flattering coordinated two-piece bikini set — a structured bikini top with adjustable straps and matching high-cut bikini bottoms in a rich solid color or elegant print. The bikini top and bottom are clearly visible as separate coordinated pieces. Styled with a sheer sarong tied at the waist, strappy flat sandals, oversized designer sunglasses, gold layered body chains, and a wide-brim straw hat. Beautiful tropical beach resort setting with turquoise water and palm trees. Professional fashion magazine editorial photography, golden-hour lighting, full body shot showing the complete swimwear look.",
        male: "in a professional fashion editorial beach photoshoot, wearing tailored mid-length swim trunks in a bold print or solid color, paired with an open linen camp-collar shirt draped casually over shoulders, leather slide sandals, aviator sunglasses, a waterproof sport watch, and a woven beach tote. Tropical beach resort setting with clear blue water. Professional fashion photography, editorial lighting.",
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
        female: "in a high-end fashion editorial for a luxury sleepwear and loungewear brand. Wearing an elegant lace-trimmed silk camisole set with a matching flowing silk robe, satin house slippers, and delicate gold jewelry. Luxurious bedroom setting with soft warm lighting, silk sheets, and velvet furnishings. Professional fashion photography, tasteful and sophisticated editorial style.",
        male: "in a high-end fashion editorial for a luxury loungewear brand. Wearing premium silk pajama set with an elegant open robe, leather house slippers, and a classic watch. Luxurious bedroom setting with warm ambient lighting and designer furnishings. Professional fashion photography, editorial style.",
      },
      y2k: {
        female: "wearing Y2K early-2000s fashion: low-rise flare jeans or a pleated mini skirt, a sparkly butterfly crop top or halter top, platform flip-flops or chunky sneakers, tinted rectangular sunglasses, layered belly chains, a tiny baguette bag, and frosted lip gloss with shimmery eyeshadow.",
        male: "wearing Y2K early-2000s fashion: baggy bootcut jeans with a studded belt, a fitted graphic baby tee or mesh tank, chunky skate shoes, frosted tips or spiky hair, layered chain necklaces, and a trucker hat.",
      },
      cottagecore: {
        female: "wearing cottagecore aesthetic: a flowing floral midi dress with puff sleeves and smocked bodice, a woven straw sun hat, brown leather mary-jane shoes, a wicker basket purse, dainty daisy chain jewelry, and natural dewy makeup with rosy cheeks. Countryside meadow setting with wildflowers.",
        male: "wearing cottagecore aesthetic: a relaxed linen button-up shirt in cream or sage, high-waisted brown corduroy trousers, brown leather boots, a woven straw hat, a canvas crossbody bag, and a simple leather-strap watch. Countryside setting with fields and greenery.",
      },
      "jewelry-accessories": {
        female: "styled with statement jewelry and accessories: layered gold necklaces, stacked rings including a diamond cocktail ring, a luxury bracelet stack, elegant drop earrings, and a designer watch. Close-up editorial styling with warm, luxurious lighting.",
        male: "styled with premium accessories: a luxury automatic watch, a signet ring, layered chain bracelets, a sleek pendant necklace, and subtle ear studs. Close-up editorial styling with sophisticated lighting.",
      },
      "sunglasses-eyewear": {
        female: "wearing stylish designer sunglasses or eyewear, perfectly framed for her face shape. Paired with a chic outfit that complements the eyewear. Fashion editorial lighting with reflections and details on the frames.",
        male: "wearing premium designer sunglasses or eyewear that suits his face shape perfectly. Paired with a stylish outfit. Fashion editorial lighting highlighting the frame details and lens quality.",
      },
      "hats-headwear": {
        female: "wearing a stylish hat or headpiece that perfectly complements her face shape and outfit. Styled with a coordinated look that elevates the headwear as the hero piece. Fashion editorial lighting.",
        male: "wearing a premium hat or cap that suits his face and style perfectly. Paired with a complementary outfit that makes the headwear the focal point. Fashion editorial lighting.",
      },
      "bags-purses": {
        female: "styled with a stunning designer bag as the focal point — perfectly coordinated with her outfit. The bag is prominently displayed and styled for a fashion editorial. Close-up details showing hardware, texture, and craftsmanship. Premium fashion photography.",
        male: "styled with a premium bag or carry — leather messenger, sleek backpack, or structured briefcase as the hero piece. Coordinated with a sharp outfit. Fashion editorial lighting highlighting bag details and craftsmanship.",
      },
      "shoes-sneakers": {
        female: "wearing stunning designer shoes as the hero piece — perfectly styled with a coordinated outfit that showcases the footwear. Full-body or knee-down editorial shot with dramatic lighting highlighting shoe details, materials, and silhouette. The shoes should be the clear focal point. Premium fashion photography.",
        male: "wearing premium designer shoes or sneakers as the hero piece — perfectly styled with a coordinated outfit that puts the footwear center stage. Full-body or knee-down editorial shot with dramatic lighting highlighting shoe details, construction, and colorway. Premium fashion photography.",
      },
    };

    const styleDesc = stylePrompts[styleCategory]?.[isMale ? "male" : "female"] || stylePrompts["full-style"][isMale ? "male" : "female"];
    const genderWord = isMale ? "man" : "woman";

    const isMannequin = generationMode === "mannequin";

    const normalizeRefinementContext = (input: string) => {
      let normalized = input.slice(0, 800);

      if (styleCategory === "swimwear") {
        normalized = normalized
          .replace(/\bbikini\b/gi, "luxury coordinated two-piece swim set with structured bikini top and matching bikini bottoms")
          .replace(/\btwo-piece\b/gi, "coordinated two-piece bikini set with separate top and bottom pieces")
          .replace(/\bstring bikini\b/gi, "elegant minimal string two-piece swim set")
          .replace(/\bone-piece\b/gi, "sculpted designer one-piece swimsuit")
          .replace(/\bmonokini\b/gi, "designer cut-out one-piece swimsuit")
          .replace(/\bred\b/gi, "rich crimson")
          .replace(/\bnude\b/gi, "warm sand")
          .replace(/\bblack\b/gi, "jet black")
          .replace(/\bwhite\b/gi, "crisp ivory");
      }

      if (styleCategory === "lingerie") {
        normalized = normalized
          .replace(/\blingerie\b/gi, "luxury sleepwear")
          .replace(/\bbra\b/gi, "structured satin top")
          .replace(/\bpanties\b/gi, "matching satin bottoms")
          .replace(/\bred\b/gi, "deep ruby");
      }

      return normalized;
    };

    // Sub-style specific overrides for swimwear
    const swimwearSubStyleOverrides: Record<string, string> = {
      "beach-goddess": "IMPORTANT: Style as a luxurious one-piece swimsuit with plunging neckline OR a high-end matching bikini set. Add gold body chains, a flowing sheer sarong, strappy gold sandals, and oversized sunglasses. Goddess-like beach editorial aesthetic.",
      "sporty-swim": "IMPORTANT: Style as a sporty athletic swimsuit — racerback bikini top or high-neck crop top with matching boyshort or high-waist bottoms. Bold color blocking (neon, cobalt, coral). Sporty sandals and a visor cap. Active beachwear editorial.",
      "tropical-glam": "IMPORTANT: Style as a vibrant tropical-print two-piece bikini set — bold floral or palm print bikini top with matching bikini bottoms. Add a colorful sarong, platform espadrilles, shell jewelry, and a straw tote. Resort editorial style.",
      "two-piece-set": "CRITICAL: This MUST be a clearly visible coordinated two-piece bikini set showing BOTH a separate bikini top AND separate matching bikini bottoms as distinct pieces. The bikini top and bikini bottom must both be clearly visible. Classic triangle or bandeau bikini top with matching high-cut or brazilian-cut bikini bottoms. Solid color or simple elegant pattern. Styled with sandals and sunglasses. Fashion editorial beach photography.",
      "monokini": "IMPORTANT: Style as a designer cut-out one-piece swimsuit with strategic cutouts at the sides or waist, creating a modern sculpted silhouette. Bold solid color. Minimal accessories — just sunglasses and sandals. High-fashion editorial.",
      "swim-with-jewelry": "IMPORTANT: Style as a sleek solid-color two-piece bikini set accessorized with layered waterproof gold chains, body chains draped across the waist, anklets, stacking rings, and statement earrings. The jewelry is the focal point. Beach editorial with golden-hour lighting.",
    };

    const swimwearOverride = (styleCategory === "swimwear" && styleSubcategory && swimwearSubStyleOverrides[styleSubcategory])
      ? `\n\n${swimwearSubStyleOverrides[styleSubcategory]}`
      : "";

    // Add subcategory refinement context
    const subcategoryNote = styleSubcategory
      ? `\n\nSUB-STYLE DIRECTION: Apply a "${styleSubcategory.replace(/-/g, " ")}" aesthetic within the ${styleCategory.replace(/-/g, " ")} category. This should strongly influence the color palette, silhouettes, fabric choices, accessories, and overall mood of the look. Make it distinctly feel like this sub-style.${swimwearOverride}`
      : swimwearOverride;

    // Makeup preference for female users
    const makeupNote = (!isMale && makeupPreference)
      ? makeupPreference === "natural"
        ? "\n\nMAKEUP DIRECTION: Keep the look natural — minimal or no visible makeup. Clean, fresh skin with a barely-there beauty approach. No heavy foundation, bold lipstick, or dramatic eye makeup."
        : "\n\nMAKEUP DIRECTION: Apply full glam makeup — flawless base, sculpted contour, defined brows, lashes, statement lips, and polished beauty styling."
      : "";

    // Add Gio's refinement context if available
    const refinementNote = refinementContext
      ? `\n\nIMPORTANT REFINEMENT from stylist: Apply these specific changes to the look while keeping it tasteful, premium, and editorial: ${normalizeRefinementContext(refinementContext)}`
      : "";


    const requestImage = async (messages: any[]) => {
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
          throw new Error("RATE_LIMITED");
        }
        if (response.status === 402) {
          throw new Error("CREDITS_EXHAUSTED");
        }
        const errText = await response.text();
        console.error("AI gateway error:", response.status, errText);
        throw new Error("GENERATION_FAILED");
      }

      const data = await response.json();
      const firstImage = data.choices?.[0]?.message?.images?.[0];

      return {
        generatedImage: firstImage?.image_url?.url ?? firstImage?.url ?? null,
        textResponse: data.choices?.[0]?.message?.content || "",
      };
    };

    let editPrompt: string;
    let messages: any[];

    if (isMannequin) {
      // Mannequin mode: generate clothes on a mannequin/dress form without a user photo
      editPrompt = `Fashion photo of a ${isMale ? "male" : "female"} ${isMale ? "grey" : "white"} mannequin displaying: ${styleDesc} Clean studio backdrop, soft lighting, realistic fabric textures. High-end lookbook style.${subcategoryNote}${refinementNote}`;

      messages = [
        {
          role: "user",
          content: [{ type: "text", text: editPrompt }],
        },
      ];
    } else {
      // On-me mode: restyle the user's photo
      const isSwimwear = styleCategory === "swimwear";
      const isLingerie = styleCategory === "lingerie";
      const isRevealing = isSwimwear || isLingerie || styleCategory === "sexy";
      const keepNote = isSwimwear
        ? "Keep the person's face and body shape. Restyle their clothing to match the described swimwear and resort fashion. Change the background to a beautiful beach or pool resort setting. Professional fashion editorial style."
        : isLingerie
          ? "Keep the person's face and body shape. Restyle their clothing to match the described luxury sleepwear and loungewear look. Change the background to an elegant bedroom or boudoir setting. Professional fashion editorial style."
          : isRevealing
            ? "Keep the person's face and body shape. Restyle their clothing to match the described outfit. Change the background to match the setting described. Professional fashion editorial style."
            : "Keep face, body, background. Realistic clothing, warm lighting.";
      editPrompt = photoType === "full-body"
        ? `Restyle this ${genderWord}'s outfit: ${styleDesc} ${keepNote}${subcategoryNote}${makeupNote}${refinementNote}`
        : `Restyle this ${genderWord}'s look: ${styleDesc} ${keepNote}${subcategoryNote}${makeupNote}${refinementNote}`;

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

    let { generatedImage, textResponse } = await requestImage(messages);

    if (!generatedImage) {
      const fallbackDescriptions: Record<string, string> = {
        swimwear: isMannequin
          ? `Fashion lookbook image of a ${isMale ? "male" : "female"} mannequin displaying a coordinated two-piece bikini set — a structured bikini top and matching high-cut bikini bottoms in an elegant solid color, styled with a sheer sarong, strappy sandals, and oversized sunglasses. Clean studio-quality editorial image with luxury beach accessories.`
          : `Restyle this ${genderWord} into a luxury swimwear editorial look. Dress them in a flattering coordinated two-piece bikini set with a structured top and matching bottoms, add a sarong, sandals, and beach accessories. Keep the person's identity and body shape. Change background to a beautiful tropical beach resort. Premium magazine photography with golden-hour lighting.`,
        lingerie: isMannequin
          ? `Fashion lookbook image of a ${isMale ? "male" : "female"} mannequin in luxury sleepwear and elegant loungewear, including a satin set and robe. Sophisticated editorial studio lighting.`
          : `Restyle this ${genderWord} into a luxury sleepwear editorial look. Keep the person's identity and body shape, dress them in elegant premium loungewear such as a satin set or silk robe, and make it polished, tasteful, and fashion-forward. Premium editorial photography.`,
        sexy: isMannequin
          ? `Fashion mannequin styled in glamorous eveningwear with a confident silhouette, refined accessories, and polished editorial lighting. Tasteful luxury campaign aesthetic.`
          : `Restyle this ${genderWord} into a glamorous eveningwear editorial look. Keep the person's identity and body shape, use a confident fitted silhouette with refined styling, and keep the result tasteful and high-fashion. Premium editorial photography.`,
      };

      const fallbackPrompt = fallbackDescriptions[styleCategory] || (isMannequin
        ? `High-end fashion mannequin editorial showing ${styleDesc}. Sophisticated styling, realistic fabrics, luxury studio lighting.`
        : `Restyle this ${genderWord} into a polished high-end fashion editorial look inspired by ${styleCategory.replace(/-/g, " ")}. Keep identity and body shape while prioritizing elegant, realistic styling and premium magazine photography.`);

      const fallbackMessages = isMannequin
        ? [{ role: "user", content: [{ type: "text", text: `${fallbackPrompt}${refinementNote}` }] }]
        : [{
            role: "user",
            content: [
              { type: "text", text: `${fallbackPrompt}${refinementNote}` },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          }];

      const fallbackResult = await requestImage(fallbackMessages);
      generatedImage = fallbackResult.generatedImage;
      textResponse = fallbackResult.textResponse;
    }

    if (!generatedImage) {
      return new Response(
        JSON.stringify({ error: "No image could be generated for this look. Please try again." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ imageUrl: generatedImage || null, description: textResponse }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    if (e instanceof Error && e.message === "RATE_LIMITED") {
      return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (e instanceof Error && e.message === "CREDITS_EXHAUSTED") {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.error("generate-styled-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error && e.message === "GENERATION_FAILED" ? "Failed to generate styled image" : e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
