// Scout, now modeled on the Japanese long-tailed tit ("shima-enaga"),
// waving with a rolled map — used for "nothing planned yet" empty states
// (no trips, no activities for a day).
export function ScoutReady({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 260" className={className} aria-hidden="true">
      <path
        d="M108 190 C104 214 100 236 92 252 L106 250 C112 230 116 208 118 190 Z"
        fill="#8A7A68"
        stroke="#23262F"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M124 190 C128 214 132 236 140 252 L126 250 C120 230 116 208 114 190 Z"
        fill="#B8AE9E"
        stroke="#23262F"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      <path
        d="M60 150 C56 114 82 86 116 86 C150 86 176 114 172 150 C170 182 150 204 116 208 C82 204 62 182 60 150 Z"
        fill="#FBFAF8"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <ellipse cx="96" cy="210" rx="9" ry="5.5" fill="#242424" />
      <ellipse cx="136" cy="210" rx="9" ry="5.5" fill="#242424" />

      <path
        d="M70 152 C50 146 32 152 26 170 C44 174 64 166 76 152 Z"
        fill="#EDEAE1"
        stroke="#23262F"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      <g transform="rotate(-35 168 140)">
        <path
          d="M162 152 C182 146 200 152 206 170 C188 174 168 166 156 152 Z"
          fill="#EDEAE1"
          stroke="#23262F"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      </g>
      <path
        d="M188 108 L194 100 M198 116 L206 112"
        stroke="#23262F"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity=".5"
      />

      <g transform="translate(46,150) rotate(18)">
        <rect
          x="0"
          y="0"
          width="26"
          height="11"
          rx="5.5"
          fill="#FBFAF7"
          stroke="#23262F"
          strokeWidth="2.2"
        />
        <line x1="7" y1="5.5" x2="19" y2="5.5" stroke="#C9832A" strokeWidth="1.6" opacity=".6" />
      </g>

      <path
        d="M76 122 C84 98 102 88 116 88 C130 88 148 98 156 122 C146 110 130 102 116 102 C102 102 86 110 76 122 Z"
        fill="#9C8D79"
        stroke="#23262F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="150" r="9" fill="#1A1A1A" />
      <circle cx="132" cy="150" r="9" fill="#1A1A1A" />
      <circle cx="97" cy="147" r="2.2" fill="#fff" opacity=".9" />
      <circle cx="129" cy="147" r="2.2" fill="#fff" opacity=".9" />
      <path
        d="M108 162 L124 162 L116 174 Z"
        fill="#5B5B5B"
        stroke="#23262F"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
