import { useState } from "react";
import { Shirt, Flame, Heart, Clock, Dumbbell, Briefcase, Smile, Palette, Check, ArrowRight, Gem, GraduationCap, Zap, Umbrella, Scissors } from "lucide-react";
import type { StyleCategory } from "./GlamoraApp";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: { styleCategory: StyleCategory; gender: "male" | "female" };
  onBack: () => void;
  onNext: (category: StyleCategory) => void;
}

const categories: { id: StyleCategory; label: string; Icon: LucideIcon; desc: string; includes: string[]; genderLabel?: { male: string; female: string } }[] = [
  {
    id: "full-style", label: "Full Style", Icon: Shirt,
    desc: "Complete head-to-toe outfit with accessories, shoes, and grooming",
    includes: ["Tops & Layers", "Bottoms", "Shoes & Socks", "Watches & Jewelry", "Bags"],
  },
  {
    id: "streetwear", label: "Streetwear", Icon: Flame,
    desc: "Urban-inspired looks with sneakers, hoodies, and statement pieces",
    includes: ["Graphic Tees & Hoodies", "Cargos & Baggy Jeans", "Sneakers & Boots", "Caps & Chains"],
  },
  {
    id: "minimalist", label: "Minimalist", Icon: Heart,
    desc: "Clean, intentional, timeless — quality over quantity",
    includes: ["Essential Tees & Knits", "Tailored Trousers", "Clean Sneakers", "Minimal Watches"],
  },
  {
    id: "vintage", label: "Vintage / Retro", Icon: Clock,
    desc: "60s mod, 70s boho, 90s grunge — pull from the best eras",
    includes: ["Printed Shirts", "Flare Jeans", "Platform Shoes", "Retro Sunglasses"],
  },
  {
    id: "athleisure", label: "Athleisure", Icon: Dumbbell,
    desc: "Gym-to-street style — performance fabrics meet fashion",
    includes: ["Performance Tees", "Joggers & Shorts", "Running Sneakers", "Smart Watches"],
  },
  {
    id: "formal", label: "Formal / Business", Icon: Briefcase,
    desc: "Professional and elegant looks for work and events",
    includes: ["Suits & Blazers", "Dress Shirts", "Dress Shoes", "Ties & Cufflinks"],
  },
  {
    id: "casual", label: "Casual Everyday", Icon: Smile,
    desc: "Effortless daily outfits that look put-together",
    includes: ["Tees & Knits", "Jeans & Chinos", "Sneakers & Loafers"],
  },
  {
    id: "bohemian", label: "Bohemian", Icon: Gem,
    desc: "Free-spirited, earthy, layered textures and flowing silhouettes",
    includes: ["Flowy Tops", "Wide-Leg Pants", "Sandals & Boots", "Layered Jewelry"],
  },
  {
    id: "preppy", label: "Preppy / Classic", Icon: GraduationCap,
    desc: "Ivy League polish — blazers, loafers, clean patterns",
    includes: ["Polo Shirts & Oxfords", "Chinos & Pleated Trousers", "Loafers & Boat Shoes", "Belts & Watches"],
  },
  {
    id: "edgy", label: "Edgy / Punk", Icon: Zap,
    desc: "Leather, studs, dark tones — rebellious and bold",
    includes: ["Leather Jackets", "Ripped Denim", "Combat Boots", "Chain Accessories"],
  },
  {
    id: "resort", label: "Resort / Vacation", Icon: Umbrella,
    desc: "Relaxed luxury for beach, travel, and warm-weather vibes",
    includes: ["Linen Shirts", "Swim & Shorts", "Sandals & Espadrilles", "Straw Accessories"],
  },
  {
    id: "makeup-only", label: "Makeup & Grooming", Icon: Palette,
    genderLabel: { male: "Grooming & Skincare", female: "Makeup & Beauty" },
    desc: "Focus on face — skincare, grooming, and beauty routine",
    includes: ["Primer & Base", "Eyes & Brows", "Lips", "Skincare"],
  },
  {
    id: "grooming", label: "Grooming Essentials", Icon: Scissors,
    desc: "Hair, beard, skincare — the complete grooming playbook",
    includes: ["Haircut Styles", "Beard & Shave", "Skincare Routine", "Fragrance"],
  },
];

const StylePickerScreen = ({ prefs, onBack, onNext }: Props) => {
  const [selected, setSelected] = useState<StyleCategory>(prefs.styleCategory);
  const isMale = prefs.gender === "male";

  // Filter categories by gender relevance
  const filtered = categories.filter(c => {
    if (c.id === "grooming") return isMale;
    if (c.id === "makeup-only") return true;
    return true;
  });

  const current = filtered.find(c => c.id === selected) || filtered[0];

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
        {/* Grid layout instead of list to differentiate from home */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {filtered.map((cat, i) => {
            const isSelected = selected === cat.id;
            const label = cat.genderLabel ? cat.genderLabel[prefs.gender] : cat.label;
            return (
              <div
                key={cat.id}
                className={`glamora-card anim-fadeUp d${Math.min(i + 1, 6)}`}
                onClick={() => setSelected(cat.id)}
                style={{
                  padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 8, cursor: "pointer", textAlign: "center",
                  border: isSelected
                    ? `2px solid hsl(var(${isMale ? "--glamora-gold" : "--glamora-rose-dark"}))`
                    : "1.5px solid hsla(var(--glamora-gold) / 0.1)",
                  background: isSelected
                    ? `linear-gradient(135deg, hsla(var(${isMale ? "--glamora-gold" : "--glamora-rose"}) / 0.1), hsla(var(${isMale ? "--glamora-gold-light" : "--glamora-gold"}) / 0.05))`
                    : "hsl(var(--card))",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: isSelected
                    ? `linear-gradient(135deg, hsl(var(${isMale ? "--glamora-gold" : "--glamora-rose-dark"})), hsl(var(${isMale ? "--glamora-gold-light" : "--glamora-gold"})))`
                    : "hsla(var(--glamora-cream2))",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                }}>
                  <cat.Icon size={20} color={isSelected ? "white" : (isMale ? "hsl(var(--glamora-gold))" : "hsl(var(--glamora-rose-dark))")} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))", lineHeight: 1.2 }}>{label}</div>
                {isSelected && (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "hsl(var(--glamora-success))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={12} color="white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected detail */}
        <div className="glamora-card anim-fadeUp" style={{ padding: "16px 16px", marginBottom: 24 }}>
          <div className="section-label" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <current.Icon size={14} color="hsl(var(--glamora-gray))" />
            What's Included in {current.genderLabel ? current.genderLabel[prefs.gender] : current.label}
          </div>
          <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 10, lineHeight: 1.4 }}>{current.desc}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {current.includes.map(item => (<span key={item} className="pill-tag">{item}</span>))}
          </div>
        </div>

        <button className="btn-primary btn-rose" onClick={() => onNext(selected)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: isMale
            ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))"
            : undefined,
        }}>
          Continue — Upload Photo <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StylePickerScreen;
