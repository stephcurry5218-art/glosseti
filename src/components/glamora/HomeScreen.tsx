import { Home, Scissors, Bookmark, User, Shirt, Flame, Heart, Clock, Dumbbell, Briefcase, Smile, Palette, ArrowRight } from "lucide-react";
import DynamicVisual from "./DynamicVisual";

interface Props {
  onGetStyled: () => void;
  onProfile: () => void;
  onSaved: () => void;
  savedCount: number;
}

const styleCategories = [
  { name: "Full Style", Icon: Shirt },
  { name: "Streetwear", Icon: Flame },
  { name: "Minimalist", Icon: Heart },
  { name: "Vintage", Icon: Clock },
  { name: "Athleisure", Icon: Dumbbell },
  { name: "Formal", Icon: Briefcase },
  { name: "Casual", Icon: Smile },
  { name: "Makeup", Icon: Palette },
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
          cursor: "pointer", border: "none",
          boxShadow: "0 4px 14px hsla(18 32% 42% / 0.3)",
        }}
      >
        <User size={18} color="hsl(var(--glamora-char))" />
      </button>
    </div>

    {/* Hero card */}
    <div
      className="anim-fadeUp"
      onClick={onGetStyled}
      style={{ margin: "20px 22px", borderRadius: 26, overflow: "hidden", position: "relative", height: 220, cursor: "pointer" }}
    >
      <DynamicVisual width="100%" height="100%" variant="hero" style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", zIndex: 4, padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
            letterSpacing: 0.5, boxShadow: "0 6px 20px hsla(18 32% 42% / 0.4)", alignSelf: "flex-start",
          }}
        >
          Start Styling <ArrowRight size={14} />
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
              cursor: "pointer", border: "1px solid hsla(24 38% 48% / 0.1)",
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "hsla(var(--glamora-rose) / 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <cat.Icon size={22} color="hsl(var(--glamora-rose-dark))" />
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <Bookmark size={28} color="hsl(var(--glamora-rose-dark))" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Saved Styles</div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{savedCount} look{savedCount !== 1 ? "s" : ""}</div>
        </div>
        <div className="glamora-card anim-fadeUp d4" onClick={onProfile} style={{ padding: "20px 16px", cursor: "pointer", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <User size={28} color="hsl(var(--glamora-rose-dark))" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>My Profile</div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>Style journey</div>
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

export default HomeScreen;
