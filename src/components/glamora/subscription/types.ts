export type SubscriptionTier = "free" | "premium" | "pro";

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  trialEndsAt: string | null;
  isTrialing: boolean;
  dailyGenerations: number;
  maxDailyGenerations: number;
  lastGenerationDate: string;
}

export const PLANS: SubscriptionPlan[] = [
  {
    tier: "free",
    name: "Free",
    monthlyPrice: null,
    yearlyPrice: null,
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
    monthlyPrice: 12.99,
    yearlyPrice: 99,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited AI generations",
      "No watermark on images",
      "Advanced personalization",
      "Full makeup & outfit tutorials",
      "Shop recommended items",
      "Save & organize looks",
      "7-day free trial",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    monthlyPrice: 24.99,
    yearlyPrice: null,
    badge: "Creator",
    features: [
      "Everything in Premium",
      "Priority AI processing",
      "Exclusive styles & early access",
      "Creator tools & public sharing",
      "Trend-based recommendations",
    ],
  },
];

export const FREE_DAILY_LIMIT = 3;
