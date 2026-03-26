import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import SplashScreen from "./SplashScreen";
import EntranceScreen from "./EntranceScreen";
import HomeScreen from "./HomeScreen";
import StylePickerScreen from "./StylePickerScreen";
import UploadScreen from "./UploadScreen";
import LoadingScreen from "./LoadingScreen";
import StyledResultScreen from "./StyledResultScreen";
import TutorialScreen from "./TutorialScreen";
import ProfileScreen from "./ProfileScreen";
import SavedLooksScreen from "./SavedLooksScreen";
import StylistChat from "./StylistChat";
import AuthScreen from "./AuthScreen";
import PaywallScreen from "./subscription/PaywallScreen";
import UpgradePrompt from "./subscription/UpgradePrompt";
import { useSubscription } from "./subscription/useSubscription";

export type StyleCategory = "full-style" | "streetwear" | "formal" | "casual" | "makeup-only" | "minimalist" | "vintage" | "athleisure" | "bohemian" | "preppy" | "edgy" | "resort" | "grooming" | "sexy" | "swimwear" | "urban-hiphop" | "rugged" | "techwear" | "date-night";
export type PhotoType = "selfie" | "full-body";
export type Gender = "male" | "female";

type Screen = "splash" | "entrance" | "home" | "style-picker" | "upload" | "loading" | "results" | "tutorial" | "profile" | "saved" | "auth";

export interface UserPrefs {
  styleCategory: StyleCategory;
  photoType: PhotoType;
  photoFile: File | null;
  photoBase64: string | null;
  gender: Gender;
}

const GlamoraApp = () => {
  const [screen, setScreen] = useState<Screen>("splash");
  const [savedStyles, setSavedStyles] = useState<string[]>([]);
  const [selectedLook, setSelectedLook] = useState("Soft Glam");
  const [styledImageUrl, setStyledImageUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(() => !!localStorage.getItem("glamora_first_gen"));
  const [prefs, setPrefs] = useState<UserPrefs>({
    styleCategory: "full-style",
    photoType: "selfie",
    photoFile: null,
    photoBase64: null,
    gender: "female",
  });

  const {
    subscription,
    canGenerate,
    remainingGenerations,
    showWatermark,
    showPaywall,
    setShowPaywall,
    showUpgradePrompt,
    setShowUpgradePrompt,
    lockedFeature,
    tryGenerate,
    checkFeatureAccess,
    upgradeTo,
  } = useSubscription();

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => authSub.unsubscribe();
  }, []);

  const go = useCallback((s: Screen) => setScreen(s), []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    go("home");
  };

  // Intercept generation: check limits, prompt sign-up after first use
  const handleStartGeneration = useCallback((file: File, photoType: PhotoType, base64: string) => {
    // First generation is always free (even without sign-up)
    if (!hasGeneratedOnce) {
      setPrefs(p => ({ ...p, photoFile: file, photoType, photoBase64: base64 }));
      setHasGeneratedOnce(true);
      localStorage.setItem("glamora_first_gen", "1");
      go("loading");
      return;
    }

    // After first gen, prompt sign-up if not logged in
    if (!user) {
      go("auth");
      return;
    }

    // Check daily limit for free users
    if (!tryGenerate()) return;

    setPrefs(p => ({ ...p, photoFile: file, photoType, photoBase64: base64 }));
    go("loading");
  }, [hasGeneratedOnce, user, tryGenerate, go]);

  return (
    <div className="phone">
      {screen === "splash" && (
        <SplashScreen onDone={() => go("entrance")} />
      )}
      {screen === "entrance" && (
        <EntranceScreen onEnter={(gender) => {
          setPrefs(p => ({ ...p, gender }));
          go("home");
        }} />
      )}
      {screen === "home" && (
        <HomeScreen
          onGetStyled={(initialCategory?: StyleCategory) => {
            if (initialCategory) setPrefs(p => ({ ...p, styleCategory: initialCategory }));
            go("style-picker");
          }}
          onProfile={() => user ? go("profile") : go("auth")}
          onSaved={() => go("saved")}
          savedCount={savedStyles.length}
          gender={prefs.gender}
          onGenderToggle={(g) => setPrefs(p => ({ ...p, gender: g }))}
          subscription={subscription}
          remainingGenerations={remainingGenerations}
          onShowPaywall={() => setShowPaywall(true)}
        />
      )}
      {screen === "auth" && (
        <AuthScreen
          onBack={() => go("home")}
          onSuccess={() => go("home")}
        />
      )}
      {screen === "style-picker" && (
        <StylePickerScreen
          prefs={prefs}
          onBack={() => go("home")}
          onNext={(category: StyleCategory) => {
            setPrefs(p => ({ ...p, styleCategory: category }));
            go("upload");
          }}
        />
      )}
      {screen === "upload" && (
        <UploadScreen
          prefs={prefs}
          onBack={() => go("style-picker")}
          onAnalyze={handleStartGeneration}
        />
      )}
      {screen === "loading" && (
        <LoadingScreen
          prefs={prefs}
          onDone={(imageUrl: string | null) => {
            setStyledImageUrl(imageUrl);
            go("results");
          }}
        />
      )}
      {screen === "results" && (
        <StyledResultScreen
          prefs={prefs}
          styledImageUrl={styledImageUrl}
          onBack={() => go("upload")}
          onHome={() => go("home")}
          onSave={(lookNames: string[]) => {
            if (!checkFeatureAccess("Save & organize looks")) return;
            setSavedStyles(prev => [...new Set([...prev, ...lookNames])]);
            go("home");
          }}
          onLookSelect={(name: string) => {
            if (subscription.tier === "free" && !checkFeatureAccess("Full tutorials")) return;
            setSelectedLook(name);
            go("tutorial");
          }}
          onRegenerate={(tweakedCategory) => {
            if (!tryGenerate()) return;
            if (tweakedCategory) setPrefs(p => ({ ...p, styleCategory: tweakedCategory }));
            setStyledImageUrl(null);
            go("loading");
          }}
          showWatermark={showWatermark}
        />
      )}
      {screen === "tutorial" && (
        <TutorialScreen
          lookName={selectedLook}
          onBack={() => go("results")}
          onHome={() => go("home")}
        />
      )}
      {screen === "profile" && (
        <ProfileScreen
          onBack={() => go("home")}
          savedCount={savedStyles.length}
          onSaved={() => go("saved")}
          onGetStyled={() => go("style-picker")}
          gender={prefs.gender}
          user={user}
          onSignOut={handleSignOut}
          onSignIn={() => go("auth")}
          subscription={subscription}
          onShowPaywall={() => setShowPaywall(true)}
        />
      )}
      {screen === "saved" && (
        <SavedLooksScreen
          onBack={() => go("home")}
          savedStyles={savedStyles}
          onLookSelect={(name: string) => { setSelectedLook(name); go("tutorial"); }}
          onGetStyled={() => go("style-picker")}
          gender={prefs.gender}
        />
      )}
      {screen !== "splash" && screen !== "entrance" && screen !== "auth" && (
        <StylistChat gender={prefs.gender} />
      )}

      {/* Paywall overlay */}
      {showPaywall && (
        <PaywallScreen
          onClose={() => setShowPaywall(false)}
          onUpgrade={upgradeTo}
          remainingGenerations={remainingGenerations}
          lockedFeature={lockedFeature}
        />
      )}

      {/* Upgrade prompt for locked features */}
      {showUpgradePrompt && lockedFeature && (
        <UpgradePrompt
          feature={lockedFeature}
          onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={(tier) => upgradeTo(tier, tier === "premium")}
        />
      )}
    </div>
  );
};

export default GlamoraApp;
