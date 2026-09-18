export type View = "home" | "plan" | "costs" | "photos" | "support" | "summary";

export type Trip = {
  id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  planned_budget: number | null;
};

export type Stop = {
  id: string;
  day: number;
  time: string;
  title: string;
  place: string;
  tag: string;
};

export type Photo = {
  id: string;
  src: string;
  day: number;
  time: string;
  place: string;
  stopId?: string | null;
};

export type SplitMode = "equal" | "exact" | "percent";
export type Split = { mode: SplitMode; participants: string[]; values: Record<string, number> };

export type Expense = {
  id: string;
  day: number | null;
  time: string;
  place: string;
  label: string;
  amount: number;
  payer: string;
  source: "scan" | "manual";
  stopId?: string | null;
  split: Split;
};

export type Taggable = { day: number | null; time: string; place: string; stopId?: string | null };

export type Tool = "restroom" | "translate" | "access" | "locate";
