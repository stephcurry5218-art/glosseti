import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_STORES = {
  luxury: ["Nordstrom", "Bloomingdale's", "Net-a-Porter", "Saks Fifth Avenue", "Revolve", "Fashion Nova"],
  mid: ["ASOS", "Zara", "H&M", "Mango", "Revolve", "Fashion Nova"],
  budget: ["Shein", "Amazon Fashion", "Fashion Nova"],
};

// Beauty / makeup / grooming routes to beauty retailers across all tiers.
// Fashion Nova Beauty is intentionally included so it still pops up.
const BEAUTY_STORES = {
  luxury: ["Sephora", "Charlotte Tilbury", "Pat McGrath", "NARS", "Hourglass", "Estée Lauder", "Lancôme", "Bobbi Brown"],
  mid: ["Ulta", "Fenty Beauty", "MAC", "Urban Decay", "Too Faced", "Tarte", "Benefit", "Rare Beauty", "Glossier", "Milk Makeup", "Anastasia Beverly Hills"],
  budget: ["e.l.f.", "NYX", "ColourPop", "Morphe", "Fashion Nova"],
};

// Cosplay routes to costume-specific retailers across all tiers.
const COSPLAY_STORES = {
  luxury: ["EZCosplay", "Miccostumes", "CosplayShopper"],
  mid: ["Hot Topic", "Spirit Halloween", "EZCosplay"],
  budget: ["Party City", "Amazon Fashion", "Spirit Halloween"],
};

const FASHION_NOVA_STORE = "Fashion Nova";

