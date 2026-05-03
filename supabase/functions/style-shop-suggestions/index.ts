import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALLOWED_STORES = {
  luxury: ["Nordstrom", "Bloomingdale's", "Net-a-Porter", "Saks Fifth Avenue"],
  mid: ["ASOS", "Zara", "H&M", "Mango", "Revolve"],
  budget: ["Shein", "Amazon Fashion", "Fashion Nova"],
};

// Cosplay routes to costume-specific retailers across all tiers.
const COSPLAY_STORES = {
  luxury: ["EZCosplay", "Miccostumes", "CosplayShopper"],
  mid: ["Hot Topic", "Spirit Halloween", "EZCosplay"],
  budget: ["Party City", "Amazon Fashion", "Spirit Halloween"],
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
    const stores = isCosplay ? COSPLAY_STORES : ALLOWED_STORES;

    const occasionLine = styleSubcategory
      ? `OCCASION/SUB-STYLE: "${styleSubcategory.replace(/-/g, " ")}" — ALL items MUST be appropriate for this exact occasion. If the sub-style implies a specific garment (dress, gown, suit, swimsuit, costume piece, etc.), the hero piece MUST be that garment.`
      : "";

    const hotspotLine = hotspot
      ? `FOCUS AREA: "${hotspot}" — only suggest items relevant to this category (e.g. "shoes" → only footwear, "top" → only tops/jackets, "accessories" → only accessories/wigs/props for cosplay).`
      : "";

    const cosplayLine = isCosplay
      ? `COSPLAY MODE: This is a costume look. Suggest costume pieces, wigs, props, accessories, and themed makeup/body paint. Use costume retailers only. Items should be original, fan-inspired descriptions — never use copyrighted character names; describe by aesthetic (e.g. "Orange martial-arts gi", "Sailor-style schoolgirl uniform with red bow", "Green pointed-ear elf tunic").`
      : "";

    const excludeLine = excludeItems && Array.isArray(excludeItems) && excludeItems.length > 0
      ? `EXCLUDE — do NOT suggest any of these already-shown items (pick something visually different): ${excludeItems.slice(0, 10).map((s: string) => `"${s}"`).join(", ")}`
      : "";

    const swapLine = swapOnly
      ? `SWAP MODE: Return EXACTLY ONE alternative item for the focus area that complements the rest of the look but is visibly different from the excluded items.`
      : `Return 4-6 items that together form a complete, polished look (hero piece + complementary pieces + shoes + 1-2 accessories).`;

    const systemPrompt = `You are Glosseti's expert shopping curator. Build a cohesive, occasion-appropriate ${genderWord} shopping list across THREE price tiers (luxury, mid, budget).

STRICT RULES:
- Every item MUST match the occasion/sub-style exactly. A prom dress request must NEVER include pants or casual wear.
- For each item return ONE store per tier from these allowed lists ONLY:
  · luxury: ${stores.luxury.join(", ")}
  · mid: ${stores.mid.join(", ")}
  · budget: ${stores.budget.join(", ")}
- Vary the retailers across items in the same tier so the user sees a mix.
- Use realistic prices: luxury $150-$2000, mid $40-$200, budget $15-$80. Format as "$120" or "$1,250".

PRODUCT NAME REQUIREMENTS (CRITICAL — these become the search query on each retailer):
- Each "item" string MUST be a fully descriptive product name a shopper could paste into a search bar to find the EXACT piece.
- ALWAYS include: COLOR (specific — e.g. "blush pink", "emerald green", "ivory", not just "pink"), GARMENT TYPE (e.g. "triangle bikini bottom", "satin slip midi dress", "wide-leg linen trousers"), and STYLE/CUT details (e.g. "high-waisted", "off-shoulder", "tie-side", "ribbed", "cropped").
- When relevant, also include MATERIAL/FABRIC (silk, satin, ribbed knit, linen, leather, denim) and PATTERN (floral, gingham, leopard, solid).
- 6 to 14 words per item. Example GOOD: "Blush pink ribbed tie-side bikini bottom high-waisted". Example BAD: "Bikini bottom" / "Pink bikini".
- The "label" field stays short (e.g. "Bikini Bottom", "Heels"). The descriptive text goes in each tier's "item" field.
- ${swapLine}`;

    const userPrompt = `STYLE CATEGORY: ${styleCategory || "full-style"}
LOOK NAME: ${lookName || "(no specific look)"}
${occasionLine}
${hotspotLine}
${cosplayLine}
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
          { role: "user", content: userPrompt },
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

    return new Response(JSON.stringify({ items: parsed.items || [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("style-shop-suggestions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
