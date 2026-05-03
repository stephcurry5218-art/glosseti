import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Coffee, Sparkles, Briefcase, Flame, Heart, Palmtree, Check, Dumbbell, Star, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StyleCategory, Gender } from "./GlamoraApp";
import FlowStepper from "./FlowStepper";

interface Props {
  gender: Gender;
  onBack: () => void;
  onNext: (category: StyleCategory, subcategory: string, vibeLabel: string) => void;
}

type OccasionId = "casual" | "glam" | "formal" | "streetwear" | "date-night" | "vacation" | "swimwear" | "fitness" | "cosplay";

interface Vibe {
  id: string;
  label: string;
  image: string;
  category: StyleCategory;
  subcategory: string;
}

interface Occasion {
  id: OccasionId;
  label: string;
  desc: string;
  Icon: LucideIcon;
  vibes: { female: Vibe[]; male: Vibe[] };
}

// Compressed editorial Unsplash photos — 3-column grid friendly.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=500&h=650&fit=crop&q=72&auto=format`;

// ============================================================================
// CURATED PHOTO BANKS — 12 per occasion × gender, race-diverse, body-diverse.
// Every ID is unique within the gender (enforced by dev-time assert below).
// Mix per occasion: ~3 Black, ~3 White, ~3 Hispanic/Latina, ~3 Asian.
// ============================================================================

