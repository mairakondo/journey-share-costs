import { useQuery } from "@tanstack/react-query";

import { geocodeDestination } from "@/lib/geocode";

export type DayWeather = { date: string; tempC: number; code: number };

const MS_DAY = 86_400_000;

function daysFromToday(dateStr: string): number {
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((new Date(`${dateStr}T00:00:00Z`).getTime() - todayUtc) / MS_DAY);
}

// Shifts a date back by whole years until it's safely in the past (archive
// data lags a few days behind real time), so a far-future trip gets a
// "typical weather for this time of year" estimate instead of no data.
function toArchiveSafeDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  while (daysFromToday(date.toISOString().slice(0, 10)) > -5) {
    date.setUTCFullYear(date.getUTCFullYear() - 1);
  }
  return date.toISOString().slice(0, 10);
}

async function fetchDaily(
  base: string,
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
): Promise<DayWeather[]> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: "weathercode,temperature_2m_max",
    timezone: "auto",
    start_date: startDate,
    end_date: endDate,
  });
  const res = await fetch(`${base}?${params}`);
  if (!res.ok) return [];
  const data = await res.json();
  const dates: string[] = data.daily?.time ?? [];
  const codes: number[] = data.daily?.weathercode ?? [];
  const temps: number[] = data.daily?.temperature_2m_max ?? [];
  return dates.map((date, i) => ({ date, tempC: temps[i] ?? 0, code: codes[i] ?? 0 }));
}

async function fetchTripWeather(
  destination: string,
  startDate: string,
  endDate: string,
): Promise<DayWeather[]> {
  const coords = await geocodeDestination(destination);
  if (!coords) return [];

  const useForecast = daysFromToday(endDate) <= 15 && daysFromToday(startDate) >= -5;
  if (useForecast) {
    return fetchDaily(
      "https://api.open-meteo.com/v1/forecast",
      coords.lat,
      coords.lon,
      startDate,
      endDate,
    );
  }

  const archiveStart = toArchiveSafeDate(startDate);
  const archiveEnd = toArchiveSafeDate(endDate);
  const archived = await fetchDaily(
    "https://archive-api.open-meteo.com/v1/archive",
    coords.lat,
    coords.lon,
    archiveStart,
    archiveEnd,
  );
  // Re-key the archived (shifted-year) results back onto the trip's real
  // dates, in order, so callers can look weather up by the actual trip day.
  const realDates: string[] = [];
  for (let d = new Date(`${startDate}T00:00:00Z`); ; d.setUTCDate(d.getUTCDate() + 1)) {
    realDates.push(d.toISOString().slice(0, 10));
    if (d.toISOString().slice(0, 10) === endDate) break;
  }
  return archived.map((day, i) => ({ ...day, date: realDates[i] ?? day.date }));
}

export function useTripWeather(trip: {
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
}) {
  const { destination, start_date: startDate, end_date: endDate } = trip;
  return useQuery({
    queryKey: ["trip-weather", destination, startDate, endDate],
    queryFn: () => fetchTripWeather(destination!, startDate!, endDate!),
    enabled: !!destination && !!startDate && !!endDate,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}
