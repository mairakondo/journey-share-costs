export type Coords = { lat: number; lon: number };

// Open-Meteo's geocoding endpoint — free, keyless, CORS-open. Used by every
// destination-aware feature (weather, restrooms, hospitals, translator
// language) to resolve the trip's free-text destination to coordinates.
export async function geocodeDestination(destination: string): Promise<Coords | null> {
  const place = destination.split(",")[0]?.trim() || destination;
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`,
  );
  if (!res.ok) return null;
  const data = await res.json();
  const hit = data.results?.[0];
  if (!hit) return null;
  return { lat: hit.latitude, lon: hit.longitude };
}

// Also returns the resolved country name/code, for features (language,
// emergency numbers) that key off the destination's country rather than
// its exact coordinates.
export async function geocodeDestinationWithCountry(
  destination: string,
): Promise<(Coords & { country: string | null; countryCode: string | null }) | null> {
  const place = destination.split(",")[0]?.trim() || destination;
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`,
  );
  if (!res.ok) return null;
  const data = await res.json();
  const hit = data.results?.[0];
  if (!hit) return null;
  return {
    lat: hit.latitude,
    lon: hit.longitude,
    country: hit.country ?? null,
    countryCode: hit.country_code ?? null,
  };
}

const EARTH_RADIUS_KM = 6371;

export function distanceKm(a: Coords, b: Coords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
