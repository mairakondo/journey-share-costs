import { Check } from "lucide-react";

import { members } from "@/lib/mock-data";
import type { Split, SplitMode } from "@/lib/types";
import { euro, normalizeSplit, splitShares } from "@/lib/trip-utils";

export function SplitPicker({
  split: rawSplit,
  amount,
  onChange,
}: {
  split: Split | undefined;
  amount: number;
  onChange: (s: Split) => void;
}) {
  const split = normalizeSplit(rawSplit);
  const shares = splitShares(split, amount);

  const toggle = (name: string) => {
    const participants = split.participants.includes(name)
      ? split.participants.filter((n) => n !== name)
      : [...split.participants, name];
    onChange({ ...split, participants });
  };
  const setValue = (name: string, v: number) =>
    onChange({ ...split, values: { ...split.values, [name]: v } });
  const percentTotal = split.participants.reduce((s, n) => s + Number(split.values[n] ?? 0), 0);
  const exactTotal = split.participants.reduce(
    (s, n) => s + Math.max(0, Number(split.values[n] ?? 0)),
    0,
  );
  const exactDiff = Math.round(amount - exactTotal);
  const defaults = (mode: SplitMode) => {
    const n = Math.max(1, split.participants.length);
    if (mode === "percent")
      return Object.fromEntries(
        split.participants.map((p) => [p, Math.round((100 / n) * 10) / 10]),
      );
    if (mode === "exact")
      return Object.fromEntries(split.participants.map((p) => [p, Math.round(amount / n)]));
    return {};
  };
  return (
    <div className="split-picker">
      <div className="split-modes" role="group" aria-label="Split type">
        {(
          [
            ["equal", "Equally"],
            ["exact", "Exact amounts"],
            ["percent", "By percentage"],
          ] as [SplitMode, string][]
        ).map(([mode, label]) => (
          <button
            key={mode}
            className={split.mode === mode ? "active" : ""}
            onClick={() => onChange({ ...split, mode, values: defaults(mode) })}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="split-rows">
        {members.map((m) => {
          const on = split.participants.includes(m.name);
          return (
            <div key={m.name} className={on ? "split-row on" : "split-row"}>
              <button className="split-person" onClick={() => toggle(m.name)} aria-pressed={on}>
                <span className={m.tone}>{m.initials}</span>
                {m.name}
                <i>{on && <Check size={12} />}</i>
              </button>
              {on && split.mode !== "equal" && (
                <div className="split-value">
                  {split.mode === "exact" && <small>¥</small>}
                  <input
                    inputMode="decimal"
                    aria-label={`${split.mode === "percent" ? "Percentage" : "Amount"} for ${m.name}`}
                    value={String(split.values[m.name] ?? "")}
                    onChange={(e) =>
                      setValue(m.name, Number(e.target.value.replace(",", ".")) || 0)
                    }
                  />
                  {split.mode === "percent" && <small>%</small>}
                </div>
              )}
              {on && split.mode !== "exact" && <strong>{euro(shares[m.name] ?? 0)}</strong>}
            </div>
          );
        })}
      </div>
      {split.participants.length === 0 && (
        <p className="split-hint warn">Pick at least one traveler.</p>
      )}
      {split.mode === "exact" && split.participants.length > 0 && (
        <p className={Math.abs(exactDiff) > 1 ? "split-hint warn" : "split-hint"}>
          Assigned {euro(exactTotal)} of {euro(amount)}
          {Math.abs(exactDiff) > 1
            ? ` — ${exactDiff > 0 ? `${euro(exactDiff)} left to assign` : `${euro(Math.abs(exactDiff))} over`}`
            : " — all set"}
        </p>
      )}
      {split.mode === "percent" && split.participants.length > 0 && (
        <p className={Math.abs(percentTotal - 100) > 0.5 ? "split-hint warn" : "split-hint"}>
          Percentages total {Math.round(percentTotal * 10) / 10}%
          {Math.abs(percentTotal - 100) > 0.5 ? " — we’ll scale it to the amount." : ""}
        </p>
      )}
    </div>
  );
}
