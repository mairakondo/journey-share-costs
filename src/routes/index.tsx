import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  CloudSun,
  Download,
  HeartPulse,
  Image,
  Landmark,
  MapPin,
  MoreHorizontal,
  Phone,
  Plane,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  WifiOff,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import lisbon from "@/assets/lisbon.jpg";
import kyoto from "@/assets/kyoto.jpg";
import copenhagen from "@/assets/copenhagen.jpg";

type View = "home" | "plan" | "costs" | "photos" | "emergency" | "summary";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Roamly — Plan trips together" },
      { name: "description", content: "Plan group trips, split costs, and keep every memory together with Roamly." },
      { property: "og:title", content: "Roamly — Plan trips together" },
      { property: "og:description", content: "A warm, simple home for group itineraries, expenses, and travel photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TravelersApp,
});

const members = [
  { name: "You", initials: "MK", tone: "bg-primary text-primary-foreground" },
  { name: "Jon", initials: "JR", tone: "bg-sky text-sky-foreground" },
  { name: "Ana", initials: "AL", tone: "bg-money text-money-foreground" },
  { name: "Luis", initials: "LM", tone: "bg-sun text-sun-foreground" },
];

function IconButton({ label, children, onClick }: { label: string; children: ReactNode; onClick?: () => void }) {
  return <button aria-label={label} title={label} onClick={onClick} className="icon-button">{children}</button>;
}

function TravelersApp() {
  const [view, setView] = useState<View>("home");
  const [createOpen, setCreateOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [offline, setOffline] = useState(true);

  const openTrip = () => setView("plan");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="app-frame">
        {offline && view !== "home" && (
          <button className="offline-banner" onClick={() => setOffline(false)} aria-label="Dismiss offline notice">
            <WifiOff size={16} /> Offline mode · Your saved plans are available <X size={15} className="ml-auto" />
          </button>
        )}

        <header className="topbar">
          <button onClick={() => setView("home")} className="brand" aria-label="Roamly home">
            <span className="brand-mark"><Plane size={19} /></span>
            <span>Travelers</span>
          </button>
          <div className="flex items-center gap-2">
            {view !== "home" && <span className="hidden text-sm font-semibold text-muted-foreground sm:inline">Lisbon · May 18–23</span>}
            <IconButton label="Search"><Search size={20} /></IconButton>
            <button className="avatar">MK</button>
          </div>
        </header>

        {view === "home" ? (
          <Dashboard onOpen={openTrip} onCreate={() => setCreateOpen(true)} onSummary={() => setView("summary")} />
        ) : (
          <TripShell view={view} setView={setView} onScan={() => setScanOpen(true)} />
        )}

        {view !== "home" && view !== "summary" && <BottomNav view={view} setView={setView} />}
      </div>
      {createOpen && <CreateTrip onClose={() => setCreateOpen(false)} onCreate={() => { setCreateOpen(false); setView("plan"); }} />}
      {scanOpen && <ReceiptConfirm onClose={() => setScanOpen(false)} />}
    </main>
  );
}

