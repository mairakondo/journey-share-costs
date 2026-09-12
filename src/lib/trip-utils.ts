import { members } from "@/lib/mock-data";
import type { Expense, Photo, Split, SplitMode, Stop, Taggable, Trip } from "@/lib/types";

export const equalSplit = (names: string[] = members.map((m) => m.name)): Split => ({
  mode: "equal",
  participants: names,
  values: {},
});

export const normalizeSplit = (split?: Split | null): Split => ({
  mode: split?.mode ?? "equal",
  participants: split?.participants ?? members.map((m) => m.name),
  values: split?.values ?? {},
});

export function splitShares(rawSplit: Split | undefined, amount: number): Record<string, number> {
  const split = normalizeSplit(rawSplit);
  const people = split.participants;
  if (people.length === 0) return {};
  if (split.mode === "equal") {
    const each = amount / people.length;
    return Object.fromEntries(people.map((n) => [n, each]));
  }
  if (split.mode === "exact") {
    return Object.fromEntries(people.map((n) => [n, Math.max(0, Number(split.values[n] ?? 0))]));
  }
  const weights = people.map((n) => Math.max(0, Number(split.values[n] ?? 100 / people.length)));
  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return Object.fromEntries(people.map((n) => [n, 0]));
  return Object.fromEntries(people.map((n, i) => [n, (amount * weights[i]!) / total]));
}

export const splitLabel = (raw: Split | undefined) => {
  const split = normalizeSplit(raw);
  return `${split.participants.length} ${split.participants.length === 1 ? "traveler" : "travelers"} · ${split.mode === "equal" ? "equally" : split.mode === "exact" ? "exact amounts" : "by percentage"}`;
};

export const minutes = (t: string) => {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m ?? 0);
};

export const placeScore = (a: string, b: string) => {
  const norm = (v: string) =>
    v
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
  const wordsA = norm(a);
  const wordsB = new Set(norm(b));
  const hits = wordsA.filter((w) => wordsB.has(w)).length;
  return wordsA.length ? hits / wordsA.length : 0;
};

export function resolveStop(item: Taggable, stops: Stop[]): Stop | null {
  if (item.stopId) return stops.find((s) => s.id === item.stopId) ?? null;
  const sameDay = stops.filter((s) => s.day === item.day);
  let best: { stop: Stop; score: number } | null = null;
  for (const stop of sameDay) {
    const gap = Math.abs(minutes(item.time) - minutes(stop.time));
    if (gap > 120) continue;
    const score = placeScore(item.place, `${stop.place} ${stop.title}`) * 2 + (1 - gap / 120);
    if (!best || score > best.score) best = { stop, score };
  }
  return best && best.score > 0.6 ? best.stop : null;
}

export const euro = (n: number) => `¥${Math.round(n).toLocaleString("en-US")}`;

export function groupPhotosByStop(dayPhotos: Photo[], stops: Stop[]) {
  const groups: { stop: Stop | null; photos: Photo[] }[] = [];
  const push = (stop: Stop | null, photo: Photo) => {
    const key = stop?.id ?? null;
    const found = groups.find((g) => (g.stop?.id ?? null) === key);
    if (found) found.photos.push(photo);
    else groups.push({ stop, photos: [photo] });
  };
  for (const photo of dayPhotos) push(resolveStop(photo, stops), photo);
  return groups.sort((a, b) =>
    (a.stop ? a.stop.time : "99:99").localeCompare(b.stop ? b.stop.time : "99:99"),
  );
}

export type TripStatus = "current" | "upcoming" | "past" | "undated";

export function classifyTrip(trip: Trip, today: Date = new Date()): TripStatus {
  if (!trip.start_date || !trip.end_date) return "undated";
  const todayStr = today.toISOString().slice(0, 10);
  if (todayStr < trip.start_date) return "upcoming";
  if (todayStr > trip.end_date) return "past";
  return "current";
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate || !endDate) return "Dates TBD";
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const startMonth = MONTH_NAMES[start.getMonth()];
  const endMonth = MONTH_NAMES[end.getMonth()];
  if (startMonth === endMonth) return `${startMonth} ${start.getDate()}–${end.getDate()}`;
  return `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}`;
}

