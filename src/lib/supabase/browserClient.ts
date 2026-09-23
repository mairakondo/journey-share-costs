import { supabase } from "@/integrations/supabase/client";

// Single shared browser client (managed connection settings + preview-safe
// session storage). Keeping one client means the session written at sign-in is
// the same one every hook and upload reads.
export function getSupabaseBrowserClient() {
  return supabase;
}
