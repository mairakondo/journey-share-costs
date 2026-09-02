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
  Pencil,
  Phone,
  Plane,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Trash2,
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
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

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
          <TripShell view={view} setView={setView} onScan={() => setScanOpen(true)} stops={stops} setStops={setStops} photos={photos} setPhotos={setPhotos} expenses={expenses} setExpenses={setExpenses} />
        )}

        {view !== "home" && view !== "summary" && <BottomNav view={view} setView={setView} />}
      </div>
      {createOpen && <CreateTrip onClose={() => setCreateOpen(false)} onCreate={() => { setCreateOpen(false); setView("plan"); }} />}
      {scanOpen && <ReceiptConfirm onClose={() => setScanOpen(false)} stops={stops} onSave={(e) => setExpenses((prev) => [...prev, e])} />}
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

function TripShell({ view, setView, onScan, stops, setStops, photos, setPhotos, expenses, setExpenses }: { view: View; setView: (v: View) => void; onScan: () => void; stops: Stop[]; setStops: (fn: (p: Stop[]) => Stop[]) => void; photos: Photo[]; setPhotos: (fn: (p: Photo[]) => Photo[]) => void; expenses: Expense[]; setExpenses: (fn: (p: Expense[]) => Expense[]) => void }) {
  return (
    <div className="page-pad trip-page pb-28">
      <div className="trip-heading">
        <div className="flex min-w-0 items-center gap-3"><IconButton label="Back to trips" onClick={() => setView("home")}><ArrowLeft size={20} /></IconButton><div className="min-w-0"><p className="eyebrow">May 18–23 · 4 travelers</p><h1 className="truncate text-3xl font-extrabold">Lisbon escape</h1></div></div>
        <div className="avatar-stack hidden sm:flex">{members.map((m) => <span key={m.name} className={m.tone}>{m.initials}</span>)}</div>
      </div>
      {view === "plan" && <Itinerary setView={setView} stops={stops} setStops={setStops} photos={photos} expenses={expenses} setExpenses={setExpenses} />}
      {view === "emergency" && <Emergency />}
      {view === "costs" && <Costs onScan={onScan} stops={stops} expenses={expenses} setView={setView} />}
      {view === "photos" && <Photos stops={stops} photos={photos} setPhotos={setPhotos} />}
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

type Photo = { id: string; src: string; day: number; time: string; place: string; stopId?: string | null };

type SplitMode = "equal" | "shares" | "percent";
type Split = { mode: SplitMode; participants: string[]; values: Record<string, number> };

type Expense = { id: string; day: number; time: string; place: string; label: string; amount: number; payer: string; source: "scan" | "manual"; stopId?: string | null; split: Split };

const equalSplit = (names: string[] = members.map((m) => m.name)): Split => ({ mode: "equal", participants: names, values: {} });

const normalizeSplit = (split?: Split | null): Split => ({
  mode: split?.mode ?? "equal",
  participants: split?.participants ?? members.map((m) => m.name),
  values: split?.values ?? {},
});


function splitShares(rawSplit: Split | undefined, amount: number): Record<string, number> {
  const split = normalizeSplit(rawSplit);
  const people = split.participants;
  if (people.length === 0) return {};
  if (split.mode === "equal") {
    const each = amount / people.length;
    return Object.fromEntries(people.map((n) => [n, each]));
  }
  const weights = people.map((n) => Math.max(0, Number(split.values[n] ?? (split.mode === "percent" ? 100 / people.length : 1))));
  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return Object.fromEntries(people.map((n) => [n, 0]));
  return Object.fromEntries(people.map((n, i) => [n, (amount * weights[i]!) / total]));
}

const splitLabel = (raw: Split | undefined) => {
  const split = normalizeSplit(raw);
  return `${split.participants.length} ${split.participants.length === 1 ? "traveler" : "travelers"} · ${split.mode === "equal" ? "equally" : split.mode === "shares" ? "by number" : "by percentage"}`;
};

function SplitPicker({ split: rawSplit, amount, onChange }: { split: Split | undefined; amount: number; onChange: (s: Split) => void }) {
  const split = normalizeSplit(rawSplit);
  const shares = splitShares(split, amount);

  const toggle = (name: string) => {
    const participants = split.participants.includes(name) ? split.participants.filter((n) => n !== name) : [...split.participants, name];
    onChange({ ...split, participants });
  };
  const setValue = (name: string, v: number) => onChange({ ...split, values: { ...split.values, [name]: v } });
  const percentTotal = split.participants.reduce((s, n) => s + Number(split.values[n] ?? 0), 0);
  return <div className="split-picker">
    <div className="split-modes" role="group" aria-label="Split type">
      {([["equal", "Equally"], ["shares", "By number"], ["percent", "By percentage"]] as [SplitMode, string][]).map(([mode, label]) =>
        <button key={mode} className={split.mode === mode ? "active" : ""} onClick={() => onChange({ ...split, mode, values: mode === "percent" ? Object.fromEntries(split.participants.map((n) => [n, Math.round((100 / Math.max(1, split.participants.length)) * 10) / 10])) : Object.fromEntries(split.participants.map((n) => [n, 1])) })}>{label}</button>)}
    </div>
    <div className="split-rows">
      {members.map((m) => {
        const on = split.participants.includes(m.name);
        return <div key={m.name} className={on ? "split-row on" : "split-row"}>
          <button className="split-person" onClick={() => toggle(m.name)} aria-pressed={on}><span className={m.tone}>{m.initials}</span>{m.name}<i>{on && <Check size={12} />}</i></button>
          {on && split.mode !== "equal" && <div className="split-value"><input inputMode="decimal" aria-label={`${split.mode === "percent" ? "Percentage" : "Shares"} for ${m.name}`} value={String(split.values[m.name] ?? "")} onChange={(e) => setValue(m.name, Number(e.target.value.replace(",", ".")) || 0)} /><small>{split.mode === "percent" ? "%" : "×"}</small></div>}
          {on && <strong>{euro(shares[m.name] ?? 0)}</strong>}
        </div>;
      })}
    </div>
    {split.participants.length === 0 && <p className="split-hint warn">Pick at least one traveler.</p>}
    {split.mode === "percent" && split.participants.length > 0 && <p className={Math.abs(percentTotal - 100) > 0.5 ? "split-hint warn" : "split-hint"}>Percentages total {Math.round(percentTotal * 10) / 10}%{Math.abs(percentTotal - 100) > 0.5 ? " — we’ll scale it to the amount." : ""}</p>}
  </div>;
}


const initialPhotos: Photo[] = [
  { id: "p1", src: lisbon, day: 0, time: "16:20", place: "Praça do Comércio" },
  { id: "p2", src: lisbon, day: 0, time: "16:55", place: "Praça do Comércio, Baixa" },
  { id: "p3", src: copenhagen, day: 0, time: "21:10", place: "Bairro Alto" },
  { id: "p4", src: lisbon, day: 1, time: "09:40", place: "Rua de Belém 84" },
  { id: "p5", src: kyoto, day: 1, time: "11:25", place: "Praça do Império" },
  { id: "p6", src: copenhagen, day: 1, time: "14:50", place: "Rua Rodrigues de Faria 103" },
  { id: "p7", src: lisbon, day: 1, time: "15:30", place: "LX Factory" },
];

const initialExpenses: Expense[] = [
  { id: "e1", day: 1, time: "09:45", place: "Rua de Belém 84", label: "Pastéis & coffee", amount: 18.6, payer: "Maira", source: "scan", split: equalSplit() },
  { id: "e2", day: 1, time: "11:10", place: "Praça do Império", label: "Monastery tickets", amount: 40, payer: "Jon", source: "scan", split: equalSplit() },
  { id: "e3", day: 1, time: "14:55", place: "LX Factory", label: "Lunch at Rio Maravilha", amount: 86.4, payer: "Ana", source: "scan", split: { mode: "shares", participants: ["You", "Jon", "Ana"], values: { You: 1, Jon: 2, Ana: 1 } } },
  { id: "e4", day: 0, time: "16:15", place: "Praça do Comércio", label: "Airport taxi", amount: 32, payer: "Maira", source: "manual", split: equalSplit(["You", "Jon"]) },
  { id: "e5", day: 1, time: "20:30", place: "Bairro Alto", label: "Late drinks", amount: 24.5, payer: "Luis", source: "manual", split: { mode: "percent", participants: ["You", "Luis"], values: { You: 40, Luis: 60 } } },

];

const minutes = (t: string) => {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m ?? 0);
};

const placeScore = (a: string, b: string) => {
  const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  const wordsA = norm(a);
  const wordsB = new Set(norm(b));
  const hits = wordsA.filter((w) => wordsB.has(w)).length;
  return wordsA.length ? hits / wordsA.length : 0;
};

type Taggable = { day: number; time: string; place: string; stopId?: string | null };

function resolveStop(item: Taggable, stops: Stop[]): Stop | null {
  if (item.stopId) return stops.find((s) => s.id === item.stopId) ?? null;
  const sameDay = stops.filter((s) => s.day === item.day);
  let best: { stop: Stop; score: number } | null = null;
  for (const stop of sameDay) {
    const gap = Math.abs(minutes(item.time) - minutes(stop.time));
    if (gap > 120) continue;
    const score = placeScore(item.place, `${stop.place} ${stop.title}`) * 2 + (1 - gap / 120);
    if (!best || score > best.score) best = { stop, score };
  }
  return best && best.score > 0.6 ? best.stop : null;
}

const euro = (n: number) => `€${n.toFixed(2)}`;

function groupPhotosByStop(dayPhotos: Photo[], stops: Stop[]) {
  const groups: { stop: Stop | null; photos: Photo[] }[] = [];
  const push = (stop: Stop | null, photo: Photo) => {
    const key = stop?.id ?? null;
    const found = groups.find((g) => (g.stop?.id ?? null) === key);
    if (found) found.photos.push(photo);
    else groups.push({ stop, photos: [photo] });
  };
  for (const photo of dayPhotos) push(resolveStop(photo, stops), photo);
  return groups.sort((a, b) => (a.stop ? a.stop.time : "99:99").localeCompare(b.stop ? b.stop.time : "99:99"));
}


function Itinerary({ setView, stops, setStops, photos, expenses, setExpenses }: { setView: (v: View) => void; stops: Stop[]; setStops: (fn: (p: Stop[]) => Stop[]) => void; photos: Photo[]; expenses: Expense[]; setExpenses: (fn: (p: Expense[]) => Expense[]) => void }) {
  const [day, setDay] = useState(1);
  const [editing, setEditing] = useState<Stop | null>(null);
  const [editingCost, setEditingCost] = useState<Expense | null>(null);

  const dayStops = stops.filter((s) => s.day === day).sort((a, b) => a.time.localeCompare(b.time));
  const dayExpenses = expenses.filter((e) => e.day === day);
  const stopExpenses = (id: string) => dayExpenses.filter((e) => resolveStop(e, stops)?.id === id).sort((a, b) => a.time.localeCompare(b.time));
  const looseExpenses = dayExpenses.filter((e) => !resolveStop(e, stops)).sort((a, b) => a.time.localeCompare(b.time));
  const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const saveStop = (stop: Stop) => {
    setStops((prev) => (prev.some((s) => s.id === stop.id) ? prev.map((s) => (s.id === stop.id ? stop : s)) : [...prev, stop]));
    setEditing(null);
  };
  const deleteStop = (id: string) => setStops((prev) => prev.filter((s) => s.id !== id));
  const saveExpense = (e: Expense) => {
    setExpenses((prev) => (prev.some((x) => x.id === e.id) ? prev.map((x) => (x.id === e.id ? e : x)) : [...prev, e]));
    setEditingCost(null);
  };
  const deleteExpense = (id: string) => setExpenses((prev) => prev.filter((x) => x.id !== id));
  const newExpense = (stop?: Stop): Expense => ({ id: `e${Date.now()}`, day, time: stop?.time ?? "12:00", place: stop?.place ?? "", label: "", amount: 0, payer: "Maira", source: "manual", stopId: stop?.id ?? null, split: equalSplit() });

  const costRow = (e: Expense) => <button key={e.id} className="cost-chip" onClick={() => setEditingCost(e)} aria-label={`Edit cost ${e.label}`}>
    <ReceiptText size={14} /><span>{e.label || "Untitled cost"}</span><small>{e.time} · {e.payer}{e.source === "scan" ? " · receipt" : ""}</small><strong>{euro(e.amount)}</strong>
  </button>;

  return <>
    <div className="section-tabs"><button className="active">Itinerary</button><button onClick={() => setView("emergency")}>Emergency info</button></div>
    <div className="day-strip">{["Sun 18", "Mon 19", "Tue 20", "Wed 21", "Thu 22"].map((d, i) => <button key={d} onClick={() => setDay(i)} className={day === i ? "active" : ""}><span>Day {i + 1}</span>{d}</button>)}</div>
    <div className="content-grid">
      <section>
        <div className="date-heading"><div><p className="eyebrow">Day {day + 1} · {euro(dayTotal)} spent</p><h2>{day === 0 ? "Olá, Lisboa!" : ["Belém & riverside", "Alfama slow day", "Sintra day trip", "Last tastes"][day - 1]}</h2></div><div className="flex items-center gap-3"><div className="weather"><CloudSun size={23} /><span>24°</span><small>Sunny</small></div><button className="secondary-action" onClick={() => setEditing({ id: `s${Date.now()}`, day, time: "10:00", title: "", place: "", tag: "Explore" })}><Plus size={17} /> Add</button></div></div>
        <div className="timeline">{dayStops.map((stop) => <article className="stop-card" key={stop.id}><div className="time">{stop.time}</div><div className="timeline-dot"><span /></div><div className="stop-body"><div className="stop-icon"><MapPin size={16} /></div><div className="min-w-0 flex-1"><h3 className="stop-title-row"><span className="truncate">{stop.title}</span>{stop.tag && <span className="spot-badge">{stop.tag}</span>}</h3><p><MapPin size={14} /> {stop.place}</p>{photos.filter((p) => resolveStop(p, stops)?.id === stop.id).length > 0 && <div className="stop-photos">{photos.filter((p) => resolveStop(p, stops)?.id === stop.id).slice(0, 3).map((p) => <img key={p.id} src={p.src} alt={`${stop.title} photo`} width={80} height={80} loading="lazy" />)}<small>{photos.filter((p) => resolveStop(p, stops)?.id === stop.id).length} photos matched</small></div>}
          <div className="stop-costs">{stopExpenses(stop.id).map(costRow)}<button className="add-cost" onClick={() => setEditingCost(newExpense(stop))}><Plus size={14} /> Add cost</button></div>
        </div><div className="stop-actions"><IconButton label={`Edit ${stop.title}`} onClick={() => setEditing(stop)}><Pencil size={16} /></IconButton><IconButton label={`Delete ${stop.title}`} onClick={() => deleteStop(stop.id)}><Trash2 size={16} /></IconButton></div></div></article>)}
          {dayStops.length === 0 && <p className="empty-day">No activities yet for this day. Tap “Add” to plan something.</p>}
          {looseExpenses.length > 0 && <article className="stop-card"><div className="time">—</div><div className="timeline-dot"><span /></div><div className="stop-body"><div className="stop-icon"><ReceiptText size={16} /></div><div className="min-w-0 flex-1"><h3>Costs without an activity</h3><p>Matched by place and time when you plan one.</p><div className="stop-costs">{looseExpenses.map(costRow)}</div></div></div></article>}
        </div>
      </section>
      <aside className="day-note"><p className="eyebrow">Today’s note</p><h3>Take it slow.</h3><p>The tram gets busy after 10. We saved the walking route offline.</p><div className="mini-map"><MapPin size={25} /><span>{dayStops.length} stops · 4.2 km</span></div><button className="secondary-action mt-4" onClick={() => setEditingCost(newExpense())}><Plus size={17} /> Add cost to this day</button></aside>
    </div>
    {editing && <StopEditor stop={editing} onClose={() => setEditing(null)} onSave={saveStop} onDelete={stops.some((s) => s.id === editing.id) ? () => { deleteStop(editing.id); setEditing(null); } : undefined} />}
    {editingCost && <ExpenseEditor expense={editingCost} stops={stops} onClose={() => setEditingCost(null)} onSave={saveExpense} onDelete={expenses.some((x) => x.id === editingCost.id) ? () => { deleteExpense(editingCost.id); setEditingCost(null); } : undefined} />}
  </>;
}

const sampleReceipts = [
  { label: "Lunch at Rio Maravilha", place: "LX Factory", amount: 86.4, time: "14:55" },
  { label: "Tram 28 tickets", place: "Praça Martim Moniz", amount: 12, time: "10:20" },
  { label: "Dinner at Time Out Market", place: "Av. 24 de Julho 49", amount: 64.8, time: "20:10" },
];

function ExpenseEditor({ expense, stops, onClose, onSave, onDelete }: { expense: Expense; stops: Stop[]; onClose: () => void; onSave: (e: Expense) => void; onDelete?: (() => void) | undefined }) {
  const [draft, setDraft] = useState(expense);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">(expense.source === "scan" ? "done" : "idle");
  const isNew = !onDelete;
  const auto = resolveStop({ ...draft, stopId: null }, stops);
  const scan = () => {
    setScanState("scanning");
    const r = sampleReceipts[Math.floor(Math.random() * sampleReceipts.length)]!;
    setTimeout(() => {
      setDraft((d) => ({ ...d, label: r.label, place: r.place, amount: r.amount, time: r.time, source: "scan" }));
      setScanState("done");
    }, 900);
  };
  const canSave = Boolean(draft.label.trim()) && draft.amount > 0 && draft.split.participants.length > 0;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={isNew ? "Add cost" : "Edit cost"}>
    <div className="modal-sheet">
      <div className="modal-head"><div><p className="eyebrow">Day {draft.day + 1} · {draft.source === "scan" ? "From receipt" : "Manual"}</p><h2>{isNew ? "Add cost" : "Edit cost"}</h2></div><IconButton label="Close" onClick={onClose}><X size={20} /></IconButton></div>
      <button className="scan-inline" onClick={scan} disabled={scanState === "scanning"}>
        <span><Camera size={20} /></span>
        <div><b>{scanState === "scanning" ? "Reading your receipt…" : scanState === "done" ? "Receipt details filled in" : "Scan a receipt"}</b><small>{scanState === "done" ? "Check the amount, place and time below" : "We’ll fill the amount, place and time for you"}</small></div>
        {scanState === "done" ? <Check size={18} /> : <ArrowRight size={18} />}
      </button>
      <div className="form-grid">
        <label>What was it?<input value={draft.label} placeholder="Lunch at Rio Maravilha" onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></label>
        <div className="two-cols">
          <label>Amount (€)<input inputMode="decimal" value={draft.amount ? String(draft.amount) : ""} placeholder="0.00" onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value.replace(",", ".")) || 0 })} /></label>
          <label>Time<input type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></label>
        </div>
        <label>Place<div className="input-icon"><MapPin size={17} /><input value={draft.place} placeholder="Rua de Belém 84" onChange={(e) => setDraft({ ...draft, place: e.target.value })} /></div></label>
        <label>Paid by<input value={draft.payer} onChange={(e) => setDraft({ ...draft, payer: e.target.value })} /></label>
        <label>Attach to activity
          <select value={draft.stopId ?? ""} onChange={(e) => setDraft({ ...draft, stopId: e.target.value || null })}>
            <option value="">Auto-match{auto ? ` · ${auto.title}` : " · no match yet"}</option>
            {[...stops].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)).map((s) => <option key={s.id} value={s.id}>Day {s.day + 1} · {s.time} · {s.title}</option>)}
          </select>
        </label>
      </div>
      <div className="split-block">
        <p className="eyebrow">Split between travelers</p>
        <SplitPicker split={draft.split} amount={draft.amount} onChange={(split) => setDraft({ ...draft, split })} />
      </div>
      <button className="money-action wide" disabled={!canSave} onClick={() => onSave({ ...draft, label: draft.label.trim(), place: draft.place.trim(), day: draft.stopId ? (stops.find((s) => s.id === draft.stopId)?.day ?? draft.day) : draft.day })}><Check size={19} /> {isNew ? "Add cost" : "Save cost"}</button>
      {onDelete && <button className="summary-back" onClick={onDelete}><Trash2 size={17} /> Delete cost</button>}

    </div>
  </div>;
}


