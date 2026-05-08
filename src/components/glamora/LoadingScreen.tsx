import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Search, Ruler, Palette, Sparkles, ShoppingBag, Shirt, Check, Clock, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_MODE, getDemoStyledImage } from "./demoMode";
import type { UserPrefs } from "./GlamoraApp";
import type { LucideIcon } from "lucide-react";
import FlowStepper from "./FlowStepper";

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

/* ── Fashion tips pool, tagged by category & gender ── */
type TipTag = "all" | "female" | "male" | string;

interface FashionTip {
  tip: string;
  tags: TipTag[];
}

const FASHION_TIPS: FashionTip[] = [
  // Universal
  { tip: "A well-fitted outfit always looks more expensive than an oversized one.", tags: ["all"] },
  { tip: "Invest in quality basics — they're the foundation of every great look.", tags: ["all"] },
  { tip: "Monochrome outfits instantly create a sleek, put-together vibe.", tags: ["all"] },
  { tip: "Rolling your sleeves adds instant casual polish.", tags: ["all"] },
  { tip: "Your shoes make the first impression — keep them clean.", tags: ["all"] },
  { tip: "When in doubt, underdress rather than overdress.", tags: ["all"] },
  { tip: "Accessorize with intention — one statement piece is enough.", tags: ["all"] },
  { tip: "Tailoring a $50 piece can make it look like $500.", tags: ["all"] },
  { tip: "Neutral tones photograph beautifully in any lighting.", tags: ["all"] },
  { tip: "Confidence is the best outfit. Rock it and own it.", tags: ["all"] },
  { tip: "Layer textures, not just colors, for depth.", tags: ["all"] },
  { tip: "Dark colors near your face sharpen your features in photos.", tags: ["all"] },
  { tip: "Match your metals — gold jewelry with warm tones, silver with cool.", tags: ["all"] },

  // Female-leaning
  { tip: "A structured blazer elevates any outfit from casual to chic.", tags: ["female", "formal", "minimalist"] },
  { tip: "Cinch at the waist to create an hourglass silhouette.", tags: ["female"] },
  { tip: "Nude heels elongate the legs — a stylist's secret weapon.", tags: ["female", "formal", "date-night"] },
  { tip: "Mix high-end pieces with affordable basics for an effortless look.", tags: ["female"] },
  { tip: "A silk scarf can transform a bag, ponytail, or neckline.", tags: ["female", "minimalist", "vintage"] },
  { tip: "Red lipstick + white tee + jeans = timeless.", tags: ["female", "casual", "icon-looks"] },
  { tip: "Pointed-toe shoes make any outfit look more polished.", tags: ["female", "formal"] },
  { tip: "Statement earrings can replace a necklace — don't double up.", tags: ["female", "jewelry-accessories"] },

  // Male-leaning
  { tip: "A quality watch is the easiest upgrade to any outfit.", tags: ["male", "formal"] },
  { tip: "Your belt should match your shoes — always.", tags: ["male", "formal"] },
  { tip: "Cuff your jeans to show off your sneakers.", tags: ["male", "streetwear", "casual"] },
  { tip: "A fitted crew-neck tee under a blazer is modern power-casual.", tags: ["male", "casual", "minimalist"] },
  { tip: "No-show socks keep low-top sneakers looking clean.", tags: ["male", "casual", "streetwear"] },
  { tip: "Dark denim is the most versatile piece in a guy's wardrobe.", tags: ["male", "casual"] },
  { tip: "A bomber jacket over a hoodie = instant street style.", tags: ["male", "streetwear", "urban-hiphop"] },
  { tip: "Grooming is part of the outfit — never skip it.", tags: ["male", "grooming"] },

  // Category-specific
  { tip: "Streetwear rule: oversized top + slim bottom, or vice versa.", tags: ["streetwear"] },
  { tip: "Athleisure works best when you mix sporty and tailored pieces.", tags: ["athleisure", "fitness"] },
  { tip: "Bohemian style shines with natural fabrics like linen and cotton.", tags: ["bohemian", "cottagecore"] },
  { tip: "Minimalism is about perfect fit, not boring colors.", tags: ["minimalist"] },
  { tip: "Vintage styling tip: pick one era and commit.", tags: ["vintage", "y2k"] },
  { tip: "For resort wear, breathable fabrics are non-negotiable.", tags: ["resort", "swimwear"] },
  { tip: "Techwear is function first — every pocket should have a purpose.", tags: ["techwear", "edgy"] },
  { tip: "Date night secret: wear something that makes YOU feel amazing.", tags: ["date-night", "sexy"] },
  { tip: "Wedding guest rule: never outshine the couple.", tags: ["wedding-gowns", "tuxedos"] },
  { tip: "The right sunglasses shape can redefine your entire face.", tags: ["sunglasses-eyewear"] },
  { tip: "A great bag ties the whole outfit together.", tags: ["bags-purses"] },
];

