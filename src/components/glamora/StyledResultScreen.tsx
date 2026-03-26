import { useState, useRef } from "react";
import { Sparkles, Shirt, Watch, CircleDot, Footprints, Palette, Bookmark, Image, List, Ruler, Diamond, Download, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import type { UserPrefs } from "./GlamoraApp";
import { styleLooks } from "./lookData";
import BeforeAfterSlider from "./BeforeAfterSlider";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: UserPrefs;
  styledImageUrl: string | null;
  onBack: () => void;
  onHome: () => void;
  onSave: (lookNames: string[]) => void;
  onLookSelect: (name: string) => void;
}

type HotspotId = "top" | "bottom" | "shoes" | "accessories" | "makeup";

const hotspotPositions: Record<HotspotId, { top: string; left: string; label: string; Icon: LucideIcon; searchTerm: string }> = {
  makeup: { top: "8%", left: "62%", label: "Makeup", Icon: Palette, searchTerm: "makeup kit set" },
  top: { top: "28%", left: "18%", label: "Top", Icon: Shirt, searchTerm: "women top blouse" },
  accessories: { top: "22%", left: "78%", label: "Accessories", Icon: Watch, searchTerm: "fashion accessories jewelry" },
  bottom: { top: "58%", left: "22%", label: "Bottoms", Icon: CircleDot, searchTerm: "women pants trousers" },
  shoes: { top: "82%", left: "55%", label: "Shoes", Icon: Footprints, searchTerm: "women shoes heels" },
};

const analysis = {
  bodyType: "Athletic",
  faceShape: "Oval",
  skinTone: "Warm Medium",
  colorSeason: "Warm Autumn",
  features: ["High cheekbones", "Broad shoulders", "Proportional waist"],
};

const openShopLink = (searchTerm: string) => {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const handleDownload = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `glamora-styled-look-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(imageUrl, "_blank");
  }
};

const StyledResultScreen = ({ prefs, styledImageUrl, onBack, onHome, onSave, onLookSelect }: Props) => {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [viewMode, setViewMode] = useState<"compare" | "image" | "list">("compare");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMakeup = prefs.styleCategory === "makeup-only";
  const looks = styleLooks[prefs.styleCategory] || styleLooks["full-style"];

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

      <div style={{ padding: "0 22px" }}>
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
                height={420}
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
              {styledImageUrl ? (
                <img src={styledImageUrl} alt="Your styled look" style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 22, display: "block" }} />
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

              {/* Hotspot overlays — tap to shop on Amazon */}
              {Object.entries(hotspotPositions).map(([id, pos]) => {
                const isActive = activeHotspot === id;
                return (
                  <button
                    key={id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isActive) {
                        openShopLink(pos.searchTerm);
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

            {/* Active hotspot detail */}
            {activeHotspot && (
              <div className="glamora-card anim-fadeUp" style={{ padding: "16px", marginTop: 14, border: "1.5px solid hsla(var(--glamora-gold) / 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  {(() => { const HIcon = hotspotPositions[activeHotspot].Icon; return <HIcon size={22} color="hsl(var(--glamora-rose-dark))" />; })()}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{hotspotPositions[activeHotspot].label}</div>
                    <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>Tap hotspot again to shop on Amazon</div>
                  </div>
                  <button onClick={() => openShopLink(hotspotPositions[activeHotspot].searchTerm)} style={{
                    padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
                    color: "white", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4,
                    fontFamily: "'Jost', sans-serif",
                  }}>
                    Shop <ExternalLink size={12} />
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
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
            )}

            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", textAlign: "center", marginTop: 14 }}>
              Tap a hotspot once to preview · tap again to shop on Amazon
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
          {hasStyled && (
            <button className="btn-primary btn-rose" onClick={() => handleDownload(styledImageUrl!)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Download Styled Image <Download size={16} />
            </button>
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
