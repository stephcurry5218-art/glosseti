import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const AuthScreen = ({ onBack, onSuccess }: Props) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const accent = "var(--glamora-gold)";
  const accentLight = "var(--glamora-gold-light)";

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (mode === "signup" && !displayName) {
      toast.error("Please enter a display name");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Check your email to verify your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        onSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 14px 14px 44px", borderRadius: 14,
    background: "hsl(var(--glamora-cream2))",
    border: "1.5px solid hsla(var(--glamora-gray-light) / 0.2)",
    color: "hsl(var(--glamora-char))", fontSize: 14,
    fontFamily: "'Jost', sans-serif", outline: "none",
    transition: "border-color 0.2s",
  };

  const iconWrap: React.CSSProperties = {
    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
  };

  return (
    <div className="screen enter" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">{mode === "signin" ? "Welcome Back" : "Create Account"}</div>
          <div className="header-sub">{mode === "signin" ? "Sign in to your profile" : "Join the Glamora community"}</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 22px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Logo area */}
        <div className="anim-fadeUp" style={{ textAlign: "center", margin: "8px 0 20px" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", margin: "0 auto 12px",
            background: `linear-gradient(135deg, hsl(${accentLight}), hsl(${accent}))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 8px 28px hsla(28 40% 52% / 0.3)`,
          }}>
            <User size={32} color="white" />
          </div>
          <div className="serif" style={{ fontSize: 22, color: "hsl(var(--glamora-char))" }}>
            GLAMORA<span style={{ color: `hsl(${accent})` }}>.</span>
          </div>
        </div>

        {/* Display name (signup only) */}
        {mode === "signup" && (
          <div className="anim-fadeUp" style={{ position: "relative" }}>
            <div style={iconWrap}><User size={18} color={`hsl(${accent})`} /></div>
            <input
              type="text" placeholder="Display name" value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {/* Email */}
        <div className="anim-fadeUp d1" style={{ position: "relative" }}>
          <div style={iconWrap}><Mail size={18} color={`hsl(${accent})`} /></div>
          <input
            type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div className="anim-fadeUp d2" style={{ position: "relative" }}>
          <div style={iconWrap}><Lock size={18} color={`hsl(${accent})`} /></div>
          <input
            type={showPassword ? "text" : "password"} placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: 0,
            }}
          >
            {showPassword
              ? <EyeOff size={18} color="hsl(var(--glamora-gray))" />
              : <Eye size={18} color="hsl(var(--glamora-gray))" />
            }
          </button>
        </div>

        {/* Submit */}
        <button
          className="anim-fadeUp d3"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "16px", borderRadius: 16, border: "none",
            background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
            color: "white", fontSize: 15, fontWeight: 600,
            fontFamily: "'Jost', sans-serif", cursor: loading ? "wait" : "pointer",
            boxShadow: `0 6px 20px hsla(28 40% 52% / 0.35)`,
            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
            marginTop: 8,
          }}
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        {/* Toggle mode */}
        <div className="anim-fadeUp d4" style={{ textAlign: "center", marginTop: 8 }}>
          <span style={{ fontSize: 13, color: "hsl(var(--glamora-gray))" }}>
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: `hsl(${accent})`, fontSize: 13, fontWeight: 600,
              fontFamily: "'Jost', sans-serif",
            }}
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
