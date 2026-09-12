import { createClient } from "@supabase/supabase-js";

import { brokeredPreviewStorage } from "@/integrations/supabase/previewAuthStorage";
import type { Database } from "@/integrations/supabase/types";

function createSupabaseFetch(publishableKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (headers.get("Authorization") === `Bearer ${publishableKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", publishableKey);
    return fetch(input, { ...init, headers });
  };
}

let browserClient: ReturnType<typeof createClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  // Dot access is intentional: Vite replaces these public values while
  // building the browser bundle. Dynamic/bracket access is not injected.
  const url = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("The app connection is unavailable. Please refresh and try again.");
  }

  browserClient = createClient<Database>(url, publishableKey, {
    global: { fetch: createSupabaseFetch(publishableKey) },
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return browserClient;
}
