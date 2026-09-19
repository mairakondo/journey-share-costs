import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";

import { members } from "@/lib/mock-data";
import type { Trip } from "@/lib/types";
import { classifyTrip, daysBetween, daysUntil, formatDateRange } from "@/lib/trip-utils";
import { placeholderFor } from "@/lib/trip-placeholders";
import { useDestinationPhoto } from "@/lib/useDestinationPhoto";

function TripCard({ trip, featured = false }: { trip: Trip; featured?: boolean }) {
  const status = classifyTrip(trip);
  const days = daysBetween(trip.start_date, trip.end_date);
  const pillText =
    status === "current"
      ? "Now in progress"
      : status === "upcoming"
        ? `In ${daysUntil(trip.start_date!)} days`
        : status === "past"
          ? "Completed"
          : "Dates TBD";
  const destinationPhoto = useDestinationPhoto(trip);
  const image = destinationPhoto.data ?? placeholderFor(trip.id);

  return (
    <Link
      to="/trips/$tripId"
      params={{ tripId: trip.id }}
      search={status === "past" ? { view: "summary" as const } : {}}
      className={featured ? "trip-card featured" : "trip-card compact-card"}
    >
      <img
        src={image.src}
        alt={image.alt}
        width={1280}
        height={800}
        loading={featured ? "eager" : "lazy"}
      />
      <div className={featured ? "trip-overlay" : "trip-overlay compact"}>
        <div className={status === "past" ? "status-pill muted" : "status-pill"}>
          {status !== "past" && <span />} {pillText}
        </div>
        {featured ? (
          <div>
            {trip.destination && <p className="eyebrow trip-country">{trip.destination}</p>}
            <h2>{trip.name}</h2>
            <p className="trip-dates">
              {formatDateRange(trip.start_date, trip.end_date)}
              {days ? ` · ${days} day${days === 1 ? "" : "s"}` : ""}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="avatar-stack">
                <span className={members[0]!.tone}>{members[0]!.initials}</span>
              </div>
              <span className="open-label">
                Open trip <ArrowRight size={17} />
              </span>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold">
              {formatDateRange(trip.start_date, trip.end_date)}
            </p>
            <h2>{trip.name}</h2>
            {trip.destination && <p className="mt-1 text-sm">{trip.destination}</p>}
          </div>
        )}
      </div>
    </Link>
  );
}

export function Dashboard({ trips, onCreate }: { trips: Trip[]; onCreate: () => void }) {
  const current = trips.filter((t) => classifyTrip(t) === "current");
  const hero = current[0];
  const overflowCurrent = current.slice(1);
  const upcoming = trips.filter((t) => {
    const status = classifyTrip(t);
    return status === "upcoming" || status === "undated";
  });
  const past = trips.filter((t) => classifyTrip(t) === "past");

  return (
    <div className="page-pad dashboard-page pb-28">
      <section className="hero-row dashboard-intro">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1 className="page-title">
            Your next story
            <br />
            starts here.
          </h1>
        </div>
        <button onClick={onCreate} className="primary-action">
          <Plus size={20} /> Create trip
        </button>
      </section>

      {hero && (
        <>
          <div className="section-label">
            <span className="section-dot live" /> Current trip
          </div>
          <section className="trip-grid home-trip-grid">
            <TripCard trip={hero} featured />
            <div className="home-side-stack">
              <div className="current-stats">
                <div>
                  <strong>{formatDateRange(hero.start_date, hero.end_date)}</strong>
                  <small>trip dates</small>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {(overflowCurrent.length > 0 || upcoming.length > 0) && (
        <>
          <div className="section-label">
            <span className="section-dot upcoming" /> Upcoming trips
          </div>
          <section className="trip-grid upcoming-grid">
            {[...overflowCurrent, ...upcoming].map((t) => (
              <TripCard key={t.id} trip={t} />
            ))}
          </section>
        </>
      )}

      {past.length > 0 && (
        <>
          <div className="section-label">
            <span className="section-dot past" /> Past trips
          </div>
          <section className="trip-grid past-grid">
            {past.map((t) => (
              <TripCard key={t.id} trip={t} />
            ))}
          </section>
        </>
      )}

      {trips.length === 0 && (
        <p className="empty-day mt-7">No trips yet. Tap “Create trip” to plan your first one.</p>
      )}
    </div>
  );
}
