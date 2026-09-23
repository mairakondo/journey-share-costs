import { createMiddleware } from "@tanstack/react-start";

import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

// Sends the signed-in user's token with every server function call so the
// server can act as that user.
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const {
      data: { session },
    } = await getSupabaseBrowserClient().auth.getSession();
    const token = session?.access_token;
    return next(token ? { headers: { Authorization: `Bearer ${token}` } } : {});
  },
);