const FEMALE_OCCASIONS: Record<OccasionId, Vibe[]> = {
  casual: [
    { id: "f-cas-01", label: "Clean Girl",         image: img("1496747611176-843222e1e57c"), category: "casual", subcategory: "clean-girl-aesthetic" },
    { id: "f-cas-02", label: "Denim & Tee",        image: img("1483985988355-763728e1935b"), category: "casual", subcategory: "denim-and-tee" },
    { id: "f-cas-03", label: "Soft Knits",         image: img("1469334031218-e382a71b716b"), category: "casual", subcategory: "soft-knits" },
    { id: "f-cas-04", label: "Athleisure",         image: img("1518310383802-640c2de311b6"), category: "athleisure", subcategory: "matching-set" },
    { id: "f-cas-05", label: "Weekend Cozy",       image: img("1490481651871-ab68de25d43d"), category: "casual", subcategory: "weekend-cozy" },
    { id: "f-cas-06", label: "Linen Summer",       image: img("1485518882345-15568b007407"), category: "casual", subcategory: "linen-summer" },
    { id: "f-cas-07", label: "Mom Jeans",          image: img("1591348278863-a8fb3887e2aa"), category: "casual", subcategory: "mom-jeans" },
    { id: "f-cas-08", label: "Oversized Hoodie",   image: img("1604004215695-c54b6f3df1e7"), category: "casual", subcategory: "oversized-hoodie" },
    { id: "f-cas-09", label: "Crop & Cargos",      image: img("1565325058695-f614c1580d7e"), category: "casual", subcategory: "crop-cargos" },
    { id: "f-cas-10", label: "Slip Dress Day",     image: img("1573408301185-9146fe634ad0"), category: "casual", subcategory: "slip-dress-day" },
    { id: "f-cas-11", label: "Effortless Layers",  image: img("1495121605193-b116b5b09a55"), category: "casual", subcategory: "effortless-layers" },
    { id: "f-cas-12", label: "Coffee Run",         image: img("1611601679334-95eb0a18b3a4"), category: "casual", subcategory: "coffee-run" },
  ],
  glam: [
    { id: "f-glm-01", label: "Sequin Mini",        image: img("1539109136881-3be0616acf4b"), category: "full-style", subcategory: "night-out" },
    { id: "f-glm-02", label: "Satin Slip",         image: img("1566174053879-31528523f8ae"), category: "full-style", subcategory: "satin-slip" },
    { id: "f-glm-03", label: "Bodycon",            image: img("1571513722275-4b41940f54b8"), category: "sexy", subcategory: "bodycon-night" },
    { id: "f-glm-04", label: "Leather Pants",      image: img("1525026198548-4baa812f1183"), category: "edgy", subcategory: "leather-night" },
    { id: "f-glm-05", label: "Metallic",           image: img("1601412436009-d964bd02edbc"), category: "full-style", subcategory: "metallic-shine" },
    { id: "f-glm-06", label: "All Black",          image: img("1641427493563-5cc9cf1a9950"), category: "edgy", subcategory: "all-black-night" },
    { id: "f-glm-07", label: "Cut-Out Dress",      image: img("1620063633168-8ec1bcc1bcec"), category: "sexy", subcategory: "cutout-dress" },
    { id: "f-glm-08", label: "Corset Top",         image: img("1622495966321-49b35b3a8d4f"), category: "sexy", subcategory: "corset-top" },
    { id: "f-glm-09", label: "Statement Heels",    image: img("1617380518330-7c5ca1dafdef"), category: "full-style", subcategory: "statement-heels" },
    { id: "f-glm-10", label: "Velvet Drama",       image: img("1599643478518-a784e5dc4c8f"), category: "full-style", subcategory: "velvet-drama" },
    { id: "f-glm-11", label: "Sparkle Two-Piece",  image: img("1605100804763-247f67b3557e"), category: "full-style", subcategory: "sparkle-two-piece" },
    { id: "f-glm-12", label: "Red Carpet",         image: img("1502323777036-f29e3972d82f"), category: "full-style", subcategory: "red-carpet" },
  ],
  formal: [
    { id: "f-fml-01", label: "Power Suit",         image: img("1487412720507-e7ab37603c6f"), category: "formal", subcategory: "power-suit" },
    { id: "f-fml-02", label: "Midi & Blazer",      image: img("1581044777550-4cfa60707c03"), category: "formal", subcategory: "midi-and-blazer" },
    { id: "f-fml-03", label: "Office Chic",        image: img("1551836022-deb4988cc6c0"), category: "formal", subcategory: "office-chic" },
    { id: "f-fml-04", label: "Trousers & Silk",    image: img("1605405748313-a416a1b84491"), category: "formal", subcategory: "trousers-silk" },
    { id: "f-fml-05", label: "Tailored Dress",     image: img("1495365200479-c4ed1d35e1aa"), category: "formal", subcategory: "tailored-dress" },
    { id: "f-fml-06", label: "Minimal Work",       image: img("1485178575877-1a13bf489dfe"), category: "minimalist", subcategory: "minimal-work" },
    { id: "f-fml-07", label: "Pencil Skirt",       image: img("1485231183945-fffde7cc051e"), category: "formal", subcategory: "pencil-skirt" },
    { id: "f-fml-08", label: "Boardroom Boss",     image: img("1601049541289-9b1b7bbbfe19"), category: "formal", subcategory: "boardroom-boss" },
    { id: "f-fml-09", label: "Belted Coat",        image: img("1571945153237-4929e783af4a"), category: "formal", subcategory: "belted-coat" },
    { id: "f-fml-10", label: "Wide-Leg Trouser",   image: img("1591348122449-02525d70379b"), category: "formal", subcategory: "wide-leg-trouser" },
    { id: "f-fml-11", label: "Crisp Shirt",        image: img("1503342217505-b0a15ec3261c"), category: "formal", subcategory: "crisp-shirt" },
    { id: "f-fml-12", label: "Modern Suit Set",    image: img("1531123414780-f74242c2b052"), category: "formal", subcategory: "modern-suit-set" },
  ],
  streetwear: [
    { id: "f-str-01", label: "Cargo & Crop",       image: img("1602910344008-22f323cc1817"), category: "streetwear", subcategory: "cargo-crop" },
    { id: "f-str-02", label: "Oversized Tee",      image: img("1517438476312-10d79c5f25e3"), category: "streetwear", subcategory: "oversized-tee" },
    { id: "f-str-03", label: "Y2K Revival",        image: img("1571908599407-cdb918ed83bf"), category: "y2k", subcategory: "y2k-revival" },
    { id: "f-str-04", label: "Techwear",           image: img("1581338834647-b0fb40704e21"), category: "techwear", subcategory: "techwear-base" },
    { id: "f-str-05", label: "Skater Girl",        image: img("1503236823255-94609f598e71"), category: "streetwear", subcategory: "skater" },
    { id: "f-str-06", label: "Japanese Street",    image: img("1531746020798-e6953c6e8e04"), category: "streetwear", subcategory: "japanese-street" },
    { id: "f-str-07", label: "Hypebeast Her",      image: img("1611042553365-9b101441c135"), category: "streetwear", subcategory: "hypebeast-her" },
    { id: "f-str-08", label: "Baggy Denim",        image: img("1583900985737-6d0495555783"), category: "streetwear", subcategory: "baggy-denim" },
    { id: "f-str-09", label: "Bomber Jacket",      image: img("1494178270175-e96de2971df9"), category: "streetwear", subcategory: "bomber-jacket" },
    { id: "f-str-10", label: "Sneakerhead",        image: img("1532910404247-7ee9488d7292"), category: "streetwear", subcategory: "sneakerhead" },
    { id: "f-str-11", label: "Graphic Tee Stack",  image: img("1492106087820-71f1a00d2b11"), category: "streetwear", subcategory: "graphic-tee-stack" },
    { id: "f-str-12", label: "Korean Street",      image: img("1564564321837-a57b7070ac4f"), category: "streetwear", subcategory: "korean-street" },
  ],
  "date-night": [
    { id: "f-dat-01", label: "Little Red Dress",   image: img("1597223557154-721c1cecc4b0"), category: "date-night", subcategory: "little-red-dress" },
    { id: "f-dat-02", label: "Soft Romantic",      image: img("1581574919402-5b7d733224d6"), category: "date-night", subcategory: "soft-romantic" },
    { id: "f-dat-03", label: "Wrap Dress",         image: img("1614593894937-8e84a52e5a2c"), category: "date-night", subcategory: "wrap-dress" },
    { id: "f-dat-04", label: "Skirt & Heels",      image: img("1621786030484-4c855eed6974"), category: "date-night", subcategory: "skirt-heels" },
    { id: "f-dat-05", label: "Dinner Elegant",     image: img("1592621385612-4d7129426394"), category: "date-night", subcategory: "dinner-elegant" },
    { id: "f-dat-06", label: "Playful Mini",       image: img("1634826260499-7d97a6049913"), category: "date-night", subcategory: "playful-romantic" },
    { id: "f-dat-07", label: "Off-Shoulder",       image: img("1632481151312-4b4f3306e7e6"), category: "date-night", subcategory: "off-shoulder" },
    { id: "f-dat-08", label: "Lace Detail",        image: img("1629019279055-d2a8c0c50bb3"), category: "date-night", subcategory: "lace-detail" },
    { id: "f-dat-09", label: "Soft Slip",          image: img("1567784177951-6fa58317e16b"), category: "date-night", subcategory: "soft-slip" },
    { id: "f-dat-10", label: "Pastel Set",         image: img("1605497788044-5a32c7078486"), category: "date-night", subcategory: "pastel-set" },
    { id: "f-dat-11", label: "Silk Blouse",        image: img("1573496359142-b8d87734a5a2"), category: "date-night", subcategory: "silk-blouse" },
    { id: "f-dat-12", label: "Date in Heels",      image: img("1535632787350-4e68ef0ac584"), category: "date-night", subcategory: "date-in-heels" },
  ],
  vacation: [
    { id: "f-vac-01", label: "Resort White",       image: img("1494578379344-d6c710782a3d"), category: "resort", subcategory: "resort-white" },
    { id: "f-vac-02", label: "Beach Flow",         image: img("1521223890158-f9f7c3d5d504"), category: "resort", subcategory: "beach-flow" },
    { id: "f-vac-03", label: "Linen Set",          image: img("1524504388940-b1c1722653e1"), category: "resort", subcategory: "linen-set" },
    { id: "f-vac-04", label: "Sundress",           image: img("1542295669297-4d352b042bca"), category: "resort", subcategory: "sundress" },
    { id: "f-vac-05", label: "Tropical Print",     image: img("1488426862026-3ee34a7d66df"), category: "resort", subcategory: "tropical-print" },
    { id: "f-vac-06", label: "Crochet Set",        image: img("1606902965551-dce093cda6e7"), category: "resort", subcategory: "crochet-set" },
    { id: "f-vac-07", label: "Sun Hat & Maxi",     image: img("1610276198568-eb6d0ff53e48"), category: "resort", subcategory: "sun-hat-maxi" },
    { id: "f-vac-08", label: "Boho Goddess",       image: img("1607746882042-944635dfe10e"), category: "resort", subcategory: "boho-goddess" },
    { id: "f-vac-09", label: "Sarong Wrap",        image: img("1617922001439-4a2e6562f328"), category: "resort", subcategory: "sarong-wrap" },
    { id: "f-vac-10", label: "Jet-Set Travel",     image: img("1574258495973-f010dfbb5371"), category: "resort", subcategory: "jet-set-travel" },
    { id: "f-vac-11", label: "Beach Picnic",       image: img("1572635196237-14b3f281503f"), category: "resort", subcategory: "beach-picnic" },
    { id: "f-vac-12", label: "Cabana Chic",        image: img("1577803645773-f96470509666"), category: "resort", subcategory: "cabana-chic" },
  ],
  swimwear: [
    { id: "f-swm-01", label: "String Bikini",      image: img("1570976447640-ac859d960c4b"), category: "swimwear", subcategory: "string-bikini" },
    { id: "f-swm-02", label: "High-Waist Bikini",  image: img("1611042553484-d61f84d22784"), category: "swimwear", subcategory: "high-waist-bikini" },
    { id: "f-swm-03", label: "One-Piece",          image: img("1515886657613-9f3515b0c78f"), category: "swimwear", subcategory: "one-piece" },
    { id: "f-swm-04", label: "Cut-Out Swim",       image: img("1539109136881-3be0616acf4b"), category: "swimwear", subcategory: "cutout-swim" },
    { id: "f-swm-05", label: "Tropical Print",     image: img("1606107557195-0e29a4b5b4aa"), category: "swimwear", subcategory: "tropical-print-bikini" },
    { id: "f-swm-06", label: "Coverup & Sarong",   image: img("1556306535-0f09a537f0a3"), category: "swimwear", subcategory: "swim-coverup" },
    { id: "f-swm-07", label: "Triangle Top",       image: img("1502767089025-6748d4ef9f24"), category: "swimwear", subcategory: "triangle-top" },
    { id: "f-swm-08", label: "Sporty Swim",        image: img("1611591437281-460bfbe1220a"), category: "swimwear", subcategory: "sporty-swim" },
    { id: "f-swm-09", label: "Crochet Bikini",     image: img("1581824283135-0666cf353f35"), category: "swimwear", subcategory: "crochet-bikini" },
    { id: "f-swm-10", label: "Bandeau",            image: img("1511499767150-a48a237f0083"), category: "swimwear", subcategory: "bandeau" },
    { id: "f-swm-11", label: "Wrap Bikini",        image: img("1521119989659-a83eee488004"), category: "swimwear", subcategory: "wrap-bikini" },
    { id: "f-swm-12", label: "Pool Lounge",        image: img("1512310604669-443f26c35f52"), category: "swimwear", subcategory: "pool-lounge" },
  ],
  fitness: [
    { id: "f-fit-01", label: "Yoga Set",           image: img("1571019613454-1cb2f99b2d8b"), category: "fitness", subcategory: "yoga-pants-set" },
    { id: "f-fit-02", label: "Nike 2-Piece",       image: img("1517836357463-d25dfeac3438"), category: "fitness", subcategory: "nike-2piece-women" },
    { id: "f-fit-03", label: "Pilates",            image: img("1599058917212-d750089bc07e"), category: "fitness", subcategory: "pilates-set" },
    { id: "f-fit-04", label: "Running",            image: img("1581009146145-b5ef050c2e1e"), category: "fitness", subcategory: "running-kit" },
    { id: "f-fit-05", label: "Tennis",             image: img("1574680096145-d05b474e2155"), category: "fitness", subcategory: "tennis-outfit" },
    { id: "f-fit-06", label: "Boxing",             image: img("1605296867424-35fc25c9212a"), category: "fitness", subcategory: "boxing-mma" },
    { id: "f-fit-07", label: "HIIT Set",           image: img("1583089892943-e02e5b017b6a"), category: "fitness", subcategory: "hiit-set" },
    { id: "f-fit-08", label: "Lifting Fit",        image: img("1605125571577-fdd0c52d5fef"), category: "fitness", subcategory: "lifting-fit" },
    { id: "f-fit-09", label: "Studio Pilates",     image: img("1612036782180-6f0b6cd846fe"), category: "fitness", subcategory: "studio-pilates" },
    { id: "f-fit-10", label: "Hot Girl Walk",      image: img("1591726328133-b4e2b0031cb2"), category: "fitness", subcategory: "hot-girl-walk" },
    { id: "f-fit-11", label: "Spin Class",         image: img("1631825598395-58692acfee5c"), category: "fitness", subcategory: "spin-class" },
    { id: "f-fit-12", label: "Outdoor Run",        image: img("1648671095177-d00c1f6264e9"), category: "fitness", subcategory: "outdoor-run" },
  ],
  cosplay: [
    { id: "f-cos-01", label: "Moon Guardian",      image: img("1542596594-649edbc13630"), category: "cosplay", subcategory: "magical-moon-guardian" },
    { id: "f-cos-02", label: "Magical Girl",       image: img("1607604276583-eef5d076aa5f"), category: "cosplay", subcategory: "magical-girl-wand" },
    { id: "f-cos-03", label: "Ice Queen",          image: img("1666073090334-f2a9c8a86d14"), category: "cosplay", subcategory: "ice-queen" },
    { id: "f-cos-04", label: "Amazonian Warrior",  image: img("1601933973783-43cf8a7d4c5f"), category: "cosplay", subcategory: "amazonian-warrior" },
    { id: "f-cos-05", label: "Witch Sorceress",    image: img("1595051780009-1a8f6f4fac9e"), category: "cosplay", subcategory: "witch-sorceress" },
    { id: "f-cos-06", label: "Vampire Noble",      image: img("1688633201440-73f30feb06ba"), category: "cosplay", subcategory: "vampire-noble" },
    { id: "f-cos-07", label: "Anime Schoolgirl",   image: img("1601599009979-f85c21cbd703"), category: "cosplay", subcategory: "anime-schoolgirl" },
    { id: "f-cos-08", label: "Cyber Punk",         image: img("1705486525499-1aaa9388de94"), category: "cosplay", subcategory: "cyber-punk" },
    { id: "f-cos-09", label: "Fairy Princess",     image: img("1628619447698-d17aa1899220"), category: "cosplay", subcategory: "fairy-princess" },
    { id: "f-cos-10", label: "Steampunk",          image: img("1563827517575-7d43935ca7f6"), category: "cosplay", subcategory: "steampunk" },
    { id: "f-cos-11", label: "Galaxy Heroine",     image: img("1631652367427-726f96b37cf1"), category: "cosplay", subcategory: "galaxy-heroine" },
    { id: "f-cos-12", label: "Underwater Princess",image: img("1570751057249-92751f496ee3"), category: "cosplay", subcategory: "underwater-princess" },
  ],
};

