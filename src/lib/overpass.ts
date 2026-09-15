import type { Coords } from "@/lib/geocode";
import { distanceKm } from "@/lib/geocode";

// Overpass (OpenStreetMap) is free and keyless but a shared, sometimes-slow
// public service — queries can 504 under load. Callers must treat failures
// as "no data available" rather than a bug, and may want to retry once.
const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
const OVERPASS_TIMEOUT_MS = 20_000;

export type OverpassPlace = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
  tags: Record<string, string>;
};

async function runOverpassQuery(query: string): Promise<OverpassPlace[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);
  try {
    const res = await fetch(OVERPASS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
    const data = await res.json();
    const elements: Array<{
      id: number;
      lat?: number;
      lon?: number;
      center?: { lat: number; lon: number };
      tags?: Record<string, string>;
    }> = data.elements ?? [];
    return elements
      .map((el) => {
        const lat = el.lat ?? el.center?.lat;
        const lon = el.lon ?? el.center?.lon;
        if (lat == null || lon == null) return null;
        return {
          id: el.id,
          name: el.tags?.["name"] ?? "Unnamed",
          lat,
          lon,
          distanceKm: 0,
          tags: el.tags ?? {},
        };
      })
      .filter((p): p is OverpassPlace => p !== null);
  } finally {
    clearTimeout(timeout);
  }
}

// Finds the nearest OSM node/way matching `filter` (an Overpass tag filter
// like `amenity=hospital`) within `radiusM` of `center`, sorted nearest-first.
export async function findNearby(
  center: Coords,
  filter: string,
  radiusM: number,
  limit = 5,
): Promise<OverpassPlace[]> {
  const query = `
    [out:json][timeout:15];
    (
      node[${filter}](around:${radiusM},${center.lat},${center.lon});
      way[${filter}](around:${radiusM},${center.lat},${center.lon});
    );
    out center ${limit * 3};
  `;
  const places = await runOverpassQuery(query);
  return places
    .map((p) => ({ ...p, distanceKm: distanceKm(center, { lat: p.lat, lon: p.lon }) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