function Dashboard({ onOpen, onCreate, onSummary }: { onOpen: () => void; onCreate: () => void; onSummary: () => void }) {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  return (
    <div className="page-pad pb-28">
      <section className="hero-row">
        <div>
          <p className="eyebrow">Wednesday, September 2</p>
          <h1 className="page-title">Where to next?</h1>
          <p className="mt-2 max-w-md text-muted-foreground">Keep every plan, payment and memory in one happy place.</p>
        </div>
        <button onClick={onCreate} className="primary-action"><Plus size={20} /> Create trip</button>
      </section>

      <div className="segmented" aria-label="Trip filter">
        <button className={filter === "upcoming" ? "active" : ""} onClick={() => setFilter("upcoming")}>Upcoming <span>2</span></button>
        <button className={filter === "past" ? "active" : ""} onClick={() => setFilter("past")}>Past <span>4</span></button>
      </div>

      {filter === "upcoming" ? (
        <section className="trip-grid">
          <button className="trip-card featured" onClick={onOpen}>
            <img src={lisbon} alt="Yellow tram on a golden Lisbon street" width={1280} height={800} />
            <div className="trip-overlay">
              <div className="status-pill"><span /> In 12 days</div>
              <div>
                <p className="text-sm font-semibold">May 18–23 · 6 days</p>
                <h2>Lisbon</h2>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="avatar-stack">{members.map((m) => <span key={m.name} className={m.tone}>{m.initials}</span>)}</div>
                  <span className="open-label">Open trip <ArrowRight size={17} /></span>
                </div>
              </div>
            </div>
          </button>
          <button className="trip-card" onClick={onOpen}>
            <img src={copenhagen} alt="Colorful Copenhagen harbor" width={1280} height={800} loading="lazy" />
            <div className="trip-overlay compact">
              <div className="status-pill"><span /> In 68 days</div>
              <div><p className="text-xs font-semibold">Jul 13–17</p><h2>Copenhagen</h2><p className="mt-1 text-sm">3 travelers</p></div>
            </div>
          </button>
          <article className="budget-card">
            <div className="flex items-center justify-between"><span className="money-icon"><WalletCards size={20} /></span><button aria-label="Budget options"><MoreHorizontal size={20} /></button></div>
            <div><p className="eyebrow text-money">Trip budget</p><h3>€1,240 <span>of €1,800</span></h3></div>
            <div className="progress"><span /></div>
            <div className="flex justify-between text-xs font-semibold text-muted-foreground"><span>69% planned</span><span>€560 left</span></div>
          </article>
        </section>
      ) : (
        <section className="trip-grid">
          <button className="trip-card featured" onClick={onSummary}>
            <img src={kyoto} alt="Cherry blossoms in a quiet Kyoto lane" width={1280} height={800} loading="lazy" />
            <div className="trip-overlay"><div className="status-pill muted">Completed</div><div><p className="text-sm font-semibold">Mar 24–31 · 8 days</p><h2>Kyoto</h2><span className="open-label mt-3">View memories <ArrowRight size={17} /></span></div></div>
          </button>
        </section>
      )}
    </div>
  );
}

function TripShell({ view, setView, onScan }: { view: View; setView: (v: View) => void; onScan: () => void }) {
  return (
    <div className="page-pad trip-page pb-28">
      <div className="trip-heading">
        <div className="flex min-w-0 items-center gap-3"><IconButton label="Back to trips" onClick={() => setView("home")}><ArrowLeft size={20} /></IconButton><div className="min-w-0"><p className="eyebrow">May 18–23 · 4 travelers</p><h1 className="truncate text-3xl font-extrabold">Lisbon escape</h1></div></div>
        <div className="avatar-stack hidden sm:flex">{members.map((m) => <span key={m.name} className={m.tone}>{m.initials}</span>)}</div>
      </div>
      {view === "plan" && <Itinerary setView={setView} />}
      {view === "emergency" && <Emergency />}
      {view === "costs" && <Costs onScan={onScan} />}
      {view === "photos" && <Photos />}
      {view === "summary" && <Summary setView={setView} />}
    </div>
  );
}

type Stop = { id: string; day: number; time: string; title: string; place: string; tag: string };

const initialStops: Stop[] = [
  { id: "s1", day: 1, time: "09:30", title: "Pastéis de Belém", place: "Rua de Belém 84", tag: "Local favorite" },
  { id: "s2", day: 1, time: "11:00", title: "Jerónimos Monastery", place: "Praça do Império", tag: "Must see" },
  { id: "s3", day: 1, time: "14:30", title: "LX Factory", place: "Rua Rodrigues de Faria 103", tag: "Explore" },
  { id: "s4", day: 0, time: "16:00", title: "Check in & Baixa stroll", place: "Praça do Comércio", tag: "Easy start" },
];

