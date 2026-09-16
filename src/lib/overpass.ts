import type { Coords } from "@/lib/geocode";
import { distanceKm } from "@/lib/geocode";

// Overpass (OpenStreetMap) is free and keyless but a shared, sometimes-slow
// public service — queries can 504, time out, or (worse) return a 200 with
// a non-JSON error body under load. Callers must treat failures as "no data
// available" rather than a bug. We try a couple of public mirrors in turn
// before giving up, since the main instance is the flakiest one.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const OVERPASS_TIMEOUT_MS = 15_000;

export type OverpassPlace = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
  tags: Record<string, string>;
};

async function runOverpassQueryAt(endpoint: string, query: string): Promise<OverpassPlace[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OVERPASS_TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Overpass returned ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("json")) {
      throw new Error(`Overpass returned non-JSON response (${contentType || "unknown type"})`);
    }
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

async function runOverpassQuery(query: string): Promise<OverpassPlace[]> {
  let lastError: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      return await runOverpassQueryAt(endpoint, query);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Overpass is unavailable right now.");
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
