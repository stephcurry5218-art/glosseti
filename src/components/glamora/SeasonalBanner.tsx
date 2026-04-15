import { ArrowRight, GraduationCap, Heart, Snowflake, Sun, Leaf, TreePine, PartyPopper, Star, Sparkles, Gift, Flower2, Baby, Ghost, Flag } from "lucide-react";
import type { StyleCategory } from "./GlamoraApp";

interface SeasonalPromo {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  icon: React.ElementType;
  gradient: string;
  border: string;
  accentColor: string;
  category?: StyleCategory;
  months: number[]; // 0-indexed
  dayRange?: [number, number]; // optional day range within those months
}

const PROMOS: SeasonalPromo[] = [
  // New Year (Dec 26 – Jan 15)
  {
    id: "new-year",
    title: "New Year, New Style",
    subtitle: "Start fresh — explore bold new looks for 2025",
    cta: "Get Styled",
    icon: PartyPopper,
    gradient: "linear-gradient(135deg, hsla(45 80% 55% / 0.15), hsla(280 50% 50% / 0.1))",
    border: "hsla(45 80% 55% / 0.3)",
    accentColor: "hsl(45 80% 55%)",
    months: [0], // January
    dayRange: [1, 15],
  },
  // Valentine's Day (Feb 1–14)
  {
    id: "valentines",
    title: "Valentine's Date Night",
    subtitle: "Look stunning for your special evening out",
    cta: "Date Night Looks",
    icon: Heart,
    gradient: "linear-gradient(135deg, hsla(340 70% 50% / 0.15), hsla(350 80% 60% / 0.08))",
    border: "hsla(340 70% 55% / 0.3)",
    accentColor: "hsl(340 70% 55%)",
    months: [1], // February
    dayRange: [1, 14],
  },
  // Spring Break (Mar 1–20)
  {
    id: "spring-break",
    title: "Spring Break Ready",
    subtitle: "Beach, brunch & beyond — fresh warm-weather fits",
    cta: "Spring Styles",
    icon: Sun,
    gradient: "linear-gradient(135deg, hsla(180 60% 50% / 0.12), hsla(40 70% 55% / 0.1))",
    border: "hsla(180 60% 50% / 0.3)",
    accentColor: "hsl(180 60% 50%)",
    months: [2], // March
    dayRange: [1, 20],
  },
  // Easter (Mar 21 – Apr 10)
  {
    id: "easter",
    title: "Easter Best Dressed",
    subtitle: "Elegant pastels & family-ready outfits for the whole crew",
    cta: "Easter Looks",
    icon: Flower2,
    gradient: "linear-gradient(135deg, hsla(300 40% 70% / 0.15), hsla(50 60% 65% / 0.1))",
    border: "hsla(300 40% 70% / 0.3)",
    accentColor: "hsl(300 40% 70%)",
    category: "kids-fashion" as StyleCategory,
    months: [2, 3], // Mar 21 – Apr 10
    dayRange: [21, 10],
  },
  // Mother's Day (May 1–12)
  {
    id: "mothers-day",
    title: "Style Her Day ✨",
    subtitle: "Help Mom look & feel amazing — or style a matching look",
    cta: "Gift a Look",
    icon: Heart,
    gradient: "linear-gradient(135deg, hsla(330 50% 60% / 0.15), hsla(var(--glamora-gold) / 0.1))",
    border: "hsla(330 50% 60% / 0.3)",
    accentColor: "hsl(330 50% 60%)",
    months: [4], // May
    dayRange: [1, 12],
  },
  // Memorial Day (May 20–31)
  {
    id: "memorial-day",
    title: "Memorial Day Weekend",
    subtitle: "Cookout-ready fits & patriotic summer style",
    cta: "Summer Kicks Off",
    icon: Flag,
    gradient: "linear-gradient(135deg, hsla(220 60% 50% / 0.15), hsla(0 60% 50% / 0.1))",
    border: "hsla(220 60% 55% / 0.3)",
    accentColor: "hsl(220 60% 55%)",
    months: [4],
    dayRange: [20, 31],
  },
  // Summer Vibes (Jun 1 – Jul 3)
  {
    id: "summer",
    title: "Summer Vibes ☀️",
    subtitle: "Hot-weather fits, vacation looks & poolside glam",
    cta: "Summer Styles",
    icon: Sun,
    gradient: "linear-gradient(135deg, hsla(35 80% 55% / 0.15), hsla(15 70% 50% / 0.08))",
    border: "hsla(35 80% 55% / 0.3)",
    accentColor: "hsl(35 80% 55%)",
    months: [5],
    dayRange: [1, 30],
  },
  // 4th of July (Jul 1–5)
  {
    id: "july-4th",
    title: "4th of July Drip 🇺🇸",
    subtitle: "Red, white & styled — patriotic fits for the whole family",
    cta: "July 4th Looks",
    icon: Star,
    gradient: "linear-gradient(135deg, hsla(0 65% 50% / 0.12), hsla(220 65% 50% / 0.12))",
    border: "hsla(0 60% 55% / 0.3)",
    accentColor: "hsl(0 65% 55%)",
    months: [6],
    dayRange: [1, 5],
  },
  // Back to School (Jul 15 – Sep 10)
  {
    id: "back-to-school",
    title: "Back to School 🎒",
    subtitle: "Fresh fits for kids & teens — start the year in style",
    cta: "Shop School Looks",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, hsla(210 60% 50% / 0.15), hsla(45 70% 55% / 0.1))",
    border: "hsla(210 60% 55% / 0.3)",
    accentColor: "hsl(210 60% 55%)",
    category: "kids-fashion" as StyleCategory,
    months: [7, 8], // Aug – Sep
  },
  // Halloween (Oct 1–31)
  {
    id: "halloween",
    title: "Halloween Looks 🎃",
    subtitle: "Costume inspo & spooky-chic styling for all ages",
    cta: "Get Spooky",
    icon: Ghost,
    gradient: "linear-gradient(135deg, hsla(30 80% 50% / 0.15), hsla(270 40% 30% / 0.12))",
    border: "hsla(30 80% 50% / 0.3)",
    accentColor: "hsl(30 80% 50%)",
    category: "cosplay" as StyleCategory,
    months: [9], // October
  },
  // Thanksgiving (Nov 1–28)
  {
    id: "thanksgiving",
    title: "Thanksgiving Ready 🍂",
    subtitle: "Cozy, classy & comfortable — dinner-ready outfits",
    cta: "Fall Fits",
    icon: Leaf,
    gradient: "linear-gradient(135deg, hsla(25 60% 45% / 0.15), hsla(40 50% 40% / 0.1))",
    border: "hsla(25 60% 50% / 0.3)",
    accentColor: "hsl(25 60% 50%)",
    months: [10], // November
    dayRange: [1, 28],
  },
  // Black Friday / Cyber Monday (Nov 25 – Dec 2)
  {
    id: "black-friday",
    title: "Black Friday Style Deals",
    subtitle: "Upgrade your wardrobe — explore luxury, mid & budget tiers",
    cta: "Explore Looks",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, hsla(0 0% 10% / 0.3), hsla(var(--glamora-gold) / 0.15))",
    border: "hsla(var(--glamora-gold) / 0.4)",
    accentColor: "hsl(var(--glamora-gold))",
    months: [10, 11], // Nov 25 – Dec 2
    dayRange: [25, 2],
  },
  // Holiday Season (Dec 1–25)
  {
    id: "holiday",
    title: "Holiday Glam ✨",
    subtitle: "Party season is here — sparkle, velvet & festive looks",
    cta: "Holiday Looks",
    icon: Gift,
    gradient: "linear-gradient(135deg, hsla(0 60% 45% / 0.15), hsla(140 50% 35% / 0.1))",
    border: "hsla(0 60% 50% / 0.3)",
    accentColor: "hsl(0 60% 50%)",
    months: [11], // December
    dayRange: [1, 25],
  },
  // Winter Wonderland (Dec 26 – Feb 28, fallback for Jan/Feb)
  {
    id: "winter",
    title: "Winter Layers ❄️",
    subtitle: "Cozy coats, boots & cold-weather style inspiration",
    cta: "Winter Looks",
    icon: Snowflake,
    gradient: "linear-gradient(135deg, hsla(210 50% 60% / 0.12), hsla(200 40% 70% / 0.08))",
    border: "hsla(210 50% 60% / 0.25)",
    accentColor: "hsl(210 50% 60%)",
    months: [0, 1, 11], // Jan, Feb, Dec
  },
  // Spring (Apr 11 – May 31 fallback)
  {
    id: "spring",
    title: "Spring Refresh 🌸",
    subtitle: "Light layers, bright colors & fresh seasonal looks",
    cta: "Spring Styles",
    icon: Flower2,
    gradient: "linear-gradient(135deg, hsla(140 50% 50% / 0.12), hsla(50 60% 55% / 0.08))",
    border: "hsla(140 50% 50% / 0.25)",
    accentColor: "hsl(140 50% 50%)",
    months: [3, 4], // April, May
  },
  // Fall (Sep 15 – Oct 31 fallback)
  {
    id: "fall",
    title: "Fall Fashion 🍁",
    subtitle: "Earth tones, layered looks & autumn aesthetic",
    cta: "Fall Looks",
    icon: Leaf,
    gradient: "linear-gradient(135deg, hsla(20 55% 45% / 0.15), hsla(35 50% 40% / 0.08))",
    border: "hsla(20 55% 50% / 0.25)",
    accentColor: "hsl(20 55% 50%)",
    months: [8, 9], // Sep, Oct
  },
  // Late Summer (Jul 6 – Aug 31 fallback)
  {
    id: "late-summer",
    title: "Summer Glow ☀️",
    subtitle: "Keep the heat going — vacay looks & festival fits",
    cta: "Summer Styles",
    icon: Sun,
    gradient: "linear-gradient(135deg, hsla(40 75% 55% / 0.15), hsla(20 65% 50% / 0.08))",
    border: "hsla(40 75% 55% / 0.3)",
    accentColor: "hsl(40 75% 55%)",
    months: [6, 7], // Jul, Aug
  },
];

