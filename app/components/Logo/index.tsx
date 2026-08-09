import type { CSSProperties } from "react";

type Props = {
  className?: string;
  size?: number;
  // Draw-on mode: strokes wait for `revealed` — driven by a parent's
  // timeline (e.g. HomeIntroOverlay's countdown), not by this component
  // itself, so multiple usages can stay in sync with whatever else is on
  // the page.
  animate?: boolean;
  revealed?: boolean;
};

// Single F/R monogram, not two separate letters: a stem + top arm + middle
// arm read as "F", and instead of a bottom horizontal bar (which would
// read as "E"), the stem curves smoothly into a diagonal leg — one
// continuous stroke that doubles as an "R". No circle frame — icon only;
// HomeHero.tsx pairs it with its own "FrameRate" text directly.
const LETTER_STROKE_WIDTH = 4;

// M 10,8 L 10,38 C 10,44 12,47 17,50 L 36,66 — stem, curved bend, diagonal.
const SPINE_PATH = "M 10,8 L 10,38 C 10,44 12,47 17,50 L 36,66";
const SPINE_LENGTH = approximateSpineLength();

function cubicPoint(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0],
    mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1],
  ];
}

// SPINE_PATH has no dynamic inputs (fixed constants above), so this only
// ever computes one value — a numeric approximation (sampled, not exact)
// since stroke-dasharray needs a real length and SVGPathElement.getTotalLength()
// isn't available outside a real DOM (this renders server-side first).
function approximateSpineLength(): number {
  const line1 = Math.hypot(10 - 10, 38 - 8); // (10,8)-(10,38)
  const line2 = Math.hypot(36 - 17, 66 - 50); // (17,50)-(36,66)

  const p0: [number, number] = [10, 38];
  const p1: [number, number] = [10, 44];
  const p2: [number, number] = [12, 47];
  const p3: [number, number] = [17, 50];
  let curve = 0;
  let prev = p0;
  const samples = 20;
  for (let i = 1; i <= samples; i++) {
    const pt = cubicPoint(p0, p1, p2, p3, i / samples);
    curve += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
    prev = pt;
  }

  return line1 + curve + line2;
}

const ARMS: [[number, number], [number, number]][] = [
  [[10, 8], [36, 8]], // top arm
  [[10, 30], [26, 30]], // middle arm
];

function segmentLength([[x1, y1], [x2, y2]]: [[number, number], [number, number]]): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

// Fixed-precision string, not a raw number, for two real reasons (not just
// tidiness): (1) React's SSR serializer appends "px" to numeric values for
// any CSS property outside its small unitless-properties whitelist —
// strokeDasharray/strokeDashoffset aren't on it — while client-side DOM
// property assignment never adds a unit, a guaranteed hydration mismatch
// for any numeric value here; (2) Math.hypot can differ by 1 ULP between
// server (Node) and client (browser) JS engines over enough chained
// float ops, which a fixed decimal count rounds away.
function formatLength(n: number): string {
  return n.toFixed(2);
}

export default function Logo({ className, size = 60, animate = false, revealed = true }: Props) {
  return (
    <svg
      viewBox="0 0 60 70"
      width={size}
      height={(size * 70) / 60}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="FrameRate"
      role="img"
    >
      <path
        d={SPINE_PATH}
        strokeWidth={LETTER_STROKE_WIDTH}
        style={
          animate
            ? ({
                strokeDasharray: formatLength(SPINE_LENGTH),
                strokeDashoffset: formatLength(SPINE_LENGTH),
                "--dash-length": formatLength(SPINE_LENGTH),
                ...(revealed && { animation: "stroke-draw 450ms ease-out both" }),
              } as CSSProperties)
            : undefined
        }
      />
      {ARMS.map((points, i) => {
        const length = segmentLength(points);
        return (
          <line
            key={i}
            x1={points[0][0]}
            y1={points[0][1]}
            x2={points[1][0]}
            y2={points[1][1]}
            strokeWidth={LETTER_STROKE_WIDTH}
            style={
              animate
                ? ({
                    strokeDasharray: formatLength(length),
                    strokeDashoffset: formatLength(length),
                    "--dash-length": formatLength(length),
                    ...(revealed && {
                      animation: `stroke-draw 220ms ease-out ${500 + i * 120}ms both`,
                    }),
                  } as CSSProperties)
                : undefined
            }
          />
        );
      })}
    </svg>
  );
}