const getTipsForPrefs = (prefs: UserPrefs): string[] => {
  const { gender, styleCategory } = prefs;
  const genderTag = gender === "male" ? "male" : "female";

  // Score each tip by relevance
  const scored = FASHION_TIPS.map((t) => {
    let score = 0;
    if (t.tags.includes("all")) score += 1;
    if (t.tags.includes(genderTag)) score += 3;
    if (t.tags.includes(styleCategory)) score += 5;
    // Exclude tips tagged only for the opposite gender
    const oppositeGender = gender === "male" ? "female" : "male";
    if (t.tags.includes(oppositeGender) && !t.tags.includes("all") && !t.tags.includes(genderTag)) return { ...t, score: -1 };
    return { ...t, score };
  })
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score);

  // Take top relevant, then shuffle for variety
  const top = scored.slice(0, 12);
  for (let i = top.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top[i], top[j]] = [top[j], top[i]];
  }
  return top.map((t) => t.tip);
};

const ESTIMATED_TIME = 30;

const LoadingScreen = ({ prefs, onDone }: Props) => {
  const steps = getSteps(prefs);
  const [step, setStep] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiDone, setAiDone] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [retryNonce, setRetryNonce] = useState(0);
  const generatedUrlRef = useRef<string | null>(null);
  const aiCalledRef = useRef(false);
  const navigatedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Fashion tips state
  const tips = useMemo(() => getTipsForPrefs(prefs), [prefs.gender, prefs.styleCategory]);
  const [tipIdx, setTipIdx] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);

  // Rotate tips every 4s with fade
  useEffect(() => {
    if (aiDone && !aiError) return;
    const interval = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIdx((i) => (i + 1) % tips.length);
        setTipVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.length, aiDone, aiError]);

  const handleRetry = useCallback(() => {
    generatedUrlRef.current = null;
    aiCalledRef.current = false;
    navigatedRef.current = false;
    startTimeRef.current = Date.now();
    setAiError(null);
    setAiDone(false);
    setAnimDone(false);
    setElapsed(0);
    setStep(0);
    setRetryNonce((value) => value + 1);
  }, []);

  useEffect(() => {
    if (aiCalledRef.current) return;
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

        // Fetch face reference images for better identity preservation
        let faceReferenceUrls: string[] = [];
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && prefs.generationMode !== "mannequin") {
            const { data: refs } = await supabase
              .from("face_references")
              .select("storage_path")
              .eq("user_id", session.user.id)
              .order("created_at", { ascending: true })
              .limit(5);
            if (refs && refs.length > 0) {
              const urls = await Promise.all(
                refs.map(async (ref: any) => {
                  const { data } = await supabase.storage
                    .from("face-references")
                    .createSignedUrl(ref.storage_path, 300);
                  return data?.signedUrl || null;
                })
              );
              faceReferenceUrls = urls.filter(Boolean) as string[];
            }
          }
        } catch (e) {
          console.warn("Could not fetch face references:", e);
        }

        console.log("Starting AI generation...", { styleCategory: prefs.styleCategory, photoType: prefs.photoType, generationMode: prefs.generationMode, hasRefinement: !!gioRefinement, faceRefs: faceReferenceUrls.length });
        const localMidnight = new Date(); localMidnight.setHours(0, 0, 0, 0);
        const devMode = (() => { try { return localStorage.getItem("glamora_dev_mode") === "unlocked"; } catch { return false; } })();
        const { data, error } = await supabase.functions.invoke("generate-styled-image", {
          body: {
            imageBase64: prefs.photoBase64,
            secondImageBase64: prefs.secondPhotoBase64 || undefined,
            styleCategory: prefs.styleCategory,
            styleSubcategory: prefs.styleSubcategory || undefined,
            photoType: prefs.photoType,
            gender: prefs.gender,
            generationMode: prefs.generationMode,
            clientLocalMidnight: localMidnight.toISOString(),
            devMode,
            ...(gioRefinement ? { refinementContext: gioRefinement } : {}),
            ...(prefs.makeupPreference ? { makeupPreference: prefs.makeupPreference } : {}),
            ...(faceReferenceUrls.length > 0 ? { faceReferenceUrls } : {}),
            ...(prefs.inspirationImageUrl ? { inspirationImageUrl: prefs.inspirationImageUrl } : {}),
            ...(prefs.recreateMode ? { recreateMode: prefs.recreateMode } : {}),
            ...(prefs.vibeLabel ? { vibeLabel: prefs.vibeLabel } : {}),
            ...(prefs.customPrompt ? { customPrompt: prefs.customPrompt } : {}),
          },
        });
        if (error || data?.error) {
          const errMsg = data?.error || error?.message || "";
          console.error("AI generation error:", errMsg);
          if (errMsg === "free_limit_reached" || errMsg.includes("free_limit_reached")) {
            setAiError("You've used all 3 free looks for today. Upgrade or wait for the daily reset to continue.");
          } else if (errMsg.includes("credits exhausted") || errMsg.includes("402")) {
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
  }, [prefs, retryNonce]);

  useEffect(() => {
    if (aiDone && animDone && !aiError && !navigatedRef.current) {
      navigatedRef.current = true;
      onDone(generatedUrlRef.current);
    }
  }, [aiDone, aiError, animDone, onDone]);

  useEffect(() => {
    if (aiDone && !aiError) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [aiDone, aiError, retryNonce]);

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
  }, [steps.length, retryNonce]);

  const remaining = Math.max(0, ESTIMATED_TIME - elapsed);
  const progressPct = aiDone ? 100 : Math.min(95, ((step + 1) / steps.length) * 90 + (elapsed / ESTIMATED_TIME) * 10);
  const formatTime = (s: number) => s < 60 ? `~${s}s` : `~${Math.floor(s / 60)}m ${s % 60}s`;

  const CurrentIcon = steps[step].Icon;

  return (
    <div className="screen enter" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <FlowStepper current="generate" gender={prefs.gender} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
      {/* Spinner + icon */}
      <div style={{ position: "relative", width: 120, height: 120, marginBottom: 32 }}>
        <div style={{
          width: 120, height: 120, borderRadius: "50%",
          border: "3px solid hsla(var(--glamora-gold) / 0.15)",
          borderTopColor: "hsl(var(--glamora-gold))",
          animation: "spin 1.2s linear infinite",
        }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CurrentIcon size={40} color="hsl(var(--glamora-rose-dark))" strokeWidth={1.2} />
        </div>
      </div>

      <div className="serif" style={{ fontSize: 22, color: "hsl(var(--glamora-char))", marginBottom: 6, textAlign: "center" }}>
        {prefs.styleCategory === "makeup-only" ? "Analyzing Beauty..." : "Building Your Style..."}
      </div>
      <div style={{ fontSize: 13, color: aiError ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))", marginBottom: aiError?.includes("credits") ? 12 : 20, textAlign: "center" }}>
        {aiError || (animDone && !aiDone ? "Almost there, finalizing your look..." : (prefs.styleCategory === "makeup-only" ? "Personalizing your beauty profile" : "AI is generating your styled look"))}
      </div>
      {aiError?.includes("credits") && (
        <a
          href="https://lovable.dev/settings"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "10px 24px", marginBottom: 20, borderRadius: 12,
            background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-rose-dark)))",
            color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 4px 16px hsla(var(--glamora-gold) / 0.35)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          💳 Add Funds
        </a>
      )}

      {aiError && !aiError.includes("credits") && animDone && (
        <button
          className="btn-primary btn-rose"
          onClick={handleRetry}
          style={{ marginBottom: 20 }}
        >
          Try Again
        </button>
      )}

      {/* ── Fashion Tip Card ── */}
      {!aiError && (
        <div style={{
          width: "100%",
          marginBottom: 20,
          padding: "14px 16px",
          borderRadius: 14,
          background: "hsla(var(--glamora-gold) / 0.06)",
          border: "1px solid hsla(var(--glamora-gold) / 0.12)",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          minHeight: 64,
        }}>
          <Lightbulb size={16} style={{ marginTop: 2, flexShrink: 0, color: "hsl(var(--glamora-gold))" }} />
          <div style={{
            flex: 1,
            fontSize: 13,
            lineHeight: 1.5,
            color: "hsl(var(--glamora-char))",
            fontStyle: "italic",
            opacity: tipVisible ? 1 : 0,
            transform: tipVisible ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}>
            {tips[tipIdx]}
          </div>
        </div>
      )}

      {/* Steps list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        {steps.map((s, i) => {
          const StepIcon = s.Icon;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i <= step ? 1 : 0.3, transition: "opacity 0.4s ease" }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: i < step ? "hsla(var(--glamora-success) / 0.15)" : i === step ? "hsla(var(--glamora-rose-dark) / 0.15)" : "hsla(var(--glamora-char) / 0.05)",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.4s",
              }}>
                {i < step ? <Check size={14} color="hsl(var(--glamora-success))" /> : <StepIcon size={14} color={i === step ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))"} />}
              </div>
              <span style={{ fontSize: 12, color: i <= step ? "hsl(var(--glamora-char))" : "hsl(var(--glamora-gray-light))", fontWeight: i === step ? 600 : 400 }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 20, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
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
    </div>
  );
};

export default LoadingScreen;
