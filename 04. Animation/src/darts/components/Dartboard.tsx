import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A dartboard in brand colours. Three target zones, from outside in:
// zone 0 = outer band (7 days before), zone 1 = middle band (2 days before),
// zone 2 = bullseye (the due date). Radii are fractions of R.
export const ZONES = {
  rim: 1, // blue number ring
  outer: [0.56, 0.84] as const,
  middle: [0.27, 0.56] as const,
  bull: 0.27,
  bullseye: 0.12,
};

/** Board-local point (relative to the centre) in the middle of a zone at an angle (deg, 0 = right, clockwise). */
export const zonePoint = (R: number, zone: 0 | 1 | 2, angleDeg: number) => {
  const a = (angleDeg * Math.PI) / 180;
  const r = zone === 0 ? ((ZONES.outer[0] + ZONES.outer[1]) / 2) * R : zone === 1 ? ((ZONES.middle[0] + ZONES.middle[1]) / 2) * R : 0;
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
};

const sector = (r0: number, r1: number, a0: number, a1: number) => {
  const p = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
  return `M${p(r0, a0)} L${p(r1, a0)} A${r1} ${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
};

const ring = (r0: number, r1: number) =>
  `M${r1} 0 A${r1} ${r1} 0 1 1 ${-r1} 0 A${r1} ${r1} 0 1 1 ${r1} 0 Z M${r0} 0 A${r0} ${r0} 0 1 0 ${-r0} 0 A${r0} ${r0} 0 1 0 ${r0} 0 Z`;

export const Dartboard: React.FC<{
  /** Radius in px. */
  R: number;
  /** Glow per zone, 0..1 (outer, middle, bull). */
  glow?: [number, number, number];
  /** Small label on the rim above the bullseye (e.g. the due date). */
  label?: string;
  labelIn?: number;
  style?: React.CSSProperties;
}> = ({ R, glow = [0, 0, 0], label, labelIn = 1, style }) => {
  const p = usePalette();
  const N = 20;
  const step = (Math.PI * 2) / N;
  const off = -Math.PI / 2 - step / 2;
  const segs: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const a0 = off + i * step;
    const a1 = a0 + step;
    const even = i % 2 === 0;
    segs.push(
      <path key={`o${i}`} d={sector(ZONES.outer[0] * R, ZONES.outer[1] * R, a0, a1)} fill={even ? p.white : p.blueSoft} />,
      <path key={`m${i}`} d={sector(ZONES.middle[0] * R, ZONES.middle[1] * R, a0, a1)} fill={even ? p.blueSoft : p.white} />,
    );
  }
  const line = Math.max(3, R * 0.012);

  return (
    <div style={{ position: "absolute", width: R * 2, height: R * 2, ...style }}>
      <svg viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} width={R * 2} height={R * 2} style={{ overflow: "visible", display: "block" }}>
        {/* soft drop shadow */}
        <circle cx={0} cy={R * 0.04} r={R} fill="rgba(1, 40, 160, 0.14)" style={{ filter: `blur(${R * 0.06}px)` }} />
        <circle r={R} fill={p.blue} />
        {/* rim ticks */}
        {Array.from({ length: N }).map((_, i) => {
          const a = off + i * step;
          return (
            <line
              key={`t${i}`}
              x1={Math.cos(a) * ZONES.outer[1] * R}
              y1={Math.sin(a) * ZONES.outer[1] * R}
              x2={Math.cos(a) * 0.93 * R}
              y2={Math.sin(a) * 0.93 * R}
              stroke={p.blueText}
              strokeWidth={line}
              strokeLinecap="round"
            />
          );
        })}
        {segs}
        <circle r={ZONES.bull * R} fill={p.blueSoft} />
        <circle r={ZONES.bullseye * R} fill={p.blue} />
        {/* wires */}
        {[ZONES.outer[1], ZONES.outer[0], ZONES.middle[0], ZONES.bull, ZONES.bullseye].map((r) => (
          <circle key={r} r={r * R} fill="none" stroke={p.blue} strokeWidth={line} />
        ))}
        {/* glows */}
        <path d={ring(ZONES.outer[0] * R, ZONES.outer[1] * R)} fill={p.yellow} fillRule="evenodd" opacity={glow[0] * 0.85} />
        <path d={ring(ZONES.middle[0] * R, ZONES.middle[1] * R)} fill={p.yellow} fillRule="evenodd" opacity={glow[1] * 0.85} />
        <circle r={ZONES.bull * R} fill={p.yellow} opacity={glow[2] * 0.9} />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: R,
            top: R * 0.035,
            transform: `translateX(-50%) scale(${labelIn})`,
            opacity: Math.min(1, labelIn * 2),
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: R * 0.1,
            letterSpacing: "-0.02em",
            color: p.white,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};