function StopEditor({ stop, onClose, onSave, onDelete }: { stop: Stop; onClose: () => void; onSave: (s: Stop) => void; onDelete?: (() => void) | undefined }) {
  const [draft, setDraft] = useState(stop);
  const isNew = !onDelete;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={isNew ? "Add activity" : "Edit activity"}>
    <div className="modal-sheet">
      <div className="modal-head"><div><p className="eyebrow">Day {draft.day + 1}</p><h2>{isNew ? "Add activity" : "Edit activity"}</h2></div><IconButton label="Close" onClick={onClose}><X size={20} /></IconButton></div>
      <div className="form-grid">
        <label>Activity<input value={draft.title} placeholder="Pastéis de Belém" onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
        <label>Place<div className="input-icon"><MapPin size={17} /><input value={draft.place} placeholder="Rua de Belém 84" onChange={(e) => setDraft({ ...draft, place: e.target.value })} /></div></label>
        <div className="two-cols">
          <label>Time<input type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></label>
          <label>Tag<input value={draft.tag} placeholder="Must see" onChange={(e) => setDraft({ ...draft, tag: e.target.value })} /></label>
        </div>
      </div>
      <button className="primary-action wide" disabled={!draft.title.trim()} onClick={() => onSave({ ...draft, title: draft.title.trim(), place: draft.place.trim() })}><Check size={19} /> {isNew ? "Add activity" : "Save changes"}</button>
      {onDelete && <button className="summary-back" onClick={onDelete}><Trash2 size={17} /> Delete activity</button>}
    </div>
  </div>;
}

