import DynamicVisual from "./DynamicVisual";

interface Props { onStart: () => void; }

const features = [
  { icon: "📸", bg: "hsla(12 52% 85% / 0.4)", title: "Upload a Selfie", sub: "Quick & easy photo analysis" },
  { icon: "✨", bg: "hsla(36 72% 88% / 0.6)", title: "AI Face Analysis", sub: "Skin tone, face shape & features" },
  { icon: "💄", bg: "hsla(12 39% 54% / 0.2)", title: "Personalized Looks", sub: "Curated makeup recommendations" },
];

const OnboardingScreen = ({ onStart }: Props) => (
  <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 100 }}>
    {/* Hero */}
    <div style={{ height: 380, position: "relative", overflow: "hidden", borderRadius: "0 0 36px 36px" }}>
      <DynamicVisual width="100%" height="100%" variant="hero" style={{ position: "absolute", inset: 0 }} />
      <div
        className="anim-fadeIn"
        style={{
          position: "absolute", top: 54, right: 20, padding: "8px 16px",
          background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.4)", borderRadius: 100,
          fontSize: 12, color: "white", fontWeight: 500, letterSpacing: 0.5,
          zIndex: 10,
        }}
      >
        ✨ AI Powered
      </div>
    </div>

    {/* Body */}
    <div style={{ padding: "32px 24px 0" }}>
      <div className="anim-fadeUp" style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "hsl(var(--glamora-gold))", fontWeight: 600, marginBottom: 10 }}>
        Welcome to Glamora
      </div>
      <h1 className="serif anim-fadeUp d1" style={{ fontSize: 40, lineHeight: 1.08, fontWeight: 400, color: "hsl(var(--glamora-char))", marginBottom: 16 }}>
        Your <em style={{ fontStyle: "italic", color: "hsl(var(--glamora-rose-dark))" }}>Perfect</em> Look, Found.
      </h1>
      <p className="anim-fadeUp d2" style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.7, marginBottom: 32 }}>
        Upload a selfie and let our AI analyze your unique features to recommend personalized makeup looks, tutorials, and products.
      </p>

      <div className="anim-fadeUp d3" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
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
        Get Started ✨
      </button>
    </div>
  </div>
);

export default OnboardingScreen;
