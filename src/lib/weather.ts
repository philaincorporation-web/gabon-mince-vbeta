import { fetchWeatherApi } from "openmeteo";

/** Météo d'une destination via Open-Meteo (API gratuite, sans clé). */
export type DailyForecast = {
  date: Date;
  code: number;
  max: number;
  min: number;
  rainChance: number;
};

export type DestinationWeather = {
  current: { temperature: number; feelsLike: number; humidity: number; wind: number; code: number };
  daily: DailyForecast[];
};

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchDestinationWeather(
  [latitude, longitude]: [number, number],
  signal?: AbortSignal,
): Promise<DestinationWeather> {
  // L'ordre des variables détermine l'index lu dans la réponse ci-dessous.
  const [response] = await fetchWeatherApi(
    FORECAST_URL,
    {
      latitude,
      longitude,
      current: [
        "temperature_2m",
        "apparent_temperature",
        "relative_humidity_2m",
        "wind_speed_10m",
        "weather_code",
      ],
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
      ],
      timezone: "Africa/Libreville",
      forecast_days: 5,
    },
    2,
    0.2,
    2,
    { signal },
  );

  const current = response.current()!;
  const daily = response.daily()!;
  const offset = response.utcOffsetSeconds();
  const start = Number(daily.time());
  const interval = daily.interval();
  const values = (i: number) => Array.from(daily.variables(i)!.valuesArray()!);
  const [codes, max, min, rain] = [values(0), values(1), values(2), values(3)];

  return {
    current: {
      temperature: current.variables(0)!.value(),
      feelsLike: current.variables(1)!.value(),
      humidity: current.variables(2)!.value(),
      wind: current.variables(3)!.value(),
      code: current.variables(4)!.value(),
    },
    daily: codes.map((code, i) => ({
      date: new Date((start + i * interval + offset) * 1000),
      code,
      max: max[i],
      min: min[i],
      rainChance: rain[i],
    })),
  };
}

type Bi = { fr: string; en: string };

/** Codes météo WMO regroupés en grandes familles. */
export type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "storm";

export function weatherKind(code: number): WeatherKind {
  if (code === 0) return "clear";
  if (code <= 2) return "partly";
  if (code === 3) return "cloudy";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 82) return "rain";
  return "storm";
}

export const weatherLabels: Record<WeatherKind, Bi> = {
  clear: { fr: "Ensoleillé", en: "Sunny" },
  partly: { fr: "Éclaircies", en: "Partly cloudy" },
  cloudy: { fr: "Couvert", en: "Overcast" },
  fog: { fr: "Brouillard", en: "Fog" },
  drizzle: { fr: "Bruine", en: "Drizzle" },
  rain: { fr: "Averses", en: "Showers" },
  storm: { fr: "Orages", en: "Thunderstorms" },
};
