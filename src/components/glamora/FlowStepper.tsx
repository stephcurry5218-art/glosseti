import { Check, Sparkles, Camera, Wand2, Star } from "lucide-react";

export type FlowStep = "style" | "photo" | "generate" | "result";

const STEPS: { id: FlowStep; label: string; Icon: typeof Sparkles }[] = [
  { id: "style", label: "Style", Icon: Sparkles },
  { id: "photo", label: "Photo", Icon: Camera },
  { id: "generate", label: "Generate", Icon: Wand2 },
  { id: "result", label: "Result", Icon: Star },
];

interface Props {
  current: FlowStep;
  gender?: "male" | "female";
}

const FlowStepper = ({ current, gender = "female" }: Props) => {
  const isMale = gender === "male";
  const accent = isMale ? "--glamora-gold" : "--glamora-rose-dark";
  const activeIdx = STEPS.findIndex(s => s.id === current);
  const nextLabel = STEPS[activeIdx + 1]?.label;

  return (
    <div
      className="anim-fadeUp"
      style={{
        padding: "10px 22px 4px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      aria-label={`Step ${activeIdx + 1} of ${STEPS.length}: ${STEPS[activeIdx]?.label}`}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {STEPS.map((s, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          const dotBg = active
            ? `linear-gradient(135deg, hsl(var(${accent})), hsl(var(--glamora-gold-light)))`
            : done
              ? `hsla(var(${accent}) / 0.35)`
              : "hsla(var(--glamora-gold) / 0.12)";
          const iconColor = active || done ? "white" : `hsl(var(${accent}))`;
          return (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i === STEPS.length - 1 ? "0 0 auto" : 1, gap: 6 }}>
              <div
                style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: dotBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  border: active ? `1.5px solid hsl(var(${accent}))` : "1.5px solid transparent",
                  boxShadow: active ? `0 0 12px hsla(var(${accent}) / 0.45)` : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {done ? (
                  <Check size={13} color={iconColor} strokeWidth={3} />
                ) : (
                  <s.Icon size={12} color={iconColor} />
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, borderRadius: 2,
                  background: i < activeIdx
                    ? `hsla(var(${accent}) / 0.5)`
                    : "hsla(var(--glamora-gold) / 0.12)",
                  transition: "background 0.3s ease",
                }} />
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 0.4,
          color: `hsl(var(${accent}))`, textTransform: "uppercase",
        }}>
          Step {activeIdx + 1} of {STEPS.length} · {STEPS[activeIdx]?.label}
        </span>
        {nextLabel && (
          <span style={{ fontSize: 10, color: "hsl(var(--glamora-gray))", fontWeight: 500 }}>
            Next: {nextLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default FlowStepper;
