import { useState } from "react";
import { Locate, Navigation, Signal, Timer } from "lucide-react";

import { MeetFlow } from "@/components/travelers/support/MeetFlow";
import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { TRAVELERS } from "@/lib/mock-data";
import type { Traveler } from "@/lib/types";

export function LocateFlow({ onClose }: { onClose: () => void }) {
  const [on, setOn] = useState(false);
  const [minutes, setMinutes] = useState(60);
  const [meetWith, setMeetWith] = useState<Traveler | null>(null);
  return (
    <ToolSheet
      title="Share live location"
      subtitle="Only with the four travelers on this trip"
      onClose={onClose}
    >
      <div className={on ? "locate-toggle on" : "locate-toggle"}>
        <span className="support-icon">{on ? <Signal /> : <Locate />}</span>
        <div className="flex-1">
          <strong>{on ? "You're sharing your location" : "Location sharing is off"}</strong>
          <small>
            {on ? `Visible to the group for ${minutes} min` : "Turn on so the group can find you"}
          </small>
        </div>
        <button className={on ? "secondary-action" : "primary-action"} onClick={() => setOn(!on)}>
          {on ? "Stop" : "Share"}
        </button>
      </div>
      <div className="tool-filter mt-4">
        {[30, 60, 240].map((m) => (
          <button key={m} className={minutes === m ? "on" : ""} onClick={() => setMinutes(m)}>
            <Timer size={14} /> {m >= 240 ? "4 h" : `${m} min`}
          </button>
        ))}
      </div>
      <h3 className="support-section-title">Group right now</h3>
      <ul className="tool-list">
        {TRAVELERS.map((t) => (
          <li key={t.name}>
            <span className="traveler-dot">{t.initials}</span>
            <div className="flex-1">
              <strong>{t.name}</strong>
              <small>
                {t.place} · {t.when}
              </small>
            </div>
            <button className="scan-chip" onClick={() => setMeetWith(t)}>
              <Navigation size={15} /> Meet
            </button>
          </li>
        ))}
      </ul>
      {on && (
        <p className="tool-hint">
          <Signal size={14} /> Sharing pauses automatically when the timer ends.
        </p>
      )}
      {meetWith && <MeetFlow traveler={meetWith} onClose={() => setMeetWith(null)} />}
    </ToolSheet>
  );
}
