import { useState } from "react";
import { Accessibility, MapPin, Navigation, Train, TramFront } from "lucide-react";

import { ToolSheet } from "@/components/travelers/support/ToolSheet";
import { ACCESSIBLE } from "@/lib/mock-data";

export function AccessFlow({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<"all" | "Step-free" | "Ramp" | "Lift">("all");
  const [picked, setPicked] = useState<string | null>(null);
  const list = filter === "all" ? ACCESSIBLE : ACCESSIBLE.filter((a) => a.tags.includes(filter));
  return (
    <ToolSheet
      title="Accessible routes"
      subtitle="Step-free stations, transport and places"
      onClose={onClose}
    >
      {picked ? (
        <div className="tool-done">
          <span>
            <Accessibility size={22} />
          </span>
          <h3>{picked}</h3>
          <p>
            Step-free route saved for today. We'll route the group around stairs and long transfers.
          </p>
          <button className="secondary-action wide" onClick={() => setPicked(null)}>
            Back to list
          </button>
        </div>
      ) : (
        <>
          <div className="tool-filter mt-4">
            {(["all", "Step-free", "Ramp", "Lift"] as const).map((f) => (
              <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <ul className="tool-list">
            {list.map((a) => (
              <li key={a.name}>
                <span className="tool-list-icon">
                  {a.name.includes("bus") ? (
                    <TramFront size={18} />
                  ) : a.name.includes("station") ? (
                    <Train size={18} />
                  ) : (
                    <MapPin size={18} />
                  )}
                </span>
                <div className="flex-1">
                  <strong>{a.name}</strong>
                  <small>{a.detail}</small>
                  <span className="tool-tags">
                    {a.tags.map((t) => (
                      <i key={t}>
                        <Accessibility size={12} />
                        {t}
                      </i>
                    ))}
                  </span>
                </div>
                <button className="scan-chip" onClick={() => setPicked(a.name)}>
                  <Navigation size={15} /> Use
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </ToolSheet>
  );
}
