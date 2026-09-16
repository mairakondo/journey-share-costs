import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/lib/supabase/authMiddleware";

export type MemberLocation = {
  userId: string;
  lat: number;
  lon: number;
  accuracyM: number | null;
  updatedAt: string;
  expiresAt: string;
};

const LOCATION_COLUMNS = "user_id, lat, lon, accuracy_m, updated_at, expires_at";

type LocationRow = {
  user_id: string;
  lat: number;
  lon: number;
  accuracy_m: number | null;
  updated_at: string;
  expires_at: string;
};

function toMemberLocation(row: LocationRow): MemberLocation {
  return {
    userId: row.user_id,
    lat: row.lat,
    lon: row.lon,
    accuracyM: row.accuracy_m,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}

export const listMemberLocations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("member_locations")
      .select(LOCATION_COLUMNS)
      .eq("trip_id", data.tripId)
      .gt("expires_at", new Date().toISOString());
    if (error) throw error;
    return rows.map(toMemberLocation);
  });

export const shareLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      tripId: z.string().uuid(),
      lat: z.number(),
      lon: z.number(),
      accuracyM: z.number().nullable().optional(),
      durationMinutes: z.number().int().min(1).max(480),
    }),
  )
  .handler(async ({ context, data }) => {
    const expiresAt = new Date(Date.now() + data.durationMinutes * 60_000).toISOString();
    const { error } = await context.supabase.from("member_locations").upsert({
      trip_id: data.tripId,
      user_id: context.user.id,
      lat: data.lat,
      lon: data.lon,
      accuracy_m: data.accuracyM ?? null,
      expires_at: expiresAt,
    });
    if (error) throw error;
    return { expiresAt };
  });

export const stopSharingLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("member_locations")
      .delete()
      .eq("trip_id", data.tripId)
      .eq("user_id", context.user.id);
    if (error) throw error;
    return { ok: true };
  });
