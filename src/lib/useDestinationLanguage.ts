import { useQuery } from "@tanstack/react-query";

import { geocodeDestinationWithCountry } from "@/lib/geocode";
import { languageForCountry, type Language } from "@/lib/language";

async function fetchDestinationLanguage(destination: string): Promise<Language> {
  const place = await geocodeDestinationWithCountry(destination);
  return languageForCountry(place?.countryCode ?? null);
}

export function useDestinationLanguage(trip: { destination: string | null }) {
  const { destination } = trip;
  return useQuery({
    queryKey: ["trip-language", destination],
    queryFn: () => fetchDestinationLanguage(destination!),
    enabled: !!destination,
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });
}
