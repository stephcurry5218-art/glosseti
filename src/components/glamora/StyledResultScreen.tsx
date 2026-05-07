import { useState, useRef, useEffect } from "react";
import { maybeRequestFirstSessionReview } from "./requestAppReview";
import { Sparkles, Shirt, Watch, CircleDot, Footprints, Palette, Bookmark, Image, List, Ruler, Diamond, Download, ChevronUp, ChevronDown, ExternalLink, Share2, BookOpen, RefreshCw, AlertTriangle, Camera, Sun, Lightbulb, ShoppingBag, RotateCw } from "lucide-react";
import type { UserPrefs, StyleCategory } from "./GlamoraApp";
import { styleLooks, lookData, categoryOrder, type Category, type PriceTier } from "./lookData";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { getShopUrl, detectStoreFromText } from "./affiliateUrls";
import ShareMenu from "./ShareMenu";
import Watermark from "./subscription/Watermark";
import ShopPanel, { type ShopItem } from "./ShopPanel";
import LookPriceCard from "./LookPriceCard";
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";
import FlowStepper from "./FlowStepper";

interface Props {
  prefs: UserPrefs;
  styledImageUrl: string | null;
  onBack: () => void;
  onHome: () => void;
  onSave: (lookNames: string[]) => void;
  onLookSelect: (name: string) => void;
  onRegenerate?: (tweakedCategory?: StyleCategory) => void;
  onQuickRegenerate?: () => void;
  showWatermark?: boolean;
}

type HotspotId = "top" | "bottom" | "shoes" | "accessories" | "makeup";

/** Parse custom details from styleSubcategory string (format: "catId:subId[detail] + catId2:subId2[detail2]") */
const parseCustomDetails = (styleSubcategory?: string): Record<string, string> => {
  if (!styleSubcategory) return {};
  const details: Record<string, string> = {};
  const parts = styleSubcategory.split(" + ");
  for (const part of parts) {
    const bracketMatch = part.match(/^([^:]+):.*?\[(.+)\]$/);
    if (bracketMatch) {
      details[bracketMatch[1]] = bracketMatch[2];
    }
  }
  return details;
};

/** Map style category IDs to hotspot IDs */
const categoryToHotspot: Record<string, HotspotId> = {
  "shoes-sneakers": "shoes",
  "bags-purses": "accessories",
  "jewelry-accessories": "accessories",
  "sunglasses-eyewear": "accessories",
  "hats-headwear": "accessories",
  "makeup-only": "makeup",
  "celebrity-makeup": "makeup",
  "grooming": "makeup",
  "full-style": "top",
  "streetwear": "top",
  "formal": "top",
  "casual": "top",
  "minimalist": "top",
  "vintage": "top",
  "athleisure": "top",
  "preppy": "top",
  "edgy": "top",
  "techwear": "top",
  "y2k": "top",
  "cottagecore": "top",
  "bohemian": "top",
  "resort": "top",
  "urban-hiphop": "top",
  "rugged": "top",
  "sexy": "top",
  "date-night": "top",
  "swimwear": "top",
  "lingerie": "top",
  "wedding-gowns": "top",
  "tuxedos": "top",
  "fitness": "top",
  "celebrity-hair": "makeup",
};
/** Find the custom detail for a given hotspot by checking all category mappings */
const getCustomDetailForHotspot = (hotspotId: HotspotId, customDetails: Record<string, string>): string | null => {
  for (const [catId, detail] of Object.entries(customDetails)) {
    if (categoryToHotspot[catId] === hotspotId) return detail;
  }
  return null;
};

