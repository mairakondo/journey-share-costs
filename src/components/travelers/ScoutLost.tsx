// Scout, confused and holding an upside-down map, scratching its head —
// used for the 404 "page not found" state.
export function ScoutLost({ className }: { className?: string }) {
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

      <g transform="rotate(20 78 108)">
        <path
          d="M64 116 C48 108 36 96 38 82 C52 88 66 100 74 114 Z"
          fill="#EDEAE1"
          stroke="#23262F"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      </g>

      <g transform="translate(168,178) rotate(-160)">
        <rect
          x="0"
          y="0"
          width="30"
          height="20"
          rx="2"
          fill="#FBFAF7"
          stroke="#23262F"
          strokeWidth="2.2"
        />
        <path
          d="M4 15 Q10 8 16 15 T28 15"
          fill="none"
          stroke="#7BA6BD"
          strokeWidth="1.4"
          opacity=".7"
        />
      </g>

      <path
        d="M76 122 C84 98 102 88 116 88 C130 88 148 98 156 122 C146 110 130 102 116 102 C102 102 86 110 76 122 Z"
        fill="#9C8D79"
        stroke="#23262F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M82 122 Q92 124 102 122"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".7"
      />
      <path
        d="M130 122 Q140 124 150 122"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".7"
      />
      <circle cx="102" cy="150" r="9" fill="#1A1A1A" />
      <circle cx="134" cy="150" r="9" fill="#1A1A1A" />
      <circle cx="99" cy="147" r="2.2" fill="#fff" opacity=".9" />
      <circle cx="131" cy="147" r="2.2" fill="#fff" opacity=".9" />
      <path
        d="M108 162 L124 162 L116 174 Z"
        fill="#5B5B5B"
        stroke="#23262F"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M172 90 Q184 86 182 72 Q180 62 168 62"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".55"
      />
      <circle cx="168" cy="100" r="2.2" fill="#23262F" opacity=".55" />
    </svg>
  );
}
