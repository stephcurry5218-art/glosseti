import type { UserPrefs } from "./GlamoraApp";

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

const styleLooks: Record<string, { name: string; desc: string; emoji: string; match: number }[]> = {
  "full-style": [
    { name: "Soft Glam", desc: "Elegant & refined — silk, rose gold, satin", emoji: "🌸", match: 96 },
    { name: "Golden Hour", desc: "Warm earth tones — suede, bronze, cognac", emoji: "🌅", match: 93 },
    { name: "Berry Chic", desc: "Bold & polished — black, berry, silver", emoji: "🍇", match: 89 },
  ],
  streetwear: [
    { name: "Soft Glam", desc: "Elevated streetwear with soft tones", emoji: "🌸", match: 94 },
    { name: "Golden Hour", desc: "Warm vintage-inspired urban style", emoji: "🌅", match: 91 },
    { name: "Berry Chic", desc: "Edgy dark-toned street look", emoji: "🍇", match: 87 },
  ],
  formal: [
    { name: "Soft Glam", desc: "Soft sophistication for events", emoji: "🌸", match: 97 },
    { name: "Golden Hour", desc: "Warm-toned business elegance", emoji: "🌅", match: 92 },
    { name: "Berry Chic", desc: "Power dressing in dark tones", emoji: "🍇", match: 90 },
  ],
  casual: [
    { name: "Soft Glam", desc: "Effortless everyday elegance", emoji: "🌸", match: 95 },
    { name: "Golden Hour", desc: "Relaxed earthy casual look", emoji: "🌅", match: 93 },
    { name: "Berry Chic", desc: "Cool-toned minimal daily style", emoji: "🍇", match: 88 },
  ],
  "makeup-only": [
    { name: "Soft Glam", desc: "Natural glow with rose tones", emoji: "🌸", match: 96 },
    { name: "Golden Hour", desc: "Warm bronze with gold highlights", emoji: "🌅", match: 93 },
    { name: "Berry Chic", desc: "Deep berry lips, minimal eyes", emoji: "🍇", match: 89 },
  ],
};

const ResultsScreen = ({ prefs, onBack, onHome, onSave, onLookSelect }: Props) => {
  const isMakeup = prefs.styleCategory === "makeup-only";
  const looks = styleLooks[prefs.styleCategory] || styleLooks["full-style"];

  const analysisCards = isMakeup
    ? [
        { label: "Face Shape", value: analysis.faceShape, icon: "💎" },
        { label: "Skin Tone", value: analysis.skinTone, icon: "🎨" },
        { label: "Undertone", value: analysis.undertone, icon: "✨" },
        { label: "Key Feature", value: analysis.features[0], icon: "👁️" },
      ]
    : [
        { label: "Body Type", value: analysis.bodyType, icon: "📐" },
        { label: "Color Season", value: analysis.colorSeason, icon: "🎨" },
        { label: "Skin Tone", value: analysis.skinTone, icon: "✨" },
        { label: "Face Shape", value: analysis.faceShape, icon: "💎" },
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
        {/* Analysis card */}
        <div className="glamora-card anim-fadeUp" style={{ padding: "24px 20px", marginBottom: 20 }}>
          <div className="section-label">{isMakeup ? "Face Analysis" : "Style Profile"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {analysisCards.map((item) => (
              <div key={item.label} style={{ padding: "14px 12px", borderRadius: 16, background: "hsla(30 33% 96% / 0.8)", border: "1px solid hsla(36 50% 53% / 0.1)" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="anim-fadeUp d2" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {analysis.features.map((f) => (
            <span key={f} className="pill-tag">{f}</span>
          ))}
        </div>

        {/* Recommended looks */}
        <div className="section-label anim-fadeUp d3">Recommended Styles</div>
        <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 12, marginTop: -8 }}>
          Tap a style for the complete guide with shopping links →
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          {looks.map((look, i) => (
            <div
              key={look.name}
              className={`glamora-card anim-fadeUp d${i + 3}`}
              onClick={() => onLookSelect(look.name)}
              style={{ padding: "18px 18px", display: "flex", alignItems: "center", gap: 16, border: "1px solid hsla(36 50% 53% / 0.12)", cursor: "pointer" }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, hsla(12 52% 85% / 0.5), hsla(36 72% 88% / 0.5))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0,
              }}>
                {look.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{look.name}</div>
                <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 3 }}>{look.desc}</div>
              </div>
              <div style={{ padding: "6px 12px", borderRadius: 100, background: "hsla(140 24% 58% / 0.15)", fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-success))" }}>
                {look.match}%
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-primary btn-rose" onClick={() => onSave(looks.map(l => l.name))}>
            Save All Styles 💾
          </button>
          <button className="btn-primary btn-ghost" onClick={onHome}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
