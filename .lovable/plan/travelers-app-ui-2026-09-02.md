# Travelers App UI

## Build

- Replace the placeholder home page with a polished, mobile-first travel planning interface.
- Create a trip dashboard with upcoming/past trips, cover imagery, dates, a thumb-reachable Create Trip flow, and a lightweight budget preview.
- Add detailed trip views for itinerary, emergency information, costs/splitting, and a photo timeline.
- Include offline state treatment, receipt confirmation editing, member selection, running balances, day photo clusters, and a simple photo reassignment interaction.
- Add a lightweight after-trip summary with spend, photo count, and export action.

## Visual direction

- Warm, trustworthy palette with distinct planning and money accents.
- Friendly rounded geometry, strong hierarchy, compact mobile navigation, and clear action placement.
- Responsive desktop framing without changing the mobile-first interaction model.

## Technical details

- Use TanStack Router route state/search where appropriate and React state for prototype interactions.
- Define semantic OKLCH tokens and shared motion/styles in `src/styles.css`.
- Use generated destination photography stored in `src/assets` rather than remote placeholders.
- Add route-specific metadata and verify the responsive live preview.

## Scope boundaries

- Flights, hotels, insurance booking, translation, live location, and SOS are intentionally excluded.
- Budget and after-trip remain conceptual rather than full workflows.
- Future split-type and borrow/lent controls retain layout space but are not fully designed.
