import { createRoot } from "react-dom/client";
import { SplashScreen } from "@capacitor/splash-screen";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide native splash screen once web app is rendered
// This works seamlessly — on web it's a no-op, on native it dismisses the storyboard
SplashScreen.hide().catch(() => {
  // Silently ignore on web where the plugin isn't available
});
