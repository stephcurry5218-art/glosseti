import { useState } from "react";
import { Share2, X, Copy, Check } from "lucide-react";
import { shareToSocial, type SharePlatform } from "./shareUtils";

interface Props {
  text: string;
  imageUrl?: string;
  trigger?: React.ReactNode;
}

const platforms: { id: SharePlatform; label: string; icon: string; color: string }[] = [
  { id: "twitter", label: "X / Twitter", icon: "𝕏", color: "#000" },
  { id: "facebook", label: "Facebook", icon: "f", color: "#1877F2" },
  { id: "pinterest", label: "Pinterest", icon: "P", color: "#E60023" },
  { id: "whatsapp", label: "WhatsApp", icon: "W", color: "#25D366" },
];

const ShareMenu = ({ text, imageUrl, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async (platform: SharePlatform) => {
    const success = await shareToSocial(platform, { text, imageUrl });
    if (platform === "copy" && success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    if (platform !== "copy") setOpen(false);
  };

  const handleNative = async () => {
    if (navigator.share) {
      await shareToSocial("native", { text, imageUrl });
      setOpen(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
        {trigger || (
          <button className="btn-primary btn-ghost" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Share2 size={16} /> Share
          </button>
        )}
      </div>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300 }} />
          <div style={{
            position: "absolute", bottom: "calc(100% + 8px)", right: 0, zIndex: 301,
            background: "hsl(var(--glamora-cream))", borderRadius: 18, padding: 14,
            border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
            boxShadow: "0 8px 32px hsla(0 0% 0% / 0.18)",
            minWidth: 200, animation: "fadeUp 0.2s ease both",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--glamora-char))", fontFamily: "'Jost', sans-serif" }}>
                Share via
              </span>
              <button onClick={() => setOpen(false)} style={{
                width: 24, height: 24, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "hsla(var(--glamora-gray-light) / 0.2)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <X size={12} color="hsl(var(--glamora-gray))" />
              </button>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              {platforms.map((p) => (
                <button key={p.id} onClick={() => handleShare(p.id)} style={{
                  width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
                  background: p.color, color: "white", fontSize: 18, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "sans-serif", transition: "transform 0.15s",
                }} title={p.label}>
                  {p.icon}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleShare("copy")} style={{
                flex: 1, padding: "10px 12px", borderRadius: 12,
                border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
                background: copied ? "hsla(var(--glamora-success) / 0.1)" : "hsl(var(--glamora-cream2))",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontSize: 12, fontWeight: 600, fontFamily: "'Jost', sans-serif",
                color: copied ? "hsl(var(--glamora-success))" : "hsl(var(--glamora-char))",
                transition: "all 0.2s",
              }}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
              </button>
              {typeof navigator !== "undefined" && navigator.share && (
                <button onClick={handleNative} style={{
                  flex: 1, padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, hsl(var(--glamora-rose-dark)), hsl(var(--glamora-gold)))",
                  color: "white", fontSize: 12, fontWeight: 600, fontFamily: "'Jost', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Share2 size={14} /> More
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareMenu;
