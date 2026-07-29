import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/home/HeroSection";
import { VenuesSection } from "@/components/home/VenuesSection";
import { BiodiversitySection } from "@/components/home/BiodiversitySection";
import { DestinationsSection } from "@/components/home/DestinationsSection";
import { InvestSection } from "@/components/home/InvestSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaSection } from "@/components/home/CtaSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ScrollToTop } from "@/components/home/ScrollToTop";
import { homeCopyFr, homeCopyEn } from "@/lib/home-data";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("gabonmice-theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
    const storedLanguage = window.localStorage.getItem("gabonmice-language") as "fr" | "en" | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-language", language);
  }, [language]);

  const surfaceClass = isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900";

  const copy = language === "fr" ? homeCopyFr : homeCopyEn;

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${surfaceClass}`}
    >
      <SiteNav
        language={language}
        theme={theme}
        menuOpen={menuOpen}
        onToggleMenu={setMenuOpen}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onToggleLanguage={() => setLanguage((l) => (l === "fr" ? "en" : "fr"))}
      />

      <main>
        <HeroSection language={language} theme={theme} />
        <VenuesSection language={language} theme={theme} />
        <BiodiversitySection language={language} theme={theme} />
        <DestinationsSection language={language} theme={theme} />
        <InvestSection language={language} theme={theme} />
        <TestimonialsSection language={language} theme={theme} />
        <CtaSection language={language} theme={theme} />
        <NewsletterSection language={language} theme={theme} />
      </main>

      <SiteFooter language={language} theme={theme} />

      <ScrollToTop label={copy.sections.scrollToTop} theme={theme} />
    </div>
  );
}
