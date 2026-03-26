import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

const SplashScreen = ({ onDone }: Props) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHide(true), 2200);
    const t2 = setTimeout(onDone, 2800);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center z-[200] transition-opacity duration-[600ms] ${hide ? "opacity-0 pointer-events-none" : ""}`}
      style={{ background: "linear-gradient(160deg, #2A1E1A 0%, #1A1210 60%, #0E0A09 100%)" }}
    >
      <div
        className="absolute rounded-full"
        style={{ width: 280, height: 280, top: -60, right: -60, background: "radial-gradient(circle, rgba(184,107,89,0.35) 0%, transparent 70%)", animation: "glamFloat 5s ease-in-out infinite" }}
      />
      <div
        className="absolute rounded-full"
        style={{ width: 200, height: 200, bottom: 60, left: -40, background: "radial-gradient(circle, rgba(196,151,74,0.25) 0%, transparent 70%)", animation: "glamFloat 6s ease-in-out infinite 1s" }}
      />
      <div className="serif relative z-10 anim-fadeIn" style={{ fontSize: 52, fontWeight: 400, color: "hsl(var(--glamora-cream))", letterSpacing: 8 }}>
        GLAMORA<span style={{ color: "hsl(var(--glamora-gold))" }}>.</span>
      </div>
      <div className="relative z-10 anim-fadeIn d3" style={{ fontSize: 12, color: "rgba(251,246,240,0.45)", letterSpacing: 4, textTransform: "uppercase", marginTop: 10 }}>
        AI-Powered Style Studio
      </div>
      <div
        className="relative z-10 anim-fadeIn d5"
        style={{ marginTop: 60, width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(196,151,74,0.2)", borderTopColor: "hsl(var(--glamora-gold))", animation: "spin 1s linear infinite" }}
      />
    </div>
  );
};

export default SplashScreen;
