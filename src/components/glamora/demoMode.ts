// Demo mode: set DEMO_MODE = true to skip AI calls and return mock results.
// Toggle this flag to test the full UI without consuming AI credits.

export const DEMO_MODE = true;

// A curated set of high-quality sample images (royalty-free fashion/beauty stock photos)
const DEMO_IMAGES = {
  female: [
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80&fit=crop",
  ],
  male: [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80&fit=crop",
  ],
};

const DEMO_STYLE_NAMES: Record<string, string[]> = {
  "full-style": ["Modern Luxe Chic", "Effortless Elegance", "City Sophisticate"],
  streetwear: ["Urban Edge", "Street Luxe", "Hype Culture Cool"],
  formal: ["Black Tie Refined", "Power Suit Glam", "Classic Formal"],
  casual: ["Easy Breezy Chic", "Weekend Radiance", "Relaxed Refined"],
  "makeup-only": ["Soft Glam Glow", "Bold Beauty", "Natural Radiance"],
  minimalist: ["Clean Line Aesthetic", "Less Is More", "Nordic Minimal"],
  vintage: ["Retro Revival", "Old Hollywood Glam", "70s Boho Dream"],
  athleisure: ["Sport Luxe", "Active Elegance", "Gym-to-Brunch"],
  bohemian: ["Free Spirit Luxe", "Desert Rose", "Wanderlust Chic"],
  preppy: ["Ivy League Polish", "Country Club Chic", "Classic Prep"],
  edgy: ["Dark Luxe", "Rebel Glam", "Punk Couture"],
  resort: ["Coastal Glamour", "Tropical Luxe", "Riviera Chic"],
  grooming: ["Sharp & Refined", "Modern Gentleman", "Clean Cut Elite"],
  sexy: ["Sultry Sophisticate", "Evening Allure", "Red Carpet Heat"],
  swimwear: ["Beach Goddess", "Coastal Siren", "Poolside Luxe"],
  "urban-hiphop": ["Street King", "Hip Hop Royalty", "Urban Legend"],
  rugged: ["Rugged Refined", "Workwear Heritage", "Mountain Modern"],
  techwear: ["Future Forward", "Cyber Street", "Tech Noir"],
  "date-night": ["Romantic Edge", "Evening Charm", "Candlelit Chic"],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getDemoStyledImage(gender: "male" | "female"): string {
  return pickRandom(DEMO_IMAGES[gender]);
}

export function getDemoStyleName(category: string): string {
  const names = DEMO_STYLE_NAMES[category] || DEMO_STYLE_NAMES["full-style"];
  return pickRandom(names);
}

export function getDemoInspirationResult(gender: "male" | "female") {
  const imageUrl = pickRandom(DEMO_IMAGES[gender]);
  const styleProfile = {
    styleName: pickRandom([
      "Luxury Minimal Glam",
      "Modern Influencer Aesthetic",
      "Bold Street Luxe",
      "Chic Neutral Fit",
      "Effortless Power Look",
      "Sleek Contemporary Edge",
    ]),
    clothingTypes: pickRandom([
      ["Tailored blazer", "Silk camisole", "High-waisted trousers"],
      ["Oversized coat", "Bodycon dress", "Strappy heels"],
      ["Graphic tee", "Cargo pants", "Chunky sneakers"],
      ["Fitted suit", "Turtleneck", "Leather loafers"],
    ]),
    colorPalette: pickRandom([
      ["Camel", "Ivory", "Black"],
      ["Blush", "Rose Gold", "Champagne"],
      ["Navy", "Burgundy", "Charcoal"],
      ["Earth tones", "Olive", "Rust"],
    ]),
    fitPreferences: pickRandom([
      ["Fitted", "Structured"],
      ["Oversized", "Layered"],
      ["Relaxed", "Flowy"],
    ]),
    accessories: pickRandom([
      ["Gold hoops", "Structured handbag", "Aviator sunglasses"],
      ["Chain necklace", "Leather belt", "Minimal watch"],
      ["Statement earrings", "Clutch", "Wrap bracelet"],
    ]),
    makeupStyle: pickRandom([
      "Soft glam with nude lip",
      "Bold winged liner with berry lip",
      "Natural, dewy skin focus",
      "Bronzed & sculpted",
    ]),
    hairTrend: pickRandom([
      "Sleek middle-part blowout",
      "Textured waves",
      "Slicked-back low bun",
      "Voluminous curls",
    ]),
    overallVibe: pickRandom([
      "Confident and polished",
      "Effortlessly cool",
      "Glamorous minimalism",
      "Street-meets-luxury",
    ]),
    detailedPrompt: "",
  };
  return { imageUrl, styleProfile };
}
