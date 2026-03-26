import { useState, useCallback } from "react";
import type { SubscriptionTier, SubscriptionState } from "./types";
import { FREE_DAILY_LIMIT } from "./types";

const STORAGE_KEY = "glamora_subscription";
const USAGE_KEY = "glamora_daily_usage";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadUsage(): { count: number; date: string } {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === getToday()) return parsed;
    }
  } catch {}
  return { count: 0, date: getToday() };
}

function saveUsage(count: number) {
  localStorage.setItem(USAGE_KEY, JSON.stringify({ count, date: getToday() }));
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
      return parsed;
    }
  } catch {}
  const usage = loadUsage();
  return {
    tier: "free",
    trialEndsAt: null,
    isTrialing: false,
    dailyGenerations: usage.count,
    maxDailyGenerations: FREE_DAILY_LIMIT,
    lastGenerationDate: usage.date,
  };
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(loadSubscription);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string | null>(null);

  const usage = loadUsage();

  const canGenerate = state.tier !== "free" || usage.count < FREE_DAILY_LIMIT;
  const remainingGenerations = state.tier === "free" ? Math.max(0, FREE_DAILY_LIMIT - usage.count) : Infinity;
  const showWatermark = state.tier === "free";

  const recordGeneration = useCallback(() => {
    const u = loadUsage();
    const newCount = u.count + 1;
    saveUsage(newCount);
    setState(prev => ({ ...prev, dailyGenerations: newCount }));
  }, []);

  const tryGenerate = useCallback((): boolean => {
    if (state.tier !== "free") {
      recordGeneration();
      return true;
    }
    const u = loadUsage();
    if (u.count >= FREE_DAILY_LIMIT) {
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
      dailyGenerations: loadUsage().count,
      maxDailyGenerations: tier === "free" ? FREE_DAILY_LIMIT : Infinity,
      lastGenerationDate: getToday(),
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
