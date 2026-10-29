import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  Compass,
  Handshake,
  Hotel,
  Map as MapIcon,
  MapPinned,
  Menu,
  Moon,
  Mountain,
  Search,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { homeCopyFr, homeCopyEn } from "@/lib/home-data";
import type { ListingCategory } from "@/lib/mice-data";

type NavItem = {
  to:
    | "/offres"
    | "/explorer"
    | "/lieux"
    | "/evenements"
    | "/destinations"
    | "/experiences"
    | "/carte"
    | "/organisateur"
    | "/prestataires"
    | "/investir";
  cat?: ListingCategory;
  icon: typeof Sparkles;
  fr: string;
  en: string;
  descFr: string;
  descEn: string;
};

type NavGroup = { id: string; fr: string; en: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    id: "mice",
    fr: "MICE",
    en: "MICE",
    items: [
      {
        to: "/offres",
        icon: Sparkles,
        fr: "Offres spéciales",
        en: "Special offers",
        descFr: "Packages courts à Libreville",
        descEn: "Short packages around Libreville",
      },
      {
        to: "/explorer",
        cat: "salle",
        icon: Building2,
        fr: "Salles de conférence",
        en: "Conference venues",
        descFr: "Lieux de réunion et congrès",
        descEn: "Meeting & congress venues",
      },
      {
        to: "/explorer",
        cat: "hebergement",
        icon: Hotel,
        fr: "Hébergements",
        en: "Accommodation",
        descFr: "Hôtels et lodges",
        descEn: "Hotels and lodges",
      },
      {
        to: "/lieux",
        icon: MapPinned,
        fr: "Lieux d'événements",
        en: "Event venues",
        descFr: "Sélection premium",
        descEn: "Premium selection",
      },
      {
        to: "/evenements",
        icon: CalendarDays,
        fr: "Agenda des événements",
        en: "Events calendar",
        descFr: "Existants et à venir",
        descEn: "Current and upcoming",
      },
    ],
  },
  {
    id: "discover",
    fr: "Découvrir",
    en: "Discover",
    items: [
      {
        to: "/destinations",
        icon: Mountain,
        fr: "Destinations",
        en: "Destinations",
        descFr: "Villes, parcs et littoral",
        descEn: "Cities, parks and coast",
      },
      {
        to: "/experiences",
        icon: Compass,
        fr: "Expériences",
        en: "Experiences",
        descFr: "Activités incentive",
        descEn: "Incentive activities",
      },
      {
        to: "/explorer",
        cat: "circuit",
        icon: MapIcon,
        fr: "Circuits touristiques",
        en: "Tours",
        descFr: "De 1 à 4 jours",
        descEn: "From 1 to 4 days",
      },
      {
        to: "/carte",
        icon: MapPinned,
        fr: "Carte interactive",
        en: "Interactive map",
        descFr: "Hôtels, salles, sites…",
        descEn: "Hotels, venues, sites…",
      },
    ],
  },
  {
    id: "spaces",
    fr: "Espaces",
    en: "Spaces",
    items: [
      {
        to: "/organisateur",
        icon: Users,
        fr: "Espace organisateur",
        en: "Organiser space",
        descFr: "Répertoriez votre événement",
        descEn: "List your event",
      },
      {
        to: "/prestataires",
        icon: Handshake,
        fr: "Espace prestataire",
        en: "Provider space",
        descFr: "Labellisation AGATOUR",
        descEn: "AGATOUR labelling",
      },
      {
        to: "/investir",
        icon: TrendingUp,
        fr: "Investir au Gabon",
        en: "Invest in Gabon",
        descFr: "Atouts et opportunités",
        descEn: "Strengths and opportunities",
      },
    ],
  },
];

const simpleLinks = [
  { to: "/actualites", fr: "Actualités", en: "News" },
  { to: "/about", fr: "À propos", en: "About" },
  { to: "/contact", fr: "Contact", en: "Contact" },
] as const;

