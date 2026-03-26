import { useState, useCallback } from "react";
import type { SubscriptionTier, SubscriptionState } from "./types";
import { MONTHLY_CAPS } from "./types";

const STORAGE_KEY = "glamora_subscription";
const USAGE_KEY = "glamora_monthly_usage";

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function loadUsage(): { count: number; month: string } {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.month === getCurrentMonth()) return parsed;
    }
  } catch {}
  return { count: 0, month: getCurrentMonth() };
}

function saveUsage(count: number) {
  localStorage.setItem(USAGE_KEY, JSON.stringify({ count, month: getCurrentMonth() }));
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
      // Migrate from old daily format or reset if new month
      const usage = loadUsage();
      return {
        ...parsed,
        monthlyGenerations: usage.count,
        maxMonthlyGenerations: MONTHLY_CAPS[parsed.tier as SubscriptionTier] || MONTHLY_CAPS.free,
        billingMonth: usage.month,
      };
    }
  } catch {}
  const usage = loadUsage();
  return {
    tier: "free",
    trialEndsAt: null,
    isTrialing: false,
    monthlyGenerations: usage.count,
    maxMonthlyGenerations: MONTHLY_CAPS.free,
    billingMonth: usage.month,
  };
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(loadSubscription);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string | null>(null);

  const usage = loadUsage();
  const cap = MONTHLY_CAPS[state.tier];

  const canGenerate = usage.count < cap;
  const remainingGenerations = Math.max(0, cap - usage.count);
  const showWatermark = state.tier === "free";

  const recordGeneration = useCallback(() => {
    const u = loadUsage();
    const newCount = u.count + 1;
    saveUsage(newCount);
    setState(prev => ({ ...prev, monthlyGenerations: newCount }));
  }, []);

  const tryGenerate = useCallback((): boolean => {
    const u = loadUsage();
    const tierCap = MONTHLY_CAPS[state.tier];
    if (u.count >= tierCap) {
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
    const newState: SubscriptionState = {
      tier,
      trialEndsAt: startTrial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      isTrialing: startTrial,
      monthlyGenerations: loadUsage().count,
      maxMonthlyGenerations: MONTHLY_CAPS[tier],
      billingMonth: getCurrentMonth(),
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