function Emergency() {
  return <><div className="section-tabs"><button>Itinerary</button><button className="active">Emergency info</button></div><div className="emergency-intro"><span><ShieldCheck size={25} /></span><div><h2>Help, when you need it</h2><p>Saved on your device and available offline.</p></div></div><section className="emergency-grid">
    {[{ icon: <HeartPulse />, label: "Nearest hospital", title: "Hospital de São José", detail: "Rua José António Serrano · 2.1 km", number: "+351 218 841 000" }, { icon: <Landmark />, label: "U.S. Embassy", title: "Embassy of the United States", detail: "Av. das Forças Armadas · 4.8 km", number: "+351 217 273 300" }, { icon: <Phone />, label: "National emergency", title: "Police · Fire · Ambulance", detail: "Available 24 hours", number: "112" }].map((x) => <article className="emergency-card" key={x.label}><span className="emergency-icon">{x.icon}</span><div className="flex-1"><p className="eyebrow">{x.label}</p><h3>{x.title}</h3><p>{x.detail}</p><a href={`tel:${x.number}`}><Phone size={16} /> {x.number}</a></div></article>)}
  </section></>;
}

function Costs({ onScan, stops, expenses, setView }: { onScan: () => void; stops: Stop[]; expenses: Expense[]; setView: (v: View) => void }) {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const days = [...new Set(expenses.map((e) => e.day))].sort((a, b) => a - b);

  return <><div className="cost-hero"><div><p className="eyebrow">Group expenses</p><h2>Keep it easy,<br />keep it fair.</h2><p>Snap a receipt and we’ll help with the rest.</p></div><button onClick={onScan} className="scan-button"><span><Camera size={25} /></span><b>Scan receipt</b><small>Camera or photo library</small><ArrowRight size={19} /></button></div>
    <div className="cost-layout"><section><div className="section-heading"><div><p className="eyebrow">Settle up</p><h2>Running balance</h2></div><span className="settled-pill">€286.40 total</span></div><div className="balance-list"><article><span className="bg-sky text-sky-foreground">JR</span><div><h3>Jon owes you</h3><p>3 shared expenses</p></div><strong className="positive">+ €48.20</strong></article><article><span className="bg-money text-money-foreground">AL</span><div><h3>You owe Ana</h3><p>Dinner at Prado</p></div><strong>− €23.75</strong></article><article><span className="bg-sun text-sun-foreground">LM</span><div><h3>Luis is settled</h3><p>All caught up</p></div><strong className="muted-amount">€0</strong></article></div></section><aside className="future-space"><ReceiptText size={22} /><p className="eyebrow">Coming next</p><h3>Flexible splitting</h3><p>Equal, shares or percentages — with borrowed and lent tags.</p></aside></div>
    <div className="section-heading mt-8"><div><p className="eyebrow">When it happened</p><h2>Spending timeline</h2></div><span className="settled-pill">{euro(total)} tracked</span></div>
    <div className="spend-timeline">{days.map((d) => <section key={d}>
      <header><h3>Day {d + 1}</h3><strong>{euro(expenses.filter((e) => e.day === d).reduce((s, e) => s + e.amount, 0))}</strong></header>
      {expenses.filter((e) => e.day === d).sort((a, b) => a.time.localeCompare(b.time)).map((e) => {
        const stop = resolveStop(e, stops);
        return <article key={e.id}><span className="cost-time">{e.time}</span><div className="min-w-0 flex-1"><h4>{e.label}</h4><p>{stop ? `${stop.title} · ${stop.place}` : e.place || "No activity matched"}</p><p className="split-tag"><Users size={13} /> Split {splitLabel(e.split)}</p></div><div className="cost-meta"><strong>{euro(e.amount)}</strong><small>{e.source === "scan" ? "Receipt" : "Manual"} · {e.payer}</small></div></article>;
      })}
    </section>)}</div>
    <button className="secondary-action mt-4" onClick={() => setView("plan")}><Plus size={17} /> Add a cost in the timeline</button>
  </>;

}

