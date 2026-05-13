export default function WanderlyLogo({ size = 40, showWordmark = false }) {
  if (!showWordmark) {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg" aria-label="wanderly">
        <circle cx="50" cy="50" r="46" fill="#FDF7E2" />
        <circle cx="50" cy="50" r="34" fill="#E6A071" opacity="0.15" />
        <path d="M28 66 L38 34 L50 54 L62 34 L72 66"
          stroke="#8B5E3C" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="74" cy="28" r="10" fill="#E6A071" />
      </svg>
    );
  }
  const iconW = size;
  const gap = size * 0.25;
  const fontSize = size * 0.52;
  const wordW = fontSize * 4.8;
  const totalW = iconW + gap + wordW;
  return (
    <svg width={totalW} height={size} viewBox={`0 0 ${totalW} ${size}`}
      xmlns="http://www.w3.org/2000/svg" aria-label="wanderly">
      <circle cx={size/2} cy={size/2} r={size*0.46} fill="#FDF7E2" />
      <circle cx={size/2} cy={size/2} r={size*0.34} fill="#E6A071" opacity="0.15" />
      <path d={`M${size*0.28} ${size*0.66} L${size*0.38} ${size*0.34} L${size*0.5} ${size*0.54} L${size*0.62} ${size*0.34} L${size*0.72} ${size*0.66}`}
        stroke="#8B5E3C" strokeWidth={size*0.07} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={size*0.74} cy={size*0.28} r={size*0.10} fill="#E6A071" />
      <text
        x={iconW + gap}
        y={size * 0.68}
        fontFamily="'Manrope', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        fill="#8B5E3C"
        letterSpacing="0.5">
        wanderly
      </text>
    </svg>
  );
}

export function WanderlyLogoDark({ size = 40 }) {
  return (
    <svg width={size * 2.8} height={size * 1.4}
      viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" aria-label="wanderly Logo">
      <circle cx="200" cy="100" r="70" fill="rgba(253,247,226,0.15)" />
      <circle cx="200" cy="100" r="52" fill="rgba(230,160,113,0.2)" />
      <path d="M165 130 L187 68 L200 105 L213 68 L235 130"
        stroke="#FBF4E6" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="238" cy="63" r="14" fill="#E6A071" />
      <text x="200" y="185" fontFamily="'Manrope', sans-serif" fontSize="38"
        fontWeight="700" fill="#FBF4E6" textAnchor="middle" letterSpacing="2">
        wanderly
      </text>
    </svg>
  );
}
