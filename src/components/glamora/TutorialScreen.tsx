import { useState } from "react";

interface Props {
  lookName: string;
  onBack: () => void;
  onHome: () => void;
}

type Category = "makeup" | "top" | "bottom" | "shoes" | "accessories";
type PriceTier = "luxury" | "mid" | "budget";

const categoryLabels: Record<Category, { label: string; icon: string }> = {
  makeup: { label: "Makeup", icon: "💄" },
  top: { label: "Top & Layers", icon: "👔" },
  bottom: { label: "Bottoms", icon: "👖" },
  shoes: { label: "Shoes & Socks", icon: "👟" },
  accessories: { label: "Accessories", icon: "⌚" },
};

const categoryOrder: Category[] = ["makeup", "top", "bottom", "shoes", "accessories"];

const tierInfo: Record<PriceTier, { label: string; icon: string; color: string; bg: string }> = {
  luxury: { label: "Luxury", icon: "👑", color: "hsl(var(--glamora-gold))", bg: "hsla(var(--glamora-gold) / 0.1)" },
  mid: { label: "Moderate", icon: "✨", color: "hsl(var(--glamora-rose-dark))", bg: "hsla(var(--glamora-rose) / 0.1)" },
  budget: { label: "Budget", icon: "💰", color: "hsl(var(--glamora-success))", bg: "hsla(var(--glamora-success) / 0.1)" },
};

type ShopOption = { store: string; item: string; price: string; url?: string };
type Step = {
  title: string;
  detail: string;
  tip?: string;
  shop?: Record<PriceTier, ShopOption>;
};

