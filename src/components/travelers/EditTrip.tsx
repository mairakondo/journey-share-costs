import { ArrowRight, MapPin, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import { IconButton } from "@/components/travelers/IconButton";
import type { Trip } from "@/lib/types";

export function EditTrip({
  trip,
  onClose,
  onSave,
  onDelete,
  saving = false,
  deleting = false,
  error = null,
}: {
  trip: Trip;
  onClose: () => void;
  onSave: (fields: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
  }) => void;
  onDelete: () => void;
  saving?: boolean;
  deleting?: boolean;
  error?: string | null;
}) {
  const [name, setName] = useState(trip.name);
  const [destination, setDestination] = useState(trip.destination ?? "");
  const [startDate, setStartDate] = useState(trip.start_date ?? "");
  const [endDate, setEndDate] = useState(trip.end_date ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), destination: destination.trim(), startDate, endDate });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit trip">
      <div className="modal-sheet">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Trip settings</p>
            <h2>Edit trip</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Trip name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Destination
            <div className="input-icon">
              <MapPin size={17} />
              <input
                value={destination}
                placeholder="Tokyo, Japan"
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </label>
          <div className="two-cols">
            <label>
              Starts
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              Ends
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          {error && <p className="split-hint warn">{error}</p>}
          <button className="primary-action wide" type="submit" disabled={!name.trim() || saving}>
            {saving ? "Saving…" : "Save changes"} <ArrowRight size={19} />
          </button>
        </form>

        {confirmingDelete ? (
          <div className="mt-3">
            <p className="split-hint warn">
              Delete “{trip.name}” and everything in it — activities, costs, and photos? This can’t
              be undone.
            </p>
            <div className="two-cols mt-2">
              <button
                className="summary-back"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className="summary-back" onClick={onDelete} disabled={deleting}>
                <Trash2 size={17} /> {deleting ? "Deleting…" : "Yes, delete trip"}
              </button>
            </div>
          </div>
        ) : (
          <button className="summary-back" onClick={() => setConfirmingDelete(true)}>
            <Trash2 size={17} /> Delete trip
          </button>
        )}
      </div>
    </div>
  );
}
