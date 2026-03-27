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
  { id: "instagram", label: "Instagram", icon: "📷", color: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" },
  { id: "tiktok", label: "TikTok", icon: "♪", color: "#000" },
  { id: "snapchat", label: "Snapchat", icon: "👻", color: "#FFFC00" },
  { id: "facebook", label: "Facebook", icon: "f", color: "#1877F2" },
  { id: "pinterest", label: "Pinterest", icon: "P", color: "#E60023" },
  { id: "whatsapp", label: "WhatsApp", icon: "W", color: "#25D366" },
  { id: "telegram", label: "Telegram", icon: "✈", color: "#0088cc" },
  { id: "linkedin", label: "LinkedIn", icon: "in", color: "#0A66C2" },
  { id: "reddit", label: "Reddit", icon: "R", color: "#FF4500" },
  { id: "email", label: "Email", icon: "✉", color: "#666" },
];

const ShareMenu = ({ text, imageUrl, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState("");

  const handleShare = async (platform: SharePlatform) => {
    // Instagram, TikTok, Snapchat don't have web share URLs — copy link instead
    const copyOnlyPlatforms: SharePlatform[] = ["instagram", "tiktok", "snapchat"];
    if (copyOnlyPlatforms.includes(platform)) {
      const success = await shareToSocial("copy", { text: text + `\n\nStyled with #Glosseti ✨`, imageUrl });
      if (success) {
        setCopied(true);
        setCopiedLabel(`Copied! Paste in ${platforms.find(p => p.id === platform)?.label}`);
        setTimeout(() => { setCopied(false); setCopiedLabel(""); }, 3000);
      }
      return;
    }
    const success = await shareToSocial(platform, { text, imageUrl });
    if (platform === "copy" && success) {
      setCopied(true);
      setCopiedLabel("Copied!");
      setTimeout(() => { setCopied(false); setCopiedLabel(""); }, 2000);
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
              {platforms.map((p) => (
                <button key={p.id} onClick={() => handleShare(p.id)} style={{
                  width: 44, height: 44, borderRadius: 12, border: "none", cursor: "pointer",
                  background: p.color, color: p.id === "snapchat" ? "#000" : "white",
                  fontSize: p.icon.length > 1 ? 13 : 18, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "sans-serif", transition: "transform 0.15s",
                }} title={p.label}>
                  {p.icon}
                </button>
              ))}
            </div>

            {copied && copiedLabel && (
              <div style={{
                padding: "8px 12px", borderRadius: 10, marginBottom: 10,
                background: "hsla(var(--glamora-success) / 0.1)",
                border: "1px solid hsla(var(--glamora-success) / 0.3)",
                fontSize: 11, fontWeight: 600, color: "hsl(var(--glamora-success))",
                textAlign: "center", fontFamily: "'Jost', sans-serif",
              }}>
                ✅ {copiedLabel}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => handleShare("copy")} style={{
                flex: 1, padding: "10px 12px", borderRadius: 12,
                border: "1.5px solid hsla(var(--glamora-gold) / 0.2)",
                background: copied && !copiedLabel.includes("Paste") ? "hsla(var(--glamora-success) / 0.1)" : "hsl(var(--glamora-cream2))",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontSize: 12, fontWeight: 600, fontFamily: "'Jost', sans-serif",
                color: copied && !copiedLabel.includes("Paste") ? "hsl(var(--glamora-success))" : "hsl(var(--glamora-char))",
                transition: "all 0.2s",
              }}>
                {copied && !copiedLabel.includes("Paste") ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
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
