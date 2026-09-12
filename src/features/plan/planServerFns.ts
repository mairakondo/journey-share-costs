import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/lib/supabase/authMiddleware";

export const listStops = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("stops")
      .select("id, day, time, title, place, tag")
      .eq("trip_id", data.tripId)
      .order("day")
      .order("time");
    if (error) throw error;
    return rows;
  });

const stopInput = z.object({
  tripId: z.string().uuid(),
  id: z.string().uuid().optional(),
  day: z.number().int().min(0),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/),
  title: z.string().min(1),
  place: z.string(),
  tag: z.string(),
});

export const saveStop = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(stopInput)
  .handler(async ({ context, data }) => {
    const { id, tripId, ...fields } = data;

    if (id) {
      const { data: row, error } = await context.supabase
        .from("stops")
        .update(fields)
        .eq("id", id)
        .select("id, day, time, title, place, tag")
        .single();
      if (error) throw error;
      return row;
    }

    const { data: row, error } = await context.supabase
      .from("stops")
      .insert({ ...fields, trip_id: tripId })
      .select("id, day, time, title, place, tag")
      .single();
    if (error) throw error;
    return row;
  });

export const deleteStop = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("stops").delete().eq("id", data.id);
    if (error) throw error;
    return { id: data.id };
  });
