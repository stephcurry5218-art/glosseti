/**
 * Apple In-App Purchase integration via cordova-plugin-purchase v13.
 *
 * Product IDs must match those configured in App Store Connect.
 * Call `initializeIAP()` once at app start.
 *
 * On web (or if the plugin is unavailable), all functions become safe no-ops
 * and `isIAPAvailable()` returns false so the UI can hide / disable purchase
 * buttons instead of leaving the user stuck on "Processing…".
 */

import type { SubscriptionTier } from "./types";

// These product IDs must be created in App Store Connect
export const IAP_PRODUCT_IDS: Record<Exclude<SubscriptionTier, "free">, {
  monthly: string;
}> = {
  premium: {
    monthly: "com.glosseti.premium.monthly",
  },
};

type BillingCycle = "monthly" | "yearly";

let storeInstance: any = null;
let CdvPurchase: any = null;
let initialized = false;
let initializing: Promise<void> | null = null;
let onApprovedCallback: ((tier: SubscriptionTier) => void) | null = null;
let onErrorCallback: ((error: string) => void) | null = null;

/** Returns true if running in a native Capacitor shell */
function isNativePlatform(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

/** Load the cordova-plugin-purchase module. Returns null if unavailable. */
async function loadPurchasePlugin(): Promise<any | null> {
  // Prefer the global injected by Cordova at runtime on the device
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalCdv = (window as any).CdvPurchase;
  if (globalCdv) return globalCdv;

  // The plugin attaches `CdvPurchase` to window when Cordova bootstraps on
  // device. There is no usable ESM export, so we just wait one tick and try
  // the global again in case Cordova hasn't injected it yet.
  await new Promise(resolve => setTimeout(resolve, 100));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).CdvPurchase || null;
}

/**
 * Initialize the IAP store. Call once at app start.
 * On web, this is a no-op.
 */
export async function initializeIAP(
  onPurchaseApproved: (tier: SubscriptionTier) => void,
  onPurchaseError: (error: string) => void,
): Promise<void> {
  onApprovedCallback = onPurchaseApproved;
  onErrorCallback = onPurchaseError;

  if (!isNativePlatform()) {
    console.log("[IAP] Not on native platform, skipping IAP init");
    return;
  }

  if (initialized) return;
  if (initializing) return initializing;

  initializing = (async () => {
    try {
      CdvPurchase = await loadPurchasePlugin();
      if (!CdvPurchase) {
        console.error("[IAP] cordova-plugin-purchase failed to load");
        return;
      }

      const store = CdvPurchase.store;
      if (!store) {
        console.error("[IAP] CdvPurchase.store is undefined");
        return;
      }
      storeInstance = store;

      // Register all subscription products
      const products: any[] = [];
      for (const [, ids] of Object.entries(IAP_PRODUCT_IDS)) {
        for (const productId of Object.values(ids)) {
          if (productId) {
            products.push({
              id: productId,
              type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
              platform: CdvPurchase.Platform.APPLE_APPSTORE,
            });
          }
        }
      }

      store.register(products);

      // Handle approved purchases — verify, then finish
      store.when()
        .approved((transaction: any) => {
          // For non-validated subscriptions we still need to call .verify()
          // (no-op without a validator) before finish() per plugin API.
          try {
            if (typeof transaction.verify === "function") {
              transaction.verify();
            }
          } catch (e) {
            console.warn("[IAP] verify() failed:", e);
          }

          const productId = transaction.products?.[0]?.id || transaction.productId;
          const tier = productIdToTier(productId);
          if (tier && onApprovedCallback) {
            onApprovedCallback(tier);
          }

          try {
            transaction.finish();
          } catch (e) {
            console.warn("[IAP] finish() failed:", e);
          }
        })
        .verified((receipt: any) => {
          // Called after server-side validation (we have none) — finish anyway.
          try { receipt.finish(); } catch { /* noop */ }
        });

      // Handle purchase errors
      store.error((err: any) => {
        // 6777003 = PAYMENT_CANCELLED — silent
        if (err?.code === 6777003 || /cancel/i.test(String(err?.message || ""))) {
          return;
        }
        console.error("[IAP] Store error:", err);
        if (onErrorCallback) {
          onErrorCallback(err?.message || "Purchase failed");
        }
      });

      await store.initialize([
        CdvPurchase.Platform?.APPLE_APPSTORE || "ios-appstore",
      ]);

      initialized = true;
      console.log("[IAP] Store initialized successfully");
    } catch (err) {
      console.error("[IAP] Failed to initialize store:", err);
    } finally {
      initializing = null;
    }
  })();

  return initializing;
}

/**
 * Initiate a purchase for the given tier and billing cycle.
 * Returns false if we're on web (no native IAP available) or the product is missing.
 */
export async function purchaseSubscription(
  tier: Exclude<SubscriptionTier, "free">,
  cycle: BillingCycle = "monthly",
): Promise<boolean> {
  if (!isNativePlatform()) {
    console.warn("[IAP] Cannot purchase on web — native platform required");
    return false;
  }

  // Make sure the store is ready (handles cold-start race)
  if (!initialized && initializing) {
    await initializing;
  }

  if (!storeInstance) {
    if (onErrorCallback) onErrorCallback("Store not ready. Please try again in a moment.");
    return false;
  }

  const productIds = IAP_PRODUCT_IDS[tier];
  const productId = productIds[cycle] || productIds.monthly;

  if (!productId) {
    if (onErrorCallback) onErrorCallback("Subscription option unavailable.");
    return false;
  }

  try {
    const product = storeInstance.get(productId);
    if (!product) {
      if (onErrorCallback) onErrorCallback("Subscription not available. Please try again later.");
      return false;
    }

    const offer = typeof product.getOffer === "function" ? product.getOffer() : product.offers?.[0];
    if (!offer) {
      if (onErrorCallback) onErrorCallback("No purchase offer available.");
      return false;
    }

    const result = await offer.order();
    // order() resolves with an error object on failure (per cdv-purchase v13 API)
    if (result && result.code) {
      // Cancellation — silent
      if (result.code !== 6777003 && !/cancel/i.test(String(result.message || ""))) {
        if (onErrorCallback) onErrorCallback(result.message || "Purchase failed");
      }
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("[IAP] Purchase error:", err);
    if (onErrorCallback) onErrorCallback(err?.message || "Purchase failed");
    return false;
  }
}

/**
 * Restore previous purchases (e.g. after reinstall).
 * Apple requires this to be USER-TRIGGERED only.
 */
export async function restorePurchases(): Promise<void> {
  if (!isNativePlatform()) return;
  if (!initialized && initializing) await initializing;
  if (!storeInstance) {
    if (onErrorCallback) onErrorCallback("Store not ready. Please try again.");
    return;
  }
  try {
    await storeInstance.restorePurchases();
  } catch (err: any) {
    console.error("[IAP] Restore error:", err);
    if (onErrorCallback) onErrorCallback(err?.message || "Restore failed");
  }
}

/** Map a product ID back to its subscription tier */
function productIdToTier(productId: string): SubscriptionTier | null {
  for (const [tier, ids] of Object.entries(IAP_PRODUCT_IDS)) {
    for (const id of Object.values(ids)) {
      if (id === productId) return tier as SubscriptionTier;
    }
  }
  return null;
}

/** Check if native IAP is available (i.e. running on device) */
export function isIAPAvailable(): boolean {
  return isNativePlatform();
}

/** Returns true once the store has finished initializing */
export function isIAPReady(): boolean {
  return initialized && !!storeInstance;
}
