import { useEffect, useState, useRef } from "react";
import { Search, Palette, Sparkles, Shirt, Gem, Scissors, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_MODE, getDemoInspirationResult } from "./demoMode";
import type { PhotoType, Gender, GenerationMode } from "./GlamoraApp";
import type { LucideIcon } from "lucide-react";

export interface StyleProfile {
  styleName: string;
  clothingTypes: string[];
  colorPalette: string[];
  fitPreferences: string[];
  accessories: string[];
  makeupStyle: string;
  hairTrend: string;
  overallVibe: string;
  detailedPrompt: string;
}

interface Props {
  iconName: string;
  photoBase64: string;
  photoType: PhotoType;
  gender: Gender;
  onDone: (imageUrl: string | null, styleProfile: StyleProfile | null) => void;
}

const steps: { label: string; Icon: LucideIcon }[] = [
  { label: "Analyzing style inspiration...", Icon: Search },
  { label: "Extracting color palette...", Icon: Palette },
  { label: "Building outfit profile...", Icon: Shirt },
  { label: "Selecting accessories...", Icon: Gem },
  { label: "Styling hair & beauty...", Icon: Scissors },
  { label: "Generating your inspired look...", Icon: Sparkles },
];

const InspirationLoadingScreen = ({ iconName, photoBase64, photoType, gender, onDone }: Props) => {
  const [step, setStep] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDone, setAiDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const resultRef = useRef<{ imageUrl: string | null; styleProfile: StyleProfile | null }>({ imageUrl: null, styleProfile: null });
  const aiCalledRef = useRef(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    if (aiCalledRef.current) return;
    aiCalledRef.current = true;

    const generate = async () => {
      try {
        if (DEMO_MODE) {
          await new Promise(r => setTimeout(r, 2500));
          const demo = getDemoInspirationResult(gender);
          resultRef.current = { imageUrl: demo.imageUrl, styleProfile: demo.styleProfile };
          setAiDone(true);
          return;
        }
        const { data, error } = await supabase.functions.invoke("style-inspiration", {
          body: { iconName, imageBase64: photoBase64, photoType, gender },
        });
        if (error) {
          console.error("Inspiration error:", error);
          setAiError("Could not generate inspired look. Try again.");
          setAiDone(true);
          return;
        }
        if (data?.imageUrl) {
          resultRef.current = { imageUrl: data.imageUrl, styleProfile: data.styleProfile };
        } else {
          setAiError("No image returned. Try again.");
        }
        setAiDone(true);
      } catch (err) {
        console.error("Inspiration call failed:", err);
        setAiError("Failed to connect. Try again.");
        setAiDone(true);
      }
    };

    generate();
  }, [iconName, photoBase64, photoType, gender]);

  useEffect(() => {
    if (aiDone && animDone && !navigatedRef.current) {
      navigatedRef.current = true;
      onDone(resultRef.current.imageUrl, resultRef.current.styleProfile);
    }
  }, [aiDone, animDone, onDone]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setAnimDone(true), 1200);
          return s;
        }
        return s + 1;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[step].Icon;

  return (
    <div className="screen enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", padding: "0 40px" }}>
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 48 }}>
        <div style={{
          width: 140, height: 140, borderRadius: "50%",
          border: "3px solid hsla(var(--glamora-gold) / 0.15)",
          borderTopColor: "hsl(var(--glamora-gold))",
          animation: "spin 1.2s linear infinite",
        }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CurrentIcon size={48} color="hsl(var(--glamora-rose-dark))" strokeWidth={1.2} />
        </div>
      </div>

      <div className="serif" style={{ fontSize: 22, color: "hsl(var(--glamora-char))", marginBottom: 8, textAlign: "center" }}>
        Channeling the Aesthetic...
      </div>
      <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginBottom: 28, textAlign: "center" }}>
        {aiError || (animDone && !aiDone ? "Almost there, finalizing your look..." : "Extracting style DNA & generating your look")}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
        {steps.map((s, i) => {
          const StepIcon = s.Icon;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i <= step ? 1 : 0.3, transition: "opacity 0.4s ease" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: i < step ? "hsla(var(--glamora-success) / 0.15)" : i === step ? "hsla(var(--glamora-rose-dark) / 0.15)" : "hsla(var(--glamora-char) / 0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.4s",
              }}>
                {i < step ? <Check size={16} color="hsl(var(--glamora-success))" /> : <StepIcon size={16} color={i === step ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))"} />}
              </div>
              <span style={{ fontSize: 13, color: i <= step ? "hsl(var(--glamora-char))" : "hsl(var(--glamora-gray-light))", fontWeight: i === step ? 600 : 400 }}>
                {s.label}
              </span>
            </div>
          );
        })}
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

export default InspirationLoadingScreen;
