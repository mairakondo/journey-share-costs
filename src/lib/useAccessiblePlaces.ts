import { useQuery } from "@tanstack/react-query";

import { geocodeDestination, type Coords } from "@/lib/geocode";
import { findNearby, type OverpassPlace } from "@/lib/overpass";

export type AccessiblePlace = OverpassPlace & {
  category: "transit" | "place";
  typeLabel: string;
};

export type AccessiblePlaces = {
  places: AccessiblePlace[];
  usedDeviceLocation: boolean;
  // True when the Overpass lookup itself failed (timeout, rate limit, bad
  // gateway — the free service is flaky), as opposed to it succeeding with
  // zero results. Lets the UI say "temporarily unavailable" instead of
  // wrongly implying nothing is mapped nearby, without treating a flaky
  // third-party service outage as a hard app error.
  unavailable: boolean;
};

const RADIUS_M = 3000;

const TYPE_TAGS = [
  "railway",
  "public_transport",
  "highway",
  "amenity",
  "tourism",
  "leisure",
  "shop",
] as const;

function humanize(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function classify(tags: Record<string, string>): {
  category: "transit" | "place";
  typeLabel: string;
} {
  const isTransit =
    !!tags["railway"] ||
    !!tags["public_transport"] ||
    tags["highway"] === "bus_stop" ||
    tags["amenity"] === "bus_station";
  for (const key of TYPE_TAGS) {
    const value = tags[key];
    if (value) return { category: isTransit ? "transit" : "place", typeLabel: humanize(value) };
  }
  return { category: isTransit ? "transit" : "place", typeLabel: "Place" };
}

function getCurrentPosition(timeoutMs = 6000): Promise<Coords | null> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: timeoutMs, maximumAge: 5 * 60 * 1000 },
    );
  });
}

// Real-world wheelchair-accessibility coverage in OpenStreetMap is sparse
// and inconsistent — this is "best effort": it surfaces whatever nearby
// nodes/ways are explicitly tagged wheelchair=yes, nothing more.
async function fetchAccessiblePlaces(destination: string): Promise<AccessiblePlaces> {
  const deviceLocation = await getCurrentPosition();
  const center = deviceLocation ?? (await geocodeDestination(destination));
  if (!center) return { places: [], usedDeviceLocation: false, unavailable: false };

  const found = await findNearby(center, 'wheelchair=yes]["name"', RADIUS_M, 15).catch(() => null);
  if (found === null) {
    return { places: [], usedDeviceLocation: !!deviceLocation, unavailable: true };
  }
  const places = found.map((p) => ({ ...p, ...classify(p.tags) }));
  return { places, usedDeviceLocation: !!deviceLocation, unavailable: false };
}

export function useAccessiblePlaces(trip: { destination: string | null }) {
  const { destination } = trip;
  return useQuery({
    queryKey: ["accessible-places", destination],
    queryFn: () => fetchAccessiblePlaces(destination!),
    enabled: !!destination,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
