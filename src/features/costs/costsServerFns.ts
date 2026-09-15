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

const scannedReceiptSchema = z.object({
  label: z.string(),
  place: z.string(),
  amount: z.number(),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/),
});
export type ScannedReceipt = z.infer<typeof scannedReceiptSchema>;

const SCAN_PROMPT = `Extract this receipt's details. Respond with ONLY a JSON object, no other text, no markdown code fences, in exactly this shape:
{"label": string, "place": string, "amount": number, "time": string}

- "label": a short 3-6 word description of the purchase, e.g. "Lunch at Rio Maravilha"
- "place": the merchant/business name as printed
- "amount": the final total paid, as a plain number with no currency symbol or thousands separators
- "time": the receipt's printed time in 24-hour "HH:MM" format; if no time is printed, use "12:00"

If a field truly cannot be determined, use a reasonable default (empty string, 0, or "12:00"). Never include explanation text outside the JSON object.`;

function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1]! : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return candidate;
  return candidate.slice(start, end + 1);
}

// Uses Claude's vision API directly (no SDK) to read a photographed receipt
// and pull out the fields ExpenseEditor/ReceiptConfirm need. Requires an
// ANTHROPIC_API_KEY server secret — never exposed to the browser.
export const scanReceipt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      imageBase64: z.string().min(1),
      mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
    }),
  )
  .handler(async ({ data }): Promise<ScannedReceipt> => {
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      throw new Error("Receipt scanning isn't configured yet — missing ANTHROPIC_API_KEY.");
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: data.mediaType, data: data.imageBase64 },
              },
              { type: "text", text: SCAN_PROMPT },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Receipt scan failed (${res.status}). ${detail.slice(0, 200)}`);
    }

    const body = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = body.content?.find((block) => block.type === "text")?.text ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJsonObject(text));
    } catch {
      throw new Error("Couldn't read that receipt — try a clearer photo.");
    }

    const result = scannedReceiptSchema.safeParse(parsed);
    if (!result.success) {
      throw new Error("Couldn't read that receipt — try a clearer photo.");
    }
    return result.data;
  });
