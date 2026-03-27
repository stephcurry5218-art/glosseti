import { useState, useCallback, useEffect, useRef } from "react";
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
import StylistChat, { type StylistChatHandle } from "./StylistChat";
import AuthScreen from "./AuthScreen";
import InspirationScreen from "./InspirationScreen";
import InspirationLoadingScreen from "./InspirationLoadingScreen";
import InspirationResultScreen from "./InspirationResultScreen";
import type { StyleProfile } from "./InspirationLoadingScreen";
import PaywallScreen from "./subscription/PaywallScreen";
import UpgradePrompt from "./subscription/UpgradePrompt";
import { useSubscription } from "./subscription/useSubscription";
import { useStyleHistory } from "./useStyleHistory";

export type StyleCategory = "full-style" | "streetwear" | "formal" | "casual" | "makeup-only" | "minimalist" | "vintage" | "athleisure" | "bohemian" | "preppy" | "edgy" | "resort" | "grooming" | "sexy" | "swimwear" | "urban-hiphop" | "rugged" | "techwear" | "date-night" | "lingerie" | "y2k" | "cottagecore" | "celebrity-makeup" | "celebrity-hair";
export type PhotoType = "selfie" | "full-body";
export type Gender = "male" | "female";
export type GenerationMode = "on-me" | "mannequin";

type Screen = "splash" | "entrance" | "home" | "style-picker" | "upload" | "loading" | "results" | "tutorial" | "profile" | "saved" | "auth" | "inspiration" | "inspiration-loading" | "inspiration-results";

export interface UserPrefs {
  styleCategory: StyleCategory;
  photoType: PhotoType;
  photoFile: File | null;
  photoBase64: string | null;
  gender: Gender;
  generationMode: GenerationMode;
  celebrityGuide?: string;
}

