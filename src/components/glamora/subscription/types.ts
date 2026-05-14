export type SubscriptionTier = "free" | "premium";

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  monthlyGenerationCap: number;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  monthlyGenerations: number;
  maxMonthlyGenerations: number;
  billingMonth: string; // YYYY-MM format for paid, YYYY-MM-DD for free (daily)
}

/** Monthly caps for paid tiers */
export const MONTHLY_CAPS: Record<SubscriptionTier, number> = {
  free: 3,   // daily cap (not monthly) — handled separately
  premium: 50,
};

/** Free tier uses a daily limit */
export const FREE_DAILY_LIMIT = 3;


export const PLANS: SubscriptionPlan[] = [
  {
    tier: "free",
    name: "Free",
    monthlyPrice: null,
    yearlyPrice: null,
    monthlyGenerationCap: 3,
    features: [
      "3 AI looks per day",
      "Basic outfit & makeup suggestions",
      "Watermarked images",
      "Limited customization",
    ],
  },
  {
    tier: "premium",
    name: "Premium",
    monthlyPrice: 14.99,
    weeklyPrice: 4.99,
    yearlyPrice: null,
    highlighted: true,
    badge: "Best Value",
    monthlyGenerationCap: 50,
    features: [
      "Unlimited AI looks",
      "No watermark on images",
      "Advanced personalization",
      "Full makeup & outfit tutorials",
      "Shop recommended items",
      "Save & organize looks",
    ],
  },
];
