import { ChevronLeft, ChevronRight, MapPin, Shuffle, X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";
import type { Photo, Stop } from "@/lib/types";
import { resolveStop } from "@/lib/trip-utils";

export function PhotoLightbox({
  photo,
  photos,
  stops,
  onClose,
  onPrev,
  onNext,
  onMove,
}: {
  photo: Photo;
  photos: Photo[];
  stops: Stop[];
  onClose: () => void;
  onPrev: (p: Photo) => void;
  onNext: (p: Photo) => void;
  onMove: () => void;
}) {
  const idx = photos.findIndex((p) => p.id === photo.id);
  const prev = photos[idx - 1];
  const next = photos[idx + 1];
  const stop = resolveStop(photo, stops);
  return (
    <div
      className="modal-backdrop lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
    >
      <div className="lightbox-bar">
        <IconButton label="Close" onClick={onClose}>
          <X size={22} />
        </IconButton>
        <div className="min-w-0">
          <p className="eyebrow">
            {photo.time} · {photo.place}
          </p>
          {stop && (
            <p className="lightbox-stop">
              <MapPin size={13} /> {stop.title}
            </p>
          )}
        </div>
        <button
          className="secondary-action"
          onClick={(e) => {
            e.stopPropagation();
            onMove();
          }}
        >
          <Shuffle size={16} /> Move
        </button>
      </div>
      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={`${photo.place} memory`} />
        {prev && (
          <button
            className="lightbox-nav prev"
            aria-label="Previous photo"
            onClick={() => onPrev(prev)}
          >
            <ChevronLeft size={26} />
          </button>
        )}
        {next && (
          <button
            className="lightbox-nav next"
            aria-label="Next photo"
            onClick={() => onNext(next)}
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>
    </div>
  );
}
