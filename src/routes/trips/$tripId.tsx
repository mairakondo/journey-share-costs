import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

import { AppShell } from "@/components/travelers/AppShell";
import { InviteModal } from "@/components/travelers/InviteModal";
import { ReceiptConfirm } from "@/components/travelers/ReceiptConfirm";
import { TripShell } from "@/components/travelers/TripShell";
import { useSupabaseSession } from "@/features/auth/useSupabaseSession";
import { deleteExpense, listExpenses, saveExpense } from "@/features/costs/costsServerFns";
import { assignPhotoStop, createPhoto, listPhotos } from "@/features/photos/photosServerFns";
import { uploadTripPhoto } from "@/features/photos/uploadPhoto";
import { deleteStop, listStops, saveStop } from "@/features/plan/planServerFns";
import { createInvite, getTrip, listTripMembers } from "@/features/trips/tripsServerFns";
import type { Expense, Stop, View } from "@/lib/types";
import { formatDateRange } from "@/lib/trip-utils";

const searchSchema = z.object({
  view: z.enum(["plan", "costs", "photos", "support", "summary"]).optional(),
});

export const Route = createFileRoute("/trips/$tripId")({
  validateSearch: searchSchema,
  component: TripPage,
});

function TripPage() {
  const { tripId } = Route.useParams();
  const { view: initialView } = Route.useSearch();
  const [view, setView] = useState<View>(initialView ?? "plan");
  const [scanOpen, setScanOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [newPhotoIds, setNewPhotoIds] = useState<string[]>([]);
  const [navBadgeSeen, setNavBadgeSeen] = useState(false);
  const dismissPhotos = (ids: string[]) =>
    setNewPhotoIds((prev) => prev.filter((id) => !ids.includes(id)));
  const markImported = (ids: string[]) => {
    setNewPhotoIds(ids);
    setNavBadgeSeen(false);
  };

  const { user, loading: authLoading } = useSupabaseSession();
  const queryClient = useQueryClient();

  const tripQuery = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => getTrip({ data: { tripId } }),
    enabled: !!user,
  });
  const trip = tripQuery.data;

  const stopsQuery = useQuery({
    queryKey: ["stops", tripId],
    queryFn: () => listStops({ data: { tripId } }),
    enabled: !!trip,
  });
  const stops = stopsQuery.data ?? [];

  const invalidateStops = () => queryClient.invalidateQueries({ queryKey: ["stops", tripId] });

  const saveStopMutation = useMutation({
    mutationFn: (stop: Stop) => {
      const isNew = !stops.some((s) => s.id === stop.id);
      return saveStop({
        data: {
          tripId,
          id: isNew ? undefined : stop.id,
          day: stop.day,
          time: stop.time,
          title: stop.title,
          place: stop.place,
          tag: stop.tag,
        },
      });
    },
    onSuccess: invalidateStops,
  });

  const deleteStopMutation = useMutation({
    mutationFn: (id: string) => deleteStop({ data: { id } }),
    onSuccess: invalidateStops,
  });

  const expensesQuery = useQuery({
    queryKey: ["expenses", tripId],
    queryFn: () => listExpenses({ data: { tripId } }),
    enabled: !!trip,
  });
  const expenses = expensesQuery.data ?? [];

  const invalidateExpenses = () =>
    queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });

  const saveExpenseMutation = useMutation({
    mutationFn: (expense: Expense) => {
      const isNew = !expenses.some((e) => e.id === expense.id);
      return saveExpense({
        data: {
          tripId,
          id: isNew ? undefined : expense.id,
          day: expense.day,
          time: expense.time,
          place: expense.place,
          label: expense.label,
          amount: expense.amount,
          payer: expense.payer,
          source: expense.source,
          stopId: expense.stopId ?? null,
          split: expense.split,
        },
      });
    },
    onSuccess: invalidateExpenses,
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => deleteExpense({ data: { id } }),
    onSuccess: invalidateExpenses,
  });

  const photosQuery = useQuery({
    queryKey: ["photos", tripId],
    queryFn: () => listPhotos({ data: { tripId } }),
    enabled: !!trip,
  });
  const photos = photosQuery.data ?? [];

  const invalidatePhotos = () => queryClient.invalidateQueries({ queryKey: ["photos", tripId] });

  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ file, day }: { file: File; day: number }) => {
      const storagePath = await uploadTripPhoto(tripId, file);
      return createPhoto({
        data: {
          tripId,
          storagePath,
          day,
          time: new Date().toTimeString().slice(0, 5),
          place: "",
          stopId: null,
        },
      });
    },
    onSuccess: invalidatePhotos,
  });

  const assignPhotoMutation = useMutation({
    mutationFn: (vars: { id: string; stopId: string | null; day: number }) =>
      assignPhotoStop({ data: vars }),
    onSuccess: invalidatePhotos,
  });

  const membersQuery = useQuery({
    queryKey: ["trip-members", tripId],
    queryFn: () => listTripMembers({ data: { tripId } }),
    enabled: !!trip,
  });
  const members = membersQuery.data ?? [];

  const inviteMutation = useMutation({
    mutationFn: () => createInvite({ data: { tripId } }),
  });

  const tripLocked = !authLoading && !user;
  const tripLoading =
    authLoading ||
    (!!user &&
      (tripQuery.isPending ||
        stopsQuery.isPending ||
        expensesQuery.isPending ||
        photosQuery.isPending));

  const tripLabel = trip
    ? `${trip.name} · ${formatDateRange(trip.start_date, trip.end_date)}`
    : undefined;

  return (
    <AppShell
      tripLabel={tripLabel}
      bottomNav={
        view === "summary"
          ? undefined
          : {
              view,
              setView,
              planBadge: navBadgeSeen ? 0 : newPhotoIds.length,
              onPlanSeen: () => setNavBadgeSeen(true),
            }
      }
    >
      {trip ? (
        <TripShell
          trip={trip}
          members={members}
          onInvite={() => {
            setInviteOpen(true);
            if (!inviteMutation.data) inviteMutation.mutate();
          }}
          view={view}
          setView={setView}
          onScan={() => setScanOpen(true)}
          stops={stops}
          onSaveStop={(stop) => saveStopMutation.mutate(stop)}
          onDeleteStop={(id) => deleteStopMutation.mutate(id)}
          tripLocked={tripLocked}
          tripLoading={tripLoading}
          photos={photos}
          onUploadPhoto={(file, day) => uploadPhotoMutation.mutateAsync({ file, day })}
          onAssignPhoto={(id, stopId, day) => assignPhotoMutation.mutate({ id, stopId, day })}
          expenses={expenses}
          onSaveExpense={(expense) => saveExpenseMutation.mutate(expense)}
          onDeleteExpense={(id) => deleteExpenseMutation.mutate(id)}
          newPhotoIds={newPhotoIds}
          dismissPhotos={dismissPhotos}
          onImported={markImported}
        />
      ) : (
        <div className="page-pad trip-page pb-28">
          <p className="empty-day mt-7">
            {tripLocked ? "Sign in to view this trip." : "Loading trip…"}
          </p>
        </div>
      )}

      {scanOpen && trip && (
        <ReceiptConfirm
          onClose={() => setScanOpen(false)}
          stops={stops}
          onSave={(e) => saveExpenseMutation.mutate(e)}
        />
      )}

      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          code={inviteMutation.data?.code ?? null}
          loading={inviteMutation.isPending}
        />
      )}
    </AppShell>
  );
}
