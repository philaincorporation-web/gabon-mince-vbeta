import { homeCopyFr, homeCopyEn, type HomeSections } from "@/lib/home-data";

interface CtaSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function CtaSection({ language, theme }: CtaSectionProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const sections = copy.sections as unknown as HomeSections;

  return (
    <section className={`py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 transition-colors duration-500 ${isDark ? "bg-slate-900/70" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`relative overflow-hidden rounded-[2rem] p-8 sm:p-12 md:p-16 transition-colors duration-500 ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200 shadow-soft"}`}>
          <div className="absolute inset-0">
            <img src="/AffichePub.png" alt="" className="w-full h-full object-cover opacity-10" />
            <div className={`absolute inset-0 ${isDark ? "bg-slate-900/90" : "bg-white/90"}`} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
                {isFrench ? "Un projet ?" : "A project?"}
              </span>
              <h2 className={`font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-5 leading-[1.05] ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {isFrench ? "Construisons votre événement ensemble" : "Let's build your event together"}
              </h2>
              <p className={`mt-5 text-base sm:text-lg font-light leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {isFrench
                  ? "Notre équipe vous accompagne dans la conception, l'organisation et la réussite de votre prochain événement au Gabon."
                  : "Our team supports you in designing, organizing and succeeding in your next event in Gabon."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-conversion-popup"))}
              className="shrink-0 rounded-full bg-forest px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-forest/25 transition-all hover:bg-forest-deep hover:scale-[1.02]"
            >
              {isFrench ? "Organiser un événement" : "Plan an event"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
