import { Bookmark, Heart, Scissors, Sparkles } from "lucide-react";
import { lookMeta } from "./lookData";
import type { Gender } from "./GlamoraApp";

interface Props {
  onBack: () => void;
  savedStyles: string[];
  onLookSelect: (name: string) => void;
  onGetStyled: () => void;
  gender: Gender;
}

const SavedLooksScreen = ({ onBack, savedStyles, onLookSelect, onGetStyled, gender }: Props) => {
  const isMale = gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Saved Styles</div>
          <div className="header-sub">Your curated collection</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        {savedStyles.length > 0 ? (
          <>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 16 }}>
              Tap any style to view the full guide with shopping links
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {savedStyles.map((name, i) => {
                const meta = lookMeta[name] || { match: 90, desc: "Custom style" };
                return (
                  <div key={name} className={`glamora-card anim-fadeUp d${i + 1}`} onClick={() => onLookSelect(name)}
                    style={{ padding: "20px 18px", display: "flex", alignItems: "center", gap: 16, border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15)`, cursor: "pointer" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: `linear-gradient(135deg, hsla(${accentLight} / 0.15), hsla(${accent} / 0.1))`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles size={24} color={`hsl(${accent})`} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{name}</div>
                      <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{meta.desc}</div>
                      <div style={{ fontSize: 11, color: "hsl(var(--glamora-success))", marginTop: 4, fontWeight: 600 }}>{meta.match}% match</div>
                    </div>
                    <Heart size={20} color={`hsl(${accent})`} fill={`hsl(${accent})`} />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="anim-fadeUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
            <Bookmark size={64} color="hsl(var(--glamora-gray))" strokeWidth={1} style={{ marginBottom: 20 }} />
            <div className="serif" style={{ fontSize: 22, color: "hsl(var(--glamora-char))", marginBottom: 8 }}>No Saved Styles Yet</div>
            <p style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.6, marginBottom: 28 }}>Get styled and save your results to build your collection.</p>
            <button className="btn-primary btn-rose" style={{
              maxWidth: 260,
              background: isMale ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))" : undefined,
            }} onClick={onGetStyled}>Get Styled Now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedLooksScreen;
