import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { GridLoader } from "react-spinners";

const LOADER_COLOR = "#36d7b7";

type Bi = { fr: string; en: string };

const DEFAULT_MESSAGE: Bi = { fr: "Veuillez patienter…", en: "Please wait…" };

/** Langue mémorisée par le site (même clé que useSitePrefs) ; l'overlay n'est rendu que côté client. */
function storedLanguage(): "fr" | "en" {
  try {
    return window.localStorage.getItem("gabonmice-language") === "en" ? "en" : "fr";
  } catch {
    return "fr";
  }
}

/**
 * Écran de chargement plein écran (GridLoader) : soumissions de formulaires,
 * actions de l'espace admin, navigation vers une page lente.
 * Rendu dans <body> via un portail pour ne pas être piégé par un parent transformé.
 */
export function LoadingOverlay({ show, message }: { show: boolean; message?: Bi }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!show) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [show]);

  if (!mounted || !show) return null;
  const text = (message ?? DEFAULT_MESSAGE)[storedLanguage()];

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-5 bg-white/75 backdrop-blur-sm dark:bg-slate-950/75"
    >
      <GridLoader color={LOADER_COLOR} aria-hidden />
      <p className="px-6 text-center text-sm font-semibold text-forest-deep dark:text-white">
        {text}
      </p>
    </div>,
    document.body,
  );
}

/** Chargement de page (navigation vers une route dont les données arrivent lentement). */
export function PageLoader() {
  return <LoadingOverlay show message={{ fr: "Chargement de la page…", en: "Loading page…" }} />;
}

/** Variante intégrée dans un bloc (carte, météo…) plutôt qu'en plein écran. */
export function InlineLoader({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 ${className}`}>
      <GridLoader color={LOADER_COLOR} size={6} margin={1} aria-hidden />
      <span>{label}</span>
    </div>
  );
}
