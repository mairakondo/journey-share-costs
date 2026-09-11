# New Screen

I want a new screen for: $ARGUMENTS

Follow this process:

1. **Route** — If the screen needs its own URL, create a new route file in `src/routes/`.
   If it's a view within the existing app, add it as a new `view` state in `src/routes/index.tsx`.

2. **Design** — Follow the glass-card aesthetic:
   - Translucent white card surfaces (`bg-card` or custom glass classes)
   - Rounded corners (`--radius: 1.35rem`)
   - Amber accent for primary actions (`bg-accent` / `--money`)
   - Near-black text and controls (`--primary` / `--foreground`)
   - Plus Jakarta Sans typography
   - Mobile-first layout at 375px width

3. **CSS** — Add all new styles to `src/styles.css`. Use `@apply` with semantic tokens.
   Never hardcode colors.

4. **Navigation** — Add bottom-nav or header navigation to reach the new screen.

5. **Verify** — Run `bun run lint`. Screenshot at 375×812. Confirm it works on mobile.
