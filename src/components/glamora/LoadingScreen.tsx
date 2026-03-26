import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

const steps = [
  { label: "Analyzing facial features...", icon: "🔍" },
  { label: "Detecting skin tone...", icon: "🎨" },
  { label: "Matching beauty profiles...", icon: "💎" },
  { label: "Curating your looks...", icon: "✨" },
];

const LoadingScreen = ({ onDone }: Props) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        if (s >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onDone, 800);
          return s;
        }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="screen enter" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100%", padding: "0 40px" }}>
      {/* Animated circle */}
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 48 }}>
        <div
          style={{
            width: 140, height: 140, borderRadius: "50%",
            border: "3px solid hsla(36 50% 53% / 0.15)",
            borderTopColor: "hsl(var(--glamora-gold))",
            animation: "spin 1.2s linear infinite",
          }}
        />
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48,
        }}>
          {steps[step].icon}
        </div>
      </div>

      <div className="serif" style={{ fontSize: 24, color: "hsl(var(--glamora-char))", marginBottom: 12, textAlign: "center" }}>
        Analyzing...
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
        {steps.map((s, i) => (
          <div
            key={s.label}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              opacity: i <= step ? 1 : 0.3,
              transition: "opacity 0.4s ease",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: i <= step ? "hsla(12 39% 54% / 0.15)" : "hsla(16 20% 11% / 0.05)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
              transition: "background 0.4s",
            }}>
              {i < step ? "✓" : s.icon}
            </div>
            <span style={{ fontSize: 14, color: i <= step ? "hsl(var(--glamora-char))" : "hsl(var(--glamora-gray-light))", fontWeight: i === step ? 600 : 400 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 40, width: "100%", height: 4, borderRadius: 2, background: "hsla(16 20% 11% / 0.08)" }}>
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
