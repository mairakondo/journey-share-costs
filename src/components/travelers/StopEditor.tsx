import { useState } from "react";
import { Check, Clock, MapPin, Trash2, X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";
import type { Stop } from "@/lib/types";
import { TAG_COLORS } from "@/lib/trip-utils";

export function StopEditor({
  stop,
  onClose,
  onSave,
  onDelete,
}: {
  stop: Stop;
  onClose: () => void;
  onSave: (s: Stop) => void;
  onDelete?: (() => void) | undefined;
}) {
  const [draft, setDraft] = useState(stop);
  const isNew = !onDelete;
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? "Add activity" : "Edit activity"}
    >
      <div className="modal-sheet">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Day {draft.day + 1}</p>
            <h2>{isNew ? "Add activity" : "Edit activity"}</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <div className="form-grid">
          <label>
            Activity
            <input
              value={draft.title}
              placeholder="Tsukiji breakfast"
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label>
            Place
            <div className="input-icon">
              <MapPin size={17} />
              <input
                value={draft.place}
                placeholder="Tsukiji Outer Market"
                onChange={(e) => setDraft({ ...draft, place: e.target.value })}
              />
            </div>
          </label>
          <div className="two-cols">
            <label>
              Time
              <div className="input-icon">
                <Clock size={17} />
                <input
                  type="time"
                  value={draft.time}
                  onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                />
              </div>
            </label>
            <label>
              Tag
              <input
                value={draft.tag}
                placeholder="Must see"
                onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              />
            </label>
          </div>
          <div className="tag-color-picker" role="radiogroup" aria-label="Tag color">
            {TAG_COLORS.map((c) => (
              <button
                key={c.key}
                type="button"
                role="radio"
                aria-checked={draft.tagColor === c.key}
                aria-label={c.label}
                className={`tag-color-swatch ${c.swatch} ${draft.tagColor === c.key ? "active" : ""}`}
                onClick={() => setDraft({ ...draft, tagColor: c.key })}
              />
            ))}
          </div>
        </div>
        <button
          className="primary-action wide"
          disabled={!draft.title.trim()}
          onClick={() => onSave({ ...draft, title: draft.title.trim(), place: draft.place.trim() })}
        >
          <Check size={19} /> {isNew ? "Add activity" : "Save changes"}
        </button>
        {onDelete && (
          <button className="summary-back" onClick={onDelete}>
            <Trash2 size={17} /> Delete activity
          </button>
        )}
      </div>
    </div>
  );
}
