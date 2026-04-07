import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Clock, TrendingUp, ArrowRight, ShoppingBag } from "lucide-react";
import type { Gender, StyleCategory } from "./GlamoraApp";

interface Props {
  onGenerate: () => void;
  onGetStyled: (category: StyleCategory) => void;
  gender: Gender;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const TREND_PILLS_FEMALE = [
  { label: "Bold Glam", color: "hsla(0 70% 55% / 0.85)", bg: "hsla(0 70% 55% / 0.14)", border: "hsla(0 70% 55% / 0.3)", category: "formal" as StyleCategory },
  { label: "Minimalist", color: "hsla(220 70% 60% / 0.9)", bg: "hsla(220 70% 60% / 0.14)", border: "hsla(220 70% 60% / 0.3)", category: "minimalist" as StyleCategory },
  { label: "Boho", color: "hsla(140 55% 50% / 0.9)", bg: "hsla(140 55% 50% / 0.14)", border: "hsla(140 55% 50% / 0.3)", category: "bohemian" as StyleCategory },
  { label: "Soft Fem", color: "hsla(340 55% 60% / 0.9)", bg: "hsla(340 55% 60% / 0.14)", border: "hsla(340 55% 60% / 0.3)", category: "cottagecore" as StyleCategory },
];

const TREND_PILLS_MALE = [
  { label: "Sharp & Clean", color: "hsla(220 60% 55% / 0.9)", bg: "hsla(220 60% 55% / 0.14)", border: "hsla(220 60% 55% / 0.3)", category: "formal" as StyleCategory },
  { label: "Streetwear", color: "hsla(35 80% 55% / 0.9)", bg: "hsla(35 80% 55% / 0.14)", border: "hsla(35 80% 55% / 0.3)", category: "streetwear" as StyleCategory },
  { label: "Rugged", color: "hsla(25 50% 45% / 0.9)", bg: "hsla(25 50% 45% / 0.14)", border: "hsla(25 50% 45% / 0.3)", category: "rugged" as StyleCategory },
  { label: "Athletic", color: "hsla(140 55% 50% / 0.9)", bg: "hsla(140 55% 50% / 0.14)", border: "hsla(140 55% 50% / 0.3)", category: "athleisure" as StyleCategory },
];

const TRENDS_FEMALE = [
  { label: "Quiet Luxury", pct: 87, color: "hsla(0 70% 55% / 0.8)", category: "minimalist" as StyleCategory },
  { label: "Coastal Cowgirl", pct: 72, color: "hsla(220 70% 60% / 0.8)", category: "bohemian" as StyleCategory },
  { label: "Dark Romantic", pct: 64, color: "hsla(280 55% 55% / 0.8)", category: "edgy" as StyleCategory },
  { label: "Athleisure Chic", pct: 51, color: "hsla(140 55% 50% / 0.8)", category: "athleisure" as StyleCategory },
];

const TRENDS_MALE = [
  { label: "Quiet Luxury", pct: 84, color: "hsla(220 60% 55% / 0.8)", category: "minimalist" as StyleCategory },
  { label: "Techwear", pct: 71, color: "hsla(200 55% 50% / 0.8)", category: "techwear" as StyleCategory },
  { label: "New Preppy", pct: 63, color: "hsla(140 50% 45% / 0.8)", category: "preppy" as StyleCategory },
  { label: "Gorpcore", pct: 55, color: "hsla(25 50% 45% / 0.8)", category: "streetwear" as StyleCategory },
];

function getCountdown(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const diff = tomorrow.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

const DailyLookCard = ({ onGenerate, onGetStyled, gender }: Props) => {
  const isMale = gender === "male";
  const [countdown, setCountdown] = useState(getCountdown);
  const [tapped, setTapped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const particlesRef = useRef<Particle[]>([]);

  const trendPills = isMale ? TREND_PILLS_MALE : TREND_PILLS_FEMALE;
  const trends = isMale ? TRENDS_MALE : TRENDS_FEMALE;
  const morphLayers = isMale
    ? ["Jacket / Top", "Pants", "Shoes & Watch"]
    : ["Top Layer", "Bottom", "Accessories"];

  useEffect(() => {
    const iv = setInterval(() => setCountdown(getCountdown()), 30_000);
    return () => clearInterval(iv);
  }, []);

  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    }));
  }

  const handleTap = useCallback(() => {
    if (tapped) return;
    setTapped(true);
    setTimeout(() => setShowResult(true), 800);
    setTimeout(() => {
      onGenerate();
      setTapped(false);
      setShowResult(false);
    }, 2200);
  }, [tapped, onGenerate]);

  return (
    <div style={{ padding: "0 20px" }}>
      {/* ══ Daily Look Card ══ */}
      <div
        onClick={handleTap}
        style={{
          position: "relative",
          width: "90%",
          margin: "0 auto",
          borderRadius: 16,
          overflow: "hidden",
          cursor: "pointer",
          background: isMale
            ? "linear-gradient(165deg, hsla(220 40% 50% / 0.18) 0%, hsla(200 35% 45% / 0.2) 50%, hsla(240 30% 40% / 0.14) 100%)"
            : "linear-gradient(165deg, hsla(340 45% 72% / 0.2) 0%, hsla(260 50% 68% / 0.22) 50%, hsla(220 40% 60% / 0.15) 100%)",
          border: isMale
            ? "1.5px solid hsla(220 50% 55% / 0.25)"
            : "1.5px solid hsla(280 50% 70% / 0.25)",
          boxShadow: isMale
            ? "0 8px 32px hsla(220 50% 40% / 0.15), inset 0 1px 0 hsla(0 0% 100% / 0.1)"
            : "0 8px 32px hsla(280 50% 50% / 0.15), inset 0 1px 0 hsla(0 0% 100% / 0.1)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: tapped ? "scale(0.97)" : "scale(1)",
        }}
      >
        {/* Edge shimmer */}
        <div style={{
          position: "absolute", inset: -1, borderRadius: 17, pointerEvents: "none", zIndex: 3,
          background: isMale
            ? "linear-gradient(135deg, transparent 30%, hsla(220 50% 60% / 0.25) 45%, hsla(200 55% 55% / 0.3) 50%, hsla(220 50% 60% / 0.25) 55%, transparent 70%)"
            : "linear-gradient(135deg, transparent 30%, hsla(340 50% 75% / 0.25) 45%, hsla(260 60% 75% / 0.3) 50%, hsla(340 50% 75% / 0.25) 55%, transparent 70%)",
          backgroundSize: "300% 300%",
          animation: "dailyShimmer 4s ease-in-out infinite",
        }} />

        {/* Sparkle particles */}
        {particlesRef.current.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "hsla(0 0% 100% / 0.7)",
              boxShadow: `0 0 ${p.size * 2}px ${isMale ? "hsla(220 60% 60% / 0.5)" : "hsla(280 60% 75% / 0.5)"}`,
              zIndex: 4,
              pointerEvents: "none",
              animation: `sparkleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        {/* Card content */}
        <div style={{ position: "relative", zIndex: 5, padding: "20px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Clock size={13} color={isMale ? "hsla(220 60% 65% / 0.9)" : "hsla(260 60% 75% / 0.9)"} />
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
              fontFamily: "'Jost', monospace",
              color: isMale ? "hsla(220 60% 70% / 0.9)" : "hsla(260 60% 80% / 0.9)",
              textTransform: "uppercase",
            }}>
              New look in {countdown}
            </span>
          </div>

          <div className="serif" style={{
            fontSize: 22, fontWeight: 600, lineHeight: 1.2,
            color: "hsla(0 0% 100% / 0.95)", marginBottom: 6,
          }}>
            {isMale ? "Your Daily Fit" : "Your Daily Look"}
          </div>
          <div style={{
            fontSize: 12, color: "hsla(0 0% 100% / 0.55)", lineHeight: 1.4, marginBottom: 16,
          }}>
            {isMale
              ? "AI-curated outfit based on your style & today's trends"
              : "AI-curated outfit & beauty based on your style & trends"}
          </div>

          {/* Tap-to-generate animation area */}
          <div style={{
            position: "relative",
            height: tapped ? 120 : 56,
            transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden",
          }}>
            <div style={{
              opacity: tapped ? 0 : 1,
              transform: tapped ? "translateY(-20px)" : "translateY(0)",
              transition: "all 0.3s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              padding: "14px 20px", borderRadius: 14,
              background: isMale
                ? "linear-gradient(135deg, hsla(220 50% 50% / 0.35), hsla(200 45% 45% / 0.35))"
                : "linear-gradient(135deg, hsla(340 50% 65% / 0.35), hsla(260 55% 60% / 0.35))",
              border: "1px solid hsla(0 0% 100% / 0.15)",
            }}>
              <Sparkles size={16} color="hsla(0 0% 100% / 0.9)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)", letterSpacing: 0.5 }}>
                {isMale ? "Tap to Reveal Today's Fit" : "Tap to Reveal Today's Look"}
              </span>
              <ArrowRight size={14} color="hsla(0 0% 100% / 0.7)" />
            </div>

            {tapped && (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 12,
                animation: "morphIn 0.6s ease-out forwards",
              }}>
                {morphLayers.map((layer, i) => (
                  <div key={layer} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    opacity: showResult ? 1 : 0,
                    transform: showResult ? "translateX(0)" : "translateX(-20px)",
                    transition: `all 0.4s ease ${i * 0.15}s`,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: i === 0
                        ? (isMale ? "hsla(220 60% 55% / 0.9)" : "hsla(340 60% 65% / 0.9)")
                        : i === 1
                        ? (isMale ? "hsla(200 50% 50% / 0.9)" : "hsla(260 55% 65% / 0.9)")
                        : "hsla(35 70% 60% / 0.9)",
                    }} />
                    <span style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.7)", fontWeight: 500 }}>{layer}</span>
                    <div style={{
                      height: 3, borderRadius: 3, flex: 1, minWidth: 60,
                      background: "hsla(0 0% 100% / 0.08)", overflow: "hidden",
                    }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        width: showResult ? "100%" : "0%",
                        background: i === 0
                          ? (isMale ? "hsla(220 60% 55% / 0.7)" : "hsla(340 60% 65% / 0.7)")
                          : i === 1
                          ? (isMale ? "hsla(200 50% 50% / 0.7)" : "hsla(260 55% 65% / 0.7)")
                          : "hsla(35 70% 60% / 0.7)",
                        transition: `width 0.8s ease ${0.3 + i * 0.2}s`,
                      }} />
                    </div>
                  </div>
                ))}
                <span style={{
                  fontSize: 10, color: "hsla(0 0% 100% / 0.5)", fontWeight: 500,
                  animation: "pulse2 1.2s ease-in-out infinite",
                }}>
                  {isMale ? "🔥 Building your fit…" : "✨ Generating your look…"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ Trending Now Pills — tappable ══ */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
        marginTop: 14, padding: "0 4px",
      }}>
        {trendPills.map((pill) => (
          <button
            key={pill.label}
            onClick={(e) => { e.stopPropagation(); onGetStyled(pill.category); }}
            style={{
              padding: "6px 14px", borderRadius: 100,
              background: pill.bg,
              border: `1px solid ${pill.border}`,
              fontSize: 11, fontWeight: 600, color: pill.color,
              letterSpacing: 0.3,
              cursor: "pointer",
              fontFamily: "'Jost', sans-serif",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "flex", alignItems: "center", gap: 5,
            }}
            onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <ShoppingBag size={10} /> {pill.label}
          </button>
        ))}
      </div>

      {/* ══ Trends of the Week — tappable ══ */}
      <div style={{ marginTop: 18, padding: "0 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <TrendingUp size={14} color={isMale ? "hsla(220 55% 60% / 0.9)" : "hsla(260 55% 70% / 0.9)"} />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            textTransform: "uppercase",
            color: "hsla(0 0% 100% / 0.6)",
          }}>
            {isMale ? "Trends for Him" : "Trends of the Week"}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {trends.map((trend) => (
            <button
              key={trend.label}
              onClick={(e) => { e.stopPropagation(); onGetStyled(trend.category); }}
              style={{
                background: "none", border: "none", padding: 0,
                cursor: "pointer", textAlign: "left", width: "100%",
                borderRadius: 10, transition: "background 0.15s",
              }}
              onPointerDown={(e) => (e.currentTarget.style.background = "hsla(0 0% 100% / 0.04)")}
              onPointerUp={(e) => (e.currentTarget.style.background = "none")}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4,
                padding: "6px 8px 0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "hsla(0 0% 100% / 0.8)" }}>{trend.label}</span>
                  <ArrowRight size={11} color="hsla(0 0% 100% / 0.3)" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: trend.color }}>+{trend.pct}%</span>
                  <span style={{
                    fontSize: 9, fontWeight: 600, color: "hsla(0 0% 100% / 0.4)",
                    padding: "2px 6px", borderRadius: 6,
                    background: "hsla(0 0% 100% / 0.06)",
                  }}>
                    Style & Shop →
                  </span>
                </div>
              </div>
              <div style={{
                height: 5, borderRadius: 5, margin: "0 8px 4px",
                background: "hsla(0 0% 100% / 0.06)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 5,
                  width: `${trend.pct}%`,
                  background: `linear-gradient(90deg, ${trend.color}, transparent)`,
                  animation: "growBar 1.2s ease-out forwards",
                }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyLookCard;
