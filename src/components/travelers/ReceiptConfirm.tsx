import { useRef, useState } from "react";
import { Camera, Check, MapPin, ReceiptText, X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";
import { SplitPicker } from "@/components/travelers/SplitPicker";
import { scanReceiptPhoto } from "@/features/costs/scanReceipt";
import type { Expense, Split, Stop } from "@/lib/types";
import { equalSplit, euro, resolveStop, splitLabel } from "@/lib/trip-utils";

export function ReceiptConfirm({
  onClose,
  stops,
  onSave,
}: {
  onClose: () => void;
  stops: Stop[];
  onSave: (e: Expense) => void;
}) {
  const [stage, setStage] = useState<"pick" | "scanning" | "review" | "done">("pick");
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [split, setSplit] = useState<Split>(equalSplit(["You", "Jon", "Ana"]));
  const [draft, setDraft] = useState({
    amount: "0",
    label: "",
    place: "",
    time: "12:00",
    day: 1,
  });
  const amount = Number(draft.amount.replace(",", ".")) || 0;
  const match = resolveStop({ day: draft.day, time: draft.time, place: draft.place }, stops);

  const scanFile = async (file: File) => {
    setStage("scanning");
    setScanError(null);
    try {
      const r = await scanReceiptPhoto(file);
      setDraft((d) => ({
        ...d,
        amount: String(r.amount),
        label: r.label,
        place: r.place,
        time: r.time,
      }));
      setStage("review");
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Couldn't read that receipt.");
      setStage("pick");
    }
  };

  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      capture="environment"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) void scanFile(file);
      }}
    />
  );

  if (stage === "pick")
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Scan a receipt">
        <div className="modal-sheet receipt-sheet">
          <div className="modal-head">
            <div>
              <p className="eyebrow">Receipt</p>
              <h2>Scan a receipt</h2>
            </div>
            <IconButton label="Close" onClick={onClose}>
              <X size={20} />
            </IconButton>
          </div>
          {fileInput}
          <button className="scan-inline" onClick={() => fileInputRef.current?.click()}>
            <span>
              <Camera size={20} />
            </span>
            <div>
              <b>Take or choose a photo</b>
              <small>We’ll read the amount, place and time for you</small>
            </div>
          </button>
          {scanError && <p className="split-hint warn">{scanError}</p>}
        </div>
      </div>
    );

  if (stage === "scanning")
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Scanning receipt">
        <div className="modal-sheet receipt-sheet">
          <div className="modal-head">
            <div>
              <p className="eyebrow">Receipt</p>
              <h2>Scanning…</h2>
            </div>
            <IconButton label="Close" onClick={onClose}>
              <X size={20} />
            </IconButton>
          </div>
          <div className="scan-stage">
            <div className="scan-frame">
              <ReceiptText size={44} />
              <span className="scan-beam" />
            </div>
          </div>
        </div>
      </div>
    );

  const confirm = () => {
    onSave({
      id: `e${Date.now()}`,
      day: draft.day,
      time: draft.time,
      place: draft.place,
      label: draft.label,
      amount,
      payer: "Maira",
      source: "scan",
      stopId: null,
      split,
    });
    setConfirmed(true);
  };
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm scanned receipt"
    >
      <div className="modal-sheet receipt-sheet">
        <div className="scan-success">
          <span>
            <ReceiptText size={26} />
          </span>
          <div>
            <p className="eyebrow">Receipt found</p>
            <h2>{confirmed ? "Expense added!" : "Check the details"}</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        {confirmed ? (
          <div className="confirmation">
            <span>
              <Check size={34} />
            </span>
            <p>
              {euro(amount)} split {splitLabel(split)}
            </p>
            <p className="text-sm">
              {match
                ? `Added to your timeline at ${draft.time} · ${match.title}`
                : `Added to your Day ${draft.day + 1} timeline at ${draft.time}`}
            </p>
            <button className="primary-action wide" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="amount-edit">
              <label>Amount</label>
              <div className="amount-input-wrap">
                <span>¥</span>
                <input
                  value={draft.amount}
                  inputMode="decimal"
                  onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                />
              </div>
            </div>
            <label className="expense-name-field">
              Expense name
              <input
                value={draft.label}
                aria-label="Expense name"
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              />
            </label>
            <div className="two-cols">
              <label>
                Place
                <div className="input-icon">
                  <MapPin size={17} />
                  <input
                    value={draft.place}
                    onChange={(e) => setDraft({ ...draft, place: e.target.value })}
                  />
                </div>
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
            <div className="split-block">
              <p className="eyebrow">Split between travelers</p>
              <SplitPicker split={split} amount={amount} onChange={setSplit} />
            </div>
            <button
              className="money-action"
              disabled={split.participants.length === 0}
              onClick={confirm}
            >
              <Check size={20} /> Confirm expense
            </button>
          </>
        )}
      </div>
    </div>
  );
}
