import { useState, useEffect } from "react";
import { ArrowLeft, Sun, Moon, Monitor, Bell, BellOff, Globe, Lock, ChevronRight, Smartphone, MessageSquarePlus, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Gender } from "./GlamoraApp";

export type ThemeMode = "dark" | "light" | "system";

export const getStoredTheme = (): ThemeMode =>
  (localStorage.getItem("glosseti_theme") as ThemeMode) || "dark";

export const applyTheme = (mode: ThemeMode) => {
  localStorage.setItem("glosseti_theme", mode);
  const root = document.documentElement;
  if (mode === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    root.setAttribute("data-theme", mode);
  }
};

interface Props {
  onBack: () => void;
  gender: Gender;
}

const SettingsScreen = ({ onBack, gender }: Props) => {
  const accent = "var(--glamora-gold)";
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme);
  const [notifications, setNotifications] = useState(() =>
    localStorage.getItem("glosseti_notifications") !== "off"
  );
  const [highQuality, setHighQuality] = useState(() =>
    localStorage.getItem("glosseti_hq") !== "off"
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleNotifications = (on: boolean) => {
    setNotifications(on);
    localStorage.setItem("glosseti_notifications", on ? "on" : "off");
    toast.success(on ? "Notifications enabled" : "Notifications disabled");
  };

  const handleHighQuality = (on: boolean) => {
    setHighQuality(on);
    localStorage.setItem("glosseti_hq", on ? "on" : "off");
    toast.success(on ? "High quality mode on" : "Standard quality mode");
  };

  const themeOptions: { id: ThemeMode; label: string; Icon: typeof Sun }[] = [
    { id: "dark", label: "Dark", Icon: Moon },
    { id: "light", label: "Light", Icon: Sun },
    { id: "system", label: "System", Icon: Monitor },
  ];

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Settings</div>
          <div className="header-sub">Customize your experience</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Theme section */}
        <div className="anim-fadeUp" style={{ marginBottom: 28 }}>
          <div className="section-label">Appearance</div>
          <div style={{
            display: "flex", gap: 6,
            background: "hsl(var(--card))",
            borderRadius: 16, padding: 4,
            border: "1px solid hsla(var(--glamora-gold) / 0.1)",
          }}>
            {themeOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                style={{
                  flex: 1, padding: "12px 8px", borderRadius: 12,
                  border: "none",
                  background: theme === opt.id
                    ? `linear-gradient(135deg, hsl(${accent}), hsl(var(--glamora-gold-light)))`
                    : "transparent",
                  cursor: "pointer", fontFamily: "'Jost', sans-serif",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  transition: "all 0.25s ease",
                }}
              >
                <opt.Icon size={20} color={theme === opt.id ? "white" : "hsl(var(--glamora-gray))"} />
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: theme === opt.id ? "white" : "hsl(var(--glamora-char))",
                }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle settings */}
        <div className="anim-fadeUp d1" style={{ marginBottom: 28 }}>
          <div className="section-label">Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Notifications */}
            <SettingToggle
              icon={notifications ? Bell : BellOff}
              label="Push Notifications"
              description="Style tips & new features"
              value={notifications}
              onChange={handleNotifications}
              accent={accent}
            />

            {/* High quality */}
            <SettingToggle
              icon={Smartphone}
              label="High Quality Mode"
              description="Higher resolution AI generations"
              value={highQuality}
              onChange={handleHighQuality}
              accent={accent}
            />
          </div>
        </div>

        {/* Info settings */}
        <div className="anim-fadeUp d2" style={{ marginBottom: 28 }}>
          <div className="section-label">About</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <SettingRow icon={Globe} label="Language" value="English" accent={accent} />
            <SettingRow icon={Lock} label="Version" value="1.0.0" accent={accent} />
          </div>
        </div>

        {/* Cache */}
        <div className="anim-fadeUp d3" style={{ paddingBottom: 40 }}>
          <button
            onClick={() => {
              localStorage.removeItem("glamora_gio_refinement");
              toast.success("Cache cleared");
            }}
            style={{
              width: "100%", padding: "14px", borderRadius: 14,
              border: "1.5px solid hsla(var(--glamora-gray-light) / 0.2)",
              background: "transparent",
              color: "hsl(var(--glamora-gray))", fontSize: 14, fontWeight: 500,
              fontFamily: "'Jost', sans-serif", cursor: "pointer",
            }}
          >
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Reusable setting components ── */

const SettingToggle = ({ icon: Icon, label, description, value, onChange, accent }: {
  icon: typeof Sun; label: string; description: string;
  value: boolean; onChange: (v: boolean) => void; accent: string;
}) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 4px",
      borderBottom: "1px solid hsla(var(--glamora-gray-light) / 0.15)",
      cursor: "pointer",
    }}
  >
    <Icon size={20} color={`hsl(${accent})`} />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, color: "hsl(var(--glamora-char))" }}>{label}</div>
      <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>{description}</div>
    </div>
    {/* Toggle switch */}
    <div style={{
      width: 44, height: 26, borderRadius: 13,
      background: value ? `hsl(${accent})` : "hsla(var(--glamora-gray-light) / 0.3)",
      padding: 3, cursor: "pointer", transition: "background 0.25s ease",
      display: "flex", alignItems: "center",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        background: "white",
        transform: value ? "translateX(18px)" : "translateX(0)",
        transition: "transform 0.25s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </div>
  </div>
);

const SettingRow = ({ icon: Icon, label, value, accent }: {
  icon: typeof Sun; label: string; value: string; accent: string;
}) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 14,
    padding: "14px 4px",
    borderBottom: "1px solid hsla(var(--glamora-gray-light) / 0.15)",
  }}>
    <Icon size={20} color={`hsl(${accent})`} />
    <div style={{ flex: 1, fontSize: 15, color: "hsl(var(--glamora-char))" }}>{label}</div>
    <span style={{ fontSize: 13, color: "hsl(var(--glamora-gray))" }}>{value}</span>
  </div>
);

export default SettingsScreen;
