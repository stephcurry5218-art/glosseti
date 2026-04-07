import { useEffect, useState } from "react";

interface Props {
  onDone: () => void;
}

const SplashScreen = ({ onDone }: Props) => {
  const [phase, setPhase] = useState<"logo" | "reveal" | "exit">("logo");

  useEffect(() => {
    // Phase 1: Logo + wordmark fade in (already visible via CSS)
    // Phase 2: Reveal tagline + subtle ring
    const t1 = setTimeout(() => setPhase("reveal"), 900);
    // Phase 3: Exit
    const t2 = setTimeout(() => setPhase("exit"), 2400);
    const t3 = setTimeout(onDone, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "hsl(18 22% 4%)",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 0.6s ease",
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      {/* Centered radial glow behind logo */}
      <div style={{
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, hsla(32 55% 52% / 0.12) 0%, transparent 70%)",
        filter: "blur(40px)",
        animation: "glamFloat 6s ease-in-out infinite",
      }} />

      {/* Logo icon */}
      <img
        src="/glosseti-icon-only.png"
        alt="Glosseti"
        style={{
          width: 88,
          height: 88,
          objectFit: "contain",
          position: "relative",
          zIndex: 2,
          opacity: phase === "logo" || phase === "reveal" ? 1 : 0,
          transform: phase === "logo" ? "scale(0.9)" : "scale(1)",
          transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: "drop-shadow(0 4px 20px hsla(32 55% 52% / 0.35))",
        }}
      />

      {/* Wordmark */}
      <div
        className="serif"
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: 16,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 3,
          background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          opacity: phase === "logo" ? 0 : 1,
          transform: phase === "logo" ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        }}
      >
        GLOSSETI
      </div>

      {/* Tagline — iOS style, minimal */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: 8,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "hsla(0 0% 100% / 0.35)",
          fontFamily: "'Jost', sans-serif",
          opacity: phase === "reveal" ? 1 : 0,
          transform: phase === "reveal" ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}
      >
        AI-Powered Style Studio
      </div>

      {/* Subtle loading indicator — thin line */}
      <div style={{
        position: "absolute",
        bottom: "calc(env(safe-area-inset-bottom, 20px) + 40px)",
        width: 40,
        height: 2,
        borderRadius: 2,
        overflow: "hidden",
        background: "hsla(0 0% 100% / 0.06)",
        opacity: phase === "reveal" ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: 2,
          background: "linear-gradient(90deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
          animation: "launchProgress 1.5s ease-in-out infinite",
        }} />
      </div>
    </div>
  );
};

export default SplashScreen;
