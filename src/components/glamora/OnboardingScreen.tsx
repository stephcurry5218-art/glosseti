import { useState } from "react";
import { Shirt, ShoppingBag, Sparkles, ScanFace, User } from "lucide-react";
import DynamicVisual from "./DynamicVisual";
import type { Gender } from "./GlamoraApp";

interface Props { onStart: (gender: Gender) => void; }

const features = [
  { Icon: Shirt, title: "Complete Style Guide", sub: "Head-to-toe outfit recommendations" },
  { Icon: ShoppingBag, title: "Shop by Budget", sub: "Luxury, moderate & budget options" },
  { Icon: ScanFace, title: "Makeup & Grooming", sub: "Optional beauty breakdown included" },
  { Icon: Sparkles, title: "AI Analysis", sub: "Personalized to your body & features" },
];

const OnboardingScreen = ({ onStart }: Props) => {
  const [gender, setGender] = useState<Gender>("female");

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 100 }}>
      <div style={{ height: 340, position: "relative", overflow: "hidden", borderRadius: "0 0 36px 36px" }}>
        <DynamicVisual width="100%" height="100%" variant="onboarding" style={{ position: "absolute", inset: 0 }} />
        <div
          className="anim-fadeIn"
          style={{
            position: "absolute", top: 54, right: 20, padding: "8px 16px",
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100,
            fontSize: 12, color: "white", fontWeight: 500, letterSpacing: 0.5, zIndex: 10,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <Sparkles size={14} /> AI Powered
        </div>
      </div>

      <div style={{ padding: "28px 24px 0" }}>
        <div className="anim-fadeUp" style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "hsl(var(--glamora-gold))", fontWeight: 600, marginBottom: 10 }}>
          Welcome to Glamora
        </div>
        <h1 className="serif anim-fadeUp d1" style={{ fontSize: 36, lineHeight: 1.08, fontWeight: 400, color: "hsl(var(--glamora-char))", marginBottom: 14 }}>
          Your <em style={{ fontStyle: "italic", color: "hsl(var(--glamora-rose-dark))" }}>Complete</em> Style, Curated.
        </h1>
        <p className="anim-fadeUp d2" style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.7, marginBottom: 24 }}>
          Upload a photo and get a full style breakdown — from shoes to shirts, watches to bags, with makeup as an option. Three price points for every piece.
        </p>

        {/* Gender selector */}
        <div className="anim-fadeUp d2" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "hsl(var(--glamora-gray))", fontWeight: 600, marginBottom: 10 }}>
            Style me as
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {([
              { id: "female" as Gender, label: "Women's", desc: "Feminine styles", accent: "var(--glamora-rose-dark)" },
              { id: "male" as Gender, label: "Men's", desc: "Masculine styles", accent: "var(--glamora-gold)" },
            ]).map(opt => (
              <button
                key={opt.id}
                onClick={() => setGender(opt.id)}
                style={{
                  flex: 1, padding: "16px 12px", borderRadius: 16,
                  border: gender === opt.id
                    ? `2px solid hsl(${opt.accent})`
                    : "1.5px solid hsla(var(--glamora-gray-light) / 0.3)",
                  background: gender === opt.id
                    ? `hsla(${opt.accent} / 0.1)`
                    : "hsl(var(--card))",
                  cursor: "pointer", fontFamily: "'Jost', sans-serif",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <User size={28} color={gender === opt.id ? `hsl(${opt.accent})` : "hsl(var(--glamora-gray))"} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{opt.label}</span>
                <span style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="anim-fadeUp d3" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {features.map((f) => (
            <div key={f.title} className="glamora-card" style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 16px", border: "1px solid hsla(24 38% 48% / 0.12)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", background: "hsla(var(--glamora-rose) / 0.12)", flexShrink: 0 }}>
                <f.Icon size={20} color="hsl(var(--glamora-rose-dark))" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 2 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary btn-rose anim-fadeUp d4" onClick={() => onStart(gender)}>
          Get Styled
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
