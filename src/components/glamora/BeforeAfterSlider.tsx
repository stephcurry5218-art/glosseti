import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  height?: number;
}

const BeforeAfterSlider = ({ beforeSrc, afterSrc, height = 420 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const directionLocked = useRef<"horizontal" | "vertical" | null>(null);

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
    // Don't capture yet — wait to determine direction
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (directionLocked.current === "vertical") return;

    const dx = Math.abs(e.clientX - startX.current);
    const dy = Math.abs(e.clientY - startY.current);

    if (!directionLocked.current && (dx > 5 || dy > 5)) {
      if (dy > dx) {
        directionLocked.current = "vertical";
        return; // let the page scroll
      }
      directionLocked.current = "horizontal";
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    if (dragging.current) {
      e.preventDefault();
      updatePosition(e.clientX);
    }
  }, [updatePosition]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    directionLocked.current = null;
  }, []);

  // Quick-jump buttons
  const jumpTo = (pos: number) => setSliderPos(pos);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          position: "relative",
          width: "100%",
          height,
          borderRadius: 22,
          overflow: "hidden",
          cursor: "ew-resize",
          touchAction: "pan-y",
          userSelect: "none",
        }}
      >
        {/* After (full) */}
        <img src={afterSrc} alt="After" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

        {/* Before (clipped) */}
        <div style={{ position: "absolute", inset: 0, width: `${sliderPos}%`, overflow: "hidden" }}>
          <img src={beforeSrc} alt="Before" style={{ position: "absolute", top: 0, left: 0, width: containerRef.current?.offsetWidth || "100%", height: "100%", objectFit: "cover" }} />
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

        {/* Drag handle — large touch target */}
        <div style={{
          position: "absolute", top: "50%", left: `${sliderPos}%`, transform: "translate(-50%, -50%)",
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
          border: "3px solid white", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11,
          gap: 2,
        }}>
          <ChevronLeft size={18} color="white" strokeWidth={2.5} />
          <ChevronRight size={18} color="white" strokeWidth={2.5} />
        </div>

        {/* Top/bottom edge glow for depth */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "linear-gradient(to top, hsla(0 0% 0% / 0.4), transparent)",
          pointerEvents: "none", zIndex: 5,
        }} />
      </div>

      {/* Quick-jump controls below the slider */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        marginTop: 12, padding: "0 8px",
      }}>
        <button onClick={() => jumpTo(0)} style={{
          padding: "8px 14px", borderRadius: 12, border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
          background: sliderPos < 5 ? "hsla(var(--glamora-rose-dark) / 0.15)" : "hsl(var(--glamora-cream2))",
          cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'Jost', sans-serif",
          color: sliderPos < 5 ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))",
          transition: "all 0.2s",
        }}>
          Before Only
        </button>

        {/* Mini slider track */}
        <div style={{
          flex: 1, maxWidth: 120, height: 6, borderRadius: 3,
          background: "hsla(var(--glamora-gray-light) / 0.3)", position: "relative",
          cursor: "pointer",
        }} onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = ((e.clientX - rect.left) / rect.width) * 100;
          setSliderPos(Math.max(0, Math.min(100, pct)));
        }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: `${sliderPos}%`,
            borderRadius: 3,
            background: "linear-gradient(90deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
            transition: dragging.current ? "none" : "width 0.15s ease",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: `${sliderPos}%`, transform: "translate(-50%, -50%)",
            width: 14, height: 14, borderRadius: "50%",
            background: "hsl(var(--glamora-gold))", border: "2px solid white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }} />
        </div>

        <button onClick={() => jumpTo(100)} style={{
          padding: "8px 14px", borderRadius: 12, border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
          background: sliderPos > 95 ? "hsla(var(--glamora-rose-dark) / 0.15)" : "hsl(var(--glamora-cream2))",
          cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'Jost', sans-serif",
          color: sliderPos > 95 ? "hsl(var(--glamora-rose-dark))" : "hsl(var(--glamora-gray))",
          transition: "all 0.2s",
        }}>
          After Only
        </button>
      </div>

      {/* Instruction hint */}
      <div style={{
        textAlign: "center", fontSize: 11, color: "hsl(var(--glamora-gray))",
        marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
          <ChevronLeft size={12} /> Drag <ChevronRight size={12} />
        </span>
        to compare · tap buttons to jump
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
