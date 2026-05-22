"use client";

import React, { useState } from "react";
import { geocode, fetchForecast } from "@/lib/api";
import { scoreHourly, topSlots } from "@/lib/scoring";
import type { HourlyPoint } from "@/lib/types";

function hourLabel(iso: string, tz?: string) {
  try {
    const d = new Date(iso);
    const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };
    if (tz) return new Intl.DateTimeFormat(undefined, { ...opts, timeZone: tz }).format(d);
    return d.toLocaleTimeString([], opts as any);
  } catch {
    return iso;
  }
}

export default function RecommendationClient() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hourly, setHourly] = useState<HourlyPoint[] | null>(null);
  const [best, setBest] = useState<{ start: string; end: string; score: number }[] | null>(null);
  const [resolvedCity, setResolvedCity] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string | undefined>(undefined);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    await doSearch(city);
  }

  async function doSearch(q: string) {
    setError(null);
    setHourly(null);
    setBest(null);
    setResolvedCity(null);

    const query = q.trim();
    if (!query) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      const geo = await geocode(query);
      if (!geo) throw new Error("City not found");
      setResolvedCity(`${geo.name}${geo.country ? ", " + geo.country : ""}`);

      const fc = await fetchForecast(geo.latitude, geo.longitude, geo.timezone || "auto");
      if (!fc) throw new Error("Unable to fetch forecast");

      setTimezone(fc.timezone);
      const scored = scoreHourly(fc.hourly as HourlyPoint[]);
      setHourly(scored);
      setBest(topSlots(scored, 2, 3));
    } catch (err: any) {
      if (err?.name === "AbortError") setError("Request timed out. API is slow.");
      else setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city (e.g. Lahore)"
          className="w-full rounded-lg border border-ink/10 px-4 py-2 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="mt-3 flex gap-2 text-xs text-ink-muted">
        <span>Try:</span>
        <button type="button" onClick={() => { setCity('Lahore'); doSearch('Lahore'); }} className="rounded-full border px-3 py-1">Lahore</button>
        <button type="button" onClick={() => { setCity('New York'); doSearch('New York'); }} className="rounded-full border px-3 py-1">New York</button>
        <button type="button" onClick={() => { setCity('Tokyo'); doSearch('Tokyo'); }} className="rounded-full border px-3 py-1">Tokyo</button>
        <button type="button" onClick={() => { setCity('São Paulo'); doSearch('São Paulo'); }} className="rounded-full border px-3 py-1">São Paulo</button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {resolvedCity && (
        <div className="mt-4 text-sm text-ink-muted">Results for {resolvedCity}</div>
      )}

      {best && best.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {best.map((s, i) => (
            <div key={i} className="rounded-lg border border-ink/10 bg-white/70 p-3">
              <div className="text-xs text-ink-muted">Slot</div>
              <div className="mt-1 text-lg font-semibold text-ink">
                {hourLabel(s.start, timezone)} — {hourLabel(s.end, timezone)}
              </div>
              <div className="mt-1 text-sm text-ink-muted">Score {s.score}</div>
              { /* show reasons for the start hour if available */ }
              <div className="mt-2 text-xs text-ink-muted">
                {hourly?.find((h) => h.time === s.start)?.reasons?.slice(0,2).join(' • ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {hourly && (
        <div className="mt-6">
          <div className="mb-2 text-sm text-ink-muted">Hourly score (first 24 hrs)</div>
          <div className="w-full overflow-hidden rounded-md bg-surface-alt/70 p-3">
            <svg viewBox="0 0 480 100" className="w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#29a08a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#29a08a" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              {hourly.slice(0, 24).map((h, i) => {
                const x = (i / 24) * 480;
                const w = 480 / 24 - 2;
                const height = Math.max(2, ((h.score ?? 0) / 100) * 80);
                return (
                  <g key={h.time}>
                    <rect
                      x={x + 1}
                      y={100 - height}
                      width={w}
                      height={height}
                      fill="url(#g1)"
                    />
                  </g>
                );
              })}
            </svg>

            <div className="mt-2 flex items-center gap-1 text-xs text-ink-muted">
              {hourly.slice(0, 24).map((h, i) => (
                <div key={h.time} className="w-[4%] text-center truncate">
                  {new Intl.DateTimeFormat(undefined, { hour: '2-digit', timeZone: timezone }).format(new Date(h.time))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {hourly.slice(0, 12).map((h) => (
              <div
                key={h.time}
                className="flex items-center justify-between rounded-md border border-ink/10 bg-white/70 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium text-ink">{hourLabel(h.time)}</div>
                  <div className="text-xs text-ink-muted">
                    {h.temperature != null ? `${Math.round(h.temperature)}°C` : "--"} • AQI{' '}
                    {h.pm2_5 == null ? "—" : Math.round(h.pm2_5)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-ink">{h.score ?? "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
