import DynamicVisual from "./DynamicVisual";

interface Props { onStart: () => void; }

const features = [
  { icon: "👗", bg: "hsla(12 52% 85% / 0.4)", title: "Complete Style Guide", sub: "Head-to-toe outfit recommendations" },
  { icon: "🛍️", bg: "hsla(36 72% 88% / 0.6)", title: "Shop by Budget", sub: "Luxury, moderate & budget options" },
  { icon: "💄", bg: "hsla(12 39% 54% / 0.2)", title: "Makeup & Grooming", sub: "Optional beauty breakdown included" },
  { icon: "✨", bg: "hsla(140 24% 58% / 0.2)", title: "AI Analysis", sub: "Personalized to your body & features" },
];

const OnboardingScreen = ({ onStart }: Props) => (
  <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 100 }}>
    <div style={{ height: 340, position: "relative", overflow: "hidden", borderRadius: "0 0 36px 36px" }}>
      <DynamicVisual width="100%" height="100%" variant="hero" style={{ position: "absolute", inset: 0 }} />
      <div
        className="anim-fadeIn"
        style={{
          position: "absolute", top: 54, right: 20, padding: "8px 16px",
          background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.4)", borderRadius: 100,
          fontSize: 12, color: "white", fontWeight: 500, letterSpacing: 0.5, zIndex: 10,
        }}
      >
        ✨ AI Powered
      </div>
    </div>

    <div style={{ padding: "28px 24px 0" }}>
      <div className="anim-fadeUp" style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "hsl(var(--glamora-gold))", fontWeight: 600, marginBottom: 10 }}>
        Welcome to Glamora
      </div>
      <h1 className="serif anim-fadeUp d1" style={{ fontSize: 36, lineHeight: 1.08, fontWeight: 400, color: "hsl(var(--glamora-char))", marginBottom: 14 }}>
        Your <em style={{ fontStyle: "italic", color: "hsl(var(--glamora-rose-dark))" }}>Complete</em> Style, Curated.
      </h1>
      <p className="anim-fadeUp d2" style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.7, marginBottom: 28 }}>
        Upload a photo and get a full style breakdown — from shoes to shirts, watches to bags, with makeup as an option. Three price points for every piece.
      </p>

      <div className="anim-fadeUp d3" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        {features.map((f) => (
          <div key={f.title} className="glamora-card" style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px", border: "1px solid hsla(36 50% 53% / 0.12)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, background: f.bg, flexShrink: 0 }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{f.title}</div>
              <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 2 }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-primary btn-rose anim-fadeUp d4" onClick={onStart}>
        Get Styled ✨
      </button>
    </div>
  </div>
);

export default OnboardingScreen;
