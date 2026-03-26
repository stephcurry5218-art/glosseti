import heroBg from "@/assets/hero-bg.jpg";
import cardBg from "@/assets/card-bg.jpg";
import onboardingBg from "@/assets/onboarding-bg.jpg";

interface Props {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  variant?: "hero" | "card" | "wide" | "onboarding";
}

const variantImages = {
  hero: heroBg,
  card: cardBg,
  wide: heroBg,
  onboarding: onboardingBg,
};

const DynamicVisual = ({ width = "100%", height = 220, borderRadius = 0, style, variant = "hero" }: Props) => {
  const bgImage = variantImages[variant] || heroBg;

  return (
    <div style={{
      width, height, borderRadius, position: "relative", overflow: "hidden",
      ...style,
    }}>
      <img
        src={bgImage}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {/* Shimmer overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)",
        zIndex: 3,
      }} />
      {variant === "hero" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)",
          zIndex: 3,
        }} />
      )}
      {variant === "onboarding" && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 30%, hsla(20 18% 9% / 0.7) 100%)",
          zIndex: 3,
        }} />
      )}
    </div>
  );
};

export default DynamicVisual;
