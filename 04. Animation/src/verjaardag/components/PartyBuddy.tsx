import React from "react";
import { interpolate, random } from "remotion";
import { Buddy, BUDDY_RATIO, BUDDY_VIEWBOX } from "../../components/Buddy";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Buddy in party mode: a party hat on his head and a party horn ("toeter")
// that unrolls whenever he gives you a heads-up. Hat and horn follow his
// squash & stretch, so they stay attached when he bounces.

const HAT_ANCHOR = { x: 150, y: 10 }; // top of the B, in Buddy's viewBox
const HORN_ANCHOR = { x: 160, y: 206 }; // just under the eyes ("mouth")

/** 0 → 1 → 0 over one toot (unroll, hold, roll back). */
export const tootCurve = (frame: number, start: number, len = 18) =>
  interpolate(frame, [start, start + 5, start + len - 6, start + len], [0, 1, 1, 0], clamp);

/** Squash pulse that goes with a toot (Buddy puffs). */
export const tootSquash = (frame: number, start: number, len = 18) =>
  interpolate(frame, [start - 3, start, start + 4, start + len], [1, 0.9, 1.06, 1], clamp);

/** The anchor of the horn in Buddy-local pixels (feet centre = 0,0). */
export const hornAnchor = (size: number, squash = 1) => {
  const h = size * BUDDY_RATIO;
  const sx = 1 / Math.sqrt(squash);
  const ax = (HORN_ANCHOR.x / BUDDY_VIEWBOX.width - 0.5) * size * sx;
  const ay = -(h - (HORN_ANCHOR.y / BUDDY_VIEWBOX.height) * h) * squash;
  return { x: ax, y: ay };
};

export const PartyHat: React.FC<{ width: number; color: string; stripe: string; pom: string }> = ({
  width,
  color,
  stripe,
  pom,
}) => {
  const id = `hat-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg width={width} height={width * 1.3} viewBox="0 0 100 130" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <clipPath id={id}>
          <path d="M50 14 L94 124 Q50 134 6 124 Z" />
        </clipPath>
      </defs>
      <path d="M50 14 L94 124 Q50 134 6 124 Z" fill={color} />
      <g clipPath={`url(#${id})`}>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-20} y={30 + i * 26} width={140} height={11} fill={stripe} transform="rotate(-14 50 70)" />
        ))}
      </g>
      <circle cx={50} cy={13} r={13} fill={pom} />
    </svg>
  );
};

/** A party horn pointing along +x from (0,0). `unroll` 0 = coiled, 1 = out. */
export const PartyHorn: React.FC<{ length: number; unroll: number; tube: string; stripe: string; mouth: string }> = ({
  length: L,
  unroll: u,
  tube,
  stripe,
  mouth,
}) => {
  const id = `horn-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const mouthLen = 0.16 * L;
  const tubeLen = 0.84 * L * u;
  const th = 0.12 * L;
  const xe = mouthLen + tubeLen;
  const r = 0.035 * L + 0.075 * L * (1 - u);
  return (
    <svg
      width={L * 1.3}
      height={L * 0.6}
      viewBox={`0 ${-L * 0.3} ${L * 1.3} ${L * 0.6}`}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <pattern id={id} width={0.09 * L} height={th} patternUnits="userSpaceOnUse" patternTransform="skewX(-25)">
          <rect width={0.09 * L} height={th} fill={tube} />
          <rect width={0.035 * L} height={th} fill={stripe} />
        </pattern>
      </defs>
      {/* tube */}
      {tubeLen > 1 ? (
        <path
          d={`M ${mouthLen - 2} ${-th * 0.42} L ${xe} ${-th / 2} L ${xe} ${th / 2} L ${mouthLen - 2} ${th * 0.42} Z`}
          fill={`url(#${id})`}
        />
      ) : null}
      {/* coil at the end (shrinks as it unrolls) */}
      <circle cx={xe + r * 0.55} cy={-r * 0.55} r={r} fill="none" stroke={tube} strokeWidth={th * 0.9} />
      {/* frill when fully out */}
      {u > 0.6
        ? [-1, 0, 1].map((k) => (
            <line
              key={k}
              x1={xe + 4}
              y1={0}
              x2={xe + 4 + 0.13 * L * (u - 0.6) * 2.5}
              y2={k * 0.1 * L * (u - 0.6) * 2.5}
              stroke={mouth}
              strokeWidth={0.03 * L}
              strokeLinecap="round"
            />
          ))
        : null}
      {/* mouthpiece */}
      <rect x={0} y={-0.045 * L} width={mouthLen} height={0.09 * L} rx={0.03 * L} fill={mouth} />
    </svg>
  );
};

