import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import type { MapPoint } from "@/lib/map-points";

export { mapCategoryMeta, mapPoints, type MapCategory, type MapPoint } from "@/lib/map-points";

// Leaflet a besoin de `window` : la carte react-leaflet n'est chargée
// qu'après le montage, jamais pendant le rendu serveur.
const LeafletMap = lazy(() => import("./LeafletMap"));

function MapMessage({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-ink/60 dark:text-slate-400">
      {children}
    </div>
  );
}

class MapErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <MapMessage>Carte indisponible — vérifiez votre connexion.</MapMessage>
    ) : (
      this.props.children
    );
  }
}

export function InteractiveMap({
  points,
  activeId,
  onSelect,
  className = "",
  interactive = true,
}: {
  points: MapPoint[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  /** false : carte d'aperçu (pas de zoom à la molette). */
  interactive?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const loading = <MapMessage>Chargement de la carte…</MapMessage>;

  return (
    // `isolate` contient les z-index de Leaflet sous la navigation fixe.
    <div className={`relative isolate overflow-hidden bg-sand dark:bg-slate-800 ${className}`}>
      {mounted ? (
        <MapErrorBoundary>
          <Suspense fallback={loading}>
            <div className="absolute inset-0">
              <LeafletMap
                points={points}
                activeId={activeId}
                onSelect={onSelect}
                interactive={interactive}
              />
            </div>
          </Suspense>
        </MapErrorBoundary>
      ) : (
        loading
      )}
    </div>
  );
}
