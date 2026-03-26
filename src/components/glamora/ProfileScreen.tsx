import { useState, useEffect } from "react";
import { Scissors, Bookmark, Settings, MessageCircle, Star, User, ChevronRight, LogOut, LogIn } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Gender } from "./GlamoraApp";
import type { User as SupaUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

import type { SubscriptionState } from "./subscription/types";

interface Props {
  onBack: () => void;
  savedCount: number;
  onSaved: () => void;
  onGetStyled: () => void;
  gender: Gender;
  user: SupaUser | null;
  onSignOut: () => void;
  onSignIn: () => void;
  subscription?: SubscriptionState;
  onShowPaywall?: () => void;
}

const ProfileScreen = ({ onBack, savedCount, onSaved, onGetStyled, gender, user, onSignOut, onSignIn, subscription, onShowPaywall }: Props) => {
  const isMale = gender === "male";
  const accent = "var(--glamora-gold)";
  const accentLight = "var(--glamora-gold-light)";

  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name, gender").eq("id", user.id).single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });
  }, [user]);

  const userName = displayName || user?.email?.split("@")[0] || "Glamora User";

  const menuItems: { Icon: LucideIcon; label: string; action?: () => void }[] = [
    { Icon: Scissors, label: "Get Styled", action: onGetStyled },
    { Icon: Bookmark, label: "Saved Styles", action: onSaved },
    { Icon: Settings, label: "Settings", action: undefined },
    { Icon: MessageCircle, label: "Support", action: undefined },
    { Icon: Star, label: "Rate Glamora", action: undefined },
  ];

  if (user) {
    menuItems.push({ Icon: LogOut, label: "Sign Out", action: onSignOut });
  } else {
    menuItems.unshift({ Icon: LogIn, label: "Sign In / Sign Up", action: onSignIn });
  }

  return (
    <div className="screen enter" style={{ minHeight: "100%" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Profile</div>
          <div className="header-sub">{isMale ? "Your style journey" : "Your beauty journey"}</div>
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>
        {/* Avatar */}
        <div className="anim-fadeUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: `linear-gradient(135deg, hsl(${accentLight}) 0%, hsl(${accent}) 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 14,
            boxShadow: `0 8px 30px hsla(28 40% 52% / 0.3)`,
          }}>
            <User size={40} color="hsl(var(--glamora-char))" strokeWidth={1.2} />
          </div>
          <div className="serif" style={{ fontSize: 24, color: "hsl(var(--glamora-char))" }}>{userName}</div>
          <div style={{ fontSize: 13, color: "hsl(var(--glamora-gray))", marginTop: 4 }}>
            {user ? user.email : "Not signed in"}
          </div>
        </div>

        {/* Subscription tier */}
        {subscription && (
          <div className="anim-fadeUp d1" style={{ marginBottom: 20 }}>
            <div className="glamora-card" onClick={onShowPaywall} style={{
              padding: "16px", cursor: "pointer",
              background: subscription.tier !== "free"
                ? "linear-gradient(135deg, hsla(var(--glamora-gold) / 0.12), hsla(var(--glamora-gold-light) / 0.08))"
                : undefined,
              border: subscription.tier !== "free"
                ? "1.5px solid hsla(var(--glamora-gold) / 0.25)"
                : undefined,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <Crown size={20} color="hsl(var(--glamora-gold))" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--glamora-char))" }}>
                  {subscription.tier === "free" ? "Free Plan" : subscription.tier === "premium" ? "Premium" : "Pro"}
                  {subscription.isTrialing && <span style={{ fontSize: 11, color: "hsl(var(--glamora-gold))", marginLeft: 8 }}>Trial</span>}
                </div>
                <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))" }}>
                  {subscription.tier === "free" ? "Tap to upgrade" : "Manage subscription"}
                </div>
              </div>
              <ChevronRight size={16} color="hsl(var(--glamora-gray-light))" />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="anim-fadeUp d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Scans", value: savedCount > 0 ? "1" : "0" },
            { label: "Saved", value: String(savedCount) },
            { label: "Styles", value: savedCount > 0 ? "3" : "0" },
          ].map((s) => (
            <div key={s.label} className="glamora-card" style={{ padding: "18px 12px", textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 28, color: `hsl(${accent})` }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "hsl(var(--glamora-gray))", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="anim-fadeUp d3" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={item.action}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 4px",
                borderBottom: "1px solid hsla(var(--glamora-gray-light) / 0.15)",
                cursor: item.action ? "pointer" : "default",
                fontSize: 15, color: "hsl(var(--glamora-char))",
                opacity: item.action ? 1 : 0.5,
              }}
            >
              <item.Icon size={20} color={`hsl(${accent})`} />
              {item.label}
              <ChevronRight size={14} color="hsl(var(--glamora-gray-light))" style={{ marginLeft: "auto" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
