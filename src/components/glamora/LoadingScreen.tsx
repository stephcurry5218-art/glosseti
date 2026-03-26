import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { UserPrefs } from "./GlamoraApp";

interface Props {
  prefs: UserPrefs;
  onDone: (imageUrl: string | null) => void;
}

const getSteps = (prefs: UserPrefs) => {
  if (prefs.styleCategory === "makeup-only") {
    return [
      { label: "Analyzing facial features...", icon: "🔍" },
      { label: "Detecting skin tone & undertone...", icon: "🎨" },
      { label: "Generating your styled look...", icon: "✨" },
      { label: "Curating your looks...", icon: "💄" },
    ];
  }
  return [
    { label: "Analyzing your photo...", icon: "🔍" },
    { label: "Detecting body type & proportions...", icon: "📐" },
    { label: "Matching color palette to skin tone...", icon: "🎨" },
    { label: "Generating your styled look...", icon: "✨" },
    { label: "Finding products at 3 price points...", icon: "🛍️" },
    { label: "Finalizing your style guide...", icon: "👗" },
  ];
};

const LoadingScreen = ({ prefs, onDone }: Props) => {
  const steps = getSteps(prefs);
  const [step, setStep] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const generatedUrlRef = useRef<string | null>(null);
  const aiCalledRef = useRef(false);

  // Call AI to generate styled image
  useEffect(() => {
    if (aiCalledRef.current || !prefs.photoBase64) return;
    aiCalledRef.current = true;

    const generateImage = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("generate-styled-image", {
          body: {
            imageBase64: prefs.photoBase64,
            styleCategory: prefs.styleCategory,
            photoType: prefs.photoType,
          },
        });
        if (error) {
          console.error("AI generation error:", error);
          setAiError("Could not generate styled image");
          return;
        }
        if (data?.imageUrl) {
          generatedUrlRef.current = data.imageUrl;
        } else {
          setAiError("No image returned");
        }
      } catch (err) {
        console.error("AI call failed:", err);
        setAiError("Failed to connect to AI");
      }
    };

    generateImage();
  }, [prefs]);

  // Animate loading steps
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => onDone(generatedUrlRef.current), 1200);
          return s;
        }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [onDone, steps.length]);

  return (
    <div className="screen enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", padding: "0 40px" }}>
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 48 }}>
        <div style={{
          width: 140, height: 140, borderRadius: "50%",
          border: "3px solid hsla(var(--glamora-gold) / 0.15)",
          borderTopColor: "hsl(var(--glamora-gold))",
          animation: "spin 1.2s linear infinite",
        }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
          {steps[step].icon}
        </div>
      </div>

      <div className="serif" style={{ fontSize: 24, color: "hsl(var(--glamora-char))", marginBottom: 8, textAlign: "center" }}>
        {prefs.styleCategory === "makeup-only" ? "Analyzing Beauty..." : "Building Your Style..."}
      </div>
      <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginBottom: 28, textAlign: "center" }}>
        {aiError || (prefs.styleCategory === "makeup-only" ? "Personalizing your beauty profile" : "AI is generating your styled look")}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
        {steps.map((s, i) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i <= step ? 1 : 0.3, transition: "opacity 0.4s ease" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: i < step ? "hsla(var(--glamora-success) / 0.15)" : i === step ? "hsla(var(--glamora-rose-dark) / 0.15)" : "hsla(var(--glamora-char) / 0.05)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "background 0.4s",
              color: i < step ? "hsl(var(--glamora-success))" : "hsl(var(--glamora-char))",
            }}>
              {i < step ? "✓" : s.icon}
            </div>
            <span style={{ fontSize: 13, color: i <= step ? "hsl(var(--glamora-char))" : "hsl(var(--glamora-gray-light))", fontWeight: i === step ? 600 : 400 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, width: "100%", height: 4, borderRadius: 2, background: "hsla(var(--glamora-char) / 0.08)" }}>
        <div style={{
          height: "100%", borderRadius: 2,
          background: "linear-gradient(90deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
          width: `${((step + 1) / steps.length) * 100}%`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
};

export default LoadingScreen;