function getCurrentPromo(): SeasonalPromo {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  // Try specific promos first (ones with dayRange), then fallback to seasonal
  const specific = PROMOS.filter(p => p.dayRange).find(p => {
    if (p.months.length === 1) {
      return p.months[0] === month && day >= p.dayRange![0] && day <= p.dayRange![1];
    }
    // Cross-month ranges (e.g., Mar 21 – Apr 10)
    const [startMonth, endMonth] = [p.months[0], p.months[p.months.length - 1]];
    if (month === startMonth && day >= p.dayRange![0]) return true;
    if (month === endMonth && day <= p.dayRange![1]) return true;
    // Months in between
    if (p.months.length > 2 && month > startMonth && month < endMonth) return true;
    return false;
  });

  if (specific) return specific;

  // Fallback to broad seasonal
  const seasonal = PROMOS.filter(p => !p.dayRange).find(p => p.months.includes(month));
  return seasonal || PROMOS[PROMOS.length - 1];
}

interface Props {
  onGetStyled: (category?: StyleCategory) => void;
}

const SeasonalBanner = ({ onGetStyled }: Props) => {
  const promo = getCurrentPromo();
  const Icon = promo.icon;

  return (
    <div
      className="glamora-card anim-fadeUp d2"
      onClick={() => onGetStyled(promo.category)}
      style={{
        margin: "14px 20px 0",
        padding: "14px 16px",
        cursor: "pointer",
        background: promo.gradient,
        border: `1.5px solid ${promo.border}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 4px 20px hsla(0 0% 0% / 0.35), inset 0 1px 0 hsla(0 0% 100% / 0.06)`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Shimmer */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(105deg, transparent 40%, ${promo.accentColor.replace(")", " / 0.1)")} 45%, ${promo.accentColor.replace(")", " / 0.18)")} 50%, ${promo.accentColor.replace(")", " / 0.1)")} 55%, transparent 60%)`,
        backgroundSize: "200% 100%",
        animation: "gold-shimmer 3s ease-in-out infinite",
      }} />

      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: `${promo.accentColor.replace(")", " / 0.2)")}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 3px 10px ${promo.accentColor.replace(")", " / 0.2)")}`,
        position: "relative", zIndex: 2,
      }}>
        <Icon size={20} color={promo.accentColor} />
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "hsla(0 0% 100% / 0.92)" }}>
          {promo.title}
        </div>
        <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.5)", marginTop: 2 }}>
          {promo.subtitle}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        position: "relative", zIndex: 2,
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: promo.accentColor }}>{promo.cta}</span>
        <ArrowRight size={14} color={promo.accentColor} />
      </div>
    </div>
  );
};

export default SeasonalBanner;
