import { useEffect } from "react";
import { Link } from "react-router-dom";

export function PartnersLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow;
    const htmlHeight = document.documentElement.style.height;
    const bodyOverflow = document.body.style.overflow;
    const bodyHeight = document.body.style.height;
    const root = document.getElementById("root");
    const rootHeight = root?.style.height ?? "";

    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    if (root) root.style.height = "auto";

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.documentElement.style.height = htmlHeight;
      document.body.style.overflow = bodyOverflow;
      document.body.style.height = bodyHeight;
      if (root) root.style.height = rootHeight;
    };
  }, []);

  return (
    <div
      className="partners-theme min-h-dvh w-full bg-[#0a0a0a] text-[#e8e2d4] overflow-x-hidden"
      style={{
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
      }}
    >

      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-[#0a0a0a]/80 border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/partners" className="flex items-center gap-2">
            <span
              className="text-xl tracking-[0.25em] font-medium"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C9A84C" }}
            >
              GLOSSETI
            </span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-[0.3em] text-[#777] border-l border-[#333] pl-3 ml-1">
              Partners
            </span>
          </Link>
          <a
            href="mailto:admin@glosseti.com"
            className="text-xs uppercase tracking-[0.2em] text-[#aaa] hover:text-[#C9A84C] transition-colors"
          >
            Contact
          </a>
        </div>
      </header>
      <main>{children}</main>
      <PartnersFooter />
    </div>
  );
}

export function PartnersFooter() {
  return (
    <footer className="border-t border-[#1a1a1a] mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="text-xs text-[#777] tracking-wide text-center md:text-left">
          Quanstein Labs — Glosseti Partner Program
          <div className="mt-1 text-[#555]">© {new Date().getFullYear()} All rights reserved.</div>
        </div>
        <div className="flex gap-6 text-xs uppercase tracking-[0.18em] text-[#999]">
          <Link to="/privacy" className="hover:text-[#C9A84C] transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-[#C9A84C] transition-colors">Terms</Link>
          <a href="mailto:admin@glosseti.com" className="hover:text-[#C9A84C] transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