function Itinerary({ setView }: { setView: (v: View) => void }) {
  const [day, setDay] = useState(1);
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [editing, setEditing] = useState<Stop | null>(null);

  const dayStops = stops.filter((s) => s.day === day).sort((a, b) => a.time.localeCompare(b.time));

  const saveStop = (stop: Stop) => {
    setStops((prev) => (prev.some((s) => s.id === stop.id) ? prev.map((s) => (s.id === stop.id ? stop : s)) : [...prev, stop]));
    setEditing(null);
  };
  const deleteStop = (id: string) => setStops((prev) => prev.filter((s) => s.id !== id));

  return <>
    <div className="section-tabs"><button className="active">Itinerary</button><button onClick={() => setView("emergency")}>Emergency info</button></div>
    <div className="day-strip">{["Sun 18", "Mon 19", "Tue 20", "Wed 21", "Thu 22"].map((d, i) => <button key={d} onClick={() => setDay(i)} className={day === i ? "active" : ""}><span>Day {i + 1}</span>{d}</button>)}</div>
    <div className="content-grid">
      <section>
        <div className="date-heading"><div><p className="eyebrow">Day {day + 1}</p><h2>{day === 0 ? "Olá, Lisboa!" : ["Belém & riverside", "Alfama slow day", "Sintra day trip", "Last tastes"][day - 1]}</h2></div><div className="flex items-center gap-3"><div className="weather"><CloudSun size={23} /><span>24°</span><small>Sunny</small></div><button className="secondary-action" onClick={() => setEditing({ id: `s${Date.now()}`, day, time: "10:00", title: "", place: "", tag: "Explore" })}><Plus size={17} /> Add</button></div></div>
        <div className="timeline">{dayStops.map((stop) => <article className="stop-card" key={stop.id}><div className="time">{stop.time}</div><div className="timeline-dot"><span /></div><div className="stop-body"><div className="stop-icon"><MapPin size={16} /></div><div className="min-w-0 flex-1"><h3>{stop.title}</h3><p><MapPin size={14} /> {stop.place}</p>{stop.tag && <span className="spot-badge">{stop.tag}</span>}</div><div className="stop-actions"><IconButton label={`Edit ${stop.title}`} onClick={() => setEditing(stop)}><Pencil size={16} /></IconButton><IconButton label={`Delete ${stop.title}`} onClick={() => deleteStop(stop.id)}><Trash2 size={16} /></IconButton></div></div></article>)}
          {dayStops.length === 0 && <p className="empty-day">No activities yet for this day. Tap “Add” to plan something.</p>}
        </div>
      </section>
      <aside className="day-note"><p className="eyebrow">Today’s note</p><h3>Take it slow.</h3><p>The tram gets busy after 10. We saved the walking route offline.</p><div className="mini-map"><MapPin size={25} /><span>3 stops · 4.2 km</span></div></aside>
    </div>
  </>;
}

function Emergency() {
  return <><div className="section-tabs"><button>Itinerary</button><button className="active">Emergency info</button></div><div className="emergency-intro"><span><ShieldCheck size={25} /></span><div><h2>Help, when you need it</h2><p>Saved on your device and available offline.</p></div></div><section className="emergency-grid">
    {[{ icon: <HeartPulse />, label: "Nearest hospital", title: "Hospital de São José", detail: "Rua José António Serrano · 2.1 km", number: "+351 218 841 000" }, { icon: <Landmark />, label: "U.S. Embassy", title: "Embassy of the United States", detail: "Av. das Forças Armadas · 4.8 km", number: "+351 217 273 300" }, { icon: <Phone />, label: "National emergency", title: "Police · Fire · Ambulance", detail: "Available 24 hours", number: "112" }].map((x) => <article className="emergency-card" key={x.label}><span className="emergency-icon">{x.icon}</span><div className="flex-1"><p className="eyebrow">{x.label}</p><h3>{x.title}</h3><p>{x.detail}</p><a href={`tel:${x.number}`}><Phone size={16} /> {x.number}</a></div></article>)}
  </section></>;
}

function Costs({ onScan }: { onScan: () => void }) {
  return <><div className="cost-hero"><div><p className="eyebrow">Group expenses</p><h2>Keep it easy,<br />keep it fair.</h2><p>Snap a receipt and we’ll help with the rest.</p></div><button onClick={onScan} className="scan-button"><span><Camera size={25} /></span><b>Scan receipt</b><small>Camera or photo library</small><ArrowRight size={19} /></button></div>
    <div className="cost-layout"><section><div className="section-heading"><div><p className="eyebrow">Settle up</p><h2>Running balance</h2></div><span className="settled-pill">€286.40 total</span></div><div className="balance-list"><article><span className="bg-sky text-sky-foreground">JR</span><div><h3>Jon owes you</h3><p>3 shared expenses</p></div><strong className="positive">+ €48.20</strong></article><article><span className="bg-money text-money-foreground">AL</span><div><h3>You owe Ana</h3><p>Dinner at Prado</p></div><strong>− €23.75</strong></article><article><span className="bg-sun text-sun-foreground">LM</span><div><h3>Luis is settled</h3><p>All caught up</p></div><strong className="muted-amount">€0</strong></article></div></section><aside className="future-space"><ReceiptText size={22} /><p className="eyebrow">Coming next</p><h3>Flexible splitting</h3><p>Equal, shares or percentages — with borrowed and lent tags.</p></aside></div>
  </>;
}

