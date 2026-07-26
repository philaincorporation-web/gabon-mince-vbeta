import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export type CatalogueItem = {
  fr: CatalogueText;
  en: CatalogueText;
  image: string;
};

export type CatalogueText = {
  title: string;
  description: string;
  label: string;
  details: string;
};

type LocalizedText = { fr: string; en: string };

export function CataloguePage({ title, intro, items }: { title: LocalizedText; intro: LocalizedText; items: CatalogueItem[] }) {
  const pageSize = 3;
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedItem, setSelectedItem] = useState<CatalogueItem | null>(null);
  const pageCount = Math.ceil(items.length / pageSize);
  const visibleItems = items.slice((page - 1) * pageSize, page * pageSize);
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench
    ? { home: "Accueil", viewDetails: "Voir les détails", pagination: "Pagination", close: "Fermer", details: "En savoir plus" }
    : { home: "Home", viewDetails: "View details", pagination: "Pagination", close: "Close", details: "Learn more" };

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("gabonmice-language") as "fr" | "en" | null;
    const storedTheme = window.localStorage.getItem("gabonmice-theme") as "light" | "dark" | null;
    if (storedLanguage) setLanguage(storedLanguage);
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-language", language);
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem("gabonmice-theme", theme);
  }, [theme]);

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`} lang={language}>
      <header className={`border-b px-4 py-5 transition-colors sm:px-8 ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-forest">GABON<span className="text-ocean">MICE</span></Link>
          <div className="flex items-center gap-2"><button type="button" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label={isDark ? "Light theme" : "Dark theme"} className="rounded-full border border-forest/30 px-3 py-2 text-xs font-bold text-forest transition-colors hover:bg-forest hover:text-white">{isDark ? "☀" : "☾"}</button><button type="button" onClick={() => setLanguage(isFrench ? "en" : "fr")} className="rounded-full border border-forest/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest transition-colors hover:bg-forest hover:text-white">{isFrench ? "EN" : "FR"}</button><Link to="/" className="rounded-full border border-forest/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest transition-colors hover:bg-forest hover:text-white">{copy.home}</Link></div>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-forest">GabonMICE</span>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-6xl">{title[language]}</h1>
        <p className={`mt-5 max-w-2xl text-lg font-light leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{intro[language]}</p>
        <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-3">
          {visibleItems.map((item) => { const content = item[language]; return <article key={content.title} className={`overflow-hidden rounded-3xl shadow-soft transition-colors ${isDark ? "bg-slate-900" : "bg-white"}`}><img src={item.image} alt={content.title} className="aspect-[4/3] w-full object-cover" loading="lazy" /><div className="p-6"><span className="text-xs font-bold uppercase tracking-widest text-ocean">{content.label}</span><h2 className="mt-3 font-display text-2xl font-bold">{content.title}</h2><p className={`mt-3 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{content.description}</p><button type="button" onClick={() => setSelectedItem(item)} className="mt-5 text-sm font-bold text-forest underline underline-offset-4 transition-colors hover:text-ocean">{copy.viewDetails}</button></div></article>; })}
        </div>
        {pageCount > 1 && <nav className="mt-12 flex items-center justify-center gap-2" aria-label={copy.pagination}>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} aria-current={page === number ? "page" : undefined} className={`h-11 w-11 rounded-full font-bold transition-colors ${page === number ? "bg-forest text-white" : isDark ? "border border-slate-700 bg-slate-900 text-slate-200 hover:border-forest hover:text-forest" : "border border-slate-300 bg-white text-slate-700 hover:border-forest hover:text-forest"}`}>{number}</button>)}</nav>}
      </section>
      {selectedItem && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label={copy.details} onClick={() => setSelectedItem(null)}><article className={`max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl shadow-2xl ${isDark ? "bg-slate-900" : "bg-white"}`} onClick={(event) => event.stopPropagation()}><img src={selectedItem.image} alt={selectedItem[language].title} className="h-64 w-full object-cover" /><div className="p-7 sm:p-10"><div className="flex items-start justify-between gap-5"><div><span className="text-xs font-bold uppercase tracking-widest text-ocean">{selectedItem[language].label}</span><h2 className="mt-3 font-display text-3xl font-bold">{selectedItem[language].title}</h2></div><button type="button" onClick={() => setSelectedItem(null)} className={`rounded-full border px-3 py-1 text-sm font-bold hover:border-forest hover:text-forest ${isDark ? "border-slate-700 text-slate-300" : "border-slate-300 text-slate-600"}`}>{copy.close}</button></div><p className={`mt-6 text-lg leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>{selectedItem[language].details}</p></div></article></div>}
    </main>
  );
}
