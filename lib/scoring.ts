import type { HourlyPoint } from "./types";

const DEFAULTS = {
  idealTemp: { min: 16, max: 30 },
  hotPenalty: 35,
  rainPenalty: 50, // percent
  aqiThreshold: 100,
  windThreshold: 12, // m/s
};

function tempScore(temp?: number) {
  if (temp == null) return 0;
  const { min, max } = DEFAULTS.idealTemp;
  if (temp < min) return Math.max(0, 50 - (min - temp) * 2);
  if (temp > max) return Math.max(0, 50 - (temp - max) * 3);
  return 100;
}

function rainScore(rp?: number) {
  if (rp == null) return 50;
  if (rp > DEFAULTS.rainPenalty) return 0;
  return Math.round(100 - (rp / DEFAULTS.rainPenalty) * 100);
}

function aqiScore(pm2_5?: number | null) {
  if (pm2_5 == null) return 50;
  if (pm2_5 > DEFAULTS.aqiThreshold) return 20;
  if (pm2_5 > 75) return 50;
  if (pm2_5 > 50) return 70;
  return 100;
}

function windScore(ws?: number) {
  if (ws == null) return 70;
  if (ws > DEFAULTS.windThreshold) return 30;
  return 100 - Math.round((ws / DEFAULTS.windThreshold) * 30);
}

export function scoreHourly(points: HourlyPoint[]) {
  return points.map((p) => {
    const reasons: string[] = [];
    const t = tempScore(p.temperature);
    if (p.temperature != null && p.temperature >= DEFAULTS.idealTemp.min && p.temperature <= DEFAULTS.idealTemp.max) {
      reasons.push("Pleasant temperature");
    } else if (p.temperature != null && p.temperature > DEFAULTS.idealTemp.max) {
      reasons.push("A bit warm");
    }

    const r = rainScore(p.precipitation_probability);
    if (p.precipitation_probability != null && p.precipitation_probability < 20) {
      reasons.push("Low chance of rain");
    } else if (p.precipitation_probability != null && p.precipitation_probability >= 50) {
      reasons.push("High rain chance");
    }

    const a = aqiScore(p.pm2_5 ?? null);
    if (p.pm2_5 != null && p.pm2_5 < 50) {
      reasons.push("Cleaner air quality");
    } else if (p.pm2_5 != null && p.pm2_5 >= 100) {
      reasons.push("Poor air quality");
    }

    const w = windScore(p.windspeed);
    if (p.windspeed != null && p.windspeed < 6) reasons.push("Comfortable wind");

    // Weighted aggregation
    const score = Math.round((t * 0.4 + r * 0.25 + a * 0.25 + w * 0.1) / 1);

    return { ...p, score, reasons };
  });
}

export function topSlots(points: HourlyPoint[], windowHours = 2, top = 3) {
  const scored = scoreHourly(points);
  // sliding window average
  const slots: { start: string; end: string; score: number }[] = [];
  for (let i = 0; i <= scored.length - windowHours; i++) {
    const slice = scored.slice(i, i + windowHours);
    const avg = Math.round(slice.reduce((s, p) => s + (p.score ?? 0), 0) / slice.length);
    slots.push({ start: slice[0].time, end: slice[slice.length - 1].time, score: avg });
  }
  slots.sort((a, b) => b.score - a.score);
  return slots.slice(0, top);
}