function Photos() {
  const [cluster, setCluster] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);
  const photos = [lisbon, lisbon, copenhagen, kyoto, lisbon, copenhagen];
  return <><div className="section-heading photo-heading"><div><p className="eyebrow">Shared memories</p><h2>Photo timeline</h2></div><button className="secondary-action"><Plus size={18} /> Add photos</button></div><section className="photo-days"><article><button className="photo-day-title" onClick={() => setCluster(cluster === 1 ? null : 1)}><span><b>Day 1</b><small>Arrival & Baixa · 18 photos</small></span><ChevronRight size={19} className={cluster === 1 ? "rotate-90" : ""} /></button><div className="photo-grid">{photos.slice(0, cluster === 1 ? 6 : 3).map((photo, i) => <button key={i} className="photo-tile" onClick={() => setMoved(!moved)}><img src={photo} alt={`Lisbon group memory ${i + 1}`} width={1280} height={800} loading="lazy" />{i === 2 && <span>+15</span>}{moved && i === 0 && <small><Check size={13} /> Moved to Day 2</small>}</button>)}</div><p className="gesture-hint">Tap a photo to reassign it to the next day</p></article><article><button className="photo-day-title" onClick={() => setCluster(cluster === 2 ? null : 2)}><span><b>Day 2</b><small>Belém & riverside · 26 photos</small></span><ChevronRight size={19} /></button><div className="photo-grid">{[copenhagen, lisbon, kyoto].map((photo, i) => <button key={i} className="photo-tile"><img src={photo} alt={`Riverside memory ${i + 1}`} width={1280} height={800} loading="lazy" /></button>)}</div></article></section></>;
}

function BottomNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  return <nav className="bottom-nav" aria-label="Trip navigation">{[{ id: "plan", label: "Plan", icon: <MapPin /> }, { id: "costs", label: "Costs", icon: <WalletCards /> }, { id: "photos", label: "Photos", icon: <Image /> }].map((item) => <button key={item.id} className={(view === item.id || (view === "emergency" && item.id === "plan")) ? "active" : ""} onClick={() => setView(item.id as View)}>{item.icon}<span>{item.label}</span></button>)}</nav>;
}

