import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, X, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { RequestDialog, type RequestTarget } from "@/components/mice/RequestDialog";
import {
  InteractiveMap,
  mapCategoryMeta,
  mapPoints,
  type MapCategory,
} from "@/components/map/InteractiveMap";
import { getListing, specialOffers } from "@/lib/mice-data";

const mapCategories: MapCategory[] = [
  "offre",
  "site",
  "hebergement",
  "restaurant",
  "agence",
  "salle",
  "circuit",
];

type MapSearch = { cat?: MapCategory; focus?: string };

export const Route = createFileRoute("/carte")({
  validateSearch: (search: Record<string, unknown>): MapSearch => ({
    cat: mapCategories.includes(search.cat as MapCategory)
      ? (search.cat as MapCategory)
      : undefined,
    focus: typeof search.focus === "string" && search.focus ? search.focus : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Carte interactive — sites, hôtels, restaurants, salles | GabonMICE" },
      {
        name: "description",
        content:
          "Géolocalisez les sites touristiques, hôtels, restaurants, agences de tourisme et salles de conférence au Gabon.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/carte" });
  const [request, setRequest] = useState<RequestTarget | null>(null);
  const activeId = search.focus ?? null;

  const points = useMemo(
    () =>
      mapPoints.filter((p) => !search.cat || p.category === search.cat || p.id === search.focus),
    [search.cat, search.focus],
  );
  const active = mapPoints.find((p) => p.id === activeId) ?? null;

  const setSearch = (patch: MapSearch) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const requestFor = (id: string) => {
    const offer = specialOffers.find((o) => o.id === id);
    if (offer) {
      setRequest({
        kind: "reservation",
        subject: `${offer.title.fr} — ${offer.venue}`,
        provider: offer.venue,
        minGroup: offer.minGroup,
        unitPrice: offer.priceFcfa,
      });
      return;
    }
    const listing = getListing(id);
    if (listing)
      setRequest({ kind: listing.booking, subject: listing.name, provider: listing.city });
  };

  return (
    <PageShell>
      {({ language, t }) => (
        <section className="mx-auto max-w-[1500px] px-3 pb-10 pt-4 sm:px-5">
          <div className="mb-4 flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-deep">
                {t("Géolocalisation", "Geolocation")}
              </p>
              <h1 className="font-display text-3xl font-extrabold text-forest-deep dark:text-white sm:text-4xl">
                {t("Carte interactive du Gabon MICE", "Gabon MICE interactive map")}
              </h1>
            </div>
            <p className="text-sm text-ink/60 dark:text-slate-400">
              {points.length} {t("lieux affichés", "places shown")}
            </p>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Chip
              active={!search.cat}
              onClick={() => setSearch({ cat: undefined })}
              color="#14261C"
            >
              {t("Tout afficher", "Show all")}
            </Chip>
            {mapCategories.map((cat) => (
              <Chip
                key={cat}
                active={search.cat === cat}
                onClick={() => setSearch({ cat, focus: undefined })}
                color={mapCategoryMeta[cat].color}
              >
                <CategoryIcon icon={mapCategoryMeta[cat].icon} />
                {mapCategoryMeta[cat].label[language]}
              </Chip>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
            <div className="order-2 max-h-[70vh] space-y-2 overflow-y-auto rounded-[1.75rem] bg-white p-2 shadow-soft dark:bg-slate-900 lg:order-1">
              {points.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSearch({ focus: p.id })}
                  className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition-colors ${
                    p.id === activeId
                      ? "bg-forest/10 ring-2 ring-forest/40"
                      : "hover:bg-cream dark:hover:bg-slate-800"
                  }`}
                >
                  <img
                    src={p.image}
                    alt=""
                    className="h-16 w-20 shrink-0 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <span className="min-w-0">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: mapCategoryMeta[p.category].color }}
                    >
                      <CategoryIcon icon={mapCategoryMeta[p.category].icon} className="h-3 w-3" />{" "}
                      {mapCategoryMeta[p.category].label[language]}
                    </span>
                    <span className="block truncate text-sm font-bold">{p.name}</span>
                    <span className="flex items-center gap-1 text-xs text-ink/55 dark:text-slate-400">
                      <MapPin className="h-3 w-3" /> {p.city}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="relative order-1 lg:order-2">
              <InteractiveMap
                points={points}
                activeId={activeId}
                onSelect={(id) => setSearch({ focus: id })}
                className="h-[55vh] rounded-[1.75rem] shadow-soft lg:h-[70vh]"
              />
              {active && (
                <div className="absolute inset-x-3 bottom-3 z-[500] flex gap-4 rounded-[1.5rem] bg-white p-3 shadow-float dark:bg-slate-900 sm:left-4 sm:right-auto sm:w-[24rem]">
                  <img
                    src={active.image}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[11px] font-bold"
                      style={{ color: mapCategoryMeta[active.category].color }}
                    >
                      {mapCategoryMeta[active.category].label[language]} · {active.city}
                    </p>
                    <p className="truncate font-display font-extrabold">{active.name}</p>
                    <p className="line-clamp-2 text-xs text-ink/60 dark:text-slate-400">
                      {active.summary[language]}
                    </p>
                    <button
                      type="button"
                      onClick={() => requestFor(active.id)}
                      className="mt-2 rounded-full bg-sun px-4 py-1.5 text-xs font-semibold text-white hover:bg-sun-deep"
                    >
                      {active.category === "offre" ||
                      getListing(active.id)?.booking === "reservation"
                        ? t("Réserver", "Book")
                        : t("Demander un devis", "Get a quote")}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearch({ focus: undefined })}
                    aria-label={t("Fermer", "Close")}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream dark:bg-slate-800"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 px-1 text-xs text-ink/50 dark:text-slate-500">
            {t("Positions indicatives.", "Approximate locations.")}
          </p>
          <RequestDialog
            target={request}
            onClose={() => setRequest(null)}
            isFrench={language === "fr"}
          />
        </section>
      )}
    </PageShell>
  );
}

function Chip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={active ? { backgroundColor: color, borderColor: color } : undefined}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "text-white"
          : "border-black/5 bg-white text-ink/75 hover:border-black/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

function CategoryIcon({
  icon: Icon,
  className = "h-4 w-4",
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return <Icon className={`inline-block shrink-0 ${className}`} aria-hidden="true" />;
}
