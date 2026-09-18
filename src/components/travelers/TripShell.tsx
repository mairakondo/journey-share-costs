import { Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, UserPlus } from "lucide-react";

import { Costs } from "@/components/travelers/Costs";
import { IconButton } from "@/components/travelers/IconButton";
import { Itinerary } from "@/components/travelers/Itinerary";
import { Photos } from "@/components/travelers/Photos";
import { Summary } from "@/components/travelers/Summary";
import { Support } from "@/components/travelers/Support";
import type { TripMember } from "@/features/trips/tripsServerFns";
import type { Expense, Photo, Stop, Trip, View } from "@/lib/types";
import { avatarTone, formatDateRange, initialsFor } from "@/lib/trip-utils";

export function TripShell({
  trip,
  members,
  currentUserId,
  onInvite,
  onEdit,
  view,
  setView,
  onScan,
  stops,
  onSaveStop,
  onDeleteStop,
  tripLocked,
  tripLoading,
  photos,
  onUploadPhoto,
  onAssignPhoto,
  onDeletePhoto,
  expenses,
  onSaveExpense,
  onDeleteExpense,
  newPhotoIds,
  dismissPhotos,
  onImported,
}: {
  trip: Trip;
  members: TripMember[];
  currentUserId: string | null;
  onInvite: () => void;
  onEdit: () => void;
  view: View;
  setView: (v: View) => void;
  onScan: () => void;
  stops: Stop[];
  onSaveStop: (stop: Stop) => void;
  onDeleteStop: (id: string) => void;
  tripLocked: boolean;
  tripLoading: boolean;
  photos: Photo[];
  onUploadPhoto: (file: File, day: number) => Promise<{ id: string }>;
  onAssignPhoto: (photoId: string, stopId: string | null, day: number) => void;
  onDeletePhoto: (photoId: string) => void;
  expenses: Expense[];
  onSaveExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  newPhotoIds: string[];
  dismissPhotos: (ids: string[]) => void;
  onImported: (ids: string[]) => void;
}) {
  const travelerCount = Math.max(members.length, 1);
  return (
    <div className="page-pad trip-page pb-28">
      <div className="trip-heading">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="icon-button" aria-label="Back to trips">
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0">
            <p className="eyebrow">
              {formatDateRange(trip.start_date, trip.end_date)} · {travelerCount}{" "}
              {travelerCount === 1 ? "traveler" : "travelers"}
            </p>
            <h1 className="truncate text-3xl font-extrabold">{trip.name}</h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="avatar-stack hidden sm:flex">
            {members.map((m, i) => (
              <span key={m.userId} className={avatarTone(i)}>
                {initialsFor(m.displayName)}
              </span>
            ))}
          </div>
          <IconButton label="Edit trip" onClick={onEdit}>
            <Pencil size={18} />
          </IconButton>
          <IconButton label="Invite people to this trip" onClick={onInvite}>
            <UserPlus size={18} />
          </IconButton>
        </div>
      </div>
      {view === "plan" && (
        <Itinerary
          trip={trip}
          members={members}
          currentUserId={currentUserId}
          setView={setView}
          stops={stops}
          onSaveStop={onSaveStop}
          onDeleteStop={onDeleteStop}
          tripLocked={tripLocked}
          tripLoading={tripLoading}
          photos={photos}
          onDeletePhoto={onDeletePhoto}
          expenses={expenses}
          onSaveExpense={onSaveExpense}
          onDeleteExpense={onDeleteExpense}
          newPhotoIds={newPhotoIds}
          dismissPhotos={dismissPhotos}
        />
      )}
      {view === "support" && (
        <Support trip={trip} members={members} currentUserId={currentUserId} />
      )}
      {view === "costs" && (
        <Costs
          trip={trip}
          members={members}
          currentUserId={currentUserId}
          onScan={onScan}
          onEditBudget={onEdit}
          stops={stops}
          expenses={expenses}
          onSaveExpense={onSaveExpense}
          onDeleteExpense={onDeleteExpense}
          setView={setView}
          tripLocked={tripLocked}
          tripLoading={tripLoading}
        />
      )}
      {view === "photos" && (
        <Photos
          stops={stops}
          photos={photos}
          onUploadPhoto={onUploadPhoto}
          onAssignPhoto={onAssignPhoto}
          onDeletePhoto={onDeletePhoto}
          onImported={onImported}
          tripLocked={tripLocked}
          tripLoading={tripLoading}
        />
      )}
      {view === "summary" && (
        <Summary
          trip={trip}
          members={members}
          currentUserId={currentUserId}
          stops={stops}
          expenses={expenses}
          photos={photos}
        />
      )}
    </div>
  );
}
