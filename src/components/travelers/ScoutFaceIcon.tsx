// A minimal line-art crop of Scout's face, built to sit in the header badge
// the same way a Lucide icon does — single currentColor stroke, no fill.
export function ScoutFaceIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 8c-1.2-1.8-1.2-3.6 0-5" />
      <path d="M15.5 8c1.2-1.8 1.2-3.6 0-5" />
      <circle cx="12" cy="13" r="7" />
      <circle cx="9.6" cy="12.6" r=".9" fill="currentColor" stroke="none" />
      <circle cx="14.4" cy="12.6" r=".9" fill="currentColor" stroke="none" />
      <path d="M9.5 15.3c.9.9 3.1.9 4 0" />
    </svg>
  );
}
