import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroLibreville from "@/assets/hero-libreville.jpg";
import loangoElephant from "@/assets/loango-elephant.jpg";
import gabonMask from "@/assets/gabon-mask.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

const heroSlidesFr = [
  {
    image: "/baiedesRois2.webp",
    eyebrow: "Libreville · Capitale MICE",
    title: "L'Afrique Émergente",
    subtitle:
      "Là où les infrastructures d'affaires de classe mondiale rencontrent une nature équatoriale préservée.",
  },
  {
    image: loangoElephant,
    eyebrow: "Parc National de Loango",
    title: "Le Dernier Éden",
    subtitle:
      "Éléphants de forêt, gorilles, baleines à bosse — l'Afrique dans sa forme la plus pure.",
  },
  {
    image: "/lemeridien.jpg",
    eyebrow: "Parc National de Loango",
    title: "Le Dernier Éden",
    subtitle:
      "Éléphants de forêt, gorilles, baleines à bosse — l'Afrique dans sa forme la plus pure.",
  },
  {
    image: "/pointDenis.jpg",
    eyebrow: "Pointe Denis · Incentive",
    title: "Le Luxe Côtier",
    subtitle:
      "Retraites exécutives et séminaires d'exception face à l'Atlantique.",
  },
];

const heroSlidesEn = [
  {
    image: "/baiedesRois2.webp",
    eyebrow: "Libreville · MICE Capital",
    title: "The Emerging Africa",
    subtitle:
      "Where world-class business infrastructure meets preserved equatorial nature.",
  },
  {
    image: loangoElephant,
    eyebrow: "Loango National Park",
    title: "The Last Eden",
    subtitle:
      "Forest elephants, gorillas, humpback whales — Africa in its purest form.",
  },
  {
    image: "/lemeridien.jpg",
    eyebrow: "Loango National Park",
    title: "The Last Eden",
    subtitle:
      "Forest elephants, gorillas, humpback whales — Africa in its purest form.",
  },
  {
    image: "/pointDenis.jpg",
    eyebrow: "Pointe Denis · Incentive",
    title: "Coastal Luxury",
    subtitle:
      "Executive retreats and exceptional seminars facing the Atlantic Ocean.",
  },
];

const venuesFr = [
  {
    image: "/Palaiscongrès2.webp",
    location: "Libreville",
    title: "Libreville, Capitale des Grandes Rencontres",
    desc: "Le Palais des Congrès Omar BONGO ONDIMBA est une infrastructure de référence dédiée à l’organisation de rencontres de haut niveau, favorisant le dialogue, la coopération et les échanges. Conçu pour accueillir des événements d’envergure nationale et internationale, il contribue au rayonnement du Gabon et soutient son développement économique, institutionnel et diplomatique.",
  },
  {
    image: "/riverLoge.jpg",
    location: "Pointe Denis",
    title: "Retraite riveraine executive",
    desc: "Hébergement côtier intimiste avec salles de réunion face à la lagune et service sur mesure.",
  },
  {
    image: "/sogara.webp",
    location: "Port-Gentil",
    title: "Plaine industrielle Sogara",
    desc: "Centre stratégique pour l'industrie pétrolière, la logistique et les échanges d'affaires.",
  },
];

const venuesEn = [
  {
    image: "/AFAIRES.webp",
    location: "Libreville",
    title: "Angondjé Business Hub",
    desc: "Premium conference platforms and MICE services at the heart of the capital.",
  },
  {
    image: "/riverLoge.jpg",
    location: "Pointe Denis",
    title: "River Lodge Executive Retreat",
    desc: "Intimate coastal lodging with lagoon-front meeting spaces and bespoke service.",
  },
  {
    image: "/sogara.webp",
    location: "Port-Gentil",
    title: "Sogara Industrial Platform",
    desc: "Strategic center for oil, logistics and business exchange in the port zone.",
  },
];

