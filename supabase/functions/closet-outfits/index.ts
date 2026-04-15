const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, gender, count = 3 } = await req.json();

    if (!items || !Array.isArray(items) || items.length < 2) {
      return new Response(
        JSON.stringify({ error: "At least 2 closet items are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const genderLabel = gender === "male" ? "men's" : "women's";
    const itemsList = items.map((i: string, idx: number) => `${idx + 1}. ${i}`).join("\n");

    const prompt = `You are a world-class fashion stylist. A user has the following items in their closet:

${itemsList}

Create exactly ${count} complete outfit combinations using ONLY these items. Each outfit should be for a different occasion.

For ${genderLabel} fashion, consider:
- Color coordination and complementary tones
- Appropriate layering and seasonal styling
- Mix of casual and dressy combinations
- Practical styling tips

Respond in this exact JSON format:
{
  "outfits": [
    {
      "description": "Short outfit name/title",
      "items": ["item 1 from closet", "item 2 from closet"],
      "occasion": "e.g. Casual Friday, Date Night, Weekend Brunch",
      "tips": "One specific styling tip for this outfit"
    }
  ]
}

Only return valid JSON, no extra text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Closet outfit error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate outfits", outfits: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
