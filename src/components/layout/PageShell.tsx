import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollToTop } from "@/components/home/ScrollToTop";
import { useSitePrefs, type SitePrefs } from "@/hooks/use-site-prefs";

/**
 * Gabarit commun : navigation, préférences (langue / thème), pied de page.
 * La classe `dark` active les variantes `dark:` de Tailwind dans les pages.
 */
export function PageShell({
  children,
  withNavOffset = true,
}: {
  children: (prefs: SitePrefs) => ReactNode;
  withNavOffset?: boolean;
}) {
  const prefs = useSitePrefs();
  return (
    <div
      lang={prefs.language}
      className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${
        prefs.isDark ? "dark bg-slate-950 text-slate-100" : "bg-cream text-ink"
      }`}
    >
      <SiteNav
        language={prefs.language}
        theme={prefs.theme}
        onToggleTheme={prefs.toggleTheme}
        onToggleLanguage={prefs.toggleLanguage}
      />
      <main className={withNavOffset ? "pt-[68px]" : undefined}>{children(prefs)}</main>
      <SiteFooter language={prefs.language} theme={prefs.theme} />
      <ScrollToTop label={prefs.t("Remonter en haut", "Back to top")} theme={prefs.theme} />
    </div>
  );
}

export function PageHero({
  image,
  eyebrow,
  title,
  highlight,
  intro,
  crumb,
  homeLabel,
  children,
}: {
  image: string;
  eyebrow: string;
  title: string;
  /** Partie du titre soulignée façon « coup de pinceau ». */
  highlight?: string;
  intro: string;
  crumb: string;
  homeLabel: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="relative isolate overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]">
        <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
        <div className="mx-auto max-w-7xl px-5 pb-14 pt-10 sm:px-10 sm:pb-20 sm:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-1.5 text-xs font-medium text-white/70"
          >
            <Link to="/" className="hover:text-white">
              {homeLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{crumb}</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-sun">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="brush-underline">{highlight}</span>
              </>
            )}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {intro}
          </p>
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sun-deep dark:text-sun">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-forest-deep dark:text-white sm:text-4xl">
          {title}
        </h2>
        {text && (
          <p className="mt-3 text-base leading-relaxed text-ink/65 dark:text-slate-400">{text}</p>
        )}
      </div>
      {action}
    </div>
  );
}
