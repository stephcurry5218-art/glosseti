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
        <Crown size={12} /> Premium
      </div>
    );
  }

  // Warning state when only 1 look remains (orange)
  const isWarning = remaining === 1;
  const isEmpty = remaining <= 0;
  const accent = isEmpty
    ? "hsl(var(--destructive))"
    : isWarning
      ? "hsl(28 95% 55%)" // orange warning
      : "hsl(var(--glamora-gold))";
  const bg = isEmpty
    ? "hsla(var(--destructive) / 0.12)"
    : isWarning
      ? "hsla(28 95% 55% / 0.12)"
      : "hsla(var(--glamora-gold) / 0.1)";
  const border = isEmpty
    ? "hsla(var(--destructive) / 0.25)"
    : isWarning
      ? "hsla(28 95% 55% / 0.3)"
      : "hsla(var(--glamora-gold) / 0.15)";

  const label = isEmpty
    ? "0 looks left — upgrade"
    : `${remaining} look${remaining === 1 ? "" : "s"} remaining today`;

  return (
    <button onClick={onUpgrade} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 12px", borderRadius: 100,
      background: bg,
      border: `1px solid ${border}`,
      fontSize: 11, fontWeight: 600,
      color: accent,
      cursor: "pointer", fontFamily: "'Jost', sans-serif",
    }}>
      <Zap size={12} /> {label}
    </button>
  );
};

export default UsageBadge;
