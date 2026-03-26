import { useState, useCallback } from "react";
import SplashScreen from "./SplashScreen";
import OnboardingScreen from "./OnboardingScreen";
import HomeScreen from "./HomeScreen";
import StylePickerScreen from "./StylePickerScreen";
import UploadScreen from "./UploadScreen";
import LoadingScreen from "./LoadingScreen";
import ResultsScreen from "./ResultsScreen";
import TutorialScreen from "./TutorialScreen";
import ProfileScreen from "./ProfileScreen";
import SavedLooksScreen from "./SavedLooksScreen";

export type StyleCategory = "full-style" | "streetwear" | "formal" | "casual" | "makeup-only" | "minimalist" | "vintage" | "athleisure";
export type PhotoType = "selfie" | "full-body";

type Screen = "splash" | "onboarding" | "home" | "style-picker" | "upload" | "loading" | "results" | "tutorial" | "profile" | "saved";

export interface UserPrefs {
  styleCategory: StyleCategory;
  photoType: PhotoType;
  photoFile: File | null;
}

const GlamoraApp = () => {
  const [screen, setScreen] = useState<Screen>("splash");
  const [savedStyles, setSavedStyles] = useState<string[]>([]);
  const [selectedLook, setSelectedLook] = useState("Soft Glam");
  const [prefs, setPrefs] = useState<UserPrefs>({
    styleCategory: "full-style",
    photoType: "selfie",
    photoFile: null,
  });

  const go = useCallback((s: Screen) => setScreen(s), []);

  return (
    <div className="phone">
      {screen === "splash" && (
        <SplashScreen onDone={() => go("onboarding")} />
      )}
      {screen === "onboarding" && (
        <OnboardingScreen onStart={() => go("home")} />
      )}
      {screen === "home" && (
        <HomeScreen
          onGetStyled={() => go("style-picker")}
          onProfile={() => go("profile")}
          onSaved={() => go("saved")}
          savedCount={savedStyles.length}
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
          onAnalyze={(file: File, photoType: PhotoType) => {
            setPrefs(p => ({ ...p, photoFile: file, photoType }));
            go("loading");
          }}
        />
      )}
      {screen === "loading" && (
        <LoadingScreen prefs={prefs} onDone={() => go("results")} />
      )}
      {screen === "results" && (
        <ResultsScreen
          prefs={prefs}
          onBack={() => go("upload")}
          onHome={() => go("home")}
          onSave={(lookNames: string[]) => {
            setSavedStyles(prev => [...new Set([...prev, ...lookNames])]);
            go("home");
          }}
          onLookSelect={(name: string) => { setSelectedLook(name); go("tutorial"); }}
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
        />
      )}
      {screen === "saved" && (
        <SavedLooksScreen
          onBack={() => go("home")}
          savedStyles={savedStyles}
          onLookSelect={(name: string) => { setSelectedLook(name); go("tutorial"); }}
          onGetStyled={() => go("style-picker")}
        />
      )}
    </div>
  );
};

export default GlamoraApp;
