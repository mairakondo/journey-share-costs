import type { SupabaseClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/lib/supabase/authMiddleware";
import type { Database } from "@/lib/database.types";
import type { Photo } from "@/lib/types";

export const PHOTOS_BUCKET = "trip-photos";
const SIGNED_URL_TTL_SECONDS = 60 * 60;

type PhotoRow = {
  id: string;
  day: number;
  time: string;
  place: string;
  stop_id: string | null;
  storage_path: string;
};

async function toPhotos(supabase: SupabaseClient<Database>, rows: PhotoRow[]): Promise<Photo[]> {
  if (rows.length === 0) return [];
  const paths = rows.map((r) => r.storage_path);
  const { data: signed, error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
  if (error) throw error;
  const urlByPath = new Map(signed.map((s) => [s.path ?? "", s.signedUrl]));
  return rows.map((r) => ({
    id: r.id,
    day: r.day,
    time: r.time,
    place: r.place,
    stopId: r.stop_id,
    src: urlByPath.get(r.storage_path) ?? "",
  }));
}

export const listPhotos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("photos")
      .select("id, day, time, place, stop_id, storage_path")
      .eq("trip_id", data.tripId)
      .order("day")
      .order("time");
    if (error) throw error;
    return toPhotos(context.supabase, rows);
  });

const photoInput = z.object({
  tripId: z.string().uuid(),
  storagePath: z.string().min(1),
  day: z.number().int().min(0),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/),
  place: z.string(),
  stopId: z.string().uuid().nullable().optional(),
});

// Called after the browser has already uploaded the file straight to
// Storage (via the same authenticated session) — this just records the row.
export const createPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(photoInput)
  .handler(async ({ context, data }) => {
    const { tripId, storagePath, stopId, ...fields } = data;
    const { data: row, error } = await context.supabase
      .from("photos")
      .insert({ ...fields, trip_id: tripId, storage_path: storagePath, stop_id: stopId ?? null })
      .select("id, day, time, place, stop_id, storage_path")
      .single();
    if (error) throw error;
    const [photo] = await toPhotos(context.supabase, [row]);
    return photo!;
  });

export const assignPhotoStop = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      stopId: z.string().uuid().nullable(),
      day: z.number().int().min(0),
    }),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("photos")
      .update({ stop_id: data.stopId, day: data.day })
      .eq("id", data.id);
    if (error) throw error;
    return { id: data.id };
  });

export const deletePhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: row, error: findError } = await context.supabase
      .from("photos")
      .select("storage_path")
      .eq("id", data.id)
      .single();
    if (findError) throw findError;

    const { error: removeError } = await context.supabase.storage
      .from(PHOTOS_BUCKET)
      .remove([row.storage_path]);
    if (removeError) throw removeError;

    const { error } = await context.supabase.from("photos").delete().eq("id", data.id);
    if (error) throw error;
    return { id: data.id };
  });
