import { useState, useEffect } from "react";
import { ArrowLeft, MessageSquarePlus, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Suggestion {
  id: string;
  suggestion: string;
  category: string;
  created_at: string;
  user_id: string | null;
}

interface Props {
  onBack: () => void;
}

const categoryColors: Record<string, string> = {
  general: "hsl(var(--glamora-gold))",
  styles: "#a78bfa",
  features: "#60a5fa",
  ui: "#34d399",
  bug: "#f87171",
};

const AdminSuggestionsScreen = ({ onBack }: Props) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchSuggestions = async () => {
    setLoading(true);
    const query = supabase
      .from("app_suggestions")
      .select("*")
      .order("created_at", { ascending: false });

    const { data } = await query;
    setSuggestions((data as Suggestion[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSuggestions(); }, []);

  const filtered = filter === "all"
    ? suggestions
    : suggestions.filter(s => s.category === filter);

  const counts = suggestions.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div style={{ flex: 1 }}>
          <div className="header-title">Suggestions</div>
          <div className="header-sub">{suggestions.length} total submissions</div>
        </div>
        <button
          onClick={fetchSuggestions}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "hsl(var(--glamora-gold))", padding: 8,
          }}
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {["all", "general", "styles", "features", "ui", "bug"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                fontFamily: "'Jost', sans-serif", cursor: "pointer", border: "none",
                background: filter === cat
                  ? (cat === "all" ? "hsl(var(--glamora-gold))" : categoryColors[cat] || "hsl(var(--glamora-gold))")
                  : "hsla(var(--glamora-gray-light) / 0.15)",
                color: filter === cat ? "white" : "hsl(var(--glamora-gray))",
                transition: "all 0.2s",
              }}
            >
              {cat === "all" ? `All (${suggestions.length})` : `${cat} (${counts[cat] || 0})`}
            </button>
          ))}
        </div>

        {/* Suggestions list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "hsl(var(--glamora-gray))" }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <MessageSquarePlus size={32} color="hsl(var(--glamora-gray))" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 14, color: "hsl(var(--glamora-gray))" }}>No suggestions yet</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 40 }}>
            {filtered.map(s => (
              <div
                key={s.id}
                className="glamora-card"
                style={{ padding: 14 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    color: categoryColors[s.category] || "hsl(var(--glamora-gray))",
                    letterSpacing: "0.05em",
                  }}>
                    {s.category}
                  </span>
                  <span style={{ fontSize: 10, color: "hsl(var(--glamora-gray))" }}>
                    {new Date(s.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
                <div style={{
                  fontSize: 13, color: "hsl(var(--glamora-char))",
                  lineHeight: 1.5, whiteSpace: "pre-wrap",
                }}>
                  {s.suggestion}
                </div>
                {s.user_id && (
                  <div style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", marginTop: 6 }}>
                    User: {s.user_id.slice(0, 8)}…
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSuggestionsScreen;
