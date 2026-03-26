interface Props {
  onBack: () => void;
  hasSaved: boolean;
}

const savedLooks = [
  { name: "Soft Glam", emoji: "🌸", match: 96 },
  { name: "Golden Hour", emoji: "🌅", match: 93 },
  { name: "Berry Chic", emoji: "🍇", match: 89 },
];

const SavedLooksScreen = ({ onBack, hasSaved }: Props) => (
  <div className="screen enter" style={{ minHeight: "100%" }}>
    <div className="screen-header">
      <button className="back-btn" onClick={onBack}>←</button>
      <div>
        <div className="header-title">Saved Looks</div>
        <div className="header-sub">Your curated collection</div>
      </div>
    </div>

    <div style={{ padding: "0 22px" }}>
      {hasSaved ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {savedLooks.map((look, i) => (
            <div
              key={look.name}
              className={`glamora-card anim-fadeUp d${i + 1}`}
              style={{
                padding: "20px 18px", display: "flex", alignItems: "center", gap: 16,
                border: "1px solid hsla(36 50% 53% / 0.12)", cursor: "pointer",
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: "linear-gradient(135deg, hsla(12 52% 85% / 0.5), hsla(36 72% 88% / 0.5))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0,
              }}>
                {look.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>{look.name}</div>
                <div style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>
                  {look.match}% match
                </div>
              </div>
              <span style={{ fontSize: 20, color: "hsl(var(--glamora-rose-dark))" }}>❤️</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="anim-fadeUp" style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "80px 20px", textAlign: "center",
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>💄</div>
          <div className="serif" style={{ fontSize: 22, color: "hsl(var(--glamora-char))", marginBottom: 8 }}>
            No Saved Looks Yet
          </div>
          <p style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.6 }}>
            Complete a face scan and save your results to see them here.
          </p>
        </div>
      )}
    </div>
  </div>
);

export default SavedLooksScreen;
