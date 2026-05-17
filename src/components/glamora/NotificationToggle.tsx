import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "glosseti_notifications";
const PROMPTED_KEY = "glosseti_notifications_prompted";

const supportsNotifications = () =>
  typeof window !== "undefined" && "Notification" in window;

const NotificationToggle = () => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const pref = localStorage.getItem(STORAGE_KEY);
      if (pref === "off") return false;
      if (!supportsNotifications()) return false;
      return Notification.permission === "granted";
    } catch {
      return false;
    }
  });

  // Auto-request permission once (on by default)
  useEffect(() => {
    if (!supportsNotifications()) return;
    try {
      const prompted = localStorage.getItem(PROMPTED_KEY) === "1";
      const userPref = localStorage.getItem(STORAGE_KEY);
      if (prompted || userPref === "off") return;

      if (Notification.permission === "default") {
        localStorage.setItem(PROMPTED_KEY, "1");
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            localStorage.setItem(STORAGE_KEY, "on");
            setEnabled(true);
          } else {
            localStorage.setItem(STORAGE_KEY, "off");
            setEnabled(false);
          }
        });
      } else if (Notification.permission === "granted" && userPref !== "off") {
        localStorage.setItem(STORAGE_KEY, "on");
        setEnabled(true);
      }
    } catch {}
  }, []);

  const handleToggle = async () => {
    if (!supportsNotifications()) {
      toast.error("Notifications are not supported on this device");
      return;
    }
    if (enabled) {
      localStorage.setItem(STORAGE_KEY, "off");
      setEnabled(false);
      toast.success("Notifications off");
      return;
    }
    if (Notification.permission === "denied") {
      toast.error("Enable notifications in your device settings");
      return;
    }
    let perm = Notification.permission;
    if (perm !== "granted") {
      perm = await Notification.requestPermission();
    }
    if (perm === "granted") {
      localStorage.setItem(STORAGE_KEY, "on");
      setEnabled(true);
      toast.success("Notifications on");
    } else {
      localStorage.setItem(STORAGE_KEY, "off");
      setEnabled(false);
      toast.error("Notifications were not allowed");
    }
  };

  const Icon = enabled ? Bell : BellOff;

  return (
    <button
      onClick={handleToggle}
      aria-label={enabled ? "Disable notifications" : "Enable notifications"}
      title={enabled ? "Notifications on" : "Notifications off"}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: enabled
          ? "linear-gradient(135deg, hsl(var(--glamora-gold-light)), hsl(var(--glamora-gold)))"
          : "hsla(0 0% 0% / 0.4)",
        border: "1.5px solid hsla(0 0% 100% / 0.18)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: enabled
          ? "0 4px 14px hsla(var(--glamora-gold) / 0.35)"
          : "0 2px 8px hsla(0 0% 0% / 0.3)",
        transition: "all 0.25s ease",
      }}
    >
      <Icon size={15} color={enabled ? "white" : "hsla(0 0% 100% / 0.7)"} />
    </button>
  );
};

export default NotificationToggle;
