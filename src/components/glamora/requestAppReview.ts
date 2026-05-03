// Triggers the native iOS SKStoreReviewRequest (and Android equivalent) via
// @capacitor-community/in-app-review. Safe no-op on web.
export async function requestAppReview(): Promise<void> {
  try {
    const { InAppReview } = await import("@capacitor-community/in-app-review");
    await InAppReview.requestReview();
  } catch (e) {
    // Plugin unavailable (web) or user-cancelled — silently ignore.
    console.debug("[InAppReview] not available:", e);
  }
}

const REVIEW_KEY = "glamora_review_requested";

/** Request a review once after the user's first completed style session. */
export async function maybeRequestFirstSessionReview(): Promise<void> {
  if (localStorage.getItem(REVIEW_KEY)) return;
  localStorage.setItem(REVIEW_KEY, "1");
  // Small delay so the results screen has time to render before the prompt.
  setTimeout(() => { requestAppReview(); }, 1500);
}
