import { useEffect, useState, useRef } from "react";

interface Props { onDone: () => void; }

const DEV_PIN = "5218";

const SplashScreen = ({ onDone }: Props) => {
  const [hide, setHide] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>();
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const doneTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fadeTimerRef.current = setTimeout(() => setHide(true), 2200);
    doneTimerRef.current = setTimeout(onDone, 2800);
    return () => { clearTimeout(fadeTimerRef.current); clearTimeout(doneTimerRef.current); };
  }, [onDone]);

  const handleLogoTap = () => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      // Pause the splash transition
      clearTimeout(fadeTimerRef.current);
      clearTimeout(doneTimerRef.current);
      setHide(false);
      setShowPin(true);
      setPin("");
      setPinError(false);
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    }
  };

  const handlePinSubmit = () => {
    if (pin === DEV_PIN) {
      const isActive = localStorage.getItem("glamora_dev_mode") === "unlocked";
      if (isActive) {
        localStorage.removeItem("glamora_dev_mode");
      } else {
        localStorage.setItem("glamora_dev_mode", "unlocked");
      }
      setShowPin(false);
      setHide(true);
      setTimeout(onDone, 600);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 1500);
    }
  };

  const handlePinCancel = () => {
    setShowPin(false);
    setHide(true);
    setTimeout(onDone, 600);
  };

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

      {showPin ? (
        <div className="relative z-10 anim-fadeIn" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          padding: "30px 24px", borderRadius: 20,
          background: "rgba(30,22,18,0.95)",
          border: "1px solid rgba(196,151,74,0.2)",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(251,246,240,0.7)", letterSpacing: 1 }}>
            Enter PIN
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: 40, height: 48, borderRadius: 10,
                border: pinError
                  ? "2px solid rgba(255,80,80,0.6)"
                  : pin[i]
                    ? "2px solid rgba(196,151,74,0.6)"
                    : "2px solid rgba(196,151,74,0.2)",
                background: pin[i] ? "rgba(196,151,74,0.1)" : "rgba(255,255,255,0.03)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 700, color: "rgba(196,151,74,0.9)",
                transition: "all 0.2s",
              }}>
                {pin[i] ? "•" : ""}
              </div>
            ))}
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 4);
              setPin(val);
              setPinError(false);
            }}
            onKeyDown={(e) => { if (e.key === "Enter" && pin.length === 4) handlePinSubmit(); }}
            autoFocus
            style={{
              position: "absolute", opacity: 0, width: 1, height: 1,
            }}
          />
          {pinError && (
            <div style={{ fontSize: 11, color: "rgba(255,80,80,0.8)", fontWeight: 500 }}>
              Incorrect PIN
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handlePinCancel}
              style={{
                padding: "8px 20px", borderRadius: 10, border: "1px solid rgba(196,151,74,0.2)",
                background: "transparent", color: "rgba(251,246,240,0.5)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handlePinSubmit}
              disabled={pin.length < 4}
              style={{
                padding: "8px 20px", borderRadius: 10, border: "none",
                background: pin.length === 4 ? "rgba(196,151,74,0.8)" : "rgba(196,151,74,0.2)",
                color: pin.length === 4 ? "white" : "rgba(251,246,240,0.3)",
                fontSize: 12, fontWeight: 600, cursor: pin.length === 4 ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <>
          <img
            src="/glosseti-icon-only.png"
            alt="Glosseti"
            className="relative z-10 anim-fadeIn cursor-pointer"
            style={{ width: 120, height: 120, objectFit: "contain" }}
            onClick={handleLogoTap}
          />
          <div className="relative z-10 anim-fadeIn d3" style={{ fontSize: 12, color: "rgba(251,246,240,0.45)", letterSpacing: 4, textTransform: "uppercase", marginTop: 10 }}>
            AI-Powered Style Studio
          </div>
          <div
            className="relative z-10 anim-fadeIn d5"
            style={{ marginTop: 60, width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(196,151,74,0.2)", borderTopColor: "hsl(var(--glamora-gold))", animation: "spin 1s linear infinite" }}
          />
        </>
      )}
    </div>
  );
};

export default SplashScreen;
