import { useState, useCallback, useEffect, useRef } from "react";
import { WifiOff } from "lucide-react";
import { toast } from "sonner";
import { initializeIAP } from "./subscription/iapService";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
// Safe import for Capacitor SplashScreen — avoid crash on web/iPad when plugin unavailable
const CapSplash = {
  hide: async () => {
    try {
      const mod = await import("@capacitor/splash-screen");
      await mod.SplashScreen.hide();
    } catch { /* not on native — no-op */ }
  },
};
import SplashScreen from "./SplashScreen";
import EntranceScreen from "./EntranceScreen";
import HomeScreen from "./HomeScreen";
import StylePickerScreen from "./StylePickerScreen";
import OccasionPickerScreen from "./OccasionPickerScreen";
import UploadScreen from "./UploadScreen";
import LoadingScreen from "./LoadingScreen";
import StyledResultScreen from "./StyledResultScreen";
import TutorialScreen from "./TutorialScreen";
import ProfileScreen from "./ProfileScreen";
import SavedLooksScreen from "./SavedLooksScreen";
import StylistChat, { type StylistChatHandle } from "./StylistChat";
import AuthScreen from "./AuthScreen";
import PaywallScreen from "./subscription/PaywallScreen";
import SettingsScreen, { applyTheme, getStoredTheme } from "./SettingsScreen";
import AdminSuggestionsScreen from "./AdminSuggestionsScreen";
import FaceProfileScreen from "./FaceProfileScreen";
import MyClosetScreen from "./MyClosetScreen";
// import AppDownloadSheet from "./AppDownloadSheet";
import UpgradePrompt from "./subscription/UpgradePrompt";
import { useSubscription } from "./subscription/useSubscription";
import { useStyleHistory } from "./useStyleHistory";

export type StyleCategory = "full-style" | "streetwear" | "formal" | "casual" | "makeup-only" | "minimalist" | "vintage" | "athleisure" | "bohemian" | "preppy" | "edgy" | "resort" | "grooming" | "sexy" | "swimwear" | "urban-hiphop" | "rugged" | "techwear" | "date-night" | "lingerie" | "y2k" | "cottagecore" | "jewelry-accessories" | "sunglasses-eyewear" | "hats-headwear" | "bags-purses" | "shoes-sneakers" | "wedding-gowns" | "tuxedos" | "fitness" | "icon-looks" | "cosplay" | "baby-toddler" | "parent-child" | "couples" | "kids" | "teens";
export type PhotoType = "selfie" | "full-body";
export type Gender = "male" | "female";
export type GenerationMode = "on-me" | "mannequin";

type Screen = "splash" | "entrance" | "home" | "occasion" | "style-picker" | "upload" | "loading" | "results" | "tutorial" | "profile" | "saved" | "auth" | "settings" | "admin-suggestions" | "face-profile" | "my-closet";

export interface UserPrefs {
  styleCategory: StyleCategory;
  styleSubcategory?: string;
  photoType: PhotoType;
  photoFile: File | null;
  photoBase64: string | null;
  secondPhotoFile: File | null;
  secondPhotoBase64: string | null;
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
  const [activeHolidayId, setActiveHolidayId] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<UserPrefs>({
    styleCategory: "full-style",
    photoType: "selfie",
    photoFile: null,
    photoBase64: null,
    secondPhotoFile: null,
    secondPhotoBase64: null,
    gender: "female",
    generationMode: "on-me",
  });
  const [closetUpgradeOpen, setClosetUpgradeOpen] = useState(false);

