import { Ruler, Palette, Sparkles, Diamond, Eye, Bookmark } from "lucide-react";
import type { UserPrefs } from "./GlamoraApp";
import { styleLooks } from "./lookData";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: UserPrefs;
  onBack: () => void;
  onHome: () => void;
  onSave: (lookNames: string[]) => void;
  onLookSelect: (name: string) => void;
}

const analysis = {
  bodyType: "Athletic",
  faceShape: "Oval",
  skinTone: "Warm Medium",
  undertone: "Golden",
  colorSeason: "Warm Autumn",
  features: ["High cheekbones", "Broad shoulders", "Proportional waist"],
};

const ResultsScreen = ({ prefs, onBack, onHome, onSave, onLookSelect }: Props) => {
  const isMakeup = prefs.styleCategory === "makeup-only";
  const looks = styleLooks[prefs.styleCategory] || styleLooks["full-style"];

  const analysisCards: { label: string; value: string; Icon: LucideIcon }[] = isMakeup
    ? [
        { label: "Face Shape", value: analysis.faceShape, Icon: Diamond },
        { label: "Skin Tone", value: analysis.skinTone, Icon: Palette },
        { label: "Undertone", value: analysis.undertone, Icon: Sparkles },
        { label: "Key Feature", value: analysis.features[0], Icon: Eye },
      ]
    : [
        { label: "Body Type", value: analysis.bodyType, Icon: Ruler },
        { label: "Color Season", value: analysis.colorSeason, Icon: Palette },
        { label: "Skin Tone", value: analysis.skinTone, Icon: Sparkles },
        { label: "Face Shape", value: analysis.faceShape, Icon: Diamond },
      ];

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40 }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Your Style Profile</div>
          <div className="header-sub">{isMakeup ? "AI Beauty Analysis" : "AI Style Analysis"}</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        <div className="glamora-card anim-fadeUp" style={{ padding: "24px 20px", marginBottom: 20 }}>
          <div className="section-label">{isMakeup ? "Face Analysis" : "Style Profile"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {analysisCards.map((item) => (
              <div key={item.label} style={{ padding: "14px 12px", borderRadius: 16, background: "hsla(var(--glamora-rose) / 0.08)", border: "1px solid hsla(24 38% 48% / 0.1)" }}>
                <item.Icon size={22} color="hsl(var(--glamora-rose-dark))" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="anim-fadeUp d2" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {analysis.features.map((f) => (<span key={f} className="pill-tag">{f}</span>))}
        </div>

        <div className="section-label anim-fadeUp d3">Recommended Styles</div>
        <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 12, marginTop: -8 }}>
          Tap a style for the complete guide with shopping links
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          {looks.map((look, i) => (
            <div key={look.name} className={`glamora-card anim-fadeUp d${i + 3}`} onClick={() => onLookSelect(look.name)}
              style={{ padding: "18px 18px", display: "flex", alignItems: "center", gap: 16, border: "1px solid hsla(24 38% 48% / 0.12)", cursor: "pointer" }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.15), hsla(var(--glamora-gold) / 0.1))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={24} color="hsl(var(--glamora-rose-dark))" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{look.name}</div>
                <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 3 }}>{look.desc}</div>
              </div>
              <div style={{ padding: "6px 12px", borderRadius: 100, background: "hsla(var(--glamora-success) / 0.15)", fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-success))" }}>{look.match}%</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-primary btn-rose" onClick={() => onSave(looks.map(l => l.name))} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Save All Styles <Bookmark size={16} />
          </button>
          <button className="btn-primary btn-ghost" onClick={onHome}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
