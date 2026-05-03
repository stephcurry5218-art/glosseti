// Pexels-backed inspiration photos for the occasion picker.
// Returns 12 diverse, gender-correct, outfit-relevant photos per (occasion, gender).
// Diversity is enforced server-side by combining 4 ethnicity-tagged sub-queries.

import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

interface PexelsPhoto {
  id: number;
  src: { large: string; medium: string; portrait: string; original: string };
  alt: string;
}
interface PexelsResp { photos: PexelsPhoto[]; }

type Gender = "female" | "male";
type Occasion =
  | "casual" | "glam" | "formal" | "streetwear" | "date-night"
  | "vacation" | "swimwear" | "fitness" | "cosplay";

// Per-occasion outfit keyword (kept tight so Pexels returns clothed full-body shots).
const OCCASION_TERMS: Record<Occasion, { female: string; male: string }> = {
  casual:       { female: "casual outfit street fashion",        male: "casual outfit street fashion men" },
  glam:         { female: "evening dress night out fashion",     male: "men suit night out fashion" },
  formal:       { female: "business outfit office fashion",      male: "business suit office fashion men" },
  streetwear:   { female: "streetwear outfit fashion",           male: "streetwear outfit men fashion" },
  "date-night": { female: "date night dress fashion",            male: "smart casual outfit men fashion" },
  vacation:     { female: "vacation outfit summer fashion",      male: "vacation outfit summer fashion men" },
  swimwear:     { female: "swimsuit beach woman",                male: "swim trunks beach man" },
  fitness:      { female: "athleisure gym outfit woman",         male: "gym workout outfit man" },
  cosplay:      { female: "cosplay costume fashion",             male: "cosplay costume men fashion" },
};

// Ethnicity tags rotated for diversity (3 photos per ethnicity → 12 total).
const ETHNICITIES: Array<{ tag: string; weight: number }> = [
  { tag: "black",    weight: 3 },
  { tag: "white",    weight: 3 },
  { tag: "hispanic", weight: 3 },
  { tag: "asian",    weight: 3 },
];

const GENDER_NOUN: Record<Gender, string> = { female: "woman", male: "man" };

async function searchPexels(apiKey: string, query: string, perPage: number, page: number): Promise<PexelsPhoto[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=portrait`;
  const r = await fetch(url, { headers: { Authorization: apiKey } });
  if (!r.ok) {
    console.error(`Pexels ${r.status} for "${query}":`, await r.text().catch(() => ""));
    return [];
  }
  const data = (await r.json()) as PexelsResp;
  return data.photos || [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!PEXELS_API_KEY) {
      return new Response(JSON.stringify({ error: "PEXELS_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const occasion = body.occasion as Occasion;
    const gender = body.gender as Gender;

    if (!OCCASION_TERMS[occasion] || !GENDER_NOUN[gender]) {
      return new Response(JSON.stringify({ error: "Invalid occasion or gender" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseTerm = OCCASION_TERMS[occasion][gender];
    const noun = GENDER_NOUN[gender];

    // Fan out: one search per ethnicity, ask for 6 to give us headroom for dedupe.
    const results = await Promise.all(
      ETHNICITIES.map(async (e) => {
        const q = `${e.tag} ${noun} ${baseTerm}`;
        const photos = await searchPexels(PEXELS_API_KEY, q, 6, 1);
        return { tag: e.tag, want: e.weight, photos };
      })
    );

    const seen = new Set<number>();
    const picked: { url: string; alt: string; id: number }[] = [];

    // Take up to `want` per ethnicity, deduped by photo id.
    for (const group of results) {
      let taken = 0;
      for (const p of group.photos) {
        if (taken >= group.want) break;
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        picked.push({ url: p.src.portrait || p.src.large || p.src.medium, alt: p.alt, id: p.id });
        taken++;
      }
    }

    // Top-up with a generic search if we under-filled (some ethnicity queries return < 3).
    if (picked.length < 12) {
      const fallback = await searchPexels(PEXELS_API_KEY, `${noun} ${baseTerm}`, 30, 1);
      for (const p of fallback) {
        if (picked.length >= 12) break;
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        picked.push({ url: p.src.portrait || p.src.large || p.src.medium, alt: p.alt, id: p.id });
      }
    }

    return new Response(JSON.stringify({ photos: picked.slice(0, 12) }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("pexels-photos error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
