import { useState, useCallback } from "react";
import SplashScreen from "./SplashScreen";
import OnboardingScreen from "./OnboardingScreen";
import HomeScreen from "./HomeScreen";
import UploadScreen from "./UploadScreen";
import LoadingScreen from "./LoadingScreen";
import ResultsScreen from "./ResultsScreen";
import ProfileScreen from "./ProfileScreen";
import SavedLooksScreen from "./SavedLooksScreen";

type Screen = "splash" | "onboarding" | "home" | "upload" | "loading" | "results" | "profile" | "saved";

const GlamoraApp = () => {
  const [screen, setScreen] = useState<Screen>("splash");
  const [hasSaved, setHasSaved] = useState(false);

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
          onUpload={() => go("upload")}
          onProfile={() => go("profile")}
          onSaved={() => go("saved")}
        />
      )}
      {screen === "upload" && (
        <UploadScreen
          onBack={() => go("home")}
          onAnalyze={() => go("loading")}
        />
      )}
      {screen === "loading" && (
        <LoadingScreen onDone={() => go("results")} />
      )}
      {screen === "results" && (
        <ResultsScreen
          onBack={() => go("upload")}
          onHome={() => go("home")}
          onSave={() => { setHasSaved(true); go("home"); }}
        />
      )}
      {screen === "profile" && (
        <ProfileScreen
          onBack={() => go("home")}
          savedCount={hasSaved ? 3 : 0}
        />
      )}
      {screen === "saved" && (
        <SavedLooksScreen
          onBack={() => go("home")}
          hasSaved={hasSaved}
        />
      )}
    </div>
  );
};

export default GlamoraApp;
