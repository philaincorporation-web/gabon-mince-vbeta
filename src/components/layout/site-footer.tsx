import { useState, type FormEvent } from "react";
import { Leaf, Mountain, Trees, Waves } from "lucide-react";
import {
  homeCopyFr,
  homeCopyEn,
  stats,
  type SocialPlatform,
  socialPlatforms,
} from "@/lib/home-data";

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const className = "h-4 w-4";
  const paths: Record<SocialPlatform, React.ReactNode> = {
    linkedin: (
      <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.75h2.88V18H5.5zM10.27 9.75h2.76v1.12h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.91 3.45 4.4V18h-2.88v-7.4c0-1.76-.03-4.03-2.46-4.03-2.46 0-2.84 1.92-2.84 3.9V18H10.27z" />
    ),
    twitter: (
      <path d="M18.9 5H21l-6.2 7.1L22 19h-5.6l-4.3-5.6L7.3 19H5.2l6.7-7.6L2 5h5.7l3.9 5.2L18.9 5Zm-1 12.4h1.1L7.2 6.5H6.1l11.8 10.9Z" />
    ),
    instagram: (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
    youtube: (
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.6.4a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.4 7.6.4 7.6.4s5.8 0 7.6-.4a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 22 12a29.4 29.4 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    ),
  };

  const outlined = platform === "instagram";
  return (
    <svg
      viewBox="0 0 24 24"
      fill={outlined ? "none" : "currentColor"}
      stroke={outlined ? "currentColor" : "none"}
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      {paths[platform]}
    </svg>
  );
}

const statIcons = [Trees, Leaf, Waves, Mountain];
const statLabelsEn = ["National Parks", "Forest cover", "Wild coastline", "Forest elephants"];

interface SiteFooterProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function SiteFooter({ language, theme }: SiteFooterProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const [subscribed, setSubscribed] = useState(false);
  const muted = isDark ? "text-slate-400" : "text-ink/60";
  const heading = isDark ? "text-slate-100" : "text-ink";

  const columns: { title: string; links: [string, string][] }[] = [
    {
      title: "MICE",
      links: [
        [isFrench ? "Offres spéciales" : "Special offers", "/offres"],
        [isFrench ? "Salles de conférence" : "Conference venues", "/explorer?cat=salle"],
        [isFrench ? "Hébergements" : "Accommodation", "/explorer?cat=hebergement"],
        [copy.sections.footerLink1, "/lieux"],
        [isFrench ? "Agenda des événements" : "Events calendar", "/evenements"],
      ],
    },
    {
      title: copy.sections.footerExplore,
      links: [
        ["Destinations", "/destinations"],
        [isFrench ? "Expériences" : "Experiences", "/experiences"],
        [isFrench ? "Circuits" : "Tours", "/explorer?cat=circuit"],
        [isFrench ? "Carte interactive" : "Interactive map", "/carte"],
        [copy.sections.footerLink3, "/investir"],
      ],
    },
    {
      title: copy.sections.footerInstitutional,
      links: [
        [isFrench ? "Espace organisateur" : "Organiser space", "/organisateur"],
        [isFrench ? "Espace prestataire" : "Provider space", "/prestataires"],
        [isFrench ? "Qui sommes-nous" : "About us", "/about"],
        [copy.sections.footerLink7, "/actualites"],
        [copy.sections.footerLink8, "/contact"],
      ],
    },
  ];

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
    event.currentTarget.reset();
  }

  return (
    <footer className={`transition-colors duration-500 ${isDark ? "bg-slate-950" : "bg-cream"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-2 gap-6 border-y py-8 md:grid-cols-[repeat(4,1fr)_auto] md:items-center ${isDark ? "border-slate-800" : "border-black/5"}`}
        >
          {stats.map((s, i) => {
            const Icon = statIcons[i];
            return (
              <div key={s.l} className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${isDark ? "bg-slate-900 text-sun" : "bg-white text-forest shadow-sm"}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className={`font-display text-xl font-extrabold ${heading}`}>{s.n}</div>
                  <div className={`text-xs ${muted}`}>{isFrench ? s.l : statLabelsEn[i]}</div>
                </div>
              </div>
            );
          })}
          <div className="col-span-2 md:col-span-1 md:border-l md:pl-8 border-black/5">
            <p className={`mb-2 text-xs font-semibold ${heading}`}>
              {isFrench ? "Suivez-nous" : "Follow us"}
            </p>
            <div className="flex gap-2">
              {socialPlatforms.map((platform) => (
                <a
                  key={platform}
                  href="#"
                  aria-label={platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-deep text-white transition-colors hover:bg-sun"
                >
                  <SocialIcon platform={platform} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)_1.4fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-forest/10">
                <img
                  src="/logo%20GabonMince.png"
                  alt="GabonMICE"
                  className="h-full w-full rounded-full object-cover"
                />
              </span>
              <span
                className={`font-display text-xl font-extrabold ${isDark ? "text-white" : "text-forest-deep"}`}
              >
                Gabon<span className="text-sun">MICE</span>
              </span>
            </div>
            <p className={`mt-5 max-w-xs text-sm leading-relaxed ${muted}`}>
              {isFrench
                ? "La plateforme officielle du tourisme d'affaires au Gabon : organisateurs, prestataires labellisés et participants réunis sur un même outil."
                : "The official business tourism platform of Gabon: organisers, labelled providers and participants on a single tool."}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className={`text-xs ${muted}`}>
                {isFrench ? "Une initiative" : "An initiative by"}
              </span>
              <img
                src="/LogoAGATOUR.jpg"
                alt="AGATOUR"
                className="h-10 w-auto rounded-lg bg-white object-contain p-1"
              />
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className={`mb-5 text-sm font-bold ${heading}`}>{column.title}</h4>
              <ul className={`space-y-3 text-sm ${muted}`}>
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="transition-colors hover:text-sun-deep">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className={`mb-2 text-sm font-bold ${heading}`}>{copy.sections.newsletterLabel}</h4>
            <p className={`mb-4 text-sm ${muted}`}>{copy.sections.newsletterText}</p>
            {subscribed ? (
              <p className="rounded-2xl bg-forest/10 px-4 py-3 text-sm font-semibold text-forest">
                {isFrench ? "Merci, à très bientôt !" : "Thank you, see you soon!"}
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className={`flex overflow-hidden rounded-full border ${isDark ? "border-slate-700 bg-slate-900" : "border-black/10 bg-white"}`}
              >
                <input
                  type="email"
                  required
                  placeholder={isFrench ? "Votre e-mail" : "Your email"}
                  className={`w-0 min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none ${isDark ? "text-white placeholder:text-slate-500" : "placeholder:text-ink/40"}`}
                />
                <button
                  type="submit"
                  className="bg-forest-deep px-4 text-xs font-semibold text-white transition-colors hover:bg-sun"
                >
                  {copy.sections.newsletterButton}
                </button>
              </form>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col gap-3 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between ${isDark ? "border-slate-800 text-slate-500" : "border-black/5 text-ink/50"}`}
        >
          <p>
            © 2026 GabonMICE — AGATOUR.{" "}
            {isFrench ? "Tous droits réservés." : "All rights reserved."}{" "}
            {isFrench
              ? "Conçu, développé et maintenu par"
              : "Designed, developed and maintained by"}{" "}
            PHILAINCORPORATION.
          </p>
          <div className="flex gap-6">
            <a href="/confidentialite" className="hover:text-sun-deep">
              {copy.sections.footerPrivacy}
            </a>
            <a href="/mentions-legales" className="hover:text-sun-deep">
              {copy.sections.footerLegal}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
