// Scout, wincing next to a spilled suitcase — used for the generic
// "something went wrong" error state.
export function ScoutOops({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 240" className={className} aria-hidden="true">
      <ellipse cx="88" cy="214" rx="16" ry="10" fill="#EAD3A0" stroke="#23262F" strokeWidth="3" />
      <ellipse cx="132" cy="214" rx="16" ry="10" fill="#EAD3A0" stroke="#23262F" strokeWidth="3" />

      <path
        d="M70 208 C56 190 54 162 74 146 C68 118 90 96 122 96 C154 96 176 120 170 150 C188 158 196 180 182 198 C170 212 150 216 130 210 C124 214 116 216 108 216 C92 216 78 214 70 208 Z"
        fill="#EAD3A0"
        stroke="#23262F"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      <g transform="translate(158,188) rotate(12)">
        <rect
          x="0"
          y="0"
          width="42"
          height="32"
          rx="5"
          fill="#D8664F"
          stroke="#23262F"
          strokeWidth="2.6"
        />
        <rect
          x="15"
          y="-7"
          width="12"
          height="9"
          rx="2"
          fill="#D8664F"
          stroke="#23262F"
          strokeWidth="2.2"
        />
        <line x1="0" y1="17" x2="42" y2="17" stroke="#23262F" strokeWidth="1.6" opacity=".5" />
      </g>
      <circle cx="198" cy="226" r="4" fill="#EAD3A0" stroke="#23262F" strokeWidth="2" />
      <circle cx="208" cy="234" r="3" fill="#EAD3A0" stroke="#23262F" strokeWidth="1.8" />

      <path
        d="M74 154 C58 148 46 154 40 166 C54 168 68 164 78 156 Z"
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

      <path d="M88 132 L104 124" stroke="#23262F" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M152 132 L136 124" stroke="#23262F" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="100" cy="140" r="10" fill="#FFFFFF" stroke="#23262F" strokeWidth="2.6" />
      <circle cx="140" cy="140" r="10" fill="#FFFFFF" stroke="#23262F" strokeWidth="2.6" />
      <circle cx="100" cy="140" r="4.5" fill="#23262F" />
      <circle cx="140" cy="140" r="4.5" fill="#23262F" />
      <path
        d="M110 162 Q120 156 130 162"
        fill="none"
        stroke="#23262F"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
