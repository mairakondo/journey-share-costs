import { Link } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState, type ReactNode } from "react";
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
import type { TripMember } from "@/features/trips/tripsServerFns";
import type { Expense, Photo, Stop, Trip, View } from "@/lib/types";
import { currencyForDestination, formatMoney } from "@/lib/currency";
import { equalSplit, resolveStop, tagBadgeClasses, tripDayList } from "@/lib/trip-utils";
import { useTripWeather } from "@/lib/useTripWeather";
import { weatherCodeInfo } from "@/lib/weatherCodes";

const DAY_DROP_PREFIX = "day-";

function DraggableStopCard({
  stop,
  className,
  children,
}: {
  stop: Stop;
  className: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: stop.id,
  });
  return (
    <article
      ref={setNodeRef}
      className={className}
      style={{
        transform: CSS.Translate.toString(transform),
        touchAction: "pan-y",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      data-dragging={isDragging || undefined}
      {...listeners}
      {...attributes}
    >
      {children}
    </article>
  );
}

function DroppableDayTab({
  dayIndex,
  active,
  onClick,
  children,
}: {
  dayIndex: number;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `${DAY_DROP_PREFIX}${dayIndex}` });
  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={[active ? "active" : "", isOver ? "drop-target" : ""].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}

export function Itinerary({
  trip,
  members,
  currentUserId,
  setView,
  stops,
  onSaveStop,
  onDeleteStop,
  tripLocked = false,
  tripLoading = false,
  photos,
  onDeletePhoto,
  expenses,
  onSaveExpense,
  onDeleteExpense,
  newPhotoIds = [],
  dismissPhotos,
}: {
  trip: Trip;
  members: TripMember[];
  currentUserId: string | null;
  setView: (v: View) => void;
  stops: Stop[];
  onSaveStop: (stop: Stop) => void;
  onDeleteStop: (id: string) => void;
  tripLocked?: boolean;
  tripLoading?: boolean;
  photos: Photo[];
  onDeletePhoto: (photoId: string) => void;
  expenses: Expense[];
  onSaveExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  newPhotoIds?: string[];
  dismissPhotos?: (ids: string[]) => void;
}) {
  const tripDays = tripDayList(trip.start_date, trip.end_date);
  const currency = currencyForDestination(trip.destination);
  const payerName = (userId: string) =>
    members.find((m) => m.userId === userId)?.displayName ?? "Someone";
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
  const [draggingStop, setDraggingStop] = useState<Stop | null>(null);
  const dragSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 400, tolerance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingStop(stops.find((s) => s.id === event.active.id) ?? null);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setDraggingStop(null);
    const targetId = event.over?.id;
    if (typeof targetId !== "string" || !targetId.startsWith(DAY_DROP_PREFIX)) return;
    const targetDay = Number(targetId.slice(DAY_DROP_PREFIX.length));
    const stop = stops.find((s) => s.id === event.active.id);
    if (!stop || stop.day === targetDay) return;
    onSaveStop({ ...stop, day: targetDay });
  };

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
    payer: currentUserId ?? "",
    source: "manual",
    stopId: stop?.id ?? null,
    split: equalSplit(members.map((m) => m.userId)),
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
          {e.time} · {payerName(e.payer)}
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
    <DndContext sensors={dragSensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="day-strip">
        {tripDays.map((d, i) => (
          <DroppableDayTab key={i} dayIndex={i} active={day === i} onClick={() => setDay(i)}>
            <span>Day {i + 1}</span>
            {d.label}
          </DroppableDayTab>
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
                        tagColor: "blue",
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
                <DraggableStopCard
                  key={stop.id}
                  stop={stop}
                  className={freshPhotos.length > 0 ? "stop-card has-new" : "stop-card"}
                >
                  <div className="time">{stop.time}</div>
                  <div className="timeline-dot">
                    <span />
                  </div>
                  <div className="stop-body">
                    <div className="stop-card-head">
                      <div className="stop-title-row">
                        <h3>{stop.title}</h3>
                        {stop.tag && (
                          <span className={`spot-badge ${tagBadgeClasses(stop.tagColor)}`}>
                            {stop.tag}
                          </span>
                        )}
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
                </DraggableStopCard>
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
          members={members}
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
          onDelete={() => {
            onDeletePhoto(viewing.id);
            setViewing(null);
          }}
        />
      )}
      <DragOverlay>
        {draggingStop && (
          <div className="drag-chip">
            <span>{draggingStop.time}</span>
            {draggingStop.title || "Untitled activity"}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
