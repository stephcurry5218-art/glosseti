import { useEffect, useState, useRef, useCallback } from "react";
import { Search, Ruler, Palette, Sparkles, ShoppingBag, Shirt, Check, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_MODE, getDemoStyledImage } from "./demoMode";
import type { UserPrefs } from "./GlamoraApp";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: UserPrefs;
  onDone: (imageUrl: string | null) => void;
}

const getSteps = (prefs: UserPrefs): { label: string; Icon: LucideIcon }[] => {
  if (prefs.generationMode === "mannequin") {
    return [
      { label: "Selecting style elements...", Icon: Shirt },
      { label: "Matching color palette...", Icon: Palette },
      { label: "Styling the mannequin...", Icon: Sparkles },
      { label: "Finalizing the look...", Icon: ShoppingBag },
    ];
  }
  if (prefs.styleCategory === "makeup-only") {
    return [
      { label: "Analyzing facial features...", Icon: Search },
      { label: "Detecting skin tone & undertone...", Icon: Palette },
      { label: "Generating your styled look...", Icon: Sparkles },
      { label: "Curating your looks...", Icon: Shirt },
    ];
  }
  return [
    { label: "Analyzing your photo...", Icon: Search },
    { label: "Detecting body type & proportions...", Icon: Ruler },
    { label: "Matching color palette to skin tone...", Icon: Palette },
    { label: "Generating your styled look...", Icon: Sparkles },
    { label: "Finding products at 3 price points...", Icon: ShoppingBag },
    { label: "Finalizing your style guide...", Icon: Shirt },
  ];
};

const ESTIMATED_TIME = 30; // seconds

const LoadingScreen = ({ prefs, onDone }: Props) => {
  const steps = getSteps(prefs);
  const [step, setStep] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDone, setAiDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const generatedUrlRef = useRef<string | null>(null);
  const aiCalledRef = useRef(false);
  const navigatedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (aiCalledRef.current) return;
    // For mannequin mode, no photo needed
    if (prefs.generationMode !== "mannequin" && !prefs.photoBase64) return;
    aiCalledRef.current = true;

    const generateImage = async () => {
      try {
        if (DEMO_MODE) {
          await new Promise(r => setTimeout(r, 2000));
          generatedUrlRef.current = getDemoStyledImage(prefs.gender);
          setAiDone(true);
          return;
        }
        const gioRefinement = localStorage.getItem("glamora_gio_refinement");
        localStorage.removeItem("glamora_gio_refinement");
        console.log("Starting AI generation...", { styleCategory: prefs.styleCategory, photoType: prefs.photoType, generationMode: prefs.generationMode, hasRefinement: !!gioRefinement, hasCelebrityGuide: !!prefs.celebrityGuide });
        const { data, error } = await supabase.functions.invoke("generate-styled-image", {
          body: {
            imageBase64: prefs.photoBase64,
            styleCategory: prefs.styleCategory,
            photoType: prefs.photoType,
            gender: prefs.gender,
            generationMode: prefs.generationMode,
            ...(gioRefinement ? { refinementContext: gioRefinement } : {}),
            ...(prefs.celebrityGuide ? { celebrityGuide: prefs.celebrityGuide } : {}),
          },
        });
        if (error || data?.error) {
          const errMsg = data?.error || error?.message || "";
          console.error("AI generation error:", errMsg);
          if (errMsg.includes("credits exhausted") || errMsg.includes("402")) {
            setAiError("AI credits exhausted. Go to Settings → Cloud & AI balance to add funds, then try again.");
          } else if (errMsg.includes("Rate limited") || errMsg.includes("429")) {
            setAiError("Too many requests — please wait a moment, then tap to retry.");
          } else {
            setAiError("Could not generate styled image. Tap to retry.");
          }
          setAiDone(true);
          return;
        }
        console.log("AI response received, has imageUrl:", !!data?.imageUrl);
        if (data?.imageUrl) {
          generatedUrlRef.current = data.imageUrl;
        } else {
          console.warn("No image in response:", JSON.stringify(data).slice(0, 200));
          setAiError("No image returned. Tap to retry.");
        }
        setAiDone(true);
      } catch (err) {
        console.error("AI call failed:", err);
        setAiError("Failed to connect to AI. Tap to retry.");
        setAiDone(true);
      }
    };

    generateImage();
  }, [prefs]);

  // Navigate when BOTH animation and AI are done
  useEffect(() => {
    if (aiDone && animDone && !navigatedRef.current) {
      navigatedRef.current = true;
      onDone(generatedUrlRef.current);
    }
  }, [aiDone, animDone, onDone]);

  // Elapsed timer
  useEffect(() => {
    if (aiDone && !aiError) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [aiDone, aiError]);

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
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  const remaining = Math.max(0, ESTIMATED_TIME - elapsed);
  const progressPct = aiDone ? 100 : Math.min(95, ((step + 1) / steps.length) * 90 + (elapsed / ESTIMATED_TIME) * 10);
  const formatTime = (s: number) => s < 60 ? `~${s}s` : `~${Math.floor(s / 60)}m ${s % 60}s`;

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

      <div className="serif" style={{ fontSize: 24, color: "hsl(var(--glamora-char))", marginBottom: 8, textAlign: "center" }}>
        {prefs.styleCategory === "makeup-only" ? "Analyzing Beauty..." : "Building Your Style..."}
      </div>
      <div style={{ fontSize: 13, color: aiError ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))", marginBottom: aiError?.includes("credits") ? 12 : 28, textAlign: "center" }}>
        {aiError || (animDone && !aiDone ? "Almost there, finalizing your look..." : (prefs.styleCategory === "makeup-only" ? "Personalizing your beauty profile" : "AI is generating your styled look"))}
      </div>
      {aiError?.includes("credits") && (
        <a
          href="https://lovable.dev/settings"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", marginBottom: 28, borderRadius: 12,
            background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-rose-dark)))",
            color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 4px 16px hsla(var(--glamora-gold) / 0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          💳 Add Funds
        </a>
      )}

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

      <div style={{ marginTop: 24, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "hsl(var(--glamora-gray))" }}>
            <Clock size={12} />
            {aiDone ? "Complete!" : elapsed > 0 ? `${elapsed}s elapsed` : "Starting..."}
          </div>
          {!aiDone && !aiError && (
            <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--glamora-rose-dark))" }}>
              {remaining > 0 ? `${formatTime(remaining)} remaining` : "Almost done..."}
            </div>
          )}
        </div>
        <div style={{ width: "100%", height: 4, borderRadius: 2, background: "hsla(var(--glamora-char) / 0.08)" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
            width: `${progressPct}%`,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