const lookData: Record<string, Record<Category, Step[]>> = {
  "Soft Glam": {
    makeup: [
      {
        title: "Prep & Prime", detail: "Apply a hydrating primer with a dewy finish. Focus on T-zone for a natural glow.",
        tip: "Use a beauty sponge for even application",
        shop: {
          luxury: { store: "Sephora", item: "Charlotte Tilbury Wonderglow Primer", price: "$55" },
          mid: { store: "Ulta", item: "NYX Marshmallow Primer", price: "$16" },
          budget: { store: "Amazon", item: "e.l.f. Jelly Pop Dew Primer", price: "$10" },
        },
      },
      {
        title: "Soft Rose Base", detail: "Blend a light-coverage foundation matched to your skin tone. Conceal under eyes with a shade lighter.",
        shop: {
          luxury: { store: "Nordstrom", item: "Armani Luminous Silk Foundation", price: "$65" },
          mid: { store: "Ulta", item: "L'Oréal True Match Serum Foundation", price: "$17" },
          budget: { store: "Target", item: "Maybelline Fit Me Dewy Foundation", price: "$9" },
        },
      },
      {
        title: "Blush & Highlight", detail: "Sweep a rose-pink blush on the apples of your cheeks. Add a champagne highlighter to cheekbones and nose bridge.",
        tip: "Smile to find the apples of your cheeks",
        shop: {
          luxury: { store: "Sephora", item: "NARS Orgasm Blush + Highlighter Duo", price: "$40" },
          mid: { store: "Ulta", item: "Milani Baked Blush in Luminoso", price: "$10" },
          budget: { store: "Amazon", item: "e.l.f. Baked Highlighter + Blush Duo", price: "$8" },
        },
      },
      {
        title: "Soft Eye Look", detail: "Apply a matte nude on the lid, rose shimmer on the center, and blend a soft brown in the crease.",
        shop: {
          luxury: { store: "Sephora", item: "Charlotte Tilbury Pillow Talk Palette", price: "$53" },
          mid: { store: "Ulta", item: "Anastasia Soft Glam Palette", price: "$29" },
          budget: { store: "Amazon", item: "Maybelline The Nudes Palette", price: "$11" },
        },
      },
      {
        title: "Lips & Set", detail: "Line lips with a nude-rose liner. Apply a satin rose lipstick. Set everything with a dewy setting spray.",
        shop: {
          luxury: { store: "Nordstrom", item: "Tom Ford Lip Color in Pink Dusk", price: "$58" },
          mid: { store: "Ulta", item: "MAC Matte Lipstick in Velvet Teddy", price: "$22" },
          budget: { store: "Target", item: "Revlon Super Lustrous in Pink in the Afternoon", price: "$8" },
        },
      },
    ],
    top: [
      {
        title: "Base Layer", detail: "Choose a fitted silk or satin camisole in blush, champagne, or soft cream.",
        tip: "Silk reflects light and elevates the soft glam vibe",
        shop: {
          luxury: { store: "Net-a-Porter", item: "Vince Silk Camisole in Blush", price: "$225" },
          mid: { store: "Nordstrom", item: "Topshop Satin Cowl Neck Cami", price: "$45" },
          budget: { store: "H&M", item: "Satin V-Neck Camisole Top", price: "$18" },
        },
      },
      {
        title: "Mid Layer", detail: "Layer with a tailored blazer in dusty rose, camel, or soft beige. Opt for relaxed shoulders.",
        shop: {
          luxury: { store: "Farfetch", item: "Stella McCartney Oversized Blazer", price: "$1,495" },
          mid: { store: "Zara", item: "Double-Breasted Blazer in Dusty Pink", price: "$90" },
          budget: { store: "Shein", item: "Lapel Collar Single Button Blazer", price: "$28" },
        },
      },
      {
        title: "Alternative: Blouse", detail: "A flowy wrap blouse in muted florals or solid rose pairs beautifully with this look.",
        shop: {
          luxury: { store: "Reformation", item: "Kelsey Wrap Top in Rose", price: "$148" },
          mid: { store: "Mango", item: "Floral Print Wrap Blouse", price: "$50" },
          budget: { store: "Amazon", item: "VIISHOW Chiffon V-Neck Wrap Blouse", price: "$22" },
        },
      },
    ],
    bottom: [
      {
        title: "Trousers", detail: "High-waisted wide-leg trousers in cream, tan, or soft grey. Clean lines complement the softness.",
        tip: "A crease down the front adds polish",
        shop: {
          luxury: { store: "Net-a-Porter", item: "The Row Gala Wide-Leg Pants", price: "$890" },
          mid: { store: "Aritzia", item: "Effortless Wide-Leg Pant", price: "$110" },
          budget: { store: "H&M", item: "Wide-Leg Dress Pants", price: "$30" },
        },
      },
      {
        title: "Alternative: Skirt", detail: "A midi satin slip skirt in champagne or blush. Keep the silhouette fluid and elegant.",
        shop: {
          luxury: { store: "Nordstrom", item: "Vince Satin Slip Skirt", price: "$265" },
          mid: { store: "& Other Stories", item: "Satin Midi Skirt in Champagne", price: "$79" },
          budget: { store: "Amazon", item: "SheIn Satin High Waist Midi Skirt", price: "$18" },
        },
      },
    ],
    shoes: [
      {
        title: "Heels", detail: "Strappy nude or rose-gold heeled sandals. 2-3 inch block heels for comfort and elegance.",
        shop: {
          luxury: { store: "Nordstrom", item: "Stuart Weitzman Nudist Block Sandal", price: "$425" },
          mid: { store: "DSW", item: "Sam Edelman Yaro Block Heel Sandal", price: "$120" },
          budget: { store: "Target", item: "A New Day Strappy Block Heel Sandal", price: "$30" },
        },
      },
      {
        title: "Socks", detail: "Skip visible socks with heels. If wearing closed-toe pumps, go with sheer nude no-show socks.",
        tip: "Sheer socks keep things polished",
        shop: {
          luxury: { store: "Nordstrom", item: "Wolford Sheer 15 Knee-High Socks", price: "$28" },
          mid: { store: "Nordstrom", item: "Calvin Klein Sheer No-Show Socks 3pk", price: "$16" },
          budget: { store: "Amazon", item: "VERO MONTE No-Show Liner Socks 6pk", price: "$9" },
        },
      },
      {
        title: "Alternative: Flats", detail: "Pointed-toe ballet flats in metallic rose gold or soft suede nude.",
        shop: {
          luxury: { store: "Nordstrom", item: "Jimmy Choo Romy Ballet Flat", price: "$595" },
          mid: { store: "Nordstrom", item: "Sam Edelman Jillie Flat", price: "$100" },
          budget: { store: "Target", item: "A New Day Pointed Toe Ballet Flat", price: "$22" },
        },
      },
    ],
    accessories: [
      {
        title: "Watch", detail: "A slim rose-gold watch with a mesh band. Keep the face minimal and elegant.",
        shop: {
          luxury: { store: "Nordstrom", item: "Daniel Wellington Petite 28mm Rose Gold", price: "$189" },
          mid: { store: "Amazon", item: "Fossil Jacqueline Rose Gold Watch", price: "$90" },
          budget: { store: "Amazon", item: "CIVO Women's Rose Gold Mesh Watch", price: "$24" },
        },
      },
      {
        title: "Jewelry", detail: "Dainty gold layered necklaces. Small hoop or pearl stud earrings. A thin bangle or two.",
        shop: {
          luxury: { store: "Mejuri", item: "Bold Link Chain + Pendant Set", price: "$230" },
          mid: { store: "Nordstrom", item: "Gorjana Layered Necklace Set", price: "$65" },
          budget: { store: "Amazon", item: "PAVOI 14K Layered Chain Necklace Set", price: "$14" },
        },
      },
      {
        title: "Bag", detail: "A structured mini crossbody or clutch in nude leather or soft pink.",
        tip: "Match metals — rose gold watch with rose gold bag hardware",
        shop: {
          luxury: { store: "Nordstrom", item: "Saint Laurent Kate Chain Bag", price: "$2,150" },
          mid: { store: "Coach Outlet", item: "Mini Skinny Crossbody in Blush", price: "$89" },
          budget: { store: "Amazon", item: "CLUCI Small Crossbody Bag Nude", price: "$22" },
        },
      },
      {
        title: "Finishing Touches", detail: "A silk scarf tied loosely around the neck or hair. Soft fragrance with notes of peony and vanilla.",
        shop: {
          luxury: { store: "Sephora", item: "Miss Dior Blooming Bouquet EDT", price: "$110" },
          mid: { store: "Ulta", item: "Ariana Grande Cloud EDP", price: "$45" },
          budget: { store: "Amazon", item: "Body Fantasies Cherry Blossom Body Spray", price: "$5" },
        },
      },
    ],
  },
  "Golden Hour": {
    makeup: [
      {
        title: "Bronzed Base", detail: "Use a luminous foundation. Warm up the complexion with a golden bronzer on cheekbones, temples, and jawline.",
        shop: {
          luxury: { store: "Sephora", item: "Tom Ford Shade & Illuminate Glow", price: "$90" },
          mid: { store: "Ulta", item: "Physician's Formula Butter Bronzer", price: "$16" },
          budget: { store: "Amazon", item: "e.l.f. Putty Bronzer", price: "$7" },
        },
      },
      {
        title: "Golden Eyes", detail: "Apply a warm copper shadow on lids with gold shimmer in the center. Blend a warm brown into the crease.",
        tip: "Wet your brush for maximum gold payoff",
        shop: {
          luxury: { store: "Sephora", item: "Pat McGrath Mothership V Bronze Seduction", price: "$128" },
          mid: { store: "Ulta", item: "Urban Decay Naked Honey Palette", price: "$27" },
          budget: { store: "Amazon", item: "Maybelline The 24K Nudes Palette", price: "$10" },
        },
      },
      {
        title: "Sun-Kissed Cheeks", detail: "A warm peach blush blended upward. Top with a gold liquid highlighter on the high points.",
        shop: {
          luxury: { store: "Sephora", item: "Rare Beauty Warm Wishes Bronzer Stick", price: "$30" },
          mid: { store: "Ulta", item: "Milani Baked Blush in Bellissimo Bronze", price: "$10" },
          budget: { store: "Target", item: "e.l.f. Liquid Highlighter in Golden Glow", price: "$5" },
        },
      },
      {
        title: "Warm Lips", detail: "A terracotta or warm nude lip liner with a glossy caramel lip gloss.",
        shop: {
          luxury: { store: "Nordstrom", item: "Gucci Rouge à Lèvres in Goldie Red", price: "$42" },
          mid: { store: "Ulta", item: "NYX Butter Gloss in Madeleine", price: "$6" },
          budget: { store: "Amazon", item: "Revlon Super Lustrous Lip Gloss in Rosy Future", price: "$5" },
        },
      },
    ],
    top: [
      {
        title: "Statement Piece", detail: "A rust, burnt orange, or golden-mustard satin blouse. Flowy sleeves add movement.",
        tip: "Earth tones mirror the golden hour palette",
        shop: {
          luxury: { store: "Net-a-Porter", item: "Ulla Johnson Ruched Satin Blouse Rust", price: "$395" },
          mid: { store: "Zara", item: "Satin Effect Shirt in Mustard", price: "$50" },
          budget: { store: "Shein", item: "Lantern Sleeve Satin Top in Rust", price: "$15" },
        },
      },
      {
        title: "Layer Option", detail: "A camel or cognac suede jacket. Or a lightweight linen blazer in warm sand.",
        shop: {
          luxury: { store: "Nordstrom", item: "AllSaints Suede Moto Jacket Tan", price: "$549" },
          mid: { store: "Mango", item: "Suede Effect Jacket in Cognac", price: "$120" },
          budget: { store: "Amazon", item: "Levi's Faux Suede Moto Jacket", price: "$45" },
        },
      },
    ],
    bottom: [
      {
        title: "Denim", detail: "High-waisted straight-leg jeans in a warm medium wash. Slightly cropped to show ankle.",
        shop: {
          luxury: { store: "Nordstrom", item: "Citizens of Humanity Daphne Crop Jeans", price: "$228" },
          mid: { store: "Aritzia", item: "Abercrombie 90s Straight Jean", price: "$90" },
          budget: { store: "Target", item: "Universal Thread High-Rise Straight Jeans", price: "$28" },
        },
      },
      {
        title: "Alternative: Linen", detail: "Wide-leg linen pants in terracotta or warm beige for a breezy elevated feel.",
        shop: {
          luxury: { store: "Reformation", item: "Petites Linen Wide Leg in Sand", price: "$148" },
          mid: { store: "Zara", item: "Linen Blend Wide Leg Trousers", price: "$50" },
          budget: { store: "H&M", item: "Linen-Blend Pull-On Pants", price: "$25" },
        },
      },
    ],
    shoes: [
      {
        title: "Boots", detail: "Suede ankle boots in cognac or tan. A western-inspired heel adds character.",
        shop: {
          luxury: { store: "Nordstrom", item: "Isabel Marant Dicker Suede Boot", price: "$690" },
          mid: { store: "DSW", item: "Dolce Vita Silma Western Boot", price: "$130" },
          budget: { store: "Target", item: "Universal Thread Western Ankle Boot", price: "$35" },
        },
      },
      {
        title: "Socks", detail: "Ribbed cotton socks in cream or tan that peek above the boot.",
        tip: "Visible socks with boots is a styling move — lean into it",
        shop: {
          luxury: { store: "Nordstrom", item: "Hansel from Basel Ribbed Crew Socks", price: "$18" },
          mid: { store: "Madewell", item: "Ribbed Ankle Socks 2-Pack", price: "$14" },
          budget: { store: "Amazon", item: "Hanes Women's Ribbed Crew Socks 6pk", price: "$9" },
        },
      },
      {
        title: "Alternative: Sandals", detail: "Leather flat sandals with gold buckle details for a warmer day.",
        shop: {
          luxury: { store: "Nordstrom", item: "Ancient Greek Sandals Desmos Gold", price: "$230" },
          mid: { store: "DSW", item: "Steve Madden Travel Flat Sandal", price: "$60" },
          budget: { store: "Amazon", item: "Amazon Essentials Flat Strap Sandal", price: "$18" },
        },
      },
    ],
    accessories: [
      {
        title: "Watch", detail: "A gold-tone watch with a leather strap in cognac or honey brown.",
        shop: {
          luxury: { store: "Nordstrom", item: "Shinola Canfield 38mm Gold", price: "$550" },
          mid: { store: "Amazon", item: "Fossil Heritage Automatic Gold", price: "$175" },
          budget: { store: "Amazon", item: "Timex Weekender 38mm Leather Strap", price: "$35" },
        },
      },
      {
        title: "Jewelry", detail: "Chunky gold hoops. Stacked gold rings. A bold chain necklace or pendant.",
        shop: {
          luxury: { store: "Mejuri", item: "Croissant Dome Hoops in Gold", price: "$125" },
          mid: { store: "Nordstrom", item: "BaubleBar Dalilah Hoop Earrings", price: "$42" },
          budget: { store: "Amazon", item: "PAVOI 14K Gold Chunky Hoops", price: "$14" },
        },
      },
      {
        title: "Bag", detail: "A woven straw tote or structured saddle bag in tan leather.",
        tip: "Woven textures scream golden hour",
        shop: {
          luxury: { store: "Net-a-Porter", item: "Loewe Basket Bag Small", price: "$690" },
          mid: { store: "Madewell", item: "The Sydney Straw Crossbody", price: "$78" },
          budget: { store: "Amazon", item: "Straw Woven Tote Beach Bag", price: "$20" },
        },
      },
      {
        title: "Extras", detail: "Tortoiseshell sunglasses. A woven belt in warm leather. A light scent with amber and sandalwood.",
        shop: {
          luxury: { store: "Sephora", item: "Le Labo Santal 33 EDP", price: "$310" },
          mid: { store: "Ulta", item: "Sol de Janeiro Cheirosa '62 Body Mist", price: "$35" },
          budget: { store: "Amazon", item: "Raw Spirit Wild Fire EDP Rollerball", price: "$15" },
        },
      },
    ],
  },
  "Berry Chic": {
    makeup: [
      {
        title: "Flawless Base", detail: "A matte full-coverage foundation. Set with translucent powder for a porcelain finish.",
        shop: {
          luxury: { store: "Sephora", item: "Lancôme Teint Idole Ultra Foundation", price: "$52" },
          mid: { store: "Ulta", item: "Fenty Beauty Pro Filt'r Matte Foundation", price: "$40" },
          budget: { store: "Target", item: "Maybelline SuperStay Full Coverage", price: "$12" },
        },
      },
      {
        title: "Minimal Eyes", detail: "A wash of mauve on the lids. Tight-line upper lash with dark brown. Lots of mascara.",
        tip: "Keep eyes minimal to let the lip be the star",
        shop: {
          luxury: { store: "Sephora", item: "Chanel Les 4 Ombres in Douceur", price: "$65" },
          mid: { store: "Ulta", item: "ColourPop Lilac You A Lot Palette", price: "$14" },
          budget: { store: "Amazon", item: "e.l.f. Bite Size Eyeshadow Rose Water", price: "$3" },
        },
      },
      {
        title: "Sculpted Cheeks", detail: "A cool-toned mauve blush. Subtle highlight on the cheekbones only.",
        shop: {
          luxury: { store: "Sephora", item: "Hourglass Ambient Lighting Blush in Mood Exposure", price: "$42" },
          mid: { store: "Ulta", item: "Tarte Amazonian Clay Blush in Exposed", price: "$29" },
          budget: { store: "Amazon", item: "Wet n Wild Color Icon Blush in Mellow Wine", price: "$4" },
        },
      },
      {
        title: "Bold Berry Lip", detail: "Line with a deep berry liner. Fill with a matte berry or plum lipstick. Blot and reapply for intensity.",
        shop: {
          luxury: { store: "Nordstrom", item: "YSL Tatouage Couture in Berry Cult", price: "$40" },
          mid: { store: "Ulta", item: "MAC Retro Matte in Flat Out Fabulous", price: "$22" },
          budget: { store: "Target", item: "NYX Suede Matte in Girl, Bye", price: "$8" },
        },
      },
    ],
    top: [
      {
        title: "Statement Top", detail: "A black fitted turtleneck or a deep plum silk button-up. Clean lines, rich tones.",
        tip: "Black lets the berry lip and accessories pop",
        shop: {
          luxury: { store: "Net-a-Porter", item: "The Row Funnel-Neck Top in Black", price: "$490" },
          mid: { store: "Zara", item: "Fitted Turtleneck Knit in Black", price: "$36" },
          budget: { store: "Uniqlo", item: "Heattech Turtleneck Long-Sleeve", price: "$15" },
        },
      },
      {
        title: "Layer", detail: "A structured black blazer or a deep burgundy leather jacket for edge.",
        shop: {
          luxury: { store: "Nordstrom", item: "Saint Laurent Double Breasted Blazer", price: "$2,890" },
          mid: { store: "Zara", item: "Faux Leather Biker Jacket Burgundy", price: "$80" },
          budget: { store: "Amazon", item: "Fahsyee Faux Leather Moto Jacket", price: "$40" },
        },
      },
    ],
    bottom: [
      {
        title: "Tailored Pants", detail: "Black high-waisted cigarette trousers or tailored straight-leg pants.",
        shop: {
          luxury: { store: "Nordstrom", item: "Theory Demitria Good Wool Trousers", price: "$295" },
          mid: { store: "Aritzia", item: "Babaton Cohen Pant in Black", price: "$120" },
          budget: { store: "H&M", item: "Slim-Fit Tailored Trousers", price: "$28" },
        },
      },
      {
        title: "Alternative: Skirt", detail: "A black leather midi skirt or a plum-toned pencil skirt for a bold silhouette.",
        shop: {
          luxury: { store: "Net-a-Porter", item: "Totême Leather Midi Skirt", price: "$1,100" },
          mid: { store: "Zara", item: "Faux Leather Midi Skirt in Black", price: "$50" },
          budget: { store: "Amazon", item: "EXCHIC Faux Leather Pencil Skirt", price: "$18" },
        },
      },
    ],
    shoes: [
      {
        title: "Heels", detail: "Black pointed-toe stilettos or kitten heels. Patent leather adds drama.",
        shop: {
          luxury: { store: "Nordstrom", item: "Christian Louboutin So Kate Patent Pump", price: "$795" },
          mid: { store: "DSW", item: "Nine West Tatiana Pump Patent", price: "$89" },
          budget: { store: "Amazon", item: "DREAM PAIRS Pointed Toe Stiletto Pump", price: "$30" },
        },
      },
      {
        title: "Socks", detail: "Sheer black socks with subtle pattern or lace trim for a fashion-forward touch.",
        shop: {
          luxury: { store: "Nordstrom", item: "Wolford Lace Knee-High Socks", price: "$38" },
          mid: { store: "Nordstrom", item: "FALKE Sheer Dot Ankle Socks", price: "$16" },
          budget: { store: "Amazon", item: "VIVILADY Sheer Lace Ankle Socks 5pk", price: "$10" },
        },
      },
      {
        title: "Alternative: Boots", detail: "Black leather knee-high boots. Sleek silhouette, minimal hardware.",
        shop: {
          luxury: { store: "Nordstrom", item: "Khaite Marfa Knee-High Boot", price: "$1,490" },
          mid: { store: "DSW", item: "Vince Camuto Phranzie Knee Boot", price: "$180" },
          budget: { store: "Amazon", item: "DREAM PAIRS Knee-High Riding Boot", price: "$40" },
        },
      },
    ],
    accessories: [
      {
        title: "Watch", detail: "A silver or gunmetal watch with a black face. Bold and architectural.",
        shop: {
          luxury: { store: "Nordstrom", item: "TAG Heuer Carrera 29mm Silver/Black", price: "$2,350" },
          mid: { store: "Amazon", item: "MVMT Boulevard Gunmetal Watch", price: "$128" },
          budget: { store: "Amazon", item: "Casio Classic Women's Silver Watch", price: "$18" },
        },
      },
      {
        title: "Jewelry", detail: "Silver geometric earrings. A single statement ring. Minimal but impactful.",
        tip: "Silver and berry tones are a power combination",
        shop: {
          luxury: { store: "Mejuri", item: "Sculptural Hoops in Silver", price: "$95" },
          mid: { store: "Nordstrom", item: "Jenny Bird Ada Earrings Silver", price: "$50" },
          budget: { store: "Amazon", item: "PAVOI Sterling Silver Geometric Studs", price: "$12" },
        },
      },
      {
        title: "Bag", detail: "A structured black leather envelope clutch or a mini top-handle bag.",
        shop: {
          luxury: { store: "Nordstrom", item: "Bottega Veneta Cassette Bag Black", price: "$3,200" },
          mid: { store: "Coach Outlet", item: "Mini Top Handle Bag in Black", price: "$120" },
          budget: { store: "Amazon", item: "CHARMING TAILOR Envelope Clutch Black", price: "$17" },
        },
      },
      {
        title: "Purse Details", detail: "Look for silver hardware, clean lines. A burgundy or deep wine alternative adds cohesion.",
        shop: {
          luxury: { store: "Nordstrom", item: "Saint Laurent Monogram Card Case Wine", price: "$350" },
          mid: { store: "Kate Spade Outlet", item: "Spencer Zip Wallet Burgundy", price: "$79" },
          budget: { store: "Amazon", item: "BOSTANTEN Small Crossbody Wine Red", price: "$25" },
        },
      },
      {
        title: "Finishing", detail: "A dark berry nail polish. A bold, moody perfume with black cherry and cedar notes.",
        shop: {
          luxury: { store: "Sephora", item: "Tom Ford Lost Cherry EDP", price: "$190" },
          mid: { store: "Ulta", item: "Viktor & Rolf Bon Bon EDP", price: "$65" },
          budget: { store: "Amazon", item: "Zara Red Temptation EDP", price: "$20" },
        },
      },
    ],
  },
};

