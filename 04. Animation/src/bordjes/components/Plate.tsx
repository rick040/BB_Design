import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A spinning plate seen slightly from above, drawn as SVG so the label stays
// editable. Spinning is suggested by a short streak that runs round the rim
// (stroke-dashoffset), so it reads in a still frame too.

const ellipsePerimeter = (a: number, b: number) =>
  Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));

export const PLATE_TILT = 0.3; // ry / rx

export const Plate: React.FC<{
  rx: number;
  label: string;
  /** Spin phase, 0..1 = one turn of the streak round the rim. */
  phase: number;
  /** Plate fill + rim colours. */
  face?: string;
  rim?: string;
  streak?: string;
  labelColor?: string;
  style?: React.CSSProperties;
}> = ({ rx, label, phase, face, rim, streak, labelColor, style }) => {
  const p = usePalette();
  const ry = rx * PLATE_TILT;
  const pad = 14;
  const w = rx * 2 + pad * 2;
  const thick = rx * 0.07;
  const h = ry * 2 + thick + pad * 2;
  const cx = w / 2;
  const cy = pad + ry;
  const ringA = rx * 0.82;
  const ringB = ry * 0.82;
  const per = ellipsePerimeter(ringA, ringB);
  const dash = per * 0.16;

  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
        {/* underside / thickness */}
        <ellipse cx={cx} cy={cy + thick} rx={rx} ry={ry} fill={rim ?? "#c9d3e3"} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={face ?? p.white} stroke={rim ?? "#c9d3e3"} strokeWidth={3} />
        <ellipse cx={cx} cy={cy + ry * 0.06} rx={rx * 0.6} ry={ry * 0.6} fill="#eef2fa" />
        <ellipse cx={cx} cy={cy} rx={ringA} ry={ringB} fill="none" stroke={p.blueSoft} strokeWidth={rx * 0.035} opacity={0.6} />
        <ellipse
          cx={cx}
          cy={cy}
          rx={ringA}
          ry={ringB}
          fill="none"
          stroke={streak ?? p.blue}
          strokeWidth={rx * 0.055}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${per - dash}`}
          strokeDashoffset={-phase * per}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: cy - rx * 0.15,
          textAlign: "center",
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: rx * 0.27,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          color: labelColor ?? p.ink,
          transform: `scaleY(0.92)`,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Size of the Plate box for a given rx (so callers can centre it). */
export const plateBox = (rx: number) => {
  const ry = rx * PLATE_TILT;
  const pad = 14;
  return { w: rx * 2 + pad * 2, h: ry * 2 + rx * 0.07 + pad * 2, cy: pad + ry };
};

/**
 * A plate on a stick. (x, tipY) is the top of the stick = the plate's centre
 * point. `wobble` (deg) rocks the plate round the tip; `plate` lets the plate
 * leave the stick (falling); `hidePlate` removes it after it shattered.
 */
export const PlateOnStick: React.FC<{
  x: number;
  tipY: number;
  floorY: number;
  rx: number;
  label: string;
  phase: number;
  wobble?: number;
  plate?: { x: number; y: number; r: number };
  hidePlate?: boolean;
  stickColor?: string;
  stickSway?: number;
  face?: string;
  rim?: string;
  streak?: string;
  labelColor?: string;
  plateOpacity?: number;
  plateScale?: number;
}> = ({
  x,
  tipY,
  floorY,
  rx,
  label,
  phase,
  wobble = 0,
  plate = { x: 0, y: 0, r: 0 },
  hidePlate,
  stickColor,
  stickSway = 0,
  face,
  rim,
  streak,
  labelColor,
  plateOpacity = 1,
  plateScale = 1,
}) => {
  const p = usePalette();
  const box = plateBox(rx);
  const len = floorY - tipY;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 5,
          top: tipY,
          width: 10,
          height: len,
          borderRadius: 5,
          background: stickColor ?? p.blue,
          transformOrigin: "50% 100%",
          transform: `rotate(${stickSway}deg)`,
        }}
      />
      {hidePlate ? null : (
        <Plate
          rx={rx}
          label={label}
          phase={phase}
          face={face}
          rim={rim}
          streak={streak}
          labelColor={labelColor}
          style={{
            left: x - box.w / 2 + plate.x,
            top: tipY - box.cy + plate.y,
            transformOrigin: `50% ${box.cy}px`,
            transform: `rotate(${wobble + plate.r}deg) scale(${plateScale})`,
            opacity: plateOpacity,
          }}
        />
      )}
    </>
  );
};

/** Shards of a plate that hit the floor at frame `start` (scene-local). */
export const Shards: React.FC<{ x: number; y: number; t: number; color?: string; rim?: string }> = ({
  x,
  y,
  t,
  color,
  rim,
}) => {
  const p = usePalette();
  if (t <= 0 || t > 30) return null;
  const pieces = [
    { vx: -14, vy: -16, r: -18, pts: "0,0 46,6 22,34" },
    { vx: 12, vy: -19, r: 22, pts: "0,0 40,-4 30,30" },
    { vx: -7, vy: -24, r: -9, pts: "0,0 28,2 10,26" },
    { vx: 18, vy: -10, r: 30, pts: "0,0 34,10 6,24" },
    { vx: -20, vy: -8, r: -26, pts: "0,0 30,-6 22,20" },
    { vx: 4, vy: -27, r: 14, pts: "0,0 22,4 12,22" },
    { vx: 24, vy: -15, r: -20, pts: "0,0 26,8 4,18" },
  ];
  const fade = Math.max(0, 1 - Math.max(0, t - 14) / 16);
  return (
    <>
      {pieces.map((s, i) => {
        const px = x + s.vx * t;
        const py = y + s.vy * t + 1.6 * t * t;
        return (
          <svg
            key={i}
            width={60}
            height={60}
            viewBox="-10 -20 60 60"
            style={{
              position: "absolute",
              left: px - 20,
              top: py - 10,
              transform: `rotate(${s.r * t}deg)`,
              opacity: fade,
              overflow: "visible",
            }}
          >
            <polygon points={s.pts} fill={color ?? p.white} stroke={rim ?? "#c9d3e3"} strokeWidth={3} strokeLinejoin="round" />
          </svg>
        );
      })}
    </>
  );
};
