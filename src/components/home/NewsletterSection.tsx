import { homeCopyFr, homeCopyEn, type HomeSections } from "@/lib/home-data";

interface NewsletterSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function NewsletterSection({ language, theme }: NewsletterSectionProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const sections = copy.sections as unknown as HomeSections;
  const headingClass = isDark ? "text-slate-100" : "text-slate-900";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const cardClass = isDark
    ? "bg-slate-900/90 border border-slate-800 shadow-soft"
    : "bg-white border border-slate-200 shadow-soft";

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10">
      <div
        className={`max-w-4xl mx-auto text-center rounded-[2rem] border p-8 sm:p-12 transition-colors duration-500 ${cardClass}`}
      >
        <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
          {sections.newsletterLabel}
        </span>
        <h2
          className={`font-display text-2.5xl sm:text-4xl md:text-5xl font-bold mt-5 leading-[1.05] ${headingClass}`}
        >
          {sections.newsletterTitle}
        </h2>
        <p className={`text-base sm:text-lg font-light mt-6 max-w-xl mx-auto ${mutedTextClass}`}>
          {sections.newsletterText}
        </p>
        <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="votre@email.com"
            className={`flex-1 px-6 py-4 rounded-full border focus:border-forest focus:outline-none text-sm ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500"
                : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            }`}
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-forest text-white text-xs font-bold uppercase tracking-widest hover:bg-forest-deep transition-colors shadow-lg shadow-forest/20"
          >
            {sections.newsletterButton}
          </button>
        </form>
      </div>
    </section>
  );
}
