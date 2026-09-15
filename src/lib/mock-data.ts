import type { Traveler } from "@/lib/types";

export const members = [
  { name: "You", initials: "MK", tone: "bg-primary text-primary-foreground" },
  { name: "Jon", initials: "JR", tone: "bg-sky text-sky-foreground" },
  { name: "Ana", initials: "AL", tone: "bg-money text-money-foreground" },
  { name: "Luis", initials: "LM", tone: "bg-sun text-sun-foreground" },
];

// Support tab tools (translator, restrooms, accessible routes, live
// location) are still fully mock — not yet connected to a backend.
export const RESTROOMS = [
  {
    name: "Senso-ji temple grounds",
    detail: "Asakusa 2-3-1 · 3 min walk",
    tags: ["Accessible", "Baby change"],
    clean: "Very clean",
  },
  {
    name: "Asakusa station · exit 4",
    detail: "Inside gates · 6 min walk",
    tags: ["Accessible"],
    clean: "Clean",
  },
  {
    name: "Family Mart Kaminarimon",
    detail: "Ask at counter · 8 min walk",
    tags: ["Free"],
    clean: "Clean",
  },
  {
    name: "Sumida park north gate",
    detail: "Riverside path · 11 min walk",
    tags: ["Accessible", "Baby change"],
    clean: "Basic",
  },
];

export const PHRASES = [
  {
    en: "Where is the nearest restroom?",
    jp: "一番近いトイレはどこですか？",
    ro: "Ichiban chikai toire wa doko desu ka?",
  },
  { en: "A table for four, please.", jp: "4名でお願いします。", ro: "Yonmei de onegaishimasu." },
  {
    en: "Does this have meat or fish?",
    jp: "これに肉や魚は入っていますか？",
    ro: "Kore ni niku ya sakana wa haitte imasu ka?",
  },
  {
    en: "Can you help me, please?",
    jp: "手伝っていただけますか？",
    ro: "Tetsudatte itadakemasu ka?",
  },
  { en: "How much does it cost?", jp: "いくらですか？", ro: "Ikura desu ka?" },
];

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

export const TRAVELERS: Traveler[] = [
  { name: "Maira", place: "Senso-ji main hall", when: "now", initials: "M" },
  { name: "Yuki", place: "Nakamise shopping street", when: "2 min ago", initials: "Y" },
  { name: "Tom", place: "Asakusa station · exit 4", when: "5 min ago", initials: "T" },
  { name: "Lena", place: "Sumida park riverside", when: "9 min ago", initials: "L" },
];

export const MEET_ROUTES = [
  {
    id: "walk",
    label: "Walk",
    time: "8 min",
    detail: "650 m · through Nakamise street",
    steps: [
      "Leave Senso-ji by the main gate",
      "Walk south along Nakamise street",
      "Pass the second souvenir arch",
      "Yuki is waiting by the red lanterns",
    ],
  },
  {
    id: "metro",
    label: "Metro",
    time: "6 min",
    detail: "Ginza line · 1 stop, step-free",
    steps: [
      "Enter Asakusa station, exit 4 lifts",
      "Ginza line toward Shibuya · 1 stop",
      "Leave by exit 1",
      "Meet Yuki at the street corner",
    ],
  },
  {
    id: "taxi",
    label: "Taxi",
    time: "4 min",
    detail: "≈ ¥760 · busy traffic now",
    steps: [
      "Taxi rank outside the temple gate",
      "Show the saved address in Japanese",
      "Arrive at Nakamise street",
    ],
  },
];