const forceFashionNovaIntoItems = (items: any[], skip: boolean) => {
  if (!Array.isArray(items) || skip) return Array.isArray(items) ? items : [];

  return items.map((item) => {
    const stores = item?.stores || {};
    const hasFashionNova = Object.values(stores).some((store: any) => store?.store === FASHION_NOVA_STORE);
    if (hasFashionNova) return item;

    const source = stores.mid || stores.budget || stores.luxury || {};
    return {
      ...item,
      stores: {
        ...stores,
        budget: {
          store: FASHION_NOVA_STORE,
          item: source.item || item?.label || "fashion outfit",
          price: stores.budget?.price || "$39",
        },
      },
    };
  });
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { styleCategory, styleSubcategory, lookName, gender, hotspot, refinementContext, excludeItems, swapOnly, styledImageUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isMale = gender === "male";
    const genderWord = isMale ? "men's" : "women's";
    const isCosplay = styleCategory === "cosplay";
    const isBeauty =
      styleCategory === "makeup-only" ||
      styleCategory === "grooming" ||
      hotspot === "makeup";
    const stores = isCosplay ? COSPLAY_STORES : isBeauty ? BEAUTY_STORES : ALLOWED_STORES;

    const occasionLine = styleSubcategory
      ? `OCCASION/SUB-STYLE: "${styleSubcategory.replace(/-/g, " ")}" — ALL items MUST be appropriate for this exact occasion. If the sub-style implies a specific garment (dress, gown, suit, swimsuit, costume piece, etc.), the hero piece MUST be that garment.`
      : "";

    const hotspotLine = hotspot
      ? `FOCUS AREA: "${hotspot}" — only suggest items relevant to this category (e.g. "shoes" → only footwear, "top" → only tops/jackets, "accessories" → only accessories/wigs/props for cosplay, "makeup" → only ${isMale ? "grooming products (beard oil, skincare, hair styling, fragrance)" : "makeup products (foundation, lipstick, blush, eyeshadow palette, mascara, setting spray, brushes, skincare)"}).`
      : "";

    const cosplayLine = isCosplay
      ? `COSPLAY MODE: This is a costume look. Suggest costume pieces, wigs, props, accessories, and themed makeup/body paint. Use costume retailers only. Items should be original, fan-inspired descriptions — never use copyrighted character names; describe by aesthetic (e.g. "Orange martial-arts gi", "Sailor-style schoolgirl uniform with red bow", "Green pointed-ear elf tunic").`
      : "";

    const beautyLine = isBeauty
      ? `BEAUTY MODE: This is a ${isMale ? "grooming" : "makeup"} look. Suggest ONLY ${isMale ? "grooming/skincare/hair products (beard oil, trimmer, pomade, cleanser, moisturizer, fragrance)" : "makeup and beauty products (foundation, concealer, blush, lipstick, eyeshadow palette, mascara, eyeliner, brow gel, setting spray, brushes, skincare prep)"}. NEVER suggest clothing, shoes, or apparel. Use beauty retailers only. Each "item" should name the exact product type plus shade/finish where relevant (e.g. "Rare Beauty Soft Pinch liquid blush in Joy", "Charlotte Tilbury Pillow Talk matte lipstick", "Fenty Pro Filt'r soft matte foundation shade 240").`
      : "";

    const excludeLine = excludeItems && Array.isArray(excludeItems) && excludeItems.length > 0
      ? `EXCLUDE — do NOT suggest any of these already-shown items (pick something visually different): ${excludeItems.slice(0, 10).map((s: string) => `"${s}"`).join(", ")}`
      : "";

    const swapLine = swapOnly
      ? `SWAP MODE: Return EXACTLY ONE alternative item for the focus area that complements the rest of the look but is visibly different from the excluded items.`
      : isBeauty
        ? `Return 5-7 ${isMale ? "grooming" : "makeup"} products that together form a complete ${isMale ? "grooming" : "beauty"} routine for this look (base/skin + color/feature products + finishing).`
        : `Return 4-6 items that together form a complete, polished look (hero piece + complementary pieces + shoes + 1-2 accessories).`;

    const fashionNovaRule = isBeauty
      ? `- Fashion Nova is OPTIONAL for beauty looks (only use it for Fashion Nova Beauty cosmetics in the budget tier).`
      : `- Fashion Nova is REQUIRED for non-cosplay looks: at least one returned tier per item should use Fashion Nova whenever the item is fashion/apparel/shoes/accessories.`;

    const systemPrompt = `You are Glosseti's expert ${isBeauty ? (isMale ? "grooming" : "beauty") : "shopping"} curator. Build a cohesive, occasion-appropriate ${genderWord} ${isBeauty ? (isMale ? "grooming" : "makeup") : ""} shopping list across THREE price tiers (luxury, mid, budget).

STRICT RULES:
- Every item MUST match the occasion/sub-style exactly. A prom dress request must NEVER include pants or casual wear.
- For each item return ONE store per tier from these allowed lists ONLY:
  · luxury: ${stores.luxury.join(", ")}
  · mid: ${stores.mid.join(", ")}
  · budget: ${stores.budget.join(", ")}
${fashionNovaRule}
- Vary the retailers across items in the same tier so the user sees a mix.
- Use realistic prices: ${isBeauty ? "luxury $35-$120, mid $18-$45, budget $4-$20" : "luxury $150-$2000, mid $40-$200, budget $15-$80"}. Format as "$120" or "$1,250".

PRODUCT NAME REQUIREMENTS (CRITICAL — these become the search query on each retailer):
- Each "item" string MUST be a fully descriptive product name a shopper could paste into a search bar to find the EXACT piece.
- ${isBeauty
        ? `ALWAYS include: BRAND (when known, e.g. "Charlotte Tilbury", "Fenty Beauty", "Rare Beauty"), PRODUCT TYPE (e.g. "matte lipstick", "liquid blush", "setting spray", "beard oil"), and SHADE/FINISH/SCENT (e.g. "shade 240", "Pillow Talk", "cedarwood").`
        : `ALWAYS include: COLOR (specific — e.g. "blush pink", "emerald green", "ivory", not just "pink"), GARMENT TYPE (e.g. "triangle bikini bottom", "satin slip midi dress", "wide-leg linen trousers"), and STYLE/CUT details (e.g. "high-waisted", "off-shoulder", "tie-side", "ribbed", "cropped").`}
- ${isBeauty
        ? `Example GOOD: "Rare Beauty Soft Pinch liquid blush shade Joy". Example BAD: "Blush" / "Pink blush".`
        : `When relevant, also include MATERIAL/FABRIC (silk, satin, ribbed knit, linen, leather, denim) and PATTERN (floral, gingham, leopard, solid).
- 6 to 14 words per item. Example GOOD: "Blush pink ribbed tie-side bikini bottom high-waisted". Example BAD: "Bikini bottom" / "Pink bikini".`}
- The "label" field stays short (e.g. ${isBeauty ? `"Foundation", "Lipstick", "Blush", "Setting Spray"` : `"Bikini Bottom", "Heels"`}). The descriptive text goes in each tier's "item" field.
- ${swapLine}`;

    const userPrompt = `STYLE CATEGORY: ${styleCategory || "full-style"}
LOOK NAME: ${lookName || "(no specific look)"}
${occasionLine}
${hotspotLine}
${cosplayLine}
${beautyLine}
${excludeLine}
${refinementContext ? `USER REFINEMENT: ${String(refinementContext).slice(0, 400)}` : ""}

Build the curated shopping list now.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: styledImageUrl
              ? [
                  { type: "text", text: `${userPrompt}\n\nThe attached image is the EXACT styled look the user is shopping. Identify each visible garment's precise color, cut, fabric, and styling details and reflect them verbatim in the "item" search strings.` },
                  { type: "image_url", image_url: { url: styledImageUrl } },
                ]
              : userPrompt,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "shop_list",
            description: "Curated shopping list across 3 tiers",
            parameters: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string", description: "What this piece is, e.g. 'Hero Gown', 'Heels', 'Clutch'" },
                      stores: {
                        type: "object",
                        properties: {
                          luxury: {
                            type: "object",
                            properties: {
                              store: { type: "string", enum: stores.luxury },
                              item: { type: "string" },
                              price: { type: "string" },
                            },
                            required: ["store", "item", "price"],
                          },
                          mid: {
                            type: "object",
                            properties: {
                              store: { type: "string", enum: stores.mid },
                              item: { type: "string" },
                              price: { type: "string" },
                            },
                            required: ["store", "item", "price"],
                          },
                          budget: {
                            type: "object",
                            properties: {
                              store: { type: "string", enum: stores.budget },
                              item: { type: "string" },
                              price: { type: "string" },
                            },
                            required: ["store", "item", "price"],
                          },
                        },
                        required: ["luxury", "mid", "budget"],
                      },
                    },
                    required: ["label", "stores"],
                  },
                },
              },
              required: ["items"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "shop_list" } },
      }),
    });

    if (!aiResp.ok) {
      const status = aiResp.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const parsed = toolCall?.function?.arguments ? JSON.parse(toolCall.function.arguments) : { items: [] };

    return new Response(JSON.stringify({ items: forceFashionNovaIntoItems(parsed.items || [], isCosplay || isBeauty) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("style-shop-suggestions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
