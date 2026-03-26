import { Home, Scissors, Bookmark, User, ArrowRight, Sparkles, TrendingUp, Star, Crown } from "lucide-react";
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
  { title: "Sharp & Polished", sub: "Tailored fits, clean sneakers" },
  { title: "Street Edge", sub: "Oversized layers, bold kicks" },
  { title: "Weekend Easy", sub: "Relaxed denim, henley vibes" },
];

const femaleInspo = [
  { title: "Effortless Glam", sub: "Silk textures, gold accents" },
  { title: "Bold & Beautiful", sub: "Statement colors, fierce looks" },
  { title: "Soft Feminine", sub: "Flowy fabrics, pastel tones" },
];

const HomeScreen = ({ onGetStyled, onProfile, onSaved, savedCount, gender }: Props) => {
  const isMale = gender === "male";
  const inspo = isMale ? maleInspo : femaleInspo;

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: "48px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div className="serif" style={{ fontSize: 28, fontWeight: 400, letterSpacing: 3 }}>
            GLAMORA<span style={{ color: isMale ? "hsl(var(--glamora-gold))" : "hsl(var(--glamora-rose-dark))" }}>.</span>
          </div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 2, letterSpacing: 0.5 }}>
            {isMale ? "Men's Style Studio" : "Women's Style Studio"}
          </div>
        </div>
        <button
          onClick={onProfile}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: isMale
              ? "linear-gradient(135deg, hsl(var(--glamora-gold)) 0%, hsl(var(--glamora-gold-light)) 100%)"
              : "linear-gradient(135deg, hsl(var(--glamora-rose)) 0%, hsl(var(--glamora-rose-dark)) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", border: "none",
            boxShadow: isMale ? "0 4px 14px hsla(28 40% 52% / 0.3)" : "0 4px 14px hsla(18 32% 42% / 0.3)",
          }}
        >
          <User size={18} color="white" />
        </button>
      </div>

      {/* Hero — big visual CTA */}
      <div
        className="anim-fadeUp"
        onClick={onGetStyled}
        style={{ margin: "20px 22px", borderRadius: 28, overflow: "hidden", position: "relative", height: 260, cursor: "pointer" }}
      >
        <DynamicVisual width="100%" height="100%" variant="hero" style={{ position: "absolute", inset: 0 }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: isMale
            ? "linear-gradient(180deg, hsla(20 18% 6% / 0.3) 0%, hsla(20 18% 6% / 0.85) 100%)"
            : "linear-gradient(180deg, hsla(18 28% 12% / 0.2) 0%, hsla(18 28% 12% / 0.85) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 4, padding: "28px 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: isMale ? "hsl(var(--glamora-gold-light))" : "hsl(var(--glamora-rose-dark))", fontWeight: 600, marginBottom: 6 }}>
            {isMale ? "AI Menswear Studio" : "AI Beauty & Style"}
          </div>
          <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, color: "white", marginBottom: 16 }}>
            {isMale
              ? <>Discover Your <em style={{ fontStyle: "italic", color: "hsl(var(--glamora-gold-light))" }}>Signature</em> Style</>
              : <>Get Your <em style={{ fontStyle: "italic", color: "hsl(var(--glamora-rose-dark))" }}>Complete</em> Look</>
            }
          </div>
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px",
              background: isMale
                ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
                : "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
              borderRadius: 16, color: "white", fontSize: 14, fontWeight: 600,
              cursor: "pointer", border: "none", fontFamily: "'Jost', sans-serif",
              letterSpacing: 0.5, boxShadow: "0 6px 20px hsla(0 0% 0% / 0.3)", alignSelf: "flex-start",
            }}
          >
            Start Styling <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Trending Inspiration — unique to home */}
      <div style={{ padding: "0 22px", marginTop: 20 }}>
        <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TrendingUp size={14} color="hsl(var(--glamora-gray))" /> Trending For You
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {inspo.map((item, i) => (
            <div
              key={item.title}
              className={`glamora-card anim-fadeUp d${i + 1}`}
              onClick={onGetStyled}
              style={{
                minWidth: 160, padding: "18px 16px", cursor: "pointer",
                border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15)`,
                background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.06), transparent)`,
              }}
            >
              <Star size={18} color={isMale ? "hsl(var(--glamora-gold))" : "hsl(var(--glamora-rose-dark))"} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* What's Included */}
      <div style={{ padding: "0 22px", marginTop: 22 }}>
        <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Crown size={14} color="hsl(var(--glamora-gray))" /> What You Get
        </div>
        <div className="glamora-card anim-fadeUp d2" style={{ overflow: "hidden" }}>
          <DynamicVisual height={130} variant="card" borderRadius={0} />
          <div style={{ padding: "16px 18px" }}>
            <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: "hsl(var(--glamora-char))" }}>
              {isMale ? "Full Fit Breakdown" : "Head-to-Toe Style Guide"}
            </div>
            <p style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginTop: 6, lineHeight: 1.5 }}>
              {isMale
                ? "Outfits, sneakers, watches, grooming — with 3 price points for every item."
                : "Outfits, shoes, accessories, makeup — with 3 price points for every item."}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: "0 22px", marginTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="glamora-card anim-fadeUp d3" onClick={onSaved} style={{ padding: "20px 16px", cursor: "pointer", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <Bookmark size={28} color={isMale ? "hsl(var(--glamora-gold))" : "hsl(var(--glamora-rose-dark))"} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Saved Styles</div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{savedCount} look{savedCount !== 1 ? "s" : ""}</div>
          </div>
          <div className="glamora-card anim-fadeUp d4" onClick={onGetStyled} style={{ padding: "20px 16px", cursor: "pointer", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <Sparkles size={28} color={isMale ? "hsl(var(--glamora-gold))" : "hsl(var(--glamora-rose-dark))"} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>New Look</div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>AI-powered</div>
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
