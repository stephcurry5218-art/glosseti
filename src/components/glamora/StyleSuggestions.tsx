import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, ChevronRight, RefreshCw, Brain, Lock, CalendarDays, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Gender, StyleCategory } from "./GlamoraApp";

interface Suggestion {
  title: string;
  description: string;
  category: StyleCategory;
  confidence: number;
  reasoning: string;
}

interface Props {
  gender: Gender;
  isLoggedIn: boolean;
  onSelectStyle: (category: StyleCategory) => void;
  onSignIn: () => void;
}

const OCCASIONS = [
  { id: "date-night", label: "Date Night", emoji: "💕" },
  { id: "job-interview", label: "Job Interview", emoji: "💼" },
  { id: "wedding-guest", label: "Wedding Guest", emoji: "💒" },
  { id: "brunch", label: "Brunch", emoji: "🥂" },
  { id: "night-out", label: "Night Out", emoji: "🌙" },
  { id: "vacation", label: "Vacation", emoji: "✈️" },
  { id: "gym", label: "Gym / Active", emoji: "💪" },
  { id: "work", label: "Office Day", emoji: "🏢" },
  { id: "festival", label: "Festival", emoji: "🎶" },
  { id: "family-event", label: "Family Event", emoji: "👨‍👩‍👧" },
];