const getHotspotPositions = (isMale: boolean, customDetails?: Record<string, string>): Record<HotspotId, { top: string; left: string; label: string; Icon: LucideIcon; searchTerm: string }> => {
  // Find custom details relevant to each hotspot
  const getCustomSearchTerm = (hotspotId: HotspotId, fallback: string): string => {
    if (!customDetails) return fallback;
    for (const [catId, detail] of Object.entries(customDetails)) {
      if (categoryToHotspot[catId] === hotspotId) return detail;
    }
    return fallback;
  };

  return {
    makeup: { top: "8%", left: "62%", label: isMale ? "Grooming" : "Makeup", Icon: Palette, searchTerm: getCustomSearchTerm("makeup", isMale ? "men grooming kit skincare" : "makeup kit set") },
    top: { top: "28%", left: "18%", label: "Top", Icon: Shirt, searchTerm: getCustomSearchTerm("top", isMale ? "men shirt top" : "women top blouse") },
    accessories: { top: "22%", left: "78%", label: "Accessories", Icon: Watch, searchTerm: getCustomSearchTerm("accessories", isMale ? "men accessories watch" : "women fashion accessories jewelry") },
    bottom: { top: "58%", left: "22%", label: "Bottoms", Icon: CircleDot, searchTerm: getCustomSearchTerm("bottom", isMale ? "men pants trousers" : "women pants trousers") },
    shoes: { top: "82%", left: "55%", label: "Shoes", Icon: Footprints, searchTerm: getCustomSearchTerm("shoes", isMale ? "men shoes sneakers" : "women shoes heels") },
  };
};

const analysis = {
  bodyType: "Athletic",
  faceShape: "Oval",
  skinTone: "Warm Medium",
  colorSeason: "Warm Autumn",
  features: ["High cheekbones", "Broad shoulders", "Proportional waist"],
};

const openShopLink = (store: string, item: string) => {
  window.open(getShopUrl(store, item), "_blank", "noopener,noreferrer");
};

