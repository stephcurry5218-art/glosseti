export type SubscriptionTier = "free" | "premium" | "pro";

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  monthlyPrice: number | null;
  weeklyPrice?: number | null;
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
  premium: 30,
  pro: 75,
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
    yearlyPrice: 99,
    highlighted: true,
    badge: "Most Popular",
    monthlyGenerationCap: 30,
    features: [
      "30 AI generations per month",
      "No watermark on images",
      "Advanced personalization",
      "Full makeup & outfit tutorials",
      "Shop recommended items",
      "Save & organize looks",
      
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    monthlyPrice: 24.99,
    weeklyPrice: null,
    yearlyPrice: null,
    badge: "Creator",
    monthlyGenerationCap: 75,
    features: [
      "75 AI generations per month",
      "Everything in Premium",
      "Priority AI processing",
      "Exclusive styles & early access",
      "Creator tools & public sharing",
      "Trend-based recommendations",
    ],
  },
];