function CreateTrip({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Create a trip"><div className="modal-sheet"><div className="modal-head"><div><p className="eyebrow">New adventure</p><h2>Create a trip</h2></div><IconButton label="Close" onClick={onClose}><X size={20} /></IconButton></div><div className="form-grid"><label>Trip name<input defaultValue="Lisbon escape" /></label><label>Destination<div className="input-icon"><MapPin size={17} /><input defaultValue="Lisbon, Portugal" /></div></label><div className="two-cols"><label>Starts<input type="date" defaultValue="2026-05-18" /></label><label>Ends<input type="date" defaultValue="2026-05-23" /></label></div><label>Invite members<div className="invite-row"><div className="avatar-stack">{members.slice(0, 3).map((m) => <span key={m.name} className={m.tone}>{m.initials}</span>)}</div><button className="invite-button"><Plus size={16} /> Add people</button></div></label></div><button className="primary-action wide" onClick={onCreate}>Create trip <ArrowRight size={19} /></button></div></div>;
}

function ReceiptConfirm({ onClose }: { onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState([0, 1, 2]);
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm scanned receipt"><div className="modal-sheet receipt-sheet"><div className="scan-success"><span><ReceiptText size={26} /></span><div><p className="eyebrow">Receipt found</p><h2>{confirmed ? "Expense added!" : "Check the details"}</h2></div><IconButton label="Close" onClick={onClose}><X size={20} /></IconButton></div>{confirmed ? <div className="confirmation"><span><Check size={34} /></span><p>€86.40 split between 3 travelers</p><button className="primary-action wide" onClick={onClose}>Done</button></div> : <><div className="amount-edit"><label>Amount</label><div><span>€</span><input defaultValue="86.40" inputMode="decimal" /></div><input defaultValue="Dinner at Prado" aria-label="Expense name" /></div><div className="member-picker"><p className="eyebrow">Who was it for?</p><div>{members.map((m, i) => <button key={m.name} className={selected.includes(i) ? "selected" : ""} onClick={() => setSelected(selected.includes(i) ? selected.filter(x => x !== i) : [...selected, i])}><span className={m.tone}>{m.initials}</span>{m.name}<i>{selected.includes(i) && <Check size={12} />}</i></button>)}</div></div><button className="money-action" onClick={() => setConfirmed(true)}><Check size={20} /> Confirm expense</button></>}</div></div>;
}

function Summary({ setView }: { setView: (v: View) => void }) {
  const days = [
    { day: "Day 1", title: "Arrival & Gion lanterns", detail: "3 stops · €142 spent · 22 photos" },
    { day: "Day 3", title: "Arashiyama bamboo grove", detail: "4 stops · €248 spent · 41 photos" },
    { day: "Day 6", title: "Fushimi Inari at sunrise", detail: "2 stops · €68 spent · 38 photos" },
    { day: "Day 8", title: "Last matcha & goodbyes", detail: "3 stops · €193 spent · 19 photos" },
  ];
  const spend = [
    { label: "Stays", amount: "€1,180", pct: 41 },
    { label: "Food & drinks", amount: "€742", pct: 26 },
    { label: "Transport", amount: "€498", pct: 18 },
    { label: "Activities", amount: "€426", pct: 15 },
  ];
  return <>
    <section className="summary-wrap"><div className="summary-photo"><img src={kyoto} alt="Cherry blossoms over a Kyoto lane" width={1280} height={800} /><div><span className="status-pill muted">Trip complete</span><p>March 24–31 · 8 days</p><h2>Kyoto,<br />together.</h2></div></div><div className="summary-content"><p className="eyebrow">After trip</p><h2>One for the books</h2><div className="summary-stats"><article><WalletCards /><strong>€2,846</strong><span>Total spent</span></article><article><Image /><strong>184</strong><span>Photos shared</span></article><article><MapPin /><strong>27</strong><span>Places visited</span></article></div><button className="primary-action wide"><Download size={19} /> Export highlights</button><button className="summary-back" onClick={() => setView("home")}><ArrowLeft size={17} /> Back to all trips</button></div></section>
    <div className="recap">
      <article className="recap-card"><p className="eyebrow">Where you went</p><h3>Day-by-day recap</h3><div className="recap-days">{days.map((d) => <article key={d.day}><b>{d.day.replace("Day ", "D")}</b><div><h4>{d.title}</h4><p>{d.detail}</p></div><ChevronRight size={18} className="ml-auto text-muted-foreground" /></article>)}</div></article>
      <article className="recap-card"><p className="eyebrow text-money">Planned €3,000 · actual €2,846</p><h3>Where the money went</h3><div className="recap-spend">{spend.map((s) => <article key={s.label}><header><span>{s.label}</span>{s.amount}</header><div className="recap-bar"><span style={{ width: `${s.pct}%` }} /></div></article>)}</div></article>
      <article className="recap-card"><p className="eyebrow">Who settled up</p><h3>Final balances</h3><div className="recap-people">{[{ m: members[1]!, text: "Jon paid you back", amount: "+ €48.20" }, { m: members[2]!, text: "You paid Ana", amount: "− €23.75" }, { m: members[3]!, text: "Luis settled", amount: "€0" }].map((r) => <article key={r.m.name}><span className={r.m.tone}>{r.m.initials}</span>{r.text}<strong>{r.amount}</strong></article>)}</div></article>
      <article className="recap-card"><p className="eyebrow">184 shared memories</p><h3>Photo highlights</h3><div className="recap-photos">{[kyoto, lisbon, copenhagen, lisbon, kyoto, copenhagen].map((p, i) => <img key={i} src={p} alt={`Kyoto trip memory ${i + 1}`} width={640} height={640} loading="lazy" />)}</div></article>
    </div>
  </>;
}
