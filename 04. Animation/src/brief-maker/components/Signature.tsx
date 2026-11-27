import React from "react";
import { interpolate } from "remotion";

// A hand-drawn "Rick" in single strokes. `progress` 0..1 draws the strokes
// one after another, like a pen. Drawn in a 260 × 130 box.
const STROKES = [
  // R: stem, bowl, leg
  "M22 104 C 24 80, 28 50, 34 22",
  "M34 22 C 70 10, 84 46, 44 60 C 40 62, 36 62, 34 61",
  "M44 60 C 56 76, 66 92, 80 104",
  // i: down stroke, then the dot
  "M96 74 C 95 84, 94 94, 97 104",
  "M99 54 l 1 1",
  // c
  "M140 76 C 128 66, 108 82, 114 98 C 118 108, 134 106, 146 96",
  // k: stem, arm, leg
  "M166 22 C 164 52, 162 80, 160 106",
  "M196 64 C 184 74, 172 82, 162 86",
  "M170 82 C 182 92, 194 100, 210 104",
  // underline flourish
  "M18 120 C 90 112, 170 110, 246 98",
];

export const Signature: React.FC<{ width: number; color: string; progress: number; style?: React.CSSProperties }> = ({
  width,
  color,
  progress,
  style,
}) => {
  const n = STROKES.length;
  return (
    <svg width={width} height={width * 0.5} viewBox="0 0 260 130" style={{ display: "block", overflow: "visible", ...style }}>
      {STROKES.map((d, i) => {
        const p = interpolate(progress * n, [i, i + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            opacity={p > 0 ? 1 : 0}
          />
        );
      })}
    </svg>
  );
};
