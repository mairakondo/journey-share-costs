// Scout, worried next to a spilled suitcase — used for the generic
// "something went wrong" error state.
export function ScoutOops({ className }: { className?: string }) {
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
        d="M66 156 C48 156 32 166 30 182 C46 182 64 172 72 158 Z"
        fill="#EDEAE1"
        stroke="#23262F"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      <g transform="translate(150,192) rotate(10)">
        <rect
          x="0"
          y="0"
          width="38"
          height="28"
          rx="4"
          fill="#D8664F"
          stroke="#23262F"
          strokeWidth="2.4"
        />
        <rect
          x="13"
          y="-6"
          width="12"
          height="8"
          rx="2"
          fill="#D8664F"
          stroke="#23262F"
          strokeWidth="2"
        />
        <line x1="0" y1="15" x2="38" y2="15" stroke="#23262F" strokeWidth="1.4" opacity=".5" />
      </g>
      <circle cx="192" cy="228" r="3.6" fill="#FBFAF8" stroke="#23262F" strokeWidth="1.8" />
      <circle cx="200" cy="236" r="2.6" fill="#FBFAF8" stroke="#23262F" strokeWidth="1.6" />

      <path
        d="M76 122 C84 98 102 88 116 88 C130 88 148 98 156 122 C146 110 130 102 116 102 C102 102 86 110 76 122 Z"
        fill="#9C8D79"
        stroke="#23262F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M82 122 Q92 128 102 122"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="M130 122 Q140 128 150 122"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".7"
      />
      <circle cx="100" cy="150" r="9" fill="#1A1A1A" />
      <circle cx="132" cy="150" r="9" fill="#1A1A1A" />
      <circle cx="97" cy="147" r="2.2" fill="#fff" opacity=".9" />
      <circle cx="129" cy="147" r="2.2" fill="#fff" opacity=".9" />
      <path
        d="M106 160 L126 164 L112 176 Z"
        fill="#5B5B5B"
        stroke="#23262F"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
