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

        {/* Shop This Image — opens a retailer picker, then deep-links to that retailer's product search */}
        {hasStyled && styledImageUrl && (
          <div className="anim-fadeUp" style={{ marginBottom: 16 }}>
            <button
              onClick={() => setShowRetailerPicker(v => !v)}
              style={{
                width: "100%", padding: "16px 24px", borderRadius: 16,
                background: "linear-gradient(135deg, hsl(142 60% 42%), hsl(152 55% 48%))",
                color: "#fff", fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
                fontFamily: "'Jost', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 6px 24px hsla(142 60% 42% / 0.4)",
                animation: showRetailerPicker ? "none" : "pulse2 3s ease-in-out infinite",
              }}
            >
              <ShoppingBag size={20} /> Shop This Image
              <ChevronDown size={18} style={{ transition: "transform 0.2s", transform: showRetailerPicker ? "rotate(180deg)" : "rotate(0)" }} />
            </button>
            {showRetailerPicker && (() => {
              const lookName = looks[0]?.name || "";
              const subStyle = (prefs.styleSubcategory || "").split(" + ")[0]?.split(":").pop()?.replace(/\[.*\]/, "").replace(/-/g, " ") || "";
              const genderTerm = isMale ? "men" : "women";
              const query = [genderTerm, subStyle, lookName].filter(Boolean).join(" ").trim();
              const retailers = isMale
                ? ["Amazon", "Nordstrom", "Zara", "H&M", "Uniqlo", "Ralph Lauren", "Shein"]
                : ["Fashion Nova", "Amazon", "Shein", "Zara", "H&M", "Nordstrom", "Revolve"];
              return (
                <div style={{
                  marginTop: 10, padding: 12, borderRadius: 14,
                  background: "hsla(var(--glamora-cream2) / 0.6)",
                  border: "1px solid hsla(var(--glamora-gold) / 0.2)",
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
                }}>
                  {retailers.map(store => (
                    <a
                      key={store}
                      href={getShopUrl(store, query)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "12px 10px", borderRadius: 10,
                        background: "hsl(var(--glamora-char))",
                        color: "hsl(var(--glamora-cream))",
                        textDecoration: "none", fontSize: 13, fontWeight: 600,
                        textAlign: "center", fontFamily: "'Jost', sans-serif",
                        border: "1px solid hsla(var(--glamora-gold) / 0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      }}
                    >
                      {store} <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* View Back of Look — generates a back-view rendering of the styled image */}
        {hasStyled && prefs.photoBase64 && (
          <button
            className="anim-fadeUp"
            onClick={() => {
              if (backViewUrl) setShowBackView(v => !v);
              else generateBackView();
            }}
            disabled={backViewLoading}
            style={{
              width: "100%", padding: "12px 18px", marginBottom: 16, borderRadius: 14,
              background: "hsla(var(--glamora-char) / 0.85)",
              color: "hsl(var(--glamora-cream))", fontSize: 14, fontWeight: 600,
              border: "1.5px solid hsla(var(--glamora-gold) / 0.35)", cursor: backViewLoading ? "wait" : "pointer",
              fontFamily: "'Jost', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <RotateCw size={16} />
            {backViewLoading
              ? "Generating back view…"
              : backViewUrl
                ? (showBackView ? "Hide Back View" : "Show Back View")
                : "View From the Back"}
          </button>
        )}
        {backViewError && (
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-rose-dark))", marginTop: -8, marginBottom: 12, textAlign: "center" }}>
            {backViewError}
          </div>
        )}
        {showBackView && backViewUrl && (
          <div className="glamora-card anim-fadeUp" style={{ overflow: "hidden", borderRadius: 18, marginBottom: 16 }}>
            <img src={backViewUrl} alt="Back view of styled look" style={{ width: "100%", display: "block" }} />
            <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", textAlign: "center", padding: "8px 12px" }}>
              AI-generated back view
            </div>
          </div>
        )}

        {/* Shop This Look — price breakdown with deep-links to retailers like Fashion Nova */}
        {hasStyled && looks[0] && <LookPriceCard lookName={looks[0].name} />}

        {/* View mode toggle */}
        <div className="anim-fadeUp d1" style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {([
            { id: "compare" as const, label: "Compare", Icon: Sparkles, show: hasOriginal && hasStyled },
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
