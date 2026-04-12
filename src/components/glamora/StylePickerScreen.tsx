import { useState } from "react";
import { Shirt, Flame, Heart, Clock, Dumbbell, Briefcase, Smile, Palette, Check, ArrowRight, Gem, GraduationCap, Zap, Umbrella, Scissors, Star, Sparkles, Flower2, Crown, ShoppingBag, Search, X } from "lucide-react";
import type { StyleCategory } from "./GlamoraApp";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: { styleCategory: StyleCategory; gender: "male" | "female" };
  onBack: () => void;
  onNext: (category: StyleCategory, celebrityGuide?: string, subcategory?: string) => void;
}

const categories: { id: StyleCategory; label: string; Icon: LucideIcon; desc: string; includes: string[]; genderLabel?: { male: string; female: string }; subs: { id: string; label: string; desc: string; emoji: string }[] }[] = [
  {
    id: "full-style", label: "Full Style", Icon: Shirt,
    desc: "Complete head-to-toe outfit with accessories, shoes, and grooming",
    includes: ["Tops & Layers", "Bottoms", "Shoes & Socks", "Watches & Jewelry", "Bags"],
    subs: [
      { id: "smart-casual", label: "Smart Casual", desc: "Polished but relaxed — blazer + sneakers energy", emoji: "🧥" },
      { id: "power-outfit", label: "Power Outfit", desc: "Commanding, confident, head-turning ensemble", emoji: "💼" },
      { id: "brunch-ready", label: "Brunch Ready", desc: "Effortlessly chic for a weekend outing", emoji: "🥂" },
      { id: "night-out", label: "Night Out", desc: "Going out? Stand out with this curated look", emoji: "🌙" },
      { id: "monochrome-set", label: "Monochrome Set", desc: "Head-to-toe in one color family — elevated and intentional", emoji: "⬛" },
    ],
  },
  {
    id: "icon-looks", label: "Icon Looks", Icon: Star,
    desc: "Channel iconic aesthetic archetypes — timeless vibes inspired by the greats",
    includes: ["Signature Silhouettes", "Iconic Accessories", "Era-Defining Looks", "Head-to-Toe Styling"],
    subs: [
      { id: "old-hollywood-siren", label: "Old Hollywood Siren", desc: "Vintage glamour — red lips, waves, figure-hugging gowns", emoji: "💋" },
      { id: "red-carpet-royalty", label: "Red Carpet Royalty", desc: "Architectural gowns, bold colors, show-stopping elegance", emoji: "👑" },
      { id: "streetwear-mogul", label: "Streetwear Mogul", desc: "Designer-heavy street flex — oversized fits, rare drops, bold vision", emoji: "🔥" },
      { id: "pop-diva", label: "Pop Diva", desc: "Stage-ready power — sequins, bodycon, fierce confidence", emoji: "🎤" },
      { id: "minimalist-it-girl", label: "Minimalist It-Girl", desc: "Clean-girl aesthetic — slicked hair, neutral palette, quiet luxury", emoji: "🤍" },
      { id: "rock-legend", label: "Rock Legend", desc: "Leather, eyeliner, skinny fits, rebellious edge with star power", emoji: "🎸" },
      { id: "90s-supermodel", label: "90s Supermodel", desc: "Off-duty model vibes — slip dresses, blazers, sunglasses, effortless cool", emoji: "🕶️" },
      { id: "fashion-forward-icon", label: "Fashion Forward", desc: "Avant-garde, boundary-pushing — haute couture meets street", emoji: "✨" },
      { id: "suave-gentleman", label: "Suave Gentleman", desc: "Impeccably tailored suits, pocket squares, and old-world charm", emoji: "🎩" },
      { id: "hip-hop-royalty", label: "Hip-Hop Royalty", desc: "Iced-out chains, designer everything, commanding presence", emoji: "💎" },
      { id: "bohemian-muse", label: "Bohemian Muse", desc: "Free-spirited layers, flowing fabrics, festival-queen energy", emoji: "🌻" },
      { id: "athletic-icon", label: "Athletic Icon", desc: "Sporty-chic perfection — matching sets, sneakers, effortless power", emoji: "🏆" },
      { id: "disco-queen", label: "Disco Queen", desc: "Glitter, platforms, jumpsuits — 70s dance floor royalty", emoji: "🪩" },
      { id: "parisian-chic", label: "Parisian Chic", desc: "Effortless French elegance — berets, stripes, trench coats, red lips", emoji: "🇫🇷" },
      { id: "kpop-star", label: "K-Pop Star", desc: "Bold hair colors, oversized fits, layered accessories, idol energy", emoji: "🎶" },
      { id: "mob-wife", label: "Mob Wife", desc: "Fur coats, gold hoops, dark lips, leopard print — luxe and dangerous", emoji: "🐆" },
      { id: "coastal-cowgirl", label: "Coastal Cowgirl", desc: "Cowboy boots meet beach vibes — fringe, denim, turquoise", emoji: "🤠" },
      { id: "dark-feminine", label: "Dark Feminine", desc: "All-black elegance — lace, corsets, smoky eyes, mysterious allure", emoji: "🖤" },
      { id: "golden-era-rapper", label: "Golden Era Rapper", desc: "90s hip-hop drip — Timbs, Starter jackets, gold rope chains", emoji: "📻" },
      { id: "modern-royal", label: "Modern Royal", desc: "Regal coats, fascinators, gloves, and structured handbags — palace-ready", emoji: "🏰" },
    ],
  },
  {
    id: "streetwear", label: "Streetwear", Icon: Flame,
    desc: "Urban-inspired looks with sneakers, hoodies, and statement pieces",
    includes: ["Graphic Tees & Hoodies", "Cargos & Baggy Jeans", "Sneakers & Boots", "Caps & Chains"],
    subs: [
      { id: "japanese-street", label: "Japanese Street", desc: "Harajuku-inspired layering and bold silhouettes", emoji: "🏯" },
      { id: "hypebeast", label: "Hypebeast", desc: "Designer-heavy flex with rare drops and collabs", emoji: "🔥" },
      { id: "skater", label: "Skater", desc: "Loose fits, Vans, and graphic-heavy tees", emoji: "🛹" },
      { id: "gorpcore", label: "Gorpcore", desc: "Outdoorsy tech meets city — trail runners, fleece, utility", emoji: "🏔️" },
      { id: "oversized-layers", label: "Oversized Layers", desc: "Chunky hoodies, puffer vests, and baggy proportions", emoji: "🧤" },
    ],
  },
  {
    id: "minimalist", label: "Minimalist", Icon: Heart,
    desc: "Clean, intentional, timeless — quality over quantity",
    includes: ["Essential Tees & Knits", "Tailored Trousers", "Clean Sneakers", "Minimal Watches"],
    subs: [
      { id: "scandinavian", label: "Scandinavian", desc: "Neutral tones, clean lines, cozy textures", emoji: "❄️" },
      { id: "monochrome", label: "Monochrome", desc: "Single-tone outfits with tonal layering", emoji: "⚪" },
      { id: "capsule-wardrobe", label: "Capsule Wardrobe", desc: "Max versatility from minimal pieces", emoji: "🎯" },
      { id: "quiet-luxury", label: "Quiet Luxury", desc: "No logos, just impeccable fabric and fit", emoji: "🤫" },
    ],
  },
  {
    id: "vintage", label: "Vintage / Retro", Icon: Clock,
    desc: "60s mod, 70s boho, 90s grunge — pull from the best eras",
    includes: ["Printed Shirts", "Flare Jeans", "Platform Shoes", "Retro Sunglasses"],
    subs: [
      { id: "70s-boho", label: "70s Boho", desc: "Flowy fabrics, fringe, earthy tones", emoji: "🌻" },
      { id: "90s-grunge", label: "90s Grunge", desc: "Flannel, ripped denim, combat boots", emoji: "🎸" },
      { id: "60s-mod", label: "60s Mod", desc: "Sharp lines, bold patterns, mini silhouettes", emoji: "🕺" },
      { id: "80s-glam", label: "80s Glam", desc: "Neon, power shoulders, and statement everything", emoji: "🪩" },
      { id: "50s-pin-up", label: "50s Pin-Up", desc: "Polka dots, high-waisted, classic glamour", emoji: "💋" },
    ],
  },
  {
    id: "athleisure", label: "Athleisure", Icon: Dumbbell,
    desc: "Gym-to-street style — performance fabrics meet fashion",
    includes: ["Performance Tees", "Joggers & Shorts", "Running Sneakers", "Smart Watches"],
    subs: [
      { id: "yoga-chic", label: "Yoga Chic", desc: "Matching sets, earth tones, zen-to-street", emoji: "🧘" },
      { id: "gym-to-brunch", label: "Gym to Brunch", desc: "Sporty but put-together enough for coffee", emoji: "☕" },
      { id: "performance-luxe", label: "Performance Luxe", desc: "Premium athletic brands styled elevated", emoji: "🏆" },
      { id: "running-fit", label: "Running Fit", desc: "Sleek performance gear styled for the streets", emoji: "🏃" },
    ],
  },
  {
    id: "formal", label: "Formal / Business", Icon: Briefcase,
    desc: "Professional and elegant looks for work and events",
    includes: ["Suits & Blazers", "Dress Shirts", "Dress Shoes", "Ties & Cufflinks"],
    subs: [
      { id: "black-tie", label: "Black Tie", desc: "Tuxedos, gowns, and red-carpet polish", emoji: "🎩" },
      { id: "business-modern", label: "Business Modern", desc: "Tailored fits with contemporary edge", emoji: "👔" },
      { id: "cocktail", label: "Cocktail", desc: "Semiformal elegance for evening events", emoji: "🍸" },
      { id: "boardroom", label: "Boardroom", desc: "CEO-level power dressing", emoji: "💎" },
      { id: "gala-evening", label: "Gala Evening", desc: "Floor-length gowns, cufflinks, and opulence", emoji: "✨" },
    ],
  },
  {
    id: "casual", label: "Casual Everyday", Icon: Smile,
    desc: "Effortless daily outfits that look put-together",
    includes: ["Tees & Knits", "Jeans & Chinos", "Sneakers & Loafers"],
    subs: [
      { id: "weekend-chill", label: "Weekend Chill", desc: "Relaxed fits for errands and hangouts", emoji: "😎" },
      { id: "elevated-basics", label: "Elevated Basics", desc: "Simple pieces that feel premium", emoji: "👕" },
      { id: "cozy-layered", label: "Cozy Layered", desc: "Knits, flannels, and warm-tone comfort", emoji: "🧣" },
      { id: "denim-on-denim", label: "Denim on Denim", desc: "Canadian tuxedo but make it fashion", emoji: "👖" },
    ],
  },
  {
    id: "bohemian", label: "Bohemian", Icon: Gem,
    desc: "Free-spirited, earthy, layered textures and flowing silhouettes",
    includes: ["Flowy Tops", "Wide-Leg Pants", "Sandals & Boots", "Layered Jewelry"],
    subs: [
      { id: "festival", label: "Festival", desc: "Coachella-ready with fringe, crochet, and boots", emoji: "🎪" },
      { id: "earthy-boho", label: "Earthy Boho", desc: "Muted tones, linen, natural textures", emoji: "🍂" },
      { id: "boho-glam", label: "Boho Glam", desc: "Free-spirited with a touch of sparkle", emoji: "🌟" },
      { id: "desert-nomad", label: "Desert Nomad", desc: "Flowing robes, turquoise jewelry, sun-washed tones", emoji: "🏜️" },
    ],
  },
  {
    id: "preppy", label: "Preppy / Classic", Icon: GraduationCap,
    desc: "Ivy League polish — blazers, loafers, clean patterns",
    includes: ["Polo Shirts & Oxfords", "Chinos & Pleated Trousers", "Loafers & Boat Shoes", "Belts & Watches"],
    subs: [
      { id: "old-money", label: "Old Money", desc: "Quiet luxury — cashmere, navy, and heritage brands", emoji: "🏛️" },
      { id: "country-club", label: "Country Club", desc: "Tennis whites, pastels, and boat shoes", emoji: "🎾" },
      { id: "academic", label: "Dark Academia", desc: "Tweed, turtlenecks, and vintage spectacles", emoji: "📚" },
      { id: "ivy-league", label: "Ivy League", desc: "Varsity jackets, oxford shirts, and class rings", emoji: "🎓" },
    ],
  },
  {
    id: "edgy", label: "Edgy / Punk", Icon: Zap,
    desc: "Leather, studs, dark tones — rebellious and bold",
    includes: ["Leather Jackets", "Ripped Denim", "Combat Boots", "Chain Accessories"],
    subs: [
      { id: "goth", label: "Goth", desc: "All-black, dramatic, and darkly romantic", emoji: "🖤" },
      { id: "punk-rock", label: "Punk Rock", desc: "Band tees, safety pins, and plaid", emoji: "🤘" },
      { id: "biker", label: "Biker", desc: "Heavy leather, studs, and moto boots", emoji: "🏍️" },
      { id: "grunge-revival", label: "Grunge Revival", desc: "Oversized flannels, docs, and messy layers", emoji: "⛓️" },
    ],
  },
  {
    id: "resort", label: "Resort / Vacation", Icon: Umbrella,
    desc: "Relaxed luxury for beach, travel, and warm-weather vibes",
    includes: ["Linen Shirts", "Swim & Shorts", "Sandals & Espadrilles", "Straw Accessories"],
    subs: [
      { id: "tropical-luxe", label: "Tropical Luxe", desc: "Prints, linen, and resort-wear elegance", emoji: "🌴" },
      { id: "coastal-casual", label: "Coastal Casual", desc: "Breezy and sun-bleached — effortless beach town", emoji: "🐚" },
      { id: "yacht-club", label: "Yacht Club", desc: "Nautical stripes, whites, and deck shoes", emoji: "⛵" },
      { id: "island-hopper", label: "Island Hopper", desc: "Lightweight layers for tropical adventures", emoji: "🏝️" },
    ],
  },
  {
    id: "makeup-only", label: "Makeup & Grooming", Icon: Palette,
    genderLabel: { male: "Grooming & Skincare", female: "Makeup & Beauty" },
    desc: "Focus on face — skincare, grooming, and beauty routine",
    includes: ["Primer & Base", "Eyes & Brows", "Lips", "Skincare"],
    subs: [
      { id: "soft-glam", label: "Soft Glam", desc: "Dewy skin, neutral eyes, glossy lips", emoji: "✨" },
      { id: "bold-beat", label: "Bold Beat", desc: "Full-coverage, dramatic eyes, statement lips", emoji: "💄" },
      { id: "no-makeup-makeup", label: "No-Makeup Makeup", desc: "Barely-there beauty that enhances naturally", emoji: "🌿" },
      { id: "editorial", label: "Editorial", desc: "Avant-garde, high-fashion, artistic expression", emoji: "🎨" },
      { id: "glass-skin", label: "Glass Skin", desc: "K-beauty inspired luminous, hydrated perfection", emoji: "💧" },
    ],
  },
  {
    id: "grooming", label: "Grooming Essentials", Icon: Scissors,
    desc: "Hair, beard, skincare — the complete grooming playbook",
    includes: ["Haircut Styles", "Beard & Shave", "Skincare Routine", "Fragrance"],
    subs: [
      { id: "clean-cut", label: "Clean Cut", desc: "Sharp fade, clean shave, polished skin", emoji: "✂️" },
      { id: "rugged-grooming", label: "Rugged Grooming", desc: "Well-kept beard, textured hair, natural skin", emoji: "🧔" },
      { id: "modern-gent", label: "Modern Gent", desc: "Styled hair, trimmed stubble, curated fragrance", emoji: "🪞" },
      { id: "buzz-fresh", label: "Buzz & Fresh", desc: "Buzz cut, clean skin, minimal effort max impact", emoji: "💈" },
    ],
  },
  {
    id: "sexy", label: "Sexy & Sultry", Icon: Flame,
    desc: "Bold, body-confident looks that turn heads",
    includes: ["Bodycon Dresses", "Cut-Out Tops", "Strappy Heels", "Statement Jewelry"],
    subs: [
      { id: "bombshell", label: "Bombshell", desc: "Classic Hollywood curves and confidence", emoji: "🔥" },
      { id: "sleek-sultry", label: "Sleek & Sultry", desc: "Minimalist but impossibly sexy silhouettes", emoji: "🖤" },
      { id: "va-va-voom", label: "Va Va Voom", desc: "Red dress energy — bold color, bold attitude", emoji: "❤️" },
      { id: "diamond-drip", label: "Diamond Drip", desc: "Sparkling jewelry, statement necklaces, and bling", emoji: "💍" },
    ],
  },
  {
    id: "swimwear", label: "Swimwear & Beach", Icon: Umbrella,
    desc: "Bikinis, cover-ups, and beach-ready accessories",
    includes: ["Bikinis & One-Pieces", "Cover-Ups & Sarongs", "Sandals & Slides", "Sunglasses & Hats"],
    subs: [
      { id: "beach-goddess", label: "Beach Goddess", desc: "Luxe one-pieces, gold jewelry, and sarongs", emoji: "👑" },
      { id: "sporty-swim", label: "Sporty Swim", desc: "Athletic cuts, bold colors, active beach style", emoji: "🏄" },
      { id: "tropical-glam", label: "Tropical Glam", desc: "Print bikinis, statement cover-ups, resort vibes", emoji: "🌺" },
      { id: "two-piece-set", label: "Two-Piece Set", desc: "Coordinated bikini top and bottom — classic and flattering", emoji: "👙" },
      { id: "monokini", label: "Monokini", desc: "Cut-out one-piece with revealing details", emoji: "🐠" },
      { id: "swim-with-jewelry", label: "Swim & Jewelry", desc: "Beach look with waterproof chains, anklets, and rings", emoji: "💎" },
    ],
  },
  {
    id: "urban-hiphop", label: "Urban / Hip-Hop", Icon: Zap,
    desc: "Bold streetwear with hip-hop flair — drip and swagger",
    includes: ["Designer Tees & Jerseys", "Baggy Denim & Cargos", "Fresh Kicks", "Chains & Grillz"],
    subs: [
      { id: "trap-drip", label: "Trap Drip", desc: "Designer heavy, iced out, and flexing", emoji: "💰" },
      { id: "boom-bap", label: "Boom Bap Classic", desc: "90s hip-hop vibes — Timbs, baggy jeans, Starter jackets", emoji: "🎤" },
      { id: "afro-futurism", label: "Afrofuturism", desc: "Bold prints, metallic accents, cultural fusion", emoji: "🌍" },
      { id: "diamond-chains", label: "Diamond Chains", desc: "Cuban links, diamond pendants, and iced-out watches", emoji: "💎" },
    ],
  },
  {
    id: "rugged", label: "Rugged / Workwear", Icon: Briefcase,
    desc: "Tough, utilitarian style — built to last and look good",
    includes: ["Flannels & Henleys", "Raw Denim & Work Pants", "Boots", "Leather Belts"],
    subs: [
      { id: "lumberjack", label: "Lumberjack", desc: "Flannel, denim, and heritage boots", emoji: "🪓" },
      { id: "military-surplus", label: "Military Surplus", desc: "Olive, khaki, and tactical utility", emoji: "🎖️" },
      { id: "americana", label: "Americana", desc: "Denim-on-denim, workboots, and leather goods", emoji: "🦅" },
      { id: "ranch-hand", label: "Ranch Hand", desc: "Western boots, leather belts, and sturdy denim", emoji: "🤠" },
    ],
  },
  {
    id: "techwear", label: "Techwear", Icon: Zap,
    desc: "Futuristic utility — tech fabrics, modular gear, dark tones",
    includes: ["Technical Jackets", "Cargo Joggers", "Trail Runners", "Tactical Bags"],
    subs: [
      { id: "cyberpunk", label: "Cyberpunk", desc: "Neon accents, dark base, sci-fi silhouettes", emoji: "🤖" },
      { id: "urban-ninja", label: "Urban Ninja", desc: "All-black, sleek, modular and minimal", emoji: "🥷" },
      { id: "outdoor-tech", label: "Outdoor Tech", desc: "Trail-ready with city aesthetics", emoji: "⚡" },
      { id: "dystopian", label: "Dystopian", desc: "Post-apocalyptic layers, utility straps, dark palettes", emoji: "🌑" },
    ],
  },
  {
    id: "date-night", label: "Date Night", Icon: Heart,
    desc: "Polished and alluring — dress to impress",
    includes: ["Fitted Blazers & Dresses", "Heels & Dress Shoes", "Fragrance", "Accessories"],
    subs: [
      { id: "romantic-dinner", label: "Romantic Dinner", desc: "Candlelit vibes — elegant and refined", emoji: "🕯️" },
      { id: "drinks-rooftop", label: "Drinks & Rooftop", desc: "Trendy, slightly edgy, conversation-starting", emoji: "🍷" },
      { id: "first-date", label: "First Date", desc: "Approachable yet impressive — confident charm", emoji: "💐" },
      { id: "anniversary", label: "Anniversary", desc: "Timeless elegance with a personal touch", emoji: "💝" },
    ],
  },
  {
    id: "lingerie", label: "Lingerie & Intimates", Icon: Heart,
    desc: "Elegant intimate wear — lace, silk, and delicate details",
    includes: ["Bralettes & Corsets", "Silk Robes & Slips", "Lace Sets", "Loungewear"],
    subs: [
      { id: "romantic-lace", label: "Romantic Lace", desc: "Soft, feminine, and delicately detailed", emoji: "🌹" },
      { id: "modern-minimal", label: "Modern Minimal", desc: "Clean lines, sleek fabrics, understated", emoji: "🤍" },
      { id: "luxury-silk", label: "Luxury Silk", desc: "Satin robes, silk slips, old-Hollywood intimacy", emoji: "🥂" },
      { id: "two-piece-lace", label: "Two-Piece Lace Set", desc: "Matching bralette and bottom in delicate lace", emoji: "🎀" },
    ],
  },
  {
    id: "y2k", label: "Y2K", Icon: Sparkles,
    desc: "Early 2000s nostalgia — low-rise, butterfly tops, frosted lips",
    includes: ["Crop Tops & Halters", "Mini Skirts & Low-Rise Jeans", "Platform Shoes", "Tinted Sunglasses & Belly Chains"],
    subs: [
      { id: "paris-hilton", label: "Paris Hilton Era", desc: "Pink, bedazzled, and unapologetically extra", emoji: "💖" },
      { id: "skater-y2k", label: "Skater Y2K", desc: "Baggy pants, baby tees, and chunky shoes", emoji: "🛼" },
      { id: "cyber-y2k", label: "Cyber Y2K", desc: "Metallic, futuristic, and rave-inspired", emoji: "🪐" },
      { id: "belly-chain-era", label: "Belly Chain Era", desc: "Body jewelry, low-rise everything, and nameplate necklaces", emoji: "⛓️" },
    ],
  },
  {
    id: "cottagecore", label: "Cottagecore", Icon: Flower2,
    desc: "Romantic countryside aesthetic — florals, linen, wicker",
    includes: ["Floral Dresses", "Puff-Sleeve Blouses", "Mary Janes & Leather Boots", "Straw Hats & Wicker Bags"],
    subs: [
      { id: "english-garden", label: "English Garden", desc: "Florals, tea dresses, and delicate embroidery", emoji: "🌷" },
      { id: "farmhouse-chic", label: "Farmhouse Chic", desc: "Linen aprons, wicker baskets, rustic charm", emoji: "🧺" },
      { id: "fairy-tale", label: "Fairy Tale", desc: "Puff sleeves, ribbons, and whimsical details", emoji: "🧚" },
      { id: "meadow-picnic", label: "Meadow Picnic", desc: "Gingham, straw hats, and sun-dappled charm", emoji: "🌾" },
    ],
  },
  {
    id: "jewelry-accessories", label: "Jewelry & Accessories", Icon: Gem,
    desc: "Statement pieces — rings, necklaces, watches, and bracelets styled on you",
    includes: ["Rings & Bands", "Necklaces & Chains", "Watches", "Bracelets & Bangles", "Earrings"],
    subs: [
      { id: "diamond-rings", label: "Diamond Rings", desc: "Solitaires, halos, and pavé bands that sparkle", emoji: "💍" },
      { id: "gold-chains", label: "Gold Chains", desc: "Cuban links, rope chains, and layered pendants", emoji: "⛓️" },
      { id: "statement-necklace", label: "Statement Necklace", desc: "Bold chokers, bib necklaces, and oversized pendants", emoji: "📿" },
      { id: "luxury-watches", label: "Luxury Watches", desc: "Rolex, Cartier, AP — wrist game on point", emoji: "⌚" },
      { id: "stacked-bracelets", label: "Stacked Bracelets", desc: "Layered bangles, beads, and cuffs", emoji: "🪬" },
      { id: "pearl-elegance", label: "Pearl Elegance", desc: "Classic pearls — necklaces, studs, and drops", emoji: "🤍" },
      { id: "ear-party", label: "Ear Party", desc: "Multiple piercings, hoops, studs, and cuffs", emoji: "✨" },
    ],
  },
  {
    id: "sunglasses-eyewear", label: "Eyewear", Icon: Star,
    desc: "Sunglasses, prescription glasses, blue light specs, and designer frames",
    includes: ["Sunglasses", "Prescription Glasses", "Reading Glasses", "Blue Light Glasses", "Sport Eyewear"],
    subs: [
      { id: "aviators", label: "Aviators", desc: "Classic pilot frames — timeless and universally flattering", emoji: "🕶️" },
      { id: "cat-eye", label: "Cat-Eye", desc: "Retro-femme frames with upswept corners", emoji: "😼" },
      { id: "oversized", label: "Oversized", desc: "Big, bold frames that make a statement", emoji: "🔮" },
      { id: "wayfarer", label: "Wayfarer", desc: "The iconic silhouette — universally cool", emoji: "😎" },
      { id: "round-vintage", label: "Round Vintage", desc: "Lennon-inspired circular frames with retro charm", emoji: "🌀" },
      { id: "shield", label: "Shield / Visor", desc: "Futuristic single-lens wraparound look", emoji: "🛡️" },
      { id: "prescription-classic", label: "Classic Rx", desc: "Timeless rectangular prescription frames", emoji: "👓" },
      { id: "prescription-bold", label: "Bold Rx", desc: "Thick acetate frames — statement prescription glasses", emoji: "🤓" },
      { id: "prescription-rimless", label: "Rimless Rx", desc: "Invisible frames for a barely-there look", emoji: "✨" },
      { id: "blue-light", label: "Blue Light", desc: "Stylish screen-protection glasses for work and gaming", emoji: "💻" },
      { id: "sport-frames", label: "Sport Frames", desc: "Wraparound performance shades for active lifestyles", emoji: "🏃" },
      { id: "clubmaster", label: "Clubmaster", desc: "Browline frames with a sophisticated retro edge", emoji: "🎩" },
      { id: "geometric", label: "Geometric", desc: "Hexagonal, octagonal, and angular statement shapes", emoji: "💎" },
      { id: "transparent", label: "Clear Frames", desc: "Translucent acetate — modern and minimalist", emoji: "🫧" },
    ],
  },
  {
    id: "hats-headwear", label: "Hats & Headwear", Icon: Crown,
    desc: "Top it off — caps, hats, beanies, and head accessories",
    includes: ["Caps & Snapbacks", "Brimmed Hats", "Beanies & Knits", "Head Wraps & Scarves"],
    subs: [
      { id: "bucket-hat", label: "Bucket Hat", desc: "Relaxed streetwear staple — casual and effortless", emoji: "🪣" },
      { id: "beanie", label: "Beanie", desc: "Cozy knit for cold weather or laid-back vibes", emoji: "🧶" },
      { id: "fedora", label: "Fedora", desc: "Structured brim with sophisticated charm", emoji: "🎩" },
      { id: "snapback", label: "Snapback", desc: "Flat-brim cap with streetwear attitude", emoji: "🧢" },
      { id: "baseball-cap", label: "Baseball Cap", desc: "Classic curved-brim everyday essential", emoji: "⚾" },
      { id: "wide-brim", label: "Wide Brim", desc: "Sun hat glamour — perfect for resort and boho looks", emoji: "👒" },
      { id: "beret", label: "Beret", desc: "Parisian chic — artistic and effortlessly stylish", emoji: "🇫🇷" },
      { id: "headwrap", label: "Head Wrap", desc: "Bold prints and fabrics tied with flair", emoji: "🎀" },
      { id: "cowboy", label: "Cowboy Hat", desc: "Western-inspired statement piece", emoji: "🤠" },
      { id: "visor", label: "Visor", desc: "Sporty open-top sun protection with style", emoji: "☀️" },
    ],
  },
  {
    id: "bags-purses", label: "Bags & Purses", Icon: ShoppingBag,
    desc: "Carry in style — totes, crossbodies, clutches, backpacks, and designer bags",
    includes: ["Tote Bags", "Crossbody Bags", "Clutches", "Backpacks", "Shoulder Bags"],
    subs: [
      { id: "tote", label: "Tote Bag", desc: "Spacious everyday carry — leather, canvas, or structured", emoji: "👜" },
      { id: "crossbody", label: "Crossbody", desc: "Hands-free and compact — ideal for day or night", emoji: "💼" },
      { id: "clutch", label: "Clutch", desc: "Elegant evening essential — slim and statement", emoji: "✨" },
      { id: "backpack", label: "Backpack", desc: "Practical meets stylish — leather or nylon", emoji: "🎒" },
      { id: "shoulder-bag", label: "Shoulder Bag", desc: "Classic silhouette — hobo, baguette, or structured", emoji: "👛" },
      { id: "belt-bag", label: "Belt Bag / Fanny Pack", desc: "Trendy hands-free — sporty to luxury", emoji: "🪢" },
      { id: "mini-bag", label: "Mini Bag", desc: "Tiny statement piece — just the essentials", emoji: "🤏" },
      { id: "weekender", label: "Weekender / Duffle", desc: "Overnight travel bag with style and space", emoji: "🧳" },
      { id: "bucket-bag", label: "Bucket Bag", desc: "Slouchy drawstring silhouette — casual luxury", emoji: "🪣" },
      { id: "designer-classic", label: "Designer Classic", desc: "Iconic luxury bags — Birkin, Chanel Flap, Lady Dior", emoji: "💎" },
    ],
  },
  {
    id: "shoes-sneakers", label: "Shoes & Sneakers", Icon: Zap,
    desc: "Step up your game — sneakers, heels, boots, loafers, and designer kicks",
    includes: ["Sneakers", "Heels & Pumps", "Boots", "Loafers & Flats", "Sandals & Slides"],
    subs: [
      { id: "retro-sneakers", label: "Retro Sneakers", desc: "Air Jordan 1s, Dunks, New Balance 550 — classic silhouettes", emoji: "👟" },
      { id: "running-sneakers", label: "Running Sneakers", desc: "Nike Air Max, Asics Gel, Adidas Ultra Boost — performance meets style", emoji: "🏃" },
      { id: "designer-sneakers", label: "Designer Sneakers", desc: "Golden Goose, Balenciaga, Alexander McQueen — luxury on foot", emoji: "💎" },
      { id: "high-top", label: "High Tops", desc: "Converse, Jordan, Rick Owens — ankle coverage with attitude", emoji: "🔝" },
      { id: "stiletto-heels", label: "Stiletto Heels", desc: "Classic pointed-toe stilettos — Louboutin, Manolo, Jimmy Choo", emoji: "👠" },
      { id: "block-heels", label: "Block Heels", desc: "Comfortable height with chunky stability — day to night", emoji: "🧱" },
      { id: "platform-heels", label: "Platforms", desc: "Elevated soles — 70s disco to modern statement", emoji: "🪩" },
      { id: "ankle-boots", label: "Ankle Boots", desc: "Chelsea, combat, or pointed — year-round staple", emoji: "🥾" },
      { id: "knee-high-boots", label: "Knee-High Boots", desc: "Over-the-knee or knee-high — leather, suede, or stretch", emoji: "👢" },
      { id: "cowboy-boots", label: "Cowboy Boots", desc: "Western-inspired — embroidered, pointed toe, stacked heel", emoji: "🤠" },
      { id: "loafers", label: "Loafers", desc: "Penny, horsebit, or platform — Gucci, Prada, Bass", emoji: "🪷" },
      { id: "oxfords-derbies", label: "Oxfords & Derbies", desc: "Classic lace-ups — polished leather for formal or smart casual", emoji: "👞" },
      { id: "sandals", label: "Sandals", desc: "Birkenstock, Hermès Oran, strappy flats — warm-weather ease", emoji: "🩴" },
      { id: "slides", label: "Slides & Mules", desc: "Slip-on ease — Yeezy Slides, Bottega padded, birkenstock", emoji: "🫧" },
      { id: "ballet-flats", label: "Ballet Flats", desc: "Sam Edelman, Repetto, The Row — minimalist elegance", emoji: "🩰" },
      { id: "work-boots", label: "Work Boots", desc: "Timberland, Red Wing, Dr. Martens — rugged and built to last", emoji: "🪓" },
    ],
  },
  {
    id: "wedding-gowns", label: "Wedding Gowns", Icon: Heart,
    desc: "Bridal elegance — find your dream wedding dress styled on you",
    includes: ["Ball Gowns", "A-Line Dresses", "Mermaid Silhouettes", "Veils & Accessories"],
    subs: [
      { id: "classic-ballgown", label: "Classic Ball Gown", desc: "Full skirt, fitted bodice — fairy-tale princess vibes", emoji: "👑" },
      { id: "mermaid-fit", label: "Mermaid / Trumpet", desc: "Body-hugging through the hips then flares at the knee", emoji: "🧜" },
      { id: "a-line", label: "A-Line", desc: "Universally flattering — fitted top, gradually flared skirt", emoji: "✨" },
      { id: "sheath", label: "Sheath / Column", desc: "Sleek and minimal — no flare, all elegance", emoji: "🤍" },
      { id: "bohemian-bridal", label: "Bohemian Bridal", desc: "Flowy lace, off-shoulder, garden wedding vibes", emoji: "🌿" },
      { id: "vintage-bridal", label: "Vintage Bridal", desc: "Tea-length, long sleeves, retro lace details", emoji: "🕰️" },
      { id: "modern-minimal-bridal", label: "Modern Minimal", desc: "Clean lines, no embellishments — architectural simplicity", emoji: "◻️" },
      { id: "cathedral-train", label: "Cathedral Train", desc: "Dramatic long train for a grand entrance", emoji: "⛪" },
      { id: "short-bridal", label: "Short / Mini Bridal", desc: "Cocktail-length wedding dress — reception or elopement ready", emoji: "💃" },
      { id: "colored-gown", label: "Colored Gown", desc: "Blush, champagne, black — non-traditional wedding colors", emoji: "🎨" },
    ],
  },
  {
    id: "tuxedos", label: "Tuxedos", Icon: Shirt,
    desc: "Black-tie perfection — classic to modern formal tuxedo looks",
    includes: ["Jacket & Lapels", "Dress Shirt & Bow Tie", "Trousers", "Dress Shoes & Cufflinks"],
    subs: [
      { id: "classic-black", label: "Classic Black Tux", desc: "Timeless single-breasted with satin lapels", emoji: "🖤" },
      { id: "midnight-blue", label: "Midnight Blue", desc: "Darker than navy — sophisticated alternative to black", emoji: "🌌" },
      { id: "white-dinner-jacket", label: "White Dinner Jacket", desc: "James Bond energy — ivory jacket, black trousers", emoji: "🍸" },
      { id: "velvet-tux", label: "Velvet Tux", desc: "Luxe velvet jacket — burgundy, emerald, or navy", emoji: "🎭" },
      { id: "double-breasted-tux", label: "Double-Breasted", desc: "Peak lapels, six buttons — old-Hollywood power", emoji: "👔" },
      { id: "slim-modern-tux", label: "Slim Modern", desc: "Fitted silhouette, minimal detailing, clean lines", emoji: "✂️" },
      { id: "patterned-tux", label: "Patterned / Jacquard", desc: "Paisley, floral, or brocade — statement formal wear", emoji: "🌸" },
      { id: "colored-tux", label: "Colored Tux", desc: "Bold colors — red, forest green, or royal purple", emoji: "🎨" },
      { id: "tux-no-tie", label: "Open Collar Tux", desc: "No bow tie — relaxed yet formal modern look", emoji: "😎" },
      { id: "three-piece-tux", label: "Three-Piece Tux", desc: "Vest added for extra polish and layering", emoji: "🏆" },
    ],
  },
  {
    id: "fitness", label: "Fitness & Activewear", Icon: Dumbbell,
    desc: "Workout-ready looks — gym, yoga, running, and athleisure fits",
    includes: ["Sports Bras & Tops", "Leggings & Shorts", "Sneakers", "Accessories"],
    subs: [
      { id: "yoga-pants-set", label: "Yoga Pants Set", desc: "High-waist leggings with matching crop top — zen and styled", emoji: "🧘" },
      { id: "nike-2piece-men", label: "Nike 2-Piece (Men)", desc: "Matching Nike Dri-FIT top and shorts — clean and coordinated", emoji: "✔️" },
      { id: "nike-2piece-women", label: "Nike 2-Piece (Women)", desc: "Nike sports bra and biker shorts or leggings combo", emoji: "💪" },
      { id: "gym-lifting", label: "Gym / Lifting", desc: "Stringer tank, joggers, and flat-sole shoes — iron ready", emoji: "🏋️" },
      { id: "running-kit", label: "Running Kit", desc: "Lightweight tee, split shorts, and performance runners", emoji: "🏃" },
      { id: "crossfit-fit", label: "CrossFit Fit", desc: "Functional gear — compression, wrist wraps, and metcons", emoji: "🔥" },
      { id: "pilates-set", label: "Pilates Set", desc: "Sculpted matching set — reformer-ready pastels", emoji: "🩰" },
      { id: "outdoor-hiking", label: "Outdoor / Hiking", desc: "Trail shoes, moisture-wicking layers, and utility shorts", emoji: "🥾" },
      { id: "boxing-mma", label: "Boxing / MMA", desc: "Fight shorts, hand wraps, and compression tops", emoji: "🥊" },
      { id: "tennis-outfit", label: "Tennis Outfit", desc: "Skort or shorts, polo or tank — court-ready style", emoji: "🎾" },
      { id: "dance-workout", label: "Dance / Zumba", desc: "Colorful, flexible, and movement-friendly fits", emoji: "💃" },
      { id: "lounge-recovery", label: "Lounge & Recovery", desc: "Oversized hoodie, joggers, and slides — post-workout chill", emoji: "🛋️" },
    ],
  },
  {
    id: "cosplay", label: "Cosplay & Character", Icon: Sparkles,
    desc: "Transform into iconic character-inspired looks — anime, cartoon, gaming, and pop culture aesthetics",
    includes: ["Full Costumes", "Wigs & Hair", "Props & Accessories", "Makeup & Body Paint"],
    subs: [
      // Anime & Manga — section marker via special id prefix
      { id: "_section_anime", label: "🎌 Anime & Manga", desc: "", emoji: "" },
      { id: "saiyan-warrior", label: "Saiyan Warrior", desc: "Spiky-haired martial artist in orange gi — power-up energy", emoji: "🔥" },
      { id: "magical-moon-guardian", label: "Moon Guardian", desc: "Sailor-skirted magical heroine with tiara and bows", emoji: "🌙" },
      { id: "ninja-shinobi", label: "Ninja Shinobi", desc: "Orange-clad ninja with headband and determined spirit", emoji: "🍥" },
      { id: "demon-slayer-warrior", label: "Demon Slayer", desc: "Checkered haori and katana — protecting humanity at dawn", emoji: "⚔️" },
      { id: "spirit-detective", label: "Spirit Detective", desc: "Green school uniform and slicked-back hair — supernatural fighter", emoji: "👻" },
      { id: "magical-girl-wand", label: "Magical Girl", desc: "Frilly transformation outfit with wand and ribbons", emoji: "🪄" },
      { id: "mecha-pilot", label: "Mecha Pilot", desc: "Plugsuit or flight suit — giant robot cockpit energy", emoji: "🤖" },
      { id: "android-heroine", label: "Android Heroine", desc: "Gothic-lolita blindfolded warrior — elegant yet deadly", emoji: "🗡️" },
      { id: "schoolgirl-anime", label: "Anime Schoolgirl", desc: "Pleated skirt, sailor collar, and knee-high socks", emoji: "📚" },
      { id: "pirate-captain", label: "Pirate Captain", desc: "Straw hat, vest, and swashbuckling adventure vibes", emoji: "🏴‍☠️" },
      { id: "cat-girl-kawaii", label: "Cat Girl / Kawaii", desc: "Cat ears, maid outfit, and cute stockings — anime café aesthetic", emoji: "🐱" },
      { id: "alchemist-hero", label: "Alchemist Hero", desc: "Red coat, automail arm, and determined alchemist on a quest", emoji: "⚗️" },
      { id: "titan-fighter", label: "Titan Fighter", desc: "Green cape, ODM gear harness, and Survey Corps uniform", emoji: "🏔️" },
      // Classic Cartoon
      { id: "_section_cartoon", label: "📺 Classic Cartoon", desc: "", emoji: "" },
      { id: "retro-mouse-icon", label: "Retro Mouse Icon", desc: "Polka-dot dress, round ears, and cheerful bow — classic cartoon charm", emoji: "🎀" },
      { id: "kung-fu-fighter", label: "Kung-Fu Fighter", desc: "Blue qipao-style outfit with ox-horn buns and spiked bracelets", emoji: "👊" },
      { id: "mystery-sleuth", label: "Mystery Sleuth", desc: "Purple dress, orange hair, headband — groovy detective vibes", emoji: "🔍" },
      { id: "electric-pocket-creature", label: "Pocket Creature Trainer", desc: "Cap, vest, and belt — ready to catch them all", emoji: "⚡" },
      { id: "plumber-hero", label: "Plumber Hero", desc: "Red cap, blue overalls, and iconic mustache — let's-a-go!", emoji: "🍄" },
      // Disney Princess Archetypes
      { id: "_section_disney", label: "👸 Disney Princess Archetypes", desc: "", emoji: "" },
      { id: "ice-queen", label: "Ice Queen", desc: "Shimmering blue gown, flowing platinum braid, and ice crystal magic", emoji: "❄️" },
      { id: "ocean-voyager", label: "Ocean Voyager", desc: "Island warrior princess with tropical necklace and oar — the ocean chose her", emoji: "🌊" },
      { id: "enchanted-rose-princess", label: "Rose Princess", desc: "Golden ball gown, rose motif, and classic fairy-tale elegance", emoji: "🌹" },
      { id: "glass-slipper-belle", label: "Glass Slipper Belle", desc: "Sparkling blue gown, updo, choker, and midnight magic", emoji: "👠" },
      { id: "desert-jewel-princess", label: "Desert Jewel", desc: "Turquoise harem outfit, gold jewelry, and magic lamp adventure", emoji: "🪔" },
      { id: "forest-archer-princess", label: "Forest Archer", desc: "Emerald dress, wild curly red hair, and expert bow skills", emoji: "🏹" },
      { id: "tower-dreamer", label: "Tower Dreamer", desc: "Purple dress, extremely long golden hair, and a cast-iron frying pan", emoji: "🗼" },
      { id: "underwater-princess", label: "Underwater Princess", desc: "Seashell top, shimmering tail-inspired skirt, and flowing red hair", emoji: "🧜" },
      { id: "sleeping-beauty-royal", label: "Sleeping Royal", desc: "Regal pink or blue gown, golden tiara, and enchanted grace", emoji: "👸" },
      // Video Game Characters
      { id: "_section_gaming", label: "🎮 Video Game Characters", desc: "", emoji: "" },
      { id: "space-bounty-hunter", label: "Space Bounty Hunter", desc: "Armored power suit with visor helmet — intergalactic warrior", emoji: "🚀" },
      { id: "hylian-hero", label: "Hylian Hero", desc: "Green tunic, pointed hat, master sword, and Hylian shield", emoji: "🗡️" },
      { id: "hedgehog-speedster", label: "Hedgehog Speedster", desc: "Blue spiky look, red shoes, and supersonic speed aesthetic", emoji: "💨" },
      { id: "battle-royale-soldier", label: "Battle Royale Soldier", desc: "Tactical gear, colorful armor skins, and a victory dance pose", emoji: "🎯" },
      { id: "block-builder", label: "Block Builder", desc: "Pixelated armor, diamond pickaxe, and blocky adventure aesthetic", emoji: "⛏️" },
      { id: "street-fighter-warrior", label: "Street Fighter", desc: "White gi, red headband, and martial arts power stance", emoji: "🥋" },
      { id: "racing-plumber", label: "Racing Champion", desc: "Racing jumpsuit, helmet, and go-kart energy — first place vibes", emoji: "🏎️" },
      { id: "goddess-of-war", label: "God of War", desc: "Spartan armor, red war paint, and ancient Greek warrior rage", emoji: "⚔️" },
      { id: "vault-dweller", label: "Vault Dweller", desc: "Blue and yellow jumpsuit, Pip-Boy device, and post-apocalyptic wasteland gear", emoji: "☢️" },
      // Comic Book & Superhero
      { id: "_section_comics", label: "💥 Comic Book & Superhero", desc: "", emoji: "" },
      { id: "superhero-classic", label: "Classic Superhero", desc: "Cape, emblem, and boots — generic comic book hero styling", emoji: "🦸" },
      { id: "villain-dark-lord", label: "Dark Villain", desc: "Black cape, armor, and ominous presence — embrace the dark side", emoji: "😈" },
      { id: "web-slinger", label: "Web Slinger", desc: "Red and blue bodysuit with web pattern and mask — friendly neighborhood hero", emoji: "🕸️" },
      { id: "dark-knight-vigilante", label: "Dark Vigilante", desc: "Black armored suit, cape, and cowl — justice from the shadows", emoji: "🦇" },
      { id: "amazonian-warrior", label: "Amazonian Warrior", desc: "Golden tiara, red and blue armor, lasso, and bracers — divine warrior", emoji: "⭐" },
      { id: "cosmic-captain", label: "Cosmic Captain", desc: "Star-spangled suit with shield — patriotic super soldier energy", emoji: "🛡️" },
      { id: "thunder-god", label: "Thunder God", desc: "Flowing cape, winged helmet, and enchanted hammer — Norse power", emoji: "⚡" },
      { id: "clawed-mutant", label: "Clawed Mutant", desc: "Yellow and blue suit, wild hair, and adamantium claws — berserker rage", emoji: "🐺" },
      { id: "anti-hero-symbiote", label: "Symbiote Anti-Hero", desc: "Black organic suit with white spider emblem and sharp teeth — dark power", emoji: "🖤" },
      // Fantasy & Horror
      { id: "_section_fantasy", label: "🧙 Fantasy & Horror", desc: "", emoji: "" },
      { id: "cyber-hacker", label: "Cyber Hacker", desc: "Black trench coat, sunglasses, and digital noir", emoji: "🕶️" },
      { id: "elven-archer", label: "Elven Archer", desc: "Pointed ears, tunic, and enchanted bow — fantasy woodland warrior", emoji: "🧝" },
      { id: "rpg-knight", label: "RPG Knight", desc: "Full plate armor, shield, and sword — fantasy quest ready", emoji: "🛡️" },
      { id: "witch-sorceress", label: "Witch / Sorceress", desc: "Pointy hat, flowing robes, and mystical accessories", emoji: "🧙" },
      { id: "zombie-cosplay", label: "Zombie / Undead", desc: "Tattered clothes, SFX makeup, and horror aesthetics", emoji: "🧟" },
      { id: "vampire-noble", label: "Vampire Noble", desc: "Gothic cape, fangs, pale makeup, and aristocratic dark elegance", emoji: "🧛" },
      { id: "steampunk-explorer", label: "Steampunk Explorer", desc: "Brass goggles, corset, gears, and Victorian-industrial adventure gear", emoji: "⚙️" },
    ],
  },
  {
    id: "baby-toddler", label: "Baby & Toddler", Icon: Heart,
    desc: "Adorable outfits for babies and toddlers — dress your little one in style",
    includes: ["Onesies & Rompers", "Matching Sets", "Shoes & Booties", "Accessories & Hats"],
    subs: [
      { id: "baby-formal", label: "Formal / Occasion", desc: "Tiny suits, dresses, and bow ties for special events", emoji: "🎩" },
      { id: "baby-casual", label: "Everyday Casual", desc: "Comfy cotton sets, graphic onesies, and soft leggings", emoji: "👶" },
      { id: "baby-matching-set", label: "Matching Set", desc: "Coordinated top and bottom — effortlessly put-together", emoji: "🧸" },
      { id: "baby-sporty", label: "Sporty / Athletic", desc: "Mini sneakers, joggers, and team-inspired fits", emoji: "⚽" },
      { id: "baby-princess", label: "Princess / Tutu", desc: "Tulle skirts, sparkly headbands, and fairy-tale charm", emoji: "👑" },
      { id: "baby-denim", label: "Denim Cutie", desc: "Mini jeans, denim jackets, and rugged-cute combos", emoji: "👖" },
      { id: "baby-cozy", label: "Cozy & Warm", desc: "Knit sweaters, fleece onesies, and fuzzy booties", emoji: "🧤" },
      { id: "baby-summer", label: "Summer Fun", desc: "Sunhats, rompers, sandals, and bright patterns", emoji: "☀️" },
      { id: "baby-holiday", label: "Holiday Outfit", desc: "Christmas, Halloween, Easter — themed adorable looks", emoji: "🎄" },
      { id: "baby-boho", label: "Boho Baby", desc: "Earthy tones, floral prints, and natural fabrics", emoji: "🌻" },
      { id: "baby-streetwear", label: "Mini Streetwear", desc: "Tiny Jordans, graphic tees, and cool-kid energy", emoji: "🔥" },
      { id: "baby-twin-matching", label: "Sibling Matching", desc: "Coordinated outfits for siblings or parent-child duo", emoji: "👯" },
    ],
  },
  {
    id: "parent-child", label: "Parent-Child Matching", Icon: Heart,
    desc: "Coordinated outfits for parent and baby — twinning never looked so good",
    includes: ["Matching Sets", "Coordinated Colors", "Family Photo Outfits", "Mommy & Me / Daddy & Me"],
    subs: [
      { id: "_section_everyday", label: "👨‍👩‍👧 Everyday Matching", desc: "", emoji: "" },
      { id: "pc-casual-match", label: "Casual Twinning", desc: "Matching graphic tees, jeans, and sneakers — effortless parent-child cool", emoji: "👕" },
      { id: "pc-denim-duo", label: "Denim Duo", desc: "Coordinated denim jackets, jeans, and white tees — classic Americana", emoji: "👖" },
      { id: "pc-sporty-match", label: "Sporty Match", desc: "Matching Nike/Adidas sets, sneakers, and athletic energy", emoji: "🏃" },
      { id: "pc-streetwear-mini", label: "Street Mini-Me", desc: "Matching Jordans, graphic hoodies, and cool-kid swagger", emoji: "🔥" },
      { id: "pc-cozy-match", label: "Cozy Twinning", desc: "Matching knit sweaters, beanies, and warm tones — snuggle vibes", emoji: "🧶" },
      { id: "_section_special", label: "✨ Special Occasions", desc: "", emoji: "" },
      { id: "pc-formal-match", label: "Formal Duo", desc: "Mini suit + big suit, or matching dresses — event-ready elegance", emoji: "🎩" },
      { id: "pc-holiday-match", label: "Holiday Twinning", desc: "Matching Christmas PJs, Halloween costumes, or Easter pastels", emoji: "🎄" },
      { id: "pc-wedding-match", label: "Wedding Duo", desc: "Coordinated wedding guest outfits — parent and flower girl/ring bearer", emoji: "💒" },
      { id: "pc-birthday-match", label: "Birthday Match", desc: "Themed matching outfits for birthday party celebrations", emoji: "🎂" },
      { id: "_section_aesthetic", label: "🎨 Aesthetic Matching", desc: "", emoji: "" },
      { id: "pc-boho-match", label: "Boho Family", desc: "Earthy tones, floral prints, and natural fabrics — meadow vibes", emoji: "🌻" },
      { id: "pc-monochrome-match", label: "Monochrome Duo", desc: "All-white, all-black, or single-color family coordination", emoji: "⬛" },
      { id: "pc-pastel-match", label: "Pastel Pair", desc: "Soft lavender, mint, blush — gentle matching tones", emoji: "🩷" },
      { id: "pc-tropical-match", label: "Tropical Duo", desc: "Matching Hawaiian prints, resort wear, and vacation energy", emoji: "🌴" },
      { id: "pc-preppy-match", label: "Preppy Pair", desc: "Polo shirts, khakis, and boat shoes — mini country club vibes", emoji: "⛳" },
      { id: "_section_gender", label: "💕 Mommy & Me / Daddy & Me", desc: "", emoji: "" },
      { id: "pc-mommy-daughter", label: "Mommy & Daughter", desc: "Matching dresses, headbands, and feminine coordinated looks", emoji: "👩‍👧" },
      { id: "pc-mommy-son", label: "Mommy & Son", desc: "Coordinated colors and styles — mama bear + little man", emoji: "👩‍👦" },
      { id: "pc-daddy-daughter", label: "Daddy & Daughter", desc: "Dad in a sharp outfit, daughter in a mini version — heart-melting", emoji: "👨‍👧" },
      { id: "pc-daddy-son", label: "Daddy & Son", desc: "Matching suits, sneakers, or jerseys — like father like son", emoji: "👨‍👦" },
    ],
  },
];

