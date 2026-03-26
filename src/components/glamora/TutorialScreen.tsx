import { useState } from "react";

interface Props {
  lookName: string;
  onBack: () => void;
  onHome: () => void;
}

type Category = "makeup" | "top" | "bottom" | "shoes" | "accessories";

const categoryLabels: Record<Category, { label: string; icon: string }> = {
  makeup: { label: "Makeup", icon: "💄" },
  top: { label: "Top & Layers", icon: "👔" },
  bottom: { label: "Bottoms", icon: "👖" },
  shoes: { label: "Shoes & Socks", icon: "👟" },
  accessories: { label: "Accessories", icon: "⌚" },
};

const categoryOrder: Category[] = ["makeup", "top", "bottom", "shoes", "accessories"];

type Step = { title: string; detail: string; tip?: string };

const lookData: Record<string, Record<Category, Step[]>> = {
  "Soft Glam": {
    makeup: [
      { title: "Prep & Prime", detail: "Apply a hydrating primer with a dewy finish. Focus on T-zone for a natural glow.", tip: "Use a beauty sponge for even application" },
      { title: "Soft Rose Base", detail: "Blend a light-coverage foundation matched to your skin tone. Conceal under eyes with a shade lighter." },
      { title: "Blush & Highlight", detail: "Sweep a rose-pink blush on the apples of your cheeks. Add a champagne highlighter to cheekbones and nose bridge.", tip: "Smile to find the apples of your cheeks" },
      { title: "Soft Eye Look", detail: "Apply a matte nude on the lid, rose shimmer on the center, and blend a soft brown in the crease." },
      { title: "Lips & Set", detail: "Line lips with a nude-rose liner. Apply a satin rose lipstick. Set everything with a dewy setting spray." },
    ],
    top: [
      { title: "Base Layer", detail: "Choose a fitted silk or satin camisole in blush, champagne, or soft cream.", tip: "Silk reflects light and elevates the soft glam vibe" },
      { title: "Mid Layer", detail: "Layer with a tailored blazer in dusty rose, camel, or soft beige. Opt for relaxed shoulders." },
      { title: "Alternative: Blouse", detail: "A flowy wrap blouse in muted florals or solid rose pairs beautifully with this look." },
    ],
    bottom: [
      { title: "Trousers", detail: "High-waisted wide-leg trousers in cream, tan, or soft grey. Clean lines complement the softness.", tip: "A crease down the front adds polish" },
      { title: "Alternative: Skirt", detail: "A midi satin slip skirt in champagne or blush. Keep the silhouette fluid and elegant." },
    ],
    shoes: [
      { title: "Heels", detail: "Strappy nude or rose-gold heeled sandals. 2-3 inch block heels for comfort and elegance." },
      { title: "Socks", detail: "Skip visible socks with heels. If wearing closed-toe pumps, go with sheer nude no-show socks.", tip: "Sheer socks keep things polished" },
      { title: "Alternative: Flats", detail: "Pointed-toe ballet flats in metallic rose gold or soft suede nude." },
    ],
    accessories: [
      { title: "Watch", detail: "A slim rose-gold watch with a mesh band. Keep the face minimal and elegant." },
      { title: "Jewelry", detail: "Dainty gold layered necklaces. Small hoop or pearl stud earrings. A thin bangle or two." },
      { title: "Bag", detail: "A structured mini crossbody or clutch in nude leather or soft pink.", tip: "Match metals — rose gold watch with rose gold bag hardware" },
      { title: "Finishing Touches", detail: "A silk scarf tied loosely around the neck or hair. Soft fragrance with notes of peony and vanilla." },
    ],
  },
  "Golden Hour": {
    makeup: [
      { title: "Bronzed Base", detail: "Use a luminous foundation. Warm up the complexion with a golden bronzer on cheekbones, temples, and jawline." },
      { title: "Golden Eyes", detail: "Apply a warm copper shadow on lids with gold shimmer in the center. Blend a warm brown into the crease.", tip: "Wet your brush for maximum gold payoff" },
      { title: "Sun-Kissed Cheeks", detail: "A warm peach blush blended upward. Top with a gold liquid highlighter on the high points." },
      { title: "Warm Lips", detail: "A terracotta or warm nude lip liner with a glossy caramel lip gloss." },
    ],
    top: [
      { title: "Statement Piece", detail: "A rust, burnt orange, or golden-mustard satin blouse. Flowy sleeves add movement.", tip: "Earth tones mirror the golden hour palette" },
      { title: "Layer Option", detail: "A camel or cognac suede jacket. Or a lightweight linen blazer in warm sand." },
    ],
    bottom: [
      { title: "Denim", detail: "High-waisted straight-leg jeans in a warm medium wash. Slightly cropped to show ankle." },
      { title: "Alternative: Linen", detail: "Wide-leg linen pants in terracotta or warm beige for a breezy elevated feel." },
    ],
    shoes: [
      { title: "Boots", detail: "Suede ankle boots in cognac or tan. A western-inspired heel adds character." },
      { title: "Socks", detail: "Ribbed cotton socks in cream or tan that peek above the boot.", tip: "Visible socks with boots is a styling move — lean into it" },
      { title: "Alternative: Sandals", detail: "Leather flat sandals with gold buckle details for a warmer day." },
    ],
    accessories: [
      { title: "Watch", detail: "A gold-tone watch with a leather strap in cognac or honey brown." },
      { title: "Jewelry", detail: "Chunky gold hoops. Stacked gold rings. A bold chain necklace or pendant." },
      { title: "Bag", detail: "A woven straw tote or structured saddle bag in tan leather.", tip: "Woven textures scream golden hour" },
      { title: "Extras", detail: "Tortoiseshell sunglasses. A woven belt in warm leather. A light scent with amber and sandalwood." },
    ],
  },
  "Berry Chic": {
    makeup: [
      { title: "Flawless Base", detail: "A matte full-coverage foundation. Set with translucent powder for a porcelain finish." },
      { title: "Minimal Eyes", detail: "A wash of mauve on the lids. Tight-line upper lash with dark brown. Lots of mascara.", tip: "Keep eyes minimal to let the lip be the star" },
      { title: "Sculpted Cheeks", detail: "A cool-toned mauve blush. Subtle highlight on the cheekbones only." },
      { title: "Bold Berry Lip", detail: "Line with a deep berry liner. Fill with a matte berry or plum lipstick. Blot and reapply for intensity." },
    ],
    top: [
      { title: "Statement Top", detail: "A black fitted turtleneck or a deep plum silk button-up. Clean lines, rich tones.", tip: "Black lets the berry lip and accessories pop" },
      { title: "Layer", detail: "A structured black blazer or a deep burgundy leather jacket for edge." },
    ],
    bottom: [
      { title: "Tailored Pants", detail: "Black high-waisted cigarette trousers or tailored straight-leg pants." },
      { title: "Alternative: Skirt", detail: "A black leather midi skirt or a plum-toned pencil skirt for a bold silhouette." },
    ],
    shoes: [
      { title: "Heels", detail: "Black pointed-toe stilettos or kitten heels. Patent leather adds drama." },
      { title: "Socks", detail: "Sheer black socks with subtle pattern or lace trim for a fashion-forward touch." },
      { title: "Alternative: Boots", detail: "Black leather knee-high boots. Sleek silhouette, minimal hardware." },
    ],
    accessories: [
      { title: "Watch", detail: "A silver or gunmetal watch with a black face. Bold and architectural." },
      { title: "Jewelry", detail: "Silver geometric earrings. A single statement ring. Minimal but impactful.", tip: "Silver and berry tones are a power combination" },
      { title: "Bag", detail: "A structured black leather envelope clutch or a mini top-handle bag." },
      { title: "Purse Details", detail: "Look for silver hardware, clean lines. A burgundy or deep wine alternative adds cohesion." },
      { title: "Finishing", detail: "A dark berry nail polish. A bold, moody perfume with black cherry and cedar notes." },
    ],
  },
};

