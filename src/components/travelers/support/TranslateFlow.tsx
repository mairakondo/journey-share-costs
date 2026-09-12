import { useState } from "react";
import { Camera, Copy, Languages, Sparkles, Volume2 } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { PHRASES } from "@/lib/mock-data";

export function TranslateFlow({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ jp: string; ro: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [spoke, setSpoke] = useState(false);
  const run = (en: string) => {
    setText(en);
    setBusy(true);
    setResult(null);
    setSpoke(false);
    const hit = PHRASES.find((p) => p.en.toLowerCase() === en.trim().toLowerCase());
    setTimeout(() => {
      setBusy(false);
      setResult(
        hit
          ? { jp: hit.jp, ro: hit.ro }
          : {
              jp: "すみません、これをお願いできますか？",
              ro: "Sumimasen, kore o onegai dekimasu ka?",
            },
      );
    }, 900);
  };
  return (
    <ToolSheet title="Translator" subtitle="English → Japanese, works offline" onClose={onClose}>
      <label className="tool-field mt-4">
        Say something
        <textarea
          rows={2}
          value={text}
          placeholder="Type what you want to say"
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <div className="tool-actions justify-end">
        <button className="scan-chip-ink" onClick={() => run("Does this have meat or fish?")}>
          <Camera size={17} /> Scan menu
        </button>
        <button className="scan-chip" disabled={!text.trim()} onClick={() => run(text)}>
          <Languages size={17} /> Translate
        </button>
      </div>
      {busy && (
        <div className="tool-loading mt-4">
          <Sparkles size={18} /> Translating…
        </div>
      )}
      {result && (
        <div className="tool-result">
          <p className="eyebrow">Japanese</p>
          <h3>{result.jp}</h3>
          <small>{result.ro}</small>
          <div className="tool-actions">
            <button className="scan-chip" onClick={() => setSpoke(true)}>
              <Volume2 size={15} /> Speak out loud
            </button>
            <button className="secondary-action" onClick={() => setSpoke(false)}>
              <Copy size={16} /> Copy
            </button>
          </div>
          {spoke && (
            <p className="tool-hint">
              <Volume2 size={14} /> Playing at full volume — show your phone to help.
            </p>
          )}
        </div>
      )}
      <h3 className="support-section-title">Quick phrases</h3>
      <ul className="tool-chips">
        {PHRASES.map((p) => (
          <li key={p.en}>
            <button onClick={() => run(p.en)}>{p.en}</button>
          </li>
        ))}
      </ul>
    </ToolSheet>
  );
}
