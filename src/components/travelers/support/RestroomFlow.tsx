import { useState } from "react";
import { Accessibility, Baby, CircleDollarSign, Locate, Navigation, Toilet } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { formatDistance } from "@/lib/geocode";
import type { Trip } from "@/lib/types";
import { useNearbyRestrooms } from "@/lib/useNearbyRestrooms";

export function RestroomFlow({ onClose, trip }: { onClose: () => void; trip: Trip }) {
  const nearby = useNearbyRestrooms(trip);
  const [only, setOnly] = useState(false);

  const restrooms = nearby.data?.restrooms ?? [];
  const list = only ? restrooms.filter((r) => r.wheelchair === "yes") : restrooms;

  return (
    <ToolSheet
      title="Find restrooms"
      subtitle={
        nearby.data?.usedDeviceLocation
          ? "Near your current location"
          : `Around ${trip.destination ?? "your destination"}`
      }
      onClose={onClose}
    >
      {nearby.isLoading ? (
        <div className="tool-loading">
          <Locate size={20} /> Finding restrooms near you…
        </div>
      ) : nearby.isError ? (
        <div className="tool-loading">
          <Locate size={20} /> Couldn't load nearby restrooms — check your connection.
        </div>
      ) : restrooms.length === 0 ? (
        <div className="tool-loading">
          <Toilet size={20} /> No mapped restrooms found nearby.
        </div>
      ) : (
        <>
          <div className="tool-filter mt-4">
            <button className={only ? "" : "on"} onClick={() => setOnly(false)}>
              All
            </button>
            <button className={only ? "on" : ""} onClick={() => setOnly(true)}>
              Accessible only
            </button>
          </div>
          <ul className="tool-list">
            {list.map((r) => (
              <li key={r.id}>
                <span className="tool-list-icon">
                  <Toilet size={18} />
                </span>
                <div className="flex-1">
                  <strong>{r.name === "Unnamed" ? "Public restroom" : r.name}</strong>
                  <small>{formatDistance(r.distanceKm)} away</small>
                  <span className="tool-tags">
                    {r.wheelchair === "yes" && (
                      <i>
                        <Accessibility size={12} /> Accessible
                      </i>
                    )}
                    {r.babyChange && (
                      <i>
                        <Baby size={12} /> Baby change
                      </i>
                    )}
                    {r.fee && (
                      <i>
                        <CircleDollarSign size={12} /> Fee
                      </i>
                    )}
                  </span>
                </div>
                <a
                  className="scan-chip"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation size={15} /> Go
                </a>
              </li>
            ))}
          </ul>
          {only && list.length === 0 && (
            <p className="split-hint warn mt-3">No accessible restrooms mapped nearby.</p>
          )}
        </>
      )}
    </ToolSheet>
  );
}
