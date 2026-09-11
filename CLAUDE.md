# Travelers — Claude Code Project Rules

## What this is
A mobile-first web app for groups to plan trips, split costs, and share a photo timeline.
Currently a **UI prototype**: all data lives in-memory React state. No backend or database yet.

## Tech stack
- **Framework:** TanStack Start v1 (React 19, SSR/SSG, server functions)
- **Router:** TanStack Router (file-based routes in `src/routes/`)
- **Build:** Vite 8
- **Styling:** Tailwind CSS v4 via `src/styles.css` (OKLCH tokens, no tailwind.config.js)
- **UI components:** shadcn/ui (new-york style) in `src/components/ui/`
- **Icons:** lucide-react
- **Fonts:** Plus Jakarta Sans (loaded via `<link>` in `src/routes/__root.tsx`)
- **Package manager:** bun

## Design system
- **Colors:** All colors are OKLCH semantic tokens defined in `src/styles.css` under `:root`.
  Key tokens: `--primary` (near-black ink), `--accent`/`--money` (amber), `--sky` (light blue),
  `--surface` (white), `--card` (translucent white glass), `--background` (pale blue-gray).
- **Never hardcode hex colors.** Always use semantic tokens: `bg-primary`, `text-foreground`,
  `bg-surface`, `bg-sky`, `text-accent-foreground`, etc.
- **Glass cards:** Translucent white surfaces with backdrop-blur. Use `bg-card` or custom
  glass-card classes in `src/styles.css`.
- **Corner radius:** `--radius: 1.35rem` base. Rounded geometry throughout — pills, cards, buttons.
- **Typography:** Plus Jakarta Sans for everything. Large bold headings, clear hierarchy.
- **Mobile-first:** Design at 375px width first, then scale up. Primary actions must be
  thumb-reachable (bottom of screen). Bottom navigation is solid `bg-primary`.

## File structure
```
src/
├── routes/
│   ├── __root.tsx        # Root layout, font <link>, <Outlet />
│   └── index.tsx         # Main app — ALL screens and state live here
├── components/ui/        # shadcn/ui components (don't edit — regenerate if needed)
├── lib/utils.ts          # cn() helper
├── hooks/use-mobile.tsx  # Mobile detection hook
├── styles.css            # Design tokens + custom component CSS
└── assets/               # Tokyo destination photos
```

## Key conventions
- **All app logic is in `src/routes/index.tsx`** — it's a large file with all screens, state,
  and components. Don't split unless asked.
- **CSS classes** are defined in `src/styles.css` using `@apply` or raw CSS. Custom classes
  like `.glass-card`, `.bottom-nav`, `.scan-chip`, `.scan-chip-ink`, `.amount-edit`,
  `.two-cols`, `.photo-grid`, `.stop-card`, etc.
- **State:** React `useState` for all prototype interactions. No external state library.
- **No backend calls.** All data (trips, travelers, expenses, photos) is hardcoded mock data
  or user-created in-memory.

## Build & verify
- `bun run dev` — start dev server
- `bun run build` — production build
- `bun run lint` — ESLint (run before declaring done)
- Always fix TypeScript errors before finishing a task.

## Rules
1. Read `src/routes/index.tsx` and `src/styles.css` before making changes.
2. Keep all new CSS in `src/styles.css` — never inline styles or styled-components.
3. Test at 375px width for mobile. Check for text overflow and tap targets ≥ 44px.
4. Use existing CSS class patterns. Don't invent new utility names.
5. Preserve the glass-card aesthetic — translucent surfaces, rounded corners, amber accents.
6. Don't add external dependencies without checking edge/Worker compatibility.
7. Don't restructure the project unless explicitly asked.
