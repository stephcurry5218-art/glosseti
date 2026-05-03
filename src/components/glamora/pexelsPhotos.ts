// Client-side wrapper for the pexels-photos edge function.

import { supabase } from "@/integrations/supabase/client";

export type Gender = "female" | "male";
export type OccasionId =
  | "casual" | "glam" | "formal" | "streetwear" | "date-night"
  | "vacation" | "swimwear" | "fitness" | "cosplay";

export interface PexelsPhoto { url: string; alt: string; id: number; }

const CACHE_KEY = "glosseti_pexels_vibes_v2";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

interface CacheShape {
  [key: string]: { ts: number; data: unknown };
}

function readCache(): CacheShape {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}
function writeCache(c: CacheShape) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* ignore */ }
}

const inflight = new Map<string, Promise<unknown>>();

// ── Mode 1: 12 generic photos per occasion (legacy, used by fitness/cosplay) ──
export async function fetchVibePhotos(occasion: OccasionId, gender: Gender): Promise<PexelsPhoto[]> {
  const key = `${gender}:${occasion}:generic`;
  const cache = readCache();
  const hit = cache[key];
  if (hit && Date.now() - hit.ts < TTL_MS) {
    const photos = hit.data as PexelsPhoto[];
    if (photos?.length >= 12) return photos;
  }
  if (inflight.has(key)) return inflight.get(key)! as Promise<PexelsPhoto[]>;

  const p = (async () => {
    const { data, error } = await supabase.functions.invoke("pexels-photos", {
      body: { occasion, gender },
    });
    if (error || !data?.photos?.length) {
      console.warn("[pexels] fetch failed", error);
      return (hit?.data as PexelsPhoto[]) || [];
    }
    const photos = data.photos as PexelsPhoto[];
    const next = readCache();
    next[key] = { ts: Date.now(), data: photos };
    writeCache(next);
    return photos;
  })();

  inflight.set(key, p);
  try { return await p; } finally { inflight.delete(key); }
}

// ── Mode 2: one specific photo per vibe ──
export interface VibeQuery { id: string; query: string; ethnicity?: string; }

export async function fetchVibePhotosByQuery(
  occasion: OccasionId,
  gender: Gender,
  queries: VibeQuery[],
  page: number = 1,
): Promise<Record<string, string>> {
  const key = `${gender}:${occasion}:perVibe:p${page}`;
  const cache = readCache();
  const hit = cache[key];
  if (hit && Date.now() - hit.ts < TTL_MS) {
    const map = hit.data as Record<string, string>;
    if (map && queries.every(q => map[q.id])) return map;
  }
  if (inflight.has(key)) return inflight.get(key)! as Promise<Record<string, string>>;

  const p = (async () => {
    const { data, error } = await supabase.functions.invoke("pexels-photos", {
      body: {
        gender,
        page,
        queries: queries.map(q => ({ key: q.id, query: q.query, ethnicity: q.ethnicity })),
      },
    });
    if (error || !data?.photos) {
      console.warn("[pexels] per-vibe fetch failed", error);
      return (hit?.data as Record<string, string>) || {};
    }
    const raw = data.photos as Record<string, { url: string }>;
    const map: Record<string, string> = {};
    for (const k in raw) map[k] = raw[k].url;
    const next = readCache();
    next[key] = { ts: Date.now(), data: map };
    writeCache(next);
    return map;
  })();

  inflight.set(key, p);
  try { return await p; } finally { inflight.delete(key); }
}
