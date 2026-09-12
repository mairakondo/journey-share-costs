// The generated client is preview-safe: it uses brokered storage when the app
// runs inside the Lovable preview iframe, where localStorage/cookies can be
// blocked (which previously crashed the page on first render).
import { supabase } from "@/integrations/supabase/client";

export function getSupabaseBrowserClient() {
  return supabase;
}
