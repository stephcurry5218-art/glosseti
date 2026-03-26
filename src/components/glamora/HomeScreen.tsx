import DynamicVisual from "./DynamicVisual";

interface Props {
  onUpload: () => void;
  onProfile: () => void;
  onSaved: () => void;
}

const trendingLooks = [
  { name: "Soft Glam", emoji: "🌸", color: "hsla(12 52% 85% / 0.4)" },
  { name: "Bold Lip", emoji: "💋", color: "hsla(0 60% 70% / 0.3)" },
  { name: "Dewy Glow", emoji: "✨", color: "hsla(36 72% 88% / 0.6)" },
  { name: "Smoky Eye", emoji: "🖤", color: "hsla(16 20% 11% / 0.12)" },
];

const HomeScreen = ({ onUpload, onProfile, onSaved }: Props) => (
  <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 100 }}>
    {/* Header */}
    <div style={{ padding: "54px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 3 }}>
        GLAMORA<span style={{ color: "hsl(var(--glamora-gold))" }}>.</span>
      </div>
      <button
        onClick={onProfile}
        style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg, hsl(var(--glamora-rose)) 0%, hsl(var(--glamora-rose-dark)) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, cursor: "pointer", border: "none",
          boxShadow: "0 4px 14px hsla(12 39% 54% / 0.3)",
        }}
      >
        👤
      </button>
    </div>

    {/* Hero card */}
    <div
      className="anim-fadeUp"
      onClick={onUpload}
      style={{
        margin: "20px 22px", borderRadius: 26, overflow: "hidden",
        position: "relative", height: 220, cursor: "pointer",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, hsl(var(--glamora-char)) 0%, hsl(var(--glamora-char2)) 100%)" }} />
      <div className="absolute rounded-full" style={{ width: 160, height: 160, top: -30, right: -20, background: "hsla(12 39% 54% / 0.3)", filter: "blur(40px)" }} />
      <div className="absolute rounded-full" style={{ width: 120, height: 120, bottom: -20, left: 20, background: "hsla(36 50% 53% / 0.2)", filter: "blur(40px)" }} />
      <div style={{ position: "relative", zIndex: 2, padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "hsl(var(--glamora-gold-light))", fontWeight: 600 }}>
            AI Beauty Analysis
          </div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, color: "white", marginTop: 8 }}>
            Discover Your <em style={{ fontStyle: "italic", color: "hsl(var(--glamora-gold-light))" }}>Signature</em> Look
          </div>
        </div>
        <button
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 20px",
            background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
            borderRadius: 14, color: "white", fontSize: 13, fontWeight: 600,
            cursor: "pointer", border: "none", fontFamily: "'Jost', sans-serif",
            letterSpacing: 0.5, boxShadow: "0 6px 20px hsla(12 39% 54% / 0.4)",
            alignSelf: "flex-start",
          }}
        >
          Upload Selfie 📸
        </button>
      </div>
    </div>

    {/* Trending Looks */}
    <div style={{ padding: "0 22px", marginTop: 28 }}>
      <div className="section-label">Trending Looks</div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
        {trendingLooks.map((look) => (
          <div
            key={look.name}
            className="glamora-card anim-fadeUp"
            style={{
              minWidth: 130, padding: "18px 16px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              cursor: "pointer", border: "1px solid hsla(36 50% 53% / 0.1)",
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 16, background: look.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
              {look.emoji}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--glamora-char))" }}>{look.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* For You — dynamic visual */}
    <div style={{ padding: "0 22px", marginTop: 28 }}>
      <div className="section-label">For You</div>
      <div className="glamora-card anim-fadeUp d2" style={{ overflow: "hidden" }}>
        <DynamicVisual height={160} variant="card" borderRadius={0} />
        <div style={{ padding: "16px 18px" }}>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: "hsl(var(--glamora-char))" }}>Today's Curated Looks</div>
          <p style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginTop: 6, lineHeight: 1.5 }}>
            Personalized style inspiration — refreshed every visit.
          </p>
        </div>
      </div>
    </div>

    {/* Products — dynamic visual */}
    <div style={{ padding: "0 22px", marginTop: 20 }}>
      <div className="glamora-card anim-fadeUp d3" style={{ overflow: "hidden" }}>
        <DynamicVisual height={140} variant="card" borderRadius={0} />
        <div style={{ padding: "16px 18px" }}>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: "hsl(var(--glamora-char))" }}>Recommended Products</div>
          <p style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginTop: 6, lineHeight: 1.5 }}>
            Top-rated products matched to your skin tone.
          </p>
        </div>
      </div>
    </div>

    {/* Bottom Nav */}
    <div className="bottom-nav">
      <button className="nav-btn active"><span className="nav-icon">🏠</span><span className="nav-label">Home</span></button>
      <button className="nav-btn" onClick={onUpload}><span className="nav-icon">📸</span><span className="nav-label">Scan</span></button>
      <button className="nav-btn" onClick={onSaved}><span className="nav-icon">💾</span><span className="nav-label">Saved</span></button>
      <button className="nav-btn" onClick={onProfile}><span className="nav-icon">👤</span><span className="nav-label">Profile</span></button>
    </div>
  </div>
);

export default HomeScreen;
