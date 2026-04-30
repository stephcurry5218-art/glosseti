import { useEffect, useState } from "react";
import { Bookmark, Heart, Sparkles, X } from "lucide-react";
import { lookMeta } from "./lookData";
import type { Gender } from "./GlamoraApp";
import { loadFavorites, removeFavorite, type SavedInspiration } from "./savedInspiration";
import ImageLightbox from "./ImageLightbox";

interface Props {
  onBack: () => void;
  savedStyles: string[];
  onLookSelect: (name: string) => void;
  onGetStyled: () => void;
  gender: Gender;
}

const SavedLooksScreen = ({ onBack, savedStyles, onLookSelect, onGetStyled, gender }: Props) => {
  const isMale = gender === "male";
  const accent = isMale ? "var(--glamora-gold)" : "var(--glamora-rose-dark)";
  const accentLight = isMale ? "var(--glamora-gold-light)" : "var(--glamora-rose)";

  const [favs, setFavs] = useState<SavedInspiration[]>(() => loadFavorites());
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    const refresh = () => setFavs(loadFavorites());
    window.addEventListener("glamora:inspo-favs-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("glamora:inspo-favs-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const isEmpty = savedStyles.length === 0 && favs.length === 0;

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Saved</div>
          <div className="header-sub">Your styles &amp; inspiration</div>
        </div>
      </div>

      <div style={{ padding: "0 22px", paddingBottom: 40 }}>
        {/* Inspiration favorites grid */}
        {favs.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Heart size={14} color={`hsl(${accent})`} fill={`hsl(${accent})`} />
              Saved Inspiration ({favs.length})
            </div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 12 }}>
              Tap an image to view full-screen, or × to remove
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
            }}>
              {favs.map((f, i) => (
                <div
                  key={f.url}
                  className="anim-fadeUp"
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "125%",
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "hsla(var(--glamora-gold) / 0.06)",
                    border: `1px solid hsla(${accent} / 0.18)`,
                    cursor: "zoom-in",
                  }}
                  onClick={() => setLightboxIdx(i)}
                >
                  <img
                    src={f.url}
                    alt={f.subLabel}
                    loading="lazy"
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", display: "block",
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Remove from saved"
                    onClick={e => {
                      e.stopPropagation();
                      removeFavorite(f.url);
                    }}
                    style={{
                      position: "absolute", top: 6, right: 6,
                      width: 26, height: 26, borderRadius: 13,
                      border: "none", padding: 0,
                      background: "hsla(0 0% 0% / 0.55)",
                      backdropFilter: "blur(6px)",
                      color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={14} />
                  </button>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "6px 8px",
                    background: "linear-gradient(transparent, hsla(0 0% 0% / 0.7))",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 500,
                    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}>
                    {f.subLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved styles list */}
        {savedStyles.length > 0 && (
          <div>
            <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Sparkles size={14} color={`hsl(${accent})`} />
              Saved Styles ({savedStyles.length})
            </div>
            <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginBottom: 16 }}>
              Tap any style to view the full guide with shopping links
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {savedStyles.map((name, i) => {
                const meta = lookMeta[name] || { match: 90, desc: "Custom style" };
                return (
                  <div key={name} className={`glamora-card anim-fadeUp d${i + 1}`} onClick={() => onLookSelect(name)}
                    style={{ padding: "20px 18px", display: "flex", alignItems: "center", gap: 16, border: `1px solid hsla(${isMale ? "var(--glamora-gold)" : "var(--glamora-rose)"} / 0.15)`, cursor: "pointer" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: `linear-gradient(135deg, hsla(${accentLight} / 0.15), hsla(${accent} / 0.1))`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles size={24} color={`hsl(${accent})`} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{name}</div>
                      <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>{meta.desc}</div>
                      <div style={{ fontSize: 11, color: "hsl(var(--glamora-success))", marginTop: 4, fontWeight: 600 }}>{meta.match}% match</div>
                    </div>
                    <Heart size={20} color={`hsl(${accent})`} fill={`hsl(${accent})`} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div className="anim-fadeUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
            <Bookmark size={64} color="hsl(var(--glamora-gray))" strokeWidth={1} style={{ marginBottom: 20 }} />
            <div className="serif" style={{ fontSize: 22, color: "hsl(var(--glamora-char))", marginBottom: 8 }}>Nothing Saved Yet</div>
            <p style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.6, marginBottom: 28 }}>
              Tap the heart on any inspiration image to save it, or get styled to save full looks.
            </p>
            <button className="btn-primary btn-rose" style={{
              maxWidth: 260,
              background: isMale ? "linear-gradient(135deg, hsl(var(--glamora-gold)), hsl(var(--glamora-gold-light)))" : undefined,
            }} onClick={onGetStyled}>Get Styled Now</button>
          </div>
        )}
      </div>

      {lightboxIdx !== null && favs[lightboxIdx] && (
        <ImageLightbox
          images={favs.map(f => f.url)}
          startIndex={lightboxIdx}
          title={favs[lightboxIdx].subLabel}
          category={favs[lightboxIdx].category}
          subId={favs[lightboxIdx].subId}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  );
};

export default SavedLooksScreen;
