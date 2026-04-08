/**
 * Apple In-App Purchase integration via cordova-plugin-purchase.
 *
 * Product IDs must match those configured in App Store Connect.
 * Call `initializeIAP()` once at app start.
 */

import type { SubscriptionTier } from "./types";

// These product IDs must be created in App Store Connect
export const IAP_PRODUCT_IDS: Record<Exclude<SubscriptionTier, "free">, {
  weekly?: string;
  monthly: string;
}> = {
  premium: {
    weekly: "com.glosseti.premium.weekly",
    monthly: "com.glosseti.premium.monthly",
  },
};

type BillingCycle = "weekly" | "monthly" | "yearly";

let storeInstance: any = null;
let initialized = false;

/** Returns true if running in a native Capacitor shell */
function isNativePlatform(): boolean {
  return !!(window as any).Capacitor?.isNativePlatform?.();
}

/**
 * Initialize the IAP store. Call once at app start.
 * On web, this is a no-op.
 */
export async function initializeIAP(
  onPurchaseApproved: (tier: SubscriptionTier) => void,
  onPurchaseError: (error: string) => void,
): Promise<void> {
  if (!isNativePlatform()) {
    console.log("[IAP] Not on native platform, skipping IAP init");
    return;
  }

  if (initialized) return;

  try {
    const CdvPurchase = (window as any).CdvPurchase;
    if (!CdvPurchase) {
      console.error("[IAP] CdvPurchase not available on window");
      return;
    }
    const store = CdvPurchase.store;
    storeInstance = store;

    // Register all subscription products
    const products: any[] = [];
    for (const [_tier, ids] of Object.entries(IAP_PRODUCT_IDS)) {
      for (const [, productId] of Object.entries(ids)) {
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

    // Handle approved purchases
    store.when().approved((transaction: any) => {
      // Determine which tier was purchased
      const productId = transaction.products?.[0]?.id || transaction.productId;
      const tier = productIdToTier(productId);
      if (tier) {
        onPurchaseApproved(tier);
      }
      transaction.finish();
    });

    // Handle purchase errors
    store.error((err: any) => {
      if (err.code !== 6777003) { // PAYMENT_CANCELLED
        onPurchaseError(err.message || "Purchase failed");
      }
    });

    await store.initialize([CdvPurchase.Platform?.APPLE_APPSTORE || "ios-appstore"]);
    initialized = true;
    console.log("[IAP] Store initialized successfully");
  } catch (err) {
    console.error("[IAP] Failed to initialize store:", err);
  }
}

/**
 * Initiate a purchase for the given tier and billing cycle.
 * Returns false if we're on web (no native IAP available).
 */
export async function purchaseSubscription(
  tier: Exclude<SubscriptionTier, "free">,
  cycle: BillingCycle = "monthly",
): Promise<boolean> {
  if (!isNativePlatform()) {
    console.warn("[IAP] Cannot purchase on web — native platform required");
    return false;
  }

  const productIds = IAP_PRODUCT_IDS[tier];
  const productId = productIds[cycle] || productIds.monthly;

  if (!productId) {
    console.error("[IAP] No product ID for", tier, cycle);
    return false;
  }

  if (!storeInstance) {
    console.error("[IAP] Store not initialized");
    return false;
  }

  try {
    const offer = storeInstance.get(productId)?.getOffer();
    if (offer) {
      await offer.order();
      return true;
    } else {
      console.error("[IAP] Product not found:", productId);
      return false;
    }
  } catch (err) {
    console.error("[IAP] Purchase error:", err);
    return false;
  }
}

/**
 * Restore previous purchases (e.g. after reinstall).
 */
export async function restorePurchases(): Promise<void> {
  if (!isNativePlatform() || !storeInstance) return;
  await storeInstance.restorePurchases();
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

/** Check if native IAP is available */
export function isIAPAvailable(): boolean {
  return isNativePlatform();
}
