import { useState } from "react";
import { Accessibility, Locate, MapPin, Navigation, Train } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { formatDistance } from "@/lib/geocode";
import type { Trip } from "@/lib/types";
import { useAccessiblePlaces } from "@/lib/useAccessiblePlaces";

export function AccessFlow({ onClose, trip }: { onClose: () => void; trip: Trip }) {
  const nearby = useAccessiblePlaces(trip);
  const [filter, setFilter] = useState<"all" | "transit" | "place">("all");

  const places = nearby.data?.places ?? [];
  const list = filter === "all" ? places : places.filter((p) => p.category === filter);

  return (
    <ToolSheet
      title="Accessible routes"
      subtitle={
        nearby.data?.usedDeviceLocation
          ? "Step-free places near your current location"
          : `Step-free places around ${trip.destination ?? "your destination"}`
      }
      onClose={onClose}
    >
      {nearby.isLoading ? (
        <div className="tool-loading">
          <Locate size={20} /> Finding accessible places nearby…
        </div>
      ) : nearby.isError ? (
        <div className="tool-loading">
          <Locate size={20} /> Couldn't load accessible places — check your connection.
        </div>
      ) : nearby.data?.unavailable ? (
        <div className="tool-loading">
          <Accessibility size={20} /> Accessibility data is temporarily unavailable — try again
          shortly.
        </div>
      ) : places.length === 0 ? (
        <div className="tool-loading">
          <Accessibility size={20} /> No wheelchair-accessible places mapped nearby yet.
        </div>
      ) : (
        <>
          <div className="tool-filter mt-4">
            {(["all", "transit", "place"] as const).map((f) => (
              <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f === "transit" ? "Stations & transit" : "Places"}
              </button>
            ))}
          </div>
          <ul className="tool-list">
            {list.map((p) => (
              <li key={p.id}>
                <span className="tool-list-icon">
                  {p.category === "transit" ? <Train size={18} /> : <MapPin size={18} />}
                </span>
                <div className="flex-1">
                  <strong>{p.name === "Unnamed" ? p.typeLabel : p.name}</strong>
                  <small>
                    {p.typeLabel} · {formatDistance(p.distanceKm)} away
                  </small>
                  <span className="tool-tags">
                    <i>
                      <Accessibility size={12} /> Wheelchair accessible
                    </i>
                  </span>
                </div>
                <a
                  className="scan-chip"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation size={15} /> Go
                </a>
              </li>
            ))}
          </ul>
          {list.length === 0 && (
            <p className="split-hint warn mt-3">Nothing in this category mapped nearby.</p>
          )}
        </>
      )}
    </ToolSheet>
  );
}
