import { useEffect, useState } from "react";
import { Accessibility, Baby, Footprints, Locate, Navigation, Toilet } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { RESTROOMS } from "@/lib/mock-data";

export function RestroomFlow({ onClose }: { onClose: () => void }) {
  const [locating, setLocating] = useState(true);
  const [only, setOnly] = useState(false);
  const [going, setGoing] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setLocating(false), 1200);
    return () => clearTimeout(t);
  }, []);
  const list = only ? RESTROOMS.filter((r) => r.tags.includes("Accessible")) : RESTROOMS;
  return (
    <ToolSheet title="Find restrooms" subtitle="Around Senso-ji, Asakusa" onClose={onClose}>
      {locating ? (
        <div className="tool-loading">
          <Locate size={20} /> Finding restrooms near you…
        </div>
      ) : going ? (
        <div className="tool-done">
          <span>
            <Navigation size={22} />
          </span>
          <h3>Walking to {going}</h3>
          <p>Follow the blue route · arrive in about 3 min</p>
          <button className="secondary-action wide" onClick={() => setGoing(null)}>
            Back to list
          </button>
        </div>
      ) : (
        <>
          <div className="tool-filter mt-4">
            <button className={only ? "" : "on"} onClick={() => setOnly(false)}>
              All
            </button>
            <button className={only ? "on" : ""} onClick={() => setOnly(true)}>
              Accessible only
            </button>
          </div>
          <ul className="tool-list">
            {list.map((r) => (
              <li key={r.name}>
                <span className="tool-list-icon">
                  <Toilet size={18} />
                </span>
                <div className="flex-1">
                  <strong>{r.name}</strong>
                  <small>
                    {r.detail} · {r.clean}
                  </small>
                  <span className="tool-tags">
                    {r.tags.map((t) => (
                      <i key={t}>
                        {t === "Baby change" ? (
                          <Baby size={12} />
                        ) : t === "Accessible" ? (
                          <Accessibility size={12} />
                        ) : null}
                        {t}
                      </i>
                    ))}
                  </span>
                </div>
                <button className="scan-chip" onClick={() => setGoing(r.name)}>
                  <Footprints size={15} /> Go
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </ToolSheet>
  );
}