function Photos({ stops, photos, setPhotos }: { stops: Stop[]; photos: Photo[]; setPhotos: (fn: (p: Photo[]) => Photo[]) => void }) {
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [assigning, setAssigning] = useState<Photo | null>(null);
  const days = Array.from(new Set(photos.map((p) => p.day))).sort((a, b) => a - b);

  return <>
    <div className="section-heading photo-heading"><div><p className="eyebrow">Shared memories</p><h2>Photo timeline</h2></div><button className="secondary-action"><Plus size={18} /> Add photos</button></div>
    <p className="gesture-hint">Photos are matched to itinerary activities by place, date and time. Tap a photo to move it to another activity.</p>
    <section className="photo-days">
      {days.map((day) => {
        const dayPhotos = photos.filter((p) => p.day === day);
        const expanded = openDay === day;
        const groups = groupPhotosByStop(dayPhotos, stops);
        return <article key={day}>
          <button className="photo-day-title" onClick={() => setOpenDay(expanded ? null : day)}>
            <span><b>Day {day + 1}</b><small>{groups.filter((g) => g.stop).length} activities · {dayPhotos.length} photos</small></span>
            <ChevronRight size={19} className={expanded ? "rotate-90" : ""} />
          </button>
          {expanded && groups.map((group) => <div className="activity-cluster" key={group.stop?.id ?? "unmatched"}>
            <p className="cluster-label">{group.stop ? <><MapPin size={13} /> {group.stop.time} · {group.stop.title}</> : <><Image size={13} /> Not matched to an activity</>}</p>
            <div className="photo-grid">{group.photos.map((photo) => <button key={photo.id} className="photo-tile" onClick={() => setAssigning(photo)}>
              <img src={photo.src} alt={`${photo.place} memory`} width={1280} height={800} loading="lazy" />
              <small className="photo-meta">{photo.time}</small>
              {photo.stopId && <i className="manual-badge"><Check size={12} /></i>}
            </button>)}</div>
          </div>)}
        </article>;
      })}
    </section>
    {assigning && <PhotoAssign photo={assigning} stops={stops} onClose={() => setAssigning(null)} onAssign={(stopId) => {
      setPhotos((prev) => prev.map((p) => (p.id === assigning.id ? { ...p, stopId, day: stopId ? (stops.find((s) => s.id === stopId)?.day ?? p.day) : p.day } : p)));
      setAssigning(null);
    }} />}
  </>;
}

