import { useState, useCallback } from "react";
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

export type StyleCategory = "full-style" | "streetwear" | "formal" | "casual" | "makeup-only" | "minimalist" | "vintage" | "athleisure" | "bohemian" | "preppy" | "edgy" | "resort" | "grooming";
export type PhotoType = "selfie" | "full-body";
export type Gender = "male" | "female";

type Screen = "splash" | "entrance" | "home" | "style-picker" | "upload" | "loading" | "results" | "tutorial" | "profile" | "saved";

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
  const [prefs, setPrefs] = useState<UserPrefs>({
    styleCategory: "full-style",
    photoType: "selfie",
    photoFile: null,
    photoBase64: null,
    gender: "female",
  });

  const go = useCallback((s: Screen) => setScreen(s), []);

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
          onGetStyled={() => go("style-picker")}
          onProfile={() => go("profile")}
          onSaved={() => go("saved")}
          savedCount={savedStyles.length}
          gender={prefs.gender}
          onGenderToggle={(g) => setPrefs(p => ({ ...p, gender: g }))}
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
          onAnalyze={(file: File, photoType: PhotoType, base64: string) => {
            setPrefs(p => ({ ...p, photoFile: file, photoType, photoBase64: base64 }));
            go("loading");
          }}
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
            setSavedStyles(prev => [...new Set([...prev, ...lookNames])]);
            go("home");
          }}
          onLookSelect={(name: string) => { setSelectedLook(name); go("tutorial"); }}
          onRegenerate={(tweakedCategory) => {
            if (tweakedCategory) setPrefs(p => ({ ...p, styleCategory: tweakedCategory }));
            setStyledImageUrl(null);
            go("loading");
          }}
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
      {screen !== "splash" && screen !== "entrance" && (
        <StylistChat gender={prefs.gender} />
      )}
    </div>
  );
};

export default GlamoraApp;
