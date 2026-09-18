import { useQuery } from "@tanstack/react-query";

import { hashToIndex } from "@/lib/trip-utils";

export type DestinationPhoto = { src: string; alt: string };

// A place article's infobox image, or a stray Commons file, is sometimes a
// satellite photo, locator map, flag, or coat of arms rather than a
// recognizable scenic photo (e.g. Wikipedia's "Maui" article uses a Landsat
// satellite image) — skip those.
const NON_PHOTO_PATTERN =
  /landsat|satellite|\bmap\b|locator|topographic|relief|flag_of|coat_of_arms|seal_of|emblem_of|logo|\bicon\b|\bchart\b|\bgraph\b|orthographic|portrait|press_conference|official_visit|state_visit|meets_|award_ceremony|funeral|inauguration|swearing_in|state_funeral/i;

type CommonsImageInfo = { width: number; height: number; thumburl: string };
type CommonsPage = { title: string; imageinfo?: CommonsImageInfo[] };

// Wikimedia Commons' own "Category:<Place>" usually holds dozens of real
// photos of the place itself (beaches, streets, landmarks) — a much richer,
// more recognizable pool than a single Wikipedia infobox image. Picks a
// landscape-oriented one deterministically (by trip id) so the same trip
// always shows the same photo.
async function fetchFromCommonsCategory(
  place: string,
  tripId: string,
): Promise<DestinationPhoto | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "categorymembers",
    gcmtitle: `Category:${place}`,
    gcmtype: "file",
    gcmlimit: "40",
    prop: "imageinfo",
    iiprop: "url|size",
    iiurlwidth: "960",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {}) as CommonsPage[];
  const candidates = pages
    .map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
    .filter(
      (p): p is { title: string; info: CommonsImageInfo } =>
        // Wide, high-resolution images tend to be deliberate scenic/landmark
        // photography (drone shots, tourism photos); small or portrait-ish
        // ones are more often incidental snapshots (a person, a plant, a
        // receipt) that happen to be filed under the place's category.
        !!p.info &&
        p.info.width >= 1600 &&
        p.info.width / p.info.height >= 1.3 &&
        !NON_PHOTO_PATTERN.test(p.title),
    )
    .sort((a, b) => b.info.width * b.info.height - a.info.width * a.info.height);
  if (candidates.length === 0) return null;
  // Pick among the largest few, so the choice isn't the exact same single
  // photo for every trip to the same place, but stays high-quality.
  const pool = candidates.slice(0, 5);
  const pick = pool[hashToIndex(tripId, pool.length)]!;
  return { src: pick.info.thumburl, alt: `${place}, via Wikimedia Commons` };
}

type WikiDirectPage = { title: string; thumbnail?: { source: string } };

// The place's own Wikipedia article (exact title, not a search) usually has
// a single carefully curated infobox photo — e.g. Tokyo's is a genuine
// skyline shot. Tried before the Commons category scan because that scan
// pulls in anything loosely filed under the category, including unrelated
// portraits and event photos that happen to pass the size/aspect filters.
async function fetchFromWikipediaTitle(place: string): Promise<DestinationPhoto | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: place,
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: "960",
    redirects: "1",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {}) as WikiDirectPage[];
  const page = pages.find((p) => p.thumbnail);
  if (!page?.thumbnail || NON_PHOTO_PATTERN.test(page.thumbnail.source)) return null;
  return { src: page.thumbnail.source, alt: `${page.title}, via Wikipedia` };
}

type WikiPage = { index?: number; title: string; thumbnail?: { source: string } };

// Fallback when the place has no useful Commons category: Wikipedia's
// search-based article thumbnail (its ranking disambiguates well, e.g.
// "Maui" the island vs. the mythological figure).
async function fetchFromWikipediaSearch(keyword: string): Promise<DestinationPhoto | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: keyword,
    gsrlimit: "6",
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
  const ranked = pages
    .filter((p): p is WikiPage & { thumbnail: { source: string } } => !!p.thumbnail)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  const best = ranked.find((p) => !NON_PHOTO_PATTERN.test(p.thumbnail.source));
  if (!best) return null;
  return { src: best.thumbnail.source, alt: `${best.title}, via Wikipedia` };
}

function keywordFor(destination: string | null, name: string): string {
  return destination?.split(",")[0]?.trim() || name;
}

export function useDestinationPhoto(trip: {
  id: string;
  destination: string | null;
  name: string;
}) {
  const keyword = keywordFor(trip.destination, trip.name);
  return useQuery({
    queryKey: ["destination-photo", keyword, trip.id],
    queryFn: async () =>
      (await fetchFromWikipediaTitle(keyword)) ??
      (await fetchFromCommonsCategory(keyword, trip.id)) ??
      (await fetchFromWikipediaSearch(keyword)),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });
}
