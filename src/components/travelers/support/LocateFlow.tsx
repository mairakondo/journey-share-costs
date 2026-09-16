import { useState } from "react";
import { Locate, Navigation, Signal, Timer } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import type { TripMember } from "@/features/trips/tripsServerFns";
import { useMemberLocations } from "@/lib/useMemberLocations";
import { useShareLocation } from "@/lib/useShareLocation";

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  return `${hours} hr${hours === 1 ? "" : "s"} ago`;
}

export function LocateFlow({
  onClose,
  tripId,
  members,
  currentUserId,
}: {
  onClose: () => void;
  tripId: string;
  members: TripMember[];
  currentUserId: string | null;
}) {
  const [minutes, setMinutes] = useState(60);
  const { sharing, expiresAt, error, start, stop } = useShareLocation(tripId);
  const locations = useMemberLocations(tripId);

  const others = members.filter((m) => m.userId !== currentUserId);

  return (
    <ToolSheet
      title="Share live location"
      subtitle={`Only with the ${members.length} traveler${members.length === 1 ? "" : "s"} on this trip`}
      onClose={onClose}
    >
      <div className={sharing ? "locate-toggle on" : "locate-toggle"}>
        <span className="support-icon">{sharing ? <Signal /> : <Locate />}</span>
        <div className="flex-1">
          <strong>{sharing ? "You're sharing your location" : "Location sharing is off"}</strong>
          <small>
            {sharing && expiresAt
              ? `Visible to the group until ${new Date(expiresAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
              : "Turn on so the group can find you"}
          </small>
        </div>
        <button
          className={sharing ? "secondary-action" : "primary-action"}
          onClick={() => void (sharing ? stop() : start(minutes))}
        >
          {sharing ? "Stop" : "Share"}
        </button>
      </div>
      {error && <p className="split-hint warn mt-2">{error}</p>}
      <div className="tool-filter mt-4">
        {[30, 60, 240].map((m) => (
          <button
            key={m}
            className={minutes === m ? "on" : ""}
            disabled={sharing}
            onClick={() => setMinutes(m)}
          >
            <Timer size={14} /> {m >= 240 ? "4 h" : `${m} min`}
          </button>
        ))}
      </div>
      <h3 className="support-section-title">Group right now</h3>
      {others.length === 0 ? (
        <p className="split-hint">Invite travelers to this trip to share locations with them.</p>
      ) : (
        <ul className="tool-list">
          {others.map((m) => {
            const loc = locations.data?.find((l) => l.userId === m.userId);
            return (
              <li key={m.userId}>
                <span className="traveler-dot">{m.displayName.slice(0, 2).toUpperCase()}</span>
                <div className="flex-1">
                  <strong>{m.displayName}</strong>
                  <small>
                    {loc ? `Sharing · updated ${timeAgo(loc.updatedAt)}` : "Not sharing right now"}
                  </small>
                </div>
                {loc && (
                  <a
                    className="scan-chip"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation size={15} /> Meet
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {sharing && (
        <p className="tool-hint">
          <Signal size={14} /> Sharing pauses automatically when the timer ends.
        </p>
      )}
    </ToolSheet>
  );
}
