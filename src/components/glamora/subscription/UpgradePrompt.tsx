import { useState } from "react";
import { Crown, X } from "lucide-react";
import type { SubscriptionTier } from "./types";
import { purchaseSubscription, isIAPAvailable } from "./iapService";

interface Props {
  feature: string;
  onClose: () => void;
  onUpgrade: (tier: SubscriptionTier) => void;
}

const UpgradePrompt = ({ feature, onClose, onUpgrade }: Props) => {
  const [purchasing, setPurchasing] = useState(false);

  const handleUpgrade = async () => {
    if (!isIAPAvailable()) {
      alert("Subscriptions are available in the Glosseti app. Download from the App Store to subscribe.");
      return;
    }
    setPurchasing(true);
    try {
      await purchaseSubscription("premium", "monthly");
    } finally {
      setPurchasing(false);
    }
  };

  return (
  <div style={{
    position: "fixed", inset: 0, zIndex: 190,
    background: "hsla(0 0% 0% / 0.6)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20, animation: "fadeUp 0.3s ease",
  }}>
    <div style={{
      background: "hsl(var(--card))", borderRadius: 24,
      padding: "28px 24px", maxWidth: 340, width: "100%",
      border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
      boxShadow: "0 20px 60px hsla(0 0% 0% / 0.4)",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", top: 12, right: 12,
        background: "none", border: "none", cursor: "pointer",
      }}>
        <X size={18} color="hsl(var(--glamora-gray))" />
      </button>

      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
          background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 24px hsla(28 40% 52% / 0.3)",
        }}>
          <Crown size={24} color="white" />
        </div>

        <div className="serif" style={{ fontSize: 20, color: "hsl(var(--glamora-char))", marginBottom: 8 }}>
          Premium Feature
        </div>
        <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginBottom: 20, lineHeight: 1.5 }}>
          <strong style={{ color: "hsl(var(--glamora-char))" }}>{feature}</strong> is available with Premium or Pro.
          Upgrade to unlock the full Glamora experience.
        </div>

        <button
          onClick={() => onUpgrade("premium")}
          style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            cursor: "pointer", fontFamily: "'Jost', sans-serif",
            fontSize: 14, fontWeight: 700,
            background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
            color: "white", marginBottom: 10,
            boxShadow: "0 6px 24px hsla(28 40% 52% / 0.3)",
          }}
        >
          Upgrade — $14.99/mo
        </button>

        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif",
          fontSize: 12,
        }}>
          Maybe later
        </button>
      </div>
    </div>
  </div>
);

export default UpgradePrompt;