export function daysBetween(startDate: string | null, endDate: string | null): number | null {
  if (!startDate || !endDate) return null;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
}

export function daysUntil(startDate: string, today: Date = new Date()): number {
  const start = new Date(`${startDate}T00:00:00`);
  const todayMidnight = new Date(today.toISOString().slice(0, 10) + "T00:00:00");
  return Math.round((start.getTime() - todayMidnight.getTime()) / 86_400_000);
}

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type TripDay = {
  date: Date | null;
  label: string;
  weekdayFull: string;
  monthShort: string;
  dayOfMonth: number | null;
};

// Builds the Plan tab's day tabs from the trip's own dates instead of a
// fixed demo week. Undated trips fall back to plain "Day N" tabs.
export function tripDayList(
  startDate: string | null,
  endDate: string | null,
  fallbackDays = 5,
): TripDay[] {
  const count = daysBetween(startDate, endDate) ?? fallbackDays;
  const days: TripDay[] = [];
  for (let i = 0; i < count; i++) {
    if (!startDate) {
      days.push({
        date: null,
        label: `Day ${i + 1}`,
        weekdayFull: "",
        monthShort: "",
        dayOfMonth: null,
      });
      continue;
    }
    const date = new Date(`${startDate}T00:00:00`);
    date.setDate(date.getDate() + i);
    const weekdayShort = WEEKDAY_SHORT[date.getDay()]!;
    days.push({
      date,
      label: `${weekdayShort} ${date.getDate()}`,
      weekdayFull: WEEKDAY_FULL[date.getDay()]!,
      monthShort: MONTH_NAMES[date.getMonth()]!,
      dayOfMonth: date.getDate(),
    });
  }
  return days;
}

export function hashToIndex(value: string, modulo: number): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash % modulo;
}

export type Balance = { name: string; net: number; sharedCount: number };

// "Maira" is the payer name the app defaults new manual/scanned expenses to;
// "You" is the name used everywhere else (splits, avatars) for the same
// signed-in person. Balances are computed from the viewer's perspective, so
// both need to resolve to the same identity.
const VIEWER_NAMES = new Set(["You", "Maira"]);

export function computeBalances(expenses: Expense[]): Balance[] {
  const net: Record<string, number> = {};
  const sharedCount: Record<string, number> = {};

  for (const e of expenses) {
    const split = normalizeSplit(e.split);
    if (!split.participants.some((p) => VIEWER_NAMES.has(p))) continue;

    const shares = splitShares(e.split, e.amount);
    const viewerShare = split.participants
      .filter((p) => VIEWER_NAMES.has(p))
      .reduce((s, p) => s + (shares[p] ?? 0), 0);
    const payerIsViewer = VIEWER_NAMES.has(e.payer);

    for (const person of split.participants) {
      if (VIEWER_NAMES.has(person)) continue;
      if (payerIsViewer) {
        net[person] = (net[person] ?? 0) + (shares[person] ?? 0);
        sharedCount[person] = (sharedCount[person] ?? 0) + 1;
      } else if (person === e.payer) {
        net[person] = (net[person] ?? 0) - viewerShare;
        sharedCount[person] = (sharedCount[person] ?? 0) + 1;
      }
    }
  }

  return Object.keys(net)
    .map((name) => ({ name, net: Math.round(net[name]!), sharedCount: sharedCount[name] ?? 0 }))
    .sort((a, b) => b.net - a.net);
}

const AVATAR_TONES = [
  "bg-primary text-primary-foreground",
  "bg-sky text-sky-foreground",
  "bg-money text-money-foreground",
  "bg-sun text-sun-foreground",
];

export function avatarTone(index: number): string {
  return AVATAR_TONES[index % AVATAR_TONES.length]!;
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export type { SplitMode };
