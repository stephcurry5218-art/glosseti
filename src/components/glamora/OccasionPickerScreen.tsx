import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Coffee, Sparkles, Briefcase, Flame, Heart, Palmtree, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StyleCategory, Gender } from "./GlamoraApp";
import FlowStepper from "./FlowStepper";

interface Props {
  gender: Gender;
  onBack: () => void;
  onNext: (category: StyleCategory, subcategory: string, vibeLabel: string) => void;
}

type OccasionId = "casual" | "glam" | "formal" | "streetwear" | "date-night" | "vacation";

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

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&q=78`;

const OCCASIONS: Occasion[] = [
  {
    id: "casual",
    label: "Casual",
    desc: "Effortless everyday looks",
    Icon: Coffee,
    vibes: {
      female: [
        { id: "clean-girl", label: "Clean Girl", image: img("1496747611176-843222e1e57c"), category: "casual", subcategory: "clean-girl-aesthetic" },
        { id: "denim-tee", label: "Denim & Tee", image: img("1483985988355-763728e1935b"), category: "casual", subcategory: "denim-and-tee" },
        { id: "soft-knit", label: "Soft Knits", image: img("1469334031218-e382a71b716b"), category: "casual", subcategory: "soft-knits" },
        { id: "athleisure", label: "Athleisure", image: img("1518310383802-640c2de311b6"), category: "athleisure", subcategory: "matching-set" },
        { id: "weekend-cozy", label: "Weekend Cozy", image: img("1490481651871-ab68de25d43d"), category: "casual", subcategory: "weekend-cozy" },
        { id: "linen-summer", label: "Linen Summer", image: img("1485518882345-15568b007407"), category: "casual", subcategory: "linen-summer" },
      ],
      male: [
        { id: "tshirt-jeans", label: "Tee & Jeans", image: img("1506794778202-cad84cf45f1d"), category: "casual", subcategory: "tee-and-jeans" },
        { id: "henley-chinos", label: "Henley & Chinos", image: img("1507003211169-0a1dd7228f2d"), category: "casual", subcategory: "henley-chinos" },
        { id: "hoodie-fit", label: "Hoodie Fit", image: img("1519085360753-af0119f7cbe7"), category: "casual", subcategory: "hoodie-fit" },
        { id: "athleisure-m", label: "Athleisure", image: img("1517836357463-d25dfeac3438"), category: "athleisure", subcategory: "training-fit" },
        { id: "linen-shirt", label: "Linen Shirt", image: img("1488161628813-04466f872be2"), category: "casual", subcategory: "linen-shirt" },
        { id: "denim-jacket", label: "Denim Jacket", image: img("1492447166138-50c3889fccb1"), category: "casual", subcategory: "denim-jacket" },
      ],
    },
  },
  {
    id: "glam",
    label: "Glam · Night Out",
    desc: "Bold, sparkly, unforgettable",
    Icon: Sparkles,
    vibes: {
      female: [
        { id: "sequins", label: "Sequin Mini", image: img("1539109136881-3be0616acf4b"), category: "full-style", subcategory: "night-out" },
        { id: "satin-slip", label: "Satin Slip", image: img("1566174053879-31528523f8ae"), category: "full-style", subcategory: "satin-slip" },
        { id: "bodycon", label: "Bodycon", image: img("1571513722275-4b41940f54b8"), category: "sexy", subcategory: "bodycon-night" },
        { id: "leather-pants", label: "Leather Pants", image: img("1483985988355-763728e1935b"), category: "edgy", subcategory: "leather-night" },
        { id: "metallic", label: "Metallic", image: img("1539109136881-3be0616acf4b"), category: "full-style", subcategory: "metallic-shine" },
        { id: "all-black", label: "All Black", image: img("1483985988355-763728e1935b"), category: "edgy", subcategory: "all-black-night" },
      ],
      male: [
        { id: "black-shirt", label: "Black Silk Shirt", image: img("1488161628813-04466f872be2"), category: "full-style", subcategory: "night-out" },
        { id: "leather-jacket", label: "Leather Jacket", image: img("1519085360753-af0119f7cbe7"), category: "edgy", subcategory: "leather-jacket-night" },
        { id: "designer-fit", label: "Designer Fit", image: img("1492447166138-50c3889fccb1"), category: "icon-looks", subcategory: "streetwear-mogul" },
        { id: "dressy-tee", label: "Dressy Tee + Chain", image: img("1507003211169-0a1dd7228f2d"), category: "full-style", subcategory: "dressy-tee-chain" },
        { id: "monochrome", label: "Monochrome", image: img("1506794778202-cad84cf45f1d"), category: "full-style", subcategory: "monochrome-set" },
        { id: "club-fit", label: "Club Fit", image: img("1488161628813-04466f872be2"), category: "full-style", subcategory: "night-out" },
      ],
    },
  },
  {
    id: "formal",
    label: "Formal · Work",
    desc: "Polished, powerful, professional",
    Icon: Briefcase,
    vibes: {
      female: [
        { id: "power-suit", label: "Power Suit", image: img("1487412720507-e7ab37603c6f"), category: "formal", subcategory: "power-suit" },
        { id: "midi-blazer", label: "Midi & Blazer", image: img("1581044777550-4cfa60707c03"), category: "formal", subcategory: "midi-and-blazer" },
        { id: "office-chic", label: "Office Chic", image: img("1551836022-deb4988cc6c0"), category: "formal", subcategory: "office-chic" },
        { id: "trousers-silk", label: "Trousers & Silk", image: img("1483985988355-763728e1935b"), category: "formal", subcategory: "trousers-silk" },
        { id: "tailored-dress", label: "Tailored Dress", image: img("1566174053879-31528523f8ae"), category: "formal", subcategory: "tailored-dress" },
        { id: "minimalist-work", label: "Minimal Work", image: img("1496747611176-843222e1e57c"), category: "minimalist", subcategory: "minimal-work" },
      ],
      male: [
        { id: "navy-suit", label: "Navy Suit", image: img("1507003211169-0a1dd7228f2d"), category: "formal", subcategory: "navy-suit" },
        { id: "charcoal-suit", label: "Charcoal Suit", image: img("1488161628813-04466f872be2"), category: "formal", subcategory: "charcoal-suit" },
        { id: "blazer-chinos", label: "Blazer & Chinos", image: img("1492447166138-50c3889fccb1"), category: "formal", subcategory: "blazer-chinos" },
        { id: "shirt-tie", label: "Shirt & Tie", image: img("1519085360753-af0119f7cbe7"), category: "formal", subcategory: "shirt-tie" },
        { id: "three-piece", label: "Three Piece", image: img("1506794778202-cad84cf45f1d"), category: "formal", subcategory: "three-piece" },
        { id: "smart-casual-m", label: "Smart Casual", image: img("1500648767791-00dcc994a43e"), category: "full-style", subcategory: "smart-casual" },
      ],
    },
  },
  {
    id: "streetwear",
    label: "Streetwear",
    desc: "Urban, layered, statement-making",
    Icon: Flame,
    vibes: {
      female: [
        { id: "cargo-crop", label: "Cargo & Crop", image: img("1490481651871-ab68de25d43d"), category: "streetwear", subcategory: "cargo-crop" },
        { id: "oversized-tee", label: "Oversized Tee", image: img("1485518882345-15568b007407"), category: "streetwear", subcategory: "oversized-tee" },
        { id: "y2k", label: "Y2K Revival", image: img("1469334031218-e382a71b716b"), category: "y2k", subcategory: "y2k-revival" },
        { id: "techwear-f", label: "Techwear", image: img("1483985988355-763728e1935b"), category: "techwear", subcategory: "techwear-base" },
        { id: "skater", label: "Skater Girl", image: img("1518310383802-640c2de311b6"), category: "streetwear", subcategory: "skater" },
        { id: "japanese-street-f", label: "Japanese Street", image: img("1496747611176-843222e1e57c"), category: "streetwear", subcategory: "japanese-street" },
      ],
      male: [
        { id: "japanese-street", label: "Japanese Street", image: img("1519085360753-af0119f7cbe7"), category: "streetwear", subcategory: "japanese-street" },
        { id: "techwear", label: "Techwear", image: img("1488161628813-04466f872be2"), category: "techwear", subcategory: "techwear-base" },
        { id: "hypebeast", label: "Hypebeast", image: img("1492447166138-50c3889fccb1"), category: "streetwear", subcategory: "hypebeast" },
        { id: "skater-m", label: "Skater", image: img("1500648767791-00dcc994a43e"), category: "streetwear", subcategory: "skater" },
        { id: "cargo-fit", label: "Cargo Fit", image: img("1506794778202-cad84cf45f1d"), category: "streetwear", subcategory: "cargo-fit" },
        { id: "hiphop", label: "Hip-Hop", image: img("1507003211169-0a1dd7228f2d"), category: "urban-hiphop", subcategory: "classic-hiphop" },
      ],
    },
  },
  {
    id: "date-night",
    label: "Date Night",
    desc: "Romantic, confident, magnetic",
    Icon: Heart,
    vibes: {
      female: [
        { id: "little-red", label: "Little Red Dress", image: img("1539109136881-3be0616acf4b"), category: "date-night", subcategory: "little-red-dress" },
        { id: "soft-romantic", label: "Soft Romantic", image: img("1566174053879-31528523f8ae"), category: "date-night", subcategory: "soft-romantic" },
        { id: "wrap-dress", label: "Wrap Dress", image: img("1483985988355-763728e1935b"), category: "date-night", subcategory: "wrap-dress" },
        { id: "skirt-heels", label: "Skirt & Heels", image: img("1571513722275-4b41940f54b8"), category: "date-night", subcategory: "skirt-heels" },
        { id: "dinner-elegant", label: "Dinner Elegant", image: img("1496747611176-843222e1e57c"), category: "date-night", subcategory: "dinner-elegant" },
        { id: "playful-romantic", label: "Playful", image: img("1469334031218-e382a71b716b"), category: "date-night", subcategory: "playful-romantic" },
      ],
      male: [
        { id: "shirt-trousers", label: "Shirt & Trousers", image: img("1488161628813-04466f872be2"), category: "date-night", subcategory: "shirt-trousers" },
        { id: "knit-jeans", label: "Knit & Jeans", image: img("1507003211169-0a1dd7228f2d"), category: "date-night", subcategory: "knit-and-jeans" },
        { id: "blazer-tee", label: "Blazer & Tee", image: img("1492447166138-50c3889fccb1"), category: "date-night", subcategory: "blazer-tee" },
        { id: "leather-clean", label: "Leather Clean", image: img("1519085360753-af0119f7cbe7"), category: "date-night", subcategory: "leather-clean" },
        { id: "all-black-m", label: "All Black", image: img("1506794778202-cad84cf45f1d"), category: "date-night", subcategory: "all-black" },
        { id: "smart-romantic", label: "Smart Romantic", image: img("1500648767791-00dcc994a43e"), category: "date-night", subcategory: "smart-romantic" },
      ],
    },
  },
  {
    id: "vacation",
    label: "Vacation",
    desc: "Resort, beach, travel-ready",
    Icon: Palmtree,
    vibes: {
      female: [
        { id: "resort-white", label: "Resort White", image: img("1485518882345-15568b007407"), category: "resort", subcategory: "resort-white" },
        { id: "beach-flow", label: "Beach Flow", image: img("1490481651871-ab68de25d43d"), category: "resort", subcategory: "beach-flow" },
        { id: "swim-coverup", label: "Swim & Coverup", image: img("1518310383802-640c2de311b6"), category: "swimwear", subcategory: "swim-coverup" },
        { id: "linen-set", label: "Linen Set", image: img("1469334031218-e382a71b716b"), category: "resort", subcategory: "linen-set" },
        { id: "sundress", label: "Sundress", image: img("1483985988355-763728e1935b"), category: "resort", subcategory: "sundress" },
        { id: "tropical-print", label: "Tropical Print", image: img("1496747611176-843222e1e57c"), category: "resort", subcategory: "tropical-print" },
      ],
      male: [
        { id: "linen-shirt-m", label: "Linen Shirt", image: img("1488161628813-04466f872be2"), category: "resort", subcategory: "linen-shirt" },
        { id: "swim-shorts", label: "Swim Shorts", image: img("1507003211169-0a1dd7228f2d"), category: "swimwear", subcategory: "swim-shorts" },
        { id: "tropical-shirt", label: "Tropical Shirt", image: img("1492447166138-50c3889fccb1"), category: "resort", subcategory: "tropical-print" },
        { id: "shorts-tee", label: "Shorts & Tee", image: img("1519085360753-af0119f7cbe7"), category: "resort", subcategory: "shorts-tee" },
        { id: "linen-set-m", label: "Linen Set", image: img("1506794778202-cad84cf45f1d"), category: "resort", subcategory: "linen-set" },
        { id: "resort-elegant", label: "Resort Elegant", image: img("1500648767791-00dcc994a43e"), category: "resort", subcategory: "resort-elegant" },
      ],
    },
  },
];

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
        <div ref={vibeRef} className="anim-fadeUp" style={{ padding: "16px 22px 40px" }}>
          <div className="section-label" style={{ marginBottom: 10 }}>
            Tap the vibe that speaks to you
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {selected.vibes[gender].map((v, i) => (
              <button
                key={v.id}
                onClick={() => handleVibe(v)}
                className="anim-scaleIn"
                style={{
                  animationDelay: `${i * 55}ms`,
                  position: "relative",
                  padding: 0,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1.5px solid hsla(0 0% 100% / 0.08)",
                  background: "hsl(var(--card))",
                  cursor: "pointer",
                  aspectRatio: "3/4",
                  boxShadow: "0 4px 18px hsla(0 0% 0% / 0.32)",
                }}
              >
                <img
                  src={v.image}
                  alt={v.label}
                  loading="lazy"
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(180deg, transparent 45%, hsla(0 0% 0% / 0.78) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute", left: 12, right: 12, bottom: 10,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    color: "white", fontWeight: 600, fontSize: 13,
                    fontFamily: "'Jost', sans-serif",
                  }}
                >
                  <span style={{ textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{v.label}</span>
                  <span
                    style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: `hsl(var(${accent}))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: `0 0 12px hsla(var(${accent}) / 0.6)`,
                    }}
                  >
                    <Check size={13} color="white" strokeWidth={3} />
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
