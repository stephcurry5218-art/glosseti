import { Bookmark, Heart, Scissors, Sparkles } from "lucide-react";
import { lookMeta } from "./lookData";

interface Props {
  onBack: () => void;
  savedStyles: string[];
  onLookSelect: (name: string) => void;
  onGetStyled: () => void;
}

const SavedLooksScreen = ({ onBack, savedStyles, onLookSelect, onGetStyled }: Props) => (
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
                  style={{ padding: "20px 18px", display: "flex", alignItems: "center", gap: 16, border: "1px solid hsla(24 38% 48% / 0.12)", cursor: "pointer" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.15), hsla(var(--glamora-gold) / 0.1))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={24} color="hsl(var(--glamora-rose-dark))" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{name}</div>
                    <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{meta.desc}</div>
                    <div style={{ fontSize: 11, color: "hsl(var(--glamora-success))", marginTop: 4, fontWeight: 600 }}>{meta.match}% match</div>
                  </div>
                  <Heart size={20} color="hsl(var(--glamora-rose-dark))" fill="hsl(var(--glamora-rose-dark))" />
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
          <button className="btn-primary btn-rose" style={{ maxWidth: 260 }} onClick={onGetStyled}>Get Styled Now</button>
        </div>
      )}
    </div>
  </div>
);

export default SavedLooksScreen;