const customDetailPlaceholders: Record<string, string> = {
  "full-style": 'e.g. "Navy linen blazer", "White Stan Smiths"...',
  "streetwear": 'e.g. "Supreme box logo hoodie", "Nike Dunk Lows"...',
  "minimalist": 'e.g. "Cream cashmere sweater", "White Common Projects"...',
  "vintage": 'e.g. "70s bell-bottom jeans", "Round John Lennon glasses"...',
  "athleisure": 'e.g. "Lululemon Align leggings", "Nike Air Max 90s"...',
  "formal": 'e.g. "Navy double-breasted suit", "Ferragamo loafers"...',
  "casual": 'e.g. "Oversized white tee", "Vintage Levi 501s"...',
  "bohemian": 'e.g. "Crochet maxi dress", "Turquoise layered necklace"...',
  "preppy": 'e.g. "Ralph Lauren cable knit", "Penny loafers"...',
  "edgy": 'e.g. "Studded leather jacket", "Dr. Martens 1460s"...',
  "resort": 'e.g. "Linen camp collar shirt", "Gucci slides"...',
  "makeup-only": 'e.g. "Charlotte Tilbury Pillow Talk lip", "Soft smokey eye"...',
  "grooming": 'e.g. "Mid skin fade", "Full beard with lined edges"...',
  "sexy": 'e.g. "Red satin slip dress", "Strappy gold heels"...',
  "swimwear": 'e.g. "High-waist bikini in emerald", "Straw sun hat"...',
  "urban-hiphop": 'e.g. "Cuban link chain", "Air Force 1s all white"...',
  "rugged": 'e.g. "Red Wing Iron Rangers", "Waxed canvas jacket"...',
  "techwear": 'e.g. "ACG cargo pants", "ACRONYM J1A jacket"...',
  "date-night": 'e.g. "Silk midi dress", "Tom Ford cologne"...',
  "lingerie": 'e.g. "Black lace bodysuit", "Silk robe in champagne"...',
  "y2k": 'e.g. "Butterfly clips", "Low-rise flare jeans"...',
  "cottagecore": 'e.g. "Puff-sleeve floral dress", "Wicker basket bag"...',
  "jewelry-accessories": 'e.g. "Cartier Love bracelet", "Diamond studs"...',
  "sunglasses-eyewear": 'e.g. "Ray-Ban Aviators gold", "Celine cat-eye frames"...',
  "hats-headwear": 'e.g. "Yankees fitted cap", "Straw Panama hat"...',
  "bags-purses": 'e.g. "Chanel Classic Flap", "Bottega Veneta Pouch"...',
  "shoes-sneakers": 'e.g. "Retro Jordan 1 Chicago", "Adidas Samba OGs"...',
  "wedding-gowns": 'e.g. "Off-shoulder lace bodice", "Cathedral-length veil"...',
  "tuxedos": 'e.g. "Burgundy velvet jacket", "Black satin bow tie"...',
  "fitness": 'e.g. "Nike Dri-FIT matching set", "Gymshark compression shorts"...',
  "icon-looks": 'e.g. "Old Hollywood waves", "Oversized blazer with sneakers"...',
  "cosplay": 'e.g. "Orange martial arts gi", "Sailor outfit with tiara"...',
  "baby-toddler": 'e.g. "Floral romper with sun hat", "Mini Nike Jordan set"...',
  "parent-child": 'e.g. "Matching denim jackets", "Mommy & me floral dresses"...',
};

