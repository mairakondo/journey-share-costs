import { X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";

export function MoodBoardModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="modal-backdrop lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Outfit mood board"
      onClick={onClose}
    >
      <div className="lightbox-bar">
        <IconButton label="Close" onClick={onClose}>
          <X size={22} />
        </IconButton>
        <div className="min-w-0">
          <p className="eyebrow">Outfit inspiration</p>
        </div>
      </div>
      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <img src="/moodboards/hawaii-trip-outfits.webp" alt="Hawaii trip outfit mood board" />
      </div>
    </div>
  );
}
