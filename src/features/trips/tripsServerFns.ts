import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { optionalSupabaseAuth, requireSupabaseAuth } from "@/lib/supabase/authMiddleware";
import type { Database } from "@/lib/database.types";

const TRIP_COLUMNS = "id, name, destination, start_date, end_date";

type TripRow = {
  id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
};

// Inserting a trip and immediately .select()-ing it back fails RLS: the
// on_trip_created trigger's membership row isn't visible to that same
// INSERT...RETURNING statement's snapshot, even though it's already
// committed. So every trip creation inserts without RETURNING, then
// re-fetches here in a fresh statement.
async function insertTripAndRefetch(
  supabase: SupabaseClient<Database>,
  user: User,
  fields: {
    name: string;
    destination: string | null;
    start_date: string | null;
    end_date: string | null;
  },
): Promise<TripRow> {
  const { error: tripError } = await supabase
    .from("trips")
    .insert({ ...fields, created_by: user.id });
  if (tripError) throw tripError;

  const { data: created, error: refetchError } = await supabase
    .from("trip_members")
    .select(`trip_id, trips(${TRIP_COLUMNS})`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (refetchError) throw refetchError;
  return created.trips as unknown as TripRow;
}

export const listMyTrips = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("trip_members")
      .select(`trip_id, trips(${TRIP_COLUMNS})`)
      .eq("user_id", context.user.id);
    if (error) throw error;
    return data.map((row) => row.trips as unknown as TripRow).filter((t): t is TripRow => !!t);
  });

export const getTrip = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: trip, error } = await context.supabase
      .from("trips")
      .select(TRIP_COLUMNS)
      .eq("id", data.tripId)
      .single();
    if (error) throw error;
    return trip;
  });

const tripInput = z.object({
  name: z.string().min(1),
  destination: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createTrip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(tripInput)
  .handler(async ({ context, data }) =>
    insertTripAndRefetch(context.supabase, context.user, {
      name: data.name,
      destination: data.destination || null,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
    }),
  );

export type TripMember = { userId: string; role: string; displayName: string };

export const listTripMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }): Promise<TripMember[]> => {
    const { data: rows, error } = await context.supabase
      .from("trip_members")
      .select("user_id, role, profiles(display_name)")
      .eq("trip_id", data.tripId);
    if (error) throw error;
    return rows.map((r) => ({
      userId: r.user_id,
      role: r.role,
      displayName:
        (r.profiles as unknown as { display_name: string } | null)?.display_name ?? "Traveler",
    }));
  });

function randomInviteCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

// Reuses a still-valid invite for the trip if one exists, so repeat clicks
// on "Invite" don't spawn a pile of different links.
export const createInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: existing, error: existingError } = await context.supabase
      .from("trip_invites")
      .select("code")
      .eq("trip_id", data.tripId)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) return { code: existing.code };

    const { data: created, error } = await context.supabase
      .from("trip_invites")
      .insert({ trip_id: data.tripId, code: randomInviteCode(), created_by: context.user.id })
      .select("code")
      .single();
    if (error) throw error;
    return { code: created.code };
  });

// No auth required: someone previewing an invite link may not have an
// account yet. Uses the RLS-bypassing get_invite_preview() function, which
// validates the code itself rather than relying on trip_invites' normal
// membership-scoped SELECT policy.
export const getInvitePreview = createServerFn({ method: "GET" })
  .middleware([optionalSupabaseAuth])
  .inputValidator(z.object({ code: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const { data: preview, error } = await context.supabase.rpc("get_invite_preview", {
      invite_code: data.code,
    });
    if (error) throw error;
    return preview as { tripId: string; name: string; destination: string | null } | null;
  });

export const acceptInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ code: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const { data: tripId, error } = await context.supabase.rpc("accept_trip_invite", {
      invite_code: data.code,
    });
    if (error) throw error;
    return { tripId };
  });
