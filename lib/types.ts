export type GeocodeResult = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
};

export type HourlyPoint = {
  time: string; // ISO/local string
  temperature?: number;
  precipitation_probability?: number;
  windspeed?: number;
  uv_index?: number;
  pm2_5?: number | null;
  score?: number;
  reasons?: string[];
};

export type Recommendation = {
  city: string;
  latitude: number;
  longitude: number;
  hourly: HourlyPoint[];
  bestSlots: { start: string; end: string; score: number }[];
};
