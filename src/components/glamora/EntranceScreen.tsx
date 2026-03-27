import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { Gender } from "./GlamoraApp";

interface Props {
  onEnter: (gender: Gender) => void;
}

const EntranceScreen = ({ onEnter }: Props) => {
  const [revealed, setRevealed] = useState(false);
  const [gender, setGender] = useState<Gender>("female");

  const isMale = gender === "male";

  // Theme colors based on gender
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";
  const curtainBase = isMale
    ? "hsl(22 14% 10%)"
    : "hsl(16 22% 10%)";
  const curtainEdge = isMale
    ? "hsl(24 16% 14%)"
    : "hsl(18 20% 13%)";

  const handleTap = () => {
    if (revealed) return;
    setRevealed(true);
    setTimeout(() => onEnter(gender), 1400);
  };

  return (
    <div
      className="screen"
      onClick={handleTap}
      style={{
        minHeight: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: isMale
          ? "linear-gradient(160deg, hsl(22 14% 8%) 0%, hsl(20 10% 5%) 100%)"
          : "linear-gradient(160deg, hsl(16 22% 9%) 0%, hsl(14 18% 5%) 100%)",
        transition: "background 0.6s ease",
      }}
    >
      {/* Ambient glow orbs — themed */}
      <div
        className="absolute rounded-full"
        style={{
          width: 320, height: 320, top: -80, right: -100,
          background: `radial-gradient(circle, hsla(${accent} / 0.25) 0%, transparent 70%)`,
          animation: "glamFloat 6s ease-in-out infinite",
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 250, height: 250, bottom: 80, left: -80,
          background: `radial-gradient(circle, hsla(${accentLight} / 0.18) 0%, transparent 70%)`,
          animation: "glamFloat 7s ease-in-out infinite 1.5s",
          transition: "background 0.6s ease",
        }}
      />

      {/* Shimmer overlay for both curtains */}
      <style>{`
        @keyframes curtainShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fabricWave {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(1.01); }
        }
      `}</style>

      {/* Left curtain — luxurious velvet */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "50%", height: "100%",
          background: `linear-gradient(95deg, ${curtainBase} 0%, ${curtainEdge} 40%, ${curtainBase} 60%, ${curtainEdge} 80%, hsla(${accent} / 0.06) 100%)`,
          zIndex: 20,
          transition: "transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), background 0.6s ease",
          transform: revealed ? "translateX(-105%)" : "translateX(0)",
          borderRight: `1px solid hsla(${accent} / 0.2)`,
          boxShadow: `4px 0 40px hsla(0 0% 0% / 0.6), inset -20px 0 40px hsla(0 0% 0% / 0.3)`,
        }}
      >
        {/* Fabric fold texture — vertical pleats */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`fold-l-${i}`}
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: `${10 + i * 11}%`,
              width: 2,
              background: `linear-gradient(180deg, transparent 0%, hsla(${accent} / ${0.03 + i * 0.008}) 15%, hsla(${accent} / ${0.08 + i * 0.01}) 50%, hsla(${accent} / ${0.03 + i * 0.008}) 85%, transparent 100%)`,
              transition: "background 0.6s ease",
            }}
          />
        ))}
        {/* Fabric highlight — silk sheen */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`sheen-l-${i}`}
            style={{
              position: "absolute",
              top: `${15 + i * 20}%`, left: `${20 + i * 15}%`,
              width: 40, height: 120,
              background: `radial-gradient(ellipse, hsla(${accent} / 0.06) 0%, transparent 70%)`,
              borderRadius: "50%",
              transform: "rotate(-10deg)",
              transition: "background 0.6s ease",
            }}
          />
        ))}
        {/* Drape texture */}
        <div style={{
          position: "absolute", inset: 0,
          background: `repeating-linear-gradient(92deg, transparent 0px, hsla(${accent} / 0.015) 6px, transparent 12px)`,
          transition: "background 0.6s ease",
        }} />
        {/* Moving shimmer effect */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, transparent 0%, hsla(${accent} / 0.08) 25%, hsla(${accentLight} / 0.12) 50%, hsla(${accent} / 0.08) 75%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "curtainShimmer 4s ease-in-out infinite",
          transition: "background 0.6s ease",
        }} />
        {/* Bottom weight / tassel shadow */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(180deg, transparent, hsla(0 0% 0% / 0.4))",
        }} />
      </div>

      {/* Right curtain — luxurious velvet */}
      <div
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "50%", height: "100%",
          background: `linear-gradient(-95deg, ${curtainBase} 0%, ${curtainEdge} 40%, ${curtainBase} 60%, ${curtainEdge} 80%, hsla(${accent} / 0.06) 100%)`,
          zIndex: 20,
          transition: "transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), background 0.6s ease",
          transform: revealed ? "translateX(105%)" : "translateX(0)",
          borderLeft: `1px solid hsla(${accent} / 0.2)`,
          boxShadow: `-4px 0 40px hsla(0 0% 0% / 0.6), inset 20px 0 40px hsla(0 0% 0% / 0.3)`,
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={`fold-r-${i}`}
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              right: `${10 + i * 11}%`,
              width: 2,
              background: `linear-gradient(180deg, transparent 0%, hsla(${accent} / ${0.03 + i * 0.008}) 15%, hsla(${accent} / ${0.08 + i * 0.01}) 50%, hsla(${accent} / ${0.03 + i * 0.008}) 85%, transparent 100%)`,
              transition: "background 0.6s ease",
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`sheen-r-${i}`}
            style={{
              position: "absolute",
              top: `${20 + i * 18}%`, right: `${15 + i * 15}%`,
              width: 40, height: 120,
              background: `radial-gradient(ellipse, hsla(${accent} / 0.06) 0%, transparent 70%)`,
              borderRadius: "50%",
              transform: "rotate(10deg)",
              transition: "background 0.6s ease",
            }}
          />
        ))}
        <div style={{
          position: "absolute", inset: 0,
          background: `repeating-linear-gradient(-92deg, transparent 0px, hsla(${accent} / 0.015) 6px, transparent 12px)`,
          transition: "background 0.6s ease",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(-90deg, transparent 0%, hsla(${accent} / 0.08) 25%, hsla(${accentLight} / 0.12) 50%, hsla(${accent} / 0.08) 75%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "curtainShimmer 4s ease-in-out infinite 0.5s",
          transition: "background 0.6s ease",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(180deg, transparent, hsla(0 0% 0% / 0.4))",
        }} />
      </div>

      {/* Center curtain seam — ornate gold line */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: 3,
        background: `linear-gradient(180deg, transparent 3%, hsla(${accent} / 0.3) 10%, hsla(${accent} / 0.7) 50%, hsla(${accent} / 0.3) 90%, transparent 97%)`,
        zIndex: 25,
        transition: "opacity 0.6s ease, background 0.6s ease",
        opacity: revealed ? 0 : 1,
        boxShadow: `0 0 12px hsla(${accent} / 0.3)`,
      }} />

      {/* Content behind curtains */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        opacity: revealed ? 1 : 0.3,
        transition: "opacity 0.8s ease 0.4s",
      }}>
        <div className="serif" style={{
          fontSize: 48, fontWeight: 400, letterSpacing: 6,
          color: "hsl(var(--glamora-cream))",
          textShadow: `0 0 40px hsla(${accent} / 0.3)`,
          transition: "text-shadow 0.6s ease",
        }}>
          GLOSSETI<span style={{ color: `hsl(${accent})`, transition: "color 0.6s ease" }}>.</span>
        </div>
        <div style={{
          fontSize: 13, letterSpacing: 4, textTransform: "uppercase",
          color: "hsla(var(--glamora-cream) / 0.5)",
          marginTop: 12,
        }}>
          AI-Powered Style Studio
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color={`hsl(${accent})`} />
          <span style={{ fontSize: 14, color: `hsl(${accent})`, fontWeight: 500, transition: "color 0.6s ease" }}>
            Welcome to your runway
          </span>
          <Sparkles size={18} color={`hsl(${accent})`} />
        </div>
      </div>

      {/* Curtain overlay content */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 30,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        pointerEvents: revealed ? "none" : "auto",
        opacity: revealed ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}>
        <div className="serif anim-fadeIn" style={{
          fontSize: 52, fontWeight: 400, letterSpacing: 8,
          color: "hsl(var(--glamora-cream))",
        }}>
          GLOSSETI<span style={{ color: `hsl(${accent})`, transition: "color 0.6s ease" }}>.</span>
        </div>
        <div className="anim-fadeIn d2" style={{
          fontSize: 12, letterSpacing: 4, textTransform: "uppercase",
          color: "hsla(var(--glamora-cream) / 0.5)",
          marginTop: 12,
        }}>
          AI-Powered Style Studio
        </div>

        {/* Gender toggle */}
        <div className="anim-fadeIn d3" onClick={(e) => e.stopPropagation()} style={{
          marginTop: 36, display: "flex", borderRadius: 100, overflow: "hidden",
          background: "hsla(0 0% 0% / 0.4)", backdropFilter: "blur(10px)",
          border: "1.5px solid hsla(0 0% 100% / 0.12)",
          padding: 3, pointerEvents: "auto",
        }}>
          {([
            { id: "female" as Gender, label: "♀", full: "Her" },
            { id: "male" as Gender, label: "♂", full: "Him" },
          ]).map((opt) => {
            const isActive = gender === opt.id;
            const activeAccent = opt.id === "male" ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
            const activeLight = opt.id === "male" ? "var(--glamora-gold-light)" : "var(--glamora-rose)";
            return (
              <button
                key={opt.id}
                onClick={(e) => { e.stopPropagation(); setGender(opt.id); }}
                style={{
                  padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer",
                  background: isActive
                    ? `linear-gradient(135deg, hsl(${activeAccent}), hsl(${activeLight}))`
                    : "transparent",
                  color: isActive ? "white" : "hsla(0 0% 100% / 0.5)",
                  fontSize: 13, fontWeight: 600, fontFamily: "'Jost', sans-serif",
                  transition: "all 0.3s ease",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <span style={{ fontSize: 15 }}>{opt.label}</span> {opt.full}
              </button>
            );
          })}
        </div>

        {/* Pulsing tap indicator */}
        <div className="anim-fadeIn d4" style={{ marginTop: 40 }}>
          <div style={{
            width: 76, height: 76, borderRadius: "50%",
            border: `2px solid hsla(${accent} / 0.4)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse2 2.5s ease-in-out infinite",
            background: `hsla(${accent} / 0.06)`,
            boxShadow: `0 0 30px hsla(${accent} / 0.15)`,
            transition: "border-color 0.6s ease, background 0.6s ease, box-shadow 0.6s ease",
          }}>
            <Sparkles size={28} color={`hsl(${accent})`} />
          </div>
        </div>
        <div className="anim-fadeIn d5" style={{
          marginTop: 16, fontSize: 13, letterSpacing: 3,
          textTransform: "uppercase", color: `hsla(${accent} / 0.7)`,
          fontWeight: 500, transition: "color 0.6s ease",
        }}>
          Tap to Style
        </div>
      </div>
    </div>
  );
};

export default EntranceScreen;
