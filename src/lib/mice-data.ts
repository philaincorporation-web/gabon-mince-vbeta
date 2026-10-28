import {
  Building2,
  Compass,
  Hotel,
  Route,
  Trees,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/**
 * Catalogue GabonMICE : offres spéciales, hébergements, salles, restaurants,
 * agences, sites touristiques, circuits et événements.
 *
 * Ce fichier sert de source de données unique pour /offres, /explorer, /carte,
 * /evenements et /prestataires. L'AGATOUR peut le compléter au fil des
 * labellisations.
 *
 * Les coordonnées GPS sont approximatives et doivent être validées avant
 * mise en production.
 */

export type Bi = { fr: string; en: string };

export type ListingCategory =
  "hebergement" | "salle" | "restaurant" | "agence" | "site" | "circuit";

export interface Listing {
  id: string;
  category: ListingCategory;
  name: string;
  city: string;
  image: string;
  /** [latitude, longitude] */
  coords: [number, number];
  summary: Bi;
  details: Bi;
  highlights: Bi[];
  /** Capacité d'accueil indicative (personnes), si connue. */
  capacity?: number;
  /** Tarif indicatif, si connu. Sinon « sur devis ». */
  price?: Bi;
  /** Prestataire labellisé par l'AGATOUR. */
  labelled: boolean;
  /** Mode de contact : réservation directe ou devis relayé par l'AGATOUR. */
  booking: "reservation" | "devis";
}

export const categoryMeta: Record<
  ListingCategory,
  { label: Bi; plural: Bi; color: string; icon: LucideIcon }
> = {
  hebergement: {
    label: { fr: "Hébergement", en: "Accommodation" },
    plural: { fr: "Hébergements", en: "Accommodation" },
    color: "#1E5A3C",
    icon: Hotel,
  },
  salle: {
    label: { fr: "Salle de conférence", en: "Conference venue" },
    plural: { fr: "Salles & lieux de réunion", en: "Meeting venues" },
    color: "#0B6E99",
    icon: Building2,
  },
  restaurant: {
    label: { fr: "Restaurant", en: "Restaurant" },
    plural: { fr: "Restaurants", en: "Restaurants" },
    color: "#DB7414",
    icon: UtensilsCrossed,
  },
  agence: {
    label: { fr: "Agence de tourisme", en: "Travel agency" },
    plural: { fr: "Agences de tourisme", en: "Travel agencies" },
    color: "#7C3AED",
    icon: Compass,
  },
  site: {
    label: { fr: "Site touristique", en: "Tourist site" },
    plural: { fr: "Sites touristiques", en: "Tourist sites" },
    color: "#B45309",
    icon: Trees,
  },
  circuit: {
    label: { fr: "Circuit", en: "Tour" },
    plural: { fr: "Circuits touristiques", en: "Tours" },
    color: "#BE185D",
    icon: Route,
  },
};

export const categoryOrder: ListingCategory[] = [
  "salle",
  "hebergement",
  "restaurant",
  "circuit",
  "site",
  "agence",
];

/* ------------------------------------------------------------------ */
/* Offres spéciales MICE — Libreville et environs                      */
/* (source : document « Offres spéciales MICE Libreville »)            */
/* ------------------------------------------------------------------ */

export interface SpecialOffer {
  id: string;
  number: number;
  title: Bi;
  venue: string;
  city: string;
  image: string;
  coords: [number, number];
  duration: Bi;
  /** Durée courte pour les badges. */
  durationShort: Bi;
  minGroup: number;
  priceFcfa: number;
  priceNote: Bi;
  steps: Bi[];
  included: Bi[];
  pitch: Bi;
  tags: Bi[];
}

export const specialOffers: SpecialOffer[] = [
  {
    id: "echappee-canopee",
    number: 1,
    title: { fr: "Échappée Canopée", en: "Canopy Escape" },
    venue: "Arboretum Raponda-Walker",
    city: "Libreville",
    image: "/beau.jpg",
    coords: [0.548, 9.372],
    duration: { fr: "Demi-journée (≈ 3h)", en: "Half day (≈ 3h)" },
    durationShort: { fr: "≈ 3h", en: "≈ 3h" },
    minGroup: 8,
    priceFcfa: 10000,
    priceNote: { fr: "par personne", en: "per person" },
    steps: [
      {
        fr: "Accueil : transfert depuis l'hôtel ou le lieu de conférence, briefing sécurité avec le guide naturaliste",
        en: "Welcome: transfer from the hotel or conference venue, safety briefing with the naturalist guide",
      },
      {
        fr: "Randonnée guidée sous canopée préservée, sur sentiers ombragés aménagés",
        en: "Guided hike under preserved canopy, on shaded marked trails",
      },
      {
        fr: "Découverte commentée de la flore médicinale et de la faune locale (oiseaux, papillons, petits mammifères)",
        en: "Guided discovery of medicinal plants and local wildlife (birds, butterflies, small mammals)",
      },
      {
        fr: "Pause détente en pleine nature, idéale pour décompresser entre deux sessions de travail",
        en: "Relaxing break in nature, ideal to unwind between two work sessions",
      },
      {
        fr: "Retour : transfert vers l'hôtel ou le lieu de conférence",
        en: "Return: transfer to the hotel or conference venue",
      },
    ],
    included: [
      { fr: "Transport aller-retour", en: "Return transport" },
      { fr: "Guide naturaliste", en: "Naturalist guide" },
      { fr: "Eau et collation", en: "Water and snack" },
    ],
    pitch: {
      fr: "Une coupure ressourçante à moins de 20 minutes du centre-ville, sans sortir de l'agenda d'un séminaire.",
      en: "A refreshing break less than 20 minutes from downtown, without leaving the seminar schedule.",
    },
    tags: [
      { fr: "Nature", en: "Nature" },
      { fr: "Entre deux sessions", en: "Between sessions" },
    ],
  },
  {
    id: "rendez-vous-flottant",
    number: 2,
    title: { fr: "Rendez-vous Flottant", en: "Floating Rendezvous" },
    venue: "Cap Caravane",
    city: "Libreville",
    image: "/DETTENTE.jpg",
    coords: [0.43, 9.55],
    duration: { fr: "Demi-journée / soirée (≈ 3-4h)", en: "Half day / evening (≈ 3-4h)" },
    durationShort: { fr: "≈ 3-4h", en: "≈ 3-4h" },
    minGroup: 10,
    priceFcfa: 25000,
    priceNote: { fr: "par personne, buffet inclus", en: "per person, buffet included" },
    steps: [
      {
        fr: "Accueil et transfert depuis l'hôtel jusqu'à l'embarcadère",
        en: "Welcome and transfer from the hotel to the pier",
      },
      {
        fr: "Installation à bord de la Caravane, plate-forme flottante sur la rivière Tsini",
        en: "Boarding the Caravane, a floating platform on the Tsini river",
      },
      {
        fr: "Détente au bord de la piscine avant l'embarquement, pour les groupes en avance sur le programme",
        en: "Poolside relaxation before boarding, for groups ahead of schedule",
      },
      {
        fr: "Déjeuner ou dîner gastronomique servi à bord, au fil de l'eau",
        en: "Gourmet lunch or dinner served on board, along the water",
      },
      {
        fr: "Promenade relaxante sur la rivière, cadre moderne et verdoyant, propice aux échanges informels",
        en: "Relaxing river cruise in a modern, green setting, ideal for informal networking",
      },
    ],
    included: [
      { fr: "Transport", en: "Transport" },
      { fr: "Accès piscine", en: "Pool access" },
      {
        fr: "Buffet gastronomique sur la Caravane flottante",
        en: "Gourmet buffet on the floating Caravane",
      },
    ],
    pitch: {
      fr: "Un cadre atypique et photogénique pour clôturer un séminaire ou recevoir des partenaires, hors des salles de conférence classiques.",
      en: "An unusual, photogenic setting to close a seminar or host partners, away from conventional meeting rooms.",
    },
    tags: [
      { fr: "Gastronomie", en: "Gastronomy" },
      { fr: "Soirée", en: "Evening" },
    ],
  },
  {
    id: "parenthese-nature",
    number: 3,
    title: { fr: "Parenthèse Nature", en: "Nature Interlude" },
    venue: "River Lodge",
    city: "Pointe-Denis",
    image: "/riverLoge.jpg",
    coords: [0.296, 9.33],
    duration: {
      fr: "Journée complète (extensible en résidentiel)",
      en: "Full day (extendable to residential)",
    },
    durationShort: { fr: "1 journée", en: "1 day" },
    minGroup: 10,
    priceFcfa: 35000,
    priceNote: { fr: "par personne, forfait journalier", en: "per person, day package" },
    steps: [
      {
        fr: "Transfert depuis Libreville vers le River Lodge, entre rivière et plages de Pointe-Denis",
        en: "Transfer from Libreville to River Lodge, between river and the beaches of Pointe-Denis",
      },
      {
        fr: "Accès libre à la piscine et aux espaces de détente en bord d'eau",
        en: "Free access to the pool and waterside lounge areas",
      },
      {
        fr: "Activités nautiques encadrées, adaptées à un format team building",
        en: "Supervised water activities, suited to team building",
      },
      {
        fr: "Restauration sur place, dans un cadre tropical propice aux échanges informels",
        en: "On-site dining in a tropical setting, ideal for informal exchanges",
      },
      {
        fr: "Aires de jeux et espaces annexes disponibles pour les délégations accompagnées de familles",
        en: "Play areas and extra spaces for delegations travelling with families",
      },
      {
        fr: "Retour vers Libreville en fin de journée",
        en: "Return to Libreville at the end of the day",
      },
    ],
    included: [
      { fr: "Transport", en: "Transport" },
      { fr: "Restauration", en: "Meals" },
      { fr: "Accès à la piscine", en: "Pool access" },
      { fr: "Activités nautiques", en: "Water activities" },
      { fr: "Aires de jeux", en: "Play areas" },
    ],
    pitch: {
      fr: "Un écrin de sérénité à quelques minutes de Libreville, pour un séminaire qui sort des salles de conférence sans sacrifier le confort.",
      en: "A haven of serenity minutes from Libreville, for a seminar outside the meeting room without sacrificing comfort.",
    },
    tags: [
      { fr: "Team building", en: "Team building" },
      { fr: "Famille", en: "Family" },
    ],
  },
  {
    id: "journee-prestige-oceane",
    number: 4,
    title: { fr: "Journée Prestige Océane", en: "Ocean Prestige Day" },
    venue: "Baie des Tortues",
    city: "Pointe-Denis",
    image: "/tortue2.jpg",
    coords: [0.286, 9.305],
    duration: { fr: "Journée complète", en: "Full day" },
    durationShort: { fr: "1 journée", en: "1 day" },
    minGroup: 15,
    priceFcfa: 50000,
    priceNote: { fr: "par personne, forfait journalier", en: "per person, day package" },
    steps: [
      { fr: "Navette aller-retour depuis Libreville", en: "Return shuttle from Libreville" },
      {
        fr: "Cocktail de bienvenue à l'arrivée, accueil privilégié de la délégation",
        en: "Welcome cocktail on arrival, VIP reception of the delegation",
      },
      {
        fr: "Accès libre à l'espace aquatique (piscine) et à la plage",
        en: "Free access to the pool area and the beach",
      },
      { fr: "Buffet gastronomique le midi", en: "Gourmet lunch buffet" },
      {
        fr: "Activités de loisirs et animations en fin de journée",
        en: "Leisure activities and entertainment in the late afternoon",
      },
    ],
    included: [
      { fr: "Cocktail de bienvenue", en: "Welcome cocktail" },
      { fr: "Buffet gastronomique", en: "Gourmet buffet" },
      { fr: "Navette", en: "Shuttle" },
      { fr: "Accès piscine", en: "Pool access" },
      { fr: "Activités de loisirs", en: "Leisure activities" },
    ],
    pitch: {
      fr: "Le format le plus complet pour un incentive d'une journée : mer, détente et gastronomie réunis dans un seul package clé en main.",
      en: "The most complete one-day incentive: sea, relaxation and gastronomy in a single turnkey package.",
    },
    tags: [
      { fr: "Incentive", en: "Incentive" },
      { fr: "Premium", en: "Premium" },
    ],
  },
  {
    id: "escapade-maringa",
    number: 5,
    title: { fr: "Escapade Maringa", en: "Maringa Getaway" },
    venue: "La Maringa el Magnifico",
    city: "Pongara",
    image: "/pog.jpg",
    coords: [0.27, 9.315],
    duration: { fr: "Journée complète", en: "Full day" },
    durationShort: { fr: "1 journée", en: "1 day" },
    minGroup: 10,
    priceFcfa: 35000,
    priceNote: { fr: "par personne, forfait journalier", en: "per person, day package" },
    steps: [
      {
        fr: "Transfert depuis Libreville vers l'établissement, situé entre plage privée de sable blanc et Parc National de Pongara",
        en: "Transfer from Libreville to the venue, between a private white-sand beach and Pongara National Park",
      },
      {
        fr: "Accueil de la délégation et installation pour la journée",
        en: "Welcome of the delegation and set-up for the day",
      },
      {
        fr: "Excursion encadrée aux abords du Parc National de Pongara",
        en: "Guided excursion around Pongara National Park",
      },
      {
        fr: "Restauration sur place, dans un cadre authentique et convivial",
        en: "On-site dining in an authentic, friendly setting",
      },
      {
        fr: "Temps libre en bord de plage pour la détente entre les sessions de travail",
        en: "Free time on the beach to relax between work sessions",
      },
      {
        fr: "Retour vers Libreville en fin de journée",
        en: "Return to Libreville at the end of the day",
      },
    ],
    included: [
      { fr: "Excursion", en: "Excursion" },
      { fr: "Restauration", en: "Meals" },
    ],
    pitch: {
      fr: "Idéale pour un comité de direction ou une retraite stratégique loin de l'agitation de la capitale, sans renoncer à la proximité de Libreville.",
      en: "Ideal for an executive committee or strategic retreat away from the bustle of the capital, while staying close to Libreville.",
    },
    tags: [
      { fr: "Retraite stratégique", en: "Strategic retreat" },
      { fr: "Plage", en: "Beach" },
    ],
  },
];

export function formatFcfa(value: number) {
  return `${value.toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ")} FCFA`;
}

/* ------------------------------------------------------------------ */
/* Annuaire : hébergements, salles, restaurants, agences, sites, circuits */
/* ------------------------------------------------------------------ */

export const listings: Listing[] = [
  // — Salles & lieux de réunion —
  {
    id: "palais-des-congres",
    category: "salle",
    name: "Palais des Congrès Omar Bongo Ondimba",
    city: "Libreville",
    image: "/Palaiscongrès2.webp",
    coords: [0.47, 9.41],
    summary: {
      fr: "L'infrastructure de référence pour les rencontres de haut niveau.",
      en: "The reference venue for high-level gatherings.",
    },
    details: {
      fr: "Conçu pour accueillir des événements d'envergure nationale et internationale, le Palais des Congrès favorise le dialogue, la coopération et les échanges, au service du rayonnement du Gabon.",
      en: "Designed for national and international events, the Congress Palace fosters dialogue, cooperation and exchange, supporting Gabon's visibility.",
    },
    highlights: [
      { fr: "Congrès & sommets", en: "Congresses & summits" },
      { fr: "Cérémonies officielles", en: "Official ceremonies" },
    ],
    labelled: true,
    booking: "devis",
  },
  {
    id: "espace-affaires-angondje",
    category: "salle",
    name: "Espace des affaires d'Angondjé",
    city: "Libreville",
    image: "/AFAIRES.webp",
    coords: [0.53, 9.42],
    summary: {
      fr: "Une plateforme premium pour congrès, conférences et salons.",
      en: "A premium platform for congresses, conferences and trade shows.",
    },
    details: {
      fr: "Pensé pour les congrès, conférences et salons, cet espace bénéficie d'un emplacement stratégique et d'une offre de services adaptée aux organisateurs internationaux.",
      en: "Designed for congresses, conferences and trade shows, this venue has a strategic location and services suited to international organisers.",
    },
    highlights: [
      { fr: "Salons professionnels", en: "Trade shows" },
      { fr: "Conférences", en: "Conferences" },
    ],
    labelled: true,
    booking: "devis",
  },
  {
    id: "baie-des-rois",
    category: "salle",
    name: "Baie des Rois",
    city: "Libreville",
    image: "/BaiesdesRois.webp",
    coords: [0.3965, 9.4455],
    summary: {
      fr: "Un quartier d'affaires contemporain tourné vers le littoral.",
      en: "A contemporary business district facing the waterfront.",
    },
    details: {
      fr: "Une adresse contemporaine pour imaginer des événements urbains, entre affaires, hospitalité et ouverture sur la baie.",
      en: "A contemporary address for urban events where business, hospitality and the bay meet.",
    },
    highlights: [
      { fr: "Événements urbains", en: "Urban events" },
      { fr: "Vue sur la baie", en: "Bay views" },
    ],
    labelled: false,
    booking: "devis",
  },
  {
    id: "sogara-port-gentil",
    category: "salle",
    name: "Plateforme Sogara",
    city: "Port-Gentil",
    image: "/sogara.webp",
    coords: [-0.7, 8.795],
    summary: {
      fr: "Un pôle stratégique pour les rencontres industrie & énergie.",
      en: "A strategic hub for industry & energy meetings.",
    },
    details: {
      fr: "Destination adaptée aux rencontres liées à l'industrie, à l'énergie et à la logistique dans la capitale économique.",
      en: "Suited to meetings related to industry, energy and logistics in the economic capital.",
    },
    highlights: [
      { fr: "Rencontres sectorielles", en: "Sector meetings" },
      { fr: "Visites industrielles", en: "Industrial visits" },
    ],
    labelled: false,
    booking: "devis",
  },
  {
    id: "river-lodge-seminaires",
    category: "salle",
    name: "River Lodge — espaces séminaires",
    city: "Pointe-Denis",
    image: "/riverLoge.jpg",
    coords: [0.296, 9.33],
    summary: {
      fr: "Salles de réunion face à la lagune pour comités restreints.",
      en: "Lagoon-front meeting rooms for small committees.",
    },
    details: {
      fr: "Un lieu intimiste pour les comités exécutifs et retraites d'équipe, avec un environnement naturel propice à la concentration.",
      en: "An intimate venue for executive committees and team retreats, in a natural setting designed for focus.",
    },
    highlights: [
      { fr: "Comités de direction", en: "Executive committees" },
      { fr: "Séminaires résidentiels", en: "Residential seminars" },
    ],
    labelled: true,
    booking: "devis",
  },

  // — Hébergements —
  {
    id: "le-meridien",
    category: "hebergement",
    name: "Le Méridien",
    city: "Libreville",
    image: "/lemeridien.jpg",
    coords: [0.411, 9.437],
    summary: {
      fr: "Hébergement et réunions face à l'Atlantique.",
      en: "Accommodation and meetings facing the Atlantic.",
    },
    details: {
      fr: "Un cadre hôtelier confortable associant hébergement, restauration et espaces de réunion pour les délégations.",
      en: "A comfortable hotel combining accommodation, dining and meeting space for delegations.",
    },
    highlights: [
      { fr: "Vue océan", en: "Ocean view" },
      { fr: "Salles de réunion", en: "Meeting rooms" },
    ],
    labelled: false,
    booking: "reservation",
  },
  {
    id: "river-lodge",
    category: "hebergement",
    name: "River Lodge",
    city: "Pointe-Denis",
    image: "/riverLoge.jpg",
    coords: [0.296, 9.33],
    summary: {
      fr: "Lodge tropical entre rivière et plages de Pointe-Denis.",
      en: "Tropical lodge between river and the beaches of Pointe-Denis.",
    },
    details: {
      fr: "Piscine, espaces de détente en bord d'eau, activités nautiques et restauration sur place : un écrin de sérénité à quelques minutes de Libreville.",
      en: "Pool, waterside lounges, water activities and on-site dining: a haven of serenity minutes from Libreville.",
    },
    highlights: [
      { fr: "Piscine", en: "Pool" },
      { fr: "Activités nautiques", en: "Water sports" },
    ],
    labelled: true,
    booking: "reservation",
  },
  {
    id: "baie-des-tortues",
    category: "hebergement",
    name: "Baie des Tortues",
    city: "Pointe-Denis",
    image: "/tortue3.jpg",
    coords: [0.286, 9.305],
    summary: {
      fr: "Bungalows en bord de plage, piscine et gastronomie.",
      en: "Beachfront bungalows, pool and fine dining.",
    },
    details: {
      fr: "Espace aquatique, plage, buffet gastronomique et animations : un cadre clé en main pour les incentives et les séjours de délégations.",
      en: "Pool area, beach, gourmet buffet and entertainment: a turnkey setting for incentives and delegation stays.",
    },
    highlights: [
      { fr: "Plage", en: "Beach" },
      { fr: "Incentive", en: "Incentive" },
    ],
    labelled: true,
    booking: "reservation",
  },
  {
    id: "la-maringa",
    category: "hebergement",
    name: "La Maringa el Magnifico",
    city: "Pongara",
    image: "/pog1.jpg",
    coords: [0.27, 9.315],
    summary: {
      fr: "Plage privée de sable blanc aux portes du Parc de Pongara.",
      en: "Private white-sand beach at the gates of Pongara Park.",
    },
    details: {
      fr: "Un établissement authentique et convivial, idéal pour les retraites stratégiques loin de l'agitation de la capitale.",
      en: "An authentic, friendly venue, ideal for strategic retreats away from the bustle of the capital.",
    },
    highlights: [
      { fr: "Plage privée", en: "Private beach" },
      { fr: "Excursions Pongara", en: "Pongara excursions" },
    ],
    labelled: true,
    booking: "reservation",
  },

  // — Restaurants —
  {
    id: "cap-caravane",
    category: "restaurant",
    name: "Cap Caravane",
    city: "Libreville",
    image: "/DETTENTE.jpg",
    coords: [0.43, 9.55],
    summary: {
      fr: "Restaurant flottant sur la rivière Tsini.",
      en: "Floating restaurant on the Tsini river.",
    },
    details: {
      fr: "Déjeuners et dîners gastronomiques servis à bord de la Caravane, plate-forme flottante, avec accès piscine avant l'embarquement.",
      en: "Gourmet lunches and dinners served aboard the Caravane floating platform, with pool access before boarding.",
    },
    highlights: [
      { fr: "Dîner au fil de l'eau", en: "Dinner on the water" },
      { fr: "Groupes dès 10 pers.", en: "Groups from 10" },
    ],
    price: { fr: "Dès 25 000 FCFA / pers.", en: "From 25,000 FCFA / pers." },
    labelled: true,
    booking: "reservation",
  },
  {
    id: "maringa-restaurant",
    category: "restaurant",
    name: "La Maringa — table de plage",
    city: "Pongara",
    image: "/pog2.jpg",
    coords: [0.271, 9.316],
    summary: {
      fr: "Cuisine locale les pieds dans le sable.",
      en: "Local cuisine with your feet in the sand.",
    },
    details: {
      fr: "Restauration sur place dans un cadre authentique et convivial, en bord de plage.",
      en: "On-site dining in an authentic, friendly beachfront setting.",
    },
    highlights: [{ fr: "Cuisine locale", en: "Local cuisine" }],
    labelled: true,
    booking: "reservation",
  },

  // — Agences —
  {
    id: "agatour",
    category: "agence",
    name: "AGATOUR",
    city: "Libreville",
    image: "/libreville.jpg",
    coords: [0.392, 9.454],
    summary: {
      fr: "Interlocuteur officiel : labellisation, devis et mise en relation.",
      en: "Official contact: labelling, quotes and matchmaking.",
    },
    details: {
      fr: "L'AGATOUR structure l'offre de tourisme d'affaires, labellise les prestataires et relaie les demandes de réservation et de devis vers les opérateurs.",
      en: "AGATOUR structures the business tourism offer, labels providers and relays booking and quote requests to operators.",
    },
    highlights: [
      { fr: "Labellisation", en: "Labelling" },
      { fr: "Relais des devis", en: "Quote relay" },
    ],
    labelled: true,
    booking: "devis",
  },

  // — Sites touristiques —
  {
    id: "arboretum-raponda-walker",
    category: "site",
    name: "Arboretum Raponda-Walker",
    city: "Libreville",
    image: "/beau.jpg",
    coords: [0.548, 9.372],
    summary: {
      fr: "Randonnée sous canopée à moins de 20 min du centre-ville.",
      en: "Canopy hike less than 20 min from downtown.",
    },
    details: {
      fr: "Sentiers ombragés, flore médicinale et faune locale : une coupure nature accessible entre deux sessions de travail.",
      en: "Shaded trails, medicinal plants and local wildlife: a nature break between two work sessions.",
    },
    highlights: [{ fr: "Randonnée guidée", en: "Guided hike" }],
    price: { fr: "Dès 10 000 FCFA / pers.", en: "From 10,000 FCFA / pers." },
    labelled: true,
    booking: "reservation",
  },
  {
    id: "musee-national",
    category: "site",
    name: "Musée national des arts et traditions",
    city: "Libreville",
    image: "/MuséeNational.webp",
    coords: [0.399, 9.443],
    summary: {
      fr: "Le patrimoine culturel gabonais au cœur de la capitale.",
      en: "Gabonese cultural heritage in the heart of the capital.",
    },
    details: {
      fr: "Masques, objets rituels et savoir-faire : une visite culturelle idéale pour les délégations.",
      en: "Masks, ritual objects and craftsmanship: an ideal cultural visit for delegations.",
    },
    highlights: [{ fr: "Culture", en: "Culture" }],
    labelled: false,
    booking: "reservation",
  },
  {
    id: "parc-pongara",
    category: "site",
    name: "Parc National de Pongara",
    city: "Pongara",
    image: "/tortue.jpg",
    coords: [0.17, 9.38],
    summary: {
      fr: "Mangroves, plages préservées et tortues marines.",
      en: "Mangroves, preserved beaches and sea turtles.",
    },
    details: {
      fr: "Une destination propice aux activités nature, à la détente et à la découverte des écosystèmes côtiers.",
      en: "A destination for nature activities, relaxation and discovery of coastal ecosystems.",
    },
    highlights: [{ fr: "Littoral", en: "Coast" }],
    labelled: false,
    booking: "devis",
  },
  {
    id: "parc-loango",
    category: "site",
    name: "Parc National de Loango",
    city: "Ogooué-Maritime",
    image: "/elephant.webp",
    coords: [-2.2, 9.6],
    summary: {
      fr: "Le « dernier Éden » : éléphants, gorilles, baleines.",
      en: 'The "last Eden": elephants, gorillas, whales.',
    },
    details: {
      fr: "Une immersion rare entre forêt, lagune, plage et observation de la faune.",
      en: "A rare immersion among forest, lagoon, beach and wildlife.",
    },
    highlights: [{ fr: "Safari", en: "Safari" }],
    labelled: false,
    booking: "devis",
  },
  {
    id: "parc-lope",
    category: "site",
    name: "Parc National de la Lopé",
    city: "Ogooué-Ivindo",
    image: "/Parc.jpg",
    coords: [-0.2, 11.55],
    summary: {
      fr: "Savanes, forêts et éléphants au cœur du Gabon.",
      en: "Savannahs, forests and elephants in the heart of Gabon.",
    },
    details: {
      fr: "Un paysage spectaculaire mêlant savanes et forêts, classé au patrimoine mondial de l'UNESCO.",
      en: "A spectacular landscape of savannah and forest, a UNESCO World Heritage site.",
    },
    highlights: [{ fr: "UNESCO", en: "UNESCO" }],
    labelled: false,
    booking: "devis",
  },
  {
    id: "plateaux-bateke",
    category: "site",
    name: "Plateaux Batéké",
    city: "Haut-Ogooué",
    image: "/pateaubateké.jpg",
    coords: [-1.75, 14.1],
    summary: {
      fr: "De vastes horizons pour un incentive différent.",
      en: "Wide horizons for a different incentive.",
    },
    details: {
      fr: "Des reliefs et vastes horizons pour construire une expérience incentive différente et mémorable.",
      en: "Distinctive landscapes for a different, memorable incentive experience.",
    },
    highlights: [{ fr: "Aventure", en: "Adventure" }],
    labelled: false,
    booking: "devis",
  },

  // — Circuits —
  {
    id: "circuit-libreville-express",
    category: "circuit",
    name: "Libreville Express",
    city: "Libreville",
    image: "/muséé12.webp",
    coords: [0.395, 9.45],
    summary: {
      fr: "1 journée · musée, front de mer, arboretum.",
      en: "1 day · museum, waterfront, arboretum.",
    },
    details: {
      fr: "Un circuit compact pour les participants en fin de congrès : patrimoine culturel au musée national, front de mer, puis randonnée à l'Arboretum Raponda-Walker.",
      en: "A compact tour for delegates after a congress: cultural heritage at the national museum, waterfront, then a hike at the Raponda-Walker Arboretum.",
    },
    highlights: [
      { fr: "1 jour", en: "1 day" },
      { fr: "Culture & nature", en: "Culture & nature" },
    ],
    labelled: true,
    booking: "devis",
  },
  {
    id: "circuit-estuaire",
    category: "circuit",
    name: "Estuaire & plages : Pointe-Denis – Pongara",
    city: "Pointe-Denis",
    image: "/plage.jpg",
    coords: [0.29, 9.32],
    summary: {
      fr: "2 jours · traversée, plages, mangroves, tortues.",
      en: "2 days · crossing, beaches, mangroves, turtles.",
    },
    details: {
      fr: "Traversée de l'estuaire, nuit en lodge à Pointe-Denis, excursion encadrée au Parc National de Pongara et temps libre en bord de plage.",
      en: "Estuary crossing, a night in a Pointe-Denis lodge, guided excursion in Pongara National Park and free time on the beach.",
    },
    highlights: [
      { fr: "2 jours", en: "2 days" },
      { fr: "Littoral", en: "Coast" },
    ],
    labelled: true,
    booking: "devis",
  },
  {
    id: "circuit-loango",
    category: "circuit",
    name: "Safari Loango",
    city: "Ogooué-Maritime",
    image: "/elephant.webp",
    coords: [-2.25, 9.62],
    summary: {
      fr: "3 à 4 jours · faune sauvage et lagunes.",
      en: "3 to 4 days · wildlife and lagoons.",
    },
    details: {
      fr: "Une expérience guidée au contact d'une biodiversité exceptionnelle, pensée pour les petits groupes et les programmes incentive.",
      en: "A guided experience among exceptional biodiversity, designed for small groups and incentive programmes.",
    },
    highlights: [
      { fr: "3-4 jours", en: "3-4 days" },
      { fr: "Safari", en: "Safari" },
    ],
    labelled: false,
    booking: "devis",
  },
  {
    id: "circuit-lope",
    category: "circuit",
    name: "Lopé, savanes & Transgabonais",
    city: "Ogooué-Ivindo",
    image: "/Parc.jpg",
    coords: [-0.15, 11.6],
    summary: {
      fr: "3 jours · train, savanes et éléphants.",
      en: "3 days · train, savannah and elephants.",
    },
    details: {
      fr: "Rejoindre la Lopé en train depuis Libreville, puis explorer savanes et forêts à la rencontre de la faune.",
      en: "Travel to Lopé by train from Libreville, then explore savannah and forest to meet the wildlife.",
    },
    highlights: [
      { fr: "3 jours", en: "3 days" },
      { fr: "UNESCO", en: "UNESCO" },
    ],
    labelled: false,
    booking: "devis",
  },
];

export function getListing(id: string) {
  return listings.find((l) => l.id === id);
}

export const cities = Array.from(new Set(listings.map((l) => l.city))).sort();

/* ------------------------------------------------------------------ */
/* Événements                                                           */
/* Programme indicatif — à remplacer par les événements validés par    */
/* l'AGATOUR.                                                           */
/* ------------------------------------------------------------------ */

export interface MiceEvent {
  id: string;
  title: Bi;
  theme: Bi;
  target: Bi;
  city: string;
  venue: string;
  startDate: string; // AAAA-MM-JJ
  endDate: string;
  attendees?: number;
  image: string;
  organiser: string;
}

export const miceEvents: MiceEvent[] = [
  {
    id: "salon-tourisme-affaires",
    title: { fr: "Salon du tourisme d'affaires", en: "Business Tourism Fair" },
    theme: { fr: "Tourisme MICE & hospitalité", en: "MICE tourism & hospitality" },
    target: { fr: "Organisateurs, hôteliers, agences", en: "Organisers, hoteliers, agencies" },
    city: "Libreville",
    venue: "Palais des Congrès Omar Bongo Ondimba",
    startDate: "2026-12-03",
    endDate: "2026-12-05",
    attendees: 800,
    image: "/Palaiscongrès2.webp",
    organiser: "AGATOUR",
  },
  {
    id: "forum-economie-verte",
    title: { fr: "Forum de l'économie verte", en: "Green Economy Forum" },
    theme: {
      fr: "Conservation & investissements durables",
      en: "Conservation & sustainable investment",
    },
    target: { fr: "Investisseurs, institutions, ONG", en: "Investors, institutions, NGOs" },
    city: "Libreville",
    venue: "Espace des affaires d'Angondjé",
    startDate: "2027-02-17",
    endDate: "2027-02-18",
    attendees: 400,
    image: "/AFAIRES.webp",
    organiser: "GabonMICE",
  },
  {
    id: "rencontres-energie-port-gentil",
    title: { fr: "Rencontres énergie & logistique", en: "Energy & Logistics Meetings" },
    theme: {
      fr: "Industrie, énergie, logistique portuaire",
      en: "Industry, energy, port logistics",
    },
    target: { fr: "Industriels et partenaires", en: "Industry players and partners" },
    city: "Port-Gentil",
    venue: "Plateforme Sogara",
    startDate: "2027-04-08",
    endDate: "2027-04-09",
    attendees: 250,
    image: "/Portgentille.jpg",
    organiser: "GabonMICE",
  },
  {
    id: "seminaire-prestataires",
    title: { fr: "Séminaire des prestataires labellisés", en: "Labelled Providers Seminar" },
    theme: { fr: "Qualité de service & labellisation", en: "Service quality & labelling" },
    target: { fr: "Prestataires MICE", en: "MICE providers" },
    city: "Pointe-Denis",
    venue: "River Lodge",
    startDate: "2026-06-12",
    endDate: "2026-06-13",
    attendees: 60,
    image: "/riverLoge.jpg",
    organiser: "AGATOUR",
  },
];

/** Besoins proposés dans l'espace organisateur. */
export const organiserNeeds: Bi[] = [
  { fr: "Location de salle", en: "Venue hire" },
  { fr: "Hébergement des participants", en: "Delegate accommodation" },
  { fr: "Restauration / traiteur", en: "Catering" },
  { fr: "Transport & transferts", en: "Transport & transfers" },
  { fr: "Matériel audiovisuel", en: "AV equipment" },
  { fr: "Interprétation / traduction", en: "Interpreting / translation" },
  { fr: "Animation & activités incentive", en: "Entertainment & incentive activities" },
  { fr: "Excursions & circuits", en: "Excursions & tours" },
  { fr: "Accueil & hôtesses", en: "Reception staff" },
  { fr: "Communication & signalétique", en: "Communication & signage" },
];
