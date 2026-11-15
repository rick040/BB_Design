import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

const Sparkle: React.FC<{ x: number; y: number; s: number; color: string }> = ({ x, y, s, color }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 100 100"
    style={{ position: "absolute", left: x - s / 2, top: y - s / 2 }}
  >
    <path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0 Z" fill={color} />
  </svg>
);

/** The "AI" thought cloud that guesses. Wobbles; ink colour (no red). */
export const AiCloud: React.FC<{
  frame: number;
  label: string;
  guesses: string[];
  x: number;
  y: number;
  rot: number;
  opacity: number;
}> = ({ frame, label, guesses, x, y, rot, opacity }) => {
  const p = usePalette();
  const ink = p.red; // the schema's "alert" colour, dark ink by default
  const wob = Math.sin(frame / 4) * 6;
  const g = guesses[Math.floor(frame / 9) % guesses.length];
  const g2 = guesses[(Math.floor(frame / 9) + 3) % guesses.length];
  return (
    <div
      style={{
        position: "absolute",
        left: x - 200,
        top: y - 150,
        width: 400,
        height: 300,
        opacity,
        transform: `rotate(${rot + wob * 0.4}deg)`,
      }}
    >
      <svg width={400} height={260} viewBox="0 0 400 260" style={{ position: "absolute", left: 0, top: 20 }}>
        <g fill={ink}>
          <circle cx={120} cy={140} r={80} />
          <circle cx={210} cy={100} r={95} />
          <circle cx={290} cy={150} r={75} />
          <rect x={90} y={140} width={230} height={90} rx={45} />
        </g>
        <circle cx={140} cy={250} r={14} fill={ink} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 100 + wob,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 120,
          letterSpacing: "-0.04em",
          color: p.white,
          lineHeight: 1,
        }}
      >
        {label}
      </div>
      <Sparkle x={320 + wob} y={60} s={54} color={p.yellow} />
      <Sparkle x={70} y={90 - wob} s={36} color={p.yellow} />
      {/* random guesses that keep changing */}
      <div
        style={{
          position: "absolute",
          left: -150,
          top: 250,
          padding: "10px 22px",
          borderRadius: 30,
          background: p.white,
          border: `4px dashed ${ink}`,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 32,
          color: ink,
          transform: `rotate(${-8 + wob}deg)`,
          whiteSpace: "nowrap",
        }}
      >
        {g}
      </div>
      <div
        style={{
          position: "absolute",
          right: -150,
          top: 10,
          padding: "10px 22px",
          borderRadius: 30,
          background: p.white,
          border: `4px dashed ${ink}`,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 32,
          color: ink,
          transform: `rotate(${7 - wob}deg)`,
          whiteSpace: "nowrap",
        }}
      >
        {g2}
      </div>
    </div>
  );
};
