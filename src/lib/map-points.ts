import { Star, type LucideIcon } from "lucide-react";
import {
  categoryMeta,
  listings,
  specialOffers,
  type Bi,
  type ListingCategory,
} from "@/lib/mice-data";

export type MapCategory = ListingCategory | "offre";

export type MapPoint = {
  id: string;
  name: string;
  category: MapCategory;
  city: string;
  image: string;
  /** [latitude, longitude] */
  coords: [number, number];
  summary: Bi;
};

type MapCategoryInfo = { label: Bi; color: string; icon: LucideIcon };

export const mapCategoryMeta: Record<MapCategory, MapCategoryInfo> = {
  ...Object.fromEntries(
    Object.entries(categoryMeta).map(([key, meta]) => [
      key,
      { label: meta.plural, color: meta.color, icon: meta.icon },
    ]),
  ),
  offre: { label: { fr: "Offres spéciales", en: "Special offers" }, color: "#F28C28", icon: Star },
} as Record<MapCategory, MapCategoryInfo>;

export const mapPoints: MapPoint[] = [
  ...specialOffers.map((o) => ({
    id: o.id,
    name: `${o.title.fr} — ${o.venue}`,
    category: "offre" as const,
    city: o.city,
    image: o.image,
    coords: o.coords,
    summary: o.pitch,
  })),
  ...listings.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    city: l.city,
    image: l.image,
    coords: l.coords,
    summary: l.summary,
  })),
];
