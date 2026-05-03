// Pexels-backed inspiration photos for the occasion picker.
//
// Two modes:
//   1) {occasion, gender}                        → 12 generic photos for that occasion (legacy, used for fitness/cosplay)
//   2) {queries: [{key,query,ethnicity?}], gender}  → one specific photo per query, deduped across the batch.
//
// Mode 2 is used for the 7 occasions where every vibe label needs an exact visual match
// (swimwear, casual, glam, formal, streetwear, date-night, vacation).

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

const ETHNICITIES = [
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

function pickPortrait(p: PexelsPhoto) {
  return p.src.portrait || p.src.large || p.src.medium;
}

interface QueryReq { key: string; query: string; ethnicity?: string }

async function handleQueryMode(apiKey: string, queries: QueryReq[], gender: Gender, page: number) {
  const noun = GENDER_NOUN[gender] || "person";
  const seen = new Set<number>();
  const out: Record<string, { url: string; alt: string; id: number }> = {};

  // Run searches in parallel but resolve sequentially so dedupe is deterministic.
  const results = await Promise.all(
    queries.map(async (q) => {
      const ethnicity = q.ethnicity ? `${q.ethnicity} ` : "";
      // First attempt: ethnicity + noun + query
      let photos = await searchPexels(apiKey, `${ethnicity}${noun} ${q.query}`, 15, page);
      // Fallback: drop ethnicity tag
      if (photos.length < 3) {
        const more = await searchPexels(apiKey, `${noun} ${q.query}`, 15, page);
        photos = photos.concat(more);
      }
      return { key: q.key, photos };
    })
  );

  for (const { key, photos } of results) {
    let chosen: PexelsPhoto | null = null;
    for (const p of photos) {
      if (!seen.has(p.id)) { chosen = p; break; }
    }
    if (!chosen && photos.length > 0) chosen = photos[0]; // last resort dup
    if (chosen) {
      seen.add(chosen.id);
      out[key] = { url: pickPortrait(chosen), alt: chosen.alt, id: chosen.id };
    }
  }
  return out;
}

async function handleOccasionMode(apiKey: string, occasion: Occasion, gender: Gender, page: number) {
  const baseTerm = OCCASION_TERMS[occasion][gender];
  const noun = GENDER_NOUN[gender];

  const results = await Promise.all(
    ETHNICITIES.map(async (e) => {
      const q = `${e.tag} ${noun} ${baseTerm}`;
      const photos = await searchPexels(apiKey, q, 6, page);
      return { tag: e.tag, want: e.weight, photos };
    })
  );

  const seen = new Set<number>();
  const picked: { url: string; alt: string; id: number }[] = [];

  for (const group of results) {
    let taken = 0;
    for (const p of group.photos) {
      if (taken >= group.want) break;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push({ url: pickPortrait(p), alt: p.alt, id: p.id });
      taken++;
    }
  }

  if (picked.length < 12) {
    const fallback = await searchPexels(apiKey, `${noun} ${baseTerm}`, 30, page);
    for (const p of fallback) {
      if (picked.length >= 12) break;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push({ url: pickPortrait(p), alt: p.alt, id: p.id });
    }
  }

  return picked.slice(0, 12);
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
    const gender = body.gender as Gender;
    if (!GENDER_NOUN[gender]) {
      return new Response(JSON.stringify({ error: "Invalid gender" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const page = Math.max(1, Math.min(20, Number(body.page) || 1));

    // Mode 2: per-vibe queries
    if (Array.isArray(body.queries)) {
      const queries = (body.queries as QueryReq[])
        .filter(q => q && typeof q.key === "string" && typeof q.query === "string")
        .slice(0, 24);
      const photos = await handleQueryMode(PEXELS_API_KEY, queries, gender, page);
      return new Response(JSON.stringify({ photos }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mode 1: occasion only
    const occasion = body.occasion as Occasion;
    if (!OCCASION_TERMS[occasion]) {
      return new Response(JSON.stringify({ error: "Invalid occasion" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const photos = await handleOccasionMode(PEXELS_API_KEY, occasion, gender, page);
    return new Response(JSON.stringify({ photos }), {
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
