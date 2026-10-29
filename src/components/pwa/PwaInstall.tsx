import { useEffect, useState } from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";

/** Événement non standard exposé par Chrome, Edge et Samsung Internet. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "gabonmice-pwa-dismissed";
const DISMISS_DAYS = 14;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  const ua = navigator.userAgent;
  // iPadOS se présente comme un Mac : on le reconnaît à l'écran tactile.
  return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
}

function recentlyDismissed() {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

/**
 * Enregistre le service worker et propose l'installation de l'application :
 * bouton natif sur Android / ordinateur, mode d'emploi « Sur l'écran d'accueil » sur iOS.
 */
export function PwaInstall({ language }: { language: "fr" | "en" }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const t = (fr: string, en: string) => (language === "fr" ? fr : en);

  useEffect(() => {
    // En développement, un service worker garderait d'anciennes versions en cache.
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (isStandalone() || recentlyDismissed()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Safari iOS n'a pas d'invite d'installation : on affiche la marche à suivre.
    const timer = isIos() ? window.setTimeout(() => setShowIos(true), 4000) : undefined;

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setDeferred(null);
    setShowIos(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // stockage indisponible : le bandeau reviendra à la prochaine visite
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "dismissed") dismiss();
    setDeferred(null);
  };

  if (!deferred && !showIos) return null;

  return (
    <div
      role="dialog"
      aria-label={t("Installer l'application", "Install the app")}
      className="fixed inset-x-3 bottom-3 z-[900] mx-auto max-w-md rounded-2xl border border-black/5 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:bottom-5 sm:left-5 sm:right-auto"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={t("Fermer", "Close")}
        className="absolute right-2 top-2 rounded-full p-1.5 text-ink/50 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/10"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <img src="/icons/icon-192.png" alt="" className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p className="font-semibold text-forest-deep dark:text-white">
            {t("Installer GabonMICE", "Install GabonMICE")}
          </p>
          {deferred ? (
            <p className="mt-0.5 text-sm text-ink/70 dark:text-slate-300">
              {t(
                "Accédez au site comme à une application, depuis votre écran d'accueil.",
                "Open the site like an app, straight from your home screen.",
              )}
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-ink/70 dark:text-slate-300">
              {t("Touchez", "Tap")}{" "}
              <Share
                className="inline h-4 w-4 align-text-bottom"
                aria-label={t("Partager", "Share")}
              />{" "}
              {t("puis « Sur l'écran d'accueil »", "then “Add to Home Screen”")}{" "}
              <SquarePlus className="inline h-4 w-4 align-text-bottom" aria-hidden />
            </p>
          )}
        </div>
      </div>
      {deferred && (
        <button
          type="button"
          onClick={install}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 hover:bg-sun-deep"
        >
          <Download className="h-4 w-4" />
          {t("Installer l'application", "Install the app")}
        </button>
      )}
    </div>
  );
}
