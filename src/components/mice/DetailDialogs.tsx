import { useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Clock, MapPin, Users, Wallet, X } from "lucide-react";
import { LabelBadge } from "@/components/mice/Cards";
import { categoryMeta, formatFcfa, type Listing, type SpecialOffer } from "@/lib/mice-data";

type Lang = "fr" | "en";

function Modal({
  onClose,
  label,
  children,
}: {
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] bg-white text-ink shadow-2xl dark:bg-slate-900 dark:text-slate-100 sm:rounded-[2rem]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer / Close"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-md hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function OfferDetailDialog({
  offer,
  language,
  onClose,
  onBook,
}: {
  offer: SpecialOffer;
  language: Lang;
  onClose: () => void;
  onBook: () => void;
}) {
  const isFrench = language === "fr";
  const facts = [
    { icon: Clock, label: isFrench ? "Durée" : "Duration", value: offer.duration[language] },
    {
      icon: Users,
      label: "Format",
      value: isFrench
        ? `Groupe à partir de ${offer.minGroup} personnes`
        : `Groups from ${offer.minGroup} people`,
    },
    {
      icon: Wallet,
      label: isFrench ? "Tarif" : "Price",
      value: `${formatFcfa(offer.priceFcfa)} ${offer.priceNote[language]}`,
    },
  ];

  return (
    <Modal onClose={onClose} label={offer.title[language]}>
      <div className="relative h-64 sm:h-80">
        <img src={offer.image} alt={offer.title[language]} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white sm:left-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sun">
            {isFrench ? "Offre" : "Offer"} {offer.number} · {offer.venue}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            {offer.title[language]}
          </h2>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-cream p-4 dark:bg-slate-800">
              <Icon className="h-5 w-5 text-sun-deep" />
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">
                {label}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 font-display text-lg font-extrabold">
          {isFrench ? "Déroulé" : "Programme"}
        </h3>
        <ol className="mt-4 space-y-0">
          {offer.steps.map((step, i) => (
            <li key={step.fr} className="relative flex gap-4 pb-5 last:pb-0">
              {i < offer.steps.length - 1 && (
                <span
                  className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-forest/20"
                  aria-hidden="true"
                />
              )}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="pt-1 text-sm leading-relaxed text-ink/80 dark:text-slate-300">
                {step[language]}
              </p>
            </li>
          ))}
        </ol>

        <h3 className="mt-8 font-display text-lg font-extrabold">
          {isFrench ? "Inclus" : "Included"}
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {offer.included.map((item) => (
            <li
              key={item.fr}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1.5 text-sm font-medium text-forest dark:bg-forest/25 dark:text-emerald-200"
            >
              <Check className="h-4 w-4" /> {item[language]}
            </li>
          ))}
        </ul>

        <blockquote className="mt-8 rounded-2xl border-l-4 border-sun bg-sun/10 px-5 py-4 text-sm italic leading-relaxed">
          {offer.pitch[language]}
        </blockquote>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBook}
            className="flex-1 rounded-full bg-sun px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 hover:bg-sun-deep"
          >
            {isFrench ? "Réserver cette offre" : "Book this offer"}
          </button>
          <Link
            to="/carte"
            search={{ focus: offer.id }}
            className="flex-1 rounded-full border border-forest/20 px-6 py-3.5 text-center text-sm font-semibold text-forest hover:bg-forest hover:text-white dark:border-slate-700 dark:text-slate-200"
          >
            {isFrench ? "Voir sur la carte" : "See on the map"}
          </Link>
        </div>
      </div>
    </Modal>
  );
}

export function ListingDetailDialog({
  listing,
  language,
  onClose,
  onRequest,
}: {
  listing: Listing;
  language: Lang;
  onClose: () => void;
  onRequest: () => void;
}) {
  const isFrench = language === "fr";
  const meta = categoryMeta[listing.category];
  return (
    <Modal onClose={onClose} label={listing.name}>
      <div className="relative h-60 sm:h-72">
        <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold"
              style={{ backgroundColor: meta.color }}
            >
              {meta.label[language]}
            </span>
            {listing.labelled && <LabelBadge language={language} />}
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold">{listing.name}</h2>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-white/80">
            <MapPin className="h-4 w-4" /> {listing.city}
          </p>
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-base leading-relaxed text-ink/80 dark:text-slate-300">
          {listing.details[language]}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {listing.highlights.map((h) => (
            <span
              key={h.fr}
              className="rounded-full bg-cream px-3 py-1.5 text-sm font-medium dark:bg-slate-800"
            >
              {h[language]}
            </span>
          ))}
        </div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-cream p-4 dark:bg-slate-800">
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">
              {isFrench ? "Tarif" : "Price"}
            </dt>
            <dd className="mt-1 font-semibold text-sun-deep">
              {listing.price ? listing.price[language] : isFrench ? "Sur devis" : "On quote"}
            </dd>
          </div>
          <div className="rounded-2xl bg-cream p-4 dark:bg-slate-800">
            <dt className="text-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-slate-400">
              {isFrench ? "Capacité" : "Capacity"}
            </dt>
            <dd className="mt-1 font-semibold">
              {listing.capacity
                ? `${listing.capacity} pers.`
                : isFrench
                  ? "Sur demande"
                  : "On request"}
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRequest}
            className="flex-1 rounded-full bg-sun px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 hover:bg-sun-deep"
          >
            {listing.booking === "reservation"
              ? isFrench
                ? "Réserver"
                : "Book"
              : isFrench
                ? "Demander un devis"
                : "Request a quote"}
          </button>
          <Link
            to="/carte"
            search={{ focus: listing.id }}
            className="flex-1 rounded-full border border-forest/20 px-6 py-3.5 text-center text-sm font-semibold text-forest hover:bg-forest hover:text-white dark:border-slate-700 dark:text-slate-200"
          >
            {isFrench ? "Voir sur la carte" : "See on the map"}
          </Link>
        </div>
      </div>
    </Modal>
  );
}
