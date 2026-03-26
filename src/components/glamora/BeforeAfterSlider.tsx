import { useRef, useState, useCallback } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  height?: number;
}

const BeforeAfterSlider = ({ beforeSrc, afterSrc, height = 420 }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
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
        touchAction: "none",
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
        position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 8,
        background: "hsla(0 0% 0% / 0.5)", backdropFilter: "blur(6px)",
        fontSize: 11, fontWeight: 600, color: "white", letterSpacing: 1, textTransform: "uppercase",
      }}>Before</div>
      <div style={{
        position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 8,
        background: "hsla(0 0% 0% / 0.5)", backdropFilter: "blur(6px)",
        fontSize: 11, fontWeight: 600, color: "white", letterSpacing: 1, textTransform: "uppercase",
      }}>After</div>

      {/* Slider line + handle */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${sliderPos}%`, transform: "translateX(-50%)",
        width: 3, background: "white", boxShadow: "0 0 8px rgba(0,0,0,0.4)", zIndex: 10,
      }} />
      <div style={{
        position: "absolute", top: "50%", left: `${sliderPos}%`, transform: "translate(-50%, -50%)",
        width: 40, height: 40, borderRadius: "50%",
        background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
        border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 11,
        fontSize: 16, color: "white", fontWeight: 700,
      }}>
        ⟺
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
