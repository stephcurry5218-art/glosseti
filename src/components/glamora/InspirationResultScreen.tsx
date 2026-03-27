import { useState } from "react";
import { Sparkles, Bookmark, Share2, RefreshCw, Download, Palette, Shirt, Gem, Scissors, Info, ExternalLink } from "lucide-react";
import type { UserPrefs, PhotoType } from "./GlamoraApp";
import type { StyleProfile } from "./InspirationLoadingScreen";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { getAmazonSearchUrl } from "./affiliateUrls";
import ShareMenu from "./ShareMenu";
import Watermark from "./subscription/Watermark";

interface Props {
  prefs: UserPrefs;
  styledImageUrl: string | null;
  styleProfile: StyleProfile | null;
  onBack: () => void;
  onHome: () => void;
  onSave: (lookName: string) => void;
  onRegenerate: () => void;
  showWatermark?: boolean;
}

const handleDownload = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `glamora-inspired-look-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(imageUrl, "_blank");
  }
};

const InspirationResultScreen = ({ prefs, styledImageUrl, styleProfile, onBack, onHome, onSave, onRegenerate, showWatermark }: Props) => {
  const [viewMode, setViewMode] = useState<"compare" | "image">("compare");
  const isMale = prefs.gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const hasOriginal = !!prefs.photoBase64;
  const hasStyled = !!styledImageUrl;

  const profile = styleProfile || {
    styleName: "Inspired Aesthetic",
    clothingTypes: [],
    colorPalette: [],
    fitPreferences: [],
    accessories: [],
    makeupStyle: "",
    hairTrend: "",
    overallVibe: "",
    detailedPrompt: "",
  };

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40, overflowY: "auto" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ flex: 1 }}>
          <div className="header-title">{profile.styleName}</div>
          <div className="header-sub">AI-Inspired Look</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Overall vibe */}
        {profile.overallVibe && (
          <div className="glamora-card anim-fadeUp" style={{
            padding: "14px 16px", marginBottom: 16,
            border: `1.5px solid hsla(${accent} / 0.15)`,
            background: `linear-gradient(160deg, hsla(${accent} / 0.05), hsl(var(--card)))`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Sparkles size={16} color={`hsl(${accent})`} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Aesthetic Vibe</span>
            </div>
            <div style={{ fontSize: 14, color: "hsl(var(--glamora-char))", lineHeight: 1.5 }}>{profile.overallVibe}</div>
          </div>
        )}

        {/* View toggle */}
        {hasOriginal && hasStyled && (
          <div className="anim-fadeUp d1" style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {([
              { id: "compare" as const, label: "Before / After" },
              { id: "image" as const, label: "Styled Look" },
            ]).map((mode) => (
              <button key={mode.id} onClick={() => setViewMode(mode.id)} style={{
                flex: 1, padding: "10px 6px", borderRadius: 12, border: "1.5px solid",
                borderColor: viewMode === mode.id ? `hsl(${accent})` : "hsla(var(--glamora-gray-light) / 0.2)",
                background: viewMode === mode.id ? `hsla(${accent} / 0.12)` : "transparent",
                cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
                color: viewMode === mode.id ? `hsl(${accent})` : "hsl(var(--glamora-gray))",
                transition: "all 0.2s",
              }}>
                {mode.label}
              </button>
            ))}
          </div>
        )}

        {/* Image display */}
        {viewMode === "compare" && hasOriginal && hasStyled ? (
          <div className="glamora-card anim-fadeUp d2" style={{ overflow: "hidden", borderRadius: 22, position: "relative" }}>
            {showWatermark && <Watermark />}
            <BeforeAfterSlider beforeSrc={prefs.photoBase64!} afterSrc={styledImageUrl!} height={420} />
          </div>
        ) : (
          <div className="glamora-card anim-fadeUp d2" style={{ position: "relative", overflow: "hidden", borderRadius: 22 }}>
            {showWatermark && <Watermark />}
            {styledImageUrl ? (
              <img src={styledImageUrl} alt="Inspired look" style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 22, display: "block" }} />
            ) : (
              <div style={{
                width: "100%", height: 420, borderRadius: 22,
                background: "linear-gradient(160deg, hsl(var(--glamora-char)) 0%, hsl(var(--glamora-char2)) 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
              }}>
                <Sparkles size={56} color="hsl(var(--glamora-gray))" strokeWidth={1} />
                <div style={{ fontSize: 14, color: "hsl(var(--glamora-gray-light))" }}>AI-inspired image</div>
              </div>
            )}
          </div>
        )}

        {/* Style profile tags */}
        <div className="anim-fadeUp d3" style={{ marginTop: 16 }}>
          {/* Color Palette */}
          {profile.colorPalette.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Palette size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Color Palette</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.colorPalette.map((c) => <span key={c} className="pill-tag">{c}</span>)}
              </div>
            </div>
          )}

          {/* Clothing */}
          {profile.clothingTypes.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Shirt size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Clothing</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.clothingTypes.map((c) => <span key={c} className="pill-tag">{c}</span>)}
              </div>
            </div>
          )}

          {/* Fit */}
          {profile.fitPreferences.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Gem size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Fit & Accessories</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[...profile.fitPreferences, ...profile.accessories].map((c) => <span key={c} className="pill-tag">{c}</span>)}
              </div>
            </div>
          )}

          {/* Beauty */}
          {(profile.makeupStyle || profile.hairTrend) && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Scissors size={14} color={`hsl(${accent})`} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>Beauty & Hair</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {profile.makeupStyle && <span className="pill-tag">{profile.makeupStyle}</span>}
                {profile.hairTrend && <span className="pill-tag">{profile.hairTrend}</span>}
              </div>
            </div>
          )}
        </div>

        {/* Shop This Look */}
        {hasStyled && (
          <button
            className="glamora-card anim-fadeUp d4"
            onClick={() => {
              const searchTerms = [...profile.clothingTypes, ...profile.accessories].slice(0, 3).join(" ");
              window.open(getAmazonSearchUrl(searchTerms || "fashion outfit"), "_blank", "noopener,noreferrer");
            }}
            style={{
              width: "100%", padding: "14px 16px", marginTop: 16, cursor: "pointer",
              border: `1.5px solid hsla(${accent} / 0.2)`,
              display: "flex", alignItems: "center", gap: 10,
              background: `linear-gradient(160deg, hsla(${accent} / 0.06), hsl(var(--card)))`,
              fontFamily: "'Jost', sans-serif",
            }}
          >
            <ExternalLink size={18} color={`hsl(${accent})`} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Shop This Look</div>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>Find similar items at 3 price tiers</div>
            </div>
          </button>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-primary btn-sm" style={{ flex: 1, background: `linear-gradient(135deg, hsl(${accent}), hsl(var(--glamora-gold-light)))` }}
            onClick={() => onSave(profile.styleName)}>
            <Bookmark size={16} /> Save
          </button>
          <ShareMenu text={`Check out my "${profile.styleName}" look on Glosseti!`} imageUrl={styledImageUrl || undefined} />
          {hasStyled && (
            <button className="btn-primary btn-sm btn-ghost" style={{ flex: 1 }}
              onClick={() => handleDownload(styledImageUrl!)}>
              <Download size={16} /> Save
            </button>
          )}
        </div>

        {/* Regenerate */}
        <button
          className="btn-primary btn-ghost anim-fadeUp d5"
          style={{ marginTop: 12 }}
          onClick={onRegenerate}
        >
          <RefreshCw size={16} /> Generate Another Variation
        </button>

        {/* Home */}
        <button className="btn-primary btn-ghost" style={{ marginTop: 10 }} onClick={onHome}>
          Back to Home
        </button>

        {/* Disclaimer */}
        <div className="anim-fadeUp d6" style={{
          marginTop: 16, padding: "10px 14px", borderRadius: 12,
          background: "hsla(var(--glamora-gold-pale) / 0.5)",
          border: "1px solid hsla(var(--glamora-gold) / 0.12)",
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <Info size={13} color="hsl(var(--glamora-gold))" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", lineHeight: 1.5 }}>
            Styles are AI-generated and inspired by general trends. Glamora is not affiliated with or endorsed by any public figures.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationResultScreen;
