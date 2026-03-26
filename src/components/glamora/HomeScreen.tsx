import { Home, Scissors, Bookmark, User, ArrowRight, MessageCircle, TrendingUp, Star, Zap, Eye } from "lucide-react";
import DynamicVisual from "./DynamicVisual";
import type { Gender } from "./GlamoraApp";

interface Props {
  onGetStyled: () => void;
  onProfile: () => void;
  onSaved: () => void;
  savedCount: number;
  gender: Gender;
}

const maleInspo = [
  { title: "Sharp & Polished", sub: "Tailored fits, clean sneakers", emoji: "🔥" },
  { title: "Street Edge", sub: "Oversized layers, bold kicks", emoji: "⚡" },
  { title: "Weekend Easy", sub: "Relaxed denim, henley vibes", emoji: "🎯" },
];

const femaleInspo = [
  { title: "Effortless Glam", sub: "Silk textures, gold accents", emoji: "✨" },
  { title: "Bold & Beautiful", sub: "Statement colors, fierce looks", emoji: "💎" },
  { title: "Soft Feminine", sub: "Flowy fabrics, pastel tones", emoji: "🌸" },
];

const maleStats = [
  { label: "Fits Generated", value: "10K+", color: "var(--glamora-gold)" },
  { label: "Brands", value: "200+", color: "var(--glamora-gold-light)" },
  { label: "Avg Match", value: "94%", color: "var(--glamora-success)" },
];

const femaleStats = [
  { label: "Looks Created", value: "25K+", color: "var(--glamora-rose-dark)" },
  { label: "Brands", value: "350+", color: "var(--glamora-gold)" },
  { label: "Avg Match", value: "96%", color: "var(--glamora-success)" },
];

const HomeScreen = ({ onGetStyled, onProfile, onSaved, savedCount, gender }: Props) => {
  const isMale = gender === "male";
  const inspo = isMale ? maleInspo : femaleInspo;
  const stats = isMale ? maleStats : femaleStats;
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "48px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="serif" style={{ fontSize: 28, fontWeight: 400, letterSpacing: 3 }}>
            GLAMORA<span style={{ color: `hsl(${accent})` }}>.</span>
          </div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 2, letterSpacing: 0.5 }}>
            {isMale ? "Men's Style Studio" : "Women's Style Studio"}
          </div>
        </div>
        <button
          onClick={onProfile}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: `linear-gradient(135deg, hsl(${accentLight}), hsl(${accent}))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", border: "none",
            boxShadow: `0 4px 14px hsla(${isMale ? "28 40% 52%" : "18 32% 42%"} / 0.3)`,
          }}
        >
          <User size={18} color="white" />
        </button>
      </div>

      {/* Hero — large visual CTA */}
      <div
        className="anim-fadeUp"
        onClick={onGetStyled}
        style={{ margin: "20px 22px", borderRadius: 28, overflow: "hidden", position: "relative", height: 240, cursor: "pointer" }}
      >
        <DynamicVisual width="100%" height="100%" variant="hero" style={{ position: "absolute", inset: 0 }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: isMale
            ? "linear-gradient(180deg, hsla(20 18% 6% / 0.2) 0%, hsla(20 18% 6% / 0.9) 100%)"
            : "linear-gradient(180deg, hsla(18 28% 12% / 0.15) 0%, hsla(18 28% 12% / 0.9) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 4, padding: "24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: `hsl(${accent})`, fontWeight: 600, marginBottom: 6 }}>
            {isMale ? "AI Menswear Studio" : "AI Beauty & Style"}
          </div>
          <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, color: "white", marginBottom: 14 }}>
            {isMale
              ? <>Discover Your <em style={{ fontStyle: "italic", color: `hsl(${accent})` }}>Signature</em> Style</>
              : <>Get Your <em style={{ fontStyle: "italic", color: `hsl(${accent})` }}>Complete</em> Look</>
            }
          </div>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px",
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
              borderRadius: 16, color: "white", fontSize: 14, fontWeight: 600,
              cursor: "pointer", border: "none", fontFamily: "'Jost', sans-serif",
              letterSpacing: 0.5, boxShadow: "0 6px 20px hsla(0 0% 0% / 0.3)", alignSelf: "flex-start",
            }}
          >
            Start Styling <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Live stats banner — unique to home */}
      <div className="anim-fadeUp d1" style={{ padding: "0 22px", marginTop: 4 }}>
        <div style={{
          display: "flex", gap: 0, borderRadius: 18, overflow: "hidden",
          border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15)`,
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              flex: 1, padding: "14px 8px", textAlign: "center",
              background: `hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / ${0.03 + i * 0.02})`,
              borderRight: i < 2 ? `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.1)` : "none",
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: `hsl(${s.color})` }}>{s.value}</div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: "hsl(var(--glamora-gray))", marginTop: 2, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Inspiration */}
      <div style={{ padding: "0 22px", marginTop: 22 }}>
        <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TrendingUp size={14} color={`hsl(${accent})`} /> Trending For You
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {inspo.map((item, i) => (
            <div
              key={item.title}
              className={`glamora-card anim-fadeUp d${i + 2}`}
              onClick={onGetStyled}
              style={{
                minWidth: 150, padding: "16px 14px", cursor: "pointer",
                border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15)`,
                background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.06), transparent)`,
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature highlights — unique cards */}
      <div style={{ padding: "0 22px", marginTop: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="glamora-card anim-fadeUp d3" onClick={onGetStyled} style={{
            flex: 1, padding: "18px 14px", cursor: "pointer", textAlign: "center",
            background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.08), hsl(var(--card)))`,
            border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.12)`,
          }}>
            <Eye size={24} color={`hsl(${accent})`} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>AI Vision</div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>Scan & style you</div>
          </div>
          <div className="glamora-card anim-fadeUp d4" onClick={onGetStyled} style={{
            flex: 1, padding: "18px 14px", cursor: "pointer", textAlign: "center",
            background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold-light)" : "var(--glamora-gold)"} / 0.08), hsl(var(--card)))`,
            border: `1px solid hsla(var(--glamora-gold) / 0.12)`,
          }}>
            <Zap size={24} color="hsl(var(--glamora-gold))" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>3 Price Tiers</div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>Luxury to budget</div>
          </div>
          <div className="glamora-card anim-fadeUp d5" onClick={onSaved} style={{
            flex: 1, padding: "18px 14px", cursor: "pointer", textAlign: "center",
            position: "relative",
          }}>
            <Bookmark size={24} color={`hsl(${accent})`} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Saved</div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{savedCount} look{savedCount !== 1 ? "s" : ""}</div>
            {savedCount > 0 && (
              <div style={{
                position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%",
                background: `hsl(${accent})`, fontSize: 10, fontWeight: 700, color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{savedCount}</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn active"><span className="nav-icon"><Home size={22} /></span><span className="nav-label">Home</span></button>
        <button className="nav-btn" onClick={onGetStyled}><span className="nav-icon"><Scissors size={22} /></span><span className="nav-label">Style</span></button>
        <button className="nav-btn" onClick={onSaved}><span className="nav-icon"><Bookmark size={22} /></span><span className="nav-label">Saved</span></button>
        <button className="nav-btn" onClick={onProfile}><span className="nav-icon"><User size={22} /></span><span className="nav-label">Profile</span></button>
      </div>
    </div>
  );
};

export default HomeScreen;
