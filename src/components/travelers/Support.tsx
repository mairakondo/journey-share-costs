import { useState } from "react";
import {
  Accessibility,
  HeartPulse,
  Landmark,
  Languages,
  Locate,
  Phone,
  ShieldCheck,
  Toilet,
} from "lucide-react";

import { AccessFlow } from "@/components/travelers/support/AccessFlow";
import { LocateFlow } from "@/components/travelers/support/LocateFlow";
import { RestroomFlow } from "@/components/travelers/support/RestroomFlow";
import { TranslateFlow } from "@/components/travelers/support/TranslateFlow";
import type { Tool } from "@/lib/types";

export function Support() {
  const [tool, setTool] = useState<Tool | null>(null);
  return (
    <>
      <div className="support-intro">
        <span>
          <ShieldCheck size={25} />
        </span>
        <div>
          <h2>Help, when you need it</h2>
          <p>Saved on your device and available offline.</p>
        </div>
      </div>
      <h3 className="support-section-title">Everyday help</h3>
      <section className="tool-grid">
        {[
          {
            id: "translate" as Tool,
            icon: <Languages />,
            title: "Translator",
            detail: "Type, speak or scan a menu",
          },
          {
            id: "locate" as Tool,
            icon: <Locate />,
            title: "Share live location",
            detail: "4 travelers in the group",
          },
          {
            id: "restroom" as Tool,
            icon: <Toilet />,
            title: "Find restrooms",
            detail: "4 nearby, 2 accessible",
          },
          {
            id: "access" as Tool,
            icon: <Accessibility />,
            title: "Accessible routes",
            detail: "Step-free stations & places",
          },
        ].map((t) => (
          <button className="tool-card" key={t.id} onClick={() => setTool(t.id)}>
            <span className="support-icon">{t.icon}</span>
            <span className="flex-1 text-left">
              <strong>{t.title}</strong>
              <small>{t.detail}</small>
            </span>
          </button>
        ))}
      </section>
      <h3 className="support-section-title">Emergency contacts</h3>
      <section className="support-grid">
        {[
          {
            icon: <HeartPulse />,
            label: "Nearest hospital",
            title: "St. Luke's International Hospital",
            detail: "Akashi-cho 9-1 · 2.4 km",
            number: "+81 3 3541 5151",
          },
          {
            icon: <Landmark />,
            label: "U.S. Embassy",
            title: "Embassy of the United States",
            detail: "Akasaka 1-10-5 · 4.1 km",
            number: "+81 3 3224 5000",
          },
          {
            icon: <Phone />,
            label: "National emergency",
            title: "Police 110 · Fire & Ambulance 119",
            detail: "Available 24 hours",
            number: "110",
          },
        ].map((x) => (
          <article className="support-card" key={x.label}>
            <span className="support-icon">{x.icon}</span>
            <div className="flex-1">
              <p className="eyebrow">{x.label}</p>
              <h3>{x.title}</h3>
              <p>{x.detail}</p>
              <a href={`tel:${x.number}`}>
                <Phone size={16} /> {x.number}
              </a>
            </div>
          </article>
        ))}
      </section>
      {tool === "restroom" && <RestroomFlow onClose={() => setTool(null)} />}
      {tool === "translate" && <TranslateFlow onClose={() => setTool(null)} />}
      {tool === "access" && <AccessFlow onClose={() => setTool(null)} />}
      {tool === "locate" && <LocateFlow onClose={() => setTool(null)} />}
    </>
  );
}
