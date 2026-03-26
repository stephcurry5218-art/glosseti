import { useRef, useState } from "react";

interface Props {
  onBack: () => void;
  onAnalyze: (file: File) => void;
}

const UploadScreen = ({ onBack, onAnalyze }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Upload</div>
          <div className="header-sub">Take or upload a selfie</div>
        </div>
      </div>

      <div style={{ padding: "0 22px", marginTop: 20 }}>
        {/* Upload zone */}
        <div
          className="glamora-card anim-fadeUp"
          onClick={() => fileRef.current?.click()}
          style={{
            minHeight: 320, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
            cursor: "pointer",
            border: preview ? "none" : "2px dashed hsla(36 50% 53% / 0.4)",
            padding: preview ? 0 : 40,
            overflow: "hidden",
          }}
        >
          {preview ? (
            <img src={preview} alt="Preview" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 22 }} />
          ) : (
            <>
              <div style={{ fontSize: 56 }}>📸</div>
              <div className="serif" style={{ fontSize: 20, color: "hsl(var(--glamora-char))", textAlign: "center" }}>
                Tap to Upload
              </div>
              <p style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", textAlign: "center", lineHeight: 1.6 }}>
                Upload a front-facing selfie with good lighting for the best results.
              </p>
            </>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {/* Tips */}
        <div className="anim-fadeUp d2" style={{ marginTop: 24 }}>
          <div className="section-label">Tips for Best Results</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["☀️ Good, natural lighting", "🙂 Face the camera directly", "🚫 No filters or heavy edits"].map((tip) => (
              <div key={tip} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "hsl(var(--glamora-gray))" }}>
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Analyze button */}
        <div style={{ marginTop: 32, paddingBottom: 40 }}>
          <button
            className={`btn-primary ${file ? "btn-rose" : ""}`}
            disabled={!file}
            style={{ opacity: file ? 1 : 0.5 }}
            onClick={() => file && onAnalyze(file)}
          >
            {file ? "Analyze My Face ✨" : "Upload a Photo First"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadScreen;