const GlamoraApp = () => {
  const chatRef = useRef<StylistChatHandle>(null);
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
    generationMode: "on-me",
  });

  // Inspiration state
  const [inspirationIcon, setInspirationIcon] = useState("");
  const [inspirationImageUrl, setInspirationImageUrl] = useState<string | null>(null);
  const [inspirationProfile, setInspirationProfile] = useState<StyleProfile | null>(null);

  const {
    subscription, canGenerate, remainingGenerations, showWatermark,
    showPaywall, setShowPaywall, showUpgradePrompt, setShowUpgradePrompt,
    lockedFeature, tryGenerate, checkFeatureAccess, upgradeTo,
  } = useSubscription();

  const { recordStyle } = useStyleHistory();

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

  const handleStartGeneration = useCallback((file: File | null, photoType: PhotoType, base64: string | null, mode?: import("./GlamoraApp").GenerationMode) => {
    if (!tryGenerate()) return;
    const genMode = mode || "on-me";
    setPrefs(p => ({ ...p, photoFile: file, photoType, photoBase64: base64, generationMode: genMode }));
    recordStyle({ styleCategory: prefs.styleCategory, gender: prefs.gender, generationMode: genMode });
    go("loading");
  }, [tryGenerate, go, prefs.styleCategory, prefs.gender, recordStyle]);

  const handleInspirationGenerate = useCallback((iconName: string, file: File | null, photoType: PhotoType, base64: string | null, mode?: import("./GlamoraApp").GenerationMode) => {
    if (!tryGenerate()) return;
    setInspirationIcon(iconName);
    const genMode = mode || "on-me";
    setPrefs(p => ({ ...p, photoFile: file, photoType, photoBase64: base64, generationMode: genMode }));
    recordStyle({ styleCategory: prefs.styleCategory, celebrityInspiration: iconName, gender: prefs.gender, generationMode: genMode });
    go("inspiration-loading");
  }, [tryGenerate, go, prefs.styleCategory, prefs.gender, recordStyle]);

  return (
    <div className="phone">
      {screen === "splash" && <SplashScreen onDone={() => go("entrance")} />}
      {screen === "entrance" && (
        <EntranceScreen onEnter={(gender) => { setPrefs(p => ({ ...p, gender })); go("home"); }} />
      )}
      {screen === "home" && (
        <HomeScreen
          onGetStyled={(initialCategory?: StyleCategory) => {
            if (initialCategory) setPrefs(p => ({ ...p, styleCategory: initialCategory }));
            go("style-picker");
          }}
          onProfile={() => go("profile")}
          onSaved={() => go("saved")}
          savedCount={savedStyles.length}
          gender={prefs.gender}
          onGenderToggle={(g) => setPrefs(p => ({ ...p, gender: g }))}
          subscription={subscription}
          remainingGenerations={remainingGenerations}
          onShowPaywall={() => setShowPaywall(true)}
          onInspiration={() => go("inspiration")}
          isLoggedIn={!!user}
          onSignIn={() => go("auth")}
        />
      )}
      {screen === "auth" && <AuthScreen onBack={() => go("home")} onSuccess={() => go("home")} />}
      {screen === "style-picker" && (
        <StylePickerScreen prefs={prefs} onBack={() => go("home")}
          onNext={(category: StyleCategory, celebrityGuide?: string) => { setPrefs(p => ({ ...p, styleCategory: category, celebrityGuide })); go("upload"); }} />
      )}
      {screen === "upload" && (
        <UploadScreen prefs={prefs} onBack={() => go("style-picker")} onAnalyze={handleStartGeneration} />
      )}
      {screen === "loading" && (
        <LoadingScreen prefs={prefs} onDone={(imageUrl) => { setStyledImageUrl(imageUrl); go("results"); }} />
      )}
      {screen === "results" && (
        <StyledResultScreen
          prefs={prefs} styledImageUrl={styledImageUrl}
          onBack={() => go("upload")} onHome={() => go("home")}
          onSave={(lookNames) => {
            if (!checkFeatureAccess("Save & organize looks")) return;
            setSavedStyles(prev => [...new Set([...prev, ...lookNames])]); go("home");
          }}
          onLookSelect={(name) => {
            if (subscription.tier === "free" && !checkFeatureAccess("Full tutorials")) return;
            setSelectedLook(name); go("tutorial");
          }}
          onRegenerate={(tweakedCategory) => {
            const category = tweakedCategory || prefs.styleCategory;
            const prompt = `I just generated a ${category.replace("-", " ")} look and I'd like to refine it. Can you help me tweak the style? What changes would make it better — different colors, fits, or vibes? Give me specific suggestions I can try.`;
            chatRef.current?.openWithPrompt(prompt);
          }}
          showWatermark={showWatermark}
        />
      )}
      {screen === "tutorial" && <TutorialScreen lookName={selectedLook} onBack={() => go("results")} onHome={() => go("home")} />}
      {screen === "profile" && (
        <ProfileScreen onBack={() => go("home")} savedCount={savedStyles.length} onSaved={() => go("saved")}
          onGetStyled={() => go("style-picker")} gender={prefs.gender} user={user}
          onSignOut={handleSignOut} onSignIn={() => go("auth")}
          subscription={subscription} onShowPaywall={() => setShowPaywall(true)} />
      )}
      {screen === "saved" && (
        <SavedLooksScreen onBack={() => go("home")} savedStyles={savedStyles}
          onLookSelect={(name) => { setSelectedLook(name); go("tutorial"); }}
          onGetStyled={() => go("style-picker")} gender={prefs.gender} />
      )}

      {/* Inspiration flow */}
      {screen === "inspiration" && (
        <InspirationScreen prefs={prefs} onBack={() => go("home")} onGenerate={handleInspirationGenerate} />
      )}
      {screen === "inspiration-loading" && (prefs.photoBase64 || prefs.generationMode === "mannequin") && (
        <InspirationLoadingScreen
          iconName={inspirationIcon}
          photoBase64={prefs.photoBase64}
          photoType={prefs.photoType}
          gender={prefs.gender}
          generationMode={prefs.generationMode}
          onDone={(imageUrl, styleProfile) => {
            setInspirationImageUrl(imageUrl);
            setInspirationProfile(styleProfile);
            go("inspiration-results");
          }}
        />
      )}
      {screen === "inspiration-results" && (
        <InspirationResultScreen
          prefs={prefs}
          styledImageUrl={inspirationImageUrl}
          styleProfile={inspirationProfile}
          onBack={() => go("inspiration")}
          onHome={() => go("home")}
          onSave={(lookName) => {
            if (!checkFeatureAccess("Save & organize looks")) return;
            setSavedStyles(prev => [...new Set([...prev, lookName])]); go("home");
          }}
          onRegenerate={() => {
            const styleName = inspirationProfile?.styleName || "inspired";
            const prompt = `I just generated a "${styleName}" inspiration look and I want to refine it. What tweaks would you suggest — different clothing pieces, color palette changes, or accessory swaps? Give me specific ideas to make the look even better.`;
            chatRef.current?.openWithPrompt(prompt);
          }}
          showWatermark={showWatermark}
        />
      )}

      {screen !== "splash" && screen !== "entrance" && screen !== "auth" && (
        <StylistChat
          ref={chatRef}
          gender={prefs.gender}
          onRegenerate={(gioSuggestion) => {
            if (!tryGenerate()) return;
            // Store Gio's suggestion in prefs metadata for the generation pipeline
            localStorage.setItem("glamora_gio_refinement", gioSuggestion);
            if (screen === "inspiration-results") {
              setInspirationImageUrl(null);
              setInspirationProfile(null);
              go("inspiration-loading");
            } else {
              setStyledImageUrl(null);
              go("loading");
            }
          }}
        />
      )}

      {showPaywall && (
        <PaywallScreen onClose={() => setShowPaywall(false)} onUpgrade={upgradeTo}
          remainingGenerations={remainingGenerations} lockedFeature={lockedFeature} />
      )}
      {showUpgradePrompt && lockedFeature && (
        <UpgradePrompt feature={lockedFeature} onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={(tier) => upgradeTo(tier, tier === "premium")} />
      )}
    </div>
  );
};

export default GlamoraApp;
