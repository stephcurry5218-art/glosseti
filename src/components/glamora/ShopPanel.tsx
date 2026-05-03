import { useState } from "react";
import { ExternalLink, Crown, Sparkles, Coins, ChevronRight, LayoutGrid, RefreshCw } from "lucide-react";
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
  /** When provided, each item shows a "Swap" button that calls this with the item's index. */
  onSwapItem?: (index: number) => Promise<void> | void;
  /** Per-index swap loading state. */
  swappingIndex?: number | null;
}

const tiers = [
  { key: "luxury" as const, label: "Luxury", icon: Crown, color: "var(--glamora-gold)", bg: "var(--glamora-gold)" },
  { key: "mid" as const, label: "Mid-Range", icon: Sparkles, color: "var(--glamora-rose-dark)", bg: "var(--glamora-rose)" },
  { key: "budget" as const, label: "Budget", icon: Coins, color: "var(--glamora-success)", bg: "var(--glamora-success)" },
] as const;

const ShopPanel = ({ items, accent = "var(--glamora-rose-dark)", onSwapItem, swappingIndex }: Props) => {
  const [activeTier, setActiveTier] = useState<"luxury" | "mid" | "budget">("mid");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [viewAll, setViewAll] = useState(false);

  if (!items.length) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {/* Tier selector + View All toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {tiers.map((tier) => {
          const isActive = !viewAll && activeTier === tier.key;
          const TierIcon = tier.icon;
          return (
            <button
              key={tier.key}
              onClick={() => { setActiveTier(tier.key); setViewAll(false); }}
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

      {/* View All Stores toggle */}
      <button
        onClick={() => setViewAll(!viewAll)}
        style={{
          width: "100%", padding: "9px 14px", borderRadius: 10, marginBottom: 12,
          border: viewAll ? "1.5px solid hsla(var(--glamora-rose-dark) / 0.3)" : "1.5px solid hsla(var(--glamora-gray-light) / 0.15)",
          background: viewAll ? "hsla(var(--glamora-rose-dark) / 0.08)" : "hsla(var(--glamora-cream2) / 0.5)",
          cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
          color: viewAll ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))",
          transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}
      >
        <LayoutGrid size={14} /> {viewAll ? "Single Tier View" : "View All Stores"}
      </button>

      {/* Item list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, idx) => {
          const tierData = item.stores[activeTier];
          const isExpanded = expandedItem === idx;
          const tierMeta = tiers.find(t => t.key === activeTier)!;

          return (
            <div key={idx} className="glamora-card" style={{
              padding: 0, overflow: "hidden",
              border: viewAll
                ? "1px solid hsla(var(--glamora-gray-light) / 0.15)"
                : `1px solid hsla(${tierMeta.color} / 0.15)`,
            }}>
              {/* View All mode — show all 3 tiers inline */}
              {viewAll ? (
                <div style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 10 }}>
                    {item.label}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                            background: `hsla(${t.bg} / 0.06)`,
                            border: `1px solid hsla(${t.color} / 0.15)`,
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
                </div>
              ) : (
                <>
                  {/* Single tier row — tap to shop directly */}
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
                    {onSwapItem && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onSwapItem(idx); }}
                        disabled={swappingIndex === idx}
                        title="Swap this piece for an alternative"
                        style={{
                          background: "hsla(var(--glamora-rose-dark) / 0.1)",
                          border: "1px solid hsla(var(--glamora-rose-dark) / 0.25)",
                          borderRadius: 8, padding: "5px 9px",
                          display: "flex", alignItems: "center", gap: 4,
                          cursor: swappingIndex === idx ? "wait" : "pointer",
                          color: "hsl(var(--glamora-rose-dark))",
                          fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 700,
                          opacity: swappingIndex === idx ? 0.6 : 1,
                          marginLeft: 2,
                        }}
                      >
                        <RefreshCw size={11} style={{
                          animation: swappingIndex === idx ? "spin 1s linear infinite" : "none",
                        }} />
                        Swap
                      </button>
                    )}
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
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopPanel;
