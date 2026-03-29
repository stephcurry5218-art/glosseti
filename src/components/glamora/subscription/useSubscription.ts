import { useState, useCallback } from "react";
import type { SubscriptionTier, SubscriptionState } from "./types";
import { MONTHLY_CAPS, FREE_DAILY_LIMIT, TRIAL_DAYS } from "./types";

const STORAGE_KEY = "glamora_subscription";
const USAGE_KEY = "glamora_monthly_usage";
const DAILY_USAGE_KEY = "glamora_daily_usage";

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getCurrentDay(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/* Monthly usage — for paid tiers */
function loadMonthlyUsage(): { count: number; month: string } {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.month === getCurrentMonth()) return parsed;
    }
  } catch {}
  return { count: 0, month: getCurrentMonth() };
}

function saveMonthlyUsage(count: number) {
  localStorage.setItem(USAGE_KEY, JSON.stringify({ count, month: getCurrentMonth() }));
}

/* Daily usage — for free tier */
function loadDailyUsage(): { count: number; day: string } {
  try {
    const raw = localStorage.getItem(DAILY_USAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.day === getCurrentDay()) return parsed;
    }
  } catch {}
  return { count: 0, day: getCurrentDay() };
}

function saveDailyUsage(count: number) {
  localStorage.setItem(DAILY_USAGE_KEY, JSON.stringify({ count, day: getCurrentDay() }));
}

function getUsageForTier(tier: SubscriptionTier) {
  if (tier === "free") {
    const d = loadDailyUsage();
    return { count: d.count, cap: FREE_DAILY_LIMIT, period: d.day };
  }
  const m = loadMonthlyUsage();
  return { count: m.count, cap: MONTHLY_CAPS[tier], period: m.month };
}

function loadSubscription(): SubscriptionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Check if trial expired
      if (parsed.isTrialing && parsed.trialEndsAt) {
        if (new Date(parsed.trialEndsAt) < new Date()) {
          parsed.tier = "free";
          parsed.isTrialing = false;
          parsed.trialEndsAt = null;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
      }
      const usage = getUsageForTier(parsed.tier as SubscriptionTier);
      return {
        ...parsed,
        monthlyGenerations: usage.count,
        maxMonthlyGenerations: usage.cap,
        billingMonth: usage.period,
      };
    }
  } catch {}
  const usage = getUsageForTier("free");
  return {
    tier: "free",
    trialEndsAt: null,
    isTrialing: false,
    monthlyGenerations: usage.count,
    maxMonthlyGenerations: usage.cap,
    billingMonth: usage.period,
  };
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(loadSubscription);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string | null>(null);

  const usage = getUsageForTier(state.tier);
  const cap = usage.cap;

  const canGenerate = usage.count < cap;
  const remainingGenerations = Math.max(0, cap - usage.count);
  const showWatermark = state.tier === "free";

  const recordGeneration = useCallback(() => {
    if (state.tier === "free") {
      const d = loadDailyUsage();
      const newCount = d.count + 1;
      saveDailyUsage(newCount);
      setState(prev => ({ ...prev, monthlyGenerations: newCount }));
    } else {
      const m = loadMonthlyUsage();
      const newCount = m.count + 1;
      saveMonthlyUsage(newCount);
      setState(prev => ({ ...prev, monthlyGenerations: newCount }));
    }
  }, [state.tier]);

  const tryGenerate = useCallback((): boolean => {
    const u = getUsageForTier(state.tier);
    if (u.count >= u.cap) {
      setShowPaywall(true);
      return false;
    }
    recordGeneration();
    return true;
  }, [state.tier, recordGeneration]);

  const checkFeatureAccess = useCallback((feature: string, requiredTier: SubscriptionTier = "premium"): boolean => {
    const tierLevel = { free: 0, premium: 1, pro: 2 };
    if (tierLevel[state.tier] >= tierLevel[requiredTier]) return true;
    setLockedFeature(feature);
    setShowUpgradePrompt(true);
    return false;
  }, [state.tier]);

  const upgradeTo = useCallback((tier: SubscriptionTier, startTrial = false) => {
    const usage = getUsageForTier(tier);
    const newState: SubscriptionState = {
      tier,
      trialEndsAt: startTrial ? new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString() : null,
      isTrialing: startTrial,
      monthlyGenerations: usage.count,
      maxMonthlyGenerations: usage.cap,
      billingMonth: usage.period,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    setState(newState);
    setShowPaywall(false);
    setShowUpgradePrompt(false);
  }, []);

  return {
    subscription: state,
    canGenerate,
    remainingGenerations,
    showWatermark,
    showPaywall,
    setShowPaywall,
    showUpgradePrompt,
    setShowUpgradePrompt,
    lockedFeature,
    tryGenerate,
    checkFeatureAccess,
    upgradeTo,
  };
}
