import { supabase } from "@/integrations/supabase/client";

export function getSupabaseBrowserClient() {
  return supabase;
}
