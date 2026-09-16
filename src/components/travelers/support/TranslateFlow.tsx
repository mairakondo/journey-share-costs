import { useRef, useState } from "react";
import { Camera, Copy, Languages, Mic, Sparkles, Volume2 } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { scanMenuPhoto } from "@/features/translate/scanMenu";
import type { Trip } from "@/lib/types";
import { translateText } from "@/lib/translate";
import { useDestinationLanguage } from "@/lib/useDestinationLanguage";

const QUICK_PHRASES = [
  "Where is the nearest restroom?",
  "A table for two, please.",
  "Does this have meat or fish?",
  "Can you help me, please?",
  "How much does it cost?",
];

type MenuItem = { original: string; translated: string | null; error: string | null };

interface MinimalSpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognition(): (new () => MinimalSpeechRecognition) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => MinimalSpeechRecognition;
    webkitSpeechRecognition?: new () => MinimalSpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function TranslateFlow({ onClose, trip }: { onClose: () => void; trip: Trip }) {
  const language = useDestinationLanguage(trip);
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [menuBusy, setMenuBusy] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetCode = language.data?.code ?? "en";
  const targetLocale = language.data?.locale ?? "en-US";
  const targetName = language.data?.name ?? "the local language";

  const run = async (value: string) => {
    if (!value.trim()) return;
    setText(value);
    setBusy(true);
    setError(null);
    setTranslated(null);
    setCopied(false);
    try {
      const result = await translateText(value, "en", targetCode);
      setTranslated(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't translate that.");
    } finally {
      setBusy(false);
    }
  };

  const speak = (value: string, locale: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = locale;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) setText(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const scanFile = async (file: File) => {
    setMenuBusy(true);
    setMenuError(null);
    setMenuItems(null);
    try {
      const { items } = await scanMenuPhoto(file);
      if (items.length === 0) {
        setMenuError("Couldn't find any menu text in that photo — try a clearer shot.");
        return;
      }
      const initial = items.map((original) => ({ original, translated: null, error: null }));
      setMenuItems(initial);
      const translations = await Promise.all(
        items.map((item) =>
          translateText(item, targetCode, "en")
            .then((result) => ({ translated: result, error: null as string | null }))
            .catch((err: unknown) => ({
              translated: null,
              error: err instanceof Error ? err.message : "Couldn't translate this item.",
            })),
        ),
      );
      setMenuItems(
        items.map((original, i) => ({
          original,
          translated: translations[i]?.translated ?? null,
          error: translations[i]?.error ?? null,
        })),
      );
    } catch (err) {
      setMenuError(err instanceof Error ? err.message : "Couldn't read that menu.");
    } finally {
      setMenuBusy(false);
    }
  };

  return (
    <ToolSheet
      title="Translator"
      subtitle={
        language.isLoading
          ? "Detecting the local language…"
          : `English → ${targetName}${targetCode === "en" ? "" : ", with voice playback"}`
      }
      onClose={onClose}
    >
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
      <label className="tool-field mt-4">
        Say something
        <div className="translate-input-row">
          <textarea
            rows={2}
            value={text}
            placeholder="Type what you want to say"
            onChange={(e) => setText(e.target.value)}
          />
          {getSpeechRecognition() && (
            <button
              type="button"
              className={listening ? "scan-chip-ink active" : "scan-chip-ink"}
              aria-pressed={listening}
              aria-label={listening ? "Stop listening" : "Speak in English"}
              onClick={toggleListening}
            >
              <Mic size={17} />
            </button>
          )}
        </div>
      </label>
      <div className="tool-actions justify-end">
        <button className="scan-chip-ink" onClick={() => fileInputRef.current?.click()}>
          <Camera size={17} /> Scan menu
        </button>
        <button
          className="scan-chip"
          disabled={!text.trim() || busy}
          onClick={() => void run(text)}
        >
          <Languages size={17} /> Translate
        </button>
      </div>
      {busy && (
        <div className="tool-loading mt-4">
          <Sparkles size={18} /> Translating…
        </div>
      )}
      {error && <p className="split-hint warn">{error}</p>}
      {translated && (
        <div className="tool-result">
          <p className="eyebrow">{targetName}</p>
          <h3>{translated}</h3>
          <div className="tool-actions">
            <button className="scan-chip" onClick={() => speak(translated, targetLocale)}>
              <Volume2 size={15} /> Speak out loud
            </button>
            <button className="secondary-action" onClick={() => void copy(translated)}>
              <Copy size={16} /> {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
      <h3 className="support-section-title">Quick phrases</h3>
      <ul className="tool-chips">
        {QUICK_PHRASES.map((phrase) => (
          <li key={phrase}>
            <button onClick={() => void run(phrase)}>{phrase}</button>
          </li>
        ))}
      </ul>
      {menuBusy && (
        <div className="tool-loading mt-4">
          <Sparkles size={18} /> Reading the menu…
        </div>
      )}
      {menuError && <p className="split-hint warn">{menuError}</p>}
      {menuItems && menuItems.length > 0 && (
        <>
          <h3 className="support-section-title">From the menu</h3>
          <div className="tool-result">
            {menuItems.map((item, i) => (
              <div key={`${item.original}-${i}`} className="menu-item-row">
                <div className="flex-1">
                  <p className="eyebrow">{item.original}</p>
                  {item.translated && <strong>{item.translated}</strong>}
                  {item.error && <small className="split-hint warn">{item.error}</small>}
                </div>
                {item.translated && (
                  <button
                    className="scan-chip-ink"
                    aria-label={`Hear ${item.original}`}
                    onClick={() => speak(item.original, targetLocale)}
                  >
                    <Volume2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </ToolSheet>
  );
}
