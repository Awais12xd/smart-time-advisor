import type { GeocodeResult, HourlyPoint } from "./types";
import { cacheGet, cacheSet } from "./cache";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

async function fetchWithTimeout(url: string, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(id);
  }
}

export async function geocode(city: string): Promise<GeocodeResult | null> {
  const q = city.trim();
  const key = `geocode:${q.toLowerCase()}`;
  const cached = cacheGet(key);
  if (cached) return cached as GeocodeResult;

  const url = `${GEOCODE_URL}?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
  const data = await fetchWithTimeout(url);
  if (!data || !data.results || data.results.length === 0) return null;
  const top = data.results[0];
  const result: GeocodeResult = {
    name: top.name,
    country: top.country,
    latitude: top.latitude,
    longitude: top.longitude,
    timezone: top.timezone,
  };
  cacheSet(key, result);
  return result;
}

export async function fetchForecast(
  lat: number,
  lon: number,
  timezone = "auto"
): Promise<{ hourly: HourlyPoint[]; timezone: string } | null> {
  const key = `forecast:${lat.toFixed(4)},${lon.toFixed(4)},${timezone}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "windspeed_10m",
      "uv_index",
      "pm2_5",
    ].join(","),
    timezone,
  });

  const url = `${FORECAST_URL}?${params.toString()}`;
  const data = await fetchWithTimeout(url);
  if (!data || !data.hourly) return null;

  const { hourly } = data;
  const times: string[] = hourly.time || [];
  const out: HourlyPoint[] = times.map((t, i) => ({
    time: t,
    temperature: hourly.temperature_2m?.[i],
    precipitation_probability: hourly.precipitation_probability?.[i],
    windspeed: hourly.windspeed_10m?.[i],
    uv_index: hourly.uv_index?.[i],
    pm2_5: hourly.pm2_5?.[i] ?? null,
  }));

  const result = { hourly: out, timezone: data.timezone || timezone };
  cacheSet(key, result);
  return result;
}
