import { useEffect, useState } from "react";

export type Language = "fr" | "en";
export type Theme = "light" | "dark";

/**
 * Langue et thème partagés entre les pages, persistés dans le localStorage
 * (mêmes clés que les pages historiques : gabonmice-language / gabonmice-theme).
 */
export function useSitePrefs() {
  const [language, setLanguage] = useState<Language>("fr");
  const [theme, setTheme] = useState<Theme>("light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedLanguage = window.localStorage.getItem("gabonmice-language") as Language | null;
      const storedTheme = window.localStorage.getItem("gabonmice-theme") as Theme | null;
      if (storedLanguage) setLanguage(storedLanguage);
      if (storedTheme) setTheme(storedTheme);
    } catch {
      // stockage indisponible : on garde les valeurs par défaut
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem("gabonmice-language", language);
      window.localStorage.setItem("gabonmice-theme", theme);
    } catch {
      // ignoré
    }
  }, [language, theme, loaded]);

  return {
    language,
    theme,
    isFrench: language === "fr",
    isDark: theme === "dark",
    toggleLanguage: () => setLanguage((l) => (l === "fr" ? "en" : "fr")),
    toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    /** Choisit le texte selon la langue courante. */
    t: (fr: string, en: string) => (language === "fr" ? fr : en),
  };
}

export type SitePrefs = ReturnType<typeof useSitePrefs>;
