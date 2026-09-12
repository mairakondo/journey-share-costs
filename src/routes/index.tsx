import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { AppShell } from "@/components/travelers/AppShell";
import { CreateTrip } from "@/components/travelers/CreateTrip";
import { Dashboard } from "@/components/travelers/Dashboard";
import { useSupabaseSession } from "@/features/auth/useSupabaseSession";
import { createTrip, listMyTrips } from "@/features/trips/tripsServerFns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Travelers — Plan trips together" },
      {
        name: "description",
        content: "Plan group trips, split costs, and keep every memory together with Travelers.",
      },
      { property: "og:title", content: "Travelers — Plan trips together" },
      {
        property: "og:description",
        content: "A warm, simple home for group itineraries, expenses, and travel photos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { user, loading: authLoading } = useSupabaseSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const tripsQuery = useQuery({
    queryKey: ["my-trips", user?.id],
    queryFn: () => listMyTrips(),
    enabled: !!user,
  });
  const trips = tripsQuery.data ?? [];

  const createTripMutation = useMutation({
    mutationFn: (fields: {
      name: string;
      destination: string;
      startDate: string;
      endDate: string;
    }) => createTrip({ data: fields }),
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ["my-trips", user?.id] });
      setCreateOpen(false);
      navigate({ to: "/trips/$tripId", params: { tripId: trip.id } });
    },
  });

  const locked = !authLoading && !user;
  const loading = authLoading || (!!user && tripsQuery.isPending);

  return (
    <AppShell>
      {locked ? (
        <div className="page-pad dashboard-page pb-28">
          <section className="hero-row dashboard-intro">
            <div>
              <p className="eyebrow">Welcome</p>
              <h1 className="page-title">
                Your next story
                <br />
                starts here.
              </h1>
            </div>
          </section>
          <div className="empty-day mt-7">
            <p className="mb-3">Sign in to see your trips.</p>
            <Link to="/sign-in" className="primary-action">
              Sign in
            </Link>
          </div>
        </div>
      ) : loading ? (
        <div className="page-pad dashboard-page pb-28">
          <p className="empty-day mt-7">Loading your trips…</p>
        </div>
      ) : (
        <Dashboard trips={trips} onCreate={() => setCreateOpen(true)} />
      )}

      {createOpen && (
        <CreateTrip
          onClose={() => setCreateOpen(false)}
          onCreate={(fields) => createTripMutation.mutate(fields)}
          creating={createTripMutation.isPending}
        />
      )}
    </AppShell>
  );
}
