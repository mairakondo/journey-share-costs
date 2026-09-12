import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { useSupabaseSession } from "@/features/auth/useSupabaseSession";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/sign-in")({
  validateSearch: searchSchema,
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const destination = redirect || "/";
  const { user, loading } = useSupabaseSession();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (mode === "sign-in") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (authError) {
        setError(authError.message);
        return;
      }
      navigate({ to: destination });
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    if (data.session) {
      navigate({ to: destination });
    } else {
      // Email confirmation is required before a session exists.
      setConfirmSent(true);
    }
  };

  const signOut = async () => {
    setBusy(true);
    await getSupabaseBrowserClient().auth.signOut();
    setBusy(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-primary/10 bg-surface p-8 shadow-xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground"
        >
          <ArrowLeft size={16} /> Back to Travelers
        </Link>

        {confirmSent ? (
          <>
            <p className="eyebrow">Almost there</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-none">Check your email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a confirmation link to {email}. Click it, then come back and sign in.
            </p>
            <button
              className="secondary-action wide mt-6"
              type="button"
              onClick={() => {
                setConfirmSent(false);
                setMode("sign-in");
              }}
            >
              Back to sign in
            </button>
          </>
        ) : !loading && user ? (
          <>
            <p className="eyebrow">Signed in</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-none">{user.email}</h1>
            <p className="mt-2 text-sm text-muted-foreground">You're ready to plan your trip.</p>
            <Link to={destination} className="primary-action wide mt-6">
              Go to Travelers
            </Link>
            <button
              className="secondary-action wide mt-3"
              type="button"
              onClick={signOut}
              disabled={busy}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">Travelers</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-none">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "sign-in" ? "Sign in to plan your trip." : "Sign up to start planning."}
            </p>
            <form className="form-grid" onSubmit={submit}>
              <label>
                Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {error && <p className="split-hint warn">{error}</p>}
              <button className="primary-action wide" type="submit" disabled={busy}>
                {busy ? "One moment…" : mode === "sign-in" ? "Sign in" : "Sign up"}
              </button>
            </form>
            <button
              className="secondary-action wide mt-3"
              type="button"
              onClick={() => setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"))}
            >
              {mode === "sign-in" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
