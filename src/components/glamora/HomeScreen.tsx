import { Home, Scissors, Bookmark, User, ArrowRight, TrendingUp, Zap, Eye, Crown, Palette, Camera, Star } from "lucide-react";
import DynamicVisual from "./DynamicVisual";
import StyleSuggestions from "./StyleSuggestions";
import type { Gender, StyleCategory } from "./GlamoraApp";
import type { SubscriptionState } from "./subscription/types";
import UsageBadge from "./subscription/UsageBadge";

interface Props {
  onGetStyled: (initialCategory?: StyleCategory) => void;
  onProfile: () => void;
  onSaved: () => void;
  savedCount: number;
  gender: Gender;
  onGenderToggle: (g: Gender) => void;
  subscription: SubscriptionState;
  remainingGenerations: number;
  onShowPaywall: () => void;
  onInspiration: () => void;
  isLoggedIn: boolean;
  onSignIn: () => void;
}

const HomeScreen = ({ onGetStyled, onProfile, onSaved, savedCount, gender, onGenderToggle, subscription, remainingGenerations, onShowPaywall, onInspiration, isLoggedIn, onSignIn }: Props) => {
  const isMale = gender === "male";
  const accent = "var(--glamora-gold)";
  const accentLight = "var(--glamora-gold-light)";

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingBottom: 90 }}>
      {/* Compact hero */}
      <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
        <DynamicVisual width="100%" height="100%" variant="hero" style={{ position: "absolute", inset: 0 }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: isMale
            ? "linear-gradient(180deg, hsla(20 18% 6% / 0.1) 0%, hsla(20 18% 6% / 0.97) 100%)"
            : "linear-gradient(180deg, hsla(18 28% 12% / 0.05) 0%, hsla(18 28% 12% / 0.97) 100%)",
        }} />

        {/* Top bar */}
        <div style={{ position: "relative", zIndex: 5, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "44px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/glosseti-icon-only.png" alt="Glosseti" style={{ width: 36, height: 36, objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              display: "flex", borderRadius: 100, overflow: "hidden",
              background: "hsla(0 0% 0% / 0.4)", backdropFilter: "blur(10px)",
              border: "1.5px solid hsla(0 0% 100% / 0.12)",
              padding: 2,
            }}>
              {([
                { id: "female" as Gender, label: "♀", full: "Her" },
                { id: "male" as Gender, label: "♂", full: "Him" },
              ]).map((opt) => {
                const isActive = gender === opt.id;
                const activeColor = "var(--glamora-gold)";
                return (
                  <button
                    key={opt.id}
                    onClick={() => onGenderToggle(opt.id)}
                    style={{
                      padding: "5px 12px", borderRadius: 100, border: "none", cursor: "pointer",
                      background: isActive
                        ? `linear-gradient(135deg, hsl(${activeColor}), hsl(${opt.id === "male" ? "var(--glamora-gold-light)" : "var(--glamora-rose)"}))`
                        : "transparent",
                      color: isActive ? "white" : "hsla(0 0% 100% / 0.5)",
                      fontSize: 11, fontWeight: 600, fontFamily: "'Jost', sans-serif",
                      transition: "all 0.3s ease",
                      display: "flex", alignItems: "center", gap: 3,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{opt.label}</span> {opt.full}
                  </button>
                );
              })}
            </div>
            <button onClick={onProfile} style={{
              width: 34, height: 34, borderRadius: "50%",
              background: `linear-gradient(135deg, hsl(${accentLight}), hsl(${accent}))`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", border: "2px solid hsla(0 0% 100% / 0.2)",
              boxShadow: "0 4px 16px hsla(0 0% 0% / 0.4)",
            }}>
              <User size={14} color="white" />
            </button>
          </div>
        </div>

        {/* Usage badge */}
        <div style={{ position: "relative", zIndex: 5, padding: "8px 20px 0", display: "flex", justifyContent: "flex-end" }}>
          <UsageBadge tier={subscription.tier} remaining={remainingGenerations} onUpgrade={onShowPaywall} />
        </div>

        {/* Hero text */}
        <div className="anim-fadeUp" style={{ position: "relative", zIndex: 5, padding: "24px 20px 0" }}>
          <div className="serif" style={{ fontSize: 30, lineHeight: 1.1, color: "white" }}>
            {isMale
              ? <>Your <em style={{ fontStyle: "italic", color: `hsl(${accent})` }}>Signature</em><br />Style Awaits</>
              : <>Discover Your<br /><em style={{ fontStyle: "italic", color: `hsl(${accent})` }}>Perfect</em> Look</>
            }
          </div>
        </div>
      </div>

      {/* Main CTA — overlaps hero */}
      <div style={{ padding: "0 20px", marginTop: -32, position: "relative", zIndex: 10 }}>
        <div
          className="glamora-card anim-fadeUp d1"
          onClick={() => onGetStyled()}
          style={{
            padding: "18px 16px", cursor: "pointer",
            background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.1), hsla(0 0% 100% / 0.04))`,
            border: `1.5px solid hsla(var(--glamora-gold) / 0.2)`,
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 6px 24px hsla(0 0% 0% / 0.4), inset 0 1px 0 hsla(0 0% 100% / 0.06)",
            position: "relative", overflow: "hidden",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Shimmer overlay */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "linear-gradient(105deg, transparent 40%, hsla(28 40% 52% / 0.12) 45%, hsla(30 45% 62% / 0.2) 50%, hsla(28 40% 52% / 0.12) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "gold-shimmer 3s ease-in-out infinite",
          }} />
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0, position: "relative", zIndex: 2,
            background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px hsla(28 40% 52% / 0.25)",
          }}>
            <Camera size={22} color="white" />
          </div>
          <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "hsla(0 0% 100% / 0.92)" }}>
              {isMale ? "Get Your Style" : "Get Styled Now"}
            </div>
            <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 2 }}>
              Upload a photo · AI generates your look
            </div>
          </div>
          <ArrowRight size={18} color={`hsl(${accent})`} style={{ position: "relative", zIndex: 2 }} />
        </div>
      </div>

      {/* Two action cards — side by side */}
      <div className="anim-fadeUp d2" style={{ padding: "14px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="glamora-card" onClick={() => onGetStyled("full-style")} style={{
          padding: "16px 12px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.06), hsl(var(--card)))`,
          border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.12)`,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.18), hsla(${isMale ? "var(--glamora-gold-light)" : "var(--glamora-gold)"} / 0.1))`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Eye size={18} color={`hsl(${accent})`} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>AI Vision</div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 1 }}>
              {isMale ? "Full outfit analysis" : "Head-to-toe scan"}
            </div>
          </div>
        </div>

        <div className="glamora-card" onClick={() => onGetStyled(isMale ? "grooming" : "makeup-only")} style={{
          padding: "16px 12px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.06), hsl(var(--card)))`,
          border: "1px solid hsla(var(--glamora-gold) / 0.12)",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, hsla(var(--glamora-gold) / 0.18), hsla(var(--glamora-gold-light) / 0.1))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {isMale ? <Scissors size={18} color="hsl(var(--glamora-gold))" /> : <Palette size={18} color="hsl(var(--glamora-gold))" />}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
              {isMale ? "Grooming" : "Makeup"}
            </div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 1 }}>
              {isMale ? "Hair & skincare" : "Beauty & color picks"}
            </div>
          </div>
        </div>
      </div>

      {/* Style Inspiration CTA */}
      <div className="anim-fadeUp d2" style={{ padding: "10px 20px 0" }}>
        <div
          className="glamora-card"
          onClick={onInspiration}
          style={{
            padding: "16px 16px", cursor: "pointer",
            background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.08), hsl(var(--card)))`,
            border: `1.5px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15)`,
            display: "flex", alignItems: "center", gap: 14,
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.2), hsla(var(--glamora-gold-light) / 0.1))`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Star size={20} color={`hsl(${accent})`} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Style Inspiration</div>
            <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", marginTop: 2 }}>
              Channel any celebrity's aesthetic
            </div>
          </div>
          <ArrowRight size={16} color={`hsl(${accent})`} />
        </div>
      </div>

      {/* Saved & Tiers — compact inline row */}
      <div className="anim-fadeUp d2" style={{ padding: "10px 20px 0", display: "flex", gap: 10 }}>
        <div className="glamora-card" onClick={onSaved} style={{
          flex: 1, padding: "12px 14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10, position: "relative",
        }}>
          <Bookmark size={16} color={`hsl(${accent})`} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>Saved Looks</div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))" }}>{savedCount} saved</div>
          </div>
          {savedCount > 0 && (
            <div style={{
              position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%",
              background: `hsl(${accent})`, fontSize: 9, fontWeight: 700, color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{savedCount}</div>
          )}
        </div>

        <div className="glamora-card" onClick={() => onGetStyled()} style={{
          flex: 1, padding: "12px 14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Zap size={16} color="hsl(var(--glamora-success))" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>3 Price Tiers</div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))" }}>Luxury to budget</div>
          </div>
        </div>
      </div>

      {/* AI Style Suggestions */}
      <StyleSuggestions
        gender={gender}
        isLoggedIn={isLoggedIn}
        onSelectStyle={(cat) => onGetStyled(cat)}
        onSignIn={onSignIn}
      />

      {/* Trending section */}
      <div style={{ padding: "18px 20px 0" }}>
        <div className="section-label anim-fadeUp d3" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <TrendingUp size={13} color={`hsl(${accent})`} /> Trending Styles
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
          {(isMale
            ? [
                { title: "Sharp & Polished", sub: "Tailored fits", icon: Crown },
                { title: "Street Edge", sub: "Bold sneakers", icon: Zap },
                { title: "Weekend Easy", sub: "Relaxed denim", icon: Scissors },
              ]
            : [
                { title: "Effortless Glam", sub: "Gold accents", icon: Crown },
                { title: "Bold & Beautiful", sub: "Fierce looks", icon: Zap },
                { title: "Soft Feminine", sub: "Pastel tones", icon: Palette },
              ]
          ).map((item, i) => (
            <div
              key={item.title}
              className={`glamora-card anim-fadeUp d${i + 4}`}
              onClick={() => onGetStyled()}
              style={{
                minWidth: 130, padding: "14px 12px", cursor: "pointer",
                border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.12)`,
                background: `linear-gradient(160deg, hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.05), transparent)`,
              }}
            >
              <item.icon size={16} color={`hsl(${accent})`} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{item.title}</div>
              <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        <button className="nav-btn active"><span className="nav-icon"><Home size={20} /></span><span className="nav-label">Home</span></button>
        <button className="nav-btn" onClick={() => onGetStyled()}><span className="nav-icon"><Scissors size={20} /></span><span className="nav-label">Style</span></button>
        <button className="nav-btn" onClick={onSaved}><span className="nav-icon"><Bookmark size={20} /></span><span className="nav-label">Saved</span></button>
        <button className="nav-btn" onClick={onProfile}><span className="nav-icon"><User size={20} /></span><span className="nav-label">Profile</span></button>
      </div>
    </div>
  );
};

export default HomeScreen;
