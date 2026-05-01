import { ArrowRight, Crown, GraduationCap, Heart, Snowflake, Sun, Leaf, TreePine, PartyPopper, Star, Sparkles, Gift, Flower2, Baby, Ghost, Flag } from "lucide-react";
import type { StyleCategory } from "./GlamoraApp";

export interface HolidayPick {
  label: string;
  emoji: string;
  category: StyleCategory;
  subcategory: string;
  desc: string;
}

export interface SeasonalPromo {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  icon: React.ElementType;
  gradient: string;
  border: string;
  accentColor: string;
  category?: StyleCategory;
  months: number[];
  dayRange?: [number, number];
  picks: HolidayPick[];
}

export const PROMOS: SeasonalPromo[] = [
  // New Year (Jan 1–15)
  {
    id: "new-year", title: "New Year, New Style",
    subtitle: "Start fresh — explore bold new looks for 2025", cta: "Get Styled",
    icon: PartyPopper,
    gradient: "linear-gradient(135deg, hsla(45 80% 55% / 0.15), hsla(280 50% 50% / 0.1))",
    border: "hsla(45 80% 55% / 0.3)", accentColor: "hsl(45 80% 55%)",
    months: [0], dayRange: [1, 15],
    picks: [
      { label: "Glam Party Look", emoji: "🥂", category: "full-style", subcategory: "night-out", desc: "Sparkling New Year's Eve outfit" },
      { label: "Resolution Fitness", emoji: "💪", category: "fitness", subcategory: "gym-lifting", desc: "New year gym motivation" },
      { label: "Fresh Start Casual", emoji: "✨", category: "minimalist", subcategory: "capsule-wardrobe", desc: "Clean slate wardrobe reset" },
      { label: "Power Outfit", emoji: "💼", category: "full-style", subcategory: "power-outfit", desc: "Command the room in 2025" },
      { label: "Quiet Luxury", emoji: "🤫", category: "minimalist", subcategory: "quiet-luxury", desc: "Understated elegance for the new year" },
    ],
  },
  // Valentine's Day (Feb 1–14)
  {
    id: "valentines", title: "Valentine's Date Night",
    subtitle: "Look stunning for your special evening out", cta: "Date Night Looks",
    icon: Heart,
    gradient: "linear-gradient(135deg, hsla(340 70% 50% / 0.15), hsla(350 80% 60% / 0.08))",
    border: "hsla(340 70% 55% / 0.3)", accentColor: "hsl(340 70% 55%)",
    months: [1], dayRange: [1, 14],
    picks: [
      { label: "Romantic Date Night", emoji: "💕", category: "date-night", subcategory: "romantic-dinner", desc: "Soft, elegant dinner look" },
      { label: "Bold & Sexy", emoji: "🔥", category: "sexy", subcategory: "red-hot", desc: "Confidence-boosting red outfit" },
      { label: "Couples Match", emoji: "👫", category: "couples", subcategory: "matching-elegance", desc: "Coordinated couple styling" },
      { label: "Self-Love Glam", emoji: "💖", category: "full-style", subcategory: "night-out", desc: "Treat yourself — solo glam night" },
      { label: "Galentine's Brunch", emoji: "🥂", category: "full-style", subcategory: "brunch-ready", desc: "Girls' day out outfit" },
    ],
  },
  // Spring Break (Mar 1–20)
  {
    id: "spring-break", title: "Spring Break Ready",
    subtitle: "Beach, brunch & beyond — fresh warm-weather fits", cta: "Spring Styles",
    icon: Sun,
    gradient: "linear-gradient(135deg, hsla(180 60% 50% / 0.12), hsla(40 70% 55% / 0.1))",
    border: "hsla(180 60% 50% / 0.3)", accentColor: "hsl(180 60% 50%)",
    months: [2], dayRange: [1, 20],
    picks: [
      { label: "Beach Vacation", emoji: "🏖️", category: "resort", subcategory: "beach-resort", desc: "Sun-ready resort outfit" },
      { label: "Festival Fit", emoji: "🎶", category: "bohemian", subcategory: "festival-boho", desc: "Music festival layers" },
      { label: "Pool Party", emoji: "🩱", category: "swimwear", subcategory: "pool-party", desc: "Swimwear + coverup combo" },
      { label: "Tropical Casual", emoji: "🌴", category: "casual", subcategory: "vacation-casual", desc: "Relaxed island vibes" },
      { label: "Road Trip Ready", emoji: "🚗", category: "casual", subcategory: "weekend-casual", desc: "Comfortable & cute travel outfit" },
    ],
  },
  // Easter (Mar 21 – Apr 10)
  {
    id: "easter", title: "Easter Best Dressed",
    subtitle: "Elegant pastels & family-ready outfits for the whole crew", cta: "Easter Looks",
    icon: Flower2,
    gradient: "linear-gradient(135deg, hsla(300 40% 70% / 0.15), hsla(50 60% 65% / 0.1))",
    border: "hsla(300 40% 70% / 0.3)", accentColor: "hsl(300 40% 70%)",
    months: [2, 3], dayRange: [21, 10],
    picks: [
      { label: "Pastel Sunday Best", emoji: "🐣", category: "formal", subcategory: "garden-party", desc: "Elegant pastel church outfit" },
      { label: "Kids Easter Outfit", emoji: "🐰", category: "kids" as StyleCategory, subcategory: "holiday-best", desc: "Adorable kids' spring look" },
      { label: "Family Matching", emoji: "👨‍👩‍👧", category: "parent-child", subcategory: "matching-pastels", desc: "Coordinated family outfits" },
      { label: "Spring Florals", emoji: "🌷", category: "bohemian", subcategory: "floral-garden", desc: "Romantic floral prints" },
      { label: "Brunch Chic", emoji: "🥞", category: "full-style", subcategory: "brunch-ready", desc: "Easter brunch styling" },
    ],
  },
  // Graduation Season (May 15 – Jun 5)
  {
    id: "graduation", title: "Graduation Glam 🎓",
    subtitle: "Cap, gown & beyond — celebrate with show-stopping style", cta: "Grad Looks",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, hsla(45 80% 50% / 0.18), hsla(210 50% 45% / 0.12))",
    border: "hsla(45 80% 55% / 0.35)", accentColor: "hsl(45 80% 55%)",
    months: [4, 5], dayRange: [15, 5],
    picks: [
      { label: "Under the Gown", emoji: "👗", category: "formal", subcategory: "cocktail", desc: "Chic outfit under the cap & gown" },
      { label: "Grad Party Fit", emoji: "🎉", category: "teens" as StyleCategory, subcategory: "street-style", desc: "Trendy after-ceremony party look" },
      { label: "Family Photo Ready", emoji: "📸", category: "full-style", subcategory: "smart-casual", desc: "Polished family photo outfit" },
      { label: "Grad Night Glam", emoji: "✨", category: "formal", subcategory: "gala-evening", desc: "Evening celebration showstopper" },
      { label: "Sharp Grad Suit", emoji: "🤵", category: "formal", subcategory: "business-modern", desc: "Tailored suit for the big day" },
    ],
  },
  // Wedding Season (May 1 – Jun 30)
  {
    id: "wedding-season", title: "Wedding Season 💍",
    subtitle: "Bridal, guest, bridesmaid & groom looks for the big day", cta: "Wedding Looks",
    icon: Heart,
    gradient: "linear-gradient(135deg, hsla(340 40% 65% / 0.15), hsla(45 60% 55% / 0.1))",
    border: "hsla(340 40% 65% / 0.3)", accentColor: "hsl(340 40% 65%)",
    months: [4, 5], dayRange: [1, 30],
    picks: [
      { label: "Wedding Guest", emoji: "👗", category: "formal", subcategory: "cocktail", desc: "Elegant guest outfit" },
      { label: "Bridesmaid Chic", emoji: "💐", category: "formal", subcategory: "garden-party", desc: "Coordinated bridesmaid look" },
      { label: "Groom's Style", emoji: "🤵", category: "formal", subcategory: "black-tie", desc: "Sharp wedding day suit" },
      { label: "Rehearsal Dinner", emoji: "🥂", category: "full-style", subcategory: "smart-casual", desc: "Polished rehearsal look" },
      { label: "Bridal Shower", emoji: "🎀", category: "full-style", subcategory: "brunch-ready", desc: "Feminine shower outfit" },
    ],
  },
  // Mother's Day (May 1–12)
  {
    id: "mothers-day", title: "Style Her Day ✨",
    subtitle: "Help Mom look & feel amazing — or style a matching look", cta: "Gift a Look",
    icon: Heart,
    gradient: "linear-gradient(135deg, hsla(330 50% 60% / 0.15), hsla(var(--glamora-gold) / 0.1))",
    border: "hsla(330 50% 60% / 0.3)", accentColor: "hsl(330 50% 60%)",
    months: [4], dayRange: [1, 12],
    picks: [
      { label: "Elegant Mom Look", emoji: "👗", category: "full-style", subcategory: "smart-casual", desc: "Chic, put-together outfit for Mom" },
      { label: "Mommy & Me", emoji: "💕", category: "parent-child", subcategory: "matching-elegance", desc: "Matching mother-child outfits" },
      { label: "Brunch Date", emoji: "🥂", category: "full-style", subcategory: "brunch-ready", desc: "Mother's Day brunch outfit" },
      { label: "Spa Day Glow", emoji: "🧖", category: "minimalist", subcategory: "capsule-wardrobe", desc: "Relaxed luxury self-care look" },
    ],
  },
  // Memorial Day (May 20–31)
  {
    id: "memorial-day", title: "Memorial Day Weekend",
    subtitle: "Cookout-ready fits & patriotic summer style", cta: "Summer Kicks Off",
    icon: Flag,
    gradient: "linear-gradient(135deg, hsla(220 60% 50% / 0.15), hsla(0 60% 50% / 0.1))",
    border: "hsla(220 60% 55% / 0.3)", accentColor: "hsl(220 60% 55%)",
    months: [4], dayRange: [20, 31],
    picks: [
      { label: "BBQ Casual", emoji: "🍔", category: "casual", subcategory: "weekend-casual", desc: "Laid-back cookout fit" },
      { label: "Patriotic Prep", emoji: "🇺🇸", category: "preppy", subcategory: "classic-prep", desc: "Red, white & blue classic" },
      { label: "Pool Party", emoji: "🏊", category: "swimwear", subcategory: "pool-party", desc: "Summer kickoff swim look" },
      { label: "Summer White", emoji: "🤍", category: "minimalist", subcategory: "monochrome", desc: "All-white seasonal statement" },
    ],
  },
  // Father's Day (Jun 1–15)
  {
    id: "fathers-day", title: "Style Dad's Day 👔",
    subtitle: "Sharp grooming & outfit upgrades for the man of the hour", cta: "Men's Looks",
    icon: Star,
    gradient: "linear-gradient(135deg, hsla(210 45% 45% / 0.15), hsla(var(--glamora-gold) / 0.1))",
    border: "hsla(210 45% 50% / 0.3)", accentColor: "hsl(210 45% 50%)",
    category: "grooming" as StyleCategory,
    months: [5], dayRange: [1, 15],
    picks: [
      { label: "Dad's New Look", emoji: "👔", category: "full-style", subcategory: "smart-casual", desc: "Sharp casual upgrade for Dad" },
      { label: "Grooming Glow-Up", emoji: "✂️", category: "grooming", subcategory: "classic-gentleman", desc: "Fresh haircut & beard styling" },
      { label: "Weekend Dad", emoji: "🏌️", category: "casual", subcategory: "weekend-casual", desc: "Relaxed but polished weekend fit" },
      { label: "Father & Kid Match", emoji: "👨‍👧", category: "parent-child", subcategory: "matching-casual", desc: "Matching dad-kid outfits" },
    ],
  },
  // Summer Vibes (Jun 16–30)
  {
    id: "summer", title: "Summer Vibes ☀️",
    subtitle: "Hot-weather fits, vacation looks & poolside glam", cta: "Summer Styles",
    icon: Sun,
    gradient: "linear-gradient(135deg, hsla(35 80% 55% / 0.15), hsla(15 70% 50% / 0.08))",
    border: "hsla(35 80% 55% / 0.3)", accentColor: "hsl(35 80% 55%)",
    months: [5], dayRange: [16, 30],
    picks: [
      { label: "Beach Resort", emoji: "🏝️", category: "resort", subcategory: "beach-resort", desc: "Vacation-ready beachwear" },
      { label: "Pool Party Glam", emoji: "🩱", category: "swimwear", subcategory: "pool-party", desc: "Cute swimwear combo" },
      { label: "Summer Streetwear", emoji: "🔥", category: "streetwear", subcategory: "hypebeast", desc: "Heat-proof street style" },
      { label: "Festival Ready", emoji: "🎪", category: "bohemian", subcategory: "festival-boho", desc: "Music festival outfit" },
      { label: "Linen & Light", emoji: "🌊", category: "minimalist", subcategory: "scandinavian", desc: "Breathable summer minimalism" },
    ],
  },
  // 4th of July (Jul 1–5)
  {
    id: "july-4th", title: "4th of July Drip 🇺🇸",
    subtitle: "Red, white & styled — patriotic fits for the whole family", cta: "July 4th Looks",
    icon: Star,
    gradient: "linear-gradient(135deg, hsla(0 65% 50% / 0.12), hsla(220 65% 50% / 0.12))",
    border: "hsla(0 60% 55% / 0.3)", accentColor: "hsl(0 65% 55%)",
    months: [6], dayRange: [1, 5],
    picks: [
      { label: "Patriotic Fit", emoji: "🇺🇸", category: "casual", subcategory: "weekend-casual", desc: "Red, white & blue casual" },
      { label: "Kids July 4th", emoji: "🎆", category: "kids" as StyleCategory, subcategory: "holiday-best", desc: "Kids' patriotic outfit" },
      { label: "BBQ Host Look", emoji: "🌭", category: "full-style", subcategory: "smart-casual", desc: "Stylish backyard host" },
      { label: "Fireworks Glam", emoji: "🎇", category: "full-style", subcategory: "night-out", desc: "Evening fireworks outfit" },
    ],
  },
  // Back to School (Aug–Sep)
  {
    id: "back-to-school", title: "Back to School 🎒",
    subtitle: "Fresh fits for kids & teens — start the year in style", cta: "Shop School Looks",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, hsla(210 60% 50% / 0.15), hsla(45 70% 55% / 0.1))",
    border: "hsla(210 60% 55% / 0.3)", accentColor: "hsl(210 60% 55%)",
    category: "kids-fashion" as StyleCategory,
    months: [7, 8],
    picks: [
      { label: "Kids School Outfit", emoji: "🎒", category: "kids" as StyleCategory, subcategory: "school-ready", desc: "Comfortable first-day fit" },
      { label: "Teen Street Style", emoji: "😎", category: "teens" as StyleCategory, subcategory: "street-style", desc: "Cool hallway entrance" },
      { label: "Preppy Student", emoji: "📚", category: "preppy", subcategory: "classic-prep", desc: "Clean-cut academic look" },
      { label: "Sporty Kid", emoji: "⚽", category: "kids" as StyleCategory, subcategory: "sporty-active", desc: "Athletic school outfit" },
      { label: "Teen Clean Girl", emoji: "✨", category: "teens" as StyleCategory, subcategory: "clean-girl", desc: "Minimal, polished teen aesthetic" },
    ],
  },
  // Halloween (Oct 1–31)
  {
    id: "halloween", title: "Halloween Looks 🎃",
    subtitle: "Costume inspo & spooky-chic styling for all ages", cta: "Get Spooky",
    icon: Ghost,
    gradient: "linear-gradient(135deg, hsla(30 80% 50% / 0.15), hsla(270 40% 30% / 0.12))",
    border: "hsla(30 80% 50% / 0.3)", accentColor: "hsl(30 80% 50%)",
    category: "cosplay" as StyleCategory,
    months: [9],
    picks: [
      { label: "Spooky Glam", emoji: "🧛", category: "cosplay", subcategory: "witch-sorceress", desc: "Glamorous dark costume" },
      { label: "Kids Costume", emoji: "🎃", category: "kids" as StyleCategory, subcategory: "holiday-best", desc: "Fun kids' Halloween outfit" },
      { label: "Dark Feminine", emoji: "🖤", category: "icon-looks", subcategory: "dark-feminine", desc: "Dark & mysterious styling" },
      { label: "Superhero", emoji: "🦸", category: "cosplay", subcategory: "superhero-classic", desc: "Classic hero costume" },
      { label: "Couples Costume", emoji: "👻", category: "couples", subcategory: "matching-theme", desc: "Matching Halloween duo" },
    ],
  },
  // Thanksgiving (Nov 1–28)
  {
    id: "thanksgiving", title: "Thanksgiving Ready 🍂",
    subtitle: "Cozy, classy & comfortable — dinner-ready outfits", cta: "Fall Fits",
    icon: Leaf,
    gradient: "linear-gradient(135deg, hsla(25 60% 45% / 0.15), hsla(40 50% 40% / 0.1))",
    border: "hsla(25 60% 50% / 0.3)", accentColor: "hsl(25 60% 50%)",
    months: [10], dayRange: [1, 28],
    picks: [
      { label: "Dinner Outfit", emoji: "🦃", category: "full-style", subcategory: "smart-casual", desc: "Polished family dinner look" },
      { label: "Cozy Layers", emoji: "🧣", category: "casual", subcategory: "weekend-casual", desc: "Warm layered autumn fit" },
      { label: "Kids Fall Fit", emoji: "🍁", category: "kids" as StyleCategory, subcategory: "holiday-best", desc: "Cute kids' Thanksgiving outfit" },
      { label: "Hostess Chic", emoji: "🏡", category: "full-style", subcategory: "brunch-ready", desc: "Effortlessly hosting in style" },
    ],
  },
  // Black Friday (Nov 25 – Dec 2)
  {
    id: "black-friday", title: "Black Friday Style Deals",
    subtitle: "Upgrade your wardrobe — explore luxury, mid & budget tiers", cta: "Explore Looks",
    icon: Sparkles,
    gradient: "linear-gradient(135deg, hsla(0 0% 10% / 0.3), hsla(var(--glamora-gold) / 0.15))",
    border: "hsla(var(--glamora-gold) / 0.4)", accentColor: "hsl(var(--glamora-gold))",
    months: [10, 11], dayRange: [25, 2],
    picks: [
      { label: "Luxury Upgrade", emoji: "👑", category: "minimalist", subcategory: "quiet-luxury", desc: "Investment pieces" },
      { label: "Streetwear Haul", emoji: "🔥", category: "streetwear", subcategory: "hypebeast", desc: "Designer drops on sale" },
      { label: "Sneaker Shopping", emoji: "👟", category: "shoes-sneakers", subcategory: "retro-sneakers", desc: "Best sneaker deals" },
      { label: "Winter Wardrobe", emoji: "🧥", category: "full-style", subcategory: "power-outfit", desc: "Cold-weather essentials" },
    ],
  },
  // Holiday Season (Dec 1–25)
  {
    id: "holiday", title: "Holiday Glam ✨",
    subtitle: "Party season is here — sparkle, velvet & festive looks", cta: "Holiday Looks",
    icon: Gift,
    gradient: "linear-gradient(135deg, hsla(0 60% 45% / 0.15), hsla(140 50% 35% / 0.1))",
    border: "hsla(0 60% 50% / 0.3)", accentColor: "hsl(0 60% 50%)",
    months: [11], dayRange: [1, 25],
    picks: [
      { label: "Holiday Party", emoji: "🎄", category: "full-style", subcategory: "night-out", desc: "Festive holiday party outfit" },
      { label: "Kids Holiday Best", emoji: "🎁", category: "kids" as StyleCategory, subcategory: "holiday-best", desc: "Adorable kids' holiday outfit" },
      { label: "NYE Preview", emoji: "🥂", category: "formal", subcategory: "black-tie", desc: "Start planning your NYE look" },
      { label: "Cozy Christmas", emoji: "❄️", category: "casual", subcategory: "weekend-casual", desc: "Festive cozy layered look" },
      { label: "Couples Holiday", emoji: "💑", category: "couples", subcategory: "matching-elegance", desc: "Coordinated couple holiday look" },
    ],
  },
  // Winter (Jan, Feb, Dec fallback)
  {
    id: "winter", title: "Winter Layers ❄️",
    subtitle: "Cozy coats, boots & cold-weather style inspiration", cta: "Winter Looks",
    icon: Snowflake,
    gradient: "linear-gradient(135deg, hsla(210 50% 60% / 0.12), hsla(200 40% 70% / 0.08))",
    border: "hsla(210 50% 60% / 0.25)", accentColor: "hsl(210 50% 60%)",
    months: [0, 1, 11],
    picks: [
      { label: "Cozy Layers", emoji: "🧥", category: "full-style", subcategory: "smart-casual", desc: "Warm layered winter outfit" },
      { label: "Snow Day Kids", emoji: "⛄", category: "kids" as StyleCategory, subcategory: "sporty-active", desc: "Kids' winter play outfit" },
      { label: "Date Night Warmth", emoji: "🕯️", category: "date-night", subcategory: "romantic-dinner", desc: "Cozy evening date look" },
      { label: "Monochrome Winter", emoji: "🖤", category: "minimalist", subcategory: "monochrome", desc: "All-black winter statement" },
    ],
  },
  // Spring (Apr–May fallback)
  {
    id: "spring", title: "Spring Refresh 🌸",
    subtitle: "Light layers, bright colors & fresh seasonal looks", cta: "Spring Styles",
    icon: Flower2,
    gradient: "linear-gradient(135deg, hsla(140 50% 50% / 0.12), hsla(50 60% 55% / 0.08))",
    border: "hsla(140 50% 50% / 0.25)", accentColor: "hsl(140 50% 50%)",
    months: [3, 4],
    picks: [
      { label: "Floral Feminine", emoji: "🌸", category: "bohemian", subcategory: "floral-garden", desc: "Romantic spring florals" },
      { label: "Linen Casual", emoji: "🌿", category: "minimalist", subcategory: "scandinavian", desc: "Light, breathable layers" },
      { label: "Outdoor Date", emoji: "🌤️", category: "date-night", subcategory: "rooftop-date", desc: "Outdoor spring date outfit" },
      { label: "Kids Spring", emoji: "🐝", category: "kids" as StyleCategory, subcategory: "school-ready", desc: "Fresh kids' spring outfit" },
    ],
  },
  // Fall (Sep–Oct fallback)
  {
    id: "fall", title: "Fall Fashion 🍁",
    subtitle: "Earth tones, layered looks & autumn aesthetic", cta: "Fall Looks",
    icon: Leaf,
    gradient: "linear-gradient(135deg, hsla(20 55% 45% / 0.15), hsla(35 50% 40% / 0.08))",
    border: "hsla(20 55% 50% / 0.25)", accentColor: "hsl(20 55% 50%)",
    months: [8, 9],
    picks: [
      { label: "Autumn Layers", emoji: "🍂", category: "full-style", subcategory: "smart-casual", desc: "Warm earth-tone layers" },
      { label: "Cottagecore Fall", emoji: "🧶", category: "cottagecore", subcategory: "autumn-cottage", desc: "Cozy countryside aesthetic" },
      { label: "Back to School", emoji: "📓", category: "teens" as StyleCategory, subcategory: "dark-academia", desc: "Academic autumn style" },
      { label: "Football Sunday", emoji: "🏈", category: "casual", subcategory: "weekend-casual", desc: "Game day casual outfit" },
    ],
  },
  // Late Summer (Jul–Aug fallback)
  {
    id: "late-summer", title: "Summer Glow ☀️",
    subtitle: "Keep the heat going — vacay looks & festival fits", cta: "Summer Styles",
    icon: Sun,
    gradient: "linear-gradient(135deg, hsla(40 75% 55% / 0.15), hsla(20 65% 50% / 0.08))",
    border: "hsla(40 75% 55% / 0.3)", accentColor: "hsl(40 75% 55%)",
    months: [6, 7],
    picks: [
      { label: "Vacation Mode", emoji: "✈️", category: "resort", subcategory: "beach-resort", desc: "Travel-ready resort look" },
      { label: "Summer Streetwear", emoji: "🔥", category: "streetwear", subcategory: "hypebeast", desc: "Hot-weather drip" },
      { label: "Pool Party", emoji: "🏊", category: "swimwear", subcategory: "pool-party", desc: "Swim + coverup look" },
      { label: "Kids Summer Fun", emoji: "🌞", category: "kids" as StyleCategory, subcategory: "sporty-active", desc: "Active summer kids' outfit" },
      { label: "Festival Boho", emoji: "🎵", category: "bohemian", subcategory: "festival-boho", desc: "Summer music fest outfit" },
    ],
  },
];

