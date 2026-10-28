import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Briefcase,
  Building2,
  CalendarCheck,
  Check,
  Compass,
  FileText,
  Handshake,
  Hotel,
  Leaf,
  Map as MapIcon,
  MapPinned,
  Palmtree,
  Plane,
  Star,
  Trees,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { OfferCard } from "@/components/mice/Cards";
import { OfferDetailDialog } from "@/components/mice/DetailDialogs";
import { RequestDialog, type RequestTarget } from "@/components/mice/RequestDialog";
import { InteractiveMap, mapPoints } from "@/components/map/InteractiveMap";
import { specialOffers, type ListingCategory, type SpecialOffer } from "@/lib/mice-data";

type Props = { language: "fr" | "en"; theme: "light" | "dark" };

const tr = (language: "fr" | "en") => (fr: string, en: string) => (language === "fr" ? fr : en);

function Heading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sun-deep dark:text-sun">
          <Leaf className="h-3.5 w-3.5" /> {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-forest-deep dark:text-white sm:text-4xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function SeeAll({ to, label }: { to: "/offres" | "/explorer" | "/carte"; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-sm font-semibold text-forest-deep dark:text-slate-200"
    >
      {label}
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/20 transition-colors group-hover:bg-sun group-hover:text-white dark:border-slate-700">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

/** Bandeau de garanties sous le hero (inspiré du modèle). */
export function FeatureStrip({ language }: Props) {
  const t = tr(language);
  const items = [
    {
      icon: BadgeCheck,
      title: t("Prestataires labellisés", "Labelled providers"),
      text: t("Sélectionnés par l'AGATOUR", "Selected by AGATOUR"),
    },
    {
      icon: CalendarCheck,
      title: t("Réservation en ligne", "Online booking"),
      text: t("Offres, hôtels, salles", "Offers, hotels, venues"),
    },
    {
      icon: FileText,
      title: t("Devis relayés", "Relayed quotes"),
      text: t("Un seul interlocuteur", "A single point of contact"),
    },
    {
      icon: Bot,
      title: t("Assistant IA 24/7", "24/7 AI assistant"),
      text: t("Réponses immédiates", "Instant answers"),
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <div className="grid grid-cols-1 gap-4 rounded-[1.75rem] bg-white p-5 shadow-soft dark:bg-slate-900 min-[420px]:grid-cols-2 md:grid-cols-4 md:gap-2">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 md:justify-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-forest/15 text-forest dark:border-slate-700 dark:text-sun">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink dark:text-white">{title}</span>
              <span className="block text-xs text-ink/55 dark:text-slate-400">{text}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Offres spéciales MICE en cartes (style « Popular destinations » du modèle). */
export function OffersSection({ language }: Props) {
  const t = tr(language);
  const [selected, setSelected] = useState<SpecialOffer | null>(null);
  const [request, setRequest] = useState<RequestTarget | null>(null);
  const book = (o: SpecialOffer) =>
    setRequest({
      kind: "reservation",
      subject: `${o.title.fr} — ${o.venue}`,
      provider: o.venue,
      minGroup: o.minGroup,
      unitPrice: o.priceFcfa,
    });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
      <Heading
        eyebrow={t("Offres spéciales MICE", "MICE special offers")}
        title={t(
          "Entre deux sessions, à moins d'une heure de Libreville",
          "Between sessions, under an hour from Libreville",
        )}
        action={<SeeAll to="/offres" label={t("Toutes les offres", "All offers")} />}
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {specialOffers.slice(0, 4).map((offer) => (
          <div key={offer.id} className="min-w-0">
            <OfferCard
              offer={offer}
              language={language}
              onOpen={() => setSelected(offer)}
              onBook={() => book(offer)}
            />
          </div>
        ))}
      </div>
      {selected && (
        <OfferDetailDialog
          offer={selected}
          language={language}
          onClose={() => setSelected(null)}
          onBook={() => {
            const o = selected;
            setSelected(null);
            book(o);
          }}
        />
      )}
      <RequestDialog
        target={request}
        onClose={() => setRequest(null)}
        isFrench={language === "fr"}
      />
    </section>
  );
}

/** Rangée de catégories à icônes (style modèle). */
export function CategoriesSection({ language }: Props) {
  const t = tr(language);
  const cats: { cat?: ListingCategory; icon: typeof Hotel; label: string; to?: "/carte" }[] = [
    { cat: "salle", icon: Building2, label: t("Salles", "Venues") },
    { cat: "hebergement", icon: Hotel, label: t("Hébergements", "Hotels") },
    { cat: "restaurant", icon: UtensilsCrossed, label: t("Restaurants", "Restaurants") },
    { cat: "circuit", icon: MapIcon, label: t("Circuits", "Tours") },
    { cat: "site", icon: Palmtree, label: t("Sites", "Sites") },
    { cat: "agence", icon: Compass, label: t("Agences", "Agencies") },
    { icon: MapPinned, label: t("Carte", "Map"), to: "/carte" },
  ];
  const itemClass =
    "group flex flex-col items-center gap-3 text-sm font-semibold text-ink/80 dark:text-slate-300";
  const bubble =
    "flex h-16 w-16 items-center justify-center rounded-full bg-sand text-forest transition-all group-hover:-translate-y-1 group-hover:bg-forest group-hover:text-white dark:bg-slate-800 dark:text-sun sm:h-20 sm:w-20";
  return (
    <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
      <div className="grid grid-cols-4 gap-y-6 sm:grid-cols-7">
        {cats.map(({ cat, icon: Icon, label, to }) =>
          to ? (
            <Link key={label} to={to} className={itemClass}>
              <span className={bubble}>
                <Icon className="h-7 w-7" />
              </span>
              {label}
            </Link>
          ) : (
            <Link key={label} to="/explorer" search={{ cat }} className={itemClass}>
              <span className={bubble}>
                <Icon className="h-7 w-7" />
              </span>
              {label}
            </Link>
          ),
        )}
      </div>
    </section>
  );
}

/** Trois profils d'acteurs du cahier des charges. */
export function RolesSection({ language }: Props) {
  const t = tr(language);
  const roles = [
    {
      icon: Plane,
      image: "/pointDenis.jpg",
      title: t("Je suis participant", "I'm a participant"),
      subtitle: t("Touriste d'affaires", "Business traveller"),
      points: [
        t("Découvrir le Gabon MICE et touristique", "Discover Gabon for MICE and leisure"),
        t("Consulter offres, hôtels, salles, circuits", "Browse offers, hotels, venues, tours"),
        t("Réserver directement en ligne", "Book directly online"),
      ],
      cta: t("Explorer l'offre", "Explore the offer"),
      to: "/explorer" as const,
    },
    {
      icon: Briefcase,
      image: "/Palaiscongrès2.webp",
      title: t("J'organise un événement", "I'm organising an event"),
      subtitle: t("Organisateur", "Organiser"),
      points: [
        t("Répertorier mon événement", "List my event"),
        t("Préciser thème, cible et participants", "Specify theme, audience and attendees"),
        t("Exprimer mes besoins en salles et prestations", "Describe venue and service needs"),
      ],
      cta: t("Espace organisateur", "Organiser space"),
      to: "/organisateur" as const,
    },
    {
      icon: Handshake,
      image: "/tortue3.jpg",
      title: t("Je suis prestataire", "I'm a provider"),
      subtitle: t("Opérateur", "Operator"),
      points: [
        t("Être labellisé par l'AGATOUR", "Get labelled by AGATOUR"),
        t("Recevoir des réservations", "Receive bookings"),
        t("Recevoir des demandes de devis", "Receive quote requests"),
      ],
      cta: t("Espace prestataire", "Provider space"),
      to: "/prestataires" as const,
    },
  ];
  return (
    <section className="bg-sand/60 py-16 dark:bg-slate-900/40 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Heading
          eyebrow={t("Un outil, trois acteurs", "One tool, three players")}
          title={t("Par où commencer ?", "Where to start?")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map(({ icon: Icon, image, title, subtitle, points, cta, to }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant dark:bg-slate-900"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sun">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider">{subtitle}</span>
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-extrabold text-forest-deep dark:text-white">
                  {title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-ink/70 dark:text-slate-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest dark:text-emerald-400" />{" "}
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-sun-deep">
                  {cta}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Le Gabon sous deux angles : destination MICE et destination touristique (cahier des charges 4.6). */
export function TwoAnglesSection({ language }: Props) {
  const t = tr(language);
  const cards = [
    {
      image: "/AFAIRES.webp",
      eyebrow: t("Destination MICE", "MICE destination"),
      title: t("Se réunir au Gabon", "Meet in Gabon"),
      text: t(
        "Centres de congrès, salles de réunion, hôtels d'affaires et prestataires labellisés pour vos congrès, séminaires et incentives.",
        "Congress centres, meeting rooms, business hotels and labelled providers for your congresses, seminars and incentives.",
      ),
      links: [
        { label: t("Salles", "Venues"), cat: "salle" as const },
        { label: t("Hébergements", "Hotels"), cat: "hebergement" as const },
      ],
      extra: { label: t("Agenda", "Calendar"), to: "/evenements" as const },
    },
    {
      image: "/Parc.jpg",
      eyebrow: t("Destination touristique", "Tourist destination"),
      title: t("Explorer le Gabon", "Explore Gabon"),
      text: t(
        "13 parcs nationaux, 800 km de littoral sauvage et un patrimoine vivant : prolongez votre séjour d'affaires en découverte.",
        "13 national parks, 800 km of wild coastline and living heritage: extend your business trip into discovery.",
      ),
      links: [
        { label: t("Circuits", "Tours"), cat: "circuit" as const },
        { label: t("Sites", "Sites"), cat: "site" as const },
      ],
      extra: { label: "Destinations", to: "/destinations" as const },
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
      <Heading
        eyebrow={t("Deux angles complémentaires", "Two complementary angles")}
        title={t(
          "Un pays pour travailler, un pays à vivre",
          "A country to work in, a country to experience",
        )}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        {cards.map((c) => (
          <article
            key={c.title}
            className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[2rem] p-7 text-white sm:p-9"
          >
            <img
              src={c.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun">{c.eyebrow}</p>
            <h3 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{c.title}</h3>
            <p className="mt-3 max-w-md text-white/80">{c.text}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {c.links.map((l) => (
                <Link
                  key={l.label}
                  to="/explorer"
                  search={{ cat: l.cat }}
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to={c.extra.to}
                className="rounded-full bg-sun px-4 py-2 text-sm font-semibold transition hover:bg-sun-deep"
              >
                {c.extra.label}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// Points de Libreville et ses environs, pour l'aperçu de carte de l'accueil.
const librevillePoints = mapPoints.filter(
  (p) => p.coords[0] > 0 && p.coords[1] > 9 && p.coords[1] < 10,
);

/** Aperçu de la carte interactive. */
export function MapTeaserSection({ language }: Props) {
  const t = tr(language);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
      <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-white p-4 shadow-soft dark:bg-slate-900 lg:grid-cols-[1fr_1.4fr] lg:p-6">
        <div className="p-3 lg:p-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sun-deep">
            <MapPinned className="h-3.5 w-3.5" /> {t("Carte interactive", "Interactive map")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-forest-deep dark:text-white sm:text-4xl">
            {t("Tout est géolocalisé", "Everything is on the map")}
          </h2>
          <p className="mt-4 text-ink/65 dark:text-slate-400">
            {t(
              "Sites touristiques, hôtels, restaurants, agences de tourisme et salles de conférence : repérez-vous en un coup d'œil et réservez depuis la carte.",
              "Tourist sites, hotels, restaurants, travel agencies and conference venues: find your way at a glance and book from the map.",
            )}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
            {(
              [
                [Trees, t("Sites", "Sites")],
                [Hotel, t("Hôtels", "Hotels")],
                [UtensilsCrossed, t("Restaurants", "Restaurants")],
                [Compass, t("Agences", "Agencies")],
                [Building2, t("Salles", "Venues")],
                [Star, t("Offres", "Offers")],
              ] as const
            ).map(([Icon, label]) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-cream px-3 py-2 font-medium dark:bg-slate-800"
              >
                <Icon className="h-4 w-4 text-forest dark:text-sun" aria-hidden="true" /> {label}
              </li>
            ))}
          </ul>
          <Link
            to="/carte"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-deep px-6 py-3 text-sm font-semibold text-white hover:bg-sun"
          >
            {t("Ouvrir la carte", "Open the map")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <InteractiveMap
          points={librevillePoints}
          interactive={false}
          className="h-[380px] rounded-[1.5rem] lg:h-[460px]"
        />
      </div>
    </section>
  );
}

/** Bannière d'appel à l'action (style « Special offer » du modèle). */
export function PromoBanner({ language }: Props) {
  const t = tr(language);
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 sm:pb-20">
      <div className="grid overflow-hidden rounded-[2rem] bg-forest-deep lg:grid-cols-2">
        <div className="relative h-64 lg:h-auto">
          <img src="/tortue2.jpg" alt="" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest-deep/90 max-lg:bg-gradient-to-t" />
        </div>
        <div className="relative p-8 text-white sm:p-12">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sun">
            <Users className="h-3.5 w-3.5" /> {t("Organisateurs", "Organisers")}
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            {t("Votre prochain événement commence ici", "Your next event starts here")}
          </h2>
          <p className="mt-4 text-white/75">
            {t(
              "Décrivez votre événement : l'AGATOUR mobilise salles, hébergements et prestataires labellisés et vous transmet leurs propositions.",
              "Describe your event: AGATOUR mobilises venues, accommodation and labelled providers and sends you their proposals.",
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/organisateur"
              className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3.5 text-sm font-semibold hover:bg-sun-deep"
            >
              {t("Répertorier mon événement", "List my event")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold hover:bg-white hover:text-ink"
            >
              {t("Nous contacter", "Contact us")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
