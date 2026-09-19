// Scout, confused and holding an upside-down map, wing raised near its
// head — used for the 404 "page not found" state.
const INK = "#33261C";

export function ScoutLost({ className }: { className?: string }) {
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
        d="M52 76 Q40 72 42 58 Q44 46 58 46"
        fill="none"
        stroke={INK}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity=".55"
      />
      <circle cx="58" cy="86" r="2.6" fill={INK} opacity=".55" />

      <path
        d="M118 128 Q128 135 138 130"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity=".75"
      />
      <path
        d="M162 128 Q172 135 182 130"
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
        d="M92 112 C74 102 62 84 66 66 C82 74 96 90 104 108 Z"
        fill="#8B6F47"
        stroke={INK}
        strokeWidth="4.6"
        strokeLinejoin="round"
      />
      <g transform="translate(64,206) rotate(150)">
        <rect
          x="0"
          y="0"
          width="32"
          height="22"
          rx="3"
          fill="#FDF6E4"
          stroke={INK}
          strokeWidth="3"
        />
        <path
          d="M5 16 Q11 9 17 16 T30 16"
          fill="none"
          stroke="#7BA6BD"
          strokeWidth="1.8"
          opacity=".7"
        />
      </g>
    </svg>
  );
}
