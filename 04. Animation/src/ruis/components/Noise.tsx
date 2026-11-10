import React from "react";
import { random } from "remotion";

/**
 * TV static: a field of small specks that jump every frame. `amount` 0..1
 * scales how many specks are drawn (0 = clean picture). Deterministic per
 * frame via remotion's random(), so renders are reproducible.
 */
export const Noise: React.FC<{
  width: number;
  height: number;
  amount: number;
  frame: number;
  colors: string[];
  seed?: string;
  style?: React.CSSProperties;
}> = ({ width, height, amount, frame, colors, seed = "n", style }) => {
  const count = Math.round(520 * Math.max(0, Math.min(1, amount)));
  // Re-roll every 2 frames: at 30 fps that reads as live static without strobing.
  const f = Math.floor(frame / 2);
  const specks = [];
  for (let i = 0; i < count; i++) {
    const x = random(`${seed}-x-${f}-${i}`) * width;
    const y = random(`${seed}-y-${f}-${i}`) * height;
    const w = 6 + random(`${seed}-w-${f}-${i}`) * 26;
    const c = colors[Math.floor(random(`${seed}-c-${f}-${i}`) * colors.length)];
    specks.push(<rect key={i} x={x} y={y} width={w} height={5} fill={c} />);
  }
  return (
    <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0, ...style }}>
      {specks}
    </svg>
  );
};

/** A sine wave across `width`; amplitude 0 = flat line. */
export const Wave: React.FC<{
  width: number;
  height: number;
  amplitude: number;
  phase: number;
  periods?: number;
  color: string;
  stroke?: number;
  jitter?: number;
  frame?: number;
  style?: React.CSSProperties;
}> = ({ width, height, amplitude, phase, periods = 3, color, stroke = 10, jitter = 0, frame = 0, style }) => {
  const steps = 120;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const j = jitter > 0 ? (random(`wj-${Math.floor(frame / 2)}-${i}`) - 0.5) * jitter : 0;
    const y = height / 2 + Math.sin((i / steps) * periods * Math.PI * 2 + phase) * amplitude + j;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return (
    <svg width={width} height={height} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
