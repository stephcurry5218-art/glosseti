// Client-side wrapper for the pexels-photos edge function.
// Caches results per (occasion, gender) in localStorage so users see stable photos.

import { supabase } from "@/integrations/supabase/client";

export type Gender = "female" | "male";
export type OccasionId =
  | "casual" | "glam" | "formal" | "streetwear" | "date-night"
  | "vacation" | "swimwear" | "fitness" | "cosplay";

export interface PexelsPhoto { url: string; alt: string; id: number; }

const CACHE_KEY = "glosseti_pexels_vibes_v1";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

interface CacheShape {
  [key: string]: { ts: number; photos: PexelsPhoto[] };
}

function readCache(): CacheShape {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}
function writeCache(c: CacheShape) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* ignore */ }
}

const inflight = new Map<string, Promise<PexelsPhoto[]>>();

export async function fetchVibePhotos(occasion: OccasionId, gender: Gender): Promise<PexelsPhoto[]> {
  const key = `${gender}:${occasion}`;
  const cache = readCache();
  const hit = cache[key];
  if (hit && Date.now() - hit.ts < TTL_MS && hit.photos?.length >= 12) return hit.photos;

  if (inflight.has(key)) return inflight.get(key)!;

  const p = (async () => {
    const { data, error } = await supabase.functions.invoke("pexels-photos", {
      body: { occasion, gender },
    });
    if (error || !data?.photos?.length) {
      console.warn("[pexels] fetch failed", error);
      return hit?.photos || [];
    }
    const photos = data.photos as PexelsPhoto[];
    const next = readCache();
    next[key] = { ts: Date.now(), photos };
    writeCache(next);
    return photos;
  })();

  inflight.set(key, p);
  try { return await p; } finally { inflight.delete(key); }
}
