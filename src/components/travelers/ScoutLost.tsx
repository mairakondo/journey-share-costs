// Scout, confused and holding an upside-down map, scratching its head —
// used for the 404 "page not found" state.
export function ScoutLost({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden="true">
      <ellipse cx="88" cy="214" rx="16" ry="10" fill="#EAD3A0" stroke="#23262F" strokeWidth="3" />
      <ellipse cx="132" cy="214" rx="16" ry="10" fill="#EAD3A0" stroke="#23262F" strokeWidth="3" />

      <g transform="translate(150,168) rotate(-18)">
        <rect
          x="0"
          y="0"
          width="42"
          height="30"
          rx="3"
          fill="#FBFAF7"
          stroke="#23262F"
          strokeWidth="2.6"
        />
        <path d="M14 0 L14 30 M28 0 L28 30" stroke="#C9832A" strokeWidth="1.6" opacity=".55" />
        <path
          d="M6 22 Q14 12 22 22 T38 22"
          fill="none"
          stroke="#7BA6BD"
          strokeWidth="1.8"
          opacity=".7"
        />
      </g>
      <path
        d="M168 172 C186 176 198 192 194 208 C180 202 170 188 164 174 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <path
        d="M70 208 C56 190 54 162 74 146 C68 118 90 96 122 96 C154 96 176 120 170 150 C188 158 196 180 182 198 C170 212 150 216 130 210 C124 214 116 216 108 216 C92 216 78 214 70 208 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <path
        d="M78 118 C64 116 52 124 48 136 C60 138 72 134 80 126 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
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

      <path
        d="M86 128 Q94 122 102 127"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="M138 127 Q146 122 154 128"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".7"
      />
      <circle cx="100" cy="140" r="10" fill="#FFFFFF" stroke="#23262F" strokeWidth="2.6" />
      <circle cx="140" cy="140" r="10" fill="#FFFFFF" stroke="#23262F" strokeWidth="2.6" />
      <circle cx="98" cy="143" r="5" fill="#23262F" />
      <circle cx="142" cy="143" r="5" fill="#23262F" />
      <path
        d="M112 160 Q120 156 128 160"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      <path
        d="M180 96 Q192 92 190 78 Q188 68 176 68"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".55"
      />
      <circle cx="176" cy="106" r="2.4" fill="#23262F" opacity=".55" />
    </svg>
  );
}
