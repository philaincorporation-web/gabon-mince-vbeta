export const mbigouCards = [
  {
    id: 1,
    image: "/MBIGOU.jpg",
    title: {
      fr: "MBIGOU — Le cœur historique",
      en: "MBIGOU — The Historic Heart",
    },
    description: {
      fr: "Découvrez MBIGOU, berceau de l'histoire gabonaise. Ce site emblématique offre une immersion authentique dans la culture et le patrimoine du Gabon.",
      en: "Discover MBIGOU, the cradle of Gabonese history. This iconic site offers an authentic immersion in Gabon's culture and heritage.",
    },
    details: {
      fr: "MBIGOU est un site historique majeur qui témoigne du riche passé du Gabon. Visiteurs, chercheurs et amateurs de patrimoine y trouvent un trésor inestimable à travers ses vestiges et son histoire millénaire.",
      en: "MBIGOU is a major historic site that bears witness to Gabon's rich past. Visitors, researchers, and heritage enthusiasts find an invaluable treasure through its remains and millennia-long history.",
    },
  },
  {
    id: 2,
    image: "/MBIGOU2.jpg",
    title: {
      fr: "MBIGOU — Nature et biodiversité",
      en: "MBIGOU — Nature & Biodiversity",
    },
    description: {
      fr: "Explorez la biodiversité exceptionnelle de MBIGOU, où la faune et la flore du Gabon s'épanouissent dans un écosystème préservé et unique.",
      en: "Explore the exceptional biodiversity of MBIGOU, where Gabon's flora and fauna thrive in a preserved and unique ecosystem.",
    },
    details: {
      fr: "La réserve naturelle de MBIGOU abrite une faune diversifiée et des espèces végétales endémiques. C'est un paradis pour les amoureux de la nature et les passionnés d'ornithologie.",
      en: "The MBIGOU nature reserve houses diverse fauna and endemic plant species. It is a paradise for nature lovers and birdwatching enthusiasts.",
    },
  },
  {
    id: 3,
    image: "/MBIGOU3.jpg",
    title: {
      fr: "MBIGOU — Artisanat et traditions",
      en: "MBIGOU — Craft & Traditions",
    },
    description: {
      fr: "Plongez dans l'artisanat local de MBIGOU. Rencontrez les artisans qui perpétuent les traditions ancestrales à travers des créations uniques et authentiques.",
      en: "Dive into local MBIGOU craftsmanship. Meet artisans who perpetuate ancestral traditions through unique and authentic creations.",
    },
    details: {
      fr: "Les artisans de MBIGOU perpétuent des savoir-faire ancestraux : sculpture sur bois, tissage, poterie et bijoux traditionnels. Chaque création raconte l'histoire du Gabon.",
      en: "MBIGOU artisans perpetuate ancestral know-how: wood carving, weaving, pottery, and traditional jewelry. Each creation tells the story of Gabon.",
    },
  },
  {
    id: 4,
    image: "/MBIGOU4.jpg",
    title: {
      fr: "MBIGOU — Gastronomie locale",
      en: "MBIGOU — Local Gastronomy",
    },
    description: {
      fr: "Savourez la gastronomie de MBIGOU, un voyage culinaire au cœur des saveurs traditionnelles gabonaises préparées avec des produits frais et locaux.",
      en: "Savor MBIGOU gastronomy, a culinary journey at the heart of traditional Gabonese flavors prepared with fresh, local products.",
    },
    details: {
      fr: "La cuisine MBIGOU est un festin de saveurs africaines : nyembwe, poulet braisé, manioc frit et bien d'autres délices. Chaque repas est une célébration de la culture gabonaise.",
      en: "MBIGOU cuisine is a feast of African flavors: nyembwe, grilled chicken, fried cassava, and many more delights. Every meal is a celebration of Gabonese culture.",
    },
  },
] as const;

interface MBIGOUCardData {
  id: number;
  image: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  details: { fr: string; en: string };
}

export type MBIGOUCard = (typeof mbigouCards)[number];
