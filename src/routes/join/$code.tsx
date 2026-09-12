import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { useSupabaseSession } from "@/features/auth/useSupabaseSession";
import { acceptInvite, getInvitePreview } from "@/features/trips/tripsServerFns";

export const Route = createFileRoute("/join/$code")({
  component: JoinPage,
});

function JoinPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseSession();
  const [joinError, setJoinError] = useState<string | null>(null);

  const previewQuery = useQuery({
    queryKey: ["invite-preview", code],
    queryFn: () => getInvitePreview({ data: { code } }),
  });
  const preview = previewQuery.data;

  const acceptMutation = useMutation({
    mutationFn: () => acceptInvite({ data: { code } }),
    onSuccess: ({ tripId }) => navigate({ to: "/trips/$tripId", params: { tripId } }),
    onError: (err) => setJoinError((err as Error).message),
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-primary/10 bg-surface p-8 shadow-xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground"
        >
          <ArrowLeft size={16} /> Back to Travelers
        </Link>

        {previewQuery.isPending ? (
          <p className="mt-2 text-sm text-muted-foreground">Checking your invite…</p>
        ) : !preview ? (
          <>
            <p className="eyebrow">Invite link</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-none">
              This link isn't valid
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              It may have expired. Ask whoever sent it for a fresh invite link.
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">You're invited</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-none">{preview.name}</h1>
            {preview.destination && (
              <p className="mt-2 text-sm text-muted-foreground">{preview.destination}</p>
            )}

            {joinError && <p className="split-hint warn mt-4">{joinError}</p>}

            {authLoading ? null : user ? (
              <button
                className="primary-action wide mt-6"
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? "Joining…" : "Join trip"}
              </button>
            ) : (
              <Link
                to="/sign-in"
                search={{ redirect: `/join/${code}` }}
                className="primary-action wide mt-6"
              >
                Sign in to join
              </Link>
            )}
          </>
        )}
      </div>
    </main>
  );
}
