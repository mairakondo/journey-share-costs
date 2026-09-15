import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CloudSun,
  Footprints,
  Image,
  MapPin,
  Pencil,
  Plus,
  ReceiptText,
  Trash2,
} from "lucide-react";

import { ExpenseEditor } from "@/components/travelers/ExpenseEditor";
import { IconButton } from "@/components/travelers/IconButton";
import { PhotoLightbox } from "@/components/travelers/PhotoLightbox";
import { StopEditor } from "@/components/travelers/StopEditor";
import type { Expense, Photo, Stop, Trip, View } from "@/lib/types";
import { currencyForDestination, formatMoney } from "@/lib/currency";
import { equalSplit, resolveStop, tripDayList } from "@/lib/trip-utils";
import { useTripWeather } from "@/lib/useTripWeather";
import { weatherCodeInfo } from "@/lib/weatherCodes";

export function Itinerary({
  trip,
  setView,
  stops,
  onSaveStop,
  onDeleteStop,
  tripLocked = false,
  tripLoading = false,
  photos,
  expenses,
  onSaveExpense,
  onDeleteExpense,
  newPhotoIds = [],
  dismissPhotos,
}: {
  trip: Trip;
  setView: (v: View) => void;
  stops: Stop[];
  onSaveStop: (stop: Stop) => void;
  onDeleteStop: (id: string) => void;
  tripLocked?: boolean;
  tripLoading?: boolean;
  photos: Photo[];
  expenses: Expense[];
  onSaveExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  newPhotoIds?: string[];
  dismissPhotos?: (ids: string[]) => void;
}) {
  const tripDays = tripDayList(trip.start_date, trip.end_date);
  const currency = currencyForDestination(trip.destination);
  const weatherQuery = useTripWeather(trip);
  const [day, setDay] = useState(0);
  const currentDayIso = tripDays[day]?.date?.toISOString().slice(0, 10) ?? null;
  const todayWeather = currentDayIso
    ? weatherQuery.data?.find((w) => w.date === currentDayIso)
    : undefined;
  const WeatherIcon = todayWeather ? weatherCodeInfo(todayWeather.code).Icon : CloudSun;
  const [editing, setEditing] = useState<Stop | null>(null);
  const [editingCost, setEditingCost] = useState<Expense | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [viewing, setViewing] = useState<Photo | null>(null);
  const [viewingPool, setViewingPool] = useState<Photo[]>([]);

  const dayStops = stops.filter((s) => s.day === day).sort((a, b) => a.time.localeCompare(b.time));
  const dayExpenses = expenses.filter((e) => e.day === day);
  const stopExpenses = (id: string) =>
    dayExpenses
      .filter((e) => resolveStop(e, stops)?.id === id)
      .sort((a, b) => a.time.localeCompare(b.time));
  const looseExpenses = dayExpenses
    .filter((e) => !resolveStop(e, stops))
    .sort((a, b) => a.time.localeCompare(b.time));

  const saveStop = (stop: Stop) => {
    onSaveStop(stop);
    setEditing(null);
  };
  const deleteStop = (id: string) => onDeleteStop(id);
  const saveExpense = (e: Expense) => {
    onSaveExpense(e);
    setEditingCost(null);
  };
  const deleteExpense = (id: string) => onDeleteExpense(id);
  const newExpense = (stop?: Stop): Expense => ({
    id: `e${Date.now()}`,
    day,
    time: stop?.time ?? "12:00",
    place: stop?.place ?? "",
    label: "",
    amount: 0,
    payer: "Maira",
    source: "manual",
    stopId: stop?.id ?? null,
    split: equalSplit(),
  });

  const costRow = (e: Expense) => (
    <button
      key={e.id}
      className="cost-chip"
      onClick={() => setEditingCost(e)}
      aria-label={`Edit cost ${e.label}`}
    >
      <ReceiptText size={14} />
      <span>
        <b>{e.label || "Untitled cost"}</b>
        <small>
          {e.time} · {e.payer}
          {e.source === "scan" ? " · receipt" : ""}
        </small>
      </span>
      <strong>{formatMoney(e.amount, currency)}</strong>
    </button>
  );

  if (tripLocked) {
    return (
      <div className="empty-day mt-7">
        <p className="mb-3">Sign in to plan this trip with your group.</p>
        <Link to="/sign-in" className="primary-action">
          Sign in
        </Link>
      </div>
    );
  }

  if (tripLoading) {
    return <p className="empty-day mt-7">Loading your itinerary…</p>;
  }

  return (
    <>
      <div className="day-strip">
        {tripDays.map((d, i) => (
          <button key={i} onClick={() => setDay(i)} className={day === i ? "active" : ""}>
            <span>Day {i + 1}</span>
            {d.label}
          </button>
        ))}
      </div>

      <div className="content-grid">
        <section>
          <div className="date-heading">
            <div>
              <div className="weather -mt-2">
                <WeatherIcon size={23} />
                <span>{todayWeather ? `${Math.round(todayWeather.tempC)}°` : "—"}</span>
              </div>
              <p className="eyebrow">{tripDays[day]?.weekdayFull || `Day ${day + 1}`}</p>
              <div className="day-title-row mt-2">
                <h2>
                  {tripDays[day]?.date
                    ? `${tripDays[day]!.monthShort} ${tripDays[day]!.dayOfMonth}`
                    : `Day ${day + 1}`}
                </h2>
              </div>
            </div>
            <div className="add-menu-wrap">
              <button
                className="scan-chip"
                aria-haspopup="menu"
                aria-expanded={addOpen}
                onClick={() => setAddOpen((o) => !o)}
              >
                <Plus size={16} /> Add
              </button>
              {addOpen && (
                <div className="add-menu" role="menu">
                  <button
                    role="menuitem"
                    onClick={() => {
                      setAddOpen(false);
                      setEditing({
                        id: `s${Date.now()}`,
                        day,
                        time: "10:00",
                        title: "",
                        place: "",
                        tag: "Explore",
                      });
                    }}
                  >
                    <MapPin size={16} />
                    <span>
                      Activity<small>Plan a stop for this day</small>
                    </span>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setAddOpen(false);
                      setEditingCost(newExpense());
                    }}
                  >
                    <ReceiptText size={16} />
                    <span>
                      Cost<small>Scan a receipt or enter it manually</small>
                    </span>
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setAddOpen(false);
                      setView("photos");
                    }}
                  >
                    <Image size={16} />
                    <span>
                      Photos<small>Add memories to the timeline</small>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="timeline">
            {dayStops.map((stop) => {
              const matchedPhotos = photos.filter((p) => resolveStop(p, stops)?.id === stop.id);
              const freshPhotos = matchedPhotos.filter((p) => newPhotoIds.includes(p.id));
              const cover = freshPhotos[0] ?? matchedPhotos[0];
              const matchedExpenses = stopExpenses(stop.id);
              return (
                <article
                  className={freshPhotos.length > 0 ? "stop-card has-new" : "stop-card"}
                  key={stop.id}
                >
                  <div className="time">{stop.time}</div>
                  <div className="timeline-dot">
                    <span />
                  </div>
                  <div className="stop-body">
                    <div className="stop-card-head">
                      <div className="stop-title-row">
                        <h3>{stop.title}</h3>
                        {stop.tag && <span className="spot-badge">{stop.tag}</span>}
                      </div>
                      <div className="stop-actions">
                        <IconButton label={`Edit ${stop.title}`} onClick={() => setEditing(stop)}>
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton
                          label={`Delete ${stop.title}`}
                          onClick={() => deleteStop(stop.id)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </div>
                    <div className="stop-summary">
                      <div className="stop-place">
                        <span className="stop-icon">
                          <MapPin size={16} />
                        </span>
                        <p>{stop.place}</p>
                      </div>
                      {matchedPhotos.length > 0 && (
                        <button
                          type="button"
                          className={
                            freshPhotos.length > 0
                              ? "stop-photo-preview fresh"
                              : "stop-photo-preview"
                          }
                          onClick={() => {
                            if (freshPhotos.length > 0)
                              dismissPhotos?.(freshPhotos.map((p) => p.id));
                            setViewingPool(matchedPhotos);
                            setViewing(cover ?? matchedPhotos[0]!);
                          }}
                          aria-label={`View ${matchedPhotos.length} ${matchedPhotos.length === 1 ? "photo" : "photos"} for ${stop.title}`}
                        >
                          <img
                            src={cover?.src}
                            alt={`${stop.title} photo`}
                            width={160}
                            height={160}
                            loading="lazy"
                          />
                          {matchedPhotos.length > 1 && <span>+{matchedPhotos.length - 1}</span>}
                          <small>
                            {matchedPhotos.length} {matchedPhotos.length === 1 ? "photo" : "photos"}
                          </small>
                        </button>
                      )}
                    </div>

                    <div className="stop-footer">
                      <div className="stop-costs">
                        {matchedExpenses.map(costRow)}
                        {matchedExpenses.length === 0 && (
                          <span className="no-cost">No costs yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {dayStops.length === 0 && (
              <p className="empty-day">
                No activities yet for this day. Tap “Add” to plan something.
              </p>
            )}
            {looseExpenses.length > 0 && (
              <article className="stop-card">
                <div className="time">—</div>
                <div className="timeline-dot">
                  <span />
                </div>
                <div className="stop-body">
                  <div className="stop-icon mb-2">
                    <ReceiptText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3>Costs without an activity</h3>
                    <p>Matched by place and time when you plan one.</p>
                    <div className="stop-costs">{looseExpenses.map(costRow)}</div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>
        <aside className="day-note">
          <p className="eyebrow">Today’s note</p>
          <h3>Take it slow and stay hydrated.</h3>
          <p>
            There’s a chance of walking about 6 km across {dayStops.length} stops today, so pace
            yourself — and for sure, remember to have fun.
          </p>
          <div className="mini-map">
            <Footprints size={25} />
            <span>{dayStops.length} stops · 6 km</span>
          </div>
        </aside>
      </div>
      {editing && (
        <StopEditor
          stop={editing}
          onClose={() => setEditing(null)}
          onSave={saveStop}
          onDelete={
            stops.some((s) => s.id === editing.id)
              ? () => {
                  deleteStop(editing.id);
                  setEditing(null);
                }
              : undefined
          }
        />
      )}
      {editingCost && (
        <ExpenseEditor
          expense={editingCost}
          stops={stops}
          currency={currency}
          onClose={() => setEditingCost(null)}
          onSave={saveExpense}
          onDelete={
            expenses.some((x) => x.id === editingCost.id)
              ? () => {
                  deleteExpense(editingCost.id);
                  setEditingCost(null);
                }
              : undefined
          }
        />
      )}
      {viewing && (
        <PhotoLightbox
          photo={viewing}
          photos={viewingPool}
          stops={stops}
          onClose={() => setViewing(null)}
          onPrev={(p) => setViewing(p)}
          onNext={(p) => setViewing(p)}
          onMove={() => setView("photos")}
        />
      )}
    </>
  );
}
