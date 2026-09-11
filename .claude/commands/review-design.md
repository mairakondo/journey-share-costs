# Review Design

Take a Playwright screenshot of the current page at **1280×800** (desktop) and **375×812**
(mobile).

Review the design against these principles:

1. **Visual hierarchy** — Is the most important thing the most visible? Are headings bold
   and large enough?
2. **Consistency** — Do cards, buttons, and inputs share the same corner radius, spacing,
   and color treatment?
3. **Color discipline** — Are all colors from the OKLCH token system in `src/styles.css`?
   No hardcoded hex values?
4. **Spacing** — Is there enough breathing room? Nothing cramped against edges?
5. **Touch targets** — All interactive elements ≥ 44px on mobile?
6. **Glass aesthetic** — Translucent cards, backdrop blur, rounded geometry maintained?
7. **Typography** — Plus Jakarta Sans, clear size hierarchy, readable on mobile?

Report issues as a numbered list with severity (critical / minor). Fix critical issues.
