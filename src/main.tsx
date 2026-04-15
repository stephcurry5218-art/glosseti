import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/glamora/ErrorBoundary.tsx";
import "./index.css";

// Catch unhandled promise rejections to prevent native app crashes
window.addEventListener("unhandledrejection", (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
  event.preventDefault();
});

// Catch uncaught errors to prevent crashes on iPad/native
window.addEventListener("error", (event) => {
  console.error("[Uncaught Error]", event.error || event.message);
});

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
