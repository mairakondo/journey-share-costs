import { useRef, useState } from "react";
import { Check, ImagePlus, Loader2, X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";

const DAY_LABELS = ["Sun 18", "Mon 19", "Tue 20", "Wed 21", "Thu 22"];

type PendingFile = { file: File; previewUrl: string };
type UploadResult = { file: PendingFile; status: "pending" | "done" | "error"; error?: string };

export function PhotoImport({
  onClose,
  onUploadPhoto,
  onFinished,
}: {
  onClose: () => void;
  onUploadPhoto: (file: File, day: number) => Promise<{ id: string }>;
  onFinished: (ids: string[]) => void;
}) {
  const [step, setStep] = useState<"pick" | "uploading" | "done">("pick");
  const [day, setDay] = useState(1);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [results, setResults] = useState<UploadResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPending((prev) => [...prev, ...next]);
  };

  const removePending = (previewUrl: string) => {
    setPending((prev) => prev.filter((p) => p.previewUrl !== previewUrl));
  };

  const startUpload = async () => {
    setStep("uploading");
    setResults(pending.map((file) => ({ file, status: "pending" })));

    const ids: string[] = [];
    for (let i = 0; i < pending.length; i++) {
      const item = pending[i]!;
      try {
        const photo = await onUploadPhoto(item.file, day);
        ids.push(photo.id);
        setResults((prev) => prev.map((r, idx) => (idx === i ? { ...r, status: "done" } : r)));
      } catch (err) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", error: (err as Error).message } : r,
          ),
        );
      }
    }
    setStep("done");
    onFinished(ids);
  };

  const doneCount = results.filter((r) => r.status === "done").length;
  const errorCount = results.filter((r) => r.status === "error").length;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Add photos">
      <div className="modal-sheet">
        <div className="modal-head">
          <div>
            <p className="eyebrow">
              {step === "pick" ? "From your device" : step === "uploading" ? "Uploading" : "Done"}
            </p>
            <h2>
              {step === "pick"
                ? "Add photos"
                : step === "uploading"
                  ? "Uploading your memories"
                  : `${doneCount} photo${doneCount === 1 ? "" : "s"} added`}
            </h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>

        {step === "pick" && (
          <>
            <p className="gesture-hint">
              Choose which day these photos belong to, then pick them from your device.
            </p>
            <div className="day-strip mt-4" style={{ margin: 0 }}>
              {DAY_LABELS.map((d, i) => (
                <button key={d} onClick={() => setDay(i)} className={day === i ? "active" : ""}>
                  <span>Day {i + 1}</span>
                  {d}
                </button>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              className="scan-inline mt-4"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <span>
                <ImagePlus size={20} />
              </span>
              <div>
                <b>Choose photos</b>
                <small>
                  {pending.length > 0
                    ? `${pending.length} selected`
                    : "From your camera roll or files"}
                </small>
              </div>
            </button>

            {pending.length > 0 && (
              <div className="import-grid">
                {pending.map((p) => (
                  <button
                    key={p.previewUrl}
                    type="button"
                    className="import-tile on"
                    onClick={() => removePending(p.previewUrl)}
                    aria-label={`Remove ${p.file.name}`}
                  >
                    <img src={p.previewUrl} alt="" width={320} height={320} />
                    <i>
                      <X size={12} />
                    </i>
                  </button>
                ))}
              </div>
            )}

            <button
              className="money-action mt-4"
              disabled={pending.length === 0}
              onClick={startUpload}
            >
              Add {pending.length > 0 ? pending.length : ""} photo{pending.length === 1 ? "" : "s"}
            </button>
          </>
        )}

        {step === "uploading" && (
          <div className="match-progress">
            <div className="match-bar">
              <span style={{ width: `${(doneCount / Math.max(1, results.length)) * 100}%` }} />
            </div>
            <p className="gesture-hint">
              Uploading… {doneCount}/{results.length}
            </p>
            <ul className="match-list">
              {results.map((r, i) => (
                <li key={i} className={r.status === "pending" ? "pending" : "done"}>
                  <img src={r.file.previewUrl} alt="" width={80} height={80} />
                  <span>
                    <b>{r.file.file.name}</b>
                    <small>Day {day + 1}</small>
                  </span>
                  {r.status === "pending" && (
                    <em className="wait">
                      <Loader2 size={14} className="spin" /> Uploading…
                    </em>
                  )}
                  {r.status === "done" && (
                    <em className="ok">
                      <Check size={13} /> Done
                    </em>
                  )}
                  {r.status === "error" && <em>Failed</em>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === "done" && (
          <>
            <ul className="match-list">
              {results.map((r, i) => (
                <li key={i} className="done">
                  <img src={r.file.previewUrl} alt="" width={80} height={80} />
                  <span>
                    <b>{r.file.file.name}</b>
                    <small>Day {day + 1}</small>
                  </span>
                  {r.status === "done" ? (
                    <em className="ok">
                      <Check size={13} /> Uploaded
                    </em>
                  ) : (
                    <em>Failed</em>
                  )}
                </li>
              ))}
            </ul>
            {errorCount > 0 && (
              <p className="gesture-hint">
                {errorCount} photo{errorCount === 1 ? "" : "s"} failed to upload — you can try again
                from the Photos tab.
              </p>
            )}
            <p className="gesture-hint">
              New photos aren't matched to an activity yet — open one to move it to a stop.
            </p>
            <button className="money-action mt-4" onClick={onClose}>
              <Check size={17} /> Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
