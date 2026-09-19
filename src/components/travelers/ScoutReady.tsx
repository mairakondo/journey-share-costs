// Scout, the Japanese long-tailed tit ("shima-enaga"), waving with a
// rolled map — used for "nothing planned yet" empty states (no trips,
// no activities for a day). Rounded-triangle body, thick soft outlines,
// warm cream fill — matches the reference craft style.
const INK = "#33261C";

export function ScoutReady({ className }: { className?: string }) {
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
      <g transform="translate(90,176) rotate(-14)">
        <rect
          x="0"
          y="0"
          width="30"
          height="13"
          rx="6.5"
          fill="#FDF6E4"
          stroke={INK}
          strokeWidth="3"
        />
        <line x1="8" y1="6.5" x2="22" y2="6.5" stroke="#C9832A" strokeWidth="1.8" opacity=".65" />
      </g>
    </svg>
  );
}
