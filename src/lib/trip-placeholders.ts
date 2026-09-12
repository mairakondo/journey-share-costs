import copenhagen from "@/assets/copenhagen.jpg";
import kyoto from "@/assets/kyoto.jpg";
import lisbon from "@/assets/lisbon.jpg";
import tokyo from "@/assets/tokyo.jpg";
import { hashToIndex } from "@/lib/trip-utils";

// Instant, offline-safe fallback shown while useDestinationPhoto (or its
// failure) resolves — the same trip always gets the same image here too.
const PLACEHOLDERS = [
  { src: tokyo, alt: "Neon-lit city street at golden hour" },
  { src: copenhagen, alt: "Colorful harbor houses" },
  { src: lisbon, alt: "Sunny coastal waterfront" },
  { src: kyoto, alt: "Cherry blossoms along a quiet lane" },
];

export function placeholderFor(tripId: string) {
  return PLACEHOLDERS[hashToIndex(tripId, PLACEHOLDERS.length)]!;
}
