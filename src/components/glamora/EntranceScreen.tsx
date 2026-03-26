import { useState } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  onEnter: () => void;
}

const EntranceScreen = ({ onEnter }: Props) => {
  const [revealed, setRevealed] = useState(false);

  const handleTap = () => {
    if (revealed) return;
    setRevealed(true);
    setTimeout(onEnter, 1400);
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
        background: "linear-gradient(160deg, hsl(20 18% 9%) 0%, hsl(18 14% 6%) 100%)",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 320, height: 320, top: -80, right: -100,
          background: "radial-gradient(circle, hsla(var(--glamora-rose-dark) / 0.2) 0%, transparent 70%)",
          animation: "glamFloat 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 250, height: 250, bottom: 80, left: -80,
          background: "radial-gradient(circle, hsla(var(--glamora-gold) / 0.15) 0%, transparent 70%)",
          animation: "glamFloat 7s ease-in-out infinite 1.5s",
        }}
      />

      {/* Left curtain */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "50%", height: "100%",
          background: "linear-gradient(90deg, hsl(18 20% 8%) 0%, hsl(20 16% 11%) 70%, hsla(var(--glamora-gold) / 0.08) 100%)",
          zIndex: 20,
          transition: "transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)",
          transform: revealed ? "translateX(-105%)" : "translateX(0)",
          borderRight: "1px solid hsla(var(--glamora-gold) / 0.15)",
          boxShadow: "4px 0 30px hsla(0 0% 0% / 0.5)",
        }}
      >
        {/* Curtain texture lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              left: `${15 + i * 14}%`,
              width: 1,
              background: `linear-gradient(180deg, transparent 0%, hsla(var(--glamora-gold) / ${0.04 + i * 0.01}) 30%, hsla(var(--glamora-gold) / ${0.06 + i * 0.01}) 70%, transparent 100%)`,
            }}
          />
        ))}
        {/* Curtain drape effect */}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(90deg, transparent 0px, hsla(var(--glamora-rose-dark) / 0.02) 8px, transparent 16px)",
        }} />
      </div>

      {/* Right curtain */}
      <div
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "50%", height: "100%",
          background: "linear-gradient(-90deg, hsl(18 20% 8%) 0%, hsl(20 16% 11%) 70%, hsla(var(--glamora-gold) / 0.08) 100%)",
          zIndex: 20,
          transition: "transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)",
          transform: revealed ? "translateX(105%)" : "translateX(0)",
          borderLeft: "1px solid hsla(var(--glamora-gold) / 0.15)",
          boxShadow: "-4px 0 30px hsla(0 0% 0% / 0.5)",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0, bottom: 0,
              right: `${15 + i * 14}%`,
              width: 1,
              background: `linear-gradient(180deg, transparent 0%, hsla(var(--glamora-gold) / ${0.04 + i * 0.01}) 30%, hsla(var(--glamora-gold) / ${0.06 + i * 0.01}) 70%, transparent 100%)`,
            }}
          />
        ))}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(90deg, transparent 0px, hsla(var(--glamora-rose-dark) / 0.02) 8px, transparent 16px)",
        }} />
      </div>

      {/* Center curtain seam — gold line */}
      <div style={{
        position: "absolute",
        top: 0, bottom: 0,
        left: "50%", transform: "translateX(-50%)",
        width: 2,
        background: "linear-gradient(180deg, transparent 5%, hsla(var(--glamora-gold) / 0.4) 20%, hsla(var(--glamora-gold) / 0.6) 50%, hsla(var(--glamora-gold) / 0.4) 80%, transparent 95%)",
        zIndex: 25,
        transition: "opacity 0.6s ease",
        opacity: revealed ? 0 : 1,
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
          textShadow: "0 0 40px hsla(var(--glamora-gold) / 0.3)",
        }}>
          GLAMORA<span style={{ color: "hsl(var(--glamora-gold))" }}>.</span>
        </div>
        <div style={{
          fontSize: 13, letterSpacing: 4, textTransform: "uppercase",
          color: "hsla(var(--glamora-cream) / 0.5)",
          marginTop: 12,
        }}>
          AI-Powered Style Studio
        </div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color="hsl(var(--glamora-gold))" />
          <span style={{ fontSize: 14, color: "hsl(var(--glamora-gold))", fontWeight: 500 }}>
            Welcome to your runway
          </span>
          <Sparkles size={18} color="hsl(var(--glamora-gold))" />
        </div>
      </div>

      {/* Curtain overlay content — "Tap to enter" */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 30,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        opacity: revealed ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}>
        <div className="serif anim-fadeIn" style={{
          fontSize: 52, fontWeight: 400, letterSpacing: 8,
          color: "hsl(var(--glamora-cream))",
        }}>
          GLAMORA<span style={{ color: "hsl(var(--glamora-gold))" }}>.</span>
        </div>
        <div className="anim-fadeIn d2" style={{
          fontSize: 12, letterSpacing: 4, textTransform: "uppercase",
          color: "hsla(var(--glamora-cream) / 0.5)",
          marginTop: 12,
        }}>
          AI-Powered Style Studio
        </div>

        {/* Pulsing tap indicator */}
        <div className="anim-fadeIn d4" style={{ marginTop: 80 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            border: "2px solid hsla(var(--glamora-gold) / 0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse2 2.5s ease-in-out infinite",
            background: "hsla(var(--glamora-gold) / 0.06)",
          }}>
            <Sparkles size={28} color="hsl(var(--glamora-gold))" />
          </div>
        </div>
        <div className="anim-fadeIn d5" style={{
          marginTop: 16, fontSize: 13, letterSpacing: 3,
          textTransform: "uppercase", color: "hsla(var(--glamora-gold) / 0.7)",
          fontWeight: 500,
        }}>
          Tap to Glam
        </div>
      </div>
    </div>
  );
};

export default EntranceScreen;
