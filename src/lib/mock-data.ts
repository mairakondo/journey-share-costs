export const members = [
  { name: "You", initials: "MK", tone: "bg-primary text-primary-foreground" },
  { name: "Jon", initials: "JR", tone: "bg-sky text-sky-foreground" },
  { name: "Ana", initials: "AL", tone: "bg-money text-money-foreground" },
  { name: "Luis", initials: "LM", tone: "bg-sun text-sun-foreground" },
];

// Support tab tools (accessible routes, live location) are still fully
// mock — not yet connected to a backend.
export const ACCESSIBLE = [
  {
    name: "Asakusa station (Ginza line)",
    detail: "Elevator to platform · step-free exit 4",
    tags: ["Step-free", "Tactile paving"],
  },
  {
    name: "Toei bus 東42",
    detail: "Low-floor bus with ramp · every 12 min",
    tags: ["Ramp", "Wheelchair space"],
  },
  {
    name: "Senso-ji main hall",
    detail: "Ramp on west side, staff assistance",
    tags: ["Ramp", "Accessible restroom"],
  },
  {
    name: "teamLab Planets",
    detail: "Wheelchair route available · book ahead",
    tags: ["Step-free", "Lift"],
  },
  {
    name: "Tokyo Skytree deck",
    detail: "Lifts to all floors · priority queue",
    tags: ["Lift", "Accessible restroom"],
  },
];
