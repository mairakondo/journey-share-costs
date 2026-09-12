import { createServerClient } from "@supabase/ssr";
import { createMiddleware } from "@tanstack/react-start";
import {
  deleteCookie,
  getCookies,
  setCookie,
  setResponseHeader,
} from "@tanstack/react-start/server";

import type { Database } from "@/lib/database.types";

/**
 * Request-scoped Supabase client bound to the caller's auth cookies via
 * @supabase/ssr. RLS (not this middleware) is the real access boundary —
 * every query below runs as the signed-in user, never a privileged key.
 */
export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const url = process.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publishableKey) {
      throw new Error("Supabase environment variables are not configured.");
    }

    const supabase = createServerClient<Database>(url, publishableKey, {
      cookies: {
        getAll: () => Object.entries(getCookies()).map(([name, value]) => ({ name, value })),
        setAll: (cookiesToSet, headers) => {
          for (const { name, value, options } of cookiesToSet) {
            if (value === "") {
              deleteCookie(name, options);
            } else {
              setCookie(name, value, options);
            }
          }
          for (const [key, value] of Object.entries(headers)) {
            setResponseHeader(key as never, value);
          }
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("UNAUTHENTICATED");
    }

    return next({ context: { supabase, user } });
  },
);

// Same client, but for endpoints a signed-out visitor must be able to call
// (e.g. previewing an invite link before they have an account). `user` may
// be null — RLS-bypassing SECURITY DEFINER functions are what make those
// endpoints safe, not this middleware.
export const optionalSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const url = process.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publishableKey) {
      throw new Error("Supabase environment variables are not configured.");
    }

    const supabase = createServerClient<Database>(url, publishableKey, {
      cookies: {
        getAll: () => Object.entries(getCookies()).map(([name, value]) => ({ name, value })),
        setAll: (cookiesToSet, headers) => {
          for (const { name, value, options } of cookiesToSet) {
            if (value === "") {
              deleteCookie(name, options);
            } else {
              setCookie(name, value, options);
            }
          }
          for (const [key, value] of Object.entries(headers)) {
            setResponseHeader(key as never, value);
          }
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return next({ context: { supabase, user } });
  },
);
