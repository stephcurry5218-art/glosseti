import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionTier, SubscriptionState } from "./types";
import { MONTHLY_CAPS, FREE_DAILY_LIMIT } from "./types";

const STORAGE_KEY = "glamora_subscription";
const ANON_USAGE_KEY = "glamora_anon_usage";

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

/** Anonymous usage stored in localStorage — counts total uses before requiring sign-up */
function loadAnonUsage(): number {
  try {
    const raw = localStorage.getItem(ANON_USAGE_KEY);
    if (raw) return parseInt(raw, 10) || 0;
  } catch {}
  return 0;
}

function saveAnonUsage(count: number) {
  localStorage.setItem(ANON_USAGE_KEY, String(count));
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
  const [anonUsage, setAnonUsage] = useState(loadAnonUsage);
  const [requireAuth, setRequireAuth] = useState(false);

  // Fetch current usage from the database (authenticated users only)
  const fetchUsage = useCallback(async (uid: string, currentTier: SubscriptionTier) => {
    let query = supabase
      .from("usage_tracking")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uid);

    if (currentTier !== "free") {
      // Premium: count this billing month only
      const startDate = getCurrentMonth() + "-01T00:00:00.000Z";
      query = query.gte("created_at", startDate);
    }
    // Free: lifetime count (no date filter)

    const { count, error } = await query;

    if (!error && count !== null) {
      setUsageCount(count);
      setState(prev => ({ ...prev, monthlyGenerations: count }));
    }
  }, []);

  // Listen for auth state and load usage
  useEffect(() => {
    const DEV_EMAILS = ["joejenkins2625@gmail.com"];
    const maybeUnlockDev = (email?: string | null) => {
      if (email && DEV_EMAILS.includes(email.toLowerCase())) {
        try { localStorage.setItem("glamora_dev_mode", "unlocked"); } catch {}
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      maybeUnlockDev(session?.user?.email);
      if (uid) {
        setRequireAuth(false);
        fetchUsage(uid, state.tier);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      maybeUnlockDev(session?.user?.email);
      if (uid) {
        fetchUsage(uid, state.tier);
      } else {
        // Anonymous: use localStorage count
        const anon = loadAnonUsage();
        setAnonUsage(anon);
        setUsageCount(anon);
        setState(prev => ({ ...prev, monthlyGenerations: anon }));
      }
    });

    return () => subscription.unsubscribe();
  }, [state.tier, fetchUsage]);

  // Auto-reset at local midnight: refetch usage for premium tier only.
  // Free tier is now a lifetime trial, so it does NOT reset.
  useEffect(() => {
    if (state.tier === "free") return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 1);
    const ms = next.getTime() - now.getTime();
    const t = setTimeout(() => {
      if (userId) {
        fetchUsage(userId, state.tier);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [userId, state.tier, fetchUsage, usageCount]);

  const isDevMode = () => {
    try { return localStorage.getItem("glamora_dev_mode") === "unlocked"; } catch { return false; }
  };

  const cap = state.tier === "free" ? FREE_DAILY_LIMIT : MONTHLY_CAPS[state.tier];
  const canGenerate = isDevMode() || usageCount < cap;
  const remainingGenerations = isDevMode() ? 999 : Math.max(0, cap - usageCount);
  const showWatermark = state.tier === "free" && !isDevMode();

  const recordGeneration = useCallback(async () => {
    if (userId) {
      // Authenticated: record in database
      const { error } = await supabase
        .from("usage_tracking")
        .insert({ user_id: userId, tier: state.tier });
      if (!error) {
        setUsageCount(prev => prev + 1);
        setState(prev => ({ ...prev, monthlyGenerations: prev.monthlyGenerations + 1 }));
      }
    } else {
      // Anonymous: record in localStorage
      const newCount = anonUsage + 1;
      saveAnonUsage(newCount);
      setAnonUsage(newCount);
      setUsageCount(newCount);
      setState(prev => ({ ...prev, monthlyGenerations: newCount }));
    }
  }, [userId, state.tier, anonUsage]);

  const tryGenerate = useCallback((): boolean => {
    if (isDevMode()) {
      recordGeneration();
      return true;
    }
    if (!userId && anonUsage >= FREE_DAILY_LIMIT) {
      setRequireAuth(true);
      setShowPaywall(true);
      return false;
    }
    if (usageCount >= cap) {
      setShowPaywall(true);
      return false;
    }
    recordGeneration();
    // Free tier: if this generation just consumed the last allowance, show paywall right away
    if (state.tier === "free" && usageCount + 1 >= cap) {
      setTimeout(() => setShowPaywall(true), 600);
    }
    return true;
  }, [userId, anonUsage, usageCount, cap, recordGeneration]);

  const checkFeatureAccess = useCallback((feature: string, requiredTier: SubscriptionTier = "premium"): boolean => {
    const tierLevel = { free: 0, premium: 1 };
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
    isDevMode: isDevMode(),
    showPaywall,
    setShowPaywall,
    showUpgradePrompt,
    setShowUpgradePrompt,
    lockedFeature,
    tryGenerate,
    checkFeatureAccess,
    upgradeTo,
    requireAuth,
    setRequireAuth,
  };
}
