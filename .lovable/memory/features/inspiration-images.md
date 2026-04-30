---
name: Inspiration Images & Favorites
description: Sub-style inspiration grids — 3 unique diverse photos per sub-style, cached per user, with favorite/lightbox support
type: feature
---
- Inspiration grids must not repeat a photo anywhere in the visible selected sub-style list. Makeup/beauty grids must use diverse face/beauty shots for different makeup styles.
- `subStyleImages.ts` holds large diverse Unsplash banks per category (mixed races, gender-matched). `getSubStyleImages(category, subId, gender)` deterministic-hash-picks 3 unique images per sub-style.
- `savedInspiration.ts` localStorage layer:
  - `glamora_inspo_trios_v1` — locks each trio so the user always sees the same images across sessions.
  - `glamora_inspo_favorites_v1` — list of `{ url, category, subId, subLabel, savedAt }`.
  - Dispatches `glamora:inspo-favs-changed` event for in-tab subscribers.
- `InspoThumb.tsx` — thumbnail with corner heart toggle.
- `ImageLightbox.tsx` — full-screen gallery with prev/next, swipe, keyboard, thumbnail strip, favorite button. Receives `category` + `subId` so saves include metadata.
- `SavedLooksScreen.tsx` shows saved inspiration grid (3-col) above saved styles list. Tap to open in lightbox; × to remove.
