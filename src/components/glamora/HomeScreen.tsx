import { Home, Scissors, Bookmark, User, ArrowRight, TrendingUp, Zap, Eye, Crown, Palette, Camera } from "lucide-react";
import DynamicVisual from "./DynamicVisual";
import type { Gender, StyleCategory } from "./GlamoraApp";

interface Props {
  onGetStyled: (initialCategory?: StyleCategory) => void;
  onProfile: () => void;
  onSaved: () => void;
  savedCount: number;
  gender: Gender;
  onGenderToggle: (g: Gender) => void;
}

const HomeScreen = ({ onGetStyled, onProfile, onSaved, savedCount, gender, onGenderToggle }: Props) => {
  const isMale = gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 100 }}>
      {/* Full-bleed hero */}
      <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
        <DynamicVisual width="100%" height="100%" variant="hero" style={{ position: "absolute", inset: 0 }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: isMale
            ? "linear-gradient(180deg, hsla(20 18% 6% / 0.1) 0%, hsla(20 18% 6% / 0.95) 100%)"
            : "linear-gradient(180deg, hsla(18 28% 12% / 0.05) 0%, hsla(18 28% 12% / 0.95) 100%)",
        }} />

        {/* Top bar */}
        <div style={{ position: "relative", zIndex: 5, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "48px 22px 0" }}>
          <div className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: 4, color: "white" }}>
            GLAMORA<span style={{ color: `hsl(${accent})` }}>.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Gender toggle pill */}
            <div style={{
              display: "flex", borderRadius: 100, overflow: "hidden",
              background: "hsla(0 0% 0% / 0.4)", backdropFilter: "blur(10px)",
              border: "1.5px solid hsla(0 0% 100% / 0.12)",
              padding: 3,
            }}>
              {([
                { id: "female" as Gender, label: "♀", full: "Her" },
                { id: "male" as Gender, label: "♂", full: "Him" },
              ]).map((opt) => {
                const isActive = gender === opt.id;
                const activeColor = opt.id === "male" ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
                return (
                  <button
                    key={opt.id}
                    onClick={() => onGenderToggle(opt.id)}
                    style={{
                      padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
                      background: isActive
                        ? `linear-gradient(135deg, hsl(${activeColor}), hsl(${opt.id === "male" ? "var(--glamora-gold-light)" : "var(--glamora-rose)"}))`
                        : "transparent",
                      color: isActive ? "white" : "hsla(0 0% 100% / 0.5)",
                      fontSize: 12, fontWeight: 600, fontFamily: "'Jost', sans-serif",
                      transition: "all 0.3s ease",
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{opt.label}</span> {opt.full}
                  </button>
                );
              })}
            </div>
            <button onClick={onProfile} style={{
              width: 38, height: 38, borderRadius: "50%",
              background: `linear-gradient(135deg, hsl(${accentLight}), hsl(${accent}))`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", border: "2px solid hsla(0 0% 100% / 0.2)",
              boxShadow: "0 4px 20px hsla(0 0% 0% / 0.4)",
            }}>
              <User size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Hero text overlay */}
        <div className="anim-fadeUp" style={{ position: "relative", zIndex: 5, padding: "32px 22px 0" }}>
          <div className="serif" style={{ fontSize: 34, lineHeight: 1.05, color: "white" }}>
            {isMale
              ? <>Your <em style={{ fontStyle: "italic", color: `hsl(${accent})` }}>Signature</em><br />Style Awaits</>
              : <>Discover Your<br /><em style={{ fontStyle: "italic", color: `hsl(${accent})` }}>Perfect</em> Look</>
            }
          </div>
        </div>
      </div>

      {/* Main CTA card — overlaps hero */}
      <div style={{ padding: "0 22px", marginTop: -40, position: "relative", zIndex: 10 }}>
        <div
          className="glamora-card anim-fadeUp d1"
          onClick={() => onGetStyled()}
          style={{
            padding: "24px 20px", cursor: "pointer",
            background: `linear-gradient(160deg, hsl(var(--glamora-cream2)), hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.08))`,
            border: `1.5px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.2)`,
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 8px 32px hsla(0 0% 0% / 0.25)",
          }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 18, flexShrink: 0,
            background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 16px hsla(${isMale ? "28 40% 52%" : "20 35% 55%"} / 0.3)`,
          }}>
            <Camera size={26} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
              {isMale ? "Get Your Style" : "Get Styled Now"}
            </div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 3 }}>
              Upload a photo · AI generates your look
            </div>
          </div>
          <ArrowRight size={20} color={`hsl(${accent})`} />
        </div>
      </div>

      {/* Quick action grid — 2x2 */}
      <div className="anim-fadeUp d2" style={{ padding: "20px 22px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="glamora-card" onClick={() => onGetStyled("full-style")} style={{
          padding: "20px 16px", cursor: "pointer", textAlign: "center",
          background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.06), hsl(var(--card)))`,
          border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.12)`,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 10px",
            background: `linear-gradient(135deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15), hsla(${isMale ? "var(--glamora-gold-light)" : "var(--glamora-gold)"} / 0.1))`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Eye size={22} color={`hsl(${accent})`} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>AI Vision</div>
          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>Scan & style you</div>
        </div>

        <div className="glamora-card" onClick={() => onGetStyled(isMale ? "grooming" : "makeup-only")} style={{
          padding: "20px 16px", cursor: "pointer", textAlign: "center",
          background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.06), hsl(var(--card)))`,
          border: "1px solid hsla(var(--glamora-gold) / 0.12)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 10px",
            background: "linear-gradient(135deg, hsla(var(--glamora-gold) / 0.15), hsla(var(--glamora-gold-light) / 0.1))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Palette size={22} color="hsl(var(--glamora-gold))" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
            {isMale ? "Grooming" : "Makeup"}
          </div>
          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>
            {isMale ? "Hair & skincare" : "Beauty looks"}
          </div>
        </div>

        <div className="glamora-card" onClick={onSaved} style={{
          padding: "20px 16px", cursor: "pointer", textAlign: "center", position: "relative",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 10px",
            background: `linear-gradient(135deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15), hsla(var(--glamora-gold) / 0.08))`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bookmark size={22} color={`hsl(${accent})`} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Saved</div>
          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{savedCount} look{savedCount !== 1 ? "s" : ""}</div>
          {savedCount > 0 && (
            <div style={{
              position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%",
              background: `hsl(${accent})`, fontSize: 10, fontWeight: 700, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{savedCount}</div>
          )}
        </div>

        <div className="glamora-card" onClick={() => onGetStyled()} style={{
          padding: "20px 16px", cursor: "pointer", textAlign: "center",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, margin: "0 auto 10px",
            background: "linear-gradient(135deg, hsla(var(--glamora-success) / 0.15), hsla(var(--glamora-gold) / 0.08))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={22} color="hsl(var(--glamora-success))" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>3 Price Tiers</div>
          <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>Luxury to budget</div>
        </div>
      </div>

      {/* Trending section */}
      <div style={{ padding: "24px 22px 0" }}>
        <div className="section-label anim-fadeUp d3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <TrendingUp size={14} color={`hsl(${accent})`} /> Trending Styles
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {(isMale
            ? [
                { title: "Sharp & Polished", sub: "Tailored fits, clean kicks", icon: Crown },
                { title: "Street Edge", sub: "Oversized layers, bold sneakers", icon: Zap },
                { title: "Weekend Easy", sub: "Relaxed denim, henley vibes", icon: Scissors },
              ]
            : [
                { title: "Effortless Glam", sub: "Silk textures, gold accents", icon: Crown },
                { title: "Bold & Beautiful", sub: "Statement colors, fierce looks", icon: Zap },
                { title: "Soft Feminine", sub: "Flowy fabrics, pastel tones", icon: Palette },
              ]
          ).map((item, i) => (
            <div
              key={item.title}
              className={`glamora-card anim-fadeUp d${i + 4}`}
              onClick={() => onGetStyled()}
              style={{
                minWidth: 160, padding: "18px 14px", cursor: "pointer",
                border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15)`,
                background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.06), transparent)`,
              }}
            >
              <item.icon size={20} color={`hsl(${accent})`} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn active"><span className="nav-icon"><Home size={22} /></span><span className="nav-label">Home</span></button>
        <button className="nav-btn" onClick={() => onGetStyled()}><span className="nav-icon"><Scissors size={22} /></span><span className="nav-label">Style</span></button>
        <button className="nav-btn" onClick={onSaved}><span className="nav-icon"><Bookmark size={22} /></span><span className="nav-label">Saved</span></button>
        <button className="nav-btn" onClick={onProfile}><span className="nav-icon"><User size={22} /></span><span className="nav-label">Profile</span></button>
      </div>
    </div>
  );
};

export default HomeScreen;
