import { useState } from "react";
import { Crown, Check, X, Clock } from "lucide-react";
import type { SubscriptionTier } from "./types";
import { purchaseSubscription, restorePurchases, isIAPAvailable } from "./iapService";
import { useResetCountdown } from "./useResetCountdown";
import { toast } from "sonner";

interface Props {
  onClose: () => void;
  onUpgrade: (tier: SubscriptionTier) => void;
  remainingGenerations: number;
  lockedFeature?: string | null;
}

type Cycle = "weekly" | "monthly";

const PaywallScreen = ({ onClose, remainingGenerations, lockedFeature }: Props) => {
  const [purchasing, setPurchasing] = useState<Cycle | null>(null);
  const [restoring, setRestoring] = useState(false);
  const { long: resetLong } = useResetCountdown();

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

  const handlePurchase = async (cycle: Cycle) => {
    if (!isIAPAvailable()) {
      alert("Subscriptions are available in the Glosseti app. Download from the App Store to subscribe.");
      return;
    }
    setPurchasing(cycle);
    try {
      await purchaseSubscription("premium", cycle);
    } catch (err) {
      console.error("Purchase error:", err);
    } finally {
      setPurchasing(null);
    }
  };

  const PlanCard = ({ cycle, price, period, billingNote, highlighted, badge }: {
    cycle: Cycle; price: number; period: string; billingNote: string;
    highlighted?: boolean; badge?: string;
  }) => (
    <div style={{
      borderRadius: 20, padding: highlighted ? 3 : 0,
      background: highlighted
        ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold-light)))"
        : "transparent",
    }}>
      <div style={{
        borderRadius: highlighted ? 18 : 20,
        padding: 18,
        background: "hsl(var(--card))",
        border: highlighted ? "none" : "1.5px solid hsla(var(--glamora-gold) / 0.18)",
        position: "relative",
      }}>
        {badge && (
          <div style={{
            position: "absolute", top: -10, right: 16,
            padding: "4px 12px", borderRadius: 100,
            background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
            fontSize: 10, fontWeight: 700, color: "white",
            textTransform: "uppercase", letterSpacing: 1,
          }}>
            {badge}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "hsl(var(--glamora-char))" }}>
              {cycle === "weekly" ? "Glosseti Weekly" : "Glosseti Monthly"}
            </div>
            <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>{billingNote}</div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "hsl(var(--glamora-char))" }}>
              ${price}
              <span style={{ fontSize: 12, fontWeight: 400, color: "hsl(var(--glamora-gray))" }}>
                /{period}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => handlePurchase(cycle)}
          disabled={purchasing !== null}
          style={{
            marginTop: 12,
            width: "100%", padding: "13px", borderRadius: 14, border: "none",
            cursor: purchasing ? "not-allowed" : "pointer", fontFamily: "'Jost', sans-serif",
            fontSize: 14, fontWeight: 700,
            opacity: purchasing && purchasing !== cycle ? 0.5 : 1,
            background: highlighted
              ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
              : "hsla(var(--glamora-gold) / 0.12)",
            color: highlighted ? "white" : "hsl(var(--glamora-gold))",
            boxShadow: highlighted ? "0 6px 24px hsla(28 40% 52% / 0.3)" : "none",
            transition: "all 0.2s",
          }}
        >
          {purchasing === cycle ? "Processing…" : highlighted ? "Start Monthly Plan" : "Start Weekly Plan"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "hsl(var(--glamora-cream))",
      overflowY: "auto",
      animation: "slideUpModal 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
    }}>
      <style>{`
        @keyframes slideUpModal {
          from { transform: translateY(100%); opacity: 0.8; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

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
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px",
            background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px hsla(28 40% 52% / 0.3)",
          }}>
            <Crown size={28} color="white" />
          </div>
          <div className="serif" style={{ fontSize: 28, color: "hsl(var(--glamora-char))", lineHeight: 1.15 }}>
            {lockedFeature ? "Unlock This Feature" : "You're on a roll! 👑"}
          </div>
          <div style={{ fontSize: 13.5, color: "hsl(var(--glamora-gray))", marginTop: 8, lineHeight: 1.5, padding: "0 8px" }}>
            {lockedFeature
              ? `"${lockedFeature}" requires Glosseti Premium`
              : "Upgrade to Glosseti Premium for unlimited looks"}
          </div>
        </div>

        {/* Reset countdown banner */}
        {!lockedFeature && (
          <div style={{
            margin: "0 auto 18px", maxWidth: 360,
            padding: "10px 14px", borderRadius: 12,
            background: "hsla(var(--glamora-gold) / 0.08)",
            border: "1px solid hsla(var(--glamora-gold) / 0.18)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            fontSize: 12, color: "hsl(var(--glamora-char2))", textAlign: "center",
          }}>
            <Clock size={13} color="hsl(var(--glamora-gold))" />
            <span>Or wait <strong style={{ color: "hsl(var(--glamora-char))" }}>{resetLong}</strong> for your free looks to reset</span>
          </div>
        )}

        {/* Plan cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 420, margin: "0 auto" }}>
          <PlanCard
            cycle="monthly"
            price={14.99}
            period="mo"
            billingNote="Billed monthly · Cancel anytime"
            highlighted
            badge="Best Value"
          />
          <PlanCard
            cycle="weekly"
            price={4.99}
            period="wk"
            billingNote="Billed weekly · Cancel anytime"
          />
        </div>

        {/* Premium feature list */}
        <div style={{
          maxWidth: 420, margin: "20px auto 0",
          padding: "14px 16px", borderRadius: 14,
          background: "hsla(var(--glamora-gold) / 0.05)",
          border: "1px solid hsla(var(--glamora-gold) / 0.12)",
        }}>
          {[
            "Unlimited AI looks",
            "No watermark on images",
            "Full outfit & makeup tutorials",
            "Shop recommended items",
            "Save & organize looks",
          ].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
              <Check size={14} color="hsl(var(--glamora-success))" />
              <span style={{ fontSize: 12.5, color: "hsl(var(--glamora-char2))" }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Continue free */}
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif",
            fontSize: 13, textDecoration: "underline",
          }}>
            {remainingGenerations > 0
              ? `Continue with Free (${remainingGenerations} left today)`
              : "Continue with Free (resets at midnight)"}
          </button>
        </div>

        {/* Restore · Privacy · Terms */}
        <div style={{
          textAlign: "center", marginTop: 18, paddingBottom: 12,
          fontSize: 11, color: "hsl(var(--glamora-gray))", lineHeight: 1.6,
        }}>
          <span>Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.</span>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
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
            <a href="/privacy" target="_blank" rel="noopener noreferrer"
              style={{ color: "hsl(var(--glamora-gold))", textDecoration: "underline", fontSize: 11 }}>
              Privacy Policy
            </a>
            <span>·</span>
            <a href="/terms" target="_blank" rel="noopener noreferrer"
              style={{ color: "hsl(var(--glamora-gold))", textDecoration: "underline", fontSize: 11 }}>
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallScreen;
