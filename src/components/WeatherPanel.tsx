import { useEffect, useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { GridLoader } from "react-spinners";
import {
  fetchDestinationWeather,
  weatherKind,
  weatherLabels,
  type DestinationWeather,
  type WeatherKind,
} from "@/lib/weather";

const icons: Record<WeatherKind, LucideIcon> = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  storm: CloudLightning,
};

type Language = "fr" | "en";

/** Bloc météo (conditions actuelles + 5 jours), chargé à l'ouverture de la fiche. */
export function WeatherPanel({
  coords,
  place,
  language,
}: {
  coords: [number, number];
  place: string;
  language: Language;
}) {
  const [weather, setWeather] = useState<DestinationWeather | null>(null);
  const [failed, setFailed] = useState(false);
  const t = (fr: string, en: string) => (language === "fr" ? fr : en);

  useEffect(() => {
    const controller = new AbortController();
    setWeather(null);
    setFailed(false);
    fetchDestinationWeather(coords, controller.signal)
      .then(setWeather)
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [coords]);

  if (failed) {
    return (
      <p className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-ink/60 dark:bg-slate-800 dark:text-slate-400">
        {t("Météo momentanément indisponible.", "Weather temporarily unavailable.")}
      </p>
    );
  }

  if (!weather) {
    return (
      <div className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-ink/60 dark:bg-slate-800 dark:text-slate-400">
        <GridLoader color="#36d7b7" size={6} margin={1} aria-hidden />
        {t("Chargement de la météo…", "Loading weather…")}
      </div>
    );
  }

  const kind = weatherKind(weather.current.code);
  const CurrentIcon = icons[kind];
  const locale = language === "fr" ? "fr-FR" : "en-GB";

  return (
    <section
      aria-label={t(`Météo à ${place}`, `Weather in ${place}`)}
      className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-forest-deep dark:text-white">
          {t("Météo actuelle", "Current weather")}
        </h3>
        <span className="text-xs text-ink/50 dark:text-slate-400">Open-Meteo</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-3">
          <CurrentIcon className="h-10 w-10 text-sun-deep" />
          <div>
            <p className="font-display text-3xl font-extrabold text-forest-deep dark:text-white">
              {Math.round(weather.current.temperature)}°C
            </p>
            <p className="text-sm text-ink/70 dark:text-slate-300">{weatherLabels[kind][language]}</p>
          </div>
        </div>
        <ul className="grid gap-1 text-sm text-ink/70 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 shrink-0" />
            {t("Ressenti", "Feels like")} {Math.round(weather.current.feelsLike)}°C
          </li>
          <li className="flex items-center gap-2">
            <Droplets className="h-4 w-4 shrink-0" />
            {t("Humidité", "Humidity")} {Math.round(weather.current.humidity)} %
          </li>
          <li className="flex items-center gap-2">
            <Wind className="h-4 w-4 shrink-0" />
            {t("Vent", "Wind")} {Math.round(weather.current.wind)} km/h
          </li>
        </ul>
      </div>

      <ol className="mt-5 grid grid-cols-5 gap-1.5 sm:gap-2">
        {weather.daily.map((day, i) => {
          const DayIcon = icons[weatherKind(day.code)];
          return (
            <li
              key={day.date.toISOString()}
              className="flex min-w-0 flex-col items-center rounded-xl bg-white/80 px-1 py-2 text-center dark:bg-slate-800/80"
            >
              <span className="text-[11px] font-semibold capitalize text-ink/70 dark:text-slate-300">
                {i === 0
                  ? t("Auj.", "Today")
                  : day.date.toLocaleDateString(locale, { weekday: "short", timeZone: "UTC" })}
              </span>
              <DayIcon
                className="my-1 h-5 w-5 text-sun-deep"
                aria-label={weatherLabels[weatherKind(day.code)][language]}
              />
              <span className="text-xs font-bold text-forest-deep dark:text-white">
                {Math.round(day.max)}°
              </span>
              <span className="text-[11px] text-ink/50 dark:text-slate-400">{Math.round(day.min)}°</span>
              <span className="mt-0.5 flex items-center gap-0.5 text-[10px] text-sky-700 dark:text-sky-300">
                <Umbrella className="h-3 w-3" />
                {Math.round(day.rainChance)}%
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