function SocialIcon({ platform }: { platform: "linkedin" | "twitter" | "instagram" | "youtube" }) {
  const common = "h-5 w-5";

  switch (platform) {
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M6.94 8.5A1.56 1.56 0 1 0 6.94 5.38a1.56 1.56 0 0 0 0 3.12ZM5.5 9.75h2.88V18H5.5zM10.27 9.75h2.76v1.12h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.91 3.45 4.4V18h-2.88v-7.4c0-1.76-.03-4.03-2.46-4.03-2.46 0-2.84 1.92-2.84 3.9V18H10.27z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M18.9 5H21l-6.2 7.1L22 19h-5.6l-4.3-5.6L7.3 19H5.2l6.7-7.6L2 5h5.7l3.9 5.2L18.9 5Zm-1 12.4h1.1L7.2 6.5H6.1l11.8 10.9Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={common} aria-hidden="true">
          <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.8 12 4.8 12 4.8s-5.8 0-7.6.4a2.8 2.8 0 0 0-2 2A29.4 29.4 0 0 0 2 12a29.4 29.4 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.4 7.6.4 7.6.4s5.8 0 7.6-.4a2.8 2.8 0 0 0 2-2A29.4 29.4 0 0 0 22 12a29.4 29.4 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

function Home() {
  const [slide, setSlide] = useState(0);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const heroSlides = isFrench ? heroSlidesFr : heroSlidesEn;
  const venues = isFrench ? venuesFr : venuesEn;

  const copy = isFrench
    ? {
        nav: {
          cta: "Organiser un évènement",
          languageToggle: "EN",
        },
        hero: {
          planner: "Que planifiez-vous ?",
          attendees: "Nombre de participants",
          placeholderEvent: "Conférence internationale…",
          placeholderAttendees: "200 — 500 délégués",
          button: "Explorer",
        },
        sections: {
          venuesLabel: "Elite Venues",
          venuesTitle: "Destinations d'affaires premières",
          venuesLink: "Voir tous les lieux",
          experiencesEyebrow: "Beyond the Boardroom",
          experiencesTitle: "Au-delà des salles de conférence",
          experiencesText:
            "Le Gabon est le dernier Éden de la Terre. Vivez une biodiversité de renommée mondiale à travers nos programmes d'incentive : trek des gorilles, observation des baleines et safaris en forêt profonde.",
          experiencesButton: "Découvrir les expériences",
          destinationsLabel: "Destinations",
          destinationsTitle: "Explorer les écosystèmes du Gabon",
          destinationsText:
            "Des centres urbains cosmopolites aux sanctuaires marins protégés — une géographie d'exception à portée de vol.",
          destinationCard1Label: "Capitale",
          destinationCard1Title: "Vue sur l'entrée du musée national des arts et traditions du Gabon",
          destinationCard1Text: "Le Gabon authentique se découvre aussi à travers son patrimoine.",
          destinationCard2Label: "Business",
          destinationCard2Title: "Port-Gentil",
          destinationCard3Label: "Nature Sauvage",
          destinationCard3Title: "Parc de Loango",
          destinationCard4Label: "Côte Atlantique",
          destinationCard4Title: "Baie de Pongara",
          destinationCard4Text: "Tortues marines, mangroves préservées et retraites d'exception.",
          culturalLabel: "Patrimoine Culturel",
          culturalText: "L'art Punu, les danses Bwiti, l'artisanat Fang — un héritage vivant.",
          investLabel: "Pourquoi le Gabon",
          investTitle: "Un carrefour stratégique en Afrique Centrale",
          newsletterLabel: "Newsletter",
          newsletterTitle: "Restez informés des sommets, évènements et opportunités.",
          newsletterText:
            "Une lettre confidentielle, mensuelle, à destination des organisateurs et investisseurs.",
          newsletterButton: "S'abonner",
          scrollToTop: "Remonter en haut",
          footerExplore: "Explorer",
          footerInstitutional: "Institutionnel",
          footerLink1: "Lieux d'évènements",
          footerLink2: "Annuaire hôtelier",
          footerLink3: "Guides d'investissement",
          footerLink4: "E-Visa",
          footerLink5: "AGATOUR",
          footerLink6: "Portail Gouvernemental",
          footerLink7: "Espace Presse",
          footerLink8: "Contact",
          footerPrivacy: "Confidentialité",
          footerLegal: "Mentions Légales",
        },
      }
    : {
        nav: {
          cta: "Plan",
          languageToggle: "FR",
        },
        hero: {
          planner: "What are you planning?",
          attendees: "Number of attendees",
          placeholderEvent: "International conference…",
          placeholderAttendees: "200 — 500 delegates",
          button: "Explore",
        },
        sections: {
          venuesLabel: "Elite Venues",
          venuesTitle: "Leading business destinations",
          venuesLink: "View all venues",
          experiencesEyebrow: "Beyond the Boardroom",
          experiencesTitle: "Beyond the conference rooms",
          experiencesText:
            "Gabon is the last Eden on Earth. Experience globally renowned biodiversity through our incentive programs: gorilla trekking, whale watching, and deep-forest safaris.",
          experiencesButton: "Discover the experiences",
          destinationsLabel: "Destinations",
          destinationsTitle: "Explore Gabon's ecosystems",
          destinationsText:
            "From cosmopolitan urban hubs to protected marine sanctuaries — exceptional geography within reach of a flight.",
          destinationCard1Label: "Capital",
          destinationCard1Title: "Libreville",
          destinationCard1Text: "Economic hub, conference centers and refined nightlife.",
          destinationCard2Label: "Business",
          destinationCard2Title: "Port-Gentil",
          destinationCard3Label: "Wild Nature",
          destinationCard3Title: "Loango National Park",
          destinationCard4Label: "Atlantic Coast",
          destinationCard4Title: "Pongara Bay",
          destinationCard4Text: "Sea turtles, preserved mangroves and exceptional retreats.",
          culturalLabel: "Cultural Heritage",
          culturalText: "Punu art, Bwiti dances, Fang craftsmanship — a living heritage.",
          investLabel: "Why Gabon",
          investTitle: "A strategic crossroads in Central Africa",
          newsletterLabel: "Newsletter",
          newsletterTitle: "Stay informed about summits, events and opportunities.",
          newsletterText:
            "A confidential monthly letter for event organizers and investors.",
          newsletterButton: "Subscribe",
          scrollToTop: "Back to top",
          footerExplore: "Explore",
          footerInstitutional: "Institutional",
          footerLink1: "Event venues",
          footerLink2: "Hotel directory",
          footerLink3: "Investment guides",
          footerLink4: "E-Visa",
          footerLink5: "AGATOUR",
          footerLink6: "Government portal",
          footerLink7: "Press area",
          footerLink8: "Contact",
          footerPrivacy: "Privacy",
          footerLegal: "Legal Notice",
        },
      };

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("gabonmice-theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
    const storedLanguage = window.localStorage.getItem("gabonmice-language") as "fr" | "en" | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-language", language);
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 220;
      setShowScrollTop(window.scrollY > 260 || atBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = isFrench
    ? [
        { label: "Business", href: "/lieux" },
        { label: "Destinations", href: "/destinations" },
        { label: "Expériences", href: "/experiences" },
        { label: "Investir", href: "/investir" },
        { label: "Actualités", href: "/actualites" },
      ]
    : [
        { label: "Business", href: "/lieux" },
        { label: "Destinations", href: "/destinations" },
        { label: "Experiences", href: "/experiences" },
        { label: "Invest", href: "/investir" },
        { label: "News", href: "/actualites" },
      ];

  const investItems = isFrench
    ? [
        {
          n: "01",
          t: "Stabilité & Sécurité",
          d: "Un environnement politique stable, un cadre réglementaire clair pour les investisseurs et les organisateurs d'évènements internationaux.",
        },
        {
          n: "02",
          t: "Excellence Environnementale",
          d: "Premier pays carbone-négatif au monde. Vos évènements bénéficient d'une empreinte écologique unique.",
        },
        {
          n: "03",
          t: "Connectivité Internationale",
          d: "Aéroport international Léon-MBA, liaisons directes vers l'Europe et l'Afrique, réseaux fibre haute performance.",
        },
      ]
    : [
        {
          n: "01",
          t: "Stability & Security",
          d: "A stable political environment and a clear regulatory framework for investors and international event organizers.",
        },
        {
          n: "02",
          t: "Environmental Excellence",
          d: "The world's first carbon-negative country. Your events benefit from a uniquely low ecological footprint.",
        },
        {
          n: "03",
          t: "International Connectivity",
          d: "León-Mba International Airport, direct links to Europe and Africa, and high-performance fiber networks.",
        },
      ];

  const surfaceClass = isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900";
  const surfaceMutedClass = isDark ? "bg-slate-900/80 text-slate-200" : "bg-white text-slate-700";
  const borderClass = isDark ? "border-slate-800" : "border-slate-200";
  const headingClass = isDark ? "text-slate-100" : "text-slate-900";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const mutedTextClassStrong = isDark ? "text-slate-300" : "text-slate-600";
  const cardClass = isDark
    ? "bg-slate-900/90 border border-slate-800 shadow-soft"
    : "bg-white border border-slate-200 shadow-soft";

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${surfaceClass}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b px-4 sm:px-6 md:px-10 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3 transition-colors duration-500 ${
        isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/75 border-black/5"
      }`}>
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3" onClick={() => setMenuOpen(false)}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-forest/20 bg-white/90 p-1 shadow-sm shadow-forest/10 ring-1 ring-forest/10 sm:h-12 sm:w-12">
            <img
              src="/logo%20GabonMince.png"
              alt="GabonMince"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <span className="hidden font-display font-bold text-lg tracking-tight text-forest min-[430px]:inline sm:text-xl">
            GABON<span className="text-ocean">MICE</span>
          </span>
          <img src="/LogoAGATOUR.jpg" alt="AGATOUR" className="h-8 w-auto max-w-20 rounded bg-white p-0.5 object-contain sm:h-10 sm:max-w-none sm:p-1" />
        </Link>

        <div className={`hidden lg:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className="hover:text-forest transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-[10px] sm:text-xs font-semibold uppercase transition-all duration-300 ${
              isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-forest/30 text-forest hover:bg-forest hover:text-white"
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? "☀" : "☾"}
          </button>
            <button
              type="button"
              onClick={() => setLanguage(isFrench ? "en" : "fr")}
            className={`inline-flex px-3 sm:px-4 py-2.5 rounded-full border text-[10px] sm:text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
              isDark ? "border-slate-700 text-slate-200 hover:bg-slate-800" : "border-forest/30 text-forest hover:bg-forest hover:text-white"
            }`}
          >
            {isFrench ? "EN" : "FR"}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex items-center justify-center rounded-full border p-2.5 lg:hidden transition-colors duration-300 ${
              isDark ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-700"
            }`}
            aria-label="Toggle navigation menu"
          >
            <span className="text-lg leading-none">☰</span>
          </button>
          <Link
            to="/contact"
            className="hidden sm:inline-flex px-4 sm:px-6 md:px-8 py-2.5 rounded-full bg-forest text-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase shadow-lg shadow-forest/25 hover:bg-forest-deep transition-all"
          >
            {copy.nav.cta}
          </Link>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/50 px-4 pt-20 transition-all duration-300 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`mx-auto max-w-md rounded-[1.5rem] p-5 shadow-2xl transition-all duration-300 ${
            isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
          } ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-forest">
              {isFrench ? "Navigation" : "Navigation"}
            </span>
            <button type="button" onClick={() => setMenuOpen(false)} className={`text-xl ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              ×
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isDark
                    ? "border-slate-700 text-slate-300 hover:border-forest hover:text-forest"
                    : "border-slate-200 text-slate-700 hover:border-forest hover:text-forest"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setLanguage(isFrench ? "en" : "fr");
                setMenuOpen(false);
              }}
              className="rounded-2xl bg-forest px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-white"
            >
              {isFrench ? "Switch to English" : "Passer au Français"}
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[80vh] md:min-h-screen w-full overflow-hidden">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-out ${
              i === slide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className={`absolute inset-0 h-full w-full object-cover ${
                i === slide ? "animate-ken-burns" : ""
              }`}
              {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-24 pb-10">
          <span
            key={`eyebrow-${slide}`}
            className="animate-reveal text-gold font-semibold uppercase tracking-[0.35em] text-xs md:text-sm mb-6"
          >
            {heroSlides[slide].eyebrow}
          </span>
          <h1
            key={`title-${slide}`}
            className="animate-reveal font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] sm:leading-[1.02] max-w-5xl drop-shadow-2xl mb-6 px-2"
            style={{ animationDelay: "150ms" }}
          >
            {heroSlides[slide].title}
          </h1>
          <p
            key={`sub-${slide}`}
            className="animate-reveal text-white/90 text-sm sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-8 sm:mb-10 md:mb-12 px-2"
            style={{ animationDelay: "300ms" }}
          >
            {heroSlides[slide].subtitle}
          </p>

          {/* Smart search */}
          <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl p-2 sm:p-3 rounded-2xl border border-white/20 flex flex-col md:flex-row gap-2 shadow-2xl">
            <div className="flex-1 px-6 py-4 flex flex-col items-start text-left">
              <span className="text-[10px] uppercase font-bold text-gold tracking-widest mb-1">
                {copy.hero.planner}
              </span>
              <input
                type="text"
                placeholder={copy.hero.placeholderEvent}
                className="bg-transparent text-white placeholder:text-white/60 focus:outline-none w-full text-sm"
              />
            </div>
            <div className="w-px bg-white/20 my-4 hidden md:block" />
            <div className="flex-1 px-6 py-4 flex flex-col items-start text-left">
              <span className="text-[10px] uppercase font-bold text-gold tracking-widest mb-1">
                {copy.hero.attendees}
              </span>
              <input
                type="text"
                placeholder={copy.hero.placeholderAttendees}
                className="bg-transparent text-white placeholder:text-white/60 focus:outline-none w-full text-sm"
              />
            </div>
            <button className="bg-gold text-forest font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-sm uppercase tracking-widest hover:scale-[1.02] hover:bg-gold-soft transition-all w-full md:w-auto">
              {copy.hero.button}
            </button>
          </div>
        </div>

        {/* Slide indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === slide ? "w-12 bg-white" : "w-6 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* MICE Highlights */}
      <section id="mice" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
              {copy.sections.venuesLabel}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 text-slate-900 leading-[1.05]">
              {copy.sections.venuesTitle}
            </h2>
          </div>
          <a
            href="#"
            className="text-ocean font-semibold flex items-center gap-2 group text-sm uppercase tracking-widest"
          >
            {copy.sections.venuesLink}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {venues.map((v) => (
            <article key={v.title} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-[1.5rem] mb-6 shadow-soft bg-slate-100 max-h-[24rem] md:max-h-none">
                <img
                  src={v.image}
                  alt={v.title}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="aspect-[4/5] w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute top-5 left-5">
                  <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-forest">
                    {v.location}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-forest transition-colors">
                {v.title}
              </h3>
              <p className={`font-light leading-relaxed ${mutedTextClass}`}>{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Biodiversity Banner */}
      <section id="experiences" className="bg-forest py-16 sm:py-20 md:py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-25 mix-blend-overlay">
          <img
            src={loangoElephant}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <span className="text-gold font-bold tracking-[0.25em] text-xs uppercase">
              {copy.sections.experiencesEyebrow}
            </span>
            <h2 className="font-display text-[2.25rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-5 mb-8 leading-[1.05]">
              {copy.sections.experiencesTitle}
            </h2>
            <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed mb-8 sm:mb-10 max-w-lg">
              {copy.sections.experiencesText}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4">
              {[
                { n: "13", l: "Parcs Nationaux" },
                { n: "88%", l: "Couverture Forestière" },
                { n: "800km", l: "Littoral Sauvage" },
                { n: "25k+", l: "Éléphants de Forêt" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="bg-white/10 backdrop-blur-md px-4 sm:px-6 py-4 rounded-2xl border border-white/15 hover:bg-white/15 transition-colors"
                >
                  <div className="text-gold font-bold text-3xl mb-1 font-display">{s.n}</div>
                  <div className="text-white/70 text-[10px] uppercase tracking-widest">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 sm:mt-10 md:mt-12 w-full sm:w-auto px-8 py-4 rounded-full bg-gold text-forest-deep text-xs font-bold uppercase tracking-widest hover:bg-gold-soft transition-all shadow-xl shadow-black/20">
              {copy.sections.experiencesButton}
            </button>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl rotate-0 lg:rotate-2 hover:rotate-0 transition-transform duration-700 max-w-md mx-auto lg:ml-auto max-h-[28rem] md:max-h-none">
              <img
                src={gabonMask}
                alt="Masque traditionnel gabonais"
                width={600}
                height={800}
                loading="lazy"
                className="aspect-[3/4] w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl max-w-xs hidden md:block">
              <div className="text-[10px] uppercase tracking-widest text-forest font-bold mb-2">
                {copy.sections.culturalLabel}
              </div>
              <p className="text-sm text-slate-600 font-light leading-relaxed">
                {copy.sections.culturalText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*Destinations grids après le maques */}
      <section id="destinations" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
            {copy.sections.destinationsLabel}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 text-slate-900 leading-[1.05]">
            {copy.sections.destinationsTitle}
          </h2>
          <p className={`text-base sm:text-lg font-light leading-relaxed mt-6 ${mutedTextClass}`}>
            {copy.sections.destinationsText}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <a
            href="#"
            className="group md:col-span-4 relative overflow-hidden rounded-3xl aspect-[16/10] shadow-soft max-h-[26rem] sm:max-h-none"
          >
            <img
              src="/muséé12.webp"
              alt="Libreville"
              width={1200}
              height={750}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                {copy.sections.destinationCard1Label}
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold mt-2">{copy.sections.destinationCard1Title}</h3>
              <p className="text-white/80 font-light mt-2 max-w-sm">
                {copy.sections.destinationCard1Text}
              </p>
            </div>
          </a>
          <a
            href="#"
            className="group md:col-span-2 relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-[16/10] md:aspect-auto shadow-soft max-h-[20rem] sm:max-h-none"
          >
            <img
              src="/port-gentil11.webp"
              alt="Port-Gentil"
              width={1024}
              height={768}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                {copy.sections.destinationCard2Label}
              </span>
              <h3 className="font-display text-2xl font-bold mt-2">{copy.sections.destinationCard2Title}</h3>
            </div>
          </a>
          <a
            href="#"
            className="group md:col-span-2 relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-[16/10] shadow-soft max-h-[20rem] sm:max-h-none"
          >
            <img
              src="/PLAteau.jpg"
              alt="Loango"
              width={1024}
              height={768}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                {copy.sections.destinationCard3Label}
              </span>
              <h3 className="font-display text-2xl font-bold mt-2">{copy.sections.destinationCard3Title}</h3>
            </div>
          </a>
          <a
            href="#"
            className="group md:col-span-4 relative overflow-hidden rounded-3xl aspect-[16/10] shadow-soft max-h-[26rem] sm:max-h-none"
          >
            <img
              src="/tortue.jpg"
              alt="Pointe Denis"
              width={1200}
              height={750}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
                {copy.sections.destinationCard4Label}
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-bold mt-2">
                {copy.sections.destinationCard4Title}
              </h3>
              <p className="text-white/80 font-light mt-2 max-w-sm">
                {copy.sections.destinationCard4Text}
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Pour */}
      <section id="invest" className={`py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 transition-colors duration-500 ${isDark ? "bg-slate-900/70" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-ocean font-bold tracking-[0.25em] text-xs uppercase">
              {copy.sections.investLabel}
            </span>
            <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 leading-[1.05] ${headingClass}`}>
              {copy.sections.investTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {investItems.map((f) => (
              <div
                key={f.n}
                className={`p-6 sm:p-8 lg:p-10 rounded-3xl shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 ${cardClass}`}
              >
                <div className="text-gold font-display font-bold text-4xl mb-6">{f.n}</div>
                <h3 className={`font-display text-2xl font-bold mb-3 ${headingClass}`}>{f.t}</h3>
                <p className={`font-light leading-relaxed ${mutedTextClass}`}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10">
        <div className={`max-w-4xl mx-auto text-center rounded-[2rem] border p-8 sm:p-12 transition-colors duration-500 ${cardClass}`}>
          <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
            {copy.sections.newsletterLabel}
          </span>
          <h2 className={`font-display text-2.5xl sm:text-4xl md:text-5xl font-bold mt-5 leading-[1.05] ${headingClass}`}>
            {copy.sections.newsletterTitle}
          </h2>
          <p className={`text-base sm:text-lg font-light mt-6 max-w-xl mx-auto ${mutedTextClass}`}>
            {copy.sections.newsletterText}
          </p>
          <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="votre@email.com"
              className={`flex-1 px-6 py-4 rounded-full border focus:border-forest focus:outline-none text-sm ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-forest text-white text-xs font-bold uppercase tracking-widest hover:bg-forest-deep transition-colors shadow-lg shadow-forest/20"
            >
              {copy.sections.newsletterButton}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer id="news" className={`pt-16 sm:pt-20 md:pt-24 pb-12 border-t transition-colors duration-500 ${isDark ? "bg-slate-900/70 border-slate-800" : "bg-slate-50 border-black/5"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16 sm:mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-forest/20 bg-white/90 p-1.5 shadow-lg shadow-forest/20 ring-1 ring-forest/10">
                <img
                  src="/logo%20GabonMince.png"
                  alt="GabonMince"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-forest">
                GABON<span className="text-ocean">MICE</span>
              </span>
              <img
                src="/LogoAGATOUR.jpg"
                alt="AGATOUR"
                className="h-12 w-auto rounded-lg bg-white p-1 object-contain"
              />
            </div>
            <p className={`max-w-md mb-8 font-light leading-relaxed ${mutedTextClass}`}>
              La plateforme officielle du tourisme d'affaires et de loisirs au Gabon. Promouvoir la
              croissance économique à travers des évènements de classe mondiale et une découverte
              guidée par la conservation.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { platform: "linkedin" as const, href: "#" },
                { platform: "twitter" as const, href: "#" },
                { platform: "instagram" as const, href: "#" },
                { platform: "youtube" as const, href: "#" },
              ].map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${
                    isDark
                      ? "border-slate-700 text-slate-300 hover:border-forest hover:bg-forest hover:text-white"
                      : "border-slate-200 text-slate-500 hover:bg-forest hover:text-white hover:border-forest"
                  }`}
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-bold mb-6 text-xs uppercase tracking-[0.2em] ${headingClass}`}>{copy.sections.footerExplore}</h4>
            <ul className={`space-y-4 font-light text-sm ${mutedTextClass}`}>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink1}</a></li>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink2}</a></li>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink3}</a></li>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink4}</a></li>
            </ul>
          </div>

          <div>
            <h4 className={`font-bold mb-6 text-xs uppercase tracking-[0.2em] ${headingClass}`}>{copy.sections.footerInstitutional}</h4>
            <ul className={`space-y-4 font-light text-sm ${mutedTextClass}`}>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink5}</a></li>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink6}</a></li>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink7}</a></li>
              <li><a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLink8}</a></li>
            </ul>
          </div>
        </div>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-8 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${isDark ? "border-slate-800" : "border-black/5"}`}>
          <p className={`text-xs ${mutedTextClassStrong}`}>
            © 2026 GabonMICE. Tous droits réservés. Conçu, développé et maintenu par PHILAINCORPORATION.
          </p>
          <div className={`flex flex-wrap gap-4 md:gap-8 text-xs ${mutedTextClassStrong}`}>
            <a href="#" className="transition-colors hover:text-forest">{copy.sections.footerPrivacy}</a>
            <a href="#" className="transition-colors hover:text-forest">{copy.sections.footerLegal}</a>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label={copy.sections.scrollToTop}
          className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white shadow-xl shadow-forest/30 transition-transform hover:scale-105"
        >
          ↑
        </button>
      )}
    </div>
  );
}
