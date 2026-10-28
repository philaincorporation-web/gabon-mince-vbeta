import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LayoutGrid, MapPin, Search, Users } from "lucide-react";
import { heroSlidesFr, heroSlidesEn } from "@/lib/home-data";
import { categoryMeta, categoryOrder, cities, type ListingCategory } from "@/lib/mice-data";

interface HeroSectionProps {
  language: "fr" | "en";
  theme: "light" | "dark";
}

export function HeroSection({ language, theme }: HeroSectionProps) {
  const [slide, setSlide] = useState(0);
  const isFrench = language === "fr";
  const isDark = theme === "dark";
  const heroSlides = isFrench ? heroSlidesFr : heroSlidesEn;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const cat = String(form.get("cat") ?? "") as ListingCategory | "";
    const ville = String(form.get("ville") ?? "");
    const participants = Number(form.get("participants"));
    navigate({
      to: "/explorer",
      search: {
        cat: cat || undefined,
        ville: ville || undefined,
        participants: participants > 0 ? participants : undefined,
      },
    });
  }

  const field = `w-full bg-transparent text-sm outline-none [&>option]:text-ink ${isDark ? "text-white" : "text-ink"}`;

  return (
    <section className="px-3 pt-3 sm:px-5">
      <div className="relative isolate overflow-hidden rounded-[2rem] sm:rounded-[2.75rem]">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 -z-20 transition-opacity duration-[1600ms] ease-out ${i === slide ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={s.image}
              alt={s.title}
              className={`h-full w-full object-cover ${i === slide ? "animate-ken-burns" : ""}`}
              {...(i === 0 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })}
            />
          </div>
        ))}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink/60 to-transparent" />

        <div className="mx-auto flex min-h-[640px] max-w-7xl flex-col justify-center px-5 pb-36 pt-16 sm:min-h-[720px] sm:px-10 lg:pb-40">
          <p
            key={`eyebrow-${slide}`}
            className="animate-reveal text-xs font-bold uppercase tracking-[0.3em] text-sun"
          >
            {heroSlides[slide].eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[2.1rem] font-extrabold min-[400px]:text-[2.6rem] leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            {isFrench ? "Découvrez le Gabon." : "Discover Gabon."}
            <br />
            <span className="brush-underline">
              {isFrench ? "Réunissez‑vous autrement." : "Meet differently."}
            </span>
          </h1>
          <p
            key={`sub-${slide}`}
            className="animate-reveal mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg"
          >
            {heroSlides[slide].subtitle}{" "}
            {isFrench
              ? "Salles, hébergements, offres et prestataires labellisés réunis sur un seul outil."
              : "Venues, accommodation, offers and labelled providers in a single tool."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/offres"
              className="inline-flex items-center gap-2 rounded-full bg-sun px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sun/30 transition hover:bg-sun-deep"
            >
              {isFrench ? "Voir les offres spéciales" : "See special offers"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/organisateur"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-ink"
            >
              {isFrench ? "Organiser un événement" : "Plan an event"}
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 hidden gap-2 sm:flex">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? "w-10 bg-sun" : "w-4 bg-white/50 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>

      {/* Barre de recherche flottante */}
      <form
        onSubmit={handleSearch}
        className={`relative z-10 mx-auto -mt-20 grid max-w-5xl gap-1 rounded-[1.75rem] p-2 shadow-float sm:-mt-14 md:grid-cols-[1.2fr_1fr_0.8fr_auto] md:items-center ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
      >
        <SearchField
          icon={<LayoutGrid className="h-5 w-5" />}
          label={isFrench ? "Que recherchez-vous ?" : "What are you looking for?"}
        >
          <select name="cat" className={field} defaultValue="">
            <option value="">{isFrench ? "Tout le catalogue" : "Whole catalogue"}</option>
            {categoryOrder.map((c) => (
              <option key={c} value={c}>
                {categoryMeta[c].plural[language]}
              </option>
            ))}
          </select>
        </SearchField>
        <SearchField
          icon={<MapPin className="h-5 w-5" />}
          label={isFrench ? "Où ?" : "Where?"}
          divider
        >
          <select name="ville" className={field} defaultValue="">
            <option value="">{isFrench ? "Tout le Gabon" : "All of Gabon"}</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </SearchField>
        <SearchField
          icon={<Users className="h-5 w-5" />}
          label={isFrench ? "Participants" : "Attendees"}
          divider
        >
          <input
            name="participants"
            type="number"
            min={1}
            placeholder={isFrench ? "Ex. 50" : "e.g. 50"}
            className={`${field} placeholder:text-ink/40`}
          />
        </SearchField>
        <button
          type="submit"
          className="m-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-forest-deep px-7 py-4 text-sm font-semibold text-white transition hover:bg-sun"
        >
          {isFrench ? "Rechercher" : "Search"}
          <Search className="h-4 w-4" />
        </button>
      </form>
    </section>
  );
}

function SearchField({
  icon,
  label,
  divider = false,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  divider?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${divider ? "md:border-l md:border-black/5 md:rounded-none dark:md:border-slate-800" : ""}`}
    >
      <span className="text-forest dark:text-sun">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-ink dark:text-white">{label}</span>
        {children}
      </span>
    </label>
  );
}
