import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";

// Shared cloth look for the handkerchief, its knots and Buddy's hanky hat:
// white gingham with soft-blue checks and a blue hem.

/** <defs> with the gingham pattern; use fill={`url(#${id})`}. */
export const Gingham: React.FC<{ id: string; cell?: number }> = ({ id, cell = 44 }) => {
  const p = usePalette();
  return (
    <defs>
      <pattern id={id} width={cell * 2} height={cell * 2} patternUnits="userSpaceOnUse">
        <rect width={cell * 2} height={cell * 2} fill={p.white} />
        <rect width={cell} height={cell * 2} fill={p.blueSoft} opacity={0.5} />
        <rect width={cell * 2} height={cell} fill={p.blueSoft} opacity={0.5} />
      </pattern>
    </defs>
  );
};

const useSvgId = (prefix: string) => `${prefix}-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

/**
 * A knot in the cloth: a round lump with two little ends sticking out.
 * `loosen` 0..1 unties it (lump shrinks, ends flop open and fade).
 */
export const Knot: React.FC<{
  size: number;
  loosen?: number;
  /** Rotation of the two ends, deg. */
  angle?: number;
  style?: React.CSSProperties;
}> = ({ size, loosen = 0, angle = -20, style }) => {
  const p = usePalette();
  const id = useSvgId("knot");
  const lump = interpolate(loosen, [0, 1], [1, 0.25], clamp);
  const spread = interpolate(loosen, [0, 1], [0, 40], clamp);
  const fade = interpolate(loosen, [0.5, 1], [1, 0], clamp);
  return (
    <svg
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      style={{ position: "absolute", overflow: "visible", opacity: fade, ...style }}
    >
      <Gingham id={id} cell={14} />
      <g transform={`rotate(${angle})`}>
        {/* two loose ends, both on the right: one up, one out */}
        <path
          d={`M22,-30 C40,-60 ${70 + spread},-${88 + spread} ${96 + spread},-${96 + spread * 0.6} C${86 + spread},-${62 + spread * 0.3} 64,-30 40,-6 Z`}
          fill={`url(#${id})`}
          stroke={p.blue}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path
          d={`M44,18 C70,26 ${92 + spread},${36 + spread} ${112 + spread},${30 + spread * 0.5} C${100 + spread},${56 + spread * 0.4} 74,58 40,40 Z`}
          fill={`url(#${id})`}
          stroke={p.blue}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {/* the twisted lump */}
        <g transform={`scale(${lump})`}>
          <path
            d="M-58,-6 C-60,-44 -22,-62 8,-56 C44,-52 64,-24 58,8 C54,42 22,60 -10,56 C-44,52 -56,28 -58,-6 Z"
            fill={`url(#${id})`}
            stroke={p.blue}
            strokeWidth={6 / Math.max(0.4, lump)}
            strokeLinejoin="round"
          />
          {/* twist band across the middle */}
          <path d="M-30,-44 C-6,-20 10,10 34,44" fill="none" stroke={p.blue} strokeWidth={5} strokeLinecap="round" />
          <path d="M-8,-54 C14,-24 30,6 52,26" fill="none" stroke={p.blue} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
          <path d="M-52,-16 C-34,4 -24,26 -12,50" fill="none" stroke={p.blue} strokeWidth={3} strokeLinecap="round" opacity={0.4} />
        </g>
      </g>
    </svg>
  );
};

/** The handkerchief: a square of gingham with a hem and soft folds. */
export const Handkerchief: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const p = usePalette();
  const id = useSvgId("hanky");
  return (
    <svg width={size} height={size} viewBox="0 0 600 600" style={{ position: "absolute", overflow: "visible", ...style }}>
      <Gingham id={id} cell={40} />
      <path
        d="M24,30 C150,12 300,34 576,20 C590,160 568,330 582,574 C420,590 220,566 20,584 C34,420 8,220 24,30 Z"
        fill={`url(#${id})`}
        stroke={p.blue}
        strokeWidth={10}
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 30px 40px rgba(1,40,160,0.18))" }}
      />
      {/* hem */}
      <path
        d="M58,62 C170,48 300,66 544,54 C556,180 538,340 548,542 C410,556 220,534 54,550 C66,410 44,230 58,62 Z"
        fill="none"
        stroke={p.blue}
        strokeWidth={4}
        strokeDasharray="14 12"
        opacity={0.55}
      />
      {/* folds */}
      <path d="M40,300 C200,280 380,320 560,296" fill="none" stroke={p.blue} strokeWidth={3} opacity={0.18} />
      <path d="M300,40 C320,200 280,400 304,560" fill="none" stroke={p.blue} strokeWidth={3} opacity={0.18} />
    </svg>
  );
};

/**
 * A hanky worn as a hat, knotted in the corners (the classic beach look).
 * Drawn in its own box: width w, the brim sits on the bottom edge.
 */
export const HankyHat: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => {
  const p = usePalette();
  const id = useSvgId("hat");
  const h = width * 0.55;
  return (
    <svg width={width} height={h} viewBox="0 0 400 220" style={{ position: "absolute", overflow: "visible", ...style }}>
      <Gingham id={id} cell={22} />
      <path
        d="M30,206 C34,120 100,40 200,34 C300,40 366,120 370,206 C300,192 100,192 30,206 Z"
        fill={`url(#${id})`}
        stroke={p.blue}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      <path d="M60,184 C140,170 260,170 340,184" fill="none" stroke={p.blue} strokeWidth={4} strokeDasharray="10 9" opacity={0.6} />
      {/* knotted corners */}
      {[
        { x: 22, y: 196, r: -30 },
        { x: 378, y: 196, r: 30 },
        { x: 200, y: 30, r: 0 },
      ].map((k, i) => (
        <g key={i} transform={`translate(${k.x} ${k.y}) rotate(${k.r})`}>
          <path d="M-6,-8 C-26,-40 -16,-60 0,-66 C16,-60 26,-40 6,-8 Z" fill={`url(#${id})`} stroke={p.blue} strokeWidth={7} strokeLinejoin="round" />
          <circle r={22} fill={`url(#${id})`} stroke={p.blue} strokeWidth={7} />
        </g>
      ))}
    </svg>
  );
};

/** Small blue "?" badge that floats above a knot. */
export const QuestionBadge: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: p.blue,
        color: p.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.62,
        boxShadow: "0 12px 30px rgba(1,40,160,0.25)",
        ...style,
      }}
    >
      ?
    </div>
  );
};
