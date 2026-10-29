import { createElement, useEffect, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapCategoryMeta, type MapCategory, type MapPoint } from "@/lib/map-points";

/**
 * Carte react-leaflet. Ce module touche `window` dès son import :
 * il ne doit être chargé que côté navigateur (voir InteractiveMap).
 */

const LIBREVILLE: [number, number] = [0.4, 9.45];

// Fonds CARTO. Avec VITE_CARTO_API_KEY : endpoint authentifié (quota de la clé) ;
// sans clé : endpoint public, avec tuiles haute définition ({r}) sur écrans Retina.
const CARTO_KEY = import.meta.env.VITE_CARTO_API_KEY as string | undefined;
const cartoUrl = (style: string) =>
  CARTO_KEY
    ? `https://basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}.png?key=${encodeURIComponent(CARTO_KEY)}`
    : `https://{s}.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}{r}.png`;

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

type BaseLayerDef = {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxNativeZoom: number;
  /** Calque de noms de lieux superposé (vue satellite). */
  labelsUrl?: string;
};

const BASE_LAYERS: BaseLayerDef[] = [
  {
    id: "satellite",
    name: "Satellite",
    url: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    labelsUrl: `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`,
    attribution: "Imagerie &copy; Esri, Maxar, Earthstar Geographics",
    maxNativeZoom: 18,
  },
  {
    id: "relief",
    name: "Relief",
    url: `${ESRI}/World_Topo_Map/MapServer/tile/{z}/{y}/{x}`,
    attribution: "&copy; Esri, HERE, Garmin, OpenStreetMap",
    maxNativeZoom: 18,
  },
  {
    id: "plan",
    name: "Plan",
    url: cartoUrl("voyager"),
    attribution: CARTO_ATTRIBUTION,
    maxNativeZoom: 18,
  },
  {
    id: "epure",
    name: "Épuré",
    url: cartoUrl("light_all"),
    attribution: CARTO_ATTRIBUTION,
    maxNativeZoom: 18,
  },
];

const LAYER_KEY = "gabonmice-map-layer";

function storedLayer() {
  try {
    const id = window.localStorage.getItem(LAYER_KEY);
    return BASE_LAYERS.some((l) => l.id === id) ? id : BASE_LAYERS[0].id;
  } catch {
    return BASE_LAYERS[0].id;
  }
}

/** Mémorise le fond choisi pour les prochaines visites. */
function RememberLayer() {
  useMapEvents({
    baselayerchange: (event) => {
      const layer = BASE_LAYERS.find((l) => l.name === event.name);
      try {
        if (layer) window.localStorage.setItem(LAYER_KEY, layer.id);
      } catch {
        // stockage indisponible : le choix vaut pour la visite en cours
      }
    },
  });
  return null;
}

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
  const initialLayer = useMemo(storedLayer, []);
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
      <LayersControl position="topright">
        {BASE_LAYERS.map((layer) => (
          <LayersControl.BaseLayer
            key={layer.id}
            name={layer.name}
            checked={layer.id === initialLayer}
          >
            <LayerGroup>
              <TileLayer
                url={layer.url}
                attribution={layer.attribution}
                maxNativeZoom={layer.maxNativeZoom}
                maxZoom={19}
              />
              {layer.labelsUrl && (
                <TileLayer url={layer.labelsUrl} maxNativeZoom={layer.maxNativeZoom} maxZoom={19} />
              )}
            </LayerGroup>
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>
      <RememberLayer />
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
