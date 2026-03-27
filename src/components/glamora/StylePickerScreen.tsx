import { useState } from "react";
import { Shirt, Flame, Heart, Clock, Dumbbell, Briefcase, Smile, Palette, Check, ArrowRight, Gem, GraduationCap, Zap, Umbrella, Scissors, Star } from "lucide-react";
import type { StyleCategory } from "./GlamoraApp";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: { styleCategory: StyleCategory; gender: "male" | "female" };
  onBack: () => void;
  onNext: (category: StyleCategory, celebrityGuide?: string) => void;
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
  {
    id: "sexy", label: "Sexy & Sultry", Icon: Flame,
    desc: "Bold, body-confident looks that turn heads",
    includes: ["Bodycon Dresses", "Cut-Out Tops", "Strappy Heels", "Statement Jewelry"],
  },
  {
    id: "swimwear", label: "Swimwear & Beach", Icon: Umbrella,
    desc: "Bikinis, cover-ups, and beach-ready accessories",
    includes: ["Bikinis & One-Pieces", "Cover-Ups & Sarongs", "Sandals & Slides", "Sunglasses & Hats"],
  },
  {
    id: "urban-hiphop", label: "Urban / Hip-Hop", Icon: Zap,
    desc: "Bold streetwear with hip-hop flair — drip and swagger",
    includes: ["Designer Tees & Jerseys", "Baggy Denim & Cargos", "Fresh Kicks", "Chains & Grillz"],
  },
  {
    id: "rugged", label: "Rugged / Workwear", Icon: Briefcase,
    desc: "Tough, utilitarian style — built to last and look good",
    includes: ["Flannels & Henleys", "Raw Denim & Work Pants", "Boots", "Leather Belts"],
  },
  {
    id: "techwear", label: "Techwear", Icon: Zap,
    desc: "Futuristic utility — tech fabrics, modular gear, dark tones",
    includes: ["Technical Jackets", "Cargo Joggers", "Trail Runners", "Tactical Bags"],
  },
  {
    id: "date-night", label: "Date Night", Icon: Heart,
    desc: "Polished and alluring — dress to impress",
    includes: ["Fitted Blazers & Dresses", "Heels & Dress Shoes", "Fragrance", "Accessories"],
  },
  {
    id: "lingerie", label: "Lingerie & Intimates", Icon: Heart,
    desc: "Elegant intimate wear — lace, silk, and delicate details",
    includes: ["Bralettes & Corsets", "Silk Robes & Slips", "Lace Sets", "Loungewear"],
  },
  {
    id: "y2k", label: "Y2K", Icon: Sparkles,
    desc: "Early 2000s nostalgia — low-rise, butterfly tops, frosted lips",
    includes: ["Crop Tops & Halters", "Mini Skirts & Low-Rise Jeans", "Platform Shoes", "Tinted Sunglasses & Belly Chains"],
  },
  {
    id: "cottagecore", label: "Cottagecore", Icon: Flower,
    desc: "Romantic countryside aesthetic — florals, linen, wicker",
    includes: ["Floral Dresses", "Puff-Sleeve Blouses", "Mary Janes & Leather Boots", "Straw Hats & Wicker Bags"],
  },
];

const StylePickerScreen = ({ prefs, onBack, onNext }: Props) => {
  const [selected, setSelected] = useState<StyleCategory[]>([prefs.styleCategory]);
  const [celebrityGuide, setCelebrityGuide] = useState("");
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
        // Don't allow deselecting the last one
        if (prev.length <= 1) return prev;
        return prev.filter(c => c !== id);
      }
      return [...prev, id];
    });
  };

  // Show detail for the most recently selected
  const lastSelected = selected[selected.length - 1];
  const current = filtered.find(c => c.id === lastSelected) || filtered[0];

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

        {/* Selected summary chips */}
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

        {/* Celebrity / Influencer Style Guide */}
        <div className="glamora-card anim-fadeUp" style={{ padding: "14px 16px", marginBottom: 14 }}>
          <div className="section-label" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={14} color={`hsl(var(${accent}))`} />
            Style Inspired By (Optional)
          </div>
          <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginBottom: 10, lineHeight: 1.4 }}>
            Enter a celebrity or influencer name to guide the AI's styling direction
          </div>
          <input
            type="text"
            value={celebrityGuide}
            onChange={(e) => setCelebrityGuide(e.target.value)}
            placeholder={isMale ? "e.g. David Beckham, A$AP Rocky..." : "e.g. Zendaya, Hailey Bieber..."}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 12,
              border: `1.5px solid hsla(var(${accent}) / ${celebrityGuide ? "0.4" : "0.15"})`,
              background: celebrityGuide ? `hsla(var(${accent}) / 0.05)` : "hsl(var(--card))",
              fontSize: 13, fontFamily: "'Jost', sans-serif",
              color: "hsl(var(--glamora-char))", outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = `hsl(var(${accent}))`; }}
            onBlur={(e) => { e.target.style.borderColor = `hsla(var(${accent}) / ${celebrityGuide ? "0.4" : "0.15"})`; }}
          />
          {celebrityGuide && (
            <div style={{
              marginTop: 8, fontSize: 10, color: `hsl(var(${accent}))`, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <Star size={10} /> AI will use {celebrityGuide}'s style as inspiration
            </div>
          )}
        </div>

        <button className="btn-primary btn-rose" onClick={() => onNext(selected[0], celebrityGuide || undefined)} style={{
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
