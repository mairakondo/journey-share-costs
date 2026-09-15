import { Link } from "@tanstack/react-router";
import { Camera, MapPin, Pencil, Plus, Users, Wallet } from "lucide-react";

import type { TripMember } from "@/features/trips/tripsServerFns";
import { currencyForDestination, formatMoney } from "@/lib/currency";
import type { Expense, Stop, Trip, View } from "@/lib/types";
import {
  avatarTone,
  computeBalances,
  initialsFor,
  resolveStop,
  splitLabel,
} from "@/lib/trip-utils";

export function Costs({
  trip,
  members,
  currentUserId,
  onScan,
  onEditBudget,
  stops,
  expenses,
  setView,
  tripLocked = false,
  tripLoading = false,
}: {
  trip: Trip;
  members: TripMember[];
  currentUserId: string | null;
  onScan: () => void;
  onEditBudget: () => void;
  stops: Stop[];
  expenses: Expense[];
  setView: (v: View) => void;
  tripLocked?: boolean;
  tripLoading?: boolean;
}) {
  const currency = currencyForDestination(trip.destination);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const planned = trip.planned_budget;
  const pct = planned ? Math.min(100, Math.round((total / planned) * 100)) : 0;
  const over = planned != null && total > planned;

  const days = [...new Set(expenses.map((e) => e.day))].sort((a, b) => a - b);
  const balances = computeBalances(expenses, currentUserId);
  const memberFor = (userId: string) => members.find((m) => m.userId === userId);
  const payerName = (userId: string) => memberFor(userId)?.displayName ?? "Someone";

  if (tripLocked) {
    return (
      <div className="empty-day mt-7">
        <p className="mb-3">Sign in to track costs with your group.</p>
        <Link to="/sign-in" className="primary-action">
          Sign in
        </Link>
      </div>
    );
  }

  if (tripLoading) {
    return <p className="empty-day mt-7">Loading your costs…</p>;
  }

  return (
    <>
      <article className="budget-progress">
        <header>
          <div>
            <p className="eyebrow text-money-ink">Planned vs actual</p>
            <h3>
              {formatMoney(total, currency)}{" "}
              {planned != null && <span>of {formatMoney(planned, currency)} planned</span>}
            </h3>
          </div>
          {planned != null ? (
            <span className={over ? "settled-pill over" : "settled-pill"}>{pct}% used</span>
          ) : (
            <button className="scan-chip" onClick={onEditBudget}>
              <Pencil size={14} /> Set budget
            </button>
          )}
        </header>
        {planned != null && (
          <>
            <div
              className="budget-bar"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Budget used"
            >
              <span className={over ? "over" : ""} style={{ width: `${pct}%` }} />
            </div>
            <footer>
              {over ? (
                <strong className="text-destructive">
                  {formatMoney(total - planned, currency)} over budget
                </strong>
              ) : (
                <strong>{formatMoney(planned - total, currency)} left</strong>
              )}
              <small>{expenses.length} expenses tracked</small>
            </footer>
            <button className="summary-back" onClick={onEditBudget}>
              <Pencil size={14} /> Edit planned budget
            </button>
          </>
        )}
      </article>

      <div className="cost-layout">
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Settle up</p>
              <h2>Running balance</h2>
            </div>
          </div>
          <div className="balance-list">
            {balances.length === 0 && (
              <article>
                <div>
                  <h3>No shared expenses yet</h3>
                  <p>Balances appear once a cost is split with someone else.</p>
                </div>
              </article>
            )}
            {balances.map((b) => {
              const memberIndex = members.findIndex((m) => m.userId === b.userId);
              const name = payerName(b.userId);
              const label =
                b.net > 0
                  ? `${name} owes you`
                  : b.net < 0
                    ? `You owe ${name}`
                    : `${name} is settled`;
              const detail =
                b.net === 0
                  ? "All caught up"
                  : `${b.sharedCount} shared expense${b.sharedCount === 1 ? "" : "s"}`;
              return (
                <article key={b.userId}>
                  <span className={avatarTone(Math.max(0, memberIndex))}>{initialsFor(name)}</span>
                  <div>
                    <h3>{label}</h3>
                    <p>{detail}</p>
                  </div>
                  <strong
                    className={
                      b.net > 0 ? "positive" : b.net < 0 ? "text-money-ink" : "muted-amount"
                    }
                  >
                    {b.net === 0
                      ? formatMoney(0, currency)
                      : `${b.net > 0 ? "+" : "−"} ${formatMoney(Math.abs(b.net), currency)}`}
                  </strong>
                </article>
              );
            })}
          </div>
        </section>
      </div>
      <div className="section-heading mt-8">
        <div>
          <p className="eyebrow">When it happened</p>
          <h2>Spending timeline</h2>
        </div>
        <div className="timeline-head-actions">
          <button onClick={onScan} className="scan-chip">
            <Camera size={16} /> Receipt
          </button>
        </div>
      </div>
      <div className="spend-timeline">
        {days.map((d) => (
          <section key={d}>
            <header>
              <h3>Day {d + 1}</h3>
              <strong>
                {formatMoney(
                  expenses.filter((e) => e.day === d).reduce((s, e) => s + e.amount, 0),
                  currency,
                )}
              </strong>
            </header>
            {expenses
              .filter((e) => e.day === d)
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((e) => {
                const stop = resolveStop(e, stops);
                return (
                  <article key={e.id}>
                    <div className="cost-card-head">
                      <span className="cost-time">{e.time}</span>
                    </div>
                    <div className="cost-title-row">
                      <h4>{e.label}</h4>
                      <strong>{formatMoney(e.amount, currency)}</strong>
                    </div>
                    <dl className="cost-details">
                      <div className="cost-detail-full">
                        <dt>
                          <MapPin size={13} /> Activity
                        </dt>
                        <dd>
                          {stop
                            ? `${stop.title} · ${stop.place}`
                            : e.place || "No activity matched"}
                        </dd>
                      </div>
                      <div>
                        <dt>
                          <Users size={13} /> Split
                        </dt>
                        <dd>{splitLabel(e.split)}</dd>
                      </div>
                      <div>
                        <dt>
                          <Wallet size={13} /> Paid by
                        </dt>
                        <dd>{payerName(e.payer)}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
          </section>
        ))}
      </div>
      <button className="secondary-action mt-4" onClick={() => setView("plan")}>
        <Plus size={17} /> Add a cost in the timeline
      </button>
    </>
  );
}
