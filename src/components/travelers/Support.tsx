import { useState } from "react";
import {
  Accessibility,
  HeartPulse,
  Languages,
  Locate,
  Phone,
  ShieldCheck,
  Siren,
  Toilet,
} from "lucide-react";

import { AccessFlow } from "@/components/travelers/support/AccessFlow";
import { LocateFlow } from "@/components/travelers/support/LocateFlow";
import { RestroomFlow } from "@/components/travelers/support/RestroomFlow";
import { TranslateFlow } from "@/components/travelers/support/TranslateFlow";
import type { TripMember } from "@/features/trips/tripsServerFns";
import { formatDistance } from "@/lib/geocode";
import type { Tool, Trip } from "@/lib/types";
import { useEmergencyInfo } from "@/lib/useEmergencyInfo";

export function Support({
  trip,
  members,
  currentUserId,
}: {
  trip: Trip;
  members: TripMember[];
  currentUserId: string | null;
}) {
  const [tool, setTool] = useState<Tool | null>(null);
  const emergency = useEmergencyInfo(trip);
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
            detail: `${members.length} traveler${members.length === 1 ? "" : "s"} in the group`,
          },
          {
            id: "restroom" as Tool,
            icon: <Toilet />,
            title: "Find restrooms",
            detail: "Toilets & accessibility nearby",
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
      <h3 className="support-section-title">Trip inspiration</h3>
      <figure className="mood-board">
        <img src="/moodboards/hawaii-trip-outfits.webp" alt="Hawaii trip outfit mood board" />
        <figcaption>Outfit inspiration to pack around</figcaption>
      </figure>
      <h3 className="support-section-title">Emergency contacts</h3>
      <section className="support-grid">
        {emergency.isLoading && (
          <article className="support-card">
            <span className="support-icon">
              <ShieldCheck />
            </span>
            <div className="flex-1">
              <p className="eyebrow">Looking up local emergency info…</p>
              <p>Finding the nearest hospital and police station.</p>
            </div>
          </article>
        )}
        {!emergency.isLoading && emergency.isError && (
          <article className="support-card">
            <span className="support-icon">
              <ShieldCheck />
            </span>
            <div className="flex-1">
              <p className="eyebrow">Couldn't load local emergency info</p>
              <p>Check your connection and reopen this tab to try again.</p>
            </div>
          </article>
        )}
        {!emergency.isLoading && !emergency.isError && (
          <>
            <article className="support-card">
              <span className="support-icon">
                <HeartPulse />
              </span>
              <div className="flex-1">
                <p className="eyebrow">Nearest hospital</p>
                {emergency.data?.hospital ? (
                  <>
                    <h3>{emergency.data.hospital.name}</h3>
                    <p>{formatDistance(emergency.data.hospital.distanceKm)} away</p>
                    {emergency.data.hospital.tags["phone"] && (
                      <a href={`tel:${emergency.data.hospital.tags["phone"]}`}>
                        <Phone size={16} /> {emergency.data.hospital.tags["phone"]}
                      </a>
                    )}
                  </>
                ) : (
                  <p>No hospital found nearby — call the number below instead.</p>
                )}
              </div>
            </article>
            <article className="support-card">
              <span className="support-icon">
                <Siren />
              </span>
              <div className="flex-1">
                <p className="eyebrow">Nearest police station</p>
                {emergency.data?.police ? (
                  <>
                    <h3>{emergency.data.police.name}</h3>
                    <p>{formatDistance(emergency.data.police.distanceKm)} away</p>
                    {emergency.data.police.tags["phone"] && (
                      <a href={`tel:${emergency.data.police.tags["phone"]}`}>
                        <Phone size={16} /> {emergency.data.police.tags["phone"]}
                      </a>
                    )}
                  </>
                ) : (
                  <p>No station found nearby — call the number below instead.</p>
                )}
              </div>
            </article>
            <article className="support-card">
              <span className="support-icon">
                <Phone />
              </span>
              <div className="flex-1">
                <p className="eyebrow">National emergency</p>
                <h3>
                  Police {emergency.data?.numbers.police} · Medical{" "}
                  {emergency.data?.numbers.medical}
                  {emergency.data?.numbers.fire !== emergency.data?.numbers.medical
                    ? ` · Fire ${emergency.data?.numbers.fire}`
                    : ""}
                </h3>
                <p>{emergency.data?.country ?? "Available 24 hours"}</p>
                <a
                  href={`tel:${emergency.data?.numbers.general ?? emergency.data?.numbers.police}`}
                >
                  <Phone size={16} />{" "}
                  {emergency.data?.numbers.general ?? emergency.data?.numbers.police}
                </a>
              </div>
            </article>
          </>
        )}
      </section>
      {tool === "restroom" && <RestroomFlow trip={trip} onClose={() => setTool(null)} />}
      {tool === "translate" && <TranslateFlow trip={trip} onClose={() => setTool(null)} />}
      {tool === "access" && <AccessFlow trip={trip} onClose={() => setTool(null)} />}
      {tool === "locate" && (
        <LocateFlow
          tripId={trip.id}
          members={members}
          currentUserId={currentUserId}
          onClose={() => setTool(null)}
        />
      )}
    </>
  );
}