  // Network connectivity detection
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => { window.removeEventListener("offline", goOffline); window.removeEventListener("online", goOnline); };
  }, []);


  const {
    subscription, canGenerate, remainingGenerations, showWatermark,
    showPaywall, setShowPaywall, showUpgradePrompt, setShowUpgradePrompt,
    lockedFeature, tryGenerate, checkFeatureAccess, upgradeTo, isDevMode,
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

  // Apply saved theme on mount
  useEffect(() => { applyTheme(getStoredTheme()); }, []);

  // Initialize Apple IAP
  useEffect(() => {
    initializeIAP(
      (tier) => {
        upgradeTo(tier);
        toast.success("Subscription activated! Welcome to Premium.");
      },
      (error) => {
        console.error("[IAP] Purchase error:", error);
        toast.error(error || "Purchase failed. Please try again.");
      },
    );
  }, [upgradeTo]);

  const go = useCallback((s: Screen) => setScreen(s), []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    go("home");
  };

  const handleStartGeneration = useCallback((file: File | null, photoType: PhotoType, base64: string | null, mode?: GenerationMode, makeupPref?: "natural" | "glam", secondFile?: File | null, secondBase64?: string | null) => {
    if (!tryGenerate()) return;
    const genMode = mode || "on-me";
    setPrefs(p => ({ ...p, photoFile: file, photoType, photoBase64: base64, generationMode: genMode, makeupPreference: makeupPref, secondPhotoFile: secondFile || null, secondPhotoBase64: secondBase64 || null }));
    recordStyle({ styleCategory: prefs.styleCategory, gender: prefs.gender, generationMode: genMode });
    go("loading");
  }, [tryGenerate, go, prefs.styleCategory, prefs.gender, recordStyle]);


  return (
    <div className="phone">
      {/* Offline banner */}
      {isOffline && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 999,
          padding: "env(safe-area-inset-top, 8px) 16px 8px",
          background: "hsl(0 72% 55%)", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontSize: 13, fontWeight: 600, fontFamily: "'Jost', sans-serif",
        }}>
          <WifiOff size={14} /> No Internet Connection
        </div>
      )}
      {screen === "splash" && <SplashScreen onDone={() => { CapSplash.hide().catch(() => {}); go("entrance"); }} />}
      {screen === "entrance" && (
        <EntranceScreen onEnter={(gender) => { setPrefs(p => ({ ...p, gender })); go("home"); }} />
      )}
      {screen === "home" && (
        <HomeScreen
          onGetStyled={(initialCategory?: StyleCategory) => {
            if (initialCategory) {
              setPrefs(p => ({ ...p, styleCategory: initialCategory }));
              setActiveHolidayId(null);
              go("style-picker");
            } else {
              setActiveHolidayId(null);
              go("occasion");
            }
          }}
          onHolidayPick={(holidayId: string) => {
            setActiveHolidayId(holidayId);
            go("style-picker");
          }}
          onDirectPick={(category: StyleCategory, subcategory: string) => {
            setPrefs(p => ({ ...p, styleCategory: category, styleSubcategory: subcategory }));
            setActiveHolidayId(null);
            go("upload");
          }}
          onDailyLook={() => {
            setPrefs(p => ({ ...p, styleCategory: "full-style" }));
            const hasPhoto = prefs.photoBase64 || prefs.photoFile;
            if (hasPhoto) {
              if (!tryGenerate()) return;
              recordStyle({ styleCategory: "full-style", gender: prefs.gender, generationMode: prefs.generationMode });
              go("loading");
            } else {
              go("upload");
            }
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
          onCloset={() => {
            if (!user) { go("auth"); return; }
            if (subscription.tier === "free" && !isDevMode) { setClosetUpgradeOpen(true); return; }
            go("my-closet");
          }}
          isPremium={subscription.tier !== "free" || isDevMode}
        />
      )}
      {screen === "auth" && <AuthScreen onBack={() => go("home")} onSuccess={() => go("home")} />}
      {screen === "occasion" && (
        <OccasionPickerScreen
          gender={prefs.gender}
          onBack={() => go("home")}
          onNext={(category, subcategory) => {
            setPrefs(p => ({ ...p, styleCategory: category, styleSubcategory: subcategory }));
            setActiveHolidayId(null);
            go("upload");
          }}
        />
      )}
      {screen === "style-picker" && (
        <StylePickerScreen prefs={prefs} onBack={() => go("home")}
          holidayId={activeHolidayId}
          onNext={(category: StyleCategory, _celebrityGuide?: string, subcategory?: string) => {
            setPrefs(p => ({
              ...p,
              styleCategory: category,
              styleSubcategory: subcategory,
            }));
            setActiveHolidayId(null);
            go("upload");
          }} />
      )}
      {screen === "upload" && (
        <UploadScreen prefs={prefs} onBack={() => go(prefs.styleSubcategory ? "occasion" : "style-picker")} onAnalyze={handleStartGeneration} />
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
          onGetStyled={() => go("occasion")} gender={prefs.gender} user={user}
          onSignOut={handleSignOut} onSignIn={() => go("auth")}
          subscription={subscription} onShowPaywall={() => setShowPaywall(true)}
          onSettings={() => go("settings")}
          onAdminSuggestions={() => go("admin-suggestions")}
          onFaceProfile={() => {
            if (!user) {
              go("auth");
              return;
            }
            go("face-profile");
          }}
          onCloset={() => {
            if (!user) { go("auth"); return; }
            if (subscription.tier === "free" && !isDevMode) { setClosetUpgradeOpen(true); return; }
            go("my-closet");
          }}
        />
      )}
      {screen === "settings" && (
        <SettingsScreen onBack={() => go("profile")} gender={prefs.gender} />
      )}
      {screen === "admin-suggestions" && (
        <AdminSuggestionsScreen onBack={() => go("profile")} />
      )}
      {screen === "face-profile" && user && (
        <FaceProfileScreen onBack={() => go("profile")} gender={prefs.gender} userId={user.id} />
      )}
      {screen === "my-closet" && user && (
        <MyClosetScreen onBack={() => go("home")} gender={prefs.gender} userId={user.id} />
      )}
      {screen === "saved" && (
        <SavedLooksScreen onBack={() => go("home")} savedStyles={savedStyles}
          onLookSelect={(name) => { setSelectedLook(name); go("tutorial"); }}
          onGetStyled={() => go("occasion")} gender={prefs.gender} />
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
      {closetUpgradeOpen && (
        <UpgradePrompt
          feature="My Closet"
          featureDescription="Snap photos of every item in your wardrobe — tops, bottoms, shoes, accessories. Our AI analyzes your real pieces and creates complete outfit combinations you can actually wear. Save favorites, regenerate looks, and get a 7-day style plan from your own closet."
          onClose={() => setClosetUpgradeOpen(false)}
          onUpgrade={(tier) => { upgradeTo(tier); setClosetUpgradeOpen(false); }}
        />
      )}
      {/* <AppDownloadSheet /> */}
    </div>
  );
};

export default GlamoraApp;
