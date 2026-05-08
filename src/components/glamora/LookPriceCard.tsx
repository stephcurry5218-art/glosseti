import { useState } from "react";
import { ShoppingBag, Crown, Sparkles, Coins, ExternalLink, ChevronDown } from "lucide-react";
import { getShopUrl, getGoogleShoppingUrl } from "./affiliateUrls";
import type { Category, PriceTier } from "./lookData";
import { lookData, categoryLabels, categoryOrder } from "./lookData";

interface Props {
  lookName: string;
  onShopAll?: () => void;
}

type TierKey = "luxury" | "mid" | "budget";

const tiers: { key: TierKey; label: string; icon: typeof Crown; color: string; bg: string }[] = [
  { key: "luxury", label: "Luxury", icon: Crown, color: "var(--glamora-gold)", bg: "var(--glamora-gold)" },
  { key: "mid", label: "Mid-Range", icon: Sparkles, color: "var(--glamora-rose-dark)", bg: "var(--glamora-rose)" },
  { key: "budget", label: "Budget", icon: Coins, color: "var(--glamora-success)", bg: "var(--glamora-success)" },
];

const parsePrice = (price: string): number => {
  const cleaned = price.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

const formatPrice = (amount: number): string => {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  return `$${Math.round(amount)}`;
};

const LookPriceCard = ({ lookName }: Props) => {
  const [activeTier, setActiveTier] = useState<TierKey>("budget");
  const [expanded, setExpanded] = useState(false);
  const data = lookData[lookName];
  if (!data) return null;

  // Collect all items with shop data across all categories
  const allItems: { category: Category; title: string; detail: string; shop: Record<PriceTier, { store: string; item: string; price: string }> }[] = [];

  for (const cat of categoryOrder) {
    const steps = data[cat];
    if (!steps) continue;
    for (const step of steps) {
      if (step.shop) {
        allItems.push({ category: cat, title: step.title, detail: step.detail || "", shop: step.shop });
      }
    }
  }

  if (allItems.length === 0) return null;

  // Calculate totals per tier
  const totals: Record<TierKey, number> = { luxury: 0, mid: 0, budget: 0 };
  for (const item of allItems) {
    totals.luxury += parsePrice(item.shop.luxury.price);
    totals.mid += parsePrice(item.shop.mid.price);
    totals.budget += parsePrice(item.shop.budget.price);
  }

  const activeTierMeta = tiers.find(t => t.key === activeTier)!;
  const TierIcon = activeTierMeta.icon;

  const tierColors: Record<TierKey, { h: number; s: number; l: number }> = {
    luxury: { h: 42, s: 90, l: 50 },
    mid: { h: 340, s: 65, l: 55 },
    budget: { h: 145, s: 60, l: 42 },
  };
  const tc = tierColors[activeTier];

  return (
    <div className="glamora-card anim-fadeUp" style={{
      padding: 0, overflow: "hidden", marginBottom: 16,
      border: `2px solid hsla(${tc.h} ${tc.s}% ${tc.l}% / 0.5)`,
      animation: "gold-pulse-glow 3s ease-in-out infinite",
      ["--glow-color" as any]: `hsla(${tc.h}, ${tc.s}%, ${tc.l}%, 0.25)`,
      transition: "border-color 0.4s, --glow-color 0.4s",
    }}>
      {/* Header with total price */}
      <div style={{
        padding: "18px 20px 14px",
        background: `linear-gradient(135deg, hsl(${tc.h} ${tc.s}% ${tc.l}%), hsl(${tc.h - 4} ${tc.s - 5}% ${tc.l - 5}%), hsl(${tc.h + 3} ${tc.s + 5}% ${tc.l + 5}%))`,
        borderBottom: `1px solid hsla(${tc.h} ${tc.s}% ${tc.l + 10}% / 0.4)`,
        position: "relative", overflow: "hidden",
        transition: "background 0.4s",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(105deg, transparent 30%, hsla(0 0% 100% / 0.45) 45%, hsla(0 0% 100% / 0.6) 50%, hsla(0 0% 100% / 0.45) 55%, transparent 70%)",
          backgroundSize: "250% 100%",
          animation: "gold-shimmer 2.5s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, hsla(0 0% 100% / 0.15) 0%, transparent 50%, hsla(0 0% 0% / 0.1) 100%)",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, position: "relative", zIndex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: `linear-gradient(135deg, hsl(${tc.h} ${tc.s + 5}% ${tc.l + 10}%), hsl(${tc.h - 7} ${tc.s}% ${tc.l - 5}%))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 14px hsla(${tc.h} ${tc.s}% ${tc.l}% / 0.4)`,
            border: "1px solid hsla(0 0% 100% / 0.3)",
            transition: "background 0.4s, box-shadow 0.4s",
          }}>
            <ShoppingBag size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", fontFamily: "'Playfair Display', serif", textShadow: "0 1px 2px hsla(0 0% 0% / 0.2)" }}>
              Shop This Look
            </div>
            <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.85)", textShadow: "0 1px 1px hsla(0 0% 0% / 0.15)" }}>
              {allItems.length} items · Complete outfit
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

        {/* Tier selector */}
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

      {/* Item breakdown - collapsed/expanded */}
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
            {allItems.map((item, idx) => {
              const tierData = item.shop[activeTier];
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  <a
                    href={getShopUrl(tierData.store, tierData.item, item.detail)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: "10px 10px 0 0",
                      background: `hsla(${activeTierMeta.bg} / 0.05)`,
                      border: `1px solid hsla(${activeTierMeta.color} / 0.08)`,
                      borderBottom: "none",
                      textDecoration: "none", transition: "all 0.15s", cursor: "pointer",
                    }}
                  >
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: `hsl(${activeTierMeta.color})`, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))" }}>
                        {categoryLabels[item.category]?.label} · {tierData.store}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: `hsl(${activeTierMeta.color})`, whiteSpace: "nowrap" }}>
                      {tierData.price}
                    </div>
                    <ExternalLink size={11} color="hsl(var(--glamora-gray))" />
                  </a>
                  <a
                    href={getGoogleShoppingUrl(tierData.store, tierData.item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      padding: "5px 12px", borderRadius: "0 0 10px 10px",
                      background: `hsla(${activeTierMeta.bg} / 0.03)`,
                      border: `1px solid hsla(${activeTierMeta.color} / 0.08)`,
                      textDecoration: "none", cursor: "pointer",
                      fontSize: 10, fontWeight: 500, color: "hsl(var(--glamora-gray))",
                      fontFamily: "'Jost', sans-serif",
                    }}
                  >
                    🔍 Find exact product on Google Shopping
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LookPriceCard;
