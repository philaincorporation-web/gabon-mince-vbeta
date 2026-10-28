import { useEffect, useCallback, useState } from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { PageHero, PageShell } from "@/components/layout/PageShell";
import { RequestDialog, type RequestTarget } from "@/components/mice/RequestDialog";

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

export function CataloguePage({
  title,
  intro,
  items,
}: {
  title: LocalizedText;
  intro: LocalizedText;
  items: CatalogueItem[];
}) {
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  const [request, setRequest] = useState<RequestTarget | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", containScroll: "trimSnaps", slidesToScroll: 1 },
    [],
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api: ReturnType<typeof useEmblaCarousel>[1]) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
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
    if (!selectedItem) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedItem(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedItem]);

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-float transition hover:bg-sun hover:text-white disabled:opacity-0 md:flex";

  return (
    <PageShell>
      {({ language, t }) => (
        <>
          <PageHero
            image={items[0]?.image ?? "/baiedesRois2.webp"}
            eyebrow="GabonMICE"
            title={title[language]}
            intro={intro[language]}
            crumb={title[language]}
            homeLabel={t("Accueil", "Home")}
          />

          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 sm:py-20">
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                  {items.map((item) => {
                    const content = item[language];
                    return (
                      <div
                        key={`${content.title}-${item.image}`}
                        className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)]"
                      >
                        <article className="group h-full overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant dark:bg-slate-900">
                          <button
                            type="button"
                            onClick={() => setSelectedItem(item)}
                            className="relative block w-full overflow-hidden"
                          >
                            <img
                              src={item.image}
                              alt={content.title}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            <span className="absolute left-4 top-4 rounded-full bg-forest-deep/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                              {content.label}
                            </span>
                          </button>
                          <div className="p-6">
                            <h2 className="font-display text-xl font-extrabold text-forest-deep dark:text-white">
                              {content.title}
                            </h2>
                            <p className="mt-2 leading-relaxed text-ink/65 dark:text-slate-300">
                              {content.description}
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sun-deep hover:underline"
                            >
                              {t("Voir les détails", "View details")}{" "}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className={`${arrow} -left-5`}
                aria-label={t("Précédent", "Previous")}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className={`${arrow} -right-5`}
                aria-label={t("Suivant", "Next")}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation du carrousel : flèches (mobile) et points */}
            {snaps.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={!canScrollPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-soft transition disabled:opacity-30 dark:bg-slate-900 dark:text-white md:hidden"
                  aria-label={t("Précédent", "Previous")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  {snaps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => emblaApi?.scrollTo(i)}
                      aria-label={`${t("Aller à", "Go to")} ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === selectedIndex ? "w-6 bg-sun" : "w-2 bg-ink/20 dark:bg-white/30"}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={!canScrollNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-soft transition disabled:opacity-30 dark:bg-slate-900 dark:text-white md:hidden"
                  aria-label={t("Suivant", "Next")}
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </section>

          {selectedItem && (
            <div
              className="fixed inset-0 z-[110] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-label={selectedItem[language].title}
              onClick={() => setSelectedItem(null)}
            >
              <article
                className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white shadow-2xl dark:bg-slate-900 sm:rounded-[2rem]"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  aria-label={t("Fermer", "Close")}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md"
                >
                  <X className="h-4 w-4" />
                </button>
                <img
                  src={selectedItem.image}
                  alt={selectedItem[language].title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-7 sm:p-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-sun-deep">
                    {selectedItem[language].label}
                  </span>
                  <h2 className="mt-2 font-display text-3xl font-extrabold text-forest-deep dark:text-white">
                    {selectedItem[language].title}
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-ink/75 dark:text-slate-300">
                    {selectedItem[language].details}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        const item = selectedItem;
                        setSelectedItem(null);
                        setRequest({
                          kind: "devis",
                          subject: item.fr.title,
                          provider: `${title.fr} · ${item.fr.label}`,
                        });
                      }}
                      className="flex-1 rounded-full bg-sun px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 hover:bg-sun-deep"
                    >
                      {t("Demander un devis", "Request a quote")}
                    </button>
                    <Link
                      to="/organisateur"
                      className="flex-1 rounded-full border border-forest/20 px-6 py-3.5 text-center text-sm font-semibold text-forest hover:bg-forest hover:text-white dark:border-slate-700 dark:text-slate-200"
                    >
                      {t("Organiser un événement", "Plan an event")}
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          )}

          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 sm:pb-20">
            <div className="grid overflow-hidden rounded-[2rem] bg-forest-deep md:grid-cols-[1.4fr_1fr]">
              <div className="p-8 text-white sm:p-12">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-sun">
                  {t("Un projet ?", "A project?")}
                </span>
                <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                  {t("Construisons votre événement ensemble", "Let's build your event together")}
                </h2>
                <p className="mt-4 text-white/75">
                  {t(
                    "Notre équipe vous accompagne dans la conception, l'organisation et la réussite de votre prochain événement au Gabon.",
                    "Our team supports you in designing, organizing and succeeding in your next event in Gabon.",
                  )}
                </p>
                <Link
                  to="/organisateur"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-sun px-7 py-3.5 text-sm font-semibold hover:bg-sun-deep"
                >
                  {t("Organiser un événement", "Plan an event")} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <img
                src="/AffichePub.png"
                alt=""
                loading="lazy"
                className="hidden h-full w-full object-cover md:block"
              />
            </div>
          </section>

          <RequestDialog
            target={request}
            onClose={() => setRequest(null)}
            isFrench={language === "fr"}
          />
        </>
      )}
    </PageShell>
  );
}
