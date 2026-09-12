import { Check, X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";
import type { Photo, Stop } from "@/lib/types";
import { resolveStop } from "@/lib/trip-utils";

export function PhotoAssign({
  photo,
  stops,
  onClose,
  onAssign,
}: {
  photo: Photo;
  stops: Stop[];
  onClose: () => void;
  onAssign: (stopId: string | null) => void;
}) {
  const current = resolveStop(photo, stops);
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Move photo to activity"
    >
      <div className="modal-sheet">
        <div className="modal-head">
          <div>
            <p className="eyebrow">
              {photo.time} · {photo.place}
            </p>
            <h2>Move photo</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <div className="assign-list">
          {[...stops]
            .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
            .map((stop) => (
              <button
                key={stop.id}
                className={current?.id === stop.id ? "selected" : ""}
                onClick={() => onAssign(stop.id)}
              >
                <b>
                  D{stop.day + 1} · {stop.time}
                </b>
                <span>
                  {stop.title}
                  <small>{stop.place}</small>
                </span>
                {current?.id === stop.id && <Check size={16} />}
              </button>
            ))}
          <button onClick={() => onAssign(null)}>Auto-match by place & time</button>
        </div>
      </div>
    </div>
  );
}