export function getCurrentPromo(): SeasonalPromo {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();

  const specific = PROMOS.filter(p => p.dayRange).find(p => {
    if (p.months.length === 1) {
      return p.months[0] === month && day >= p.dayRange![0] && day <= p.dayRange![1];
    }
    const [startMonth, endMonth] = [p.months[0], p.months[p.months.length - 1]];
    if (month === startMonth && day >= p.dayRange![0]) return true;
    if (month === endMonth && day <= p.dayRange![1]) return true;
    if (p.months.length > 2 && month > startMonth && month < endMonth) return true;
    return false;
  });

  if (specific) return specific;
  const seasonal = PROMOS.filter(p => !p.dayRange).find(p => p.months.includes(month));
  return seasonal || PROMOS[PROMOS.length - 1];
}

interface Props {
  onHolidayPick: (holidayId: string) => void;
}

const SeasonalBanner = ({ onHolidayPick }: Props) => {
  const promo = getCurrentPromo();
  const Icon = promo.icon;

  return (
    <div
      className="glamora-card anim-fadeUp d1"
      onClick={() => onHolidayPick(promo.id)}
      style={{
        margin: "14px 20px 0",
        padding: "16px 16px",
        cursor: "pointer",
        background: promo.gradient,
        border: `1.5px solid ${promo.border}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 4px 20px hsla(0 0% 0% / 0.35), 0 0 30px ${promo.accentColor.replace(")", " / 0.08)")}, inset 0 1px 0 hsla(0 0% 100% / 0.06)`,
        backdropFilter: "blur(12px)",
        animation: "subtle-pulse 3s ease-in-out infinite",
      }}
    >
      {/* Shimmer sweep */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `linear-gradient(105deg, transparent 40%, ${promo.accentColor.replace(")", " / 0.1)")} 45%, ${promo.accentColor.replace(")", " / 0.18)")} 50%, ${promo.accentColor.replace(")", " / 0.1)")} 55%, transparent 60%)`,
        backgroundSize: "200% 100%",
        animation: "gold-shimmer 3s ease-in-out infinite",
      }} />

      {/* Animated icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 13, flexShrink: 0,
        background: `${promo.accentColor.replace(")", " / 0.2)")}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 3px 12px ${promo.accentColor.replace(")", " / 0.25)")}`,
        position: "relative", zIndex: 2,
        animation: "icon-glow 2s ease-in-out infinite alternate",
      }}>
        <Icon size={21} color={promo.accentColor} />
      </div>

      <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "hsla(0 0% 100% / 0.95)", letterSpacing: 0.2 }}>
          {promo.title}
        </div>
        <div style={{ fontSize: 10.5, color: "hsla(0 0% 100% / 0.55)", marginTop: 2, lineHeight: 1.3 }}>
          {promo.subtitle}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        position: "relative", zIndex: 2,
        padding: "5px 10px", borderRadius: 100,
        background: `${promo.accentColor.replace(")", " / 0.15)")}`,
        border: `1px solid ${promo.accentColor.replace(")", " / 0.2)")}`,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: promo.accentColor }}>{promo.cta}</span>
        <ArrowRight size={12} color={promo.accentColor} />
      </div>

      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { box-shadow: 0 4px 20px hsla(0 0% 0% / 0.35), 0 0 30px ${promo.accentColor.replace(")", " / 0.08)")}, inset 0 1px 0 hsla(0 0% 100% / 0.06); }
          50% { box-shadow: 0 4px 24px hsla(0 0% 0% / 0.4), 0 0 40px ${promo.accentColor.replace(")", " / 0.14)")}, inset 0 1px 0 hsla(0 0% 100% / 0.08); }
        }
        @keyframes icon-glow {
          0% { box-shadow: 0 3px 12px ${promo.accentColor.replace(")", " / 0.2)")}; }
          100% { box-shadow: 0 4px 18px ${promo.accentColor.replace(")", " / 0.35)")}; }
        }
      `}</style>
    </div>
  );
};

export default SeasonalBanner;
