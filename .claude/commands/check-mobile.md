# Check Mobile

Take a Playwright screenshot of the current page at **375×812** viewport (iPhone-sized).

Check for:
1. **Text overflow** — any text cut off, truncated with ellipsis, or overlapping
2. **Tap targets** — interactive elements smaller than 44×44px
3. **Horizontal scroll** — content causing sideways scrolling
4. **Edge cutoff** — elements touching or overflowing screen edges
5. **Spacing** — cramped elements, insufficient padding, or elements too close together

Report each issue with the element name and what's wrong. Then fix them all.
After fixing, re-screenshot to verify the fixes look correct.
