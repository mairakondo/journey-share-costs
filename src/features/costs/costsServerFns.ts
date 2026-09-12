import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/lib/supabase/authMiddleware";
import type { Expense, Split } from "@/lib/types";

const EXPENSE_COLUMNS = "id, day, time, place, label, amount, payer, source, stop_id, split";

type ExpenseRow = {
  id: string;
  day: number;
  time: string;
  place: string;
  label: string;
  amount: number;
  payer: string;
  source: string;
  stop_id: string | null;
  split: unknown;
};

function toExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    day: row.day,
    time: row.time,
    place: row.place,
    label: row.label,
    amount: Number(row.amount),
    payer: row.payer,
    source: row.source === "scan" ? "scan" : "manual",
    stopId: row.stop_id,
    split: row.split as Split,
  };
}

export const listExpenses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ tripId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: rows, error } = await context.supabase
      .from("expenses")
      .select(EXPENSE_COLUMNS)
      .eq("trip_id", data.tripId)
      .order("day")
      .order("time");
    if (error) throw error;
    return rows.map(toExpense);
  });

const splitSchema = z.object({
  mode: z.enum(["equal", "exact", "percent"]),
  participants: z.array(z.string()),
  values: z.record(z.number()),
});

const expenseInput = z.object({
  tripId: z.string().uuid(),
  id: z.string().uuid().optional(),
  day: z.number().int().min(0),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/),
  place: z.string(),
  label: z.string().min(1),
  amount: z.number().min(0),
  payer: z.string().min(1),
  source: z.enum(["scan", "manual"]),
  stopId: z.string().uuid().nullable().optional(),
  split: splitSchema,
});

export const saveExpense = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(expenseInput)
  .handler(async ({ context, data }) => {
    const { id, tripId, stopId, ...fields } = data;
    const row = { ...fields, stop_id: stopId ?? null };

    if (id) {
      const { data: updated, error } = await context.supabase
        .from("expenses")
        .update(row)
        .eq("id", id)
        .select(EXPENSE_COLUMNS)
        .single();
      if (error) throw error;
      return toExpense(updated);
    }

    const { data: created, error } = await context.supabase
      .from("expenses")
      .insert({ ...row, trip_id: tripId })
      .select(EXPENSE_COLUMNS)
      .single();
    if (error) throw error;
    return toExpense(created);
  });

export const deleteExpense = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("expenses").delete().eq("id", data.id);
    if (error) throw error;
    return { id: data.id };
  });
