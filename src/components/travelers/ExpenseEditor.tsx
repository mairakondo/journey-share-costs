import { useState } from "react";
import { ArrowRight, Camera, Check, MapPin, Trash2, X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";
import { SplitPicker } from "@/components/travelers/SplitPicker";
import { sampleReceipts } from "@/lib/mock-data";
import type { Expense, Stop } from "@/lib/types";
import { normalizeSplit } from "@/lib/trip-utils";

export function ExpenseEditor({
  expense,
  stops,
  onClose,
  onSave,
  onDelete,
}: {
  expense: Expense;
  stops: Stop[];
  onClose: () => void;
  onSave: (e: Expense) => void;
  onDelete?: (() => void) | undefined;
}) {
  const [draft, setDraft] = useState(expense);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">(
    expense.source === "scan" ? "done" : "idle",
  );
  const isNew = !onDelete;

  const scan = () => {
    setScanState("scanning");
    const r = sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)]!;
    setTimeout(() => {
      setDraft((d) => ({
        ...d,
        label: r.label,
        place: r.place,
        amount: r.amount,
        time: r.time,
        source: "scan",
      }));
      setScanState("done");
    }, 900);
  };
  const canSave =
    Boolean(draft.label.trim()) &&
    draft.amount > 0 &&
    normalizeSplit(draft.split).participants.length > 0;
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? "Add cost" : "Edit cost"}
    >
      <div className="modal-sheet">
        <div className="modal-head">
          <div>
            <p className="eyebrow">
              Day {draft.day + 1} · {draft.source === "scan" ? "From receipt" : "Manual"}
            </p>
            <h2>{isNew ? "Add cost" : "Edit cost"}</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        <button className="scan-inline" onClick={scan} disabled={scanState === "scanning"}>
          <span>
            <Camera size={20} />
          </span>
          <div>
            <b>
              {scanState === "scanning"
                ? "Reading your receipt…"
                : scanState === "done"
                  ? "Receipt details filled in"
                  : "Scan a receipt"}
            </b>
            <small>
              {scanState === "done"
                ? "Check the amount, place and time below"
                : "We’ll fill the amount, place and time for you"}
            </small>
          </div>
          {scanState === "done" ? <Check size={18} /> : <ArrowRight size={18} />}
        </button>
        <div className="form-grid">
          <label>
            What was it?
            <input
              value={draft.label}
              placeholder="Lunch at Rio Maravilha"
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            />
          </label>
          <div className="two-cols">
            <label>
              Amount (¥)
              <input
                inputMode="decimal"
                value={draft.amount ? String(draft.amount) : ""}
                placeholder="0.00"
                onChange={(e) =>
                  setDraft({ ...draft, amount: Number(e.target.value.replace(",", ".")) || 0 })
                }
              />
            </label>
            <label>
              Time
              <input
                type="time"
                value={draft.time}
                onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              />
            </label>
          </div>
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
          <label>
            Paid by
            <input
              value={draft.payer}
              onChange={(e) => setDraft({ ...draft, payer: e.target.value })}
            />
          </label>
        </div>
        <div className="split-block">
          <p className="eyebrow">Split between travelers</p>
          <SplitPicker
            split={draft.split}
            amount={draft.amount}
            onChange={(split) => setDraft({ ...draft, split })}
          />
        </div>
        <button
          className="money-action wide"
          disabled={!canSave}
          onClick={() =>
            onSave({
              ...draft,
              label: draft.label.trim(),
              place: draft.place.trim(),
              day: draft.stopId
                ? (stops.find((s) => s.id === draft.stopId)?.day ?? draft.day)
                : draft.day,
            })
          }
        >
          <Check size={19} /> {isNew ? "Add cost" : "Save cost"}
        </button>
        {onDelete && (
          <button className="summary-back" onClick={onDelete}>
            <Trash2 size={17} /> Delete cost
          </button>
        )}
      </div>
    </div>
  );
}
