import { useMemo } from "react";

const palettes = [
  ["#D9917F", "#C4974A", "#EDCEC4", "#B86B59"],
  ["#8B5CF6", "#EC4899", "#F59E0B", "#6366F1"],
  ["#059669", "#10B981", "#34D399", "#047857"],
  ["#E11D48", "#F43F5E", "#FB7185", "#BE123C"],
  ["#7C3AED", "#A78BFA", "#C4B5FD", "#5B21B6"],
  ["#0891B2", "#06B6D4", "#67E8F9", "#0E7490"],
  ["#D97706", "#F59E0B", "#FCD34D", "#B45309"],
  ["#DB2777", "#EC4899", "#F9A8D4", "#9D174D"],
  ["#4F46E5", "#818CF8", "#C7D2FE", "#3730A3"],
  ["#0D9488", "#14B8A6", "#5EEAD4", "#0F766E"],
];

const emojis = ["💅", "👗", "✨", "🌸", "💎", "🦋", "🌺", "💄", "👠", "🌙", "🔮", "🪩", "💫", "🧿", "🌷"];
const shapes: string[] = ["circle", "blob1", "blob2"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Props {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  variant?: "hero" | "card" | "wide";
}

const DynamicVisual = ({ width = "100%", height = 220, borderRadius = 0, style, variant = "hero" }: Props) => {
  const visual = useMemo(() => {
    const palette = pick(palettes);
    const gradAngle = rand(110, 200);
    const emojiSet = Array.from({ length: rand(3, 6) }, () => pick(emojis));
    const orbs = Array.from({ length: rand(3, 5) }, (_, i) => ({
      color: palette[i % palette.length],
      size: rand(60, 180),
      x: rand(5, 85),
      y: rand(5, 85),
      opacity: Math.random() * 0.35 + 0.15,
      shape: pick(shapes),
      delay: i * 0.8,
    }));
    const floaters = emojiSet.map((e, i) => ({
      emoji: e,
      size: rand(24, 52),
      x: rand(8, 88),
      y: rand(10, 80),
      delay: i * 0.6 + 0.2,
      duration: rand(3, 6),
    }));
    return { palette, gradAngle, orbs, floaters };
  }, []);

  const bg = `linear-gradient(${visual.gradAngle}deg, ${visual.palette[0]}CC, ${visual.palette[1]}99, ${visual.palette[2]}66)`;

  return (
    <div style={{
      width, height, borderRadius, position: "relative", overflow: "hidden",
      background: bg, ...style,
    }}>
      {/* Orbs */}
      {visual.orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: orb.size, height: orb.size,
            left: `${orb.x}%`, top: `${orb.y}%`,
            transform: "translate(-50%, -50%)",
            borderRadius: orb.shape === "circle" ? "50%" : orb.shape === "blob1" ? "60% 40% 70% 30% / 50% 60% 40% 50%" : "40% 60% 30% 70% / 60% 40% 50% 50%",
            background: `radial-gradient(circle, ${orb.color}${Math.round(orb.opacity * 255).toString(16).padStart(2, "0")}, transparent 70%)`,
            filter: "blur(20px)",
            animation: `float ${rand(4, 7)}s ease-in-out infinite ${orb.delay}s`,
          }}
        />
      ))}

      {/* Floating emojis */}
      {visual.floaters.map((f, i) => (
        <div
          key={`e-${i}`}
          style={{
            position: "absolute",
            left: `${f.x}%`, top: `${f.y}%`,
            fontSize: f.size,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
            animation: `float ${f.duration}s ease-in-out infinite ${f.delay}s`,
            opacity: 0.85,
            zIndex: 2,
          }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Shimmer overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)",
        zIndex: 3,
      }} />

      {variant === "hero" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.25) 100%)",
          zIndex: 3,
        }} />
      )}
    </div>
  );
};

export default DynamicVisual;
