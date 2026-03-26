import { useState } from "react";
import type { UserPrefs } from "./GlamoraApp";
import { styleLooks } from "./lookData";

interface Props {
  prefs: UserPrefs;
  styledImageUrl: string | null;
  onBack: () => void;
  onHome: () => void;
  onSave: (lookNames: string[]) => void;
  onLookSelect: (name: string) => void;
}

type HotspotId = "top" | "bottom" | "shoes" | "accessories" | "makeup";

const hotspotPositions: Record<HotspotId, { top: string; left: string; label: string; emoji: string }> = {
  makeup: { top: "8%", left: "62%", label: "Makeup", emoji: "💄" },
  top: { top: "28%", left: "18%", label: "Top", emoji: "👔" },
  accessories: { top: "22%", left: "78%", label: "Accessories", emoji: "⌚" },
  bottom: { top: "58%", left: "22%", label: "Bottoms", emoji: "👖" },
  shoes: { top: "82%", left: "55%", label: "Shoes", emoji: "👟" },
};

const analysis = {
  bodyType: "Athletic",
  faceShape: "Oval",
  skinTone: "Warm Medium",
  colorSeason: "Warm Autumn",
  features: ["High cheekbones", "Broad shoulders", "Proportional waist"],
};

const StyledResultScreen = ({ prefs, styledImageUrl, onBack, onHome, onSave, onLookSelect }: Props) => {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId | null>(null);
  const [viewMode, setViewMode] = useState<"image" | "list">("image");
  const isMakeup = prefs.styleCategory === "makeup-only";
  const looks = styleLooks[prefs.styleCategory] || styleLooks["full-style"];

  const analysisCards = isMakeup
    ? [
        { label: "Face Shape", value: analysis.faceShape, icon: "💎" },
        { label: "Skin Tone", value: analysis.skinTone, icon: "🎨" },
      ]
    : [
        { label: "Body Type", value: analysis.bodyType, icon: "📐" },
        { label: "Color Season", value: analysis.colorSeason, icon: "🎨" },
      ];

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40 }}>
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
              <div style={{ fontSize: 18 }}>{c.icon}</div>
              <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{c.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))", marginTop: 2 }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="anim-fadeUp d1" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {(["image", "list"] as const).map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{
              flex: 1, padding: "10px", borderRadius: 12, border: "1.5px solid",
              borderColor: viewMode === mode ? "hsl(var(--glamora-rose-dark))" : "hsla(var(--glamora-gray-light) / 0.2)",
              background: viewMode === mode ? "hsla(var(--glamora-rose-dark) / 0.12)" : "transparent",
              cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 600,
              color: viewMode === mode ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))",
              transition: "all 0.2s",
            }}>
              {mode === "image" ? "📸 Shop from Image" : "📋 Style List"}
            </button>
          ))}
        </div>

        {viewMode === "image" ? (
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
                  <div style={{ fontSize: 64 }}>👗</div>
                  <div style={{ fontSize: 14, color: "hsl(var(--glamora-gray-light))" }}>AI-styled image</div>
                </div>
              )}

              {/* Hotspot overlays */}
              {Object.entries(hotspotPositions).map(([id, pos]) => {
                const isActive = activeHotspot === id;
                return (
                  <button
                    key={id}
                    onClick={(e) => { e.stopPropagation(); setActiveHotspot(isActive ? null : id as HotspotId); }}
                    style={{
                      position: "absolute", top: pos.top, left: pos.left, transform: "translate(-50%, -50%)",
                      width: isActive ? 52 : 40, height: isActive ? 52 : 40, borderRadius: "50%",
                      background: isActive
                        ? "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))"
                        : "hsla(0 0% 0% / 0.55)",
                      backdropFilter: "blur(8px)",
                      border: isActive ? "2px solid hsl(var(--glamora-gold-light))" : "2px solid hsla(255 255 255 / 0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: isActive ? 22 : 18,
                      cursor: "pointer", transition: "all 0.25s ease",
                      boxShadow: isActive ? "0 4px 20px hsla(12 39% 54% / 0.5)" : "0 2px 10px hsla(0 0% 0% / 0.3)",
                      animation: isActive ? "none" : "pulse2 2.5s ease-in-out infinite",
                    }}
                  >
                    {pos.emoji}
                  </button>
                );
              })}
            </div>

            {/* Active hotspot detail */}
            {activeHotspot && (
              <div className="glamora-card anim-fadeUp" style={{ padding: "16px", marginTop: 14, border: "1.5px solid hsla(var(--glamora-gold) / 0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{hotspotPositions[activeHotspot].emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{hotspotPositions[activeHotspot].label}</div>
                    <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>Tap a style below for full guide + shopping</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {looks.map((look) => (
                    <div key={look.name} onClick={() => onLookSelect(look.name)} style={{
                      padding: "12px 14px", borderRadius: 14,
                      background: "hsla(var(--glamora-cream2) / 0.5)",
                      border: "1px solid hsla(var(--glamora-gold) / 0.1)",
                      display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                    }}>
                      <span style={{ fontSize: 22 }}>{look.emoji}</span>
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
              👆 Tap the hotspots on the image to shop each piece
            </div>
          </>
        ) : (
          <>
            {/* List view */}
            <div className="section-label anim-fadeUp d2">Recommended Styles</div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 12, marginTop: -8 }}>
              Tap a style for the complete guide with shopping links →
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
              {looks.map((look, i) => (
                <div key={look.name} className={`glamora-card anim-fadeUp d${i + 3}`} onClick={() => onLookSelect(look.name)}
                  style={{ padding: "18px 18px", display: "flex", alignItems: "center", gap: 16, border: "1px solid hsla(var(--glamora-gold) / 0.12)", cursor: "pointer" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.3), hsla(var(--glamora-gold) / 0.2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{look.emoji}</div>
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
          <button className="btn-primary btn-rose" onClick={() => onSave(looks.map(l => l.name))}>Save All Styles 💾</button>
          <button className="btn-primary btn-ghost" onClick={onHome}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default StyledResultScreen;
