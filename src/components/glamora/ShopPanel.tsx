import { useState } from "react";
import { ExternalLink, Crown, Sparkles, Coins, ChevronRight } from "lucide-react";
import { getShopUrl } from "./affiliateUrls";

export type ShopItem = {
  label: string;
  stores: {
    luxury: { store: string; item: string; price: string };
    mid: { store: string; item: string; price: string };
    budget: { store: string; item: string; price: string };
  };
};

interface Props {
  items: ShopItem[];
  accent?: string;
}

const tiers = [
  { key: "luxury" as const, label: "Luxury", icon: Crown, color: "var(--glamora-gold)", bg: "var(--glamora-gold)" },
  { key: "mid" as const, label: "Mid-Range", icon: Sparkles, color: "var(--glamora-rose-dark)", bg: "var(--glamora-rose)" },
  { key: "budget" as const, label: "Budget", icon: Coins, color: "var(--glamora-success)", bg: "var(--glamora-success)" },
] as const;

const ShopPanel = ({ items, accent = "var(--glamora-rose-dark)" }: Props) => {
  const [activeTier, setActiveTier] = useState<"luxury" | "mid" | "budget">("mid");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Tier selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {tiers.map((tier) => {
          const isActive = activeTier === tier.key;
          const TierIcon = tier.icon;
          return (
            <button
              key={tier.key}
              onClick={() => setActiveTier(tier.key)}
              style={{
                flex: 1, padding: "10px 6px", borderRadius: 12, border: "1.5px solid",
                borderColor: isActive ? `hsl(${tier.color})` : "hsla(var(--glamora-gray-light) / 0.2)",
                background: isActive ? `hsla(${tier.bg} / 0.12)` : "transparent",
                cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600,
                color: isActive ? `hsl(${tier.color})` : "hsl(var(--glamora-gray))",
                transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}
            >
              <TierIcon size={13} /> {tier.label}
            </button>
          );
        })}
      </div>

      {/* Item list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, idx) => {
          const tierData = item.stores[activeTier];
          const isExpanded = expandedItem === idx;
          const tierMeta = tiers.find(t => t.key === activeTier)!;

          return (
            <div key={idx} className="glamora-card" style={{
              padding: 0, overflow: "hidden",
              border: `1px solid hsla(${tierMeta.color} / 0.15)`,
            }}>
              {/* Main row — tap to shop directly */}
              <div style={{
                width: "100%", padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 12,
                fontFamily: "'Jost', sans-serif", textAlign: "left",
              }}>
                <a
                  href={getShopUrl(tierData.store, tierData.item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1, textDecoration: "none", display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 2 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>
                      {tierData.store} · {tierData.item}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: `hsl(${tierMeta.color})`,
                    marginRight: 4, whiteSpace: "nowrap",
                  }}>
                    {tierData.price}
                  </div>
                  <ExternalLink size={14} color={`hsl(${tierMeta.color})`} />
                </a>
                <button
                  onClick={() => setExpandedItem(isExpanded ? null : idx)}
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 4,
                    display: "flex", alignItems: "center",
                  }}
                >
                  <ChevronRight size={14} color="hsl(var(--glamora-gray))" style={{
                    transition: "transform 0.2s",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0)",
                  }} />
                </button>
              </div>

              {/* Expanded — show all 3 tiers for this item */}
              {isExpanded && (
                <div style={{
                  padding: "0 16px 14px",
                  display: "flex", flexDirection: "column", gap: 8,
                  borderTop: "1px solid hsla(var(--glamora-gray-light) / 0.1)",
                  paddingTop: 12,
                }}>
                  {tiers.map((t) => {
                    const d = item.stores[t.key];
                    const TIcon = t.icon;
                    return (
                      <a
                        key={t.key}
                        href={getShopUrl(d.store, d.item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "10px 12px", borderRadius: 10,
                          background: activeTier === t.key
                            ? `hsla(${t.bg} / 0.08)`
                            : "hsla(var(--glamora-gray-light) / 0.05)",
                          border: activeTier === t.key
                            ? `1px solid hsla(${t.color} / 0.2)`
                            : "1px solid transparent",
                          textDecoration: "none", transition: "all 0.15s",
                          cursor: "pointer",
                        }}
                      >
                        <TIcon size={14} color={`hsl(${t.color})`} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                            {d.store}
                          </div>
                          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", lineHeight: 1.3 }}>
                            {d.item}
                          </div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: `hsl(${t.color})`, marginRight: 4 }}>
                          {d.price}
                        </div>
                        <ExternalLink size={12} color="hsl(var(--glamora-gray))" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopPanel;
