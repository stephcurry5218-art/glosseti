import { useState, useEffect } from "react";
import { X, Download, Star } from "lucide-react";

const APP_STORE_URL = "https://apps.apple.com/app/glosseti/id000000000";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.glosseti.app";
const DISMISS_KEY = "glosseti_app_banner_dismissed";

const isNativeApp = () => {
  return !!(window as any).Capacitor?.isNativePlatform?.();
};

const isStandalone = () => {
  return window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true;
};

const AppDownloadSheet = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNativeApp() || isStandalone()) return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) return;
    }

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const primaryUrl = isIOS ? APP_STORE_URL : PLAY_STORE_URL;
  const primaryLabel = isIOS ? "App Store" : "Google Play";
  const secondaryUrl = isIOS ? PLAY_STORE_URL : APP_STORE_URL;
  const secondaryLabel = isIOS ? "Google Play" : "App Store";

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Sheet */}
      <div
        className="relative w-full max-w-md rounded-t-3xl bg-card border-t border-border px-6 pt-5 pb-8 animate-in slide-in-from-bottom duration-400"
      >
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/30" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-glamora-gold to-glamora-rose flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-primary-foreground font-display">G</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground font-display">
              Get the Glosseti App
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-glamora-gold text-glamora-gold" />
              ))}
              <span className="text-xs text-muted-foreground ml-1">Free download</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          Faster generations, offline access, and push notifications — all in one sleek app.
        </p>

        {/* Primary CTA */}
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-foreground text-background font-semibold text-sm transition hover:opacity-90 mb-3"
        >
          <Download size={16} />
          Download on {primaryLabel}
        </a>

        {/* Secondary CTA */}
        <a
          href={secondaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-border text-muted-foreground text-sm transition hover:text-foreground hover:border-foreground/30"
        >
          Also on {secondaryLabel}
        </a>
      </div>
    </div>
  );
};

export default AppDownloadSheet;
