import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { iconName, imageBase64, photoType, gender, generationMode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Step 1: Extract style profile from the icon name using text model
    const profileResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a fashion and beauty trend analyst. Given a style icon or public figure name, extract ONLY general fashion and beauty trends associated with them. Do NOT describe their face, identity, or anything that could identify them as a person. Focus purely on style elements.

Return a JSON object with these fields:
- "styleName": A creative aesthetic name (e.g., "Luxury Minimal Glam", "Bold Street Luxe"). NEVER include the person's name.
- "clothingTypes": Array of clothing style keywords
- "colorPalette": Array of color descriptions
- "fitPreferences": Array of fit descriptions (e.g., "oversized", "fitted", "layered")
- "accessories": Array of accessory types
- "makeupStyle": Description of makeup/grooming aesthetic
- "hairTrend": Description of general hair styling trend
- "overallVibe": One sentence describing the overall aesthetic
- "detailedPrompt": A detailed fashion styling prompt describing outfit, makeup, hair, and accessories. This should be a complete sentence starting with "wearing" that describes the full look. Do NOT mention any person's name or identity. Focus on describing clothing, colors, fits, textures, accessories, makeup, and hair styling.

Respond ONLY with valid JSON, no markdown.`,
          },
          {
            role: "user",
            content: `Analyze the general fashion and beauty aesthetic associated with: "${iconName}". The user is ${gender === "male" ? "male" : "female"}, so tailor clothing and styling suggestions to ${gender === "male" ? "menswear" : "womenswear"}.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_style_profile",
              description: "Extract a style profile from a style icon",
              parameters: {
                type: "object",
                properties: {
                  styleName: { type: "string", description: "Creative aesthetic name, never include the person's name" },
                  clothingTypes: { type: "array", items: { type: "string" } },
                  colorPalette: { type: "array", items: { type: "string" } },
                  fitPreferences: { type: "array", items: { type: "string" } },
                  accessories: { type: "array", items: { type: "string" } },
                  makeupStyle: { type: "string" },
                  hairTrend: { type: "string" },
                  overallVibe: { type: "string" },
                  detailedPrompt: { type: "string" },
                },
                required: ["styleName", "clothingTypes", "colorPalette", "fitPreferences", "accessories", "makeupStyle", "hairTrend", "overallVibe", "detailedPrompt"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_style_profile" } },
      }),
    });

    if (!profileResponse.ok) {
      if (profileResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (profileResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await profileResponse.text();
      console.error("Profile extraction error:", profileResponse.status, errText);
      throw new Error("Failed to extract style profile");
    }

    const profileData = await profileResponse.json();
    const toolCall = profileData.choices?.[0]?.message?.tool_calls?.[0];
    let styleProfile;
    try {
      styleProfile = JSON.parse(toolCall?.function?.arguments || "{}");
    } catch {
      console.error("Failed to parse style profile:", toolCall);
      throw new Error("Failed to parse style profile");
    }

    console.log("Style profile extracted:", styleProfile.styleName);

    // Step 2: Generate styled image using the extracted profile
    const genderWord = gender === "male" ? "man" : "woman";
    const editPrompt = photoType === "full-body"
      ? `Transform this ${genderWord}'s outfit and overall look. Show them ${styleProfile.detailedPrompt} Keep the person's face, body shape, and background the same. Make the clothing, accessories, hair, and makeup look realistic and well-fitted. Professional fashion photography style with warm lighting. Do NOT make the person look like any specific celebrity or public figure.`
      : `Transform this ${genderWord}'s look. Show them ${styleProfile.detailedPrompt} Keep the person's face shape, features, and background the same. Make everything look realistic and natural. Professional fashion portrait with warm lighting. Do NOT make the person look like any specific celebrity or public figure.`;

    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!imageResponse.ok) {
      if (imageResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (imageResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await imageResponse.text();
      console.error("Image generation error:", imageResponse.status, errText);
      throw new Error("Failed to generate styled image");
    }

    const imageData = await imageResponse.json();
    const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    return new Response(
      JSON.stringify({
        imageUrl: generatedImage || null,
        styleProfile,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("style-inspiration error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
