import {
  investItemsFr,
  investItemsEn,
  homeCopyFr,
  homeCopyEn,
  type HomeSections,
} from "@/lib/home-data";

interface InvestSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function InvestSection({ language, theme }: InvestSectionProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const investItems = isFrench ? investItemsFr : investItemsEn;
  const sections = copy.sections as unknown as HomeSections;
  const headingClass = isDark ? "text-slate-100" : "text-slate-900";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";
  const cardClass = isDark
    ? "bg-slate-900/90 border border-slate-800 shadow-soft"
    : "bg-white border border-slate-200 shadow-soft";

  return (
    <section
      id="invest"
      className={`py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 transition-colors duration-500 ${isDark ? "bg-slate-900/70" : "bg-slate-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-ocean font-bold tracking-[0.25em] text-xs uppercase">
            {sections.investLabel}
          </span>
          <h2
            className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 leading-[1.05] ${headingClass}`}
          >
            {sections.investTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {investItems.map((f) => (
            <div
              key={f.n}
              className={`p-6 sm:p-8 lg:p-10 rounded-3xl shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 ${cardClass}`}
            >
              <div className="text-gold font-display font-bold text-4xl mb-6">{f.n}</div>
              <h3 className={`font-display text-2xl font-bold mb-3 ${headingClass}`}>{f.t}</h3>
              <p className={`font-light leading-relaxed ${mutedTextClass}`}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
