import { useMemo, useState } from "react";
import { ExternalLink, Crown, Sparkles, Coins, ChevronRight, LayoutGrid, RefreshCw, Store, X } from "lucide-react";
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

const FASHION_NOVA_STORE = "Fashion Nova";

const BEAUTY_RETAILERS = new Set([
  "Sephora", "Ulta", "Charlotte Tilbury", "Pat McGrath", "NARS", "Hourglass",
  "Estée Lauder", "Lancôme", "Bobbi Brown", "Fenty Beauty", "MAC", "Urban Decay",
  "Too Faced", "Tarte", "Benefit", "Rare Beauty", "Glossier", "Milk Makeup",
  "Anastasia Beverly Hills", "e.l.f.", "NYX", "ColourPop", "Morphe", "Clinique",
  "Laura Mercier", "Kosas",
]);

const isBeautyItem = (item: ShopItem): boolean =>
  Object.values(item.stores).some((s) => BEAUTY_RETAILERS.has(s?.store));

const ensureFashionNovaStore = (item: ShopItem): ShopItem => {
  // Skip Fashion Nova injection for beauty/makeup items — keep beauty retailers pure.
  if (isBeautyItem(item)) return item;

  const hasFashionNova = Object.values(item.stores).some((option) => option.store === FASHION_NOVA_STORE);
  if (hasFashionNova) return item;

  const preferred = item.stores.mid || item.stores.budget || item.stores.luxury;
  return {
    ...item,
    stores: {
      ...item.stores,
      budget: {
        store: FASHION_NOVA_STORE,
        item: preferred.item,
        price: item.stores.budget?.price || "$$",
      },
    },
  };
};

// Per-tier extra retailers always offered as quick links so users can compare anywhere.
const EXTRA_RETAILERS_BY_TIER: Record<"luxury" | "mid" | "budget", string[]> = {
  luxury: ["Nordstrom", "Sephora", "Revolve", "Net-a-Porter"],
  mid: ["Fashion Nova", "ASOS", "Zara", "Ulta", "Target"],
  budget: ["Fashion Nova", "Amazon Fashion", "Shein", "Target", "e.l.f."],
};

