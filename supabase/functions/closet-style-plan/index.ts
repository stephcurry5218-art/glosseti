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
    const { items, gender, days = 7 } = await req.json();

    if (!items || !Array.isArray(items) || items.length < 3) {
      return new Response(
        JSON.stringify({ error: "At least 3 closet items are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cappedDays = Math.min(Math.max(days, 1), 7);
    const genderLabel = gender === "male" ? "men's" : "women's";
    const itemsList = items.map((i: string, idx: number) => `${idx + 1}. ${i}`).join("\n");

    const prompt = `You are an elite personal fashion stylist. A user wants you to plan ${cappedDays} days of outfits using ONLY these items from their closet:

${itemsList}

Create exactly ${cappedDays} unique outfit combinations, one for each day. Each should be distinct — different items, occasions, and moods. For ${genderLabel} fashion.

Guidelines:
- Each outfit must use different item combinations (avoid repeating the same combo)
- Mix casual, smart, and dressier looks across the week
- Consider practical day-of-week styling (e.g., Monday = work-ready, Friday = date night, Weekend = casual)
- Provide specific styling tips for each day

Respond in this exact JSON format:
{
  "outfits": [
    {
      "day": 1,
      "description": "Short outfit name",
      "items": ["item from closet", "another item"],
      "occasion": "e.g. Work Monday, Casual Wednesday, Date Friday",
      "tips": "Specific styling tip"
    }
  ]
}

Only return valid JSON.`;

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
    console.error("Style plan error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate style plan", outfits: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
