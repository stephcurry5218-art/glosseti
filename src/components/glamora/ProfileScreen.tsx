interface Props {
  onBack: () => void;
  savedCount: number;
}

const ProfileScreen = ({ onBack, savedCount }: Props) => (
  <div className="screen enter" style={{ minHeight: "100%" }}>
    <div className="screen-header">
      <button className="back-btn" onClick={onBack}>←</button>
      <div>
        <div className="header-title">Profile</div>
        <div className="header-sub">Your beauty journey</div>
      </div>
    </div>

    <div style={{ padding: "0 22px" }}>
      {/* Avatar */}
      <div className="anim-fadeUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
        <div style={{
          width: 90, height: 90, borderRadius: "50%",
          background: "linear-gradient(135deg, hsl(var(--glamora-rose)) 0%, hsl(var(--glamora-gold)) 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40, marginBottom: 14,
          boxShadow: "0 8px 30px hsla(12 39% 54% / 0.3)",
        }}>
          👤
        </div>
        <div className="serif" style={{ fontSize: 24, color: "hsl(var(--glamora-char))" }}>Glamora User</div>
        <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>Beauty Enthusiast</div>
      </div>

      {/* Stats */}
      <div className="anim-fadeUp d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Scans", value: savedCount > 0 ? "1" : "0" },
          { label: "Saved", value: String(savedCount) },
          { label: "Looks", value: savedCount > 0 ? "3" : "0" },
        ].map((s) => (
          <div key={s.label} className="glamora-card" style={{ padding: "18px 12px", textAlign: "center" }}>
            <div className="serif" style={{ fontSize: 28, color: "hsl(var(--glamora-rose-dark))" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="anim-fadeUp d3" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          { icon: "⚙️", label: "Settings" },
          { icon: "🔔", label: "Notifications" },
          { icon: "💬", label: "Support" },
          { icon: "⭐", label: "Rate Glamora" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px 4px",
              borderBottom: "1px solid hsla(16 20% 11% / 0.06)",
              cursor: "pointer", fontSize: 15, color: "hsl(var(--glamora-char))",
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            {item.label}
            <span style={{ marginLeft: "auto", fontSize: 14, color: "hsl(var(--glamora-gray-light))" }}>›</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProfileScreen;