const TutorialScreen = ({ lookName, onBack, onHome }: Props) => {
  const [activeCategory, setActiveCategory] = useState<Category>("makeup");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

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

  const totalSteps = Object.values(data).flat().length;
  const doneCount = completedSteps.size;
  const progress = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

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
        <div className="glamora-card anim-fadeUp" style={{ padding: "16px 18px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
              Style Progress
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-success))" }}>
              {doneCount}/{totalSteps} steps
            </span>
          </div>
          <div style={{
            height: 8, borderRadius: 100,
            background: "hsla(var(--glamora-cream2))",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 100,
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="anim-fadeUp d1" style={{
          display: "flex", gap: 8, overflowX: "auto",
          paddingBottom: 8, marginBottom: 20,
          scrollbarWidth: "none",
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
                  padding: "10px 16px",
                  borderRadius: 14,
                  border: "1.5px solid",
                  borderColor: isActive ? "hsl(var(--glamora-rose-dark))" : "hsla(var(--glamora-gray-light) / 0.3)",
                  background: isActive
                    ? "linear-gradient(135deg, hsla(var(--glamora-rose-dark) / 0.12), hsla(var(--glamora-gold) / 0.08))"
                    : "hsl(var(--card))",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 6,
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12, fontWeight: isActive ? 600 : 500,
                  color: isActive ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))",
                  transition: "all 0.2s",
                  flexShrink: 0,
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
            return (
              <div
                key={key}
                className={`glamora-card anim-fadeUp d${Math.min(i + 1, 6)}`}
                onClick={() => toggleStep(key)}
                style={{
                  padding: "18px 18px",
                  border: done
                    ? "1.5px solid hsla(var(--glamora-success) / 0.4)"
                    : "1px solid hsla(var(--glamora-gold) / 0.12)",
                  cursor: "pointer",
                  opacity: done ? 0.75 : 1,
                  transition: "all 0.25s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  {/* Step number / check */}
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
                      textDecoration: done ? "line-through" : "none",
                      marginBottom: 4,
                    }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", lineHeight: 1.55 }}>
                      {step.detail}
                    </div>
                    {step.tip && (
                      <div style={{
                        marginTop: 10, padding: "8px 12px",
                        borderRadius: 10,
                        background: "hsla(var(--glamora-gold-pale) / 0.5)",
                        border: "1px solid hsla(var(--glamora-gold) / 0.15)",
                        fontSize: 12, color: "hsl(var(--glamora-gold))",
                        fontWeight: 500,
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        💡 {step.tip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-primary btn-rose" onClick={onHome}>
            Done Styling ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialScreen;