const StyleSuggestions = ({ gender, isLoggedIn, onSelectStyle, onSignIn }: Props) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [activeOccasionLabel, setActiveOccasionLabel] = useState<string | null>(null);
  const accent = "var(--glamora-gold)";

  const fetchSuggestions = async (occasion?: string | null) => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("style-suggestions", {
        body: { gender, occasion: occasion || undefined },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setSuggestions(data.suggestions || []);
      setHistoryCount(data.historyCount || 0);
      if (occasion) {
        const found = OCCASIONS.find(o => o.id === occasion);
        setActiveOccasionLabel(found?.label || occasion);
      } else {
        setActiveOccasionLabel(null);
      }
    } catch (e: any) {
      console.error("Failed to fetch suggestions:", e);
      setError("Couldn't load suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchSuggestions();
  }, [isLoggedIn, gender]);

  const handleOccasionSelect = (occasionId: string) => {
    if (selectedOccasion === occasionId) {
      // Deselect — go back to general suggestions
      setSelectedOccasion(null);
      fetchSuggestions(null);
    } else {
      setSelectedOccasion(occasionId);
      fetchSuggestions(occasionId);
    }
  };

  const clearOccasion = () => {
    setSelectedOccasion(null);
    setActiveOccasionLabel(null);
    fetchSuggestions(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="anim-fadeUp d3" style={{ padding: "0 20px", marginTop: 14 }}>
        <div
          className="glamora-card"
          onClick={onSignIn}
          style={{
            padding: "16px",
            cursor: "pointer",
            background: `linear-gradient(160deg, hsla(${accent} / 0.06), hsl(var(--card)))`,
            border: `1.5px solid hsla(${accent} / 0.12)`,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, hsla(${accent} / 0.18), hsla(var(--glamora-gold-light) / 0.1))`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={18} color={`hsl(${accent})`} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
              AI Style Memory
            </div>
            <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 2 }}>
              Sign in to get personalized suggestions
            </div>
          </div>
          <ChevronRight size={16} color={`hsl(${accent})`} />
        </div>
      </div>
    );
  }

  return (
    <div className="anim-fadeUp d3" style={{ padding: "0 20px", marginTop: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
          <Brain size={13} color={`hsl(${accent})`} />
          <span>For You</span>
          {historyCount > 0 && (
            <span style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 100,
              background: `hsla(${accent} / 0.12)`, color: `hsl(${accent})`,
              fontWeight: 600,
            }}>
              {historyCount} looks learned
            </span>
          )}
        </div>
        <button
          onClick={() => fetchSuggestions(selectedOccasion)}
          disabled={loading}
          style={{
            background: "none", border: "none", cursor: loading ? "default" : "pointer",
            padding: 4, display: "flex", alignItems: "center",
          }}
        >
          <RefreshCw
            size={14}
            color={`hsl(${accent})`}
            style={{
              animation: loading ? "spin 1s linear infinite" : "none",
              opacity: loading ? 0.5 : 1,
            }}
          />
        </button>
      </div>

      {/* Occasion Picker */}
      <div style={{ marginBottom: 10 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
        }}>
          <CalendarDays size={12} color={`hsl(${accent})`} />
          <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1.5 }}>
            Style me for…
          </span>
          {activeOccasionLabel && !loading && (
            <button onClick={clearOccasion} style={{
              marginLeft: "auto", display: "flex", alignItems: "center", gap: 3,
              background: `hsla(${accent} / 0.1)`, border: "none", borderRadius: 100,
              padding: "2px 8px", cursor: "pointer", fontSize: 9, fontWeight: 600,
              color: `hsl(${accent})`,
            }}>
              <X size={10} /> Clear
            </button>
          )}
        </div>
        <div style={{
          display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4,
          scrollbarWidth: "none",
        }}>
          {OCCASIONS.map((occ) => {
            const isActive = selectedOccasion === occ.id;
            return (
              <button
                key={occ.id}
                onClick={() => handleOccasionSelect(occ.id)}
                disabled={loading}
                style={{
                  flexShrink: 0,
                  padding: "6px 12px", borderRadius: 100,
                  border: isActive
                    ? `1.5px solid hsl(${accent})`
                    : "1.5px solid hsla(var(--glamora-gray-light) / 0.2)",
                  background: isActive
                    ? `linear-gradient(135deg, hsl(${accent}), hsl(var(--glamora-gold-light)))`
                    : "hsl(var(--card))",
                  cursor: loading ? "default" : "pointer",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "white" : "hsl(var(--glamora-char))",
                  transition: "all 0.25s ease",
                  display: "flex", alignItems: "center", gap: 4,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: 13 }}>{occ.emoji}</span>
                {occ.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active occasion badge */}
      {activeOccasionLabel && !loading && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 12px", borderRadius: 12, marginBottom: 10,
          background: `linear-gradient(135deg, hsla(${accent} / 0.08), hsla(var(--glamora-gold-light) / 0.04))`,
          border: `1px solid hsla(${accent} / 0.15)`,
        }}>
          <Sparkles size={13} color={`hsl(${accent})`} />
          <span style={{ fontSize: 11, color: "hsl(var(--glamora-char))", fontWeight: 600 }}>
            Styled for <em style={{ color: `hsl(${accent})`, fontStyle: "italic" }}>{activeOccasionLabel}</em> based on your history
          </span>
        </div>
      )}

      {/* Suggestions */}
      {loading && suggestions.length === 0 ? (
        <div className="glamora-card" style={{
          padding: "20px 16px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <Sparkles size={16} color={`hsl(${accent})`} style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
          <span style={{ fontSize: 12, color: "hsl(var(--glamora-gray))" }}>
            {selectedOccasion ? "Styling for your occasion…" : "Analyzing your style DNA…"}
          </span>
        </div>
      ) : error ? (
        <div className="glamora-card" style={{
          padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 12, color: "hsl(var(--glamora-gray))" }}>{error}</span>
          <button onClick={() => fetchSuggestions(selectedOccasion)} style={{
            background: `hsl(${accent})`, color: "white", border: "none",
            borderRadius: 8, padding: "4px 12px", fontSize: 11, cursor: "pointer",
          }}>Retry</button>
        </div>
      ) : (
        <div style={{
          display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none",
          opacity: loading ? 0.5 : 1, transition: "opacity 0.3s",
        }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="glamora-card"
              onClick={() => onSelectStyle(s.category as StyleCategory)}
              style={{
                minWidth: 160, maxWidth: 180, padding: "14px 12px", cursor: "pointer",
                border: `1px solid hsla(${accent} / 0.15)`,
                background: `linear-gradient(160deg, hsla(${accent} / 0.06), transparent)`,
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Confidence badge */}
              <div style={{
                position: "absolute", top: 8, right: 8,
                fontSize: 9, fontWeight: 700,
                color: `hsl(${accent})`,
                background: `hsla(${accent} / 0.1)`,
                padding: "2px 6px", borderRadius: 100,
              }}>
                {s.confidence}% match
              </div>

              <Sparkles size={14} color={`hsl(${accent})`} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))", marginBottom: 4, paddingRight: 50 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", lineHeight: 1.4, marginBottom: 6 }}>
                {s.description}
              </div>
              <div style={{
                fontSize: 9, color: `hsl(${accent})`, fontStyle: "italic",
                borderTop: `1px solid hsla(${accent} / 0.1)`,
                paddingTop: 6, marginTop: "auto",
              }}>
                💡 {s.reasoning}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleSuggestions;
