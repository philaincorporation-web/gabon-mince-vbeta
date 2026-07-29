import { useState, useEffect, useCallback } from "react";
import loangoElephant from "@/assets/loango-elephant.jpg";
import gabonMask from "@/assets/gabon-mask.jpg";
import { homeCopyFr, homeCopyEn, stats, type HomeSections } from "@/lib/home-data";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const biodiversityImages = [loangoElephant, gabonMask];

interface BiodiversitySectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function BiodiversitySection({ language, theme }: BiodiversitySectionProps) {
  const isFrench = language === "fr";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const sections = copy.sections as unknown as HomeSections;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      loop: true,
      skipSnaps: false,
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    const snaps = emblaApi.scrollSnapList();
    const current = emblaApi.selectedScrollSnap();
    const prev = current === 0 ? snaps.length - 1 : current - 1;
    emblaApi.scrollTo(prev);
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    const snaps = emblaApi.scrollSnapList();
    const current = emblaApi.selectedScrollSnap();
    const next = current === snaps.length - 1 ? 0 : current + 1;
    emblaApi.scrollTo(next);
  }, [emblaApi]);

  return (
    <section
      id="experiences"
      className="bg-forest py-16 sm:py-20 md:py-24 relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 h-full w-1/2 opacity-25 mix-blend-overlay">
        <img src={loangoElephant} alt="" loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <span className="text-gold font-bold tracking-[0.25em] text-xs uppercase">
            {sections.experiencesEyebrow}
          </span>
          <h2 className="font-display text-[2.25rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-5 mb-8 leading-[1.05]">
            {sections.experiencesTitle}
          </h2>
          <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed mb-8 sm:mb-10 max-w-lg">
            {sections.experiencesText}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
            {stats.map((s) => (
              <div
                key={s.l}
                className="bg-white/10 backdrop-blur-md px-4 sm:px-6 py-4 rounded-2xl border border-white/15 hover:bg-white/15 transition-colors"
              >
                <div className="text-gold font-bold text-3xl mb-1 font-display">{s.n}</div>
                <div className="text-white/70 text-[10px] uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
          <button className="mt-8 sm:mt-10 md:mt-12 w-full sm:w-auto px-8 py-4 rounded-full bg-gold text-forest-deep text-xs font-bold uppercase tracking-widest hover:bg-gold-soft transition-all shadow-xl shadow-black/20">
            {sections.experiencesButton}
          </button>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl rotate-0 lg:rotate-2 hover:rotate-0 transition-transform duration-700 max-w-md mx-auto lg:ml-auto max-h-[28rem] md:max-h-none">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {biodiversityImages.map((img, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0">
                    <img
                      src={img}
                      alt={`Biodiversity image ${i + 1}`}
                      width={600}
                      height={800}
                      loading="lazy"
                      className="aspect-[3/4] w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-md hover:bg-forest hover:text-white hover:border-forest transition-all duration-300 z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-md hover:bg-forest hover:text-white hover:border-forest transition-all duration-300 z-10"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl max-w-xs hidden md:block">
            <div className="text-[10px] uppercase tracking-widest text-forest font-bold mb-2">
              {sections.culturalLabel}
            </div>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              {sections.culturalText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
