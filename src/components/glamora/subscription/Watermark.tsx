const Watermark = () => (
  <div style={{
    position: "absolute", bottom: 12, right: 12, zIndex: 10,
    padding: "4px 10px", borderRadius: 8,
    background: "hsla(0 0% 0% / 0.5)", backdropFilter: "blur(4px)",
    fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
    color: "hsla(0 0% 100% / 0.7)", fontFamily: "'Jost', sans-serif",
    textTransform: "uppercase", pointerEvents: "none",
    userSelect: "none",
  }}>
    GLOSSETI FREE
  </div>
);

export default Watermark;
