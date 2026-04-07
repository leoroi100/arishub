export function BrandMark() {
  return (
    <svg
      aria-hidden="true"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="42"
        height="42"
        rx="14"
        fill="url(#panel)"
        stroke="url(#stroke)"
      />
      <path
        d="M12 28.8L21.9 12L31.9 28.8H27.9L21.9 18.52L15.96 28.8H12Z"
        fill="url(#core)"
      />
      <path
        d="M17.64 25.02H26.24L28.67 28.8H15.33L17.64 25.02Z"
        fill="url(#glass)"
        opacity="0.94"
      />
      <defs>
        <linearGradient id="panel" x1="5" y1="5" x2="39" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.2)" />
          <stop offset="0.35" stopColor="#300B15" />
          <stop offset="1" stopColor="#090406" />
        </linearGradient>
        <linearGradient id="stroke" x1="6" y1="4" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.38)" />
          <stop offset="0.5" stopColor="#8B1A3D" />
          <stop offset="1" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
        <linearGradient id="core" x1="12" y1="12" x2="31.9" y2="28.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD7E3" />
          <stop offset="0.45" stopColor="#D76189" />
          <stop offset="1" stopColor="#6E0D2B" />
        </linearGradient>
        <linearGradient id="glass" x1="15.33" y1="25.02" x2="27.72" y2="29.44" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.78)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.14)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
