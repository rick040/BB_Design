import React from "react";

// Path + eye geometry from 01. Logo/SVG/Asset 19vector.svg (white Buddy).
const BODY =
  "M196.66,288.64c66.71-12.11,101.71-55.41,117.98-116.76,73.03-13.14,144.94,50.85,149.65,131.87,6.68,115.03-70.87,199.8-186.16,201.88-67.22,1.21-134.49.66-201.73.13-45.07-.36-74.89-28.16-75.36-73.08C-.13,323.18-.4,213.65.68,104.15,1.16,55.47,28.08,24.42,75.78,11.47c55.01-14.93,109.72-17.97,162.91,7.26,56.92,27,67.02,77.99,64.48,133.09-2.11,45.74-37.48,63.69-74.33,77.97-39.19,15.19-39.33,14.82-32.17,58.86Z";
const VB_W = 464.69;
const VB_H = 506.36;

const EYES = [
  { cx: 96.67, cy: 105.1, hx: 93.74, hy: 146.11 },
  { cx: 213.85, cy: 105.1, hx: 216.78, hy: 146.11 },
];

export const BUDDY_RATIO = VB_H / VB_W;

export type BuddyProps = {
  /** Rendered width in px. */
  size: number;
  body?: string;
  eye?: string;
  /** Eye openness, 1 = open, ~0 = closed. */
  blink?: number;
  /** Where Buddy looks, each axis -1..1. */
  look?: { x: number; y: number };
  /** 1 = neutral, < 1 squashed, > 1 stretched (volume preserving). */
  squash?: number;
  style?: React.CSSProperties;
};

export const Buddy: React.FC<BuddyProps> = ({
  size,
  body = "#ffffff",
  eye = "#0046e2",
  blink = 1,
  look = { x: 0, y: 0 },
  squash = 1,
  style,
}) => {
  const sx = 1 / Math.sqrt(squash);
  const sy = squash;
  const lx = look.x * 16;
  const ly = look.y * 14;

  return (
    <div style={{ width: size, height: size * BUDDY_RATIO, ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${sx}, ${sy})`,
          transformOrigin: "50% 100%",
        }}
      >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible", display: "block" }}
      >
        <path d={BODY} fill={body} />
        {EYES.map((e, i) => (
          <g
            key={i}
            transform={`translate(${lx} ${ly}) translate(${e.cx} ${e.cy}) scale(1 ${blink}) translate(${-e.cx} ${-e.cy})`}
          >
            <ellipse cx={e.cx} cy={e.cy} rx={38.08} ry={52.73} fill={eye} />
            <circle cx={e.hx} cy={e.hy} r={17.58} fill={body} />
          </g>
        ))}
      </svg>
      </div>
    </div>
  );
};
