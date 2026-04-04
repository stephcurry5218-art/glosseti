import { useState } from "react";
import { ShoppingBag, Crown, Sparkles, Coins, ExternalLink, ChevronDown } from "lucide-react";
import { getShopUrl } from "./affiliateUrls";
import type { ShopItem } from "./ShopPanel";

interface Props {
  items: ShopItem[];
}

type TierKey = "luxury" | "mid" | "budget";

const tiers: { key: TierKey; label: string; icon: typeof Crown; color: string; bg: string }[] = [
  { key: "luxury", label: "Luxury", icon: Crown, color: "var(--glamora-gold)", bg: "var(--glamora-gold)" },
  { key: "mid", label: "Mid-Range", icon: Sparkles, color: "var(--glamora-rose-dark)", bg: "var(--glamora-rose)" },
  { key: "budget", label: "Budget", icon: Coins, color: "var(--glamora-success)", bg: "var(--glamora-success)" },
];

const parsePrice = (price: string): number => {
  // Handle range prices like "$40–80" — take the first number
  const match = price.match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
};

const formatPrice = (amount: number): string => {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  return `$${Math.round(amount)}`;
};

const DynamicPriceCard = ({ items }: Props) => {
  const [activeTier, setActiveTier] = useState<TierKey>("budget");
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return null;

  const totals: Record<TierKey, number> = { luxury: 0, mid: 0, budget: 0 };
  for (const item of items) {
    totals.luxury += parsePrice(item.stores.luxury.price);
    totals.mid += parsePrice(item.stores.mid.price);
    totals.budget += parsePrice(item.stores.budget.price);
  }

  const activeTierMeta = tiers.find(t => t.key === activeTier)!;

  return (
    <div className="glamora-card anim-fadeUp" style={{
      padding: 0, overflow: "hidden", marginBottom: 16,
      border: "2px solid hsla(42 90% 55% / 0.6)",
      animation: "gold-pulse-glow 2.5s ease-in-out infinite",
    }}>
      <div style={{
        padding: "18px 20px 14px",
        background: "linear-gradient(135deg, hsl(42 90% 50%), hsl(38 85% 45%), hsl(45 95% 55%))",
        borderBottom: "1px solid hsla(42 90% 60% / 0.4)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 30%, hsla(0 0% 100% / 0.5) 45%, hsla(0 0% 100% / 0.7) 50%, hsla(0 0% 100% / 0.5) 55%, transparent 70%)",
          backgroundSize: "250% 100%",
          animation: "gold-shimmer 2s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, hsla(0 0% 100% / 0.15) 0%, transparent 50%, hsla(0 0% 0% / 0.1) 100%)",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: "linear-gradient(135deg, hsl(42 95% 60%), hsl(35 90% 45%))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px hsla(42 90% 50% / 0.5)",
            border: "1px solid hsla(0 0% 100% / 0.3)",
          }}>
            <ShoppingBag size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif", textShadow: "0 1px 2px hsla(0 0% 0% / 0.2)" }}>
              Shop This Look
            </div>
            <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.85)", textShadow: "0 1px 1px hsla(0 0% 0% / 0.15)" }}>
              {items.length} items · Complete look
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 24, fontWeight: 800, color: "white",
              lineHeight: 1, fontFamily: "'Jost', sans-serif",
              textShadow: "0 2px 4px hsla(0 0% 0% / 0.2)",
            }}>
              {formatPrice(totals[activeTier])}
            </div>
            <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.8)", textTransform: "uppercase", letterSpacing: 1 }}>
              total
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {tiers.map((tier) => {
            const isActive = activeTier === tier.key;
            const Icon = tier.icon;
            return (
              <button
                key={tier.key}
                onClick={() => setActiveTier(tier.key)}
                style={{
                  flex: 1, padding: "8px 6px", borderRadius: 10,
                  border: isActive ? `1.5px solid hsl(${tier.color})` : "1.5px solid hsla(var(--glamora-gray-light) / 0.15)",
                  background: isActive ? `hsla(${tier.bg} / 0.15)` : "hsla(var(--glamora-cream2) / 0.5)",
                  cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600,
                  color: isActive ? `hsl(${tier.color})` : "hsl(var(--glamora-gray))",
                  transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                }}
              >
                <Icon size={12} /> {formatPrice(totals[tier.key])}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%", padding: "12px 0",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
            color: `hsl(${activeTierMeta.color})`,
          }}
        >
          {expanded ? "Hide" : "View"} Price Breakdown
          <ChevronDown size={14} style={{
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
          }} />
        </button>

        {expanded && (
          <div style={{ paddingBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map((item, idx) => {
              const tierData = item.stores[activeTier];
              return (
                <a
                  key={idx}
                  href={getShopUrl(tierData.store, tierData.item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    background: `hsla(${activeTierMeta.bg} / 0.05)`,
                    border: `1px solid hsla(${activeTierMeta.color} / 0.08)`,
                    textDecoration: "none", transition: "all 0.15s", cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: `hsl(${activeTierMeta.color})`, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))" }}>
                      {tierData.store}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: `hsl(${activeTierMeta.color})`, whiteSpace: "nowrap" }}>
                    {tierData.price}
                  </div>
                  <ExternalLink size={11} color="hsl(var(--glamora-gray))" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPriceCard;
