import { createElement, useEffect, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapCategoryMeta, type MapCategory, type MapPoint } from "@/lib/map-points";

/**
 * Carte react-leaflet. Ce module touche `window` dès son import :
 * il ne doit être chargé que côté navigateur (voir InteractiveMap).
 */

const LIBREVILLE: [number, number] = [0.4, 9.45];

// Icônes rondes colorées avec une icône Lucide blanche, mises en cache.
const iconCache = new Map<string, L.DivIcon>();
function markerIcon(category: MapCategory, active: boolean) {
  const key = `${category}-${active}`;
  const cached = iconCache.get(key);
  if (cached) return cached;
  const meta = mapCategoryMeta[category];
  const size = active ? 44 : 34;
  const svg = renderToStaticMarkup(
    createElement(meta.icon, { size: active ? 20 : 16, color: "#fff", strokeWidth: 2.25 }),
  );
  const icon = L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${meta.color};border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center">${svg}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, -size / 2],
  });
  iconCache.set(key, icon);
  return icon;
}

/** Cadre la carte sur les points, ou centre sur l'élément actif. */
function ViewController({ points, activeId }: { points: MapPoint[]; activeId?: string | null }) {
  const map = useMap();
  useEffect(() => {
    const active = activeId ? points.find((p) => p.id === activeId) : undefined;
    if (active) {
      map.flyTo(active.coords, Math.max(map.getZoom(), 12), { duration: 0.8 });
    } else if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points.map((p) => p.coords)), {
        padding: [40, 40],
        maxZoom: 11,
      });
    }
  }, [map, points, activeId]);
  return null;
}

export default function LeafletMap({
  points,
  activeId,
  onSelect,
  interactive,
}: {
  points: MapPoint[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  interactive: boolean;
}) {
  // Les marqueurs actifs passent au premier plan.
  const ordered = useMemo(
    () => [...points].sort((a, b) => Number(a.id === activeId) - Number(b.id === activeId)),
    [points, activeId],
  );

  return (
    <MapContainer
      center={LIBREVILLE}
      zoom={9}
      scrollWheelZoom={interactive}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={18}
      />
      {ordered.map((p) => (
        <Marker
          key={p.id}
          position={p.coords}
          icon={markerIcon(p.category, p.id === activeId)}
          zIndexOffset={p.id === activeId ? 1000 : 0}
          title={p.name}
          eventHandlers={{ click: () => onSelect?.(p.id) }}
        >
          <Tooltip direction="top">{p.name}</Tooltip>
        </Marker>
      ))}
      <ViewController points={points} activeId={activeId} />
    </MapContainer>
  );
}
