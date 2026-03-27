import { useState } from "react";
import { Crown, Check, Sparkles, Zap, X, Star } from "lucide-react";
import { PLANS } from "./types";
import type { SubscriptionTier } from "./types";

interface Props {
  onClose: () => void;
  onUpgrade: (tier: SubscriptionTier, startTrial?: boolean) => void;
  remainingGenerations: number;
  lockedFeature?: string | null;
}

const PaywallScreen = ({ onClose, onUpgrade, remainingGenerations, lockedFeature }: Props) => {
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly" | "yearly">("yearly");

  const tierIcons: Record<string, typeof Crown> = { free: Zap, premium: Crown, pro: Star };

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
              ? `"${lockedFeature}" requires a Premium or Pro plan`
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
          {(["weekly", "monthly", "yearly"] as const).map(cycle => (
            <button key={cycle} onClick={() => setBillingCycle(cycle)} style={{
              flex: 1, padding: "8px 0", borderRadius: 100, border: "none", cursor: "pointer",
              background: billingCycle === cycle
                ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
                : "transparent",
              color: billingCycle === cycle ? "white" : "hsl(var(--glamora-gray))",
              fontSize: 11, fontWeight: 600, fontFamily: "'Jost', sans-serif",
              transition: "all 0.2s",
            }}>
              {cycle === "yearly" ? "Yearly" : cycle === "monthly" ? "Monthly" : "Weekly"}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PLANS.filter(p => p.tier !== "free").map((plan) => {
            const Icon = tierIcons[plan.tier];
            const price = billingCycle === "yearly" && plan.yearlyPrice
              ? plan.yearlyPrice
              : billingCycle === "weekly" && plan.weeklyPrice
                ? plan.weeklyPrice
                : plan.monthlyPrice;
            const periodLabel = billingCycle === "yearly" && plan.yearlyPrice
              ? "yr"
              : billingCycle === "weekly" && plan.weeklyPrice
                ? "wk"
                : "mo";
            const perMonth = billingCycle === "yearly" && plan.yearlyPrice
              ? (plan.yearlyPrice / 12).toFixed(2)
              : null;
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

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `linear-gradient(135deg, hsla(var(--glamora-gold) / 0.15), hsla(var(--glamora-gold-light) / 0.1))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={20} color="hsl(var(--glamora-gold))" />
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "hsl(var(--glamora-char))" }}>{plan.name}</div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--glamora-char))" }}>
                        ${price}
                        <span style={{ fontSize: 12, fontWeight: 400, color: "hsl(var(--glamora-gray))" }}>
                          /{periodLabel}
                        </span>
                      </div>
                      {perMonth && (
                        <div style={{ fontSize: 11, color: "hsl(var(--glamora-gold))" }}>
                          ${perMonth}/mo
                        </div>
                      )}
                    </div>
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
                    onClick={() => onUpgrade(plan.tier as SubscriptionTier, plan.tier === "premium")}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 14, border: "none",
                      cursor: "pointer", fontFamily: "'Jost', sans-serif",
                      fontSize: 14, fontWeight: 700,
                      background: isHighlighted
                        ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
                        : "hsla(var(--glamora-gold) / 0.12)",
                      color: isHighlighted ? "white" : "hsl(var(--glamora-gold))",
                      boxShadow: isHighlighted ? "0 6px 24px hsla(28 40% 52% / 0.3)" : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {plan.tier === "premium" ? "Start 7-Day Free Trial" : "Subscribe Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free tier note */}
        <div style={{
          textAlign: "center", marginTop: 20,
          fontSize: 12, color: "hsl(var(--glamora-gray))",
        }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif",
            fontSize: 13, textDecoration: "underline",
          }}>
            Continue with Free ({remainingGenerations > 0 ? `${remainingGenerations} left this month` : "resets next month"})
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallScreen;