export const PartyBuddy: React.FC<{
  /** Centre x and feet y, in the parent's coordinates. */
  x: number;
  feetY: number;
  size: number;
  body: string;
  eye: string;
  blink?: number;
  look?: { x: number; y: number };
  squash?: number;
  hatTilt?: number;
  /** Degrees, 0 = to the right, 180 = to the left. */
  hornAngle?: number;
  hornLength?: number;
  /** 0..1 */
  hornUnroll?: number;
  toot?: string;
  style?: React.CSSProperties;
}> = ({
  x,
  feetY,
  size,
  body,
  eye,
  blink = 1,
  look = { x: 0, y: 0 },
  squash = 1,
  hatTilt = -14,
  hornAngle = 180,
  hornLength,
  hornUnroll = 0,
  toot,
  style,
}) => {
  const p = usePalette();
  const h = size * BUDDY_RATIO;
  const sx = 1 / Math.sqrt(squash);
  const L = hornLength ?? size * 1.1;
  const hatW = size * 0.42;
  const hatX = (HAT_ANCHOR.x / BUDDY_VIEWBOX.width - 0.5) * size * sx;
  const hatY = -(h - (HAT_ANCHOR.y / BUDDY_VIEWBOX.height) * h) * squash;
  const horn = hornAnchor(size, squash);
  const rad = (hornAngle * Math.PI) / 180;
  const reach = 0.16 * L + 0.84 * L * hornUnroll;
  const tip = { x: horn.x + Math.cos(rad) * (reach + 50), y: horn.y + Math.sin(rad) * (reach + 50) };
  const label = interpolate(hornUnroll, [0.5, 1], [0, 1], clamp);
  const jitter = (random(`toot-${Math.round(hornUnroll * 10)}`) - 0.5) * 6;

  return (
    <div style={{ position: "absolute", left: x, top: feetY, width: 0, height: 0, ...style }}>
      <Buddy
        size={size}
        body={body}
        eye={eye}
        blink={blink}
        look={look}
        squash={squash}
        style={{ position: "absolute", left: -size / 2, top: -h }}
      />
      <div
        style={{
          position: "absolute",
          left: hatX - hatW / 2,
          top: hatY - hatW * 1.3 + hatW * 0.12,
          transform: `rotate(${hatTilt}deg)`,
          transformOrigin: "50% 92%",
        }}
      >
        <PartyHat width={hatW} color={p.yellow} stripe={p.red} pom={p.teal} />
      </div>
      <div
        style={{
          position: "absolute",
          left: horn.x,
          top: horn.y - L * 0.3,
          transform: `rotate(${hornAngle}deg)`,
          transformOrigin: `0px ${L * 0.3}px`,
        }}
      >
        <PartyHorn length={L} unroll={hornUnroll} tube={p.red} stripe={p.white} mouth={p.yellow} />
      </div>
      {toot && label > 0 ? (
        <div
          style={{
            position: "absolute",
            left: tip.x - 100,
            top: tip.y - 40,
            width: 200,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: size * 0.26,
            letterSpacing: "-0.03em",
            color: p.yellow,
            WebkitTextStroke: `${Math.max(2, size * 0.012)}px ${p.ink}`,
            paintOrder: "stroke fill",
            opacity: label,
            transform: `scale(${0.5 + 0.5 * label}) rotate(${-8 + jitter}deg)`,
          }}
        >
          {toot}
        </div>
      ) : null}
    </div>
  );
};
