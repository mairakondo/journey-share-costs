// Scout, the sticker-pack mascot explored for the Support tab, applied to
// the dashboard's zero-trips empty state — waving, holding a rolled map.
export function ScoutReady({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden="true">
      <ellipse cx="88" cy="214" rx="16" ry="10" fill="#EAD3A0" stroke="#23262F" strokeWidth="3" />
      <ellipse cx="132" cy="214" rx="16" ry="10" fill="#EAD3A0" stroke="#23262F" strokeWidth="3" />

      <path
        d="M168 168 C186 172 200 186 200 204 C184 200 172 188 164 172 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <g transform="translate(184,190) rotate(24)">
        <rect
          x="0"
          y="0"
          width="30"
          height="12"
          rx="6"
          fill="#FBFAF7"
          stroke="#23262F"
          strokeWidth="2.6"
        />
        <line x1="8" y1="6" x2="22" y2="6" stroke="#C9832A" strokeWidth="2" opacity=".6" />
      </g>

      <path
        d="M70 208 C56 190 54 162 74 146 C68 118 90 96 122 96 C154 96 176 120 170 150 C188 158 196 180 182 198 C170 212 150 216 130 210 C124 214 116 216 108 216 C92 216 78 214 70 208 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <path
        d="M76 150 C56 140 42 122 40 100 C54 106 68 122 78 140 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M30 92 L36 100 M28 104 L36 106"
        stroke="#23262F"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".55"
      />

      <path
        d="M96 108 C90 92 96 76 110 70 C108 86 110 100 118 110 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M138 108 C146 90 144 72 132 64 C132 82 128 96 122 108 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <circle cx="100" cy="140" r="10" fill="#FFFFFF" stroke="#23262F" strokeWidth="2.6" />
      <circle cx="140" cy="140" r="10" fill="#FFFFFF" stroke="#23262F" strokeWidth="2.6" />
      <circle cx="103" cy="142" r="5" fill="#23262F" />
      <circle cx="143" cy="142" r="5" fill="#23262F" />
      <path
        d="M108 158 Q120 168 132 158"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
