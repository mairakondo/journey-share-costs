# Export Trip

Generate an export for: $ARGUMENTS

Create a downloadable file based on the trip data in the app. Options:
- **PDF itinerary** — day-by-day plan with stops, times, and notes
- **Excel cost-split** — table of expenses with per-traveler balances
- **Trip recap PDF** — spend summary, photo highlights, stats
- **PowerPoint briefing** — slides for sharing with the travel group

Process:
1. Read `src/routes/index.tsx` to extract trip data (stops, expenses, travelers, photos)
2. Generate the file using Python (reportlab/xlsxwriter/python-pptx) or markdown-to-PDF
3. Save to `/tmp/` and report the file path
