import { useState } from "react";
import { Shirt, Flame, Heart, Clock, Dumbbell, Briefcase, Smile, Palette, Check, ArrowRight } from "lucide-react";
import type { StyleCategory } from "./GlamoraApp";
import type { LucideIcon } from "lucide-react";

interface Props {
  prefs: { styleCategory: StyleCategory };
  onBack: () => void;
  onNext: (category: StyleCategory) => void;
}

const categories: { id: StyleCategory; label: string; Icon: LucideIcon; desc: string; includes: string[] }[] = [
  {
    id: "full-style", label: "Full Style", Icon: Shirt,
    desc: "Complete head-to-toe outfit with accessories, shoes, and optional makeup",
    includes: ["Tops & Layers", "Bottoms", "Shoes & Socks", "Watches & Jewelry", "Bags & Purses", "Makeup (optional)"],
  },
  {
    id: "streetwear", label: "Streetwear", Icon: Flame,
    desc: "Urban-inspired looks with sneakers, hoodies, and statement pieces",
    includes: ["Graphic Tees & Hoodies", "Cargos & Baggy Jeans", "Sneakers & Boots", "Caps & Chains", "Backpacks & Slings"],
  },
  {
    id: "minimalist", label: "Minimalist", Icon: Heart,
    desc: "Clean, intentional, timeless — quality over quantity, neutrals over noise",
    includes: ["Essential Tees & Knits", "Tailored Trousers", "Clean Sneakers & Loafers", "Minimal Watches", "Structured Bags"],
  },
  {
    id: "vintage", label: "Vintage / Retro", Icon: Clock,
    desc: "60s mod, 70s boho, 90s grunge — pull from the best eras",
    includes: ["Printed Blouses", "Flare Jeans & A-Line Skirts", "Platform Shoes & Mary Janes", "Headscarves", "Oversized Sunglasses"],
  },
  {
    id: "athleisure", label: "Athleisure", Icon: Dumbbell,
    desc: "Gym-to-street style — performance fabrics meet fashion-forward design",
    includes: ["Performance Tees & Bras", "Joggers & Bike Shorts", "Running Sneakers & Slides", "Smart Watches", "Belt Bags"],
  },
  {
    id: "formal", label: "Formal / Business", Icon: Briefcase,
    desc: "Professional and elegant looks for work, events, and special occasions",
    includes: ["Suits & Blazers", "Dress Shirts", "Dress Shoes", "Ties & Cufflinks", "Watches & Bags"],
  },
  {
    id: "casual", label: "Casual Everyday", Icon: Smile,
    desc: "Effortless daily outfits that look put-together without trying too hard",
    includes: ["Tees & Knits", "Jeans & Chinos", "Sneakers & Loafers", "Sunglasses & Hats"],
  },
  {
    id: "makeup-only", label: "Makeup & Grooming", Icon: Palette,
    desc: "Focus on beauty — foundation, eyes, lips, skincare routine",
    includes: ["Primer & Base", "Eyes & Brows", "Lips", "Setting & Skincare"],
  },
];

const StylePickerScreen = ({ prefs, onBack, onNext }: Props) => {
  const [selected, setSelected] = useState<StyleCategory>(prefs.styleCategory);
  const current = categories.find(c => c.id === selected)!;

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40 }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Choose Your Style</div>
          <div className="header-sub">What are you looking for?</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {categories.map((cat, i) => {
            const isSelected = selected === cat.id;
            return (
              <div
                key={cat.id}
                className={`glamora-card anim-fadeUp d${Math.min(i + 1, 6)}`}
                onClick={() => setSelected(cat.id)}
                style={{
                  padding: "16px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                  border: isSelected ? "2px solid hsl(var(--glamora-rose-dark))" : "1.5px solid hsla(var(--glamora-gold) / 0.12)",
                  background: isSelected ? "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.08), hsla(var(--glamora-gold) / 0.05))" : "hsl(var(--card))",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: isSelected ? "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))" : "hsla(var(--glamora-cream2))",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s",
                }}>
                  <cat.Icon size={22} color={isSelected ? "white" : "hsl(var(--glamora-rose-dark))"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 2, lineHeight: 1.4 }}>{cat.desc}</div>
                </div>
                {isSelected && (
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "hsl(var(--glamora-success))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={14} color="white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="glamora-card anim-fadeUp" style={{ padding: "16px 16px", marginBottom: 24 }}>
          <div className="section-label" style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <current.Icon size={14} color="hsl(var(--glamora-gray))" />
            What's Included in {current.label}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {current.includes.map(item => (<span key={item} className="pill-tag">{item}</span>))}
          </div>
        </div>

        <button className="btn-primary btn-rose" onClick={() => onNext(selected)} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Continue — Upload Photo <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StylePickerScreen;
