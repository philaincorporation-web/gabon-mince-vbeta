import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-8 mb-10">
        <div className="max-w-xl">
          <span className="text-sun-deep font-bold tracking-[0.22em] text-xs uppercase">
            {sections.venuesLabel}
          </span>
          <h2
            className={`font-display text-3xl sm:text-4xl font-extrabold mt-3 leading-tight ${isDark ? "text-white" : "text-forest-deep"}`}
          >
            {sections.venuesTitle}
          </h2>
        </div>
        <Link
          to="/lieux"
          className={`font-semibold flex items-center gap-2 group text-sm ${isDark ? "text-slate-200" : "text-forest-deep"}`}
        >
          {sections.venuesLink}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-forest/20 transition-colors group-hover:bg-sun group-hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {venues.map((v) => (
          <article key={v.title} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-[1.75rem] mb-5 shadow-soft bg-slate-100 max-h-[24rem] md:max-h-none">
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
            <h3 className="font-display text-xl font-extrabold mb-2 group-hover:text-sun-deep transition-colors">
              {v.title}
            </h3>
            <p className={`font-light leading-relaxed ${mutedTextClass}`}>{v.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