function PhotoAssign({ photo, stops, onClose, onAssign }: { photo: Photo; stops: Stop[]; onClose: () => void; onAssign: (stopId: string | null) => void }) {
  const current = resolveStop(photo, stops);
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Move photo to activity">
    <div className="modal-sheet">
      <div className="modal-head"><div><p className="eyebrow">{photo.time} · {photo.place}</p><h2>Move photo</h2></div><IconButton label="Close" onClick={onClose}><X size={20} /></IconButton></div>
      <div className="assign-list">
        {[...stops].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)).map((stop) => <button key={stop.id} className={current?.id === stop.id ? "selected" : ""} onClick={() => onAssign(stop.id)}>
          <b>D{stop.day + 1} · {stop.time}</b><span>{stop.title}<small>{stop.place}</small></span>{current?.id === stop.id && <Check size={16} />}
        </button>)}
        <button onClick={() => onAssign(null)}>Auto-match by place & time</button>
      </div>
    </div>
  </div>;
}

function BottomNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  return <nav className="bottom-nav" aria-label="Trip navigation">{[{ id: "plan", label: "Plan", icon: <MapPin /> }, { id: "costs", label: "Costs", icon: <WalletCards /> }, { id: "photos", label: "Photos", icon: <Image /> }].map((item) => <button key={item.id} className={(view === item.id || (view === "emergency" && item.id === "plan")) ? "active" : ""} onClick={() => setView(item.id as View)}>{item.icon}<span>{item.label}</span></button>)}</nav>;
}