const MALE_OCCASIONS: Record<OccasionId, Vibe[]> = {
  casual: [
    { id: "m-cas-01", label: "Tee & Jeans",        image: img("1506794778202-cad84cf45f1d"), category: "casual", subcategory: "tee-and-jeans" },
    { id: "m-cas-02", label: "Henley & Chinos",    image: img("1507003211169-0a1dd7228f2d"), category: "casual", subcategory: "henley-chinos" },
    { id: "m-cas-03", label: "Hoodie Fit",         image: img("1519085360753-af0119f7cbe7"), category: "casual", subcategory: "hoodie-fit" },
    { id: "m-cas-04", label: "Athleisure",         image: img("1517836357463-d25dfeac3438"), category: "athleisure", subcategory: "training-fit" },
    { id: "m-cas-05", label: "Linen Shirt",        image: img("1488161628813-04466f872be2"), category: "casual", subcategory: "linen-shirt" },
    { id: "m-cas-06", label: "Denim Jacket",       image: img("1492447166138-50c3889fccb1"), category: "casual", subcategory: "denim-jacket" },
    { id: "m-cas-07", label: "Crewneck Stack",     image: img("1546572797-e8c933a75a1f"), category: "casual", subcategory: "crewneck-stack" },
    { id: "m-cas-08", label: "Polo & Shorts",      image: img("1542326529804-0cd9d861ebaa"), category: "casual", subcategory: "polo-shorts" },
    { id: "m-cas-09", label: "Joggers Fit",        image: img("1574680096145-d05b474e2155"), category: "casual", subcategory: "joggers-fit" },
    { id: "m-cas-10", label: "Layered Tee",        image: img("1564564321837-a57b7070ac4f"), category: "casual", subcategory: "layered-tee" },
    { id: "m-cas-11", label: "Quarter-Zip",        image: img("1585159797364-f2dfa42d79c3"), category: "casual", subcategory: "quarter-zip" },
    { id: "m-cas-12", label: "Sneaker Day",        image: img("1531746020798-e6953c6e8e04"), category: "casual", subcategory: "sneaker-day" },
  ],
  glam: [
    { id: "m-glm-01", label: "Black Silk Shirt",   image: img("1552324864-5f7f0dec9b3d"), category: "full-style", subcategory: "night-out" },
    { id: "m-glm-02", label: "Leather Jacket",     image: img("1614483573119-1e3b2be05565"), category: "edgy", subcategory: "leather-jacket-night" },
    { id: "m-glm-03", label: "Designer Fit",       image: img("1754577060078-21315dd188c8"), category: "icon-looks", subcategory: "streetwear-mogul" },
    { id: "m-glm-04", label: "Dressy Tee + Chain", image: img("1493106819501-66d381c466f1"), category: "full-style", subcategory: "dressy-tee-chain" },
    { id: "m-glm-05", label: "Monochrome Set",     image: img("1495707902641-75cac588d2e9"), category: "full-style", subcategory: "monochrome-set" },
    { id: "m-glm-06", label: "Club Fit",           image: img("1547949003-9792a18a2601"), category: "full-style", subcategory: "club-fit" },
    { id: "m-glm-07", label: "Velvet Blazer",      image: img("1768935706759-f2be765b3aec"), category: "full-style", subcategory: "velvet-blazer" },
    { id: "m-glm-08", label: "Satin Shirt",        image: img("1658250365092-7d24166eb605"), category: "full-style", subcategory: "satin-shirt" },
    { id: "m-glm-09", label: "Statement Coat",     image: img("1582727476685-9813d181cf75"), category: "full-style", subcategory: "statement-coat" },
    { id: "m-glm-10", label: "Tailored Drama",     image: img("1763906802570-be2a2609757f"), category: "full-style", subcategory: "tailored-drama" },
    { id: "m-glm-11", label: "All Black Night",    image: img("1483721310020-03333e577078"), category: "edgy", subcategory: "all-black-night-m" },
    { id: "m-glm-12", label: "Luxe Layers",        image: img("1493666438817-866a91353ca9"), category: "full-style", subcategory: "luxe-layers" },
  ],
  formal: [
    { id: "m-fml-01", label: "Navy Suit",          image: img("1552058544-f2b08422138a"), category: "formal", subcategory: "navy-suit" },
    { id: "m-fml-02", label: "Charcoal Suit",      image: img("1539109136881-3be0616acf4b"), category: "formal", subcategory: "charcoal-suit" },
    { id: "m-fml-03", label: "Blazer & Chinos",    image: img("1518310383802-640c2de311b6"), category: "formal", subcategory: "blazer-chinos" },
    { id: "m-fml-04", label: "Shirt & Tie",        image: img("1571019613454-1cb2f99b2d8b"), category: "formal", subcategory: "shirt-tie" },
    { id: "m-fml-05", label: "Three Piece",        image: img("1500648767791-00dcc994a43e"), category: "formal", subcategory: "three-piece" },
    { id: "m-fml-06", label: "Smart Casual",       image: img("1532009877282-3340270e0529"), category: "full-style", subcategory: "smart-casual" },
    { id: "m-fml-07", label: "Power Boss",         image: img("1571019614242-c5c5dee9f50b"), category: "formal", subcategory: "power-boss" },
    { id: "m-fml-08", label: "Tan Suit",           image: img("1567013127542-490d757e51fc"), category: "formal", subcategory: "tan-suit" },
    { id: "m-fml-09", label: "Double Breasted",    image: img("1583500178690-f7fd39c44a66"), category: "formal", subcategory: "double-breasted" },
    { id: "m-fml-10", label: "Linen Blazer",       image: img("1542291026-7eec264c27ff"), category: "formal", subcategory: "linen-blazer" },
    { id: "m-fml-11", label: "Tuxedo",             image: img("1543163521-1bf539c55dd2"), category: "tuxedos", subcategory: "classic-tuxedo" },
    { id: "m-fml-12", label: "Modern Suit",        image: img("1595950653106-6c9ebd614d3a"), category: "formal", subcategory: "modern-suit" },
  ],
  streetwear: [
    { id: "m-str-01", label: "Japanese Street",    image: img("1599058917212-d750089bc07e"), category: "streetwear", subcategory: "japanese-street" },
    { id: "m-str-02", label: "Techwear",           image: img("1581009146145-b5ef050c2e1e"), category: "techwear", subcategory: "techwear-base" },
    { id: "m-str-03", label: "Hypebeast",          image: img("1606107557195-0e29a4b5b4aa"), category: "streetwear", subcategory: "hypebeast" },
    { id: "m-str-04", label: "Skater",             image: img("1551107696-a4b0c5a0d9a2"), category: "streetwear", subcategory: "skater" },
    { id: "m-str-05", label: "Cargo Fit",          image: img("1549298916-b41d501d3772"), category: "streetwear", subcategory: "cargo-fit" },
    { id: "m-str-06", label: "Hip-Hop",            image: img("1600185365778-7886d2c3a76e"), category: "urban-hiphop", subcategory: "classic-hiphop" },
    { id: "m-str-07", label: "Drip God",           image: img("1525966222134-fcfa99b8ae77"), category: "streetwear", subcategory: "drip-god" },
    { id: "m-str-08", label: "Korean Street",      image: img("1686350751255-20a12bbe4880"), category: "streetwear", subcategory: "korean-street-m" },
    { id: "m-str-09", label: "Oversized Drape",    image: img("1686350751264-1d3f6e41a6e6"), category: "streetwear", subcategory: "oversized-drape" },
    { id: "m-str-10", label: "Sneakerhead",        image: img("1721152839659-dabbacabd5d6"), category: "streetwear", subcategory: "sneakerhead-m" },
    { id: "m-str-11", label: "Y2K Street",         image: img("1770576934845-759db89fcd3f"), category: "streetwear", subcategory: "y2k-street-m" },
    { id: "m-str-12", label: "Bomber Drip",        image: img("1770821214788-6605c5c3075b"), category: "streetwear", subcategory: "bomber-drip" },
  ],
  "date-night": [
    { id: "m-dat-01", label: "Shirt & Trousers",   image: img("1761498443962-1f00eed12137"), category: "date-night", subcategory: "shirt-trousers" },
    { id: "m-dat-02", label: "Knit & Jeans",       image: img("1686350751240-348d2ca05025"), category: "date-night", subcategory: "knit-and-jeans" },
    { id: "m-dat-03", label: "Blazer & Tee",       image: img("1630084775816-7abb7383ded5"), category: "date-night", subcategory: "blazer-tee" },
    { id: "m-dat-04", label: "Leather Clean",      image: img("1542838132-92c53300491e"), category: "date-night", subcategory: "leather-clean" },
    { id: "m-dat-05", label: "All Black",          image: img("1522337360788-8b13dee7a37e"), category: "date-night", subcategory: "all-black" },
    { id: "m-dat-06", label: "Smart Romantic",     image: img("1521369909029-2afed882baee"), category: "date-night", subcategory: "smart-romantic" },
    { id: "m-dat-07", label: "Cardigan Layer",     image: img("1584917865442-de89df76afd3"), category: "date-night", subcategory: "cardigan-layer" },
    { id: "m-dat-08", label: "White Linen Date",   image: img("1591561954557-26941169b49e"), category: "date-night", subcategory: "white-linen-date" },
    { id: "m-dat-09", label: "Turtleneck Style",   image: img("1492562080023-ab3db95bfbce"), category: "date-night", subcategory: "turtleneck-style" },
    { id: "m-dat-10", label: "Elevated Casual",    image: img("1502720433255-614171a1835e"), category: "date-night", subcategory: "elevated-casual" },
    { id: "m-dat-11", label: "Dinner Sharp",       image: img("1530268729831-4b0b9e170218"), category: "date-night", subcategory: "dinner-sharp" },
    { id: "m-dat-12", label: "Boyfriend Fit",      image: img("1532910404247-7ee9488d7292"), category: "date-night", subcategory: "boyfriend-fit" },
  ],
  vacation: [
    { id: "m-vac-01", label: "Linen Shirt",        image: img("1531123897727-8f129e1688ce"), category: "resort", subcategory: "linen-shirt" },
    { id: "m-vac-02", label: "Tropical Shirt",     image: img("1555529669-e69e7aa0ba9a"), category: "resort", subcategory: "tropical-print" },
    { id: "m-vac-03", label: "Shorts & Tee",       image: img("1593032465175-481ac7f401a0"), category: "resort", subcategory: "shorts-tee" },
    { id: "m-vac-04", label: "Linen Set",          image: img("1495707902641-75cac588d2e9"), category: "resort", subcategory: "linen-set" },
    { id: "m-vac-05", label: "Resort Elegant",     image: img("1507591064344-4c6ce005b128"), category: "resort", subcategory: "resort-elegant" },
    { id: "m-vac-06", label: "Beach Linen",        image: img("1542295669297-4d352b042bca"), category: "resort", subcategory: "beach-linen" },
    { id: "m-vac-07", label: "Cabana Cool",        image: img("1604004215695-c54b6f3df1e7"), category: "resort", subcategory: "cabana-cool" },
    { id: "m-vac-08", label: "Boat Day",           image: img("1612036782180-6f0b6cd846fe"), category: "resort", subcategory: "boat-day" },
    { id: "m-vac-09", label: "Island Fit",         image: img("1542596594-649edbc13630"), category: "resort", subcategory: "island-fit" },
    { id: "m-vac-10", label: "Sunset Stroll",      image: img("1607604276583-eef5d076aa5f"), category: "resort", subcategory: "sunset-stroll" },
    { id: "m-vac-11", label: "Travel Fit",         image: img("1605125571577-fdd0c52d5fef"), category: "resort", subcategory: "travel-fit" },
    { id: "m-vac-12", label: "Pool Lounge",        image: img("1601933973783-43cf8a7d4c5f"), category: "resort", subcategory: "pool-lounge-m" },
  ],
  swimwear: [
    { id: "m-swm-01", label: "Classic Trunks",     image: img("1583089892943-e02e5b017b6a"), category: "swimwear", subcategory: "swim-shorts" },
    { id: "m-swm-02", label: "Board Shorts",       image: img("1605296867424-35fc25c9212a"), category: "swimwear", subcategory: "board-shorts" },
    { id: "m-swm-03", label: "Tailored Swim",      image: img("1567013127542-490d757e51fc"), category: "swimwear", subcategory: "tailored-swim" },
    { id: "m-swm-04", label: "Tropical Trunks",    image: img("1532009877282-3340270e0529"), category: "swimwear", subcategory: "tropical-trunks" },
    { id: "m-swm-05", label: "Linen Shirt Combo",  image: img("1583500178690-f7fd39c44a66"), category: "swimwear", subcategory: "swim-linen-combo" },
    { id: "m-swm-06", label: "Speedo Brief",       image: img("1571019614242-c5c5dee9f50b"), category: "swimwear", subcategory: "speedo-brief" },
    { id: "m-swm-07", label: "Beach Volley",       image: img("1500648767791-00dcc994a43e"), category: "swimwear", subcategory: "beach-volley" },
    { id: "m-swm-08", label: "Surf Fit",           image: img("1495707902641-75cac588d2e9"), category: "swimwear", subcategory: "surf-fit" },
    { id: "m-swm-09", label: "Pool Lounger",       image: img("1493666438817-866a91353ca9"), category: "swimwear", subcategory: "pool-lounger" },
    { id: "m-swm-10", label: "Retro Trunks",       image: img("1547949003-9792a18a2601"), category: "swimwear", subcategory: "retro-trunks" },
    { id: "m-swm-11", label: "Athletic Swim",      image: img("1521119989659-a83eee488004"), category: "swimwear", subcategory: "athletic-swim" },
    { id: "m-swm-12", label: "Vacay Trunks",       image: img("1593032465175-481ac7f401a0"), category: "swimwear", subcategory: "vacay-trunks" },
  ],
  fitness: [
    { id: "m-fit-01", label: "Nike 2-Piece",       image: img("1551836022-deb4988cc6c0"), category: "fitness", subcategory: "nike-2piece-men" },
    { id: "m-fit-02", label: "Lifting Fit",        image: img("1502323777036-f29e3972d82f"), category: "fitness", subcategory: "gym-lifting" },
    { id: "m-fit-03", label: "Running",            image: img("1572635196237-14b3f281503f"), category: "fitness", subcategory: "running-kit" },
    { id: "m-fit-04", label: "CrossFit",           image: img("1573408301185-9146fe634ad0"), category: "fitness", subcategory: "crossfit-fit" },
    { id: "m-fit-05", label: "Boxing / MMA",       image: img("1535632787350-4e68ef0ac584"), category: "fitness", subcategory: "boxing-mma" },
    { id: "m-fit-06", label: "Hiking",             image: img("1574258495973-f010dfbb5371"), category: "fitness", subcategory: "outdoor-hiking" },
    { id: "m-fit-07", label: "Basketball",         image: img("1577803645773-f96470509666"), category: "fitness", subcategory: "basketball" },
    { id: "m-fit-08", label: "Soccer Kit",         image: img("1502767089025-6748d4ef9f24"), category: "fitness", subcategory: "soccer-kit" },
    { id: "m-fit-09", label: "Tennis",             image: img("1556306535-0f09a537f0a3"), category: "fitness", subcategory: "tennis-m" },
    { id: "m-fit-10", label: "Cycling",            image: img("1511499767150-a48a237f0083"), category: "fitness", subcategory: "cycling-kit" },
    { id: "m-fit-11", label: "Yoga Flow",          image: img("1512310604669-443f26c35f52"), category: "fitness", subcategory: "yoga-flow-m" },
    { id: "m-fit-12", label: "Trail Run",          image: img("1503236823255-94609f598e71"), category: "fitness", subcategory: "trail-run" },
  ],
  cosplay: [
    { id: "m-cos-01", label: "Saiyan Warrior",     image: img("1641427493563-5cc9cf1a9950"), category: "cosplay", subcategory: "saiyan-warrior" },
    { id: "m-cos-02", label: "Ninja Shinobi",      image: img("1634826260499-7d97a6049913"), category: "cosplay", subcategory: "ninja-shinobi" },
    { id: "m-cos-03", label: "Demon Slayer",       image: img("1711925844152-8c9d51163ba2"), category: "cosplay", subcategory: "demon-slayer-warrior" },
    { id: "m-cos-04", label: "Hylian Hero",        image: img("1620063633168-8ec1bcc1bcec"), category: "cosplay", subcategory: "hylian-hero" },
    { id: "m-cos-05", label: "Web Slinger",        image: img("1622495966321-49b35b3a8d4f"), category: "cosplay", subcategory: "web-slinger" },
    { id: "m-cos-06", label: "Dark Vigilante",     image: img("1602910344008-22f323cc1817"), category: "cosplay", subcategory: "dark-knight-vigilante" },
    { id: "m-cos-07", label: "Space Marine",       image: img("1517438476312-10d79c5f25e3"), category: "cosplay", subcategory: "space-marine" },
    { id: "m-cos-08", label: "Pirate Captain",     image: img("1571908599407-cdb918ed83bf"), category: "cosplay", subcategory: "pirate-captain" },
    { id: "m-cos-09", label: "Wizard Mage",        image: img("1632481151312-4b4f3306e7e6"), category: "cosplay", subcategory: "wizard-mage" },
    { id: "m-cos-10", label: "Cyber Soldier",      image: img("1629019279055-d2a8c0c50bb3"), category: "cosplay", subcategory: "cyber-soldier" },
    { id: "m-cos-11", label: "Vampire Lord",       image: img("1605497788044-5a32c7078486"), category: "cosplay", subcategory: "vampire-lord" },
    { id: "m-cos-12", label: "Samurai",            image: img("1617922001439-4a2e6562f328"), category: "cosplay", subcategory: "samurai" },
  ],
};

