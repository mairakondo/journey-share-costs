import { useState, type ReactNode } from "react";
import { Footprints, Locate, MapPin, Navigation, Timer, Train, TramFront, X } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { MEET_ROUTES } from "@/lib/mock-data";
import type { Traveler } from "@/lib/types";

const ROUTE_ICONS: Record<string, ReactNode> = {
  walk: <Footprints size={18} />,
  metro: <Train size={18} />,
  taxi: <TramFront size={18} />,
};

export function MeetFlow({ traveler, onClose }: { traveler: Traveler; onClose: () => void }) {
  const [routeId, setRouteId] = useState("walk");
  const [started, setStarted] = useState(false);
  const route = MEET_ROUTES.find((r) => r.id === routeId)!;
  return (
    <ToolSheet
      title={`Meet ${traveler.name}`}
      subtitle={`${traveler.place} · sharing live location`}
      onClose={onClose}
    >
      <div
        className="meet-map mt-4"
        role="img"
        aria-label={`Map with the route to ${traveler.place}`}
      >
        <svg viewBox="0 0 320 200" preserveAspectRatio="none" aria-hidden="true">
          <g className="meet-streets">
            <path d="M0 60 H320" />
            <path d="M0 132 H320" />
            <path d="M70 0 V200" />
            <path d="M190 0 V200" />
            <path d="M255 0 V200" />
            <path d="M0 175 H320" />
          </g>
          <path className="meet-river" d="M0 20 C80 40 150 5 320 30" />
          <path
            className={`meet-route ${routeId}`}
            d="M58 158 C58 120 110 118 130 96 C152 72 190 66 232 46"
          />
        </svg>
        <span className="meet-pin me" style={{ left: "16%", top: "78%" }}>
          <Locate size={14} />
          <i>You</i>
        </span>
        <span className="meet-pin them" style={{ left: "70%", top: "22%" }}>
          <b>{traveler.initials}</b>
          <i>{traveler.name}</i>
        </span>
        <span className="meet-eta">
          <Timer size={13} /> {route.time} away
        </span>
      </div>
      <div className="tool-filter mt-4">
        {MEET_ROUTES.map((r) => (
          <button
            key={r.id}
            className={routeId === r.id ? "on" : ""}
            onClick={() => {
              setRouteId(r.id);
              setStarted(false);
            }}
          >
            {ROUTE_ICONS[r.id]} {r.label} · {r.time}
          </button>
        ))}
      </div>
      <p className="tool-hint">
        <MapPin size={14} /> {route.detail}
      </p>
      {started ? (
        <>
          <h3 className="support-section-title">On your way</h3>
          <ol className="meet-steps">
            {route.steps.map((s, i) => (
              <li key={s}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="tool-actions justify-end mt-4">
          <button className="scan-chip-ink" onClick={onClose}>
            <X size={16} /> Not now
          </button>
          <button className="scan-chip" onClick={() => setStarted(true)}>
            <Navigation size={16} /> Start directions
          </button>
        </div>
      )}
    </ToolSheet>
  );
}
