import { useRef, useState } from "react";
import { Camera, UserRound, Target, Sun, CircleOff, Sparkles, ShirtIcon } from "lucide-react";
import type { UserPrefs, PhotoType, GenerationMode } from "./GlamoraApp";

interface Props {
  prefs: UserPrefs;
  onBack: () => void;
  onAnalyze: (file: File | null, photoType: PhotoType, base64: string | null, mode: GenerationMode) => void;
}

const UploadScreen = ({ prefs, onBack, onAnalyze }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<PhotoType>(prefs.photoType);
  const [mode, setMode] = useState<GenerationMode>(prefs.generationMode);
  const isMale = prefs.gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";

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

  const isMakeup = prefs.styleCategory === "makeup-only" || prefs.styleCategory === "celebrity-makeup" || prefs.styleCategory === "grooming";
  const isHairOnly = prefs.styleCategory === "celebrity-hair";
  const isFaceCategory = isMakeup || isHairOnly;
  const isMannequin = mode === "mannequin";
  const canProceed = isMannequin || !!file;

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">{isMannequin ? "Mannequin Preview" : "Upload Photo"}</div>
          <div className="header-sub">
            {isMannequin
              ? "See the outfit on a mannequin — no photo needed"
              : isFaceCategory
                ? "Upload a face photo — selfie, portrait, or any clear shot"
                : "Selfie or full body for best styling"}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 22px", marginTop: 16 }}>
        {/* Mode toggle: On Me vs Mannequin */}
        {!isFaceCategory && (
          <div className="anim-fadeUp" style={{
            display: "flex", gap: 6, marginBottom: 16,
            background: "hsl(var(--card))",
            borderRadius: 16, padding: 4,
            border: "1px solid hsla(var(--glamora-gold) / 0.1)",
          }}>
            {([
              { id: "on-me" as GenerationMode, label: "On Me", Icon: UserRound, desc: "Restyle your photo" },
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
        )}

        {/* Photo type selector — only for "on-me" mode */}
        {!isFaceCategory && !isMannequin && (
          <div className="anim-fadeUp" style={{ display: "flex", gap: 10, marginBottom: 20 }}>
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

        {/* Upload area — only for "on-me" mode */}
        {!isMannequin ? (
          <>
            <div
              className="glamora-card anim-fadeUp d1"
              onClick={() => fileRef.current?.click()}
              style={{
                minHeight: 280, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 16,
                cursor: "pointer",
                border: preview ? "none" : "2px dashed hsla(var(--glamora-gold) / 0.4)",
                padding: preview ? 0 : 40, overflow: "hidden",
              }}
            >
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 22 }} />
              ) : (
                <>
                  <Camera size={56} color="hsl(var(--glamora-gray))" strokeWidth={1} />
                  <div className="serif" style={{ fontSize: 20, color: "hsl(var(--glamora-char))", textAlign: "center" }}>
                    {isFaceCategory
                      ? "Tap to Upload a Face Photo"
                      : `Tap to Upload ${photoType === "full-body" ? "Full Body Shot" : "Selfie"}`}
                  </div>
                  <p style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", textAlign: "center", lineHeight: 1.6 }}>
                    {isFaceCategory
                      ? "Any clear face photo works — selfie, portrait, or headshot. Good lighting for best results."
                      : photoType === "full-body"
                        ? "Stand straight, good lighting, full outfit visible for best results."
                        : "Front-facing with good lighting for the best analysis."}
                  </p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </>
        ) : (
          /* Mannequin preview card */
          <div className="glamora-card anim-fadeUp d1" style={{
            minHeight: 200, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
            padding: "32px 24px", textAlign: "center",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${isMale ? "var(--glamora-gold-light)" : "var(--glamora-gold)"}))`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShirtIcon size={40} color="white" />
            </div>
            <div className="serif" style={{ fontSize: 20, color: "hsl(var(--glamora-char))" }}>
              No Photo Needed
            </div>
            <p style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", lineHeight: 1.6, maxWidth: 280 }}>
              We'll generate your selected style on a professional mannequin so you can see the full outfit, accessories, and details.
            </p>
          </div>
        )}

        <div className="anim-fadeUp d2" style={{
          marginTop: 20, padding: "12px 16px", borderRadius: 14,
          background: "hsla(var(--glamora-gold-pale) / 0.5)",
          border: "1px solid hsla(var(--glamora-gold) / 0.15)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Target size={18} color="hsl(var(--glamora-gold))" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
              {isMannequin ? "Mode: Mannequin Preview" : "Styling for:"}{" "}
              {prefs.styleCategory === "full-style" ? "Full Style" : prefs.styleCategory === "makeup-only" ? "Makeup & Grooming" : prefs.styleCategory.charAt(0).toUpperCase() + prefs.styleCategory.slice(1)}
            </div>
            <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>
              {isMannequin ? "Outfit displayed on a dress form" : photoType === "full-body" ? "Full body analysis" : "Face & features analysis"}
            </div>
          </div>
        </div>

        {!isMannequin && (
          <div className="anim-fadeUp d3" style={{ marginTop: 20 }}>
            <div className="section-label">Tips for Best Results</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(photoType === "full-body"
                ? [
                    { Icon: Sun, text: "Good, natural lighting" },
                    { Icon: UserRound, text: "Stand straight, arms relaxed" },
                    { Icon: Target, text: "Show your current outfit or neutral clothing" },
                  ]
                : [
                    { Icon: Sun, text: "Good, natural lighting" },
                    { Icon: Camera, text: "Face the camera directly" },
                    { Icon: CircleOff, text: "No heavy filters" },
                  ]
              ).map((tip) => (
                <div key={tip.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "hsl(var(--glamora-gray))" }}>
                  <tip.Icon size={14} color="hsl(var(--glamora-gold))" />
                  {tip.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, paddingBottom: 40 }}>
          <button
            className={`btn-primary ${canProceed ? "btn-rose" : ""}`}
            disabled={!canProceed}
            style={{
              opacity: canProceed ? 1 : 0.5, display: "flex", alignItems: "center", gap: 8,
              ...(canProceed && isMale ? { background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))" } : {}),
            }}
            onClick={() => canProceed && onAnalyze(file, photoType, base64, mode)}
          >
            {isMannequin
              ? (<>Generate Mannequin Look <ShirtIcon size={16} /></>)
              : file
                ? (<>Analyze My Style <Sparkles size={16} /></>)
                : "Upload a Photo First"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
