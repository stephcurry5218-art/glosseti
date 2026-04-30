import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Heart } from "lucide-react";
import { isFavorited, toggleFavorite } from "./savedInspiration";

interface Props {
  images: string[];
  startIndex: number;
  title?: string;
  category?: string;
  subId?: string;
  onClose: () => void;
}

const ImageLightbox = ({ images, startIndex, title, category, subId, onClose }: Props) => {
  const [index, setIndex] = useState(startIndex);
  const [faved, setFaved] = useState(() => isFavorited(images[startIndex]));

  // Refresh fav state when slide changes or external changes happen
  useEffect(() => {
    setFaved(isFavorited(images[index]));
    const handler = () => setFaved(isFavorited(images[index]));
    window.addEventListener("glamora:inspo-favs-changed", handler);
    return () => window.removeEventListener("glamora:inspo-favs-changed", handler);
  }, [images, index]);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setIndex(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, []);

  // Touch swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if (delta > 50) prev();
    else if (delta < -50) next();
    setTouchStart(null);
  };

  if (!images.length) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10, 4, 0, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {/* Top bar */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px",
          color: "hsl(var(--glamora-gold))",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85, fontFamily: "'Jost', sans-serif" }}>
          {title ? `${title} · ` : ""}{index + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          aria-label="Close gallery"
          style={{
            width: 40, height: 40, borderRadius: 20,
            border: "1px solid hsla(var(--glamora-gold) / 0.3)",
            background: "hsla(var(--glamora-gold) / 0.08)",
            color: "hsl(var(--glamora-gold))",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Image area */}
      <div
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          flex: 1, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 12px",
          overflow: "hidden",
        }}
      >
        <img
          src={images[index]}
          alt={`${title || "Inspiration"} ${index + 1}`}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: "100%", maxHeight: "100%",
            objectFit: "contain",
            borderRadius: 14,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            animation: "lightboxFade 0.25s ease",
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                width: 46, height: 46, borderRadius: 23,
                border: "1px solid hsla(var(--glamora-gold) / 0.3)",
                background: "hsla(0 0% 0% / 0.55)",
                color: "hsl(var(--glamora-gold))",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", backdropFilter: "blur(8px)",
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                width: 46, height: 46, borderRadius: 23,
                border: "1px solid hsla(var(--glamora-gold) / 0.3)",
                background: "hsla(0 0% 0% / 0.55)",
                color: "hsl(var(--glamora-gold))",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", backdropFilter: "blur(8px)",
              }}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            display: "flex", gap: 8, padding: "12px 16px 18px",
            overflowX: "auto", justifyContent: "center",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                flexShrink: 0, width: 48, height: 60,
                borderRadius: 8, overflow: "hidden",
                border: i === index
                  ? "2px solid hsl(var(--glamora-gold))"
                  : "1px solid hsla(var(--glamora-gold) / 0.2)",
                padding: 0, cursor: "pointer",
                background: "transparent",
                transition: "all 0.2s",
                opacity: i === index ? 1 : 0.6,
              }}
            >
              <img
                src={src}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes lightboxFade {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ImageLightbox;