interface SiteNavProps {
  language: "fr" | "en";
  theme: "light" | "dark";
  menuOpen?: boolean;
  onToggleMenu?: (open: boolean) => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

export function SiteNav({
  language,
  theme,
  menuOpen: controlledOpen,
  onToggleMenu,
  onToggleTheme,
  onToggleLanguage,
}: SiteNavProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  // Session côté navigateur (null si non connecté ou si l'auth n'est pas configurée).
  const { data: authSession } = authClient.useSession();
  const signedIn = Boolean(authSession?.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [internalOpen, setInternalOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = controlledOpen ?? internalOpen;
  const setMenuOpen = (open: boolean) => {
    setInternalOpen(open);
    onToggleMenu?.(open);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenGroup(null);
    setInternalOpen(false);
  }, [pathname]);

  // Menu mobile ouvert : page figée, fermeture avec Échap.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInternalOpen(false);
        onToggleMenu?.(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, onToggleMenu]);

  const groupActive = (group: NavGroup) => group.items.some((item) => item.to === pathname);
  const linkBase = isDark ? "text-slate-200 hover:text-sun" : "text-ink/80 hover:text-sun-deep";
  const iconButton = `inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
    isDark
      ? "border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
      : "border-black/5 bg-white text-ink shadow-sm hover:bg-sand"
  }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isDark
              ? "bg-slate-950/90 shadow-lg shadow-black/20 backdrop-blur-xl"
              : "bg-cream/90 shadow-soft backdrop-blur-xl"
            : isDark
              ? "bg-slate-950/70 backdrop-blur-md"
              : "bg-cream/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm ring-1 ring-forest/10 sm:h-11 sm:w-11">
              <img
                src="/logo%20GabonMince.png"
                alt="GabonMICE"
                className="h-full w-full rounded-full object-cover"
              />
            </span>
            <span className="hidden min-[400px]:flex flex-col leading-none">
              <span
                className={`font-display text-lg font-extrabold tracking-tight ${isDark ? "text-white" : "text-forest-deep"}`}
              >
                Gabon<span className="text-sun">MICE</span>
              </span>
              <span
                className={`mt-1 text-[10px] font-medium ${isDark ? "text-slate-400" : "text-ink/50"}`}
              >
                {isFrench ? "Se réunir. Explorer. Découvrir." : "Meet. Explore. Discover."}
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            <NavTextLink to="/" active={pathname === "/"} className={linkBase}>
              {isFrench ? "Accueil" : "Home"}
            </NavTextLink>
            {navGroups.map((group) => (
              <div
                key={group.id}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.id)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                  aria-expanded={openGroup === group.id}
                  className={`relative flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-colors ${linkBase} ${groupActive(group) ? "!text-sun-deep" : ""}`}
                >
                  {isFrench ? group.fr : group.en}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openGroup === group.id ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition-all duration-200 ${
                    openGroup === group.id
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div
                    className={`rounded-3xl border p-2 shadow-float ${isDark ? "border-slate-800 bg-slate-900" : "border-black/5 bg-white"}`}
                  >
                    {group.items.map((item) => (
                      <NavMenuLink key={item.fr} item={item} isFrench={isFrench} isDark={isDark} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {simpleLinks.map((link) => (
              <NavTextLink
                key={link.to}
                to={link.to}
                active={pathname === link.to}
                className={linkBase}
              >
                {isFrench ? link.fr : link.en}
              </NavTextLink>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/explorer"
              className={`${iconButton} hidden sm:inline-flex xl:hidden 2xl:inline-flex`}
              aria-label={isFrench ? "Rechercher" : "Search"}
            >
              <Search className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onToggleTheme}
              className={iconButton}
              aria-label={isFrench ? "Changer de thème" : "Toggle theme"}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`${iconButton} w-auto px-3 text-xs font-bold tracking-wider`}
              aria-label={isFrench ? "Switch to English" : "Passer en français"}
            >
              {isFrench ? "EN" : "FR"}
            </button>
            <a
              href={signedIn ? "/espace" : "/connexion"}
              className={`${iconButton} w-auto gap-1.5 px-3 text-xs font-bold`}
              aria-label={
                signedIn
                  ? isFrench
                    ? "Mon espace"
                    : "My space"
                  : isFrench
                    ? "Connexion"
                    : "Sign in"
              }
            >
              <UserRound className="h-4 w-4" />
              <span className="hidden sm:inline">
                {signedIn
                  ? isFrench
                    ? "Mon espace"
                    : "My space"
                  : isFrench
                    ? "Connexion"
                    : "Sign in"}
              </span>
            </a>
            <Link
              to="/organisateur"
              className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 transition-all hover:bg-sun-deep md:inline-flex"
            >
              {isFrench ? "Organiser" : "Plan an event"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`${iconButton} xl:hidden`}
              aria-label={isFrench ? "Ouvrir le menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile : hors de <nav>, car le backdrop-filter de la barre
          ferait de celle-ci le conteneur des éléments `fixed` et couperait le panneau. */}
      <div
        className={`fixed inset-0 z-[110] bg-black/40 transition-opacity duration-300 xl:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto p-5 shadow-2xl transition-transform duration-300 ${
            isDark ? "bg-slate-950 text-slate-100" : "bg-cream text-ink"
          } ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-lg font-extrabold">
              Gabon<span className="text-sun">MICE</span>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className={iconButton}
              aria-label={isFrench ? "Fermer" : "Close"}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`mb-4 rounded-2xl px-4 py-3 font-semibold ${isDark ? "bg-slate-900" : "bg-white"}`}
          >
            {isFrench ? "Accueil" : "Home"}
          </Link>
          {navGroups.map((group) => (
            <div key={group.id} className="mb-4">
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-sun-deep">
                {isFrench ? group.fr : group.en}
              </p>
              <div className={`rounded-2xl p-1.5 ${isDark ? "bg-slate-900" : "bg-white"}`}>
                {group.items.map((item) => (
                  <NavMenuLink
                    key={item.fr}
                    item={item}
                    isFrench={isFrench}
                    isDark={isDark}
                    onNavigate={() => setMenuOpen(false)}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className={`mb-5 grid grid-cols-3 gap-2`}>
            {simpleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`rounded-2xl px-2 py-3 text-center text-sm font-semibold ${isDark ? "bg-slate-900" : "bg-white"}`}
              >
                {isFrench ? link.fr : link.en}
              </Link>
            ))}
          </div>
          <a
            href={signedIn ? "/espace" : "/connexion"}
            className={`mb-3 mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 font-semibold ${isDark ? "bg-slate-900" : "bg-white"}`}
          >
            <UserRound className="h-4 w-4" />
            {signedIn
              ? isFrench
                ? "Mon espace"
                : "My space"
              : isFrench
                ? "Connexion / Inscription"
                : "Sign in / Sign up"}
          </a>
          <Link
            to="/organisateur"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sun px-5 py-3.5 font-semibold text-white"
          >
            {copy.nav.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

function NavTextLink({
  to,
  active,
  className,
  children,
}: {
  to: "/" | "/actualites" | "/about" | "/contact";
  active: boolean;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-colors ${className} ${active ? "!text-sun-deep" : ""}`}
    >
      {children}
      {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-sun" />}
    </Link>
  );
}

function NavMenuLink({
  item,
  isFrench,
  isDark,
  onNavigate,
}: {
  item: NavItem;
  isFrench: boolean;
  isDark: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const className = `flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-cream"}`;
  const content = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? "bg-slate-800 text-sun" : "bg-forest/10 text-forest"}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{isFrench ? item.fr : item.en}</span>
        <span className={`block truncate text-xs ${isDark ? "text-slate-400" : "text-ink/55"}`}>
          {isFrench ? item.descFr : item.descEn}
        </span>
      </span>
    </>
  );
  if (item.to === "/explorer") {
    return (
      <Link to="/explorer" search={{ cat: item.cat }} className={className} onClick={onNavigate}>
        {content}
      </Link>
    );
  }
  return (
    <Link to={item.to} className={className} onClick={onNavigate}>
      {content}
    </Link>
  );
}
