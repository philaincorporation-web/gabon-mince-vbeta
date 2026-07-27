import { homeCopyFr, homeCopyEn, type HomeSections } from "@/lib/home-data";

interface DestinationsSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function DestinationsSection({ language, theme }: DestinationsSectionProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const sections = copy.sections as unknown as HomeSections;

  return (
    <section
      id="destinations"
      className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto"
    >
      <div className="max-w-2xl mb-16">
        <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
          {sections.destinationsLabel}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 text-slate-900 leading-[1.05]">
          {sections.destinationsTitle}
        </h2>
        <p
          className={`text-base sm:text-lg font-light leading-relaxed mt-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          {sections.destinationsText}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <a
          href="#"
          className="group md:col-span-4 relative overflow-hidden rounded-3xl aspect-[16/10] shadow-soft max-h-[26rem] sm:max-h-none"
        >
          <img
            src="/muséé12.webp"
            alt="Libreville"
            width={1200}
            height={750}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
              {sections.destinationCard1Label}
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold mt-2">
              {sections.destinationCard1Title}
            </h3>
            <p className="text-white/80 font-light mt-2 max-w-sm">
              {sections.destinationCard1Text}
            </p>
          </div>
        </a>
        <a
          href="#"
          className="group md:col-span-2 relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-[16/10] md:aspect-auto shadow-soft max-h-[20rem] sm:max-h-none"
        >
          <img
            src="/port-gentil11.webp"
            alt="Port-Gentil"
            width={1024}
            height={768}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
              {sections.destinationCard2Label}
            </span>
            <h3 className="font-display text-2xl font-bold mt-2">
              {sections.destinationCard2Title}
            </h3>
          </div>
        </a>
        <a
          href="#"
          className="group md:col-span-2 relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-[16/10] shadow-soft max-h-[20rem] sm:max-h-none"
        >
          <img
            src="/PLAteau.jpg"
            alt="Loango"
            width={1024}
            height={768}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
              {sections.destinationCard3Label}
            </span>
            <h3 className="font-display text-2xl font-bold mt-2">
              {sections.destinationCard3Title}
            </h3>
          </div>
        </a>
        <a
          href="#"
          className="group md:col-span-4 relative overflow-hidden rounded-3xl aspect-[16/10] shadow-soft max-h-[26rem] sm:max-h-none"
        >
          <img
            src="/tortue.jpg"
            alt="Pointe Denis"
            width={1200}
            height={750}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <span className="text-gold text-[10px] uppercase tracking-widest font-bold">
              {sections.destinationCard4Label}
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold mt-2">
              {sections.destinationCard4Title}
            </h3>
            <p className="text-white/80 font-light mt-2 max-w-sm">
              {sections.destinationCard4Text}
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