// Dev-time uniqueness assertion — guarantees no photo repeats within a gender bank.
if (import.meta.env.DEV) {
  for (const bank of [FEMALE_OCCASIONS, MALE_OCCASIONS] as const) {
    const seen = new Map<string, string>();
    for (const [occId, vibes] of Object.entries(bank)) {
      for (const v of vibes) {
        if (seen.has(v.image)) {
          // eslint-disable-next-line no-console
          console.warn(`[OccasionPicker] duplicate photo across ${seen.get(v.image)} and ${occId}: ${v.image}`);
        } else {
          seen.set(v.image, occId);
        }
      }
    }
  }
}

const OCCASION_META: Array<{ id: OccasionId; label: string; desc: string; Icon: LucideIcon }> = [
  { id: "casual",     label: "Casual",          desc: "Effortless everyday looks",        Icon: Coffee },
  { id: "glam",       label: "Glam · Night Out",desc: "Bold, sparkly, unforgettable",     Icon: Sparkles },
  { id: "formal",     label: "Formal · Work",   desc: "Polished, powerful, professional", Icon: Briefcase },
  { id: "streetwear", label: "Streetwear",      desc: "Urban, layered, statement-making", Icon: Flame },
  { id: "date-night", label: "Date Night",      desc: "Romantic, confident, magnetic",    Icon: Heart },
  { id: "vacation",   label: "Vacation",        desc: "Resort, beach, travel-ready",      Icon: Palmtree },
  { id: "swimwear",   label: "Swimwear",        desc: "Bikinis, one-pieces, poolside",    Icon: Waves },
  { id: "fitness",    label: "Fitness",         desc: "Gym, run, yoga, sport-ready",      Icon: Dumbbell },
  { id: "cosplay",    label: "Cosplay",         desc: "Become the character",             Icon: Star },
];

