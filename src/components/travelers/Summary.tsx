import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Image, MapPin, WalletCards } from "lucide-react";

import type { TripMember } from "@/features/trips/tripsServerFns";
import { currencyForDestination, formatMoney } from "@/lib/currency";
import { placeholderFor } from "@/lib/trip-placeholders";
import type { Expense, Photo, Stop, Trip } from "@/lib/types";
import {
  avatarTone,
  classifyTrip,
  computeBalances,
  formatDateRange,
  initialsFor,
} from "@/lib/trip-utils";
import { useDestinationPhoto } from "@/lib/useDestinationPhoto";

export function Summary({
  trip,
  members,
  currentUserId,
  stops,
  expenses,
  photos,
}: {
  trip: Trip;
  members: TripMember[];
  currentUserId: string | null;
  stops: Stop[];
  expenses: Expense[];
  photos: Photo[];
}) {
  const destinationPhoto = useDestinationPhoto(trip);
  const image = destinationPhoto.data ?? placeholderFor(trip.id);
  const status = classifyTrip(trip);
  const currency = currencyForDestination(trip.destination);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const places = new Set(stops.map((s) => s.place)).size;
  const balances = computeBalances(expenses, currentUserId);
  const payerName = (userId: string) =>
    members.find((m) => m.userId === userId)?.displayName ?? "Someone";

  const dayNumbers = Array.from(
    new Set([
      ...stops.map((s) => s.day),
      ...expenses.map((e) => e.day),
      ...photos.map((p) => p.day),
    ]),
  ).sort((a, b) => a - b);
  const dayRecaps = dayNumbers.map((day) => {
    const dayStops = stops
      .filter((s) => s.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
    const daySpend = expenses.filter((e) => e.day === day).reduce((s, e) => s + e.amount, 0);
    const dayPhotoCount = photos.filter((p) => p.day === day).length;
    return {
      day,
      title: dayStops[0]?.title ?? "Free day",
      detail: `${dayStops.length} stop${dayStops.length === 1 ? "" : "s"} · ${formatMoney(daySpend, currency)} spent · ${dayPhotoCount} photo${dayPhotoCount === 1 ? "" : "s"}`,
    };
  });

  const daySpends = dayNumbers.map((day) => ({
    day,
    amount: expenses.filter((e) => e.day === day).reduce((s, e) => s + e.amount, 0),
  }));
  const maxDaySpend = Math.max(1, ...daySpends.map((d) => d.amount));
  const spendByDay = daySpends
    .filter((d) => d.amount > 0)
    .map((d) => ({ ...d, pct: Math.round((d.amount / maxDaySpend) * 100) }));

  const highlightPhotos = photos.slice(0, 3);

  return (
    <>
      <section className="summary-wrap">
        <div className="summary-photo">
          <img src={image.src} alt={image.alt} width={1280} height={800} />
          <div>
            <span className="status-pill muted">
              {status === "past"
                ? "Trip complete"
                : status === "current"
                  ? "In progress"
                  : "Upcoming"}
            </span>
            <p>{formatDateRange(trip.start_date, trip.end_date)}</p>
            <h2>{trip.name}</h2>
          </div>
        </div>
        <div className="summary-content">
          <p className="eyebrow">{status === "past" ? "After trip" : "Trip so far"}</p>
          <h2>One for the books</h2>
          <div className="summary-stats">
            <article>
              <WalletCards />
              <strong>{formatMoney(total, currency)}</strong>
              <span>Total spent</span>
            </article>
            <article>
              <Image />
              <strong>{photos.length}</strong>
              <span>Photos shared</span>
            </article>
            <article>
              <MapPin />
              <strong>{places}</strong>
              <span>Places visited</span>
            </article>
          </div>
          <Link to="/" className="summary-back">
            <ArrowLeft size={17} /> Back to all trips
          </Link>
        </div>
      </section>
      <div className="recap">
        {dayRecaps.length > 0 && (
          <article className="recap-card">
            <p className="eyebrow">Where you went</p>
            <h3>Day-by-day recap</h3>
            <div className="recap-days">
              {dayRecaps.map((d) => (
                <article key={d.day}>
                  <b>D{d.day + 1}</b>
                  <div>
                    <h4>{d.title}</h4>
                    <p>{d.detail}</p>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-muted-foreground" />
                </article>
              ))}
            </div>
          </article>
        )}
        {spendByDay.length > 0 && (
          <article className="recap-card">
            <p className="eyebrow text-money-ink">{formatMoney(total, currency)} spent in total</p>
            <h3>Where the money went</h3>
            <div className="recap-spend">
              {spendByDay.map((s) => (
                <article key={s.day}>
                  <header>
                    <span>Day {s.day + 1}</span>
                    {formatMoney(s.amount, currency)}
                  </header>
                  <div className="recap-bar">
                    <span style={{ width: `${s.pct}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </article>
        )}
        <article className="recap-card">
          <p className="eyebrow">Who settled up</p>
          <h3>Final balances</h3>
          <div className="recap-people">
            {balances.length === 0 && (
              <p className="text-sm text-muted-foreground">No shared expenses yet.</p>
            )}
            {balances.map((b) => {
              const memberIndex = members.findIndex((m) => m.userId === b.userId);
              const name = payerName(b.userId);
              const text =
                b.net > 0 ? `${name} owes you` : b.net < 0 ? `You owe ${name}` : `${name} settled`;
              return (
                <article key={b.userId}>
                  <span className={avatarTone(Math.max(0, memberIndex))}>{initialsFor(name)}</span>
                  {text}
                  <strong>
                    {b.net === 0
                      ? formatMoney(0, currency)
                      : `${b.net > 0 ? "+" : "−"} ${formatMoney(Math.abs(b.net), currency)}`}
                  </strong>
                </article>
              );
            })}
          </div>
        </article>
        {highlightPhotos.length > 0 && (
          <article className="recap-card">
            <p className="eyebrow">{photos.length} shared memories</p>
            <h3>Photo highlights</h3>
            <div className="recap-photos">
              {highlightPhotos.map((p) => (
                <img
                  key={p.id}
                  src={p.src}
                  alt={`${p.place || trip.name} memory`}
                  width={640}
                  height={640}
                  loading="lazy"
                />
              ))}
            </div>
          </article>
        )}
      </div>
    </>
  );
}
