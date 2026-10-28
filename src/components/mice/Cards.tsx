import { BadgeCheck, Clock, MapPin, Users } from "lucide-react";
import { categoryMeta, formatFcfa, type Listing, type SpecialOffer } from "@/lib/mice-data";

type Lang = "fr" | "en";

/** Carte « offre spéciale » : photo, badge durée, prix en orange (style modèle). */
export function OfferCard({
  offer,
  language,
  onOpen,
  onBook,
}: {
  offer: SpecialOffer;
  language: Lang;
  onOpen: () => void;
  onBook: () => void;
}) {
  const isFrench = language === "fr";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant dark:bg-slate-900">
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[4/3] overflow-hidden text-left"
      >
        <img
          src={offer.image}
          alt={offer.title[language]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-forest-deep/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <Clock className="h-3.5 w-3.5 text-sun" />
          {offer.durationShort[language]}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-sun px-3 py-1.5 text-xs font-bold text-white shadow-md">
          {formatFcfa(offer.priceFcfa)}
          <span className="font-medium text-white/80"> /pers.</span>
        </span>
        <div className="absolute inset-x-4 bottom-4 text-white">
          <p className="text-[11px] font-bold uppercase tracking-wider text-sun">
            {isFrench ? "Offre" : "Offer"} {offer.number}
          </p>
          <h3 className="font-display text-xl font-extrabold leading-tight">
            {offer.title[language]}
          </h3>
          <p className="mt-0.5 truncate text-sm text-white/80">{offer.venue}</p>
        </div>
      </button>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {offer.city}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />{" "}
            {isFrench ? `dès ${offer.minGroup} pers.` : `from ${offer.minGroup} people`}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/70 dark:text-slate-300">
          {offer.pitch[language]}
        </p>
        <div className="mt-auto flex gap-2 pt-5">
          <button
            type="button"
            onClick={onOpen}
            className="flex-1 rounded-full border border-forest/20 px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-white dark:border-slate-700 dark:text-slate-200"
          >
            {isFrench ? "Programme" : "Programme"}
          </button>
          <button
            type="button"
            onClick={onBook}
            className="flex-1 rounded-full bg-sun px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sun/25 transition-colors hover:bg-sun-deep"
          >
            {isFrench ? "Réserver" : "Book"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function LabelBadge({ language, className = "" }: { language: Lang; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-forest shadow-sm ${className}`}
      title={
        language === "fr" ? "Prestataire labellisé par l'AGATOUR" : "Provider labelled by AGATOUR"
      }
    >
      <BadgeCheck className="h-3.5 w-3.5" />
      {language === "fr" ? "Labellisé AGATOUR" : "AGATOUR labelled"}
    </span>
  );
}

/** Carte d'annuaire (hébergement, salle, restaurant, site, circuit…). */
export function ListingCard({
  listing,
  language,
  onOpen,
  onRequest,
}: {
  listing: Listing;
  language: Lang;
  onOpen: () => void;
  onRequest: () => void;
}) {
  const isFrench = language === "fr";
  const meta = categoryMeta[listing.category];
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant dark:bg-slate-900">
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[16/11] overflow-hidden"
      >
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-sm"
          style={{ backgroundColor: meta.color }}
        >
          {meta.label[language]}
        </span>
        {listing.labelled && <LabelBadge language={language} className="absolute right-4 top-4" />}
      </button>
      <div className="flex flex-1 flex-col p-5">
        <p className="inline-flex items-center gap-1 text-xs font-medium text-ink/55 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" /> {listing.city}
        </p>
        <h3 className="mt-1.5 font-display text-lg font-extrabold leading-snug text-forest-deep dark:text-white">
          {listing.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65 dark:text-slate-300">
          {listing.summary[language]}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.highlights.map((h) => (
            <span
              key={h.fr}
              className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink/70 dark:bg-slate-800 dark:text-slate-300"
            >
              {h[language]}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-sm font-bold text-sun-deep">
            {listing.price ? listing.price[language] : isFrench ? "Sur devis" : "On quote"}
          </span>
          <button
            type="button"
            onClick={onRequest}
            className="rounded-full bg-forest-deep px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sun"
          >
            {listing.booking === "reservation"
              ? isFrench
                ? "Réserver"
                : "Book"
              : isFrench
                ? "Demander un devis"
                : "Get a quote"}
          </button>
        </div>
      </div>
    </article>
  );
}
