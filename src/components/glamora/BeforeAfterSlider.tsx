import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  maxHeight?: number;
}

const BeforeAfterSlider = ({ beforeSrc, afterSrc, maxHeight = 520 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const directionLocked = useRef<"horizontal" | "vertical" | null>(null);
  const [activeTab, setActiveTab] = useState<"compare" | "before" | "after">("compare");

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    directionLocked.current = null;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (directionLocked.current === "vertical") return;
    const dx = Math.abs(e.clientX - startX.current);
    const dy = Math.abs(e.clientY - startY.current);
    if (!directionLocked.current && (dx > 5 || dy > 5)) {
      if (dy > dx) { directionLocked.current = "vertical"; return; }
      directionLocked.current = "horizontal";
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (dragging.current) { e.preventDefault(); updatePosition(e.clientX); }
  }, [updatePosition]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    directionLocked.current = null;
  }, []);

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    background: "hsl(var(--glamora-char))",
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Tab switcher */}
      <div style={{
        display: "flex", gap: 4, marginBottom: 10, padding: "3px",
        borderRadius: 14, background: "hsla(var(--glamora-gray-light) / 0.12)",
      }}>
        {([
          { id: "before" as const, label: "Before" },
          { id: "compare" as const, label: "Compare" },
          { id: "after" as const, label: "After" },
        ]).map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: "9px 8px", borderRadius: 11, border: "none",
            background: activeTab === tab.id ? "hsl(var(--card))" : "transparent",
            boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
            cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: 12, fontWeight: 600,
            color: activeTab === tab.id ? "hsl(var(--glamora-char))" : "hsl(var(--glamora-gray))",
            transition: "all 0.2s",
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        onPointerDown={activeTab === "compare" ? onPointerDown : undefined}
        onPointerMove={activeTab === "compare" ? onPointerMove : undefined}
        onPointerUp={activeTab === "compare" ? onPointerUp : undefined}
        style={{
          position: "relative",
          width: "100%",
          maxHeight,
          aspectRatio: "3 / 4",
          borderRadius: 22,
          overflow: "hidden",
          cursor: activeTab === "compare" ? "ew-resize" : "default",
          touchAction: "pan-y",
          userSelect: "none",
          background: "hsl(var(--glamora-char))",
        }}
      >
        {activeTab === "before" && (
          <img src={beforeSrc} alt="Before" style={imgStyle} />
        )}

        {activeTab === "after" && (
          <img src={afterSrc} alt="After" style={imgStyle} />
        )}

        {activeTab === "compare" && (
          <>
            {/* After (full) */}
            <img src={afterSrc} alt="After" style={{ ...imgStyle, position: "absolute", inset: 0 }} />

            {/* Before (clipped) */}
            <div style={{ position: "absolute", inset: 0, width: `${sliderPos}%`, overflow: "hidden" }}>
              <img src={beforeSrc} alt="Before" style={{
                ...imgStyle,
                position: "absolute", top: 0, left: 0,
                width: containerRef.current?.offsetWidth || "100%",
              }} />
            </div>

            {/* Labels */}
            <div style={{
              position: "absolute", top: 14, left: 14, padding: "5px 12px", borderRadius: 10,
              background: "hsla(0 0% 0% / 0.55)", backdropFilter: "blur(8px)",
              fontSize: 11, fontWeight: 600, color: "white", letterSpacing: 1.2, textTransform: "uppercase",
              opacity: sliderPos > 15 ? 1 : 0, transition: "opacity 0.2s",
            }}>Before</div>
            <div style={{
              position: "absolute", top: 14, right: 14, padding: "5px 12px", borderRadius: 10,
              background: "hsla(0 0% 0% / 0.55)", backdropFilter: "blur(8px)",
              fontSize: 11, fontWeight: 600, color: "white", letterSpacing: 1.2, textTransform: "uppercase",
              opacity: sliderPos < 85 ? 1 : 0, transition: "opacity 0.2s",
            }}>After</div>

            {/* Slider line */}
            <div style={{
              position: "absolute", top: 0, bottom: 0, left: `${sliderPos}%`, transform: "translateX(-50%)",
              width: 3, background: "white", boxShadow: "0 0 10px rgba(0,0,0,0.5)", zIndex: 10,
            }} />

            {/* Drag handle */}
            <div style={{
              position: "absolute", top: "50%", left: `${sliderPos}%`, transform: "translate(-50%, -50%)",
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
              border: "3px solid white", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11, gap: 2,
            }}>
              <ChevronLeft size={18} color="white" strokeWidth={2.5} />
              <ChevronRight size={18} color="white" strokeWidth={2.5} />
            </div>
          </>
        )}

        {/* Bottom gradient */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "linear-gradient(to top, hsla(0 0% 0% / 0.4), transparent)",
          pointerEvents: "none", zIndex: 5,
        }} />
      </div>

      {/* Hint */}
      {activeTab === "compare" && (
        <div style={{
          textAlign: "center", fontSize: 11, color: "hsl(var(--glamora-gray))",
          marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
            <ChevronLeft size={12} /> Drag <ChevronRight size={12} />
          </span>
          to compare
        </div>
      )}
    </div>
  );
};

export default BeforeAfterSlider;
