import { useEffect, useCallback, useState } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CatalogueItem = {
  fr: CatalogueText;
  en: CatalogueText;
  image: string;
};

export type CatalogueText = {
  title: string;
  description: string;
  label: string;
  details: string;
};

type LocalizedText = { fr: string; en: string };

export function CataloguePage({ title, intro, items }: { title: LocalizedText; intro: LocalizedText; items: CatalogueItem[] }) {
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench
    ? { home: "Accueil", viewDetails: "Voir les détails", close: "Fermer", details: "En savoir plus" }
    : { home: "Home", viewDetails: "View details", close: "Close", details: "Learn more" };

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", containScroll: "trimSnaps", slidesToScroll: 1 },
    [],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: ReturnType<typeof useEmblaCarousel>[1]) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("gabonmice-language") as "fr" | "en" | null;
    const storedTheme = window.localStorage.getItem("gabonmice-theme") as "light" | "dark" | null;
    if (storedLanguage) setLanguage(storedLanguage);
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-language", language);
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-theme", theme);
  }, [theme]);

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`} lang={language}>
      <header className={`border-b px-4 py-5 transition-colors sm:px-8 ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-forest">GABON<span className="text-ocean">MICE</span></Link>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label={isDark ? "Light theme" : "Dark theme"} className="rounded-full border border-forest/30 px-3 py-2 text-xs font-bold text-forest transition-colors hover:bg-forest hover:text-white">{isDark ? "☀" : "☾"}</button><button type="button" onClick={() => setLanguage(isFrench ? "en" : "fr")} className="rounded-full border border-forest/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest transition-colors hover:bg-forest hover:text-white">{isFrench ? "EN" : "FR"}</button><button type="button" onClick={() => window.dispatchEvent(new Event("open-conversion-popup"))} className="rounded-full border border-forest/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest transition-colors hover:bg-forest hover:text-white">{isFrench ? "Organiser" : "Plan now"}</button><Link to="/" className="rounded-full border border-forest/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest transition-colors hover:bg-forest hover:text-white">{copy.home}</Link></div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-forest">GabonMICE</span>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">{title[language]}</h1>
        <p className={`mt-5 max-w-2xl text-lg font-light leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{intro[language]}</p>

        <div className="relative mt-12">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 md:gap-8">
              {items.map((item) => {
                const content = item[language];
                return (
                  <div
                    key={content.title}
                    className="flex-[0_0_100%] md:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.5rem)] min-w-0"
                  >
                    <article className={`overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:scale-[1.02] hover:shadow-elegant ${isDark ? "bg-slate-900" : "bg-white"}`}>
                      <img src={item.image} alt={content.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                      <div className="p-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-ocean">{content.label}</span>
                        <h2 className="mt-3 font-display text-2xl font-bold">{content.title}</h2>
                        <p className={`mt-3 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{content.description}</p>
                        <button type="button" onClick={() => setSelectedItem(item)} className="mt-5 text-sm font-bold text-forest underline underline-offset-4 transition-colors hover:text-ocean">{copy.viewDetails}</button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full z-10",
              "-left-3 md:-left-5",
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full z-10",
              "-right-3 md:-right-5",
            )}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label={copy.details} onClick={() => setSelectedItem(null)}>
          <article className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl shadow-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} onClick={(event) => event.stopPropagation()}>
            <img src={selectedItem.image} alt={selectedItem[language].title} className="h-64 w-full object-cover" />
            <div className="p-7 sm:p-10">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ocean">{selectedItem[language].label}</span>
                  <h2 className="mt-3 font-display text-3xl font-bold">{selectedItem[language].title}</h2>
                </div>
                <button type="button" onClick={() => setSelectedItem(null)} className={`rounded-full border px-3 py-1 text-sm font-bold hover:border-forest hover:text-forest ${isDark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-600"}`}>{copy.close}</button>
              </div>
              <p className={`mt-6 text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{selectedItem[language].details}</p>
            </div>
          </article>
        </div>
      )}

      <section className={`mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20`}>
        <div className={`relative overflow-hidden rounded-[2rem] p-8 sm:p-12 md:p-16 transition-colors duration-500 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200 shadow-soft"}`}>
          <div className="absolute inset-0">
            <img src="/AffichePub.png" alt="" className="w-full h-full object-cover opacity-10" />
            <div className={`absolute inset-0 ${isDark ? "bg-slate-900/90" : "bg-white/90"}`} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
                {isFrench ? "Un projet ?" : "A project?"}
              </span>
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 leading-[1.05] ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {isFrench ? "Construisons votre événement ensemble" : "Let's build your event together"}
              </h2>
              <p className={`mt-5 text-base sm:text-lg font-light leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {isFrench
                  ? "Notre équipe vous accompagne dans la conception, l'organisation et la réussite de votre prochain événement au Gabon."
                  : "Our team supports you in designing, organizing and succeeding in your next event in Gabon."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-conversion-popup"))}
              className="shrink-0 rounded-full bg-forest px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-deep hover:scale-[1.02]"
            >
              {isFrench ? "Organiser un événement" : "Plan an event"}
            </button>
          </div>
        </div>
      </section>

      <SiteFooter language={language} theme={theme} />
    </main>
  );
}
