import { useState, useEffect, useRef } from "react";
import { Scissors, Bookmark, Settings, MessageCircle, Star, User, ChevronRight, LogOut, LogIn, Crown, Camera, Pencil, Check, X, Shield, RotateCcw, Trash2 } from "lucide-react";
import { restorePurchases, isIAPAvailable } from "./subscription/iapService";
import type { LucideIcon } from "lucide-react";
import type { Gender } from "./GlamoraApp";
import type { User as SupaUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  onSettings?: () => void;
}

const ProfileScreen = ({ onBack, savedCount, onSaved, onGetStyled, gender, user, onSignOut, onSignIn, subscription, onShowPaywall, onSettings }: Props) => {
  const isMale = gender === "male";
  const accent = "var(--glamora-gold)";
  const accentLight = "var(--glamora-gold-light)";

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name, gender, avatar_url").eq("id", user.id).single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [user]);

  const handleSaveName = async () => {
    if (!user || !editValue.trim()) return;
    const { error } = await supabase.from("profiles").update({ display_name: editValue.trim() }).eq("id", user.id);
    if (error) {
      toast.error("Failed to update name");
    } else {
      setDisplayName(editValue.trim());
      toast.success("Name updated");
    }
    setIsEditingName(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${urlData.publicUrl}?t=${Date.now()}`;

    await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
    setAvatarUrl(url);
    setUploading(false);
    toast.success("Avatar updated");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not signed in");
      const res = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.error) throw res.error;
      toast.success("Account deleted");
      setShowDeleteConfirm(false);
      await supabase.auth.signOut();
      onSignOut();
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const userName = displayName || user?.email?.split("@")[0] || "Glosseti User";

  const menuItems: { Icon: LucideIcon; label: string; action?: () => void }[] = [
    { Icon: Scissors, label: "Get Styled", action: onGetStyled },
    { Icon: Bookmark, label: "Saved Styles", action: onSaved },
    { Icon: Settings, label: "Settings", action: onSettings },
    { Icon: MessageCircle, label: "Support", action: () => { window.location.href = "/support"; } },
    { Icon: Shield, label: "Privacy Policy", action: () => { window.location.href = "/privacy"; } },
    { Icon: Shield, label: "Terms of Use", action: () => { window.location.href = "/terms"; } },
    { Icon: Star, label: "Rate Glosseti", action: undefined },
    { Icon: RotateCcw, label: "Restore Purchases", action: async () => {
      if (!isIAPAvailable()) {
        toast.info("Restore is available in the Glosseti app on iOS.");
        return;
      }
      toast.loading("Restoring purchases…", { id: "restore" });
      try {
        await restorePurchases();
        toast.success("Purchases restored!", { id: "restore" });
      } catch {
        toast.error("Could not restore purchases", { id: "restore" });
      }
    }},
  ];

  if (user) {
    menuItems.push({ Icon: Trash2, label: "Delete Account", action: () => setShowDeleteConfirm(true) });
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
          <div style={{ position: "relative", marginBottom: 14 }}>
            <div style={{
              width: 90, height: 90, borderRadius: "50%",
              background: avatarUrl ? "none" : `linear-gradient(135deg, hsl(${accentLight}) 0%, hsl(${accent}) 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
              boxShadow: `0 8px 30px hsla(28 40% 52% / 0.3)`,
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <User size={40} color="hsl(var(--glamora-char))" strokeWidth={1.2} />
              )}
            </div>
            {user && (
              <>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    position: "absolute", bottom: 0, right: -4,
                    width: 30, height: 30, borderRadius: "50%",
                    background: `hsl(${accent})`,
                    border: "2px solid hsl(var(--glamora-cream))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Camera size={14} color="hsl(var(--glamora-char))" />
                </button>
              </>
            )}
          </div>

          {/* Editable name */}
          {isEditingName ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                style={{
                  fontSize: 20, fontFamily: "inherit",
                  background: "hsla(var(--glamora-gray-light) / 0.1)",
                  border: `1px solid hsl(${accent})`,
                  borderRadius: 8, padding: "6px 12px",
                  color: "hsl(var(--glamora-char))",
                  textAlign: "center", width: 180,
                  outline: "none",
                }}
              />
              <button onClick={handleSaveName} style={{ color: `hsl(${accent})`, background: "none", border: "none", cursor: "pointer" }}>
                <Check size={20} />
              </button>
              <button onClick={() => setIsEditingName(false)} style={{ color: "hsl(var(--glamora-gray))", background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="serif" style={{ fontSize: 24, color: "hsl(var(--glamora-char))" }}>{userName}</div>
              {user && (
                <button
                  onClick={() => { setEditValue(displayName || ""); setIsEditingName(true); }}
                  style={{ color: `hsl(${accent})`, background: "none", border: "none", cursor: "pointer" }}
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          )}

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

      {/* Delete Account Confirmation */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}>
          <div style={{
            background: "hsl(var(--glamora-cream))",
            borderRadius: 16, padding: 28, maxWidth: 340, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "hsl(var(--glamora-char))", marginBottom: 8 }}>
              Delete Account
            </div>
            <div style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.5, marginBottom: 6 }}>
              This will permanently delete your account and all associated data including saved styles, usage history, and uploaded images.
            </div>
            <div style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", lineHeight: 1.5, marginBottom: 16 }}>
              This action <strong style={{ color: "#c00" }}>cannot be undone</strong>. Type <strong>DELETE</strong> to confirm.
            </div>
            <input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              style={{
                width: "100%", padding: "10px 14px", fontSize: 15,
                border: "1.5px solid hsla(var(--glamora-gray-light) / 0.3)",
                borderRadius: 10, marginBottom: 16, fontFamily: "inherit",
                color: "hsl(var(--glamora-char))", background: "hsla(var(--glamora-gray-light) / 0.06)",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 10,
                  border: "1.5px solid hsla(var(--glamora-gray-light) / 0.3)",
                  background: "transparent", fontSize: 14, fontWeight: 600,
                  color: "hsl(var(--glamora-char))", cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 10,
                  border: "none",
                  background: deleteConfirmText === "DELETE" ? "#c00" : "hsla(var(--glamora-gray-light) / 0.2)",
                  color: deleteConfirmText === "DELETE" ? "#fff" : "hsl(var(--glamora-gray))",
                  fontSize: 14, fontWeight: 600, cursor: deleteConfirmText === "DELETE" ? "pointer" : "default",
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? "Deleting…" : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
