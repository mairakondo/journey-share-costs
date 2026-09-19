// Scout, worried next to a spilled suitcase — used for the generic
// "something went wrong" error state.
const INK = "#33261C";

export function ScoutOops({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 260" className={className} aria-hidden="true">
      <path
        d="M74 162 C46 158 20 166 10 184 C8 192 12 198 20 198 C44 196 66 184 80 168 Z"
        fill="#8B6F47"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M80 168 C62 162 46 166 38 176 C52 180 68 178 80 172 Z"
        fill="#B8AE9E"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path
        d="M120 82 C100 90 80 110 68 145 C60 175 62 200 78 215 C95 226 125 230 144 230 C163 230 193 226 210 215 C226 200 228 175 220 145 C208 110 188 90 168 82 C158 76 130 76 120 82 Z"
        fill="#FDF6E4"
        stroke={INK}
        strokeWidth="6"
        strokeLinejoin="round"
      />

      <path
        d="M130 222 L124 232 M138 224 L136 234"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M160 222 L158 232 M168 220 L170 230"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <path
        d="M118 128 Q128 121 138 130"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".75"
      />
      <path
        d="M162 128 Q172 121 182 130"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".75"
      />
      <ellipse cx="172" cy="144" rx="9.5" ry="10.5" fill={INK} />
      <circle cx="168.5" cy="140" r="2.5" fill="#fff" opacity=".95" />
      <ellipse cx="128" cy="144" rx="9.5" ry="10.5" fill={INK} />
      <circle cx="124.5" cy="140" r="2.5" fill="#fff" opacity=".95" />
      <path
        d="M141 164 L159 164 L150 153 Z"
        fill="#4A4038"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      <path
        d="M120 188 C100 182 82 188 74 204 C92 208 112 202 124 190 Z"
        fill="#8B6F47"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <g transform="translate(88,204) rotate(-8)">
        <rect
          x="0"
          y="0"
          width="40"
          height="30"
          rx="5"
          fill="#D8664F"
          stroke={INK}
          strokeWidth="3"
        />
        <rect
          x="14"
          y="-7"
          width="12"
          height="9"
          rx="2"
          fill="#D8664F"
          stroke={INK}
          strokeWidth="2.6"
        />
        <line x1="0" y1="16" x2="40" y2="16" stroke={INK} strokeWidth="1.6" opacity=".5" />
      </g>
      <circle cx="44" cy="240" r="3.6" fill="#FDF6E4" stroke={INK} strokeWidth="2" />
      <circle cx="36" cy="248" r="2.6" fill="#FDF6E4" stroke={INK} strokeWidth="1.8" />
    </svg>
  );
}
