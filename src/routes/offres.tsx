import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Hourglass, MapPinned, Wallet } from "lucide-react";
import { PageHero, PageShell, SectionTitle } from "@/components/layout/PageShell";
import { OfferCard } from "@/components/mice/Cards";
import { OfferDetailDialog } from "@/components/mice/DetailDialogs";
import { RequestDialog, type RequestTarget } from "@/components/mice/RequestDialog";
import { specialOffers, type SpecialOffer } from "@/lib/mice-data";

export const Route = createFileRoute("/offres")({
  head: () => ({
    meta: [
      { title: "Offres spéciales MICE — Libreville et environs | GabonMICE" },
      {
        name: "description",
        content:
          "Packages courts pour touristes d'affaires : Arboretum Raponda-Walker, Cap Caravane, River Lodge, Baie des Tortues, La Maringa. Réservation en ligne.",
      },
    ],
  }),
  component: OffersPage,
});

type DurationFilter = "all" | "half" | "full";

function OffersPage() {
  const [selected, setSelected] = useState<SpecialOffer | null>(null);
  const [request, setRequest] = useState<RequestTarget | null>(null);
  const [duration, setDuration] = useState<DurationFilter>("all");
  const [budget, setBudget] = useState<number>(50000);

  const offers = useMemo(
    () =>
      specialOffers.filter((o) => {
        const isHalf = o.durationShort.fr.startsWith("≈");
        if (duration === "half" && !isHalf) return false;
        if (duration === "full" && isHalf) return false;
        return o.priceFcfa <= budget;
      }),
    [duration, budget],
  );

  const book = (offer: SpecialOffer) =>
    setRequest({
      kind: "reservation",
      subject: `${offer.title.fr} — ${offer.venue}`,
      provider: offer.venue,
      minGroup: offer.minGroup,
      unitPrice: offer.priceFcfa,
    });

  return (
    <PageShell>
      {({ language, t }) => (
        <>
          <PageHero
            image="/pog.jpg"
            eyebrow={t("Offres spéciales MICE", "MICE special offers")}
            title={t("Entre deux sessions,", "Between two sessions,")}
            highlight={t("respirez le Gabon.", "breathe in Gabon.")}
            intro={t(
              "Des formats courts, de la demi-journée à la journée complète, à insérer entre deux sessions de travail ou en clôture d'événement — sans quitter Libreville et ses environs.",
              "Short formats, from half a day to a full day, to fit between work sessions or close an event — without leaving Libreville and its surroundings.",
            )}
            crumb={t("Offres spéciales", "Special offers")}
            homeLabel={t("Accueil", "Home")}
          />

          <section className="mx-auto -mt-8 max-w-6xl px-4 sm:px-6">
            <div className="relative z-10 grid gap-3 rounded-[1.75rem] bg-white p-3 shadow-float dark:bg-slate-900 sm:grid-cols-4">
              {[
                { icon: Hourglass, fr: "3h à 1 journée", en: "3h to 1 day" },
                {
                  icon: MapPinned,
                  fr: "≤ 20 min à 1h de Libreville",
                  en: "20 min to 1h from Libreville",
                },
                { icon: Wallet, fr: "Dès 10 000 FCFA / pers.", en: "From 10,000 FCFA / pers." },
                { icon: CalendarClock, fr: "Transferts inclus", en: "Transfers included" },
              ].map(({ icon: Icon, fr, en }) => (
                <div key={fr} className="flex items-center gap-3 rounded-2xl px-3 py-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10 text-forest dark:text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold">{t(fr, en)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 sm:py-20">
            <SectionTitle
              eyebrow={t("5 packages clé en main", "5 turnkey packages")}
              title={t("Choisissez votre parenthèse", "Choose your break")}
              text={t(
                "Tarifs adultes en vigueur auprès des prestataires partenaires. Réservez en ligne : l'AGATOUR confirme avec le prestataire.",
                "Adult rates from partner providers. Book online: AGATOUR confirms with the provider.",
              )}
            />

            <div className="mb-8 flex flex-col gap-4 rounded-[1.5rem] bg-white p-4 shadow-soft dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label={t("Durée", "Duration")}
              >
                {(
                  [
                    ["all", "Toutes durées", "All durations"],
                    ["half", "Demi-journée / soirée", "Half day / evening"],
                    ["full", "Journée complète", "Full day"],
                  ] as const
                ).map(([value, fr, en]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDuration(value)}
                    aria-pressed={duration === value}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      duration === value
                        ? "bg-forest-deep text-white"
                        : "bg-cream text-ink/70 hover:bg-sand dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {t(fr, en)}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-3 text-sm font-semibold">
                <span className="whitespace-nowrap">
                  {t("Budget max / pers.", "Max budget / pers.")}
                </span>
                <input
                  type="range"
                  min={10000}
                  max={50000}
                  step={5000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-36 accent-[var(--color-sun)]"
                />
                <span className="w-28 text-right text-sun-deep">
                  {budget.toLocaleString("fr-FR")} FCFA
                </span>
              </label>
            </div>

            {offers.length === 0 ? (
              <p className="rounded-[1.5rem] bg-white p-10 text-center text-ink/60 dark:bg-slate-900 dark:text-slate-400">
                {t("Aucune offre ne correspond à ces critères.", "No offer matches these filters.")}
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {offers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    language={language}
                    onOpen={() => setSelected(offer)}
                    onBook={() => book(offer)}
                  />
                ))}
              </div>
            )}

            <div className="mt-14 overflow-hidden rounded-[2rem] bg-forest-deep p-8 text-white sm:p-12">
              <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun">
                    {t("Sur mesure", "Tailor-made")}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-extrabold">
                    {t(
                      "Un programme pour toute votre délégation ?",
                      "A programme for your whole delegation?",
                    )}
                  </h2>
                  <p className="mt-3 text-white/75">
                    {t(
                      "Combinez plusieurs offres, ajoutez hébergement et salles : décrivez votre événement et l'AGATOUR vous transmet un devis consolidé.",
                      "Combine several offers, add accommodation and venues: describe your event and AGATOUR sends you a consolidated quote.",
                    )}
                  </p>
                </div>
                <a
                  href="/organisateur"
                  className="justify-self-start rounded-full bg-sun px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 hover:bg-sun-deep md:justify-self-end"
                >
                  {t("Décrire mon événement", "Describe my event")}
                </a>
              </div>
            </div>
          </section>

          {selected && (
            <OfferDetailDialog
              offer={selected}
              language={language}
              onClose={() => setSelected(null)}
              onBook={() => {
                const offer = selected;
                setSelected(null);
                book(offer);
              }}
            />
          )}
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
