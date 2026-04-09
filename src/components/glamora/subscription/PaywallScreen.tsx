import { useState } from "react";
import { Crown, Check, Zap, X, RotateCcw } from "lucide-react";
import { PLANS } from "./types";
import type { SubscriptionTier } from "./types";
import { purchaseSubscription, restorePurchases, isIAPAvailable } from "./iapService";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onUpgrade: (tier: SubscriptionTier) => void;
  remainingGenerations: number;
  lockedFeature?: string | null;
}

const PaywallScreen = ({ onClose, onUpgrade, remainingGenerations, lockedFeature }: Props) => {
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("weekly");
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    if (!isIAPAvailable()) {
      toast.info("Restore is available in the Glosseti app on iOS.");
      return;
    }
    setRestoring(true);
    try {
      await restorePurchases();
      toast.success("Purchases restored!");
    } catch {
      toast.error("Could not restore purchases");
    } finally {
      setRestoring(false);
    }
  };

  const handlePurchase = async (tier: SubscriptionTier) => {
    if (tier === "free") return;

    if (!isIAPAvailable()) {
      // On web, show message to download the app
      alert("Subscriptions are available in the Glosseti app. Download from the App Store to subscribe.");
      return;
    }

    setPurchasing(true);
    try {
      const success = await purchaseSubscription(tier as Exclude<SubscriptionTier, "free">, billingCycle);
      // If purchase succeeds, the onPurchaseApproved callback in iapService handles the upgrade
      if (!success) {
        console.warn("Purchase was not completed");
      }
    } catch (err) {
      console.error("Purchase error:", err);
    } finally {
      setPurchasing(false);
    }
  };

  const tierIcons: Record<string, typeof Crown> = { free: Zap, premium: Crown };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "hsl(var(--glamora-cream))",
      overflowY: "auto",
      animation: "fadeUp 0.4s ease",
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: "absolute", top: 16, right: 16, zIndex: 10,
        width: 36, height: 36, borderRadius: "50%",
        background: "hsla(var(--glamora-char) / 0.1)",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <X size={18} color="hsl(var(--glamora-char))" />
      </button>

      <div style={{ padding: "60px 20px 40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
            background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px hsla(28 40% 52% / 0.3)",
          }}>
            <Crown size={28} color="white" />
          </div>
          <div className="serif" style={{ fontSize: 26, color: "hsl(var(--glamora-char))", lineHeight: 1.2 }}>
            {lockedFeature ? "Unlock This Feature" : "Upgrade Your Look"}
          </div>
          <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginTop: 8, lineHeight: 1.5 }}>
            {lockedFeature
              ? `"${lockedFeature}" requires a Premium plan`
              : remainingGenerations <= 0
                ? "You've used all your free looks this month"
                : "Get more AI generations and premium features"}
          </div>
        </div>

        {/* Billing toggle */}
        <div style={{
          display: "flex", justifyContent: "center", marginBottom: 24,
          background: "hsla(var(--glamora-char) / 0.05)", borderRadius: 100,
          padding: 3, maxWidth: 260, margin: "0 auto 24px",
        }}>
          {(["weekly", "monthly"] as const).map(cycle => (
            <button key={cycle} onClick={() => setBillingCycle(cycle)} style={{
              flex: 1, padding: "8px 0", borderRadius: 100, border: "none", cursor: "pointer",
              background: billingCycle === cycle
                ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
                : "transparent",
              color: billingCycle === cycle ? "white" : "hsl(var(--glamora-gray))",
              fontSize: 11, fontWeight: 600, fontFamily: "'Jost', sans-serif",
              transition: "all 0.2s",
            }}>
              {cycle === "monthly" ? "Monthly" : "Weekly"}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PLANS.filter(p => p.tier !== "free").map((plan) => {
            const Icon = tierIcons[plan.tier];
            const price = billingCycle === "weekly" && plan.weeklyPrice
              ? plan.weeklyPrice
              : plan.monthlyPrice;
            const periodLabel = billingCycle === "weekly" && plan.weeklyPrice
              ? "wk"
              : "mo";
            const isHighlighted = plan.highlighted;

            return (
              <div key={plan.tier} style={{
                borderRadius: 20, padding: isHighlighted ? "3px" : "0",
                background: isHighlighted
                  ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold-light)))"
                  : "transparent",
              }}>
                <div style={{
                  borderRadius: isHighlighted ? 18 : 20,
                  padding: "20px",
                  background: "hsl(var(--card))",
                  border: isHighlighted ? "none" : "1.5px solid hsla(var(--glamora-gold) / 0.15)",
                  position: "relative",
                }}>
                  {plan.badge && (
                    <div style={{
                      position: "absolute", top: -10, right: 16,
                      padding: "4px 12px", borderRadius: 100,
                      background: isHighlighted
                        ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
                        : "hsla(var(--glamora-gold) / 0.15)",
                      fontSize: 10, fontWeight: 700, color: isHighlighted ? "white" : "hsl(var(--glamora-gold))",
                      textTransform: "uppercase", letterSpacing: 1,
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `linear-gradient(135deg, hsla(var(--glamora-gold) / 0.15), hsla(var(--glamora-gold-light) / 0.1))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={20} color="hsl(var(--glamora-gold))" />
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "hsl(var(--glamora-char))" }}>
                        {billingCycle === "weekly" ? "Glosseti Weekly" : "Glosseti Monthly"}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--glamora-char))" }}>
                        ${price}
                        <span style={{ fontSize: 12, fontWeight: 400, color: "hsl(var(--glamora-gray))" }}>
                          /{periodLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginBottom: 12, paddingLeft: 50 }}>
                    {billingCycle === "weekly"
                      ? `Billed Weekly · $${plan.weeklyPrice}/week`
                      : `Billed Monthly · $${plan.monthlyPrice}/month`}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Check size={14} color="hsl(var(--glamora-success))" />
                        <span style={{ fontSize: 12, color: "hsl(var(--glamora-char2))" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePurchase(plan.tier as SubscriptionTier)}
                    disabled={purchasing}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 14, border: "none",
                      cursor: purchasing ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif",
                      fontSize: 14, fontWeight: 700,
                      opacity: purchasing ? 0.6 : 1,
                      background: isHighlighted
                        ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
                        : "hsla(var(--glamora-gold) / 0.12)",
                      color: isHighlighted ? "white" : "hsl(var(--glamora-gold))",
                      boxShadow: isHighlighted ? "0 6px 24px hsla(28 40% 52% / 0.3)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {purchasing ? "Processing…" : "Subscribe Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free tier */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif",
            fontSize: 13, textDecoration: "underline",
          }}>
            Continue with Free ({remainingGenerations > 0 ? `${remainingGenerations} left this month` : "resets next month"})
          </button>
        </div>

        {/* Restore · Privacy · Terms */}
        <div style={{
          textAlign: "center", marginTop: 20, paddingBottom: 12,
          fontSize: 11, color: "hsl(var(--glamora-gray))", lineHeight: 1.6,
        }}>
          <span>Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.</span>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
            <button
              onClick={handleRestore}
              disabled={restoring}
              style={{
                background: "none", border: "none", cursor: restoring ? "not-allowed" : "pointer",
                color: "hsl(var(--glamora-gold))", fontFamily: "'Jost', sans-serif",
                fontSize: 11, padding: 0, textDecoration: "underline",
                opacity: restoring ? 0.6 : 1,
              }}
            >
              {restoring ? "Restoring…" : "Restore Purchases"}
            </button>
            <span>·</span>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "hsl(var(--glamora-gold))", textDecoration: "underline", cursor: "pointer", fontSize: 11 }}
            >
              Privacy Policy
            </a>
            <span>·</span>
            <a
              href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "hsl(var(--glamora-gold))", textDecoration: "underline", cursor: "pointer", fontSize: 11 }}
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallScreen;
