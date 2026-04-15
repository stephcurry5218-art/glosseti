import { useState, useRef } from "react";
import { Home, Scissors, Bookmark, User, ArrowRight, TrendingUp, Zap, Eye, Crown, Palette, Camera, Star, Sparkles, Heart } from "lucide-react";
import DynamicVisual from "./DynamicVisual";
import StyleSuggestions from "./StyleSuggestions";
import DailyLookCard from "./DailyLookCard";
import SeasonalBanner from "./SeasonalBanner";
import EventPromos from "./EventPromos";
import type { Gender, StyleCategory } from "./GlamoraApp";
import type { SubscriptionState } from "./subscription/types";
import { MONTHLY_CAPS } from "./subscription/types";
import UsageBadge from "./subscription/UsageBadge";

interface Props {
  onGetStyled: (initialCategory?: StyleCategory) => void;
  onHolidayPick: (holidayId: string) => void;
  onDailyLook: () => void;
  onProfile: () => void;
  onSaved: () => void;
  savedCount: number;
  gender: Gender;
  onGenderToggle: (g: Gender) => void;
  subscription: SubscriptionState;
  remainingGenerations: number;
  onShowPaywall: () => void;
  isLoggedIn: boolean;
  onSignIn: () => void;
}

const HomeScreen = ({ onGetStyled, onHolidayPick, onDailyLook, onProfile, onSaved, savedCount, gender, onGenderToggle, subscription, remainingGenerations, onShowPaywall, isLoggedIn, onSignIn }: Props) => {
  const isMale = gender === "male";
  const accent = "var(--glamora-gold)";
  const accentLight = "var(--glamora-gold-light)";

  // Secret dev mode toggle
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleLogoTap = () => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setShowPin(true);
      setPin("");
      setPinError(false);
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    }
  };

  const handlePinSubmit = () => {
    if (pin === "5218") {
      const isActive = localStorage.getItem("glamora_dev_mode") === "unlocked";
      if (isActive) {
        localStorage.removeItem("glamora_dev_mode");
      } else {
        localStorage.setItem("glamora_dev_mode", "unlocked");
      }
      setShowPin(false);
      // Force reload so subscription hook picks up the new dev mode state
      setTimeout(() => window.location.reload(), 100);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 1500);
    }
  };

  return (
    <div className="screen enter" style={{ minHeight: "100%", paddingTop: 64, paddingBottom: 20 }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/glosseti-icon-only.png" alt="Glosseti" onClick={handleLogoTap} style={{
              width: 40, height: 40, objectFit: "contain", cursor: "pointer",
              filter: "drop-shadow(0 2px 8px hsla(var(--glamora-gold) / 0.4))",
            }} />
            <span className="serif" style={{
              fontSize: 22, fontWeight: 700, letterSpacing: 1.5,
              background: `linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              textShadow: "none",
              filter: "drop-shadow(0 1px 6px hsla(var(--glamora-gold) / 0.3))",
            }}>GLOSSETI</span>
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

      {/* Remaining generations counter */}
      {(() => {
        const cap = MONTHLY_CAPS[subscription.tier];
        const used = cap - remainingGenerations;
        const pct = Math.min((used / cap) * 100, 100);
        const isLow = remainingGenerations <= 1;
        const isEmpty = remainingGenerations <= 0;
        return (
          <div className="anim-fadeUp d1" style={{
            margin: "0 20px", marginTop: -20, position: "relative", zIndex: 10,
            padding: "12px 16px", borderRadius: 16,
            background: "hsla(0 0% 0% / 0.5)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${isLow ? "hsla(var(--destructive) / 0.25)" : "hsla(var(--glamora-gold) / 0.15)"}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Zap size={14} color={isLow ? "hsl(var(--destructive))" : "hsl(var(--glamora-gold))"} />
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: isLow ? "hsl(var(--destructive))" : "hsla(0 0% 100% / 0.85)",
                }}>
                  {isEmpty ? "No looks remaining" : `${remainingGenerations} of ${cap} looks remaining ${subscription.tier === "free" ? "today" : "this month"}`}
                </span>
              </div>
              {subscription.tier === "free" && (
                <button onClick={onShowPaywall} style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                  background: "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
                  color: "white", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Sparkles size={10} /> Upgrade
                </button>
              )}
            </div>
            <div style={{
              height: 4, borderRadius: 100, overflow: "hidden",
              background: "hsla(0 0% 100% / 0.08)",
            }}>
              <div style={{
                height: "100%", borderRadius: 100,
                width: `${100 - pct}%`,
                background: isLow
                  ? "linear-gradient(90deg, hsl(var(--destructive)), hsla(var(--destructive) / 0.6))"
                  : "linear-gradient(90deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))",
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        );
      })()}

      {/* Main CTA — overlaps hero */}
      <div style={{ padding: "0 20px", marginTop: 10, position: "relative", zIndex: 10 }}>
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
            <div style={{ fontSize: 11, color: "hsla(0 0% 100% / 0.5)", marginTop: 2 }}>
              Upload a photo · AI generates your look
            </div>
          </div>
          <ArrowRight size={18} color={`hsl(${accent})`} style={{ position: "relative", zIndex: 2 }} />
        </div>
      </div>

      {/* Icon Looks CTA — with shimmer */}
      <div className="anim-fadeUp d1" style={{ padding: "10px 20px 0", position: "relative", zIndex: 10 }}>
        <div
          className="glamora-card"
          onClick={() => onGetStyled("icon-looks" as StyleCategory)}
          style={{
            padding: "16px 14px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12,
            background: `linear-gradient(160deg, hsla(280 60% 50% / 0.12), hsla(var(--glamora-gold) / 0.1))`,
            border: `1.5px solid hsla(280 60% 50% / 0.3)`,
            position: "relative", overflow: "hidden",
            boxShadow: "0 4px 20px hsla(280 60% 50% / 0.15), inset 0 1px 0 hsla(0 0% 100% / 0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Shimmer — only on Icon Looks */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "linear-gradient(105deg, transparent 40%, hsla(280 60% 65% / 0.12) 45%, hsla(280 60% 70% / 0.2) 50%, hsla(280 60% 65% / 0.12) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "gold-shimmer 3s ease-in-out infinite",
          }} />
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0, position: "relative", zIndex: 2,
            background: "linear-gradient(135deg, hsla(280 60% 50% / 0.3), hsla(var(--glamora-gold) / 0.2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 10px hsla(280 60% 50% / 0.2)",
          }}>
            <Star size={20} color="hsl(280 60% 65%)" />
          </div>
          <div style={{ flex: 1, position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsla(0 0% 100% / 0.92)" }}>
              ✨ Icon Looks
            </div>
            <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.5)", marginTop: 2 }}>
              Channel iconic style archetypes — get the vibe
            </div>
          </div>
          <ArrowRight size={16} color="hsl(280 60% 65%)" style={{ position: "relative", zIndex: 2 }} />
        </div>
      </div>

      {/* Seasonal Promo Banner — above Daily Look for prominence */}
      <SeasonalBanner onHolidayPick={onHolidayPick} />

      {/* Event-specific promos with style picks */}
      <EventPromos onHolidayPick={onHolidayPick} />

      {/* Daily Look Card */}
      <div className="anim-fadeUp d2" style={{ marginTop: 14 }}>
        <DailyLookCard onGenerate={onDailyLook} onGetStyled={onGetStyled} gender={gender} />
      </div>

      {/* Two action cards — side by side */}
      <div className="anim-fadeUp d2" style={{ padding: "14px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="glamora-card" onClick={() => onGetStyled("full-style")} style={{
          padding: "16px 12px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.12), hsla(0 0% 100% / 0.05))`,
          border: `1.5px solid hsla(var(--glamora-gold) / 0.2)`,
          boxShadow: "0 4px 16px hsla(0 0% 0% / 0.4), inset 0 1px 0 hsla(0 0% 100% / 0.06)",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, hsla(var(--glamora-gold) / 0.25), hsla(var(--glamora-gold-light) / 0.15))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 8px hsla(var(--glamora-gold) / 0.15)",
          }}>
            <Eye size={18} color={`hsl(${accent})`} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)" }}>AI Vision</div>
            <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.45)", marginTop: 1 }}>
              {isMale ? "Full outfit analysis" : "Head-to-toe scan"}
            </div>
          </div>
        </div>

        <div className="glamora-card" onClick={() => onGetStyled(isMale ? "grooming" : "makeup-only")} style={{
          padding: "16px 12px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.12), hsla(0 0% 100% / 0.05))`,
          border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
          boxShadow: "0 4px 16px hsla(0 0% 0% / 0.4), inset 0 1px 0 hsla(0 0% 100% / 0.06)",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, hsla(var(--glamora-gold) / 0.25), hsla(var(--glamora-gold-light) / 0.15))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 8px hsla(var(--glamora-gold) / 0.15)",
          }}>
            {isMale ? <Scissors size={18} color="hsl(var(--glamora-gold))" /> : <Palette size={18} color="hsl(var(--glamora-gold))" />}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)" }}>
              {isMale ? "Grooming" : "Makeup"}
            </div>
            <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.45)", marginTop: 1 }}>
              {isMale ? "Hair & skincare" : "Beauty & color picks"}
            </div>
          </div>
        </div>
      </div>


      {/* Saved & Tiers — compact inline row */}
      <div className="anim-fadeUp d2" style={{ padding: "10px 20px 0", display: "flex", gap: 10 }}>
        <div className="glamora-card" onClick={onSaved} style={{
          flex: 1, padding: "12px 14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10, position: "relative",
          background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.08), hsla(0 0% 100% / 0.04))`,
          border: "1.5px solid hsla(0 0% 100% / 0.12)",
          boxShadow: "0 4px 16px hsla(0 0% 0% / 0.35), inset 0 1px 0 hsla(0 0% 100% / 0.06)",
        }}>
          <Bookmark size={16} color={`hsl(${accent})`} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)" }}>Saved Looks</div>
            <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.45)" }}>{savedCount} saved</div>
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
          background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.08), hsla(0 0% 100% / 0.04))`,
          border: "1.5px solid hsla(0 0% 100% / 0.12)",
          boxShadow: "0 4px 16px hsla(0 0% 0% / 0.35), inset 0 1px 0 hsla(0 0% 100% / 0.06)",
        }}>
          <Zap size={16} color="hsl(var(--glamora-success))" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)" }}>3 Price Tiers</div>
            <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.45)" }}>Luxury to budget</div>
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
                border: `1.5px solid hsla(0 0% 100% / 0.12)`,
                background: `linear-gradient(160deg, hsla(var(--glamora-gold) / 0.1), hsla(0 0% 100% / 0.05))`,
                boxShadow: "0 4px 14px hsla(0 0% 0% / 0.35), inset 0 1px 0 hsla(0 0% 100% / 0.06)",
              }}
            >
              <item.icon size={16} color={`hsl(${accent})`} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)" }}>{item.title}</div>
              <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.45)", marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Nav */}
      <div className="bottom-nav">
        <button className="nav-btn active"><span className="nav-icon"><Home size={20} /></span><span className="nav-label">Home</span></button>
        <button className="nav-btn" onClick={() => onGetStyled()}><span className="nav-icon"><Scissors size={20} /></span><span className="nav-label">Style</span></button>
        <button className="nav-btn" onClick={onSaved}><span className="nav-icon"><Bookmark size={20} /></span><span className="nav-label">Saved</span></button>
        <button className="nav-btn" onClick={onProfile}><span className="nav-icon"><User size={20} /></span><span className="nav-label">Profile</span></button>
      </div>

      {/* Secret PIN overlay */}
      {showPin && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(14,10,9,0.92)", backdropFilter: "blur(12px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            padding: "30px 24px", borderRadius: 20,
            background: "rgba(30,22,18,0.95)",
            border: "1px solid rgba(196,151,74,0.2)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(251,246,240,0.7)", letterSpacing: 1 }}>
              Enter PIN
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 40, height: 48, borderRadius: 10,
                  border: pinError ? "2px solid rgba(255,80,80,0.6)" : pin[i] ? "2px solid rgba(196,151,74,0.6)" : "2px solid rgba(196,151,74,0.2)",
                  background: pin[i] ? "rgba(196,151,74,0.1)" : "rgba(255,255,255,0.03)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 700, color: "rgba(196,151,74,0.9)", transition: "all 0.2s",
                }}>
                  {pin[i] ? "•" : ""}
                </div>
              ))}
            </div>
            <input
              type="tel" inputMode="numeric" maxLength={4} value={pin} autoFocus
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter" && pin.length === 4) handlePinSubmit(); }}
              style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
            />
            {pinError && <div style={{ fontSize: 11, color: "rgba(255,80,80,0.8)", fontWeight: 500 }}>Incorrect PIN</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowPin(false)} style={{
                padding: "8px 20px", borderRadius: 10, border: "1px solid rgba(196,151,74,0.2)",
                background: "transparent", color: "rgba(251,246,240,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
              <button onClick={handlePinSubmit} disabled={pin.length < 4} style={{
                padding: "8px 20px", borderRadius: 10, border: "none",
                background: pin.length === 4 ? "rgba(196,151,74,0.8)" : "rgba(196,151,74,0.2)",
                color: pin.length === 4 ? "white" : "rgba(251,246,240,0.3)",
                fontSize: 12, fontWeight: 600, cursor: pin.length === 4 ? "pointer" : "default", transition: "all 0.2s",
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
