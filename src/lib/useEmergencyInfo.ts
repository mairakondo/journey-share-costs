import { useQuery } from "@tanstack/react-query";

import { emergencyNumbersForCountry, type EmergencyNumbers } from "@/lib/emergencyNumbers";
import { geocodeDestinationWithCountry } from "@/lib/geocode";
import { findNearby, type OverpassPlace } from "@/lib/overpass";

export type EmergencyInfo = {
  numbers: EmergencyNumbers;
  country: string | null;
  hospital: OverpassPlace | null;
  police: OverpassPlace | null;
};

const SEARCH_RADIUS_M = 15_000;

async function fetchEmergencyInfo(destination: string): Promise<EmergencyInfo> {
  const place = await geocodeDestinationWithCountry(destination);
  if (!place) {
    return {
      numbers: emergencyNumbersForCountry(null),
      country: null,
      hospital: null,
      police: null,
    };
  }
  const numbers = emergencyNumbersForCountry(place.countryCode);
  const [hospitals, police] = await Promise.all([
    findNearby(place, "amenity=hospital", SEARCH_RADIUS_M, 1).catch(() => []),
    findNearby(place, "amenity=police", SEARCH_RADIUS_M, 1).catch(() => []),
  ]);
  return {
    numbers,
    country: place.country,
    hospital: hospitals[0] ?? null,
    police: police[0] ?? null,
  };
}

export function useEmergencyInfo(trip: { destination: string | null }) {
  const { destination } = trip;
  return useQuery({
    queryKey: ["trip-emergency", destination],
    queryFn: () => fetchEmergencyInfo(destination!),
    enabled: !!destination,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}