const ShopPanel = ({ items, accent = "var(--glamora-rose-dark)", onSwapItem, swappingIndex }: Props) => {
  const [activeTier, setActiveTier] = useState<"luxury" | "mid" | "budget">("budget");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [viewAll, setViewAll] = useState(false);
  const [retailerFilters, setRetailerFilters] = useState<Set<string>>(new Set());
  const enrichedItems = useMemo(() => items.map(ensureFashionNovaStore), [items]);

  // Build the union of every retailer that appears across all items + tiers,
  // plus the curated extras for the active tier so Fashion Nova/Target/etc.
  // always appear as toggleable chips even if the AI didn't pick them.
  const availableRetailers = useMemo(() => {
    const set = new Set<string>();
    enrichedItems.forEach((it) => {
      Object.values(it.stores).forEach((s) => s?.store && set.add(s.store));
    });
    EXTRA_RETAILERS_BY_TIER[activeTier].forEach((s) => set.add(s));
    EXTRA_RETAILERS_BY_TIER.luxury.forEach((s) => set.add(s));
    EXTRA_RETAILERS_BY_TIER.mid.forEach((s) => set.add(s));
    EXTRA_RETAILERS_BY_TIER.budget.forEach((s) => set.add(s));
    return Array.from(set).sort((a, b) => {
      // Pin Fashion Nova first, then alphabetical
      if (a === "Fashion Nova") return -1;
      if (b === "Fashion Nova") return 1;
      return a.localeCompare(b);
    });
  }, [enrichedItems, activeTier]);

  const toggleRetailer = (name: string) => {
    setRetailerFilters((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };
  const clearRetailers = () => setRetailerFilters(new Set());

  // If the user has selected retailer filters, only show items whose active-tier
  // store matches one of the selected retailers. Items with no matching tier are hidden.
  const visibleItems = useMemo(() => {
    if (retailerFilters.size === 0) return enrichedItems;
    return enrichedItems.filter((it) =>
      Object.values(it.stores).some((s) => retailerFilters.has(s?.store))
    );
  }, [enrichedItems, retailerFilters]);

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

      {/* Retailer filter chips — toggle which stores to show */}
      <div style={{ marginBottom: 14 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 8,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
            color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif",
          }}>
            <Store size={11} /> Filter by retailer
          </div>
          {retailerFilters.size > 0 && (
            <button
              onClick={clearRetailers}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                display: "flex", alignItems: "center", gap: 3,
                fontSize: 10, fontWeight: 700, color: "hsl(var(--glamora-rose-dark))",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              <X size={11} /> Clear ({retailerFilters.size})
            </button>
          )}
        </div>
        <div style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4,
          WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
        }}>
          {availableRetailers.map((name) => {
            const isFN = name === "Fashion Nova";
            const isActive = retailerFilters.has(name);
            return (
              <button
                key={name}
                onClick={() => toggleRetailer(name)}
                style={{
                  flexShrink: 0,
                  padding: "6px 11px", borderRadius: 999,
                  fontSize: 10, fontWeight: 700,
                  fontFamily: "'Jost', sans-serif",
                  cursor: "pointer", whiteSpace: "nowrap",
                  border: isActive
                    ? `1.5px solid hsl(${isFN ? "340 80% 55%" : "var(--glamora-rose-dark)"})`
                    : isFN
                      ? "1.5px solid hsla(340 80% 55% / 0.45)"
                      : "1px solid hsla(var(--glamora-gray-light) / 0.25)",
                  background: isActive
                    ? `hsla(${isFN ? "340 80% 55%" : "var(--glamora-rose-dark)"} / 0.18)`
                    : isFN
                      ? "linear-gradient(135deg, hsla(340 80% 55% / 0.12), hsla(340 80% 55% / 0.04))"
                      : "hsla(var(--glamora-cream2) / 0.5)",
                  color: isActive
                    ? `hsl(${isFN ? "340 70% 42%" : "var(--glamora-rose-dark)"})`
                    : isFN
                      ? "hsl(340 70% 42%)"
                      : "hsl(var(--glamora-char))",
                  transition: "all 0.15s",
                }}
              >
                {isFN ? "🔥 " : ""}{name}
              </button>
            );
          })}
        </div>
        {retailerFilters.size > 0 && visibleItems.length === 0 && (
          <div style={{
            marginTop: 8, padding: "10px 12px", borderRadius: 8,
            background: "hsla(var(--glamora-cream2) / 0.5)",
            fontSize: 11, color: "hsl(var(--glamora-gray))",
            fontFamily: "'Jost', sans-serif", textAlign: "center",
          }}>
            No items match the selected retailers. Try clearing filters.
          </div>
        )}
      </div>

      {/* Item list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visibleItems.map((item, idx) => {
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                      {item.label}
                    </div>
                    {onSwapItem && (
                      <button
                        onClick={() => onSwapItem(idx)}
                        disabled={swappingIndex === idx}
                        style={{
                          background: "hsla(var(--glamora-rose-dark) / 0.1)",
                          border: "1px solid hsla(var(--glamora-rose-dark) / 0.25)",
                          borderRadius: 8, padding: "4px 9px",
                          display: "flex", alignItems: "center", gap: 4,
                          cursor: swappingIndex === idx ? "wait" : "pointer",
                          color: "hsl(var(--glamora-rose-dark))",
                          fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 700,
                          opacity: swappingIndex === idx ? 0.6 : 1,
                        }}
                      >
                        <RefreshCw size={11} style={{
                          animation: swappingIndex === idx ? "spin 1s linear infinite" : "none",
                        }} /> Swap
                      </button>
                    )}
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

                  {/* Always-on retailer chooser — guarantees Fashion Nova is one of 3 options */}
                  <div style={{
                    padding: "0 16px 12px",
                  }}>
                    <div style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
                      color: "hsl(var(--glamora-gray))", marginBottom: 6,
                      fontFamily: "'Jost', sans-serif",
                    }}>
                      Also shop at
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(() => {
                        const primary = { store: tierData.store, item: tierData.item };
                        const itemIsBeauty = isBeautyItem(item);
                        const chips: { store: string; item: string; key: string; highlight?: boolean }[] = [];

                        // Curated retailer set per context
                        const curated = itemIsBeauty
                          ? ["Sephora", "Ulta", "Fashion Nova", "Target", "Amazon"]
                          : ["Fashion Nova", "Amazon Fashion", "Target", "ASOS", "Shein"];

                        // Always pin Fashion Nova first when available
                        if (primary.store !== "Fashion Nova" && curated.includes("Fashion Nova")) {
                          chips.push({ store: "Fashion Nova", item: tierData.item, key: "fn", highlight: true });
                        }
                        // Add the AI's primary pick
                        chips.push({ ...primary, key: "primary", highlight: primary.store === "Fashion Nova" });
                        // Then layer in curated retailers (skip duplicates / active filters)
                        for (const store of curated) {
                          if (chips.some((c) => c.store === store)) continue;
                          chips.push({ store, item: tierData.item, key: store });
                        }

                        // If user has retailer filters active, only show chips matching the filter
                        const filtered = retailerFilters.size > 0
                          ? chips.filter((c) => retailerFilters.has(c.store))
                          : chips;

                        return filtered.slice(0, 5).map((c) => {

                        return chips.slice(0, 3).map((c) => {
                          const isHL = c.highlight;
                          return (
                            <a
                              key={c.key}
                              href={getShopUrl(c.store, c.item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: 10, fontWeight: 700,
                                padding: "6px 11px", borderRadius: 999,
                                border: isHL
                                  ? "1.5px solid hsla(340 80% 55% / 0.6)"
                                  : "1px solid hsla(var(--glamora-gray-light) / 0.25)",
                                background: isHL
                                  ? "linear-gradient(135deg, hsla(340 80% 55% / 0.18), hsla(340 80% 55% / 0.08))"
                                  : "hsla(var(--glamora-cream2) / 0.5)",
                                color: isHL
                                  ? "hsl(340 70% 42%)"
                                  : "hsl(var(--glamora-char))",
                                textDecoration: "none",
                                display: "inline-flex", alignItems: "center", gap: 4,
                                fontFamily: "'Jost', sans-serif",
                                boxShadow: isHL ? "0 2px 8px hsla(340 80% 55% / 0.25)" : "none",
                              }}
                            >
                              {isHL ? (itemIsBeauty ? "✨ " : "🔥 ") : ""}Shop on {c.store} <ExternalLink size={10} />
                            </a>
                          );
                        });
                      })()}
                    </div>
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