const StylePickerScreen = ({ prefs, onBack, onNext }: Props) => {
  const [selected, setSelected] = useState<StyleCategory[]>([prefs.styleCategory]);
  const [selectedSubs, setSelectedSubs] = useState<Record<string, string>>({});
  const [customDetails, setCustomDetails] = useState<Record<string, string>>({});
  const [cosplaySearch, setCosplaySearch] = useState("");
  
  const isMale = prefs.gender === "male";

  const filtered = categories.filter(c => {
    if (c.id === "grooming") return isMale;
    if (c.id === "rugged") return isMale;
    if (c.id === "urban-hiphop") return isMale;
    if (c.id === "sexy") return !isMale;
    if (c.id === "swimwear") return !isMale;
    if (c.id === "lingerie") return !isMale;
    return true;
  });

  const toggleCategory = (id: StyleCategory) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        setSelectedSubs(s => { const copy = { ...s }; delete copy[id]; return copy; });
        setCustomDetails(s => { const copy = { ...s }; delete copy[id]; return copy; });
        return prev.filter(c => c !== id);
      }
      return [...prev, id];
    });
  };

  // Show detail for the most recently selected and use it as the primary generation style
  const primarySelected = selected[selected.length - 1];
  const current = filtered.find(c => c.id === primarySelected) || filtered[0];

  const accent = isMale ? "--glamora-gold" : "--glamora-rose-dark";
  const accentLight = isMale ? "--glamora-gold-light" : "--glamora-rose";

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40 }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Choose Your Style</div>
          <div className="header-sub">{isMale ? "What's your vibe, king?" : "What are you looking for?"}</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Multi-select hint */}
        <div className="anim-fadeUp" style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 14px", borderRadius: 14, marginBottom: 14,
          background: `hsla(var(${accent}) / 0.08)`,
          border: `1px solid hsla(var(${accent}) / 0.15)`,
        }}>
          <Check size={16} color={`hsl(var(${accent}))`} />
          <span style={{ fontSize: 12, color: "hsl(var(--glamora-char))", fontWeight: 500 }}>
            Select one or more styles to mix & match
          </span>
          {selected.length > 1 && (
            <span style={{
              marginLeft: "auto", padding: "3px 10px", borderRadius: 100,
              background: `hsl(var(${accent}))`, color: "white",
              fontSize: 11, fontWeight: 700,
            }}>
              {selected.length}
            </span>
          )}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {filtered.map((cat, i) => {
            const isSelected = selected.includes(cat.id);
            const selIndex = selected.indexOf(cat.id);
            const label = cat.genderLabel ? cat.genderLabel[prefs.gender] : cat.label;
            return (
              <div
                key={cat.id}
                className={`glamora-card anim-fadeUp d${Math.min(i + 1, 6)}`}
                onClick={() => toggleCategory(cat.id)}
                style={{
                  padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 8, cursor: "pointer", textAlign: "center", position: "relative",
                  border: isSelected
                    ? `2px solid hsl(var(${accent}))`
                    : "1.5px solid hsla(var(--glamora-gold) / 0.1)",
                  background: isSelected
                    ? `linear-gradient(135deg, hsla(var(${accentLight}) / 0.1), hsla(var(${isMale ? "--glamora-gold-light" : "--glamora-gold"}) / 0.05))`
                    : "hsl(var(--card))",
                  transition: "all 0.2s",
                }}
              >
                {/* Selection badge with order number */}
                {isSelected && (
                  <div style={{
                    position: "absolute", top: 6, right: 6,
                    width: 22, height: 22, borderRadius: "50%",
                    background: "hsl(var(--glamora-success))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px hsla(150 30% 50% / 0.3)",
                  }}>
                    {selected.length > 1 ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "white" }}>{selIndex + 1}</span>
                    ) : (
                      <Check size={12} color="white" />
                    )}
                  </div>
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: isSelected
                    ? `linear-gradient(135deg, hsl(var(${accent})), hsl(var(${isMale ? "--glamora-gold-light" : "--glamora-gold"})))`
                    : "hsla(var(--glamora-cream2))",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                }}>
                  <cat.Icon size={20} color={isSelected ? "white" : `hsl(var(${accent}))`} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))", lineHeight: 1.2 }}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* Selected detail — show for last selected */}
        <div className="glamora-card anim-fadeUp" style={{ padding: "16px 16px", marginBottom: 14 }}>
          <div className="section-label" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <current.Icon size={14} color="hsl(var(--glamora-gray))" />
            What's Included in {current.genderLabel ? current.genderLabel[prefs.gender] : current.label}
          </div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 10, lineHeight: 1.4 }}>{current.desc}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {current.includes.map(item => (<span key={item} className="pill-tag">{item}</span>))}
          </div>
        </div>

        {/* Cosplay disclaimer */}
        {selected.includes("cosplay") && (
          <div className="anim-fadeUp" style={{
            padding: "12px 14px", borderRadius: 14, marginBottom: 14,
            background: "hsla(var(--glamora-gold) / 0.06)",
            border: "1px solid hsla(var(--glamora-gold) / 0.15)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              ⚠️ Fan-Inspired Costumes — Not Officially Licensed
            </div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", lineHeight: 1.5 }}>
              All cosplay styles are original, fan-inspired aesthetic descriptions and are not affiliated with, endorsed by, or licensed by any character, franchise, or intellectual property owner. Costume shopping links lead to third-party fan-made or generic costume products. All trademarks belong to their respective owners.
            </div>
          </div>
        )}

        {/* Subcategory selectors for ALL selected categories */}
        {selected.map(catId => {
          const cat = filtered.find(c => c.id === catId);
          if (!cat || cat.subs.length === 0) return null;
          const catLabel = cat.genderLabel ? cat.genderLabel[prefs.gender] : cat.label;
          return (
            <div key={catId} className="glamora-card anim-fadeUp" style={{ padding: "16px 16px", marginBottom: 14 }}>
              <div className="section-label" style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <cat.Icon size={14} color={`hsl(var(${accent}))`} />
                {catLabel} — Refine Your Vibe
              </div>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginBottom: 12, lineHeight: 1.4 }}>
                Pick a sub-style for {catLabel.toLowerCase()} (optional)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.subs.map(sub => {
                  // Section header
                  if (sub.id.startsWith("_section_")) {
                    return (
                      <div key={sub.id} style={{
                        padding: "10px 0 4px",
                        marginTop: 4,
                        borderBottom: `1px solid hsla(var(${accent}) / 0.12)`,
                      }}>
                        <span style={{
                          fontSize: 13, fontWeight: 700,
                          color: `hsl(var(${accent}))`,
                          fontFamily: "'Playfair Display', serif",
                          letterSpacing: 0.3,
                        }}>
                          {sub.label}
                        </span>
                      </div>
                    );
                  }
                  const isActive = selectedSubs[catId] === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubs(prev => ({
                        ...prev,
                        [catId]: isActive ? undefined as any : sub.id,
                      }))}
                      style={{
                        padding: "12px 14px", borderRadius: 14, cursor: "pointer",
                        border: isActive
                          ? `2px solid hsl(var(${accent}))`
                          : `1.5px solid hsla(var(--glamora-gold) / 0.1)`,
                        background: isActive
                          ? `linear-gradient(135deg, hsla(var(${accentLight}) / 0.12), hsla(var(${accent}) / 0.05))`
                          : "hsl(var(--card))",
                        transition: "all 0.2s",
                        display: "flex", alignItems: "center", gap: 12,
                      }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: isActive ? `hsl(var(${accent}))` : `hsla(var(${accent}) / 0.08)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s", fontSize: 16,
                      }}>
                        {isActive
                          ? <Check size={14} color="white" />
                          : <span>{sub.emoji}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 2 }}>
                          {sub.label}
                        </div>
                        <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", lineHeight: 1.3 }}>
                          {sub.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Custom detail input when a substyle is selected */}
              {selectedSubs[catId] && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginBottom: 6, lineHeight: 1.4 }}>
                    ✏️ Specify exactly what you want (optional)
                  </div>
                  <input
                    type="text"
                    value={customDetails[catId] || ""}
                    onChange={(e) => setCustomDetails(prev => ({ ...prev, [catId]: e.target.value }))}
                    placeholder={customDetailPlaceholders[catId] || 'e.g. "Specific item or brand you want"...'}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 12,
                      border: `1.5px solid hsla(var(${accent}) / ${customDetails[catId] ? "0.4" : "0.15"})`,
                      background: customDetails[catId] ? `hsla(var(${accent}) / 0.05)` : "hsl(var(--card))",
                      fontSize: 13, fontFamily: "'Jost', sans-serif",
                      color: "hsl(var(--glamora-char))", outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = `hsl(var(${accent}))`; }}
                    onBlur={(e) => { e.target.style.borderColor = `hsla(var(${accent}) / ${customDetails[catId] ? "0.4" : "0.15"})`; }}
                  />
                  {customDetails[catId] && (
                    <div style={{
                      marginTop: 6, fontSize: 10, color: `hsl(var(${accent}))`, fontWeight: 500,
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <Sparkles size={10} /> AI will incorporate "{customDetails[catId]}" into your look
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {selected.length > 1 && (
          <div className="anim-fadeUp" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {selected.map(id => {
              const cat = categories.find(c => c.id === id);
              if (!cat) return null;
              return (
                <span key={id} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 12px", borderRadius: 100,
                  background: `hsla(var(${accent}) / 0.12)`,
                  border: `1px solid hsla(var(${accent}) / 0.2)`,
                  fontSize: 11, fontWeight: 600, color: `hsl(var(${accent}))`,
                  cursor: "pointer",
                }} onClick={() => toggleCategory(id)}>
                  <cat.Icon size={12} /> {cat.genderLabel ? cat.genderLabel[prefs.gender] : cat.label} ×
                </span>
              );
            })}
          </div>
        )}


        <button
          className="btn-primary btn-rose"
          disabled={false}
          onClick={() => {
            // Combine all selected sub-styles with optional custom details
            const combinedSubs = Object.entries(selectedSubs)
              .filter(([, v]) => v)
              .map(([catId, subId]) => {
                const detail = customDetails[catId]?.trim();
                return detail ? `${catId}:${subId}[${detail}]` : `${catId}:${subId}`;
              })
              .join(" + ");
            onNext(current.id, undefined, combinedSubs || undefined);
          }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: isMale
              ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
              : undefined,
            opacity: 1,
          }}>
          Continue — Upload Photo <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StylePickerScreen;
