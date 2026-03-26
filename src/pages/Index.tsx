import { useEffect } from "react";
import GlamoraApp from "@/components/glamora/GlamoraApp";

const Index = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "1") {
      localStorage.removeItem("glamora_subscription");
      localStorage.removeItem("glamora_monthly_usage");
      localStorage.removeItem("glamora_daily_usage");
      localStorage.removeItem("glamora_first_gen");
      window.history.replaceState({}, "", window.location.pathname);
      window.location.reload();
    }
  }, []);

  return <GlamoraApp />;
};

export default Index;
