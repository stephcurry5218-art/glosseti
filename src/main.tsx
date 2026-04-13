import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/glamora/ErrorBoundary.tsx";
import "./index.css";

// Catch unhandled promise rejections to prevent native app crashes
window.addEventListener("unhandledrejection", (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
  event.preventDefault();
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
