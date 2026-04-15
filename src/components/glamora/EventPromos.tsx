import { useState } from "react";
import { ArrowRight, Crown, GraduationCap, Heart, Sun, PartyPopper, Star, Sparkles, Gift, Flower2, Ghost, Flag, Baby, TreePine } from "lucide-react";
import type { StyleCategory } from "./GlamoraApp";
import { PROMOS, getCurrentPromo, type SeasonalPromo, type HolidayPick } from "./SeasonalBanner";

// Event-specific promos (subset with dayRange = specific events, not generic seasons)
const EVENT_IDS = [
  "prom-season", "graduation", "back-to-school", "valentines", "easter",
  "mothers-day", "fathers-day", "halloween", "thanksgiving", "holiday",
  "july-4th", "memorial-day", "new-year", "spring-break", "black-friday",
];

function getUpcomingEvents(): SeasonalPromo[] {
  const now = new Date();
  const month = now.getMonth();
  const currentPromo = getCurrentPromo();

  // Get all event promos, sort by proximity to current date
  const events = PROMOS.filter(p => EVENT_IDS.includes(p.id) && p.id !== currentPromo.id);

  // Sort: current month first, then upcoming months wrapping around
  return events.sort((a, b) => {
    const aMonth = a.months[0];
    const bMonth = b.months[0];
    const aDist = (aMonth - month + 12) % 12;
    const bDist = (bMonth - month + 12) % 12;
    return aDist - bDist;
  }).slice(0, 8); // Show up to 8 events
}

interface Props {
  onHolidayPick: (holidayId: string) => void;
}

const EventPromos = ({ onHolidayPick }: Props) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const events = getUpcomingEvents();

  if (events.length === 0) return null;

  return (
    <div className="anim-fadeUp d2" style={{ marginTop: 14 }}>
      {/* Section header */}
      <div style={{ padding: "0 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Sparkles size={14} color="hsl(var(--glamora-gold))" />
        <span style={{
          fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
          color: "hsla(0 0% 100% / 0.8)",
          fontFamily: "'Jost', sans-serif",
        }}>
          STYLE BY EVENT
        </span>
        <div style={{
          flex: 1, height: 1,
          background: "linear-gradient(90deg, hsla(var(--glamora-gold) / 0.2), transparent)",
        }} />
      </div>

      {/* Horizontally scrollable event chips */}
      <div style={{
        display: "flex", gap: 10, overflowX: "auto", padding: "0 20px 4px",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}>
        {events.map((event) => {
          const Icon = event.icon;
          const isExpanded = expandedEvent === event.id;

          return (
            <div key={event.id} style={{ flexShrink: 0 }}>
              <button
                onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 100, cursor: "pointer",
                  background: isExpanded
                    ? event.gradient
                    : "hsla(0 0% 100% / 0.06)",
                  border: `1.5px solid ${isExpanded ? event.border : "hsla(0 0% 100% / 0.1)"}`,
                  transition: "all 0.3s ease",
                  boxShadow: isExpanded
                    ? `0 2px 12px ${event.accentColor.replace(")", " / 0.2)")}`
                    : "none",
                }}
              >
                <Icon size={14} color={isExpanded ? event.accentColor : "hsla(0 0% 100% / 0.5)"} />
                <span style={{
                  fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                  color: isExpanded ? "hsla(0 0% 100% / 0.95)" : "hsla(0 0% 100% / 0.6)",
                  fontFamily: "'Jost', sans-serif",
                }}>
                  {event.title.replace(/\s?[🎒🎃🍂✨🎓👑👔🇺🇸☀️🌸🍁❄️🥂💕🏖️🐣🎆🎁🔥💐🦃🎄⚽📚😎]/g, "").trim()}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Expanded picks grid */}
      {expandedEvent && (() => {
        const event = events.find(e => e.id === expandedEvent);
        if (!event) return null;
        const Icon = event.icon;

        return (
          <div style={{
            margin: "10px 20px 0", borderRadius: 18, overflow: "hidden",
            background: event.gradient,
            border: `1px solid ${event.border}`,
            backdropFilter: "blur(12px)",
            animation: "fadeIn 0.3s ease",
          }}>
            {/* Event header */}
            <div style={{
              padding: "14px 16px 10px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon size={18} color={event.accentColor} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "hsla(0 0% 100% / 0.95)" }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: 10, color: "hsla(0 0% 100% / 0.5)", marginTop: 1 }}>
                    {event.subtitle}
                  </div>
                </div>
              </div>
            </div>

            {/* Style picks */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              padding: "0 12px 14px",
            }}>
              {event.picks.map((pick, i) => (
                <div
                  key={i}
                  onClick={() => onHolidayPick(event.id)}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 14,
                    cursor: "pointer",
                    background: "hsla(0 0% 100% / 0.06)",
                    border: "1px solid hsla(0 0% 100% / 0.08)",
                    transition: "all 0.2s ease",
                    display: "flex", flexDirection: "column", gap: 4,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${event.accentColor.replace(")", " / 0.12)")}`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${event.accentColor.replace(")", " / 0.25)")}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "hsla(0 0% 100% / 0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = "hsla(0 0% 100% / 0.08)";
                  }}
                >
                  <span style={{ fontSize: 20 }}>{pick.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "hsla(0 0% 100% / 0.9)" }}>
                    {pick.label}
                  </span>
                  <span style={{ fontSize: 9.5, color: "hsla(0 0% 100% / 0.45)", lineHeight: 1.3 }}>
                    {pick.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EventPromos;
