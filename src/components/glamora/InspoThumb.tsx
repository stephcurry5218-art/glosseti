import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { isFavorited, toggleFavorite } from "./savedInspiration";

interface Props {
  src: string;
  category: string;
  subId: string;
  subLabel: string;
  accent: string; // CSS var name like "--glamora-gold"
  onOpen: () => void;
}

const InspoThumb = ({ src, category, subId, subLabel, accent, onOpen }: Props) => {
  const [faved, setFaved] = useState(() => isFavorited(src));

  useEffect(() => {
    const handler = () => setFaved(isFavorited(src));
    window.addEventListener("glamora:inspo-favs-changed", handler);
    return () => window.removeEventListener("glamora:inspo-favs-changed", handler);
  }, [src]);

  return (
    <div
      onClick={e => { e.stopPropagation(); onOpen(); }}
      style={{
        position: "relative",
        width: "100%",
        paddingTop: "125%",
        borderRadius: 8,
        overflow: "hidden",
        background: "hsla(var(--glamora-gold) / 0.06)",
        border: `1px solid hsla(var(${accent}) / 0.12)`,
        cursor: "zoom-in",
      }}
    >
      <img
        src={src}
        alt={`${subLabel} inspiration`}
        loading="lazy"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          display: "block",
        }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <button
        type="button"
        aria-label={faved ? "Remove from saved" : "Save to favorites"}
        onClick={e => {
          e.stopPropagation();
          const nowFaved = toggleFavorite({ url: src, category, subId, subLabel });
          setFaved(nowFaved);
        }}
        style={{
          position: "absolute",
          top: 6, right: 6,
          width: 28, height: 28, borderRadius: 14,
          border: "none",
          background: "hsla(0 0% 0% / 0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
          transition: "transform 0.15s",
        }}
        onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.88)"; }}
        onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        <Heart
          size={14}
          color={faved ? `hsl(var(${accent}))` : "white"}
          fill={faved ? `hsl(var(${accent}))` : "transparent"}
          strokeWidth={2}
        />
      </button>
    </div>
  );
};

export default InspoThumb;
