import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Recovery params can appear in hash or query string
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes("type=recovery") || search.includes("type=recovery")) setReady(true);
    // If already authenticated (recovery link auto-signs-in), allow password update
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      toast.success("Password updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const accent = "var(--glamora-gold)";
  const accentLight = "var(--glamora-gold-light)";

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 14px 14px 44px", borderRadius: 14,
    background: "hsl(var(--glamora-cream2))",
    border: "1.5px solid hsla(var(--glamora-gray-light) / 0.2)",
    color: "hsl(var(--glamora-char))", fontSize: 14,
    fontFamily: "'Jost', sans-serif", outline: "none",
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
      background: "hsl(var(--glamora-bg))",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/glosseti-icon-only.png" alt="Glosseti" style={{ width: 56, height: 56, margin: "0 auto 12px" }} />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "hsl(var(--glamora-char))", fontFamily: "'Playfair Display', serif" }}>
            {success ? "All Set!" : "Set New Password"}
          </h1>
        </div>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <CheckCircle size={48} color={`hsl(${accent})`} style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 14, color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif", marginBottom: 20 }}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <a href="/" style={{
              display: "inline-block", padding: "14px 32px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
              color: "white", fontSize: 14, fontWeight: 600, fontFamily: "'Jost', sans-serif",
              textDecoration: "none",
            }}>Back to App</a>
          </div>
        ) : !ready ? (
          <p style={{ textAlign: "center", fontSize: 14, color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif" }}>
            Loading recovery session...
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                <Lock size={18} color={`hsl(${accent})`} />
              </div>
              <input type={showPassword ? "text" : "password"} placeholder="New password"
                value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
              <button onClick={() => setShowPassword(!showPassword)} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}>
                {showPassword ? <EyeOff size={18} color="hsl(var(--glamora-gray))" /> : <Eye size={18} color="hsl(var(--glamora-gray))" />}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                <Lock size={18} color={`hsl(${accent})`} />
              </div>
              <input type={showPassword ? "text" : "password"} placeholder="Confirm password"
                value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={handleSubmit} disabled={loading} style={{
              width: "100%", padding: "16px", borderRadius: 16, border: "none",
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
              color: "white", fontSize: 15, fontWeight: 600, fontFamily: "'Jost', sans-serif",
              cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
