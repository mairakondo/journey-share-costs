import { createClient } from "@supabase/supabase-js";
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import type { Database } from "@/lib/database.types";

function createRequestClient(token: string | null) {
  const url = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const publishableKey =
    process.env['SUPABASE_PUBLISHABLE_KEY'] || process.env['VITE_SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createClient<Database>(url, publishableKey, {
    global: {
      // New-format publishable keys are opaque, so they go in `apikey` only.
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) {
          new Headers(init.headers).forEach((value, key) => headers.set(key, value));
        }
        headers.set("apikey", publishableKey);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        else headers.delete("Authorization");
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

function readBearerToken(): string | null {
  const request = getRequest();
  const authHeader = request?.headers?.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  return token.split(".").length === 3 ? token : null;
}

/**
 * Request-scoped Supabase client bound to the caller's bearer token. RLS (not
 * this middleware) is the real access boundary — every query runs as the
 * signed-in user, never a privileged key.
 */
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const token = readBearerToken();
    if (!token) {
      throw new Error("UNAUTHENTICATED");
    }

    const supabase = createRequestClient(token);
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error("UNAUTHENTICATED");
    }

    // Profiles are what trips/members reference; create one on first authed call.
    await supabase.rpc("ensure_profile", {
      _display_name:
        (user.user_metadata?.["display_name"] as string | undefined) ||
        user.email?.split("@")[0] ||
        "Traveler",
    });

    return next({ context: { supabase, user } });
  },
);

// Same client, but for endpoints a signed-out visitor must be able to call
// (e.g. previewing an invite link before they have an account). `user` may
// be null — RLS-bypassing SECURITY DEFINER functions are what make those
// endpoints safe, not this middleware.
export const optionalSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const token = readBearerToken();
    const supabase = createRequestClient(token);
    const user = token ? (await supabase.auth.getUser(token)).data.user : null;
    return next({ context: { supabase, user } });
  },
);
