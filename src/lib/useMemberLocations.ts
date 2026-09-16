import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listMemberLocations } from "@/features/locate/locateServerFns";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

// Polls as a fallback and also subscribes to Supabase Realtime so a
// member's shared location (or them stopping) shows up for everyone else
// in the trip without a manual refresh.
export function useMemberLocations(tripId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["member-locations", tripId];

  const query = useQuery({
    queryKey,
    queryFn: () => listMemberLocations({ data: { tripId } }),
    refetchInterval: 20_000,
  });

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(`member_locations:${tripId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "member_locations", filter: `trip_id=eq.${tripId}` },
        () => void queryClient.invalidateQueries({ queryKey: ["member-locations", tripId] }),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [tripId, queryClient]);

  return query;
}
