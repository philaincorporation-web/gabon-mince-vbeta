import loangoElephant from "@/assets/loango-elephant.jpg";
import gabonMask from "@/assets/gabon-mask.jpg";

export const heroSlidesFr = [
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
    subtitle: "Retraites exécutives et séminaires d'exception face à l'Atlantique.",
  },
] as const;

export const heroSlidesEn = [
  {
    image: "/baiedesRois2.webp",
    eyebrow: "Libreville · MICE Capital",
    title: "The Emerging Africa",
    subtitle: "Where world-class business infrastructure meets preserved equatorial nature.",
  },
  {
    image: loangoElephant,
    eyebrow: "Loango National Park",
    title: "The Last Eden",
    subtitle: "Forest elephants, gorillas, humpback whales — Africa in its purest form.",
  },
  {
    image: "/lemeridien.jpg",
    eyebrow: "Loango National Park",
    title: "The Last Eden",
    subtitle: "Forest elephants, gorillas, humpback whales — Africa in its purest form.",
  },
  {
    image: "/pointDenis.jpg",
    eyebrow: "Pointe Denis · Incentive",
    title: "Coastal Luxury",
    subtitle: "Executive retreats and exceptional seminars facing the Atlantic Ocean.",
  },
] as const;

export const venuesFr = [
  {
    image: "/Palaiscongrès2.webp",
    location: "Libreville",
    title: "Libreville, Capitale des Grandes Rencontres",
    desc: "Le Palais des Congrès Omar BONGO ONDIMBA est une infrastructure de référence dédiée à l'organisation de rencontres de haut niveau, favorisant le dialogue, la coopération et les échanges. Conçu pour accueillir des événements d'envergure nationale et internationale, il contribue au rayonnement du Gabon et soutient son développement économique, institutionnel et diplomatique.",
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
] as const;

export const venuesEn = [
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
] as const;

export const investItemsFr = [
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
] as const;

export const investItemsEn = [
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
] as const;

export const stats = [
  { n: "13", l: "Parcs Nationaux" },
  { n: "88%", l: "Couverture Forestière" },
  { n: "800km", l: "Littoral Sauvage" },
  { n: "25k+", l: "Éléphants de Forêt" },
] as const;

export const socialPlatforms = ["linkedin", "twitter", "instagram", "youtube"] as const;

export type SocialPlatform = (typeof socialPlatforms)[number];

export const navLinksFr = [
  { label: "Business", href: "/lieux" },
  { label: "Destinations", href: "/destinations" },
  { label: "Expériences", href: "/experiences" },
  { label: "Investir", href: "/investir" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
] as const;

export const navLinksEn = [
  { label: "Business", href: "/lieux" },
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Invest", href: "/investir" },
  { label: "News", href: "/actualites" },
  { label: "Contact", href: "/contact" },
] as const;

export const homeCopyFr = {
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
} as const;

export const homeCopyEn = {
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
    newsletterText: "A confidential monthly letter for event organizers and investors.",
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
} as const;

export type HomeCopy = typeof homeCopyFr;
export type HomeSections = HomeCopy["sections"];
