import { useState } from "react";
import { Check, Copy, X } from "lucide-react";

import { IconButton } from "@/components/travelers/IconButton";

export function InviteModal({
  onClose,
  code,
  loading,
}: {
  onClose: () => void;
  code: string | null;
  loading: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const link = code ? `${window.location.origin}/join/${code}` : "";

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Invite people">
      <div className="modal-sheet">
        <div className="modal-head">
          <div>
            <p className="eyebrow">Bring your group</p>
            <h2>Invite to this trip</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>
        {loading || !link ? (
          <p className="gesture-hint mt-4">Creating your invite link…</p>
        ) : (
          <>
            <p className="gesture-hint mt-4">Anyone with this link can join the trip.</p>
            <div className="invite-row mt-3">
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{link}</span>
            </div>
            <button className="money-action mt-4" onClick={copy}>
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied!" : "Copy invite link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
