import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/lib/supabase/authMiddleware";

const scannedMenuSchema = z.object({ items: z.array(z.string()) });
export type ScannedMenu = z.infer<typeof scannedMenuSchema>;

const SCAN_PROMPT = `This photo shows a restaurant menu or food sign. Read the individual dish or item names visible on it, in the language they're printed in (do not translate them). Respond with ONLY a JSON object, no other text, no markdown code fences, in exactly this shape:
{"items": string[]}

- List each distinct dish/item name once, verbatim as printed (up to 12 items).
- Skip prices, section headers, and decorative text.
- If nothing readable is found, return {"items": []}.`;

function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1]! : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return candidate;
  return candidate.slice(start, end + 1);
}

// Uses Claude's vision API directly (no SDK) to read dish names off a
// photographed menu, so the Translator tool can offer them for
// translation. Requires an ANTHROPIC_API_KEY server secret.
export const scanMenu = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      imageBase64: z.string().min(1),
      mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
    }),
  )
  .handler(async ({ data }): Promise<ScannedMenu> => {
    const apiKey = process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      throw new Error("Menu scanning isn't configured yet — missing ANTHROPIC_API_KEY.");
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
        max_tokens: 500,
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
      throw new Error(`Menu scan failed (${res.status}). ${detail.slice(0, 200)}`);
    }

    const body = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
    const text = body.content?.find((block) => block.type === "text")?.text ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJsonObject(text));
    } catch {
      throw new Error("Couldn't read that menu — try a clearer photo.");
    }

    const result = scannedMenuSchema.safeParse(parsed);
    if (!result.success) {
      throw new Error("Couldn't read that menu — try a clearer photo.");
    }
    return result.data;
  });
