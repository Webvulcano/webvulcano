// Babérág (bal oldali), a jobb oldali tükrözve: <Laurel flip />.
// A levelek a szár bezier-görbéje mentén ülnek, felváltva kétoldalt.
const P = [
  [38, 84],
  [12, 72],
  [4, 42],
  [16, 6],
];

function point(t) {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0],
    a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1],
  ];
}

function tangentDeg(t) {
  const u = 1 - t;
  const dx =
    3 * u * u * (P[1][0] - P[0][0]) +
    6 * u * t * (P[2][0] - P[1][0]) +
    3 * t * t * (P[3][0] - P[2][0]);
  const dy =
    3 * u * u * (P[1][1] - P[0][1]) +
    6 * u * t * (P[2][1] - P[1][1]) +
    3 * t * t * (P[3][1] - P[2][1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

const leaves = Array.from({ length: 8 }, (_, i) => {
  const t = 0.08 + i * 0.12;
  const [x, y] = point(t);
  const dir = tangentDeg(t) + (i % 2 === 0 ? -42 : 42);
  const rad = (dir * Math.PI) / 180;
  const cx = x + 6 * Math.cos(rad);
  const cy = y + 6 * Math.sin(rad);
  return { cx: +cx.toFixed(2), cy: +cy.toFixed(2), rot: +(dir - 90).toFixed(2) };
});

export default function Laurel({ flip = false, className = "h-16 w-auto" }) {
  return (
    <svg
      viewBox="-4 0 52 90"
      fill="currentColor"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d={`M${P[0]} C ${P[1]}, ${P[2]}, ${P[3]}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx="2.6"
          ry="6.4"
          transform={`rotate(${l.rot} ${l.cx} ${l.cy})`}
        />
      ))}
    </svg>
  );
}
