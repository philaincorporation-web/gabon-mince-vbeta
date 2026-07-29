import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { homeCopyFr, homeCopyEn, type HomeSections } from "@/lib/home-data";

interface DestinationsSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function DestinationsSection({ language, theme }: DestinationsSectionProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const sections = copy.sections as unknown as HomeSections;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      slidesToScroll: 1,
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

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const slides = [
    {
      label: sections.destinationCard1Label,
      title: sections.destinationCard1Title,
      text: sections.destinationCard1Text,
      image: "/muséé12.webp",
      alt: "Libreville",
      w: 1200,
      h: 750,
    },
    {
      label: sections.destinationCard2Label,
      title: sections.destinationCard2Title,
      text: undefined,
      image: "/port-gentil11.webp",
      alt: "Port-Gentil",
      w: 1024,
      h: 768,
    },
    {
      label: sections.destinationCard3Label,
      title: sections.destinationCard3Title,
      text: undefined,
      image: "/PLAteau.jpg",
      alt: "Loango",
      w: 1024,
      h: 768,
    },
    {
      label: sections.destinationCard4Label,
      title: sections.destinationCard4Title,
      text: sections.destinationCard4Text,
      image: "/tortue.jpg",
      alt: "Pointe Denis",
      w: 1200,
      h: 750,
    },
  ];

  return (
    <section
      id="destinations"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto"
    >
      <div className="max-w-2xl mb-16">
        <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
          {sections.destinationsLabel}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 text-slate-900 leading-[1.05]">
          {sections.destinationsTitle}
        </h2>
        <p
          className={`text-base sm:text-lg font-light leading-relaxed mt-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {sections.destinationsText}
        </p>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {slides.map((slide) => (
              <div
                key={slide.alt}
                className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.5rem)] min-w-0"
              >
                <a
                  href="#"
                  className="group relative overflow-hidden rounded-3xl aspect-[16/10] shadow-soft"
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    width={slide.w}
                    height={slide.h}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                      {slide.label}
                    </span>
                    <h3 className="font-display text-2xl font-bold mt-2">{slide.title}</h3>
                    {slide.text ? (
                      <p className="text-white/80 font-light mt-2 max-w-sm">{slide.text}</p>
                    ) : null}
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex ? "w-6 bg-forest" : "w-2 bg-slate-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
