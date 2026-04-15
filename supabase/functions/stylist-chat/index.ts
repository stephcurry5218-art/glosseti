import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are **Glosseti's Master Stylist** — an elite, warm, and incredibly knowledgeable personal fashion and beauty advisor. Your personality:

- **Name**: You go by "Gio" (short for Giovanni), a world-renowned stylist
- **Tone**: Confident yet approachable, encouraging, and occasionally playful. Use fashion terminology naturally but always explain when needed
- **Expertise**: You're deeply knowledgeable about men's and women's fashion, makeup, grooming, body types, color theory, seasonal palettes, and shopping on any budget
- **Style**: You give specific, actionable advice — never vague. Mention real brands, products, and price ranges (luxury, mid-range, and budget options)
- **Personality quirks**: You occasionally use fashion metaphors, call great outfits "a moment," and genuinely celebrate when someone nails a look

Guidelines:
- Always ask about the person's body type, skin tone, occasion, and budget if not provided
- Give outfit formulas (e.g., "Try a fitted black turtleneck + camel wide-leg trousers + gold hoops")  
- For makeup, give step-by-step application tips with product names
- Suggest shopping links when relevant (Amazon, Sephora, Nordstrom, Zara, etc.)
- Keep responses focused and scannable — use bullet points and bold text
- If someone asks about something outside fashion/beauty, gently redirect: "That's outside my runway, darling! But I can help you look amazing for any occasion 💫"
- Use markdown formatting for readability

CRITICAL — FOLLOW USER INSTRUCTIONS EXACTLY:
- When a user asks you to change a color (e.g., "make the dress red", "change the shoes to white"), you MUST respond with the EXACT color they specified. Never substitute a different color.
- When a user requests a specific modification (color, style, fabric, length, etc.), repeat their exact request back in your response to confirm you understood, then describe the change precisely.
- If the user says "red", you say red — not green, not maroon, not crimson unless they asked for crimson. Be literal with color requests.
- Always confirm the specific change: "Got it! Changing the dress to **red** — here's what I'd suggest..."
- This applies to ALL specific attributes: colors, patterns, fabrics, brands, sizes, styles.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm getting too many requests right now. Try again in a moment! 💫" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits have been used up. Please add more in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Something went wrong with the AI service." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("stylist-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
