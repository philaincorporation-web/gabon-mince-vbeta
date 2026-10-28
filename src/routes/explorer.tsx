import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  LayoutGrid,
  Map as MapIcon,
  Search,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { PageHero, PageShell } from "@/components/layout/PageShell";
import { ListingCard } from "@/components/mice/Cards";
import { ListingDetailDialog } from "@/components/mice/DetailDialogs";
import { RequestDialog, type RequestTarget } from "@/components/mice/RequestDialog";
import {
  categoryMeta,
  categoryOrder,
  cities,
  listings,
  type Listing,
  type ListingCategory,
} from "@/lib/mice-data";

type ExplorerSearch = {
  cat?: ListingCategory;
  q?: string;
  ville?: string;
  participants?: number;
};

export const Route = createFileRoute("/explorer")({
  validateSearch: (search: Record<string, unknown>): ExplorerSearch => ({
    cat: categoryOrder.includes(search.cat as ListingCategory)
      ? (search.cat as ListingCategory)
      : undefined,
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    ville: typeof search.ville === "string" && search.ville ? search.ville : undefined,
    participants: Number(search.participants) > 0 ? Number(search.participants) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explorer l'offre MICE — salles, hébergements, circuits | GabonMICE" },
      {
        name: "description",
        content:
          "Salles de conférence, hébergements, restaurants, agences, sites et circuits touristiques au Gabon. Réservez ou demandez un devis.",
      },
    ],
  }),
  component: ExplorerPage,
});

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function ExplorerPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explorer" });
  const [labelledOnly, setLabelledOnly] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [request, setRequest] = useState<RequestTarget | null>(null);
  const [query, setQuery] = useState(search.q ?? "");

  const update = (patch: Partial<ExplorerSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const results = useMemo(() => {
    const q = normalize(search.q ?? "");
    return listings.filter((l) => {
      if (search.cat && l.category !== search.cat) return false;
      if (search.ville && l.city !== search.ville) return false;
      if (labelledOnly && !l.labelled) return false;
      if (search.participants && l.capacity && l.capacity < search.participants) return false;
      if (!q) return true;
      return normalize(`${l.name} ${l.city} ${l.summary.fr} ${l.summary.en}`).includes(q);
    });
  }, [search, labelledOnly]);

  const countFor = (cat?: ListingCategory) =>
    listings.filter((l) => !cat || l.category === cat).length;

  const openRequest = (l: Listing) =>
    setRequest({
      kind: l.booking,
      subject: l.name,
      provider: `${categoryMeta[l.category].label.fr} · ${l.city}`,
      minGroup: search.participants,
    });

  return (
    <PageShell>
      {({ language, t }) => (
        <>
          <PageHero
            image="/baiedesRois2.webp"
            eyebrow={t("Catalogue MICE", "MICE catalogue")}
            title={t("Tout ce qu'il faut pour", "Everything you need for")}
            highlight={t("votre séjour d'affaires", "your business trip")}
            intro={t(
              "Salles de conférence, hébergements, restaurants, agences, sites et circuits : consultez l'offre et réservez directement, ou demandez un devis relayé par l'AGATOUR.",
              "Conference venues, accommodation, restaurants, agencies, sites and tours: browse and book directly, or request a quote relayed by AGATOUR.",
            )}
            crumb={t("Explorer", "Explore")}
            homeLabel={t("Accueil", "Home")}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                update({ q: query.trim() || undefined });
              }}
              className="flex max-w-2xl items-center gap-2 rounded-full bg-white p-2 shadow-float dark:bg-slate-900"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-ink/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Hôtel, salle, ville, plage…", "Hotel, venue, city, beach…")}
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink outline-none dark:text-white"
              />
              <button
                type="submit"
                className="rounded-full bg-forest-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-sun"
              >
                {t("Rechercher", "Search")}
              </button>
            </form>
          </PageHero>

          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 sm:py-14">
            <div className="flex flex-wrap gap-2">
              <CategoryTab
                active={!search.cat}
                onClick={() => update({ cat: undefined })}
                label={t("Tout", "All")}
                count={countFor()}
                icon={LayoutGrid}
              />
              {categoryOrder.map((cat) => (
                <CategoryTab
                  key={cat}
                  active={search.cat === cat}
                  onClick={() => update({ cat })}
                  label={categoryMeta[cat].plural[language]}
                  count={countFor(cat)}
                  icon={categoryMeta[cat].icon}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] bg-white p-3 shadow-soft dark:bg-slate-900 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <SlidersHorizontal className="ml-2 h-4 w-4 text-ink/50" />
                <select
                  value={search.ville ?? ""}
                  onChange={(e) => update({ ville: e.target.value || undefined })}
                  className="rounded-full border border-black/10 bg-cream px-4 py-2 text-sm font-medium outline-none dark:border-slate-700 dark:bg-slate-800"
                  aria-label={t("Ville", "City")}
                >
                  <option value="">{t("Toutes les villes", "All cities")}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setLabelledOnly((v) => !v)}
                  aria-pressed={labelledOnly}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    labelledOnly
                      ? "bg-forest text-white"
                      : "bg-cream text-ink/70 hover:bg-sand dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <BadgeCheck className="h-4 w-4" />
                  {t("Labellisés AGATOUR", "AGATOUR labelled")}
                </button>
                {(search.q || search.ville || search.cat || search.participants) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      navigate({ search: {}, replace: true, resetScroll: false });
                    }}
                    className="px-3 py-2 text-sm font-semibold text-sun-deep hover:underline"
                  >
                    {t("Réinitialiser", "Reset")}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 px-2 text-sm">
                <span className="text-ink/60 dark:text-slate-400">
                  {results.length} {t("résultat(s)", "result(s)")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-forest-deep px-3 py-1.5 text-xs font-semibold text-white">
                  <LayoutGrid className="h-3.5 w-3.5" /> {t("Liste", "List")}
                </span>
                <Link
                  to="/carte"
                  search={{ cat: search.cat }}
                  className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1.5 text-xs font-semibold hover:bg-sand dark:bg-slate-800"
                >
                  <MapIcon className="h-3.5 w-3.5" /> {t("Carte", "Map")}
                </Link>
              </div>
            </div>

            {search.participants && (
              <p className="mt-4 text-sm text-ink/60 dark:text-slate-400">
                {t(
                  `Recherche pour ${search.participants} participants — les lieux sans capacité renseignée restent affichés (capacité confirmée sur devis).`,
                  `Searching for ${search.participants} attendees — venues without a listed capacity are still shown (capacity confirmed on quote).`,
                )}
              </p>
            )}

            {results.length === 0 ? (
              <div className="mt-10 rounded-[2rem] bg-white p-12 text-center dark:bg-slate-900">
                <p className="font-display text-xl font-extrabold">
                  {t("Aucun résultat", "No results")}
                </p>
                <p className="mt-2 text-ink/60 dark:text-slate-400">
                  {t(
                    "Essayez une autre catégorie ou décrivez votre besoin : l'AGATOUR trouvera le bon prestataire.",
                    "Try another category or describe your need: AGATOUR will find the right provider.",
                  )}
                </p>
                <Link
                  to="/organisateur"
                  className="mt-6 inline-flex rounded-full bg-sun px-6 py-3 text-sm font-semibold text-white hover:bg-sun-deep"
                >
                  {t("Exprimer mon besoin", "Describe my need")}
                </Link>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    language={language}
                    onOpen={() => setSelected(listing)}
                    onRequest={() => openRequest(listing)}
                  />
                ))}
              </div>
            )}

            <div className="mt-14 grid gap-4 rounded-[2rem] bg-sand p-6 dark:bg-slate-900 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-display text-xl font-extrabold text-forest-deep dark:text-white">
                  {t(
                    "Vous êtes hôtelier, gestionnaire de salle ou agence ?",
                    "Are you a hotelier, venue manager or agency?",
                  )}
                </p>
                <p className="mt-1 text-sm text-ink/65 dark:text-slate-400">
                  {t(
                    "Faites-vous labelliser par l'AGATOUR pour apparaître ici et recevoir réservations et demandes de devis.",
                    "Get labelled by AGATOUR to appear here and receive bookings and quote requests.",
                  )}
                </p>
              </div>
              <Link
                to="/prestataires"
                className="rounded-full bg-forest-deep px-6 py-3 text-center text-sm font-semibold text-white hover:bg-forest"
              >
                {t("Devenir prestataire labellisé", "Become a labelled provider")}
              </Link>
            </div>
          </section>

          {selected && (
            <ListingDetailDialog
              listing={selected}
              language={language}
              onClose={() => setSelected(null)}
              onRequest={() => {
                const l = selected;
                setSelected(null);
                openRequest(l);
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

function CategoryTab({
  active,
  onClick,
  label,
  count,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "border-forest-deep bg-forest-deep text-white shadow-lg shadow-forest/20"
          : "border-black/5 bg-white text-ink/75 hover:border-forest/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] ${active ? "bg-white/20" : "bg-cream dark:bg-slate-800"}`}
      >
        {count}
      </span>
    </button>
  );
}
