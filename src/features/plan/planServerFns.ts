import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/lib/supabase/authMiddleware";
import type { Stop, TagColor } from "@/lib/types";

const STOP_COLUMNS = "id, day, time, title, place, tag, tag_color";

type StopRow = {
  id: string;
  day: number;
  time: string;
  title: string;
  place: string;
  tag: string;
  tag_color: string;
};

function toStop(row: StopRow): Stop {
  return {
    id: row.id,
    day: row.day,
    time: row.time,
    title: row.title,
    place: row.place,
    tag: row.tag,
    tagColor: row.tag_color as TagColor,
  };
}

export const listStops = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("stops")
      .select(STOP_COLUMNS)
      .eq("trip_id", data.tripId)
      .order("day")
      .order("time");
    if (error) throw error;
    return rows.map(toStop);
  });

const tagColorSchema = z.enum(["blue", "green", "yellow", "coral", "purple"]);

const stopInput = z.object({
  tripId: z.string().uuid(),
  id: z.string().uuid().optional(),
  day: z.number().int().min(0),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/),
  title: z.string().min(1),
  place: z.string(),
  tag: z.string(),
  tagColor: tagColorSchema,
});

export const saveStop = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(stopInput)
  .handler(async ({ context, data }) => {
    const { id, tripId, tagColor, ...fields } = data;
    const row = { ...fields, tag_color: tagColor };

    if (id) {
      const { data: updated, error } = await context.supabase
        .from("stops")
        .update(row)
        .eq("id", id)
        .select(STOP_COLUMNS)
        .single();
      if (error) throw error;
      return toStop(updated);
    }

    const { data: created, error } = await context.supabase
      .from("stops")
      .insert({ ...row, trip_id: tripId })
      .select(STOP_COLUMNS)
      .single();
    if (error) throw error;
    return toStop(created);
  });

export const deleteStop = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("stops").delete().eq("id", data.id);
    if (error) throw error;
    return { id: data.id };
  });
