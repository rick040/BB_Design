import React from "react";
import { interpolate } from "remotion";
import { clamp, shake } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { buildMaze, CELL, cellCenter, COLS, ROWS } from "../maze";

export const MAZE_W = COLS * CELL;
export const MAZE_H = ROWS * CELL;

/**
 * Top-down maze with the yellow "you" dot wandering through it.
 * keys: [frame, walkIndex] pairs; the dot follows them piecewise-linearly.
 * chips: label + frame; chip 0 sits at the entrance, the rest at the dead ends the dot hits.
 */
export const Maze: React.FC<{
  frame: number;
  seed: number;
  keys: [number, number][];
  chips: { label: string; at: number; pop: number }[];
  wall: string;
  chipScale?: number;
}> = ({ frame, seed, keys, chips, wall, chipScale = 1 }) => {
  const p = usePalette();
  const m = buildMaze(seed);
  const f = interpolate(
    frame,
    keys.map((k) => k[0]),
    keys.map((k) => k[1]),
    clamp,
  );
  const i0 = Math.min(m.walk.length - 1, Math.floor(f));
  const i1 = Math.min(m.walk.length - 1, i0 + 1);
  const a = cellCenter(m.walk[i0]);
  const b = cellCenter(m.walk[i1]);
  const t = f - i0;
  const dot = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };

  // Shake the dot when it bumps into a dead end.
  let sx = 0;
  for (const c of chips.slice(1)) {
    const s = shake(frame, c.at, 10, 7);
    sx += s.x;
  }

  // Walls as one path.
  let d = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * CELL;
      const y = r * CELL;
      if (m.east[r][c] && !(c === COLS - 1 && r === ROWS - 1)) d += `M${x + CELL} ${y}V${y + CELL}`;
      if (m.south[r][c]) d += `M${x} ${y + CELL}H${x + CELL}`;
    }
  }
  d += `M0 ${CELL}V${MAZE_H}M0 0H${MAZE_W}`; // left wall with the entrance gap at the top row

  // Faint trail of where the dot has been.
  const trail: { x: number; y: number }[] = [];
  for (let i = 0; i <= i0; i++) trail.push(cellCenter(m.walk[i]));
  trail.push(dot);
  const trailD = trail.map((pt, i) => `${i ? "L" : "M"}${pt.x} ${pt.y}`).join("");

  const chipAt = (k: number) => {
    if (k === 0) return { x: 125, y: -12 };
    const cell = m.walk[m.deadEnds[k - 1]];
    const c = cellCenter(cell);
    return { x: Math.max(130, Math.min(MAZE_W - 130, c.x)), y: c.y - 62 };
  };

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: MAZE_W, height: MAZE_H }}>
      <svg width={MAZE_W} height={MAZE_H} style={{ position: "absolute", overflow: "visible" }}>
        <path d={trailD} fill="none" stroke={p.yellow} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 20" opacity={0.9} />
        <path d={d} fill="none" stroke={wall} strokeWidth={12} strokeLinecap="round" />
        <circle cx={dot.x + sx} cy={dot.y} r={24} fill={p.yellow} stroke={p.ink} strokeWidth={5} />
      </svg>
      {chips.map((c, k) => {
        const pos = chipAt(k);
        const s = c.pop;
        if (s <= 0.01) return null;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${(0.6 + 0.4 * s) * chipScale}) rotate(${k % 2 ? 3 : -3}deg)`,
              opacity: Math.min(1, s * 2),
              background: p.ink,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 36,
              padding: "12px 26px",
              borderRadius: 40,
              whiteSpace: "nowrap",
              boxShadow: "0 12px 30px rgba(17, 17, 20, 0.25)",
            }}
          >
            {c.label}
          </div>
        );
      })}
    </div>
  );
};

/** Plain envelope icon. */
export const Envelope: React.FC<{ size: number; color: string; line: string }> = ({ size, color, line }) => (
  <svg width={size} height={size * 0.72} viewBox="0 0 100 72" style={{ display: "block" }}>
    <rect x={3} y={3} width={94} height={66} rx={10} fill={color} />
    <path d="M8 10 L50 42 L92 10" fill="none" stroke={line} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Calendar icon with an optional check (0..1). */
export const CalendarIcon: React.FC<{ size: number; color: string; accent: string; check: number }> = ({
  size,
  color,
  accent,
  check,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
    <rect x={6} y={14} width={88} height={80} rx={14} fill={color} />
    <rect x={6} y={14} width={88} height={24} rx={12} fill={accent} />
    <rect x={6} y={28} width={88} height={10} fill={accent} />
    <rect x={26} y={4} width={9} height={20} rx={4} fill={accent} />
    <rect x={65} y={4} width={9} height={20} rx={4} fill={accent} />
    <path
      d="M30 64 L45 78 L72 50"
      fill="none"
      stroke={accent}
      strokeWidth={9}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - check}
    />
  </svg>
);
