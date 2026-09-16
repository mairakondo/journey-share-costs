import { useQuery } from "@tanstack/react-query";

import { geocodeDestination, type Coords } from "@/lib/geocode";
import { findNearby, type OverpassPlace } from "@/lib/overpass";

export type Restroom = OverpassPlace & {
  wheelchair: "yes" | "limited" | "no" | "unknown";
  babyChange: boolean;
  fee: boolean;
};

export type NearbyRestrooms = {
  restrooms: Restroom[];
  center: Coords;
  usedDeviceLocation: boolean;
  // True when the Overpass lookup itself failed (timeout, rate limit, bad
  // gateway — the free service is flaky), as opposed to it succeeding with
  // zero results. Lets the UI say "temporarily unavailable" instead of
  // wrongly implying nothing is mapped nearby, without treating a flaky
  // third-party service outage as a hard app error.
  unavailable: boolean;
};

const RADIUS_M = 2000;

function wheelchairStatus(value: string | undefined): Restroom["wheelchair"] {
  if (value === "yes" || value === "limited" || value === "no") return value;
  return "unknown";
}

// Prefers the device's real GPS position (most relevant to "find a restroom
// right now"); falls back to the trip destination's geocoded coordinates if
// location access is denied, unavailable, or times out.
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

async function fetchRestrooms(destination: string): Promise<NearbyRestrooms> {
  const deviceLocation = await getCurrentPosition();
  const center = deviceLocation ?? (await geocodeDestination(destination));
  if (!center) {
    return {
      restrooms: [],
      center: { lat: 0, lon: 0 },
      usedDeviceLocation: false,
      unavailable: false,
    };
  }

  const places = await findNearby(center, "amenity=toilets", RADIUS_M, 12).catch(() => null);
  if (places === null) {
    return { restrooms: [], center, usedDeviceLocation: !!deviceLocation, unavailable: true };
  }
  const restrooms = places.map((p) => ({
    ...p,
    wheelchair: wheelchairStatus(p.tags["wheelchair"]),
    babyChange: p.tags["changing_table"] === "yes",
    fee: p.tags["fee"] === "yes",
  }));
  return { restrooms, center, usedDeviceLocation: !!deviceLocation, unavailable: false };
}

export function useNearbyRestrooms(trip: { destination: string | null }) {
  const { destination } = trip;
  return useQuery({
    queryKey: ["nearby-restrooms", destination],
    queryFn: () => fetchRestrooms(destination!),
    enabled: !!destination,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
