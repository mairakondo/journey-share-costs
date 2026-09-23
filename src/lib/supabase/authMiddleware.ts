import { createClient, type User } from "@supabase/supabase-js";
import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import type { Database } from "@/lib/database.types";

function isNewApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

// New-format publishable keys are opaque strings, not bearer JWTs: they must
// travel as `apikey`, never as Authorization (that header carries the user).
function createSupabaseFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    }
    if (isNewApiKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

function readEnv() {
  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error("The app connection is not configured.");
  }
  return { url, key };
}

function bearerToken(): string | null {
  const request = getRequest();
  const header = request?.headers?.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length);
  if (!token || token.split(".").length !== 3) return null;
  return token;
}

function clientForToken(token: string | null) {
  const { url, key } = readEnv();
  return createClient<Database>(url, key, {
    global: {
      fetch: createSupabaseFetch(key),
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Request-scoped Supabase client bound to the caller's bearer token (attached
 * client-side by `attachSupabaseAuth`). RLS — not this middleware — is the
 * real access boundary: every query runs as the signed-in user.
 */
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const token = bearerToken();
    if (!token) throw new Error("UNAUTHENTICATED");

    const supabase = clientForToken(token);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) throw new Error("UNAUTHENTICATED");

    // Profile rows are created by the on_auth_user_created trigger at
    // sign-up (handle_new_user()), not here.
    return next({ context: { supabase, user: user as User } });
  },
);

// Same client, but for endpoints a signed-out visitor must be able to call
// (e.g. previewing an invite link before they have an account). `user` may be
// null — RLS-bypassing SECURITY DEFINER functions are what make those
// endpoints safe, not this middleware.
export const optionalSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const token = bearerToken();
    const supabase = clientForToken(token);
    let user: User | null = null;
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      user = data.user ?? null;
    }
    return next({ context: { supabase, user } });
  },
);