const TutorialScreen = ({ lookName, onBack, onHome }: Props) => {
  const [activeCategory, setActiveCategory] = useState<Category>("makeup");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<PriceTier>("mid");

  const data = lookData[lookName] || lookData["Soft Glam"];
  const steps = data[activeCategory] || [];

  const toggleStep = (key: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStep(expandedStep === key ? null : key);
  };

  const totalSteps = Object.values(data).flat().length;
  const doneCount = completedSteps.size;
  const progress = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  // Calculate estimated total for current category at active tier
  const categoryTotal = steps.reduce((sum, step) => {
    if (!step.shop) return sum;
    const priceStr = step.shop[activeTier]?.price || "$0";
    const num = parseFloat(priceStr.replace(/[$,]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40 }}>
      {/* Header */}
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ flex: 1 }}>
          <div className="header-title">{lookName}</div>
          <div className="header-sub">Complete Style Guide</div>
        </div>
        <button className="back-btn" onClick={onHome} style={{ fontSize: 16 }}>🏠</button>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Progress */}
        <div className="glamora-card anim-fadeUp" style={{ padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Style Progress</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-success))" }}>{doneCount}/{totalSteps} steps</span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: "hsla(var(--glamora-cream2))", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 100, width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Price Tier Selector */}
        <div className="glamora-card anim-fadeUp d1" style={{ padding: "14px 14px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "hsl(var(--glamora-gray))", fontWeight: 600, marginBottom: 10 }}>
            Shop by Budget
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["luxury", "mid", "budget"] as PriceTier[]).map((tier) => {
              const t = tierInfo[tier];
              const isActive = activeTier === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  style={{
                    flex: 1, padding: "10px 8px", borderRadius: 14, border: "1.5px solid",
                    borderColor: isActive ? t.color : "hsla(var(--glamora-gray-light) / 0.25)",
                    background: isActive ? t.bg : "transparent",
                    cursor: "pointer", fontFamily: "'Jost', sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 2 }}>{t.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? t.color : "hsl(var(--glamora-gray))" }}>
                    {t.label}
                  </div>
                </button>
              );
            })}
          </div>
          {categoryTotal > 0 && (
            <div style={{
              marginTop: 12, padding: "8px 12px", borderRadius: 10,
              background: tierInfo[activeTier].bg,
              textAlign: "center", fontSize: 13, fontWeight: 600,
              color: tierInfo[activeTier].color,
            }}>
              Est. {categoryLabels[activeCategory].label} total: ${categoryTotal.toLocaleString()}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="anim-fadeUp d2" style={{
          display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none",
        }}>
          {categoryOrder.map((cat) => {
            const isActive = activeCategory === cat;
            const catSteps = data[cat] || [];
            const catDone = catSteps.filter((_, i) => completedSteps.has(`${cat}-${i}`)).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 16px", borderRadius: 14, border: "1.5px solid",
                  borderColor: isActive ? "hsl(var(--glamora-rose-dark))" : "hsla(var(--glamora-gray-light) / 0.3)",
                  background: isActive
                    ? "linear-gradient(135deg, hsla(var(--glamora-rose-dark) / 0.12), hsla(var(--glamora-gold) / 0.08))"
                    : "hsl(var(--card))",
                  cursor: "pointer", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'Jost', sans-serif", fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))",
                  transition: "all 0.2s", flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 16 }}>{categoryLabels[cat].icon}</span>
                {categoryLabels[cat].label}
                {catDone > 0 && (
                  <span style={{
                    fontSize: 10, background: "hsl(var(--glamora-success))",
                    color: "white", borderRadius: 100, padding: "2px 6px", fontWeight: 600,
                  }}>
                    {catDone}/{catSteps.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          {steps.map((step, i) => {
            const key = `${activeCategory}-${i}`;
            const done = completedSteps.has(key);
            const isExpanded = expandedStep === key;
            const shopItem = step.shop?.[activeTier];

            return (
              <div
                key={key}
                className={`glamora-card anim-fadeUp d${Math.min(i + 1, 6)}`}
                style={{
                  padding: "18px 18px",
                  border: done
                    ? "1.5px solid hsla(var(--glamora-success) / 0.4)"
                    : "1px solid hsla(var(--glamora-gold) / 0.12)",
                  transition: "all 0.25s ease",
                }}
              >
                <div
                  onClick={() => toggleStep(key)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                    background: done
                      ? "hsl(var(--glamora-success))"
                      : "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.2), hsla(var(--glamora-gold) / 0.15))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: done ? 18 : 14, fontWeight: 700,
                    color: done ? "white" : "hsl(var(--glamora-rose-dark))",
                    transition: "all 0.25s ease",
                  }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 600,
                      color: "hsl(var(--glamora-char))",
                      textDecoration: done ? "line-through" : "none", marginBottom: 4,
                    }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", lineHeight: 1.55 }}>
                      {step.detail}
                    </div>
                    {step.tip && (
                      <div style={{
                        marginTop: 10, padding: "8px 12px", borderRadius: 10,
                        background: "hsla(var(--glamora-gold-pale) / 0.5)",
                        border: "1px solid hsla(var(--glamora-gold) / 0.15)",
                        fontSize: 12, color: "hsl(var(--glamora-gold))", fontWeight: 500,
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        💡 {step.tip}
                      </div>
                    )}
                  </div>
                </div>

                {/* Shop section */}
                {step.shop && (
                  <div style={{ marginTop: 14 }}>
                    <button
                      onClick={(e) => toggleExpand(key, e)}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 12,
                        background: tierInfo[activeTier].bg,
                        border: `1px solid ${tierInfo[activeTier].color}22`,
                        cursor: "pointer", fontFamily: "'Jost', sans-serif",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: tierInfo[activeTier].color }}>
                        🛍️ Shop This — {shopItem?.price}
                      </span>
                      <span style={{
                        fontSize: 12, color: "hsl(var(--glamora-gray))",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}>
                        ▼
                      </span>
                    </button>

                    {isExpanded && (
                      <div style={{
                        marginTop: 10, display: "flex", flexDirection: "column", gap: 8,
                        animation: "fadeUp 0.3s ease both",
                      }}>
                        {(["luxury", "mid", "budget"] as PriceTier[]).map((tier) => {
                          const item = step.shop![tier];
                          const t = tierInfo[tier];
                          const isCurrent = tier === activeTier;
                          return (
                            <div
                              key={tier}
                              style={{
                                padding: "12px 14px", borderRadius: 12,
                                background: isCurrent ? t.bg : "hsla(var(--glamora-cream2) / 0.5)",
                                border: isCurrent ? `1.5px solid ${t.color}33` : "1px solid hsla(var(--glamora-gray-light) / 0.15)",
                                display: "flex", alignItems: "center", gap: 12,
                              }}
                            >
                              <div style={{
                                width: 32, height: 32, borderRadius: 10,
                                background: t.bg, display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 16, flexShrink: 0,
                              }}>
                                {t.icon}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
                                  color: t.color, fontWeight: 600, marginBottom: 2,
                                }}>
                                  {t.label} · {item.store}
                                </div>
                                <div style={{
                                  fontSize: 13, color: "hsl(var(--glamora-char))",
                                  fontWeight: 500, lineHeight: 1.35,
                                  overflow: "hidden", textOverflow: "ellipsis",
                                }}>
                                  {item.item}
                                </div>
                              </div>
                              <div style={{
                                padding: "6px 12px", borderRadius: 100,
                                background: t.bg, fontSize: 14,
                                fontWeight: 700, color: t.color,
                                whiteSpace: "nowrap", flexShrink: 0,
                              }}>
                                {item.price}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-primary btn-rose" onClick={onHome}>Done Styling ✨</button>
        </div>
      </div>
    </div>
  );
};

export default TutorialScreen;
