import { ArrowRight, MapPin, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import { IconButton } from "@/components/travelers/IconButton";

export function CreateTrip({
  onClose,
  onCreate,
  creating = false,
  error = null,
}: {
  onClose: () => void;
  onCreate: (fields: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
  }) => void;
  creating?: boolean;
  error?: string | null;
}) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name: name.trim(), destination: destination.trim(), startDate, endDate });
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Create a trip">
      <div className="modal-sheet">
        <div className="modal-head">
          <div>
            <p className="eyebrow">New adventure</p>
            <h2>Create a trip</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <label>
            Trip name
            <input
              value={name}
              placeholder="Tokyo escape"
              onChange={(e) => setName(e.target.value)}
              required
            />
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
          <button className="primary-action wide" type="submit" disabled={!name.trim() || creating}>
            {creating ? "Creating…" : "Create trip"} <ArrowRight size={19} />
          </button>
        </form>
      </div>
    </div>
  );
}
