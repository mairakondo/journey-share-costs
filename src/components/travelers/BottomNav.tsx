import { Image, MapPin, ShieldCheck, WalletCards } from "lucide-react";

import type { View } from "@/lib/types";

export function BottomNav({
  view,
  setView,
  planBadge = 0,
  onPlanSeen,
}: {
  view: View;
  setView: (v: View) => void;
  planBadge?: number;
  onPlanSeen?: () => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Trip navigation">
      {[
        { id: "plan", label: "Plan", icon: <MapPin /> },
        { id: "costs", label: "Costs", icon: <WalletCards /> },
        { id: "photos", label: "Photos", icon: <Image /> },
        { id: "support", label: "Support", icon: <ShieldCheck /> },
      ].map((item) => (
        <button
          key={item.id}
          className={view === item.id ? "active" : ""}
          onClick={() => {
            if (item.id === "plan") onPlanSeen?.();
            setView(item.id as View);
          }}
        >
          {item.icon}
          <span>{item.label}</span>
          {item.id === "plan" && planBadge > 0 && (
            <i className="nav-badge" aria-label={`${planBadge} new photos in the plan`}>
              {planBadge}
            </i>
          )}
        </button>
      ))}
    </nav>
  );
}