const handleDownload = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `glosseti-styled-look-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(imageUrl, "_blank");
  }
};

const StyledResultScreen = ({ prefs, styledImageUrl, onBack, onHome, onSave, onLookSelect, onRegenerate, onQuickRegenerate, showWatermark }: Props) => {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [viewMode, setViewMode] = useState<"compare" | "image" | "list">("compare");
  const [showTweaker, setShowTweaker] = useState(false);
  const [tweakedCategory, setTweakedCategory] = useState<StyleCategory>(prefs.styleCategory);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMale = prefs.gender === "male";
  const isMakeup = prefs.styleCategory === "makeup-only";
  const looks = styleLooks[prefs.styleCategory] || styleLooks["full-style"];
  const userCustomDetails = parseCustomDetails(prefs.styleSubcategory);
  const hotspotPositions = getHotspotPositions(isMale, userCustomDetails);

  // AI-curated shop items keyed by `${lookName}|${hotspot}` — fetched on demand
  const [aiShopItems, setAiShopItems] = useState<Record<string, ShopItem[]>>({});
  const [aiShopLoading, setAiShopLoading] = useState<Record<string, boolean>>({});
  const [swappingIndex, setSwappingIndex] = useState<number | null>(null);

  // Back-view preview (e.g. for swimwear, dresses) — generated on demand
  const [backViewUrl, setBackViewUrl] = useState<string | null>(null);
  const [backViewLoading, setBackViewLoading] = useState(false);
  const [backViewError, setBackViewError] = useState<string | null>(null);
  const [showBackView, setShowBackView] = useState(false);

  const generateBackView = async () => {
    if (backViewUrl || backViewLoading || !prefs.photoBase64) return;
    setBackViewLoading(true);
    setBackViewError(null);
    try {
      const localMidnight = new Date(); localMidnight.setHours(0, 0, 0, 0);
      const devMode = (() => { try { return localStorage.getItem("glamora_dev_mode") === "unlocked"; } catch { return false; } })();
      const { data, error } = await supabase.functions.invoke("generate-styled-image", {
        body: {
          imageBase64: prefs.photoBase64,
          styleCategory: prefs.styleCategory,
          styleSubcategory: prefs.styleSubcategory || undefined,
          photoType: prefs.photoType,
          gender: prefs.gender,
          generationMode: prefs.generationMode,
          clientLocalMidnight: localMidnight.toISOString(),
          devMode,
          viewAngle: "back",
        },
      });
      if (error || data?.error || !data?.imageUrl) {
        setBackViewError("Couldn't generate the back view. Try again.");
      } else {
        setBackViewUrl(data.imageUrl);
        setShowBackView(true);
      }
    } catch {
      setBackViewError("Couldn't generate the back view. Try again.");
    } finally {
      setBackViewLoading(false);
    }
  };

  const fetchAiShopItems = async (lookName: string, hotspot: HotspotId) => {
    const key = `${lookName}|${hotspot}`;
    if (aiShopItems[key] || aiShopLoading[key]) return;
    setAiShopLoading(prev => ({ ...prev, [key]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("style-shop-suggestions", {
        body: {
          styleCategory: prefs.styleCategory,
          styleSubcategory: prefs.styleSubcategory,
          lookName,
          gender: prefs.gender,
          hotspot,
          styledImageUrl,
        },
      });
      if (!error && data?.items?.length) {
        setAiShopItems(prev => ({ ...prev, [key]: data.items }));
      }
    } catch (err) {
      console.warn("AI shop suggestions failed, falling back to static lookData", err);
    } finally {
      setAiShopLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const swapShopItem = async (lookName: string, hotspot: HotspotId, index: number, currentItems: ShopItem[]) => {
    const key = `${lookName}|${hotspot}`;
    setSwappingIndex(index);
    try {
      const excludeItems = currentItems.map(i => i.label);
      const { data, error } = await supabase.functions.invoke("style-shop-suggestions", {
        body: {
          styleCategory: prefs.styleCategory,
          styleSubcategory: prefs.styleSubcategory,
          lookName,
          gender: prefs.gender,
          hotspot,
          excludeItems,
          swapOnly: true,
          styledImageUrl,
        },
      });
      const newItem = data?.items?.[0];
      if (!error && newItem) {
        setAiShopItems(prev => {
          const list = [...(prev[key] || currentItems)];
          list[index] = newItem;
          return { ...prev, [key]: list };
        });
      }
    } catch (err) {
      console.warn("Swap failed", err);
    } finally {
      setSwappingIndex(null);
    }
  };

  useEffect(() => {
    const lookName = (styleLooks[prefs.styleCategory] || styleLooks["full-style"])[0]?.name;
    if (activeHotspot && lookName) fetchAiShopItems(lookName, activeHotspot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHotspot, prefs.styleCategory, prefs.styleSubcategory]);

  const analysisCards: { label: string; value: string; Icon: LucideIcon }[] = isMakeup
    ? [
        { label: "Face Shape", value: analysis.faceShape, Icon: Diamond },
        { label: "Skin Tone", value: analysis.skinTone, Icon: Palette },
      ]
    : [
        { label: "Body Type", value: analysis.bodyType, Icon: Ruler },
        { label: "Color Season", value: analysis.colorSeason, Icon: Palette },
      ];

  const hasOriginal = !!prefs.photoBase64;
  const hasStyled = !!styledImageUrl;

  // Trigger native rating prompt once after the user's first completed style session.
  useEffect(() => {
    if (hasStyled) maybeRequestFirstSessionReview();
  }, [hasStyled]);

  const scrollTo = (direction: "top" | "bottom") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: direction === "top" ? 0 : el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="screen enter" ref={scrollRef} style={{ minHeight: "100%", paddingBottom: 40, overflowY: "auto", position: "relative" }}>
      {/* Floating scroll buttons */}
      <div style={{
        position: "sticky", top: 8, zIndex: 50, display: "flex", justifyContent: "flex-end",
        paddingRight: 12, gap: 6, pointerEvents: "none",
      }}>
        <button onClick={() => scrollTo("top")} style={{
          pointerEvents: "auto", width: 36, height: 36, borderRadius: "50%",
          background: "hsla(var(--glamora-char) / 0.7)", backdropFilter: "blur(8px)",
          border: "1.5px solid hsla(var(--glamora-gold) / 0.2)", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: "0 2px 10px hsla(0 0% 0% / 0.3)",
        }}>
          <ChevronUp size={18} color="hsl(var(--glamora-cream))" />
        </button>
        <button onClick={() => scrollTo("bottom")} style={{
          pointerEvents: "auto", width: 36, height: 36, borderRadius: "50%",
          background: "hsla(var(--glamora-char) / 0.7)", backdropFilter: "blur(8px)",
          border: "1.5px solid hsla(var(--glamora-gold) / 0.2)", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: "0 2px 10px hsla(0 0% 0% / 0.3)",
        }}>
          <ChevronDown size={18} color="hsl(var(--glamora-cream))" />
        </button>
      </div>

      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ flex: 1 }}>
          <div className="header-title">Your New Look</div>
          <div className="header-sub">{isMakeup ? "AI Beauty Result" : "AI Style Result"}</div>
        </div>
      </div>
      <FlowStepper current="result" gender={prefs.gender} />

      <div style={{ padding: "0 22px" }}>
        {/* Error card when generation failed */}
        {!hasStyled && (
          <div className="glamora-card anim-fadeUp" style={{
            padding: "20px 18px", marginBottom: 16,
            border: "1.5px solid hsla(var(--glamora-rose-dark) / 0.3)",
            background: "linear-gradient(135deg, hsla(var(--glamora-rose-dark) / 0.06), hsla(var(--glamora-gold) / 0.04))",
            boxShadow: "0 4px 20px hsla(var(--glamora-rose-dark) / 0.08), inset 0 1px 0 hsla(0 0% 100% / 0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: "hsla(var(--glamora-rose-dark) / 0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <AlertTriangle size={20} color="hsl(var(--glamora-rose-dark))" />
              </div>
              <div>
                <div className="serif" style={{ fontSize: 16, color: "hsl(var(--glamora-char))", fontWeight: 600 }}>
                  Image Couldn't Be Generated
                </div>
                <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 2 }}>
                  The AI wasn't able to produce a result this time
                </div>
              </div>
            </div>

            <div style={{
              padding: "12px 14px", borderRadius: 12, marginBottom: 14,
              background: "hsla(var(--glamora-cream2) / 0.6)",
              border: "1px solid hsla(var(--glamora-gold) / 0.1)",
            }}>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
                Tips to improve results
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { Icon: Camera, text: "Use a clear, well-lit photo with your face visible" },
                  { Icon: Sun, text: "Avoid heavy filters, sunglasses, or busy backgrounds" },
                  { Icon: Lightbulb, text: "Try a different style category or switch to Mannequin mode" },
                ].map(tip => (
                  <div key={tip.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "hsl(var(--glamora-char))" }}>
                    <tip.Icon size={14} color="hsl(var(--glamora-gold))" style={{ flexShrink: 0 }} />
                    {tip.text}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {onRegenerate && (
                <button className="btn-primary btn-rose" onClick={() => onRegenerate()} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}>
                  <RefreshCw size={14} /> Try Again
                </button>
              )}
              <button className="btn-primary btn-ghost" onClick={onBack} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <Camera size={14} /> New Photo
              </button>
            </div>
          </div>
        )}

        {/* Analysis Summary */}
        <div className="anim-fadeUp" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {analysisCards.map((c) => (
            <div key={c.label} className="glamora-card" style={{ flex: 1, padding: "12px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                <c.Icon size={18} color="hsl(var(--glamora-rose-dark))" />
              </div>
              <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{c.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))", marginTop: 2 }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Shop This Look CTA — always visible when image generated */}
        {hasStyled && (
          <button
            className="anim-fadeUp"
            onClick={() => onLookSelect(looks[0]?.name || "Full Style")}
            style={{
              width: "100%", padding: "16px 24px", marginBottom: 16, borderRadius: 16,
              background: "linear-gradient(135deg, hsl(142 60% 42%), hsl(152 55% 48%))",
              color: "#fff", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
              fontFamily: "'Jost', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              boxShadow: "0 6px 24px hsla(142 60% 42% / 0.4)",
              animation: "pulse2 3s ease-in-out infinite",
            }}
          >
            <ShoppingBag size={20} /> Shop This Image
          </button>
        )}

        {/* View mode toggle */}
        <div className="anim-fadeUp d1" style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {([
            { id: "compare" as const, label: "Compare", Icon: Sparkles, show: hasOriginal && hasStyled },
            { id: "image" as const, label: "Shop Image", Icon: Image, show: true },
            { id: "list" as const, label: "Style List", Icon: List, show: true },
          ]).filter(m => m.show).map((mode) => (
            <button key={mode.id} onClick={() => setViewMode(mode.id)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 12, border: "1.5px solid",
              borderColor: viewMode === mode.id ? "hsl(var(--glamora-rose-dark))" : "hsla(var(--glamora-gray-light) / 0.2)",
              background: viewMode === mode.id ? "hsla(var(--glamora-rose-dark) / 0.12)" : "transparent",
              cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
              color: viewMode === mode.id ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))",
              transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              <mode.Icon size={14} /> {mode.label}
            </button>
          ))}
        </div>

        {/* Before/After Compare */}
        {viewMode === "compare" && hasOriginal && hasStyled && (
          <>
            <div className="glamora-card anim-fadeUp d2" style={{ overflow: "hidden", borderRadius: 22 }}>
              <BeforeAfterSlider
                beforeSrc={prefs.photoBase64!}
                afterSrc={styledImageUrl!}
              />
            </div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", textAlign: "center", marginTop: 10 }}>
              Drag the slider to compare your original with the AI-styled version
            </div>
          </>
        )}

        {viewMode === "image" && (
          <>
            {/* Styled Image with Hotspots */}
            <div className="glamora-card anim-fadeUp d2" style={{ position: "relative", overflow: "hidden", borderRadius: 22 }}>
              {showWatermark && <Watermark />}
              {styledImageUrl ? (
                <img
                  src={showBackView && backViewUrl ? backViewUrl : styledImageUrl}
                  alt={showBackView ? "Back view of your styled look" : "Your styled look"}
                  style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 22, display: "block" }}
                />
              ) : (
                <div style={{
                  width: "100%", height: 420, borderRadius: 22,
                  background: "linear-gradient(160deg, hsl(var(--glamora-char)) 0%, hsl(var(--glamora-char2)) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
                }}>
                  <Sparkles size={56} color="hsl(var(--glamora-gray))" strokeWidth={1} />
                  <div style={{ fontSize: 14, color: "hsl(var(--glamora-gray-light))" }}>AI-styled image</div>
                </div>
              )}

              {/* Back-view toggle pill (top-right) */}
              {hasStyled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (backViewUrl) {
                      setShowBackView((v) => !v);
                    } else {
                      generateBackView();
                    }
                  }}
                  disabled={backViewLoading}
                  style={{
                    position: "absolute", top: 12, right: 12, zIndex: 5,
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 12px", borderRadius: 100,
                    background: showBackView
                      ? "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))"
                      : "hsla(0 0% 0% / 0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1.5px solid hsla(var(--glamora-gold) / 0.4)",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                    fontFamily: "'Jost', sans-serif", cursor: backViewLoading ? "wait" : "pointer",
                    boxShadow: "0 2px 10px hsla(0 0% 0% / 0.3)",
                    opacity: backViewLoading ? 0.7 : 1,
                  }}
                >
                  <RotateCw size={12} style={backViewLoading ? { animation: "spin 1s linear infinite" } : undefined} />
                  {backViewLoading
                    ? "Generating…"
                    : backViewUrl
                      ? (showBackView ? "Front View" : "Back View")
                      : "See Back View"}
                </button>
              )}
              {backViewError && (
                <div style={{
                  position: "absolute", bottom: 12, left: 12, right: 12, zIndex: 5,
                  padding: "8px 12px", borderRadius: 12,
                  background: "hsla(var(--glamora-rose-dark) / 0.9)",
                  color: "#fff", fontSize: 11, fontWeight: 600, textAlign: "center",
                }}>
                  {backViewError}
                </div>
              )}

              {/* Hotspot overlays — tap to shop for specific items */}
              {Object.entries(hotspotPositions).map(([id, pos]) => {
                const isActive = activeHotspot === id;
                // Build a specific shop link from the actual look data
                const getSpecificShopLink = () => {
                   const customTerm = getCustomDetailForHotspot(id as HotspotId, userCustomDetails);
                   // If user typed a custom detail, detect brand name and route to that store
                   if (customTerm) {
                     const detected = detectStoreFromText(customTerm);
                     if (detected) {
                       return getShopUrl(detected.store, detected.query);
                     }
                     // No brand detected — search Amazon with the full custom term
                     return getShopUrl("Amazon", customTerm);
                   }
                   // No custom detail — fall back to lookData shop links
                   const lookName = looks[0]?.name;
                   const categoryMap: Record<HotspotId, Category> = {
                     makeup: "makeup", top: "top", bottom: "bottom", shoes: "shoes", accessories: "accessories",
                   };
                   const cat = categoryMap[id as HotspotId];
                   const steps = lookName && lookData[lookName]?.[cat];
                   if (steps && steps.length > 0) {
                     const firstWithShop = steps.find(s => s.shop);
                     if (firstWithShop?.shop) {
                       const tier = firstWithShop.shop.mid || firstWithShop.shop.budget || firstWithShop.shop.luxury;
                       return getShopUrl(tier.store, tier.item);
                     }
                   }
                   return getShopUrl("Amazon", pos.searchTerm);
                 };
                return (
                  <button
                    key={id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isActive) {
                        window.open(getSpecificShopLink(), "_blank", "noopener,noreferrer");
                      } else {
                        setActiveHotspot(id as HotspotId);
                      }
                    }}
                    style={{
                      position: "absolute", top: pos.top, left: pos.left, transform: "translate(-50%, -50%)",
                      width: isActive ? 48 : 36, height: isActive ? 48 : 36, borderRadius: "50%",
                      background: isActive
                        ? "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))"
                        : "hsla(0 0% 0% / 0.55)",
                      backdropFilter: "blur(8px)",
                      border: isActive ? "2px solid hsl(var(--glamora-gold-light))" : "2px solid hsla(255 255 255 / 0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.25s ease",
                      boxShadow: isActive ? "0 4px 20px hsla(12 39% 54% / 0.5)" : "0 2px 10px hsla(0 0% 0% / 0.3)",
                      animation: isActive ? "none" : "pulse2 2.5s ease-in-out infinite",
                    }}
                  >
                    {isActive ? <ExternalLink size={20} color="white" /> : <pos.Icon size={16} color="white" />}
                  </button>
                );
              })}
            </div>

            {/* Active hotspot shop panel */}
            {activeHotspot && (() => {
              // Build shop items from lookData for this category
              const lookName = looks[0]?.name;
              const categoryMap: Record<HotspotId, Category> = {
                makeup: "makeup", top: "top", bottom: "bottom", shoes: "shoes", accessories: "accessories",
              };
              const cat = categoryMap[activeHotspot];
              const data = lookName && lookData[lookName]?.[cat];
              const customTerm = getCustomDetailForHotspot(activeHotspot, userCustomDetails);
              const detected = customTerm ? detectStoreFromText(customTerm) : null;

              const aiKey = lookName ? `${lookName}|${activeHotspot}` : "";
              const aiItems = aiKey ? aiShopItems[aiKey] : undefined;
              const isLoadingAi = aiKey ? aiShopLoading[aiKey] : false;

              let shopItems: ShopItem[];
              if (customTerm) {
                // User specified a custom item — build a single shop entry routing to the right store
                const targetStore = detected?.store || "Amazon";
                const searchQuery = detected?.query || customTerm;
                shopItems = [{
                  label: customTerm,
                  stores: {
                    luxury: { store: targetStore, item: searchQuery, price: "$$$$" },
                    mid: { store: targetStore, item: searchQuery, price: "$$$" },
                    budget: { store: "Amazon", item: customTerm, price: "$$" },
                  },
                }];
              } else if (aiItems && aiItems.length > 0) {
                // Prefer AI-curated, occasion-aware shop list across multiple retailers
                shopItems = aiItems;
              } else {
                shopItems = data
                  ? data.filter(step => step.shop).map(step => ({
                      label: step.title,
                      stores: step.shop!,
                    }))
                  : [];
              }

              return (
                <div className="anim-fadeUp" style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    {(() => { const HIcon = hotspotPositions[activeHotspot].Icon; return <HIcon size={20} color="hsl(var(--glamora-rose-dark))" />; })()}
                    <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                      Shop {hotspotPositions[activeHotspot].label}
                    </div>
                    {isLoadingAi && (
                      <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))" }}>Curating…</div>
                    )}
                  </div>
                  {shopItems.length > 0 ? (
                   <ShopPanel
                     items={shopItems}
                     swappingIndex={swappingIndex}
                     onSwapItem={lookName ? (idx) => swapShopItem(lookName, activeHotspot, idx, shopItems) : undefined}
                   />
                  ) : (
                    <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 8 }}>
                      {isLoadingAi ? "Building your curated shopping list…" : "Select a style below to see shopping options"}
                    </div>
                  )}
                  {/* Look selection */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
                    {looks.map((look) => (
                      <div key={look.name} onClick={() => onLookSelect(look.name)} style={{
                        padding: "12px 14px", borderRadius: 14,
                        background: "hsla(var(--glamora-cream2) / 0.5)",
                        border: "1px solid hsla(var(--glamora-gold) / 0.1)",
                        display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                      }}>
                        <Sparkles size={22} color="hsl(var(--glamora-rose-dark))" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{look.name}</div>
                          <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>{look.desc}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-success))" }}>{look.match}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", textAlign: "center", marginTop: 14 }}>
              Tap a hotspot to browse items at 3 price tiers
            </div>
          </>
        )}

        {viewMode === "list" && (
          <>
            <div className="section-label anim-fadeUp d2">Recommended Styles</div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 12, marginTop: -8 }}>
              Tap a style for the complete guide with shopping links
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
              {looks.map((look, i) => (
                <div key={look.name} className={`glamora-card anim-fadeUp d${i + 3}`} onClick={() => onLookSelect(look.name)}
                  style={{ padding: "18px 18px", display: "flex", alignItems: "center", gap: 16, border: "1px solid hsla(var(--glamora-gold) / 0.12)", cursor: "pointer" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.3), hsla(var(--glamora-gold) / 0.2))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={24} color="hsl(var(--glamora-rose-dark))" /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{look.name}</div>
                    <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 3 }}>{look.desc}</div>
                  </div>
                  <div style={{ padding: "6px 12px", borderRadius: 100, background: "hsla(var(--glamora-success) / 0.15)", fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-success))" }}>{look.match}%</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Feature tags */}
        <div className="anim-fadeUp d3" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, marginTop: 16 }}>
          {analysis.features.map((f) => (<span key={f} className="pill-tag">{f}</span>))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Prominent tutorial CTA for makeup looks */}
          {isMakeup && hasStyled && (
            <button
              className="btn-primary"
              onClick={() => onLookSelect(looks[0]?.name || "Soft Glam")}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
                padding: "16px 24px", fontSize: 15, fontWeight: 700,
                boxShadow: "0 6px 24px hsla(20 35% 55% / 0.35)",
                animation: "pulse2 3s ease-in-out infinite",
              }}
            >
              <BookOpen size={20} /> Get Step-by-Step Makeup Tutorial
            </button>
          )}
          {/* Style Tweaker */}
          {onRegenerate && (
            <div className="glamora-card" style={{ padding: "16px", border: "1.5px solid hsla(var(--glamora-gold) / 0.2)" }}>
              <button onClick={() => setShowTweaker(!showTweaker)} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Jost', sans-serif", color: "hsl(var(--glamora-char))",
                fontSize: 14, fontWeight: 600, padding: 0,
              }}>
                <Sparkles size={18} color="hsl(var(--glamora-gold))" />
                Refine Look with Gio AI
                <ChevronDown size={16} style={{
                  marginLeft: "auto", transition: "transform 0.2s",
                  transform: showTweaker ? "rotate(180deg)" : "rotate(0)",
                  color: "hsl(var(--glamora-gray))",
                }} />
              </button>
              {showTweaker && (
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                    Style Category
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {(["full-style", "streetwear", "formal", "casual", "makeup-only", "minimalist", "vintage", "athleisure", "bohemian", "preppy", "edgy", "resort", "grooming"] as StyleCategory[]).map((cat) => (
                      <button key={cat} onClick={() => setTweakedCategory(cat)} style={{
                        padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                        fontFamily: "'Jost', sans-serif", cursor: "pointer",
                        border: tweakedCategory === cat ? "1.5px solid hsl(var(--glamora-gold))" : "1.5px solid hsla(var(--glamora-gray-light) / 0.2)",
                        background: tweakedCategory === cat ? "hsla(var(--glamora-gold) / 0.15)" : "transparent",
                        color: tweakedCategory === cat ? "hsl(var(--glamora-gold))" : "hsl(var(--glamora-gray))",
                        transition: "all 0.2s", textTransform: "capitalize",
                      }}>
                        {cat.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                  <button className="btn-primary btn-rose" onClick={() => onRegenerate(tweakedCategory)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
                    <Sparkles size={16} /> Ask Gio about {tweakedCategory.replace("-", " ")}
                  </button>
                </div>
              )}
            </div>
          )}
          {hasStyled && (
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary btn-rose" onClick={() => handleDownload(styledImageUrl!)} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                Download <Download size={16} />
              </button>
            </div>
          )}
          {onQuickRegenerate && (
            <button
              className="btn-primary"
              onClick={onQuickRegenerate}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
                boxShadow: "0 4px 16px hsla(var(--glamora-gold) / 0.25)",
              }}
            >
              <RefreshCw size={16} /> Regenerate Look
            </button>
          )}
          {!hasStyled && onRegenerate && (
            <button className="btn-primary btn-rose" onClick={() => onRegenerate()} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <RefreshCw size={16} /> Generate AI Image
            </button>
          )}
          <ShareMenu
            text={`Check out my AI-styled ${isMakeup ? "beauty" : "fashion"} look from Glosseti! ✨`}
            imageUrl={styledImageUrl || undefined}
            trigger={
              <button className="btn-primary btn-rose" style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                Share My Look <Share2 size={16} />
              </button>
            }
          />
          {/* Style tutorial shortcuts for non-makeup */}
          {!isMakeup && (
            <div style={{ display: "flex", gap: 8 }}>
              {looks.slice(0, 2).map((look) => (
                <button key={look.name} className="btn-primary btn-ghost" onClick={() => onLookSelect(look.name)}
                  style={{ flex: 1, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <BookOpen size={14} /> {look.name}
                </button>
              ))}
            </div>
          )}
          <button className="btn-primary btn-rose" onClick={() => onSave(looks.map(l => l.name))} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Save All Styles <Bookmark size={16} />
          </button>
          <button className="btn-primary btn-ghost" onClick={onHome}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default StyledResultScreen;
