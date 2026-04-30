// localStorage-backed storage for inspiration images:
// 1. Trio cache — locks the picked images for each sub-style so they never change for this user
// 2. Favorites — list of saved inspiration image URLs with metadata

const TRIO_KEY = "glamora_inspo_trios_v2";
const FAVS_KEY = "glamora_inspo_favorites_v1";

export interface SavedInspiration {
  url: string;
  category: string;
  subId: string;
  subLabel: string;
  savedAt: number; // epoch ms
}

// ------- Trio cache -------
type TrioMap = Record<string, string[]>; // key: `${category}:${sub}:${gender}`

function loadTrios(): TrioMap {
  try {
    const raw = localStorage.getItem(TRIO_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTrios(map: TrioMap) {
  try { localStorage.setItem(TRIO_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}

export function getCachedTrio(category: string, subId: string, gender: string): string[] | null {
  const map = loadTrios();
  return map[`${category}:${subId}:${gender}`] || null;
}

export function setCachedTrio(category: string, subId: string, gender: string, images: string[]) {
  const map = loadTrios();
  map[`${category}:${subId}:${gender}`] = images;
  saveTrios(map);
}

// ------- Favorites -------
export function loadFavorites(): SavedInspiration[] {
  try {
    const raw = localStorage.getItem(FAVS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(list: SavedInspiration[]) {
  try { localStorage.setItem(FAVS_KEY, JSON.stringify(list)); } catch { /* ignore */ }
  // Notify subscribers in same tab
  window.dispatchEvent(new CustomEvent("glamora:inspo-favs-changed"));
}

export function isFavorited(url: string): boolean {
  return loadFavorites().some(f => f.url === url);
}

export function toggleFavorite(item: Omit<SavedInspiration, "savedAt">): boolean {
  const list = loadFavorites();
  const idx = list.findIndex(f => f.url === item.url);
  if (idx >= 0) {
    list.splice(idx, 1);
    saveFavorites(list);
    return false;
  }
  list.unshift({ ...item, savedAt: Date.now() });
  saveFavorites(list);
  return true;
}

export function removeFavorite(url: string) {
  const list = loadFavorites().filter(f => f.url !== url);
  saveFavorites(list);
}
