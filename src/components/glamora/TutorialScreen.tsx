import { useState } from "react";
import { Home, Check, Lightbulb, ShoppingBag, ChevronDown, Crown, Sparkles, Coins, Palette, Shirt, CircleDot, Footprints, Watch, ExternalLink, BookOpen, Wrench, Play } from "lucide-react";
import { lookData, categoryLabels, categoryOrder, tierInfo, makeupToolsChecklist } from "./lookData";
import { getShopUrl } from "./affiliateUrls";
import type { Category, PriceTier } from "./lookData";
import type { LucideIcon } from "lucide-react";

interface Props {
  lookName: string;
  onBack: () => void;
  onHome: () => void;
}

const categoryIcons: Partial<Record<Category, LucideIcon>> = {
  makeup: Palette,
  top: Shirt,
  bottom: CircleDot,
  shoes: Footprints,
  accessories: Watch,
  bags: ShoppingBag,
  swimwear: Sparkles,
  lingerie: Sparkles,
};

const tierIcons: Record<PriceTier, LucideIcon> = {
  luxury: Crown,
  mid: Sparkles,
  budget: Coins,
};

const TutorialScreen = ({ lookName, onBack, onHome }: Props) => {
  const [activeCategory, setActiveCategory] = useState<Category>("makeup");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<PriceTier>("mid");
  const [beginnerMode, setBeginnerMode] = useState(false);
  const [showToolsChecklist, setShowToolsChecklist] = useState(false);

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

  const categoryTotal = steps.reduce((sum, step) => {
    if (!step.shop) return sum;
    const priceStr = step.shop[activeTier]?.price || "$0";
    const num = parseFloat(priceStr.replace(/[$,]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const isMakeupCategory = activeCategory === "makeup";
  const hasTechniques = isMakeupCategory && steps.some(s => s.technique?.length);

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 40 }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ flex: 1 }}>
          <div className="header-title">{lookName}</div>
          <div className="header-sub">Complete Style Guide</div>
        </div>
        <button className="back-btn" onClick={onHome} style={{ fontSize: 16 }}>
          <Home size={18} />
        </button>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Progress */}
        <div className="glamora-card anim-fadeUp" style={{ padding: "16px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Style Progress</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-success))" }}>{doneCount}/{totalSteps} steps</span>
          </div>
          <div style={{ height: 8, borderRadius: 100, background: "hsla(var(--glamora-cream2))", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 100, width: `${progress}%`, background: "linear-gradient(90deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))", transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Beginner Mode Toggle - shown when makeup has techniques */}
        {hasTechniques && (
          <div className="glamora-card anim-fadeUp d1" style={{ padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: beginnerMode ? "linear-gradient(135deg, hsla(var(--glamora-rose-dark) / 0.15), hsla(var(--glamora-gold) / 0.1))" : "hsla(var(--glamora-cream2))", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                <BookOpen size={17} color={beginnerMode ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))"} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Beginner Mode</div>
                <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>Step-by-step technique for each product</div>
              </div>
            </div>
            <button
              onClick={() => setBeginnerMode(!beginnerMode)}
              style={{
                width: 46, height: 26, borderRadius: 100, border: "none", cursor: "pointer",
                background: beginnerMode ? "hsl(var(--glamora-rose-dark))" : "hsla(var(--glamora-gray-light) / 0.4)",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 100, background: "white",
                position: "absolute", top: 3,
                left: beginnerMode ? 23 : 3,
                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }} />
            </button>
          </div>
        )}

        {/* Tools Checklist - shown in beginner mode for makeup */}
        {beginnerMode && isMakeupCategory && (
          <div className="glamora-card anim-fadeUp" style={{ padding: "14px 18px", marginBottom: 16 }}>
            <button
              onClick={() => setShowToolsChecklist(!showToolsChecklist)}
              style={{
                width: "100%", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Jost', sans-serif", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Wrench size={15} color="hsl(var(--glamora-gold))" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>🧰 Tools You'll Need</span>
              </div>
              <ChevronDown size={14} color="hsl(var(--glamora-gray))" style={{ transform: showToolsChecklist ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
            </button>
            {showToolsChecklist && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8, animation: "fadeUp 0.3s ease both" }}>
                {makeupToolsChecklist.map((tool) => (
                  <div key={tool.name} style={{ padding: "10px 12px", borderRadius: 10, background: "hsla(var(--glamora-gold-pale) / 0.4)", border: "1px solid hsla(var(--glamora-gold) / 0.12)" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 2 }}>{tool.name}</div>
                    <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", lineHeight: 1.45 }}>{tool.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Tier Selector */}
        <div className="glamora-card anim-fadeUp d1" style={{ padding: "14px 14px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "hsl(var(--glamora-gray))", fontWeight: 600, marginBottom: 10 }}>Shop by Budget</div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["luxury", "mid", "budget"] as PriceTier[]).map((tier) => {
              const t = tierInfo[tier];
              const isActive = activeTier === tier;
              const TierIcon = tierIcons[tier];
              return (
                <button key={tier} onClick={() => setActiveTier(tier)} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 14, border: "1.5px solid",
                  borderColor: isActive ? t.color : "hsla(var(--glamora-gray-light) / 0.25)",
                  background: isActive ? t.bg : "transparent", cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}>
                  <TierIcon size={18} color={isActive ? t.color : "hsl(var(--glamora-gray))"} />
                  <div style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? t.color : "hsl(var(--glamora-gray))" }}>{t.label}</div>
                </button>
              );
            })}
          </div>
          {categoryTotal > 0 && (
            <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 10, background: tierInfo[activeTier].bg, textAlign: "center", fontSize: 13, fontWeight: 600, color: tierInfo[activeTier].color }}>
              Est. {categoryLabels[activeCategory].label} total: ${categoryTotal.toLocaleString()}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="anim-fadeUp d2" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, scrollbarWidth: "none" }}>
          {categoryOrder.map((cat) => {
            const isActive = activeCategory === cat;
            const catSteps = data[cat] || [];
            const catDone = catSteps.filter((_, i) => completedSteps.has(`${cat}-${i}`)).length;
            const CatIcon = categoryIcons[cat] || ShoppingBag;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: "10px 16px", borderRadius: 14, border: "1.5px solid",
                borderColor: isActive ? "hsl(var(--glamora-rose-dark))" : "hsla(var(--glamora-gray-light) / 0.3)",
                background: isActive ? "linear-gradient(135deg, hsla(var(--glamora-rose-dark) / 0.12), hsla(var(--glamora-gold) / 0.08))" : "hsl(var(--card))",
                cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6,
                fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: isActive ? 600 : 500,
                color: isActive ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))", transition: "all 0.2s", flexShrink: 0,
              }}>
                <CatIcon size={16} />
                {categoryLabels[cat].label}
                {catDone > 0 && (
                  <span style={{ fontSize: 10, background: "hsl(var(--glamora-success))", color: "white", borderRadius: 100, padding: "2px 6px", fontWeight: 600 }}>{catDone}/{catSteps.length}</span>
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
            const showTechnique = beginnerMode && step.technique?.length;
            return (
              <div key={key} className={`glamora-card anim-fadeUp d${Math.min(i + 1, 6)}`} style={{
                padding: "18px 18px",
                border: done ? "1.5px solid hsla(var(--glamora-success) / 0.4)" : "1px solid hsla(var(--glamora-gold) / 0.12)",
                transition: "all 0.25s ease",
              }}>
                <div onClick={() => toggleStep(key)} style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                    background: done ? "hsl(var(--glamora-success))" : "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.2), hsla(var(--glamora-gold) / 0.15))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: done ? 18 : 14, fontWeight: 700, color: done ? "white" : "hsl(var(--glamora-rose-dark))", transition: "all 0.25s ease",
                  }}>
                    {done ? <Check size={18} color="white" /> : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--glamora-char))", textDecoration: done ? "line-through" : "none", marginBottom: 4 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", lineHeight: 1.55 }}>{step.detail}</div>

                    {/* Tools needed - shown in beginner mode */}
                    {beginnerMode && step.tools?.length && (
                      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {step.tools.map((tool) => (
                          <span key={tool} style={{
                            fontSize: 10, padding: "3px 8px", borderRadius: 100,
                            background: "hsla(var(--glamora-rose) / 0.1)", color: "hsl(var(--glamora-rose-dark))",
                            fontWeight: 600, letterSpacing: 0.3,
                          }}>🖌 {tool}</span>
                        ))}
                      </div>
                    )}

                    {step.tip && (
                      <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 10, background: "hsla(var(--glamora-gold-pale) / 0.5)", border: "1px solid hsla(var(--glamora-gold) / 0.15)", fontSize: 12, color: "hsl(var(--glamora-gold))", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                        <Lightbulb size={14} /> {step.tip}
                      </div>
                    )}

                    {/* Video Tutorial Link */}
                    {step.videoUrl && (
                      <a
                        href={step.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          marginTop: 10, padding: "10px 14px", borderRadius: 12,
                          background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                          display: "flex", alignItems: "center", gap: 10,
                          textDecoration: "none", cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(255,0,0,0.15)",
                        }}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Play size={14} color="white" fill="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Watch Tutorial</div>
                          <div style={{ fontSize: 13, color: "white", fontWeight: 600 }}>{step.videoLabel || "See How It's Done"}</div>
                        </div>
                        <ExternalLink size={14} color="rgba(255,255,255,0.7)" />
                      </a>
                    )}

                    {/* Technique micro-steps - shown in beginner mode */}
                    {showTechnique && (
                      <div style={{
                        marginTop: 12, padding: "12px 14px", borderRadius: 12,
                        background: "linear-gradient(135deg, hsla(var(--glamora-rose) / 0.06), hsla(var(--glamora-gold-pale) / 0.3))",
                        border: "1px solid hsla(var(--glamora-rose-dark) / 0.1)",
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(var(--glamora-rose-dark))", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                          <BookOpen size={12} /> How To Do This
                        </div>
                        <ol style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                          {step.technique!.map((t, ti) => (
                            <li key={ti} style={{ fontSize: 12, color: "hsl(var(--glamora-char))", lineHeight: 1.5, paddingLeft: 4 }}>
                              {t}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
                {step.shop && (
                  <div style={{ marginTop: 14 }}>
                    <button onClick={(e) => toggleExpand(key, e)} style={{
                      width: "100%", padding: "10px 14px", borderRadius: 12, background: tierInfo[activeTier].bg,
                      border: `1px solid ${tierInfo[activeTier].color}22`, cursor: "pointer", fontFamily: "'Jost', sans-serif",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: tierInfo[activeTier].color, display: "flex", alignItems: "center", gap: 6 }}>
                        <ShoppingBag size={14} /> Shop This — {shopItem?.price}
                      </span>
                      <ChevronDown size={14} color="hsl(var(--glamora-gray))" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                    </button>
                    {isExpanded && (
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, animation: "fadeUp 0.3s ease both" }}>
                        {(["luxury", "mid", "budget"] as PriceTier[]).map((tier) => {
                          const item = step.shop![tier];
                          const t = tierInfo[tier];
                          const isCurrent = tier === activeTier;
                          const TIcon = tierIcons[tier];
                          return (
                            <a
                              key={tier}
                              href={getShopUrl(item.store, item.item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: "12px 14px", borderRadius: 12,
                                background: isCurrent ? t.bg : "hsla(var(--glamora-cream2) / 0.5)",
                                border: isCurrent ? `1.5px solid ${t.color}33` : "1px solid hsla(var(--glamora-gray-light) / 0.15)",
                                display: "flex", alignItems: "center", gap: 12,
                                textDecoration: "none", cursor: "pointer", transition: "all 0.2s",
                              }}
                            >
                              <div style={{ width: 32, height: 32, borderRadius: 10, background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <TIcon size={16} color={t.color} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: t.color, fontWeight: 600, marginBottom: 2 }}>{t.label} · {item.store}</div>
                                <div style={{ fontSize: 13, color: "hsl(var(--glamora-char))", fontWeight: 500, lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis" }}>{item.item}</div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                <div style={{ padding: "6px 12px", borderRadius: 100, background: t.bg, fontSize: 14, fontWeight: 700, color: t.color, whiteSpace: "nowrap" }}>{item.price}</div>
                                <ExternalLink size={14} color={t.color} />
                              </div>
                            </a>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn-primary btn-rose" onClick={onHome} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Done Styling <Sparkles size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialScreen;
