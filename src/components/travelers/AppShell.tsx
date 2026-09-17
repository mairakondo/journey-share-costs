import { Link } from "@tanstack/react-router";
import { Bell, WifiOff, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { BottomNav } from "@/components/travelers/BottomNav";
import { IconButton } from "@/components/travelers/IconButton";
import { ScoutFaceIcon } from "@/components/travelers/ScoutFaceIcon";
import type { View } from "@/lib/types";

export function AppShell({
  tripLabel,
  bottomNav,
  children,
}: {
  tripLabel?: string | undefined;
  bottomNav?:
    | { view: View; setView: (v: View) => void; planBadge: number; onPlanSeen: () => void }
    | undefined;
  children: ReactNode;
}) {
  const [offline, setOffline] = useState(true);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="app-frame">
        {offline && !!tripLabel && (
          <button
            className="offline-banner"
            onClick={() => setOffline(false)}
            aria-label="Dismiss offline notice"
          >
            <WifiOff size={16} /> Offline mode · Your saved plans are available{" "}
            <X size={15} className="ml-auto" />
          </button>
        )}

        <header className="topbar">
          <Link to="/" className="brand" aria-label="Travelers home">
            <span className="brand-mark">
              <ScoutFaceIcon size={19} />
            </span>
            <span>Travelers</span>
          </Link>
          <div className="flex items-center gap-2">
            {tripLabel && (
              <span className="hidden text-sm font-semibold text-primary-foreground/70 sm:inline">
                {tripLabel}
              </span>
            )}
            <IconButton label="Notifications">
              <Bell size={20} />
            </IconButton>
            <button className="avatar">MK</button>
          </div>
        </header>

        {children}

        {bottomNav && (
          <BottomNav
            view={bottomNav.view}
            setView={bottomNav.setView}
            planBadge={bottomNav.planBadge}
            onPlanSeen={bottomNav.onPlanSeen}
          />
        )}
      </div>
    </main>
  );
}
