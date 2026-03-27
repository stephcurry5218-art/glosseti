import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { gender } = await req.json();

    // Fetch user's style history
    const { data: history } = await supabase
      .from("style_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const historyText = (history && history.length > 0)
      ? history.map((h: any) => {
          let desc = `Category: ${h.style_category}`;
          if (h.style_name) desc += `, Look: ${h.style_name}`;
          if (h.celebrity_inspiration) desc += `, Inspired by: ${h.celebrity_inspiration}`;
          return desc;
        }).join("\n")
      : "No previous style history yet.";

    const systemPrompt = `You are Glosseti's AI style advisor. Based on a user's past style choices, suggest 3 personalized style recommendations they'd love. Be specific and creative.

Return a JSON array with exactly 3 objects, each having:
- "title": catchy style name (3-4 words max)
- "description": one sentence explaining why this suits them
- "category": one of: full-style, streetwear, formal, casual, makeup-only, minimalist, vintage, athleisure, bohemian, preppy, edgy, resort, grooming, sexy, swimwear, urban-hiphop, rugged, techwear, date-night
- "confidence": a percentage (60-99) showing how well this matches their taste
- "reasoning": one short sentence on what pattern you noticed

If they have no history, suggest popular trending styles for their gender.`;

    const userPrompt = `Gender: ${gender || "female"}

Style History:
${historyText}

Generate 3 personalized style suggestions.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_styles",
              description: "Return 3 personalized style suggestions based on user history",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        category: { type: "string" },
                        confidence: { type: "number" },
                        reasoning: { type: "string" },
                      },
                      required: ["title", "description", "category", "confidence", "reasoning"],
                    },
                  },
                },
                required: ["suggestions"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_styles" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let suggestions = [];

    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      suggestions = parsed.suggestions || [];
    }

    return new Response(JSON.stringify({
      suggestions,
      historyCount: history?.length || 0,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("style-suggestions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
