import { useState, useCallback, useEffect, useRef } from "react";
import { initializeIAP } from "./subscription/iapService";
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
import PaywallScreen from "./subscription/PaywallScreen";
// import AppDownloadSheet from "./AppDownloadSheet";
import UpgradePrompt from "./subscription/UpgradePrompt";
import { useSubscription } from "./subscription/useSubscription";
import { useStyleHistory } from "./useStyleHistory";

export type StyleCategory = "full-style" | "streetwear" | "formal" | "casual" | "makeup-only" | "minimalist" | "vintage" | "athleisure" | "bohemian" | "preppy" | "edgy" | "resort" | "grooming" | "sexy" | "swimwear" | "urban-hiphop" | "rugged" | "techwear" | "date-night" | "lingerie" | "y2k" | "cottagecore" | "jewelry-accessories" | "sunglasses-eyewear" | "hats-headwear" | "bags-purses" | "shoes-sneakers" | "wedding-gowns" | "tuxedos" | "fitness" | "icon-looks";
export type PhotoType = "selfie" | "full-body";
export type Gender = "male" | "female";
export type GenerationMode = "on-me" | "mannequin";

type Screen = "splash" | "entrance" | "home" | "style-picker" | "upload" | "loading" | "results" | "tutorial" | "profile" | "saved" | "auth";

export interface UserPrefs {
  styleCategory: StyleCategory;
  styleSubcategory?: string;
  photoType: PhotoType;
  photoFile: File | null;
  photoBase64: string | null;
  gender: Gender;
  generationMode: GenerationMode;
  
  makeupPreference?: "natural" | "glam";
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

  // Initialize Apple IAP
  useEffect(() => {
    initializeIAP(
      (tier) => upgradeTo(tier),
      (error) => console.error("[IAP] Purchase error:", error),
    );
  }, [upgradeTo]);

  const go = useCallback((s: Screen) => setScreen(s), []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    go("home");
  };

  const handleStartGeneration = useCallback((file: File | null, photoType: PhotoType, base64: string | null, mode?: GenerationMode, makeupPref?: "natural" | "glam") => {
    if (!tryGenerate()) return;
    const genMode = mode || "on-me";
    setPrefs(p => ({ ...p, photoFile: file, photoType, photoBase64: base64, generationMode: genMode, makeupPreference: makeupPref }));
    recordStyle({ styleCategory: prefs.styleCategory, gender: prefs.gender, generationMode: genMode });
    go("loading");
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
          isLoggedIn={!!user}
          onSignIn={() => go("auth")}
        />
      )}
      {screen === "auth" && <AuthScreen onBack={() => go("home")} onSuccess={() => go("home")} />}
      {screen === "style-picker" && (
        <StylePickerScreen prefs={prefs} onBack={() => go("home")}
          onNext={(category: StyleCategory, _celebrityGuide?: string, subcategory?: string) => {
            setPrefs(p => ({
              ...p,
              styleCategory: category,
              styleSubcategory: subcategory,
            }));
            go("upload");
          }} />
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
            setSavedStyles(prev => [...new Set([...prev, ...lookNames])]); go("home");
          }}
          onLookSelect={(name) => {
            setSelectedLook(name); go("tutorial");
          }}
          onRegenerate={(tweakedCategory) => {
            const category = tweakedCategory || prefs.styleCategory;
            const prompt = `I just generated a ${category.replace("-", " ")} look and I'd like to refine it. Can you help me tweak the style? What changes would make it better — different colors, fits, or vibes? Give me specific suggestions I can try.`;
            chatRef.current?.openWithPrompt(prompt);
          }}
          onQuickRegenerate={() => {
            if (!tryGenerate()) return;
            setStyledImageUrl(null);
            go("loading");
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


      {screen !== "splash" && screen !== "entrance" && screen !== "auth" && (
        <StylistChat
          ref={chatRef}
          gender={prefs.gender}
          onRegenerate={(gioSuggestion) => {
            if (!tryGenerate()) return;
            // Store Gio's suggestion in prefs metadata for the generation pipeline
            localStorage.setItem("glamora_gio_refinement", gioSuggestion);
            setStyledImageUrl(null);
            go("loading");
          }}
        />
      )}

      {showPaywall && (
        <PaywallScreen onClose={() => setShowPaywall(false)} onUpgrade={upgradeTo}
          remainingGenerations={remainingGenerations} lockedFeature={lockedFeature} />
      )}
      {showUpgradePrompt && lockedFeature && (
        <UpgradePrompt feature={lockedFeature} onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={(tier) => upgradeTo(tier)} />
      )}
      {/* <AppDownloadSheet /> */}
    </div>
  );
};

export default GlamoraApp;
