import { Link } from "@tanstack/react-router";
import { Bell, ChevronRight, Plane, WifiOff, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { BottomNav } from "@/components/travelers/BottomNav";
import { IconButton } from "@/components/travelers/IconButton";
import { MeetFlow } from "@/components/travelers/support/MeetFlow";
import { TRAVELERS } from "@/lib/mock-data";
import type { View } from "@/lib/types";

export function AppShell({
  tripLabel,
  bottomNav,
  children,
}: {
  tripLabel?: string;
  bottomNav?: { view: View; setView: (v: View) => void; planBadge: number; onPlanSeen: () => void };
  children: ReactNode;
}) {
  const [offline, setOffline] = useState(true);
  const [meetAlert, setMeetAlert] = useState(false);
  const [meetOpen, setMeetOpen] = useState(false);

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
              <Plane size={19} />
            </span>
            <span>Travelers</span>
          </Link>
          <div className="flex items-center gap-2">
            {tripLabel && (
              <span className="hidden text-sm font-semibold text-primary-foreground/70 sm:inline">
                {tripLabel}
              </span>
            )}
            <IconButton
              label="Meet request from Yuki"
              onClick={() => {
                setMeetOpen(false);
                setMeetAlert(true);
              }}
            >
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

      {meetAlert && !meetOpen && (
        <div className="meet-toast" role="status">
          <button
            className="meet-toast-main"
            onClick={() => {
              setMeetOpen(true);
              setMeetAlert(false);
            }}
          >
            <span className="traveler-dot">Y</span>
            <span className="flex-1 text-left">
              <strong>Yuki wants to meet you</strong>
              <small>Nakamise shopping street · 8 min walk</small>
            </span>
            <ChevronRight size={18} />
          </button>
          <IconButton label="Dismiss notification" onClick={() => setMeetAlert(false)}>
            <X size={17} />
          </IconButton>
        </div>
      )}
      {meetOpen && <MeetFlow traveler={TRAVELERS[1]!} onClose={() => setMeetOpen(false)} />}
    </main>
  );
}