const OCCASIONS: Occasion[] = OCCASION_META.map(meta => ({
  ...meta,
  vibes: { female: FEMALE_OCCASIONS[meta.id], male: MALE_OCCASIONS[meta.id] },
}));

const OccasionPickerScreen = ({ gender, onBack, onNext }: Props) => {
  const [stage, setStage] = useState<"occasion" | "vibe">("occasion");
  const [selected, setSelected] = useState<Occasion | null>(null);
  const isMale = gender === "male";
  const accent = isMale ? "--glamora-gold" : "--glamora-rose-dark";
  const vibeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === "vibe" && vibeRef.current) {
      vibeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stage]);

  const handleOccasion = (o: Occasion) => {
    setSelected(o);
    setTimeout(() => setStage("vibe"), 180);
  };

  const handleVibe = (v: Vibe) => {
    onNext(v.category, v.subcategory, v.label);
  };

  return (
    <div className="screen" style={{ paddingBottom: 120 }}>
      <div className="screen-header">
        <button
          className="back-btn"
          onClick={() => (stage === "vibe" ? setStage("occasion") : onBack())}
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="header-title">
            {stage === "occasion" ? "What's the occasion?" : "Pick your vibe"}
          </div>
          <div className="header-sub">
            {stage === "occasion"
              ? "Tap one to see vibes"
              : selected?.label}
          </div>
        </div>
      </div>

      <FlowStepper current="style" gender={gender} />

      {stage === "occasion" && (
        <div
          className="anim-fadeUp"
          style={{
            padding: "16px 22px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {OCCASIONS.map((o, i) => {
            const isSel = selected?.id === o.id;
            return (
              <button
                key={o.id}
                onClick={() => handleOccasion(o)}
                className="anim-fadeUp"
                style={{
                  animationDelay: `${i * 60}ms`,
                  padding: "20px 14px",
                  borderRadius: 22,
                  border: `1.5px solid ${isSel ? `hsl(var(${accent}))` : "hsla(0 0% 100% / 0.08)"}`,
                  background: isSel
                    ? `linear-gradient(135deg, hsla(var(${accent}) / 0.18), hsla(var(--glamora-gold) / 0.08))`
                    : "hsl(var(--card))",
                  boxShadow: isSel
                    ? `0 0 24px hsla(var(${accent}) / 0.35), 0 4px 20px hsla(0 0% 0% / 0.3)`
                    : "0 2px 14px hsla(0 0% 0% / 0.22)",
                  color: "hsl(var(--glamora-char))",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  textAlign: "left",
                  minHeight: 130,
                  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `linear-gradient(135deg, hsl(var(${accent})), hsl(var(--glamora-gold-light)))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <o.Icon size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 500, lineHeight: 1.15 }}>
                    {o.label}
                  </div>
                  <div style={{ fontSize: 11.5, color: "hsl(var(--glamora-gray))", marginTop: 4, lineHeight: 1.35 }}>
                    {o.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {stage === "vibe" && selected && (
        <div ref={vibeRef} className="anim-fadeUp" style={{ padding: "16px 18px 40px" }}>
          <div className="section-label" style={{ marginBottom: 10, paddingLeft: 4 }}>
            Tap the vibe that speaks to you · {selected.vibes[gender].length} looks
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}
          >
            {selected.vibes[gender].map((v, i) => (
              <button
                key={v.id}
                onClick={() => handleVibe(v)}
                className="anim-scaleIn"
                style={{
                  animationDelay: `${i * 40}ms`,
                  position: "relative",
                  padding: 0,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid hsla(0 0% 100% / 0.06)",
                  background: "hsl(var(--card))",
                  cursor: "pointer",
                  aspectRatio: "3/4",
                  boxShadow: "0 4px 14px hsla(0 0% 0% / 0.32)",
                }}
              >
                <img
                  src={v.image}
                  alt={v.label}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "center top",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, transparent 50%, hsla(0 0% 0% / 0.82) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute", left: 8, right: 8, bottom: 7,
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4,
                    color: "white", fontWeight: 600, fontSize: 11,
                    fontFamily: "'Jost', sans-serif",
                  }}
                >
                  <span style={{
                    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{v.label}</span>
                  <span
                    style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: `hsl(var(${accent}))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 8px hsla(var(${accent}) / 0.6)`,
                      flexShrink: 0,
                    }}
                  >
                    <Check size={10} color="white" strokeWidth={3} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OccasionPickerScreen;
