import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroSection } from "@/components/about/HeroSection";
import { VideoSection } from "@/components/about/VideoSection";
import { WhoWeAreSection } from "@/components/about/WhoWeAreSection";
import { MissionVisionSection } from "@/components/about/MissionVisionSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { WhyChooseSection } from "@/components/about/WhyChooseSection";
import { StatsSection } from "@/components/about/StatsSection";
import { MBIGOUCarouselSection } from "@/components/mbigou/MBIGOUCarouselSection";
import { FaqSection } from "@/components/about/FaqSection";
import { CtaSection } from "@/components/about/CtaSection";
import { seo } from "@/lib/about-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: seo.fr.title },
      { name: "description", content: seo.fr.description },
      { property: "og:title", content: seo.fr.title },
      { property: "og:description", content: seo.fr.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("gabonmice-theme") as "light" | "dark" | null;
    if (storedTheme) setTheme(storedTheme);
    const storedLanguage = window.localStorage.getItem("gabonmice-language") as "fr" | "en" | null;
    if (storedLanguage) setLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-language", language);
  }, [language]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <SiteNav
        language={language}
        theme={theme}
        menuOpen={false}
        onToggleMenu={() => {}}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onToggleLanguage={() => setLanguage((l) => (l === "fr" ? "en" : "fr"))}
      />
      <div className="pt-[72px]">
        <HeroSection language={language} />
        <VideoSection language={language} />
        <WhoWeAreSection language={language} />
        <MissionVisionSection language={language} />
        <MBIGOUCarouselSection language={language} />
        <WhyChooseSection language={language} />
        <ValuesSection language={language} />
        <StatsSection language={language} />
        <FaqSection language={language} />
        <CtaSection language={language} />
      </div>
      <SiteFooter language={language} theme={theme} />
    </div>
  );
}
