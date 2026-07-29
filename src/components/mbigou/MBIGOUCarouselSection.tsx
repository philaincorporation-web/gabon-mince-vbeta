import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useEffect, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { mbigouCards, type MBIGOUCard } from "@/lib/mbigou-data";
import { aboutLabels } from "@/lib/about-data";

interface MBIGOUCarouselSectionProps {
  language: "fr" | "en";
}

function CardModal({
  card,
  language,
  onClose,
}: {
  card: MBIGOUCard;
  language: "fr" | "en";
  onClose: () => void;
}) {
  const isFrench = language === "fr";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={card.title[language]}
    >
      <div
        className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="aspect-[16/10] overflow-hidden rounded-t-3xl">
          <img
            src={card.image}
            alt={card.title[language]}
            className="w-full h-full object-cover"
            loading="eager"
            width={800}
            height={500}
          />
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">
            {card.title[language]}
          </h3>
          <p className="text-slate-600 font-light leading-relaxed text-base mb-4">
            {card.description[language]}
          </p>
          <div className="bg-slate-50 rounded-2xl p-5">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-forest mb-2">
              {isFrench ? "Détails" : "Details"}
            </h4>
            <p className="text-slate-600 font-light leading-relaxed text-sm">
              {card.details[language]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MBIGOUCarouselSection({ language }: MBIGOUCarouselSectionProps) {
  const isFrench = language === "fr";
  const labels = aboutLabels[language];
  const [selectedCard, setSelectedCard] = useState<MBIGOUCard | null>(null);

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
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="text-gold font-bold tracking-[0.25em] text-xs uppercase">
          {isFrench ? "Découvrez MBIGOU" : "Discover MBIGOU"}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 text-slate-900 leading-[1.05]">
          {labels.chiffresCles}
        </h2>
      </motion.div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {mbigouCards.map((card) => (
              <div
                key={card.id}
                className="flex-[0_0_85%] sm:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.5rem)] min-w-0"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedCard(card)}
                  className="w-full group rounded-3xl overflow-hidden shadow-soft border border-slate-200 bg-white text-left hover:shadow-elegant transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={card.image}
                      alt={card.title[language]}
                      className="w-full h-full object-cover transition-transform duration-[700ms] group-hover:scale-110"
                      loading="lazy"
                      width={600}
                      height={450}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gold text-xs font-bold uppercase tracking-widest">
                        {isFrench ? "Cliquer pour voir" : "Click to view"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                      {card.title[language]}
                    </h3>
                    <p className="text-slate-500 font-light text-sm leading-relaxed line-clamp-2">
                      {card.description[language]}
                    </p>
                  </div>
                </motion.button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollPrev}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-forest hover:text-white hover:border-forest transition-all duration-300 z-10"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-md hover:bg-forest hover:text-white hover:border-forest transition-all duration-300 z-10"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {selectedCard && (
        <CardModal card={selectedCard} language={language} onClose={() => setSelectedCard(null)} />
      )}
    </section>
  );
}
