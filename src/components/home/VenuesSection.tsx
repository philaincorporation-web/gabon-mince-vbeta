import { venuesFr, venuesEn, homeCopyFr, homeCopyEn, type HomeSections } from "@/lib/home-data";

interface VenuesSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function VenuesSection({ language, theme }: VenuesSectionProps) {
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const copy = isFrench ? homeCopyFr : homeCopyEn;
  const venues = isFrench ? venuesFr : venuesEn;
  const sections = copy.sections as unknown as HomeSections;
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <section id="mice" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-8 mb-16">
        <div className="max-w-xl">
          <span className="text-forest font-bold tracking-[0.25em] text-xs uppercase">
            {sections.venuesLabel}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-5 text-slate-900 leading-[1.05]">
            {sections.venuesTitle}
          </h2>
        </div>
        <a
          href="#"
          className="text-ocean font-semibold flex items-center gap-2 group text-sm uppercase tracking-widest"
        >
          {sections.venuesLink}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {venues.map((v) => (
          <article key={v.title} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-[1.5rem] mb-6 shadow-soft bg-slate-100 max-h-[24rem] md:max-h-none">
              <img
                src={v.image}
                alt={v.title}
                width={800}
                height={1000}
                loading="lazy"
                className="aspect-[4/5] w-full h-full object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute top-5 left-5">
                <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-forest">
                  {v.location}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-forest transition-colors">
              {v.title}
            </h3>
            <p className={`font-light leading-relaxed ${mutedTextClass}`}>{v.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