function CreateTrip({ onClose, onCreate }: { onClose: () => void; onCreate: () => void }) {
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Create a trip"><div className="modal-sheet"><div className="modal-head"><div><p className="eyebrow">New adventure</p><h2>Create a trip</h2></div><IconButton label="Close" onClick={onClose}><X size={20} /></IconButton></div><div className="form-grid"><label>Trip name<input defaultValue="Lisbon escape" /></label><label>Destination<div className="input-icon"><MapPin size={17} /><input defaultValue="Lisbon, Portugal" /></div></label><div className="two-cols"><label>Starts<input type="date" defaultValue="2026-05-18" /></label><label>Ends<input type="date" defaultValue="2026-05-23" /></label></div><label>Invite members<div className="invite-row"><div className="avatar-stack">{members.slice(0, 3).map((m) => <span key={m.name} className={m.tone}>{m.initials}</span>)}</div><button className="invite-button"><Plus size={16} /> Add people</button></div></label></div><button className="primary-action wide" onClick={onCreate}>Create trip <ArrowRight size={19} /></button></div></div>;
}

function ReceiptConfirm({ onClose, stops, onSave }: { onClose: () => void; stops: Stop[]; onSave: (e: Expense) => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [split, setSplit] = useState<Split>(equalSplit(["You", "Jon", "Ana"]));
  const [draft, setDraft] = useState({ amount: "86.40", label: "Lunch at Rio Maravilha", place: "LX Factory", time: "14:55", day: 1 });
  const amount = Number(draft.amount.replace(",", ".")) || 0;
  const match = resolveStop({ day: draft.day, time: draft.time, place: draft.place }, stops);
  const confirm = () => {
    onSave({ id: `e${Date.now()}`, day: draft.day, time: draft.time, place: draft.place, label: draft.label, amount, payer: "Maira", source: "scan", stopId: null, split });
    setConfirmed(true);
  };
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm scanned receipt"><div className="modal-sheet receipt-sheet"><div className="scan-success"><span><ReceiptText size={26} /></span><div><p className="eyebrow">Receipt found</p><h2>{confirmed ? "Expense added!" : "Check the details"}</h2></div><IconButton label="Close" onClick={onClose}><X size={20} /></IconButton></div>{confirmed ? <div className="confirmation"><span><Check size={34} /></span><p>{euro(amount)} split {splitLabel(split)}</p><p className="text-sm">{match ? `Added to your timeline at ${draft.time} · ${match.title}` : `Added to your Day ${draft.day + 1} timeline at ${draft.time}`}</p><button className="primary-action wide" onClick={onClose}>Done</button></div> : <><div className="amount-edit"><label>Amount</label><div><span>€</span><input value={draft.amount} inputMode="decimal" onChange={(e) => setDraft({ ...draft, amount: e.target.value })} /></div><input value={draft.label} aria-label="Expense name" onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></div>
    <div className="two-cols"><label>Place<div className="input-icon"><MapPin size={17} /><input value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })} /></div></label><label>Time<input type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} /></label></div>
    <p className="match-hint"><MapPin size={14} /> {match ? `Matches “${match.title}” on your timeline` : "No activity matched yet — it will sit on the day timeline"}</p>
    <div className="split-block"><p className="eyebrow">Split between travelers</p><SplitPicker split={split} amount={amount} onChange={setSplit} /></div><button className="money-action" disabled={split.participants.length === 0} onClick={confirm}><Check size={20} /> Confirm expense</button></>}</div></div>;

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
