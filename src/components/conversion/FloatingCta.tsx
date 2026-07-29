import { useEffect, useState } from "react";

interface FloatingCtaProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function FloatingCta({ language, theme }: FloatingCtaProps) {
  const [isFrench, setIsFrench] = useState(language === "fr");
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    setIsFrench(language === "fr");
    setIsDark(theme === "dark");
  }, [language, theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "gabonmice-language" && event.newValue) {
        setIsFrench(event.newValue === "fr");
      }
      if (event.key === "gabonmice-theme" && event.newValue) {
        setIsDark(event.newValue === "dark");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-conversion-popup"))}
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 ${
        isDark
          ? "bg-forest shadow-forest/30"
          : "bg-forest shadow-forest/25"
      }`}
      aria-label={isFrench ? "Organiser un événement" : "Plan an event"}
    >
      <span className="hidden sm:inline">
        {isFrench ? "Organiser" : "Plan now"}
      </span>
      <span className="sm:hidden">+</span>
    </button>
  );
}
