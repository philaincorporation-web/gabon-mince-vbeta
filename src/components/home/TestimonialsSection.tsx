import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Quote } from "lucide-react";
import {
  homeCopyFr,
  homeCopyEn,
  testimonialsFr,
  testimonialsEn,
  type HomeSections,
} from "@/lib/home-data";

interface TestimonialsSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function TestimonialsSection({ language, theme }: TestimonialsSectionProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const testimonials = isFrench ? testimonialsFr : testimonialsEn;
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

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const bgClass = isDark ? "bg-slate-950" : "bg-white";
  const textClass = isDark ? "text-slate-100" : "text-slate-900";
  const mutedClass = isDark ? "text-slate-400" : "text-slate-500";
  const cardClass = isDark
    ? "bg-slate-900 border border-slate-800 shadow-soft"
    : "bg-white border border-slate-200 shadow-soft";

  return (
    <section
      className={`py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 transition-colors duration-500 ${bgClass}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-ocean font-bold tracking-[0.25em] text-xs uppercase">
            {sections.testimonialsLabel}
          </span>
          <h2
            className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 leading-[1.05] ${textClass}`}
          >
            {sections.testimonialsTitle}
          </h2>
          <p className={`text-base sm:text-lg font-light leading-relaxed mt-6 ${mutedClass}`}>
            {sections.testimonialsText}
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 md:gap-8">
              {testimonials.map((t, i) => {
                const isActive = i === selectedIndex;
                return (
                  <div
                    key={t.name}
                    className="flex-[0_0_100%] md:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.5rem)] min-w-0"
                  >
                    <div
                      className={`rounded-[1.5rem] p-6 sm:p-8 transition-all duration-500 ${cardClass} ${
                        isActive ? "scale-100 opacity-100 shadow-elegant" : "scale-95 opacity-70"
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-forest/20">
                          <img
                            src={t.image}
                            alt={t.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className={`font-display text-lg font-bold truncate ${textClass}`}>
                            {t.name}
                          </h3>
                          <p
                            className={`text-xs font-semibold uppercase tracking-widest text-ocean truncate`}
                          >
                            {t.role}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <Quote
                          className={`absolute -top-2 -left-1 h-6 w-6 ${isDark ? "text-slate-700" : "text-slate-200"}`}
                        />
                        <p
                          className={`relative pl-6 text-sm sm:text-base font-light leading-relaxed ${mutedClass}`}
                        >
                          "{t.text}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "w-6 bg-ocean" : "w-2 bg-slate-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
