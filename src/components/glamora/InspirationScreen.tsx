import { useState, useRef } from "react";
import { Sparkles, Star, Camera, UserRound, Sun, CircleOff, ArrowRight, Info, ShirtIcon } from "lucide-react";
import type { UserPrefs, PhotoType, GenerationMode } from "./GlamoraApp";

interface Props {
  prefs: UserPrefs;
  onBack: () => void;
  onGenerate: (iconName: string, file: File | null, photoType: PhotoType, base64: string | null, mode: GenerationMode) => void;
}

const InspirationScreen = ({ prefs, onBack, onGenerate }: Props) => {
  const [iconName, setIconName] = useState("");
  const [photoType, setPhotoType] = useState<PhotoType>(prefs.photoType);
  const [mode, setMode] = useState<GenerationMode>("on-me");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isMale = prefs.gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";
  const isMannequin = mode === "mannequin";

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      setBase64(result);
    };
    reader.readAsDataURL(f);
  };

  const canSubmit = iconName.trim().length >= 2 && (isMannequin || (file && base64));

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40 }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Style Inspiration</div>
          <div className="header-sub">Channel any aesthetic you love</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Icon input */}
        <div className="glamora-card anim-fadeUp" style={{
          padding: "20px 18px", marginBottom: 16,
          border: `1.5px solid hsla(${accent} / 0.2)`,
          background: `linear-gradient(160deg, hsla(${accent} / 0.04), hsl(var(--card)))`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Star size={20} color={`hsl(${accent})`} />
            <div className="serif" style={{ fontSize: 18, color: "hsl(var(--glamora-char))" }}>
              Who inspires your style?
            </div>
          </div>
          <input
            type="text"
            value={iconName}
            onChange={(e) => setIconName(e.target.value)}
            placeholder={isMale ? "e.g., David Beckham, A$AP Rocky..." : "e.g., Rihanna, Zendaya, Hailey Bieber..."}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 14,
              border: `1.5px solid hsla(${accent} / 0.2)`,
              background: "hsla(var(--glamora-char) / 0.04)",
              fontFamily: "'Jost', sans-serif", fontSize: 14,
              color: "hsl(var(--glamora-char))",
              outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = `hsl(${accent})`}
            onBlur={(e) => e.target.style.borderColor = `hsla(${accent} / 0.2)`}
          />
          <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 8, lineHeight: 1.5 }}>
            Enter any celebrity, influencer, or style icon. We'll extract their general aesthetic — not their identity.
          </div>
        </div>

        {/* Mode toggle: On Me vs Mannequin */}
        <div className="anim-fadeUp d1" style={{
          display: "flex", gap: 6, marginBottom: 16,
          background: "hsl(var(--card))",
          borderRadius: 16, padding: 4,
          border: "1px solid hsla(var(--glamora-gold) / 0.1)",
        }}>
          {([
            { id: "on-me" as GenerationMode, label: "On Me", Icon: UserRound, desc: "Apply to your photo" },
            { id: "mannequin" as GenerationMode, label: "Mannequin", Icon: ShirtIcon, desc: "See the outfit" },
          ]).map(opt => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 12,
                border: "none",
                background: mode === opt.id
                  ? `linear-gradient(135deg, hsl(${accent}), hsl(${isMale ? "var(--glamora-gold-light)" : "var(--glamora-gold)"}))`
                  : "transparent",
                cursor: "pointer", fontFamily: "'Jost', sans-serif",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                transition: "all 0.25s ease",
              }}
            >
              <opt.Icon size={20} color={mode === opt.id ? "white" : `hsl(var(--glamora-gray))`} />
              <span style={{
                fontSize: 12, fontWeight: 600,
                color: mode === opt.id ? "white" : "hsl(var(--glamora-char))",
              }}>{opt.label}</span>
              <span style={{
                fontSize: 10,
                color: mode === opt.id ? "hsla(0 0% 100% / 0.75)" : "hsl(var(--glamora-gray))",
              }}>{opt.desc}</span>
            </button>
          ))}
        </div>

        {/* Photo type selector — only for on-me mode */}
        {!isMannequin && (
          <div className="anim-fadeUp d1" style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {([
              { id: "selfie" as PhotoType, label: "Selfie", Icon: Camera, desc: "Face & upper body" },
              { id: "full-body" as PhotoType, label: "Full Body", Icon: UserRound, desc: "Head to toe" },
            ]).map(opt => (
              <button
                key={opt.id}
                onClick={() => setPhotoType(opt.id)}
                style={{
                  flex: 1, padding: "14px 12px", borderRadius: 16,
                  border: photoType === opt.id
                    ? `2px solid hsl(${accent})`
                    : "1.5px solid hsla(var(--glamora-gray-light) / 0.3)",
                  background: photoType === opt.id
                    ? `hsla(${accentLight} / 0.08)`
                    : "hsl(var(--card))",
                  cursor: "pointer", fontFamily: "'Jost', sans-serif",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <opt.Icon size={28} color={photoType === opt.id ? `hsl(${accent})` : "hsl(var(--glamora-gray))"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{opt.label}</span>
                <span style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>{opt.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Photo upload or mannequin card */}
        {!isMannequin ? (
          <>
            <div
              className="glamora-card anim-fadeUp d2"
              onClick={() => fileRef.current?.click()}
              style={{
                minHeight: 200, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 14,
                cursor: "pointer",
                border: preview ? "none" : `2px dashed hsla(${accent} / 0.4)`,
                padding: preview ? 0 : 32, overflow: "hidden",
              }}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 22 }} />
              ) : (
                <>
                  <Camera size={44} color="hsl(var(--glamora-gray))" strokeWidth={1} />
                  <div className="serif" style={{ fontSize: 17, color: "hsl(var(--glamora-char))", textAlign: "center" }}>
                    Tap to Upload Your Photo
                  </div>
                  <p style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", textAlign: "center" }}>
                    We'll apply the inspired aesthetic to YOU
                  </p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </>
        ) : (
          <div className="glamora-card anim-fadeUp d2" style={{
            minHeight: 160, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 14,
            padding: "28px 24px", textAlign: "center",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${isMale ? "var(--glamora-gold-light)" : "var(--glamora-gold)"}))`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShirtIcon size={36} color="white" />
            </div>
            <div className="serif" style={{ fontSize: 18, color: "hsl(var(--glamora-char))" }}>
              No Photo Needed
            </div>
            <p style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", lineHeight: 1.5, maxWidth: 260 }}>
              We'll generate the celebrity-inspired outfit on a mannequin so you can see every detail.
            </p>
          </div>
        )}

        {/* Tips — only for on-me */}
        {!isMannequin && (
          <div className="anim-fadeUp d3" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { Icon: Sun, text: "Good, natural lighting for best results" },
                { Icon: CircleOff, text: "No heavy filters on your photo" },
              ].map((tip) => (
                <div key={tip.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "hsl(var(--glamora-gray))" }}>
                  <tip.Icon size={13} color={`hsl(${accent})`} />
                  {tip.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate button */}
        <div style={{ marginTop: 24 }}>
          <button
            className={`btn-primary ${canSubmit ? "btn-rose" : ""}`}
            disabled={!canSubmit}
            style={{
              opacity: canSubmit ? 1 : 0.5, display: "flex", alignItems: "center", gap: 8,
              ...(canSubmit && isMale ? { background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))" } : {}),
            }}
            onClick={() => canSubmit && onGenerate(iconName.trim(), file, photoType, base64, mode)}
          >
            {canSubmit
              ? (<>{isMannequin ? "Generate Mannequin Look" : "Generate Inspired Look"} <Sparkles size={16} /></>)
              : isMannequin
                ? "Enter a style icon above"
                : "Enter an icon & upload a photo"}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="anim-fadeUp d4" style={{
          marginTop: 16, padding: "12px 14px", borderRadius: 12,
          background: "hsla(var(--glamora-gold-pale) / 0.5)",
          border: "1px solid hsla(var(--glamora-gold) / 0.12)",
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <Info size={14} color="hsl(var(--glamora-gold))" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", lineHeight: 1.5 }}>
            Styles are AI-generated and inspired by general trends. Glamora is not affiliated with or endorsed by any public figures.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspirationScreen;
