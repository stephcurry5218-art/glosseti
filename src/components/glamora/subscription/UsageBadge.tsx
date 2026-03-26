import { Zap, Crown } from "lucide-react";
import type { SubscriptionTier } from "./types";

interface Props {
  tier: SubscriptionTier;
  remaining: number;
  onUpgrade: () => void;
}

const UsageBadge = ({ tier, remaining, onUpgrade }: Props) => {
  if (tier !== "free") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 12px", borderRadius: 100,
        background: "linear-gradient(135deg, hsla(var(--glamora-gold) / 0.15), hsla(var(--glamora-gold-light) / 0.1))",
        border: "1px solid hsla(var(--glamora-gold) / 0.2)",
        fontSize: 11, fontWeight: 600, color: "hsl(var(--glamora-gold))",
      }}>
        <Crown size={12} /> {tier === "pro" ? "Pro" : "Premium"}
      </div>
    );
  }

  return (
    <button onClick={onUpgrade} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 12px", borderRadius: 100,
      background: remaining <= 1
        ? "hsla(var(--destructive) / 0.12)"
        : "hsla(var(--glamora-gold) / 0.1)",
      border: `1px solid ${remaining <= 1 ? "hsla(var(--destructive) / 0.2)" : "hsla(var(--glamora-gold) / 0.15)"}`,
      fontSize: 11, fontWeight: 600,
      color: remaining <= 1 ? "hsl(var(--destructive))" : "hsl(var(--glamora-gold))",
      cursor: "pointer", fontFamily: "'Jost', sans-serif",
    }}>
      <Zap size={12} /> {remaining} left today
    </button>
  );
};

export default UsageBadge;
