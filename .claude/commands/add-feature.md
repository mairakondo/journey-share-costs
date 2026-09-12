# Add Feature

I want to add: $ARGUMENTS

Follow this process:

1. **Read first** — Read `src/routes/index.tsx` and `src/styles.css` to understand current
   state and where the new feature fits.

2. **Plan** — Briefly describe what you'll add, where it goes in the file, and what CSS
   classes you'll need. Get my approval before coding.

3. **Implement** — Add the feature following existing patterns:
   - Use React `useState` for any new state
   - Add CSS to `src/styles.css` using existing token patterns
   - Use shadcn/ui components from `src/components/ui/` where appropriate
   - Use lucide-react icons

4. **Verify** — Run `bun run lint`, fix any errors. Take a Playwright screenshot at 375×812
   to confirm the feature looks right on mobile.

5. **Report** — Summarize what was added and where.
