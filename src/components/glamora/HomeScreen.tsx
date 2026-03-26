import DynamicVisual from "./DynamicVisual";

interface Props {
  onGetStyled: () => void;
  onProfile: () => void;
  onSaved: () => void;
  savedCount: number;
}

const styleCategories = [
  { name: "Full Style", emoji: "👗", color: "hsla(12 52% 85% / 0.4)" },
  { name: "Streetwear", emoji: "🔥", color: "hsla(36 72% 88% / 0.6)" },
  { name: "Minimalist", emoji: "🤍", color: "hsla(16 20% 11% / 0.08)" },
  { name: "Vintage", emoji: "🕺", color: "hsla(36 50% 53% / 0.2)" },
  { name: "Athleisure", emoji: "🏃", color: "hsla(140 24% 58% / 0.2)" },
  { name: "Formal", emoji: "🤵", color: "hsla(16 20% 11% / 0.12)" },
  { name: "Casual", emoji: "😎", color: "hsla(0 60% 70% / 0.15)" },
  { name: "Makeup", emoji: "💄", color: "hsla(0 60% 70% / 0.3)" },
];

const HomeScreen = ({ onGetStyled, onProfile, onSaved, savedCount }: Props) => (
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
      onClick={onGetStyled}
      style={{ margin: "20px 22px", borderRadius: 26, overflow: "hidden", position: "relative", height: 220, cursor: "pointer" }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, hsl(var(--glamora-char)) 0%, hsl(var(--glamora-char2)) 100%)" }} />
      <div className="absolute rounded-full" style={{ width: 160, height: 160, top: -30, right: -20, background: "hsla(12 39% 54% / 0.3)", filter: "blur(40px)" }} />
      <div className="absolute rounded-full" style={{ width: 120, height: 120, bottom: -20, left: 20, background: "hsla(36 50% 53% / 0.2)", filter: "blur(40px)" }} />
      <div style={{ position: "relative", zIndex: 2, padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "hsl(var(--glamora-gold-light))", fontWeight: 600 }}>
            AI Style Studio
          </div>
          <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, color: "white", marginTop: 8 }}>
            Get Your <em style={{ fontStyle: "italic", color: "hsl(var(--glamora-gold-light))" }}>Complete</em> Look
          </div>
        </div>
        <button
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px",
            background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
            borderRadius: 14, color: "white", fontSize: 13, fontWeight: 600,
            cursor: "pointer", border: "none", fontFamily: "'Jost', sans-serif",
            letterSpacing: 0.5, boxShadow: "0 6px 20px hsla(12 39% 54% / 0.4)", alignSelf: "flex-start",
          }}
        >
          Start Styling 👗
        </button>
      </div>
    </div>

    {/* Style Categories */}
    <div style={{ padding: "0 22px", marginTop: 24 }}>
      <div className="section-label">Style Categories</div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
        {styleCategories.map((cat) => (
          <div
            key={cat.name}
            className="glamora-card anim-fadeUp"
            onClick={onGetStyled}
            style={{
              minWidth: 110, padding: "16px 14px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              cursor: "pointer", border: "1px solid hsla(36 50% 53% / 0.1)",
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              {cat.emoji}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "hsl(var(--glamora-char))" }}>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* What's Included */}
    <div style={{ padding: "0 22px", marginTop: 24 }}>
      <div className="section-label">What You Get</div>
      <div className="glamora-card anim-fadeUp d2" style={{ overflow: "hidden" }}>
        <DynamicVisual height={140} variant="card" borderRadius={0} />
        <div style={{ padding: "16px 18px" }}>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: "hsl(var(--glamora-char))" }}>Head-to-Toe Style Guide</div>
          <p style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginTop: 6, lineHeight: 1.5 }}>
            Outfits, shoes, accessories, makeup — with 3 price points for every item.
          </p>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div style={{ padding: "0 22px", marginTop: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="glamora-card anim-fadeUp d3" onClick={onSaved} style={{ padding: "20px 16px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💾</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Saved Styles</div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{savedCount} look{savedCount !== 1 ? "s" : ""}</div>
        </div>
        <div className="glamora-card anim-fadeUp d4" onClick={onProfile} style={{ padding: "20px 16px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👤</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>My Profile</div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>Style journey</div>
        </div>
      </div>
    </div>

    {/* Bottom Nav */}
    <div className="bottom-nav">
      <button className="nav-btn active"><span className="nav-icon">🏠</span><span className="nav-label">Home</span></button>
      <button className="nav-btn" onClick={onGetStyled}><span className="nav-icon">👗</span><span className="nav-label">Style</span></button>
      <button className="nav-btn" onClick={onSaved}><span className="nav-icon">💾</span><span className="nav-label">Saved</span></button>
      <button className="nav-btn" onClick={onProfile}><span className="nav-icon">👤</span><span className="nav-label">Profile</span></button>
    </div>
  </div>
);

export default HomeScreen;
