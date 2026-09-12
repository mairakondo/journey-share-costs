import { useQuery } from "@tanstack/react-query";

export type DestinationPhoto = { src: string; alt: string };

type WikiPage = { index?: number; title: string; thumbnail?: { source: string } };

// Real, geographically-correct photos of the trip's own destination via
// Wikipedia's search — its ranking disambiguates well (e.g. "Maui" the
// island vs. the mythological figure), and most place articles carry an
// infobox photo. Falls back to null (caller shows a local placeholder)
// when offline, the destination has no matching article, or its article
// has no image.
async function fetchDestinationPhoto(keyword: string): Promise<DestinationPhoto | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: keyword,
    gsrlimit: "3",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "960",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {}) as WikiPage[];
  const best = pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).find((p) => p.thumbnail);
  if (!best?.thumbnail) return null;
  return { src: best.thumbnail.source, alt: `${best.title}, via Wikipedia` };
}

function keywordFor(destination: string | null, name: string): string {
  return destination?.split(",")[0]?.trim() || name;
}

export function useDestinationPhoto(trip: { destination: string | null; name: string }) {
  const keyword = keywordFor(trip.destination, trip.name);
  return useQuery({
    queryKey: ["destination-photo", keyword],
    queryFn: () => fetchDestinationPhoto(keyword),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });
}
