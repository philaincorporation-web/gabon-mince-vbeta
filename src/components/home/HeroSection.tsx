import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroLibreville from "@/assets/hero-libreville.jpg";
import {
  heroSlidesFr,
  heroSlidesEn,
  homeCopyFr,
  homeCopyEn,
  type HomeSections,
} from "@/lib/home-data";

interface HeroSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function HeroSection({ language, theme }: HeroSectionProps) {
  const [slide, setSlide] = useState(0);
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const heroSlides = isFrench ? heroSlidesFr : heroSlidesEn;
  const hero = copy.sections as unknown as HomeSections;

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  return (
    <section className="relative min-h-[80vh] md:min-h-screen w-full overflow-hidden">
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
            i === slide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className={`absolute inset-0 h-full w-full object-cover ${
              i === slide ? "animate-ken-burns" : ""
            }`}
            {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-10">
        <span
          key={`eyebrow-${slide}`}
          className="animate-reveal text-gold font-semibold uppercase tracking-[0.35em] text-xs md:text-sm mb-6"
        >
          {heroSlides[slide].eyebrow}
        </span>
        <h1
          key={`title-${slide}`}
          className="animate-reveal font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] sm:leading-[1.02] max-w-5xl drop-shadow-2xl mb-6 px-2"
          style={{ animationDelay: "150ms" }}
        >
          {heroSlides[slide].title}
        </h1>
        <p
          key={`sub-${slide}`}
          className="animate-reveal text-white/90 text-sm sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-8 sm:mb-10 md:mb-12 px-2"
          style={{ animationDelay: "300ms" }}
        >
          {heroSlides[slide].subtitle}
        </p>

        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl p-2 sm:p-3 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-2 shadow-2xl">
          <div className="flex-1 px-6 py-4 flex flex-col items-start text-left">
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest mb-1">
              {copy.hero.planner}
            </span>
            <input
              type="text"
              placeholder={copy.hero.placeholderEvent}
              className="bg-transparent text-white placeholder:text-white/60 focus:outline-none w-full text-sm"
            />
          </div>
          <div className="w-px bg-white/20 my-4 hidden md:block" />
          <div className="flex-1 px-6 py-4 flex flex-col items-start text-left">
            <span className="text-[10px] uppercase font-bold text-gold tracking-widest mb-1">
              {copy.hero.attendees}
            </span>
            <input
              type="text"
              placeholder={copy.hero.placeholderAttendees}
              className="bg-transparent text-white placeholder:text-white/60 focus:outline-none w-full text-sm"
            />
          </div>
          <button className="bg-gold text-forest font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-sm uppercase tracking-widest hover:scale-[1.02] hover:bg-gold-soft transition-all w-full md:w-auto">
            {copy.hero.button}
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === slide ? "w-12 bg-white" : "w-6 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
