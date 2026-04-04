import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionTier, SubscriptionState } from "./types";
import { MONTHLY_CAPS, FREE_DAILY_LIMIT } from "./types";

const STORAGE_KEY = "glamora_subscription";

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getCurrentDayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadTier(): SubscriptionTier {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.tier || "free";
    }
  } catch {}
  return "free";
}

export function useSubscription() {
  const tier = loadTier();
  const [state, setState] = useState<SubscriptionState>({
    tier,
    monthlyGenerations: 0,
    maxMonthlyGenerations: tier === "free" ? FREE_DAILY_LIMIT : MONTHLY_CAPS[tier],
    billingMonth: tier === "free" ? getCurrentDayISO() : getCurrentMonth(),
  });
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [lockedFeature, setLockedFeature] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current usage from the database
  const fetchUsage = useCallback(async (uid: string, currentTier: SubscriptionTier) => {
    let startDate: string;
    if (currentTier === "free") {
      // Free tier: count today's generations
      startDate = getCurrentDayISO() + "T00:00:00.000Z";
    } else {
      // Paid tier: count this month's generations
      startDate = getCurrentMonth() + "-01T00:00:00.000Z";
    }

    const { count, error } = await supabase
      .from("usage_tracking")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uid)
      .gte("created_at", startDate);

    if (!error && count !== null) {
      setUsageCount(count);
      setState(prev => ({ ...prev, monthlyGenerations: count }));
    }
  }, []);

  // Listen for auth state and load usage
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        fetchUsage(uid, state.tier);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        fetchUsage(uid, state.tier);
      }
    });

    return () => subscription.unsubscribe();
  }, [state.tier, fetchUsage]);

  const cap = state.tier === "free" ? FREE_DAILY_LIMIT : MONTHLY_CAPS[state.tier];
  const canGenerate = usageCount < cap;
  const remainingGenerations = Math.max(0, cap - usageCount);
  const showWatermark = state.tier === "free";

  const recordGeneration = useCallback(async () => {
    if (!userId) return;
    const { error } = await supabase
      .from("usage_tracking")
      .insert({ user_id: userId, tier: state.tier });

    if (!error) {
      setUsageCount(prev => prev + 1);
      setState(prev => ({ ...prev, monthlyGenerations: prev.monthlyGenerations + 1 }));
    }
  }, [userId, state.tier]);

  const tryGenerate = useCallback((): boolean => {
    if (!userId) {
      // Not logged in — require auth
      setShowPaywall(true);
      return false;
    }
    if (usageCount >= cap) {
      setShowPaywall(true);
      return false;
    }
    recordGeneration();
    return true;
  }, [userId, usageCount, cap, recordGeneration]);

  const checkFeatureAccess = useCallback((feature: string, requiredTier: SubscriptionTier = "premium"): boolean => {
    const tierLevel = { free: 0, premium: 1, pro: 2 };
    if (tierLevel[state.tier] >= tierLevel[requiredTier]) return true;
    setLockedFeature(feature);
    setShowUpgradePrompt(true);
    return false;
  }, [state.tier]);

  const upgradeTo = useCallback((newTier: SubscriptionTier) => {
    const newState: SubscriptionState = {
      tier: newTier,
      monthlyGenerations: 0,
      maxMonthlyGenerations: newTier === "free" ? FREE_DAILY_LIMIT : MONTHLY_CAPS[newTier],
      billingMonth: newTier === "free" ? getCurrentDayISO() : getCurrentMonth(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tier: newTier }));
    setState(newState);
    setShowPaywall(false);
    setShowUpgradePrompt(false);
    if (userId) {
      fetchUsage(userId, newTier);
    }
  }, [userId, fetchUsage]);

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
