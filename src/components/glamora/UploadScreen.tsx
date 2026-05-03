import { useRef, useState } from "react";
import { Camera, UserRound, Target, Sun, CircleOff, Sparkles, ShirtIcon, Flower2, Gem, Users, Heart } from "lucide-react";
import type { UserPrefs, PhotoType, GenerationMode } from "./GlamoraApp";
import { fixImageOrientation } from "./fixImageOrientation";
import FlowStepper from "./FlowStepper";

interface Props {
  prefs: UserPrefs;
  onBack: () => void;
  onAnalyze: (file: File | null, photoType: PhotoType, base64: string | null, mode: GenerationMode, makeupPref?: "natural" | "glam", secondFile?: File | null, secondBase64?: string | null) => void;
}

const UploadScreen = ({ prefs, onBack, onAnalyze }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const secondFileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [secondPreview, setSecondPreview] = useState<string | null>(null);
  const [secondFile, setSecondFile] = useState<File | null>(null);
  const [secondBase64, setSecondBase64] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<PhotoType>(prefs.photoType);
  const [mode, setMode] = useState<GenerationMode>(prefs.generationMode);
  const [makeupPref, setMakeupPref] = useState<"natural" | "glam">(prefs.makeupPreference || "natural");
  const isMale = prefs.gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";

  const isDualPhotoCategory = prefs.styleCategory === "parent-child" || prefs.styleCategory === "couples";

  const handleFile = async (f: File) => {
    try {
      setFile(f);
      // Use object URL for preview (memory efficient)
      const previewUrl = URL.createObjectURL(f);
      setPreview(previewUrl);
      // Generate base64 for AI in background
      const normalizedBase64 = await fixImageOrientation(f);
      setBase64(normalizedBase64);
      // Revoke the preview URL once base64 is ready
      URL.revokeObjectURL(previewUrl);
      setPreview(normalizedBase64);
    } catch (err) {
      console.error("Photo processing error:", err);
      // Fallback: use object URL for preview, skip base64 (will retry on submit)
      try {
        const previewUrl = URL.createObjectURL(f);
        setPreview(previewUrl);
        // Try a simpler base64 conversion with smaller size
        const fallbackBase64 = await fixImageOrientation(f, 1024);
        setBase64(fallbackBase64);
      } catch {
        console.error("Fallback photo processing also failed");
      }
    }
  };

  const handleSecondFile = async (f: File) => {
    try {
      setSecondFile(f);
      const previewUrl = URL.createObjectURL(f);
      setSecondPreview(previewUrl);
      const normalizedBase64 = await fixImageOrientation(f);
      setSecondBase64(normalizedBase64);
      URL.revokeObjectURL(previewUrl);
      setSecondPreview(normalizedBase64);
    } catch (err) {
      console.error("Second photo processing error:", err);
      try {
        const previewUrl = URL.createObjectURL(f);
        setSecondPreview(previewUrl);
        const fallbackBase64 = await fixImageOrientation(f, 1024);
        setSecondBase64(fallbackBase64);
      } catch {
        console.error("Fallback second photo processing also failed");
      }
    }
  };

  const isMakeup = prefs.styleCategory === "makeup-only" || prefs.styleCategory === "grooming";
  const isHairOnly = false;
  const isFaceCategory = isMakeup || isHairOnly;
  const isMannequin = mode === "mannequin";
  const canProceed = isMannequin || (isDualPhotoCategory ? !!file : !!file);
  const showMakeupPref = !isMale && !isMakeup && !isHairOnly;

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">
            {isDualPhotoCategory ? "Family Photo Mode" : isMannequin ? "Mannequin Preview" : "Upload Photo"}
          </div>
          <div className="header-sub">
            {isDualPhotoCategory
              ? "Upload photos of both people for coordinated styling"
              : isMannequin
                ? "See the outfit on a mannequin — no photo needed"
                : isFaceCategory
                  ? "Upload a face photo — selfie, portrait, or any clear shot"
                  : "Selfie or full body for best styling"}
          </div>
        </div>
      </div>
      <FlowStepper current="photo" gender={prefs.gender} />

      <div style={{ padding: "0 22px", marginTop: 12 }}>
        {/* Mode toggle: On Me vs Mannequin — hide for dual photo categories */}
        {!isFaceCategory && !isDualPhotoCategory && (
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

        {/* Photo type selector — only for "on-me" mode, non-dual */}
        {!isFaceCategory && !isMannequin && !isDualPhotoCategory && (
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

        {/* Dual photo upload for parent-child */}
        {isDualPhotoCategory && !isMannequin ? (
          <>
            {/* Family mode banner */}
            <div className="anim-fadeUp" style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: 14, marginBottom: 16,
              background: `hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)"} / 0.08)`,
              border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)"} / 0.15)`,
            }}>
              <Users size={18} color={`hsl(${accent})`} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                  Family Photo Mode
                </div>
                <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", lineHeight: 1.4 }}>
                  Upload photos of both people — we'll style them together in coordinated outfits
                </div>
              </div>
            </div>

            {/* Two photo upload areas side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {/* Parent/Person 1 photo */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <UserRound size={14} color={`hsl(${accent})`} />
                  {prefs.styleCategory === "parent-child" ? "Parent" : prefs.styleCategory === "couples" ? "You" : "Person 1"}
                </div>
                <div
                  className="glamora-card anim-fadeUp d1"
                  onClick={() => fileRef.current?.click()}
                  style={{
                    minHeight: 180, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 10,
                    cursor: "pointer",
                    border: preview ? "none" : `2px dashed hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)"} / 0.4)`,
                    padding: preview ? 0 : 16, overflow: "hidden",
                  }}
                >
                  {preview ? (
                    <img src={preview} alt="Parent preview" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 22 }} />
                  ) : (
                    <>
                      <Camera size={36} color="hsl(var(--glamora-gray))" strokeWidth={1} />
                      <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", textAlign: "center" }}>
                        Tap to upload
                      </div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              </div>

              {/* Child/Person 2 photo */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <Heart size={14} color={`hsl(${accent})`} />
                  {prefs.styleCategory === "parent-child" ? "Child" : prefs.styleCategory === "couples" ? "Your Partner" : "Person 2"}
                </div>
                <div
                  className="glamora-card anim-fadeUp d2"
                  onClick={() => secondFileRef.current?.click()}
                  style={{
                    minHeight: 180, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 10,
                    cursor: "pointer",
                    border: secondPreview ? "none" : `2px dashed hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)"} / 0.4)`,
                    padding: secondPreview ? 0 : 16, overflow: "hidden",
                  }}
                >
                  {secondPreview ? (
                    <img src={secondPreview} alt="Child preview" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 22 }} />
                  ) : (
                    <>
                      <Camera size={36} color="hsl(var(--glamora-gray))" strokeWidth={1} />
                      <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", textAlign: "center" }}>
                        Tap to upload
                      </div>
                      <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", textAlign: "center", opacity: 0.7 }}>
                        (Optional)
                      </div>
                    </>
                  )}
                </div>
                <input ref={secondFileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => e.target.files?.[0] && handleSecondFile(e.target.files[0])} />
              </div>
            </div>

            {/* Helper text */}
            <div className="anim-fadeUp d3" style={{
              padding: "10px 14px", borderRadius: 12, marginBottom: 14,
              background: "hsla(var(--glamora-gold) / 0.05)",
              border: "1px solid hsla(var(--glamora-gold) / 0.1)",
            }}>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", lineHeight: 1.5 }}>
                💡 <strong>Tip:</strong> Upload both photos for best results. If you only upload the parent's photo, we'll generate a coordinated child outfit alongside them.
              </div>
            </div>
          </>
        ) : !isMannequin ? (
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
              {isMannequin ? "Mode: Mannequin Preview" : isDualPhotoCategory ? "Mode: Family Matching" : "Styling for:"}{" "}
              {!isDualPhotoCategory && (prefs.styleCategory === "full-style" ? "Full Style" : prefs.styleCategory === "makeup-only" ? "Makeup & Grooming" : prefs.styleCategory.charAt(0).toUpperCase() + prefs.styleCategory.slice(1))}
            </div>
            <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>
              {isMannequin ? "Outfit displayed on a dress form" : isDualPhotoCategory ? `${file ? "✓" : "○"} Parent photo  ${secondFile ? "✓" : "○"} Child photo` : photoType === "full-body" ? "Full body analysis" : "Face & features analysis"}
            </div>
          </div>
        </div>

        {/* Makeup preference for female users */}
        {showMakeupPref && !isMannequin && !isDualPhotoCategory && (
          <div className="anim-fadeUp d2" style={{
            marginTop: 16, display: "flex", gap: 6,
            background: "hsl(var(--card))",
            borderRadius: 16, padding: 4,
            border: "1px solid hsla(var(--glamora-gold) / 0.1)",
          }}>
            {([
              { id: "natural" as const, label: "Natural Look", Icon: Flower2, desc: "Minimal or no makeup" },
              { id: "glam" as const, label: "Glam Makeup", Icon: Gem, desc: "Full glam styling" },
            ]).map(opt => (
              <button
                key={opt.id}
                onClick={() => setMakeupPref(opt.id)}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: 12,
                  border: "none",
                  background: makeupPref === opt.id
                    ? `linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-rose)))`
                    : "transparent",
                  cursor: "pointer", fontFamily: "'Jost', sans-serif",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  transition: "all 0.25s ease",
                }}
              >
                <opt.Icon size={18} color={makeupPref === opt.id ? "white" : "hsl(var(--glamora-gray))"} />
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: makeupPref === opt.id ? "white" : "hsl(var(--glamora-char))",
                }}>{opt.label}</span>
                <span style={{
                  fontSize: 10,
                  color: makeupPref === opt.id ? "hsla(0 0% 100% / 0.75)" : "hsl(var(--glamora-gray))",
                }}>{opt.desc}</span>
              </button>
            ))}
          </div>
        )}

        {!isMannequin && !isDualPhotoCategory && (
          <div className="anim-fadeUp d3" style={{ marginTop: 20 }}>
            <div className="section-label">Tips for Best Results</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(isFaceCategory
                ? [
                    { Icon: Sun, text: "Good, natural lighting" },
                    { Icon: Camera, text: "Clear face shot — selfie, portrait, or headshot" },
                    { Icon: CircleOff, text: "No heavy filters or sunglasses" },
                  ]
                : photoType === "full-body"
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

        {isDualPhotoCategory && !isMannequin && (
          <div className="anim-fadeUp d3" style={{ marginTop: 20 }}>
            <div className="section-label">Tips for Family Photos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { Icon: Sun, text: "Good lighting for both photos" },
                { Icon: Camera, text: "Clear face shots work best" },
                { Icon: Users, text: "Full body shots show outfit coordination better" },
                { Icon: Heart, text: "Child photo is optional — AI will create a matching child look" },
              ].map((tip) => (
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
            onClick={() => canProceed && onAnalyze(file, photoType, base64, mode, showMakeupPref ? makeupPref : undefined, isDualPhotoCategory ? secondFile : undefined, isDualPhotoCategory ? secondBase64 : undefined)}
          >
            {isMannequin
              ? (<>Generate Mannequin Look <ShirtIcon size={16} /></>)
              : isDualPhotoCategory
                ? (<>Style Us Together <Users size={16} /></>)
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