import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const NATIVE_GOOGLE_CLIENT_ID = "397756734481-noqav0d4im5v9r8bkrgqntrcucn9u5po.apps.googleusercontent.com";

const isAppleAuthSurface = () => {
  const platform = Capacitor.getPlatform();
  if (platform === "ios") return true;
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent || "";
  const vendor = navigator.vendor || "";
  const isIPhoneOrIPad = /iPhone|iPad|iPod/i.test(userAgent);
  const isIPadDesktopMode = /Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
  const isAppleBrowserOrDevice = /Apple/i.test(vendor) && !/Android/i.test(userAgent);

  return isIPhoneOrIPad || isIPadDesktopMode || isAppleBrowserOrDevice;
};

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

const ForgotPasswordView = ({ onBack, accent, accentLight, inputStyle, iconWrap }: {
  onBack: () => void; accent: string; accentLight: string;
  inputStyle: React.CSSProperties; iconWrap: React.CSSProperties;
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Check your email for a reset link!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen enter" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">Reset Password</div>
          <div className="header-sub">We'll send you a reset link</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "0 22px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ textAlign: "center", margin: "24px 0 12px" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 12px",
            background: `linear-gradient(135deg, hsl(${accentLight}), hsl(${accent}))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 8px 28px hsla(28 40% 52% / 0.3)`,
          }}>
            <Mail size={28} color="white" />
          </div>
        </div>
        {sent ? (
          <div className="anim-fadeUp" style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: 15, color: "hsl(var(--glamora-char))", fontFamily: "'Jost', sans-serif", lineHeight: 1.6 }}>
              A password reset link has been sent to <strong>{email}</strong>. Check your inbox and follow the link to set a new password.
            </p>
            <button onClick={onBack} style={{
              marginTop: 20, padding: "14px 32px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
              color: "white", fontSize: 14, fontWeight: 600, fontFamily: "'Jost', sans-serif", cursor: "pointer",
            }}>Back to Sign In</button>
          </div>
        ) : (
          <>
            <div className="anim-fadeUp" style={{ position: "relative" }}>
              <div style={iconWrap}><Mail size={18} color={`hsl(${accent})`} /></div>
              <input type="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <button className="anim-fadeUp d1" onClick={handleReset} disabled={loading} style={{
              width: "100%", padding: "16px", borderRadius: 16, border: "none",
              background: `linear-gradient(135deg, hsl(${accent}), hsl(${accentLight}))`,
              color: "white", fontSize: 15, fontWeight: 600, fontFamily: "'Jost', sans-serif",
              cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
            }}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const AuthScreen = ({ onBack, onSuccess }: Props) => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
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

  if (mode === "forgot") {
    return <ForgotPasswordView onBack={() => setMode("signin")} accent={accent} accentLight={accentLight} inputStyle={inputStyle} iconWrap={iconWrap} />;
  }

  return (
    <div className="screen enter" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div>
          <div className="header-title">{mode === "signin" ? "Welcome Back" : "Create Account"}</div>
          <div className="header-sub">{mode === "signin" ? "Sign in to your profile" : "Join the Glosseti community"}</div>
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
            <img src="/glosseti-icon-only.png" alt="Glosseti" style={{ width: 48, height: 48, objectFit: "contain" }} />
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

        {/* Forgot password link (sign-in only) */}
        {mode === "signin" && (
          <div className="anim-fadeUp d2" style={{ textAlign: "right", marginTop: -8 }}>
            <button onClick={() => setMode("forgot")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: `hsl(${accent})`, fontSize: 12, fontWeight: 500,
              fontFamily: "'Jost', sans-serif",
            }}>Forgot password?</button>
          </div>
        )}

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

        {/* Divider — only shown when there is a social option below (Google on non-Apple surfaces) */}
        {showGoogleSignIn && (
          <div className="anim-fadeUp d3" style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "hsla(var(--glamora-gray-light) / 0.3)" }} />
            <span style={{ fontSize: 12, color: "hsl(var(--glamora-gray))", fontFamily: "'Jost', sans-serif" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "hsla(var(--glamora-gray-light) / 0.3)" }} />
          </div>
        )}

        {/* Google Sign In — completely omitted on Apple devices and iOS simulators */}
        {showGoogleSignIn && (
        <button
          className="anim-fadeUp d4"
          onClick={async () => {
            if (!showGoogleSignIn) return;
            setLoading(true);
            const platform = Capacitor.getPlatform();
            const isNativeRuntime =
              Capacitor.isNativePlatform() ||
              platform === "ios" ||
              platform === "android" ||
              window.location.protocol === "capacitor:" ||
              window.location.protocol === "ionic:";

            try {
              if (isNativeRuntime) {
                // Native (iOS/Android): use the native Google Sign-In SDK,
                // then exchange the ID token with Supabase for a session.
                // Never use the hosted web OAuth broker inside the Capacitor WebView.
                // Use a non-statically-analyzable specifier so Vite/Rollup does not try
                // to resolve this package at build time. The package is intentionally not
                // installed (Google sign-in is disabled on iOS); this branch only runs on
                // Android where it can be added back if needed.
                const pkg = "@codetrix-studio/capacitor-google-auth";
                const { GoogleAuth } = await import(/* @vite-ignore */ pkg);
                console.log("[GoogleAuth][native-app] start", {
                  platform,
                  href: window.location.href,
                  protocol: window.location.protocol,
                  hasCapacitorBridge: !!(window as any).Capacitor,
                });

                await GoogleAuth.initialize({
                  clientId: NATIVE_GOOGLE_CLIENT_ID,
                  scopes: ["profile", "email"],
                  grantOfflineAccess: true,
                });

                const googleUser: any = await GoogleAuth.signIn();
                const idToken: string | undefined =
                  googleUser?.authentication?.idToken || googleUser?.idToken;

                if (!idToken) {
                  console.error("[GoogleAuth][native-app] no idToken", googleUser);
                  toast.error("Google sign in failed — no identity token returned");
                  return;
                }

                const { data, error } = await supabase.auth.signInWithIdToken({
                  provider: "google",
                  token: idToken,
                });

                console.log("[GoogleAuth][native-app] token exchange", {
                  hasSession: !!data?.session,
                  userId: data?.user?.id,
                  error: error?.message,
                });

                if (error || !data.session) {
                  toast.error(error?.message || "Google sign in failed");
                  return;
                }

                toast.success("Welcome!");
                onSuccess();
                return;
              }

              // Web flow only. This route must never be used inside iOS/Android WebViews.
              console.log("[GoogleAuth][web] start");
              const result = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (!result) { toast.error("Sign in was cancelled"); return; }
              if (result.error) { toast.error(result.error?.message || "Google sign in failed"); return; }
              if (result.redirected) return;
              toast.success("Welcome!");
              onSuccess();
            } catch (err: any) {
              console.error("[GoogleAuth] error", err);
              toast.error(err?.message || "Google sign in failed. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          style={{
            width: "100%", padding: "16px", borderRadius: 16, border: "1.5px solid hsla(var(--glamora-gray-light) / 0.25)",
            background: "hsl(var(--glamora-cream2))", color: "hsl(var(--glamora-char))", fontSize: 15, fontWeight: 600,
            fontFamily: "'Jost', sans-serif", cursor: loading ? "wait" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
            minHeight: 48, WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Sign in with Google
        </button>
        )}

        {/* Apple Sign In removed — email-only on iOS */}

        {/* Toggle mode */}
        <div className="anim-fadeUp d5" style={{ textAlign: "center", marginTop: 8 }}>
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
