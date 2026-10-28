import React from "react";
import { fonts } from "../../theme";

// Concept-own parts for the relay race: runner, baton, track, tag,
// speed lines, podium and medal. All drawn in stage coordinates.

// ---------------------------------------------------------------- Runner

/**
 * The runner is a flat illustration (shirt, shorts, sneakers, hair and a
 * sweatband) drawn in a 300-unit-tall local space, feet on the ground at (0, 0),
 * facing right. Arms and legs are posed from angles, so it can run, carry,
 * reach forward or reach back for the baton.
 */
const UNIT_H = 300;
const SHOULDER = { x: 2, y: -228 };
const HIP_Y = -146;
const THIGH = 66;
const SHIN = 66;
const UPPER_ARM = 54;
const FOREARM = 50;

export type Outfit = {
  skin: string;
  skinFar: string;
  hair: string;
  shirt: string;
  shirtFar: string;
  shorts: string;
  shoe: string;
  sole: string;
  band: string;
};

/** Brand-coloured outfit; `onBlue` swaps the shirt to white for blue scenes. */
export const outfitFor = (
  p: { blue: string; white: string; blueSoft: string; blueMid: string; yellow: string },
  onBlue: boolean,
): Outfit => ({
  skin: "#e9b48e",
  skinFar: "#d49c77",
  hair: "#131a44",
  shirt: onBlue ? p.white : p.blue,
  shirtFar: onBlue ? p.blueSoft : p.blueMid,
  shorts: "#0b1f6e",
  shoe: p.white,
  sole: onBlue ? p.yellow : p.blueSoft,
  band: p.yellow,
});

export type ArmPose = "swing" | "carry" | "reach" | "back" | "down";

export type RunnerPose = {
  /** Running cycle phase in radians. */
  phase: number;
  /** 0 = standing, 1 = full running stride. */
  run: number;
  /** Arm pose; "reach"/"back" blend from swing with `reach` 0..1. */
  arms: ArmPose;
  reach?: number;
  /** Forward lean in degrees. */
  lean?: number;
};

const rad = (d: number) => (d * Math.PI) / 180;
// Angles are measured from straight down; positive = forward (to the right).
const limb = (x: number, y: number, deg: number, len: number) => ({
  x: x + Math.sin(rad(deg)) * len,
  y: y + Math.cos(rad(deg)) * len,
});
const rotateAround = (pt: { x: number; y: number }, cx: number, cy: number, deg: number) => {
  // Lean: rotate clockwise (top goes forward).
  const a = rad(deg);
  const dx = pt.x - cx;
  const dy = pt.y - cy;
  return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: cy + dx * Math.sin(a) + dy * Math.cos(a) };
};

const armAngles = (pose: RunnerPose, side: 0 | 1) => {
  const swingSign = side === 0 ? 1 : -1;
  const swingUpper = -pose.run * 42 * Math.sin(pose.phase) * swingSign;
  const swing = { upper: swingUpper, fore: swingUpper + 75 + 10 * pose.run };
  if (pose.arms === "carry") return side === 0 ? { upper: 26, fore: 96 } : { upper: 34, fore: 100 };
  if (pose.arms === "down") return { upper: side === 0 ? 8 : -6, fore: side === 0 ? 22 : 8 };
  if (pose.arms === "back" && side === 0) {
    // Front arm stretched backwards, palm open for the baton.
    const r = pose.reach ?? 1;
    return { upper: swing.upper + (-62 - swing.upper) * r, fore: swing.fore + (-84 - swing.fore) * r };
  }
  if (pose.arms === "reach" && side === 0) {
    const r = pose.reach ?? 1;
    return { upper: swing.upper + (80 - swing.upper) * r, fore: swing.fore + (88 - swing.fore) * r };
  }
  return swing;
};

const bodyBob = (pose: RunnerPose) => -pose.run * 7 * Math.abs(Math.sin(pose.phase));

const armPoints = (pose: RunnerPose, side: 0 | 1) => {
  const a = armAngles(pose, side);
  const elbow = limb(SHOULDER.x, SHOULDER.y, a.upper, UPPER_ARM);
  const hand = limb(elbow.x, elbow.y, a.fore, FOREARM);
  return { a, elbow, hand };
};

/** Front hand position (stage px) for a runner whose feet are at (x, feetY). */
export const runnerHand = (pose: RunnerPose, x: number, feetY: number, height: number) => {
  const s = height / UNIT_H;
  const { hand } = armPoints(pose, 0);
  const leaned = rotateAround(hand, 0, HIP_Y, pose.lean ?? 0);
  return { x: x + leaned.x * s, y: feetY + (leaned.y + bodyBob(pose)) * s };
};

const Shoe: React.FC<{ x: number; y: number; angle: number; shoe: string; sole: string }> = ({ x, y, angle, shoe, sole }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M-15 -4 Q-15 -14 -4 -14 L8 -12 Q24 -6 34 -2 Q44 2 42 8 L-15 8 Z" fill={shoe} />
    <path d="M-17 7 L45 7 Q45 15 37 15 L-11 15 Q-17 15 -17 7 Z" fill={sole} />
    <path d="M6 -9 L14 -4 M12 -11 L20 -6" stroke={sole} strokeWidth={3} strokeLinecap="round" />
  </g>
);

export const Runner: React.FC<
  RunnerPose & {
    x: number;
    feetY: number;
    height: number;
    outfit: Outfit;
    style?: React.CSSProperties;
  }
> = ({ x, feetY, height, outfit: o, style, ...pose }) => {
  const s = height / UNIT_H;
  const bob = bodyBob(pose);
  const lean = pose.lean ?? 0;

  const leg = (side: 0 | 1) => {
    const ph = pose.phase + (side === 0 ? 0 : Math.PI);
    const thighDeg = pose.run * 40 * Math.sin(ph);
    const bend = pose.run * (18 + 62 * Math.max(0, Math.sin(ph - 1.4))) + (1 - pose.run) * 4;
    const hip = { x: 0, y: HIP_Y };
    const knee = limb(hip.x, hip.y, thighDeg, THIGH);
    const ankle = limb(knee.x, knee.y, thighDeg - bend, SHIN);
    const shortsEnd = limb(hip.x, hip.y, thighDeg, THIGH * 0.5);
    const skin = side === 0 ? o.skin : o.skinFar;
    // Foot follows the shin a little, toes up on the swing.
    const footAngle = -(thighDeg - bend) * 0.55 + pose.run * 6;
    return (
      <g key={side}>
        <path d={`M${hip.x} ${hip.y} L${knee.x} ${knee.y} L${ankle.x} ${ankle.y}`} stroke={skin} strokeWidth={24} />
        <path d={`M${hip.x} ${hip.y} L${shortsEnd.x} ${shortsEnd.y}`} stroke={o.shorts} strokeWidth={38} />
        <Shoe x={ankle.x} y={ankle.y} angle={footAngle} shoe={side === 0 ? o.shoe : "#dfe6ff"} sole={o.sole} />
      </g>
    );
  };

  const arm = (side: 0 | 1) => {
    const { elbow, hand } = armPoints(pose, side);
    const skin = side === 0 ? o.skin : o.skinFar;
    const sleeveEnd = { x: SHOULDER.x + (elbow.x - SHOULDER.x) * 0.5, y: SHOULDER.y + (elbow.y - SHOULDER.y) * 0.5 };
    return (
      <g key={side}>
        <path d={`M${SHOULDER.x} ${SHOULDER.y} L${elbow.x} ${elbow.y} L${hand.x} ${hand.y}`} stroke={skin} strokeWidth={17} />
        <path d={`M${SHOULDER.x} ${SHOULDER.y} L${sleeveEnd.x} ${sleeveEnd.y}`} stroke={side === 0 ? o.shirt : o.shirtFar} strokeWidth={28} />
        <circle cx={hand.x} cy={hand.y} r={10} fill={skin} />
      </g>
    );
  };

  const W = 400;
  return (
    <svg
      width={W * s}
      height={340 * s}
      viewBox={`${-W / 2} -320 ${W} 340`}
      style={{ position: "absolute", left: x - (W / 2) * s, top: feetY - 320 * s, overflow: "visible", ...style }}
    >
      <g transform={`translate(0 ${bob})`} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <g transform={`rotate(${lean} 0 ${HIP_Y})`}>{arm(1)}</g>
        {leg(1)}
        {leg(0)}
        {/* shorts over the hips */}
        <path d="M-25 -166 L27 -166 L29 -136 Q29 -128 20 -128 L-20 -128 Q-28 -128 -27 -138 Z" fill={o.shorts} />
        <g transform={`rotate(${lean} 0 ${HIP_Y})`}>
          {/* shirt */}
          <path d="M-24 -150 L-28 -220 Q-28 -244 -4 -246 L10 -246 Q34 -244 34 -220 L28 -150 Q2 -144 -24 -150 Z" fill={o.shirt} />
          {/* neck + head */}
          <rect x={-8} y={-262} width={18} height={22} rx={6} fill={o.skin} />
          <circle cx={-2} cy={-274} r={27} fill={o.hair} />
          <circle cx={6} cy={-269} r={24} fill={o.skin} />
          <path d="M-29 -276 Q-26 -302 4 -300 Q26 -298 30 -282 Q14 -290 -4 -284 Q-18 -278 -22 -262 Q-30 -266 -29 -276 Z" fill={o.hair} />
          <path d="M-27 -281 Q2 -296 30 -284" stroke={o.band} strokeWidth={9} />
          <circle cx={-6} cy={-268} r={6} fill={o.skinFar} />
          <path d="M29 -268 Q34 -264 29 -260" stroke={o.skinFar} strokeWidth={3} />
          {arm(0)}
        </g>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- Baton

export const BATON_W = 210;
export const BATON_H = 46;

/** A relay baton with a label. Positioned by its centre. */
export const Baton: React.FC<{
  label: string;
  cx: number;
  cy: number;
  rotate?: number;
  scale?: number;
  bg: string;
  fg: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ label, cx, cy, rotate = 0, scale = 1, bg, fg, width = BATON_W, height = BATON_H, style }) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top: cy - height / 2,
      width,
      height,
      borderRadius: height / 2,
      background: bg,
      color: fg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: height * 0.54,
      letterSpacing: "0.01em",
      boxShadow: "0 6px 16px rgba(1,30,120,0.18), inset 0 -6px 0 rgba(0,0,0,0.08)",
      transform: `rotate(${rotate}deg) scale(${scale})`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {/* grip bands at both ends, like a real baton */}
    <div style={{ position: "absolute", left: height * 0.3, top: height * 0.14, bottom: height * 0.14, width: height * 0.17, borderRadius: 4, background: fg, opacity: 0.18 }} />
    <div style={{ position: "absolute", right: height * 0.3, top: height * 0.14, bottom: height * 0.14, width: height * 0.17, borderRadius: 4, background: fg, opacity: 0.18 }} />
    {label}
  </div>
);

// ---------------------------------------------------------------- Track

/**
 * Side view of an athletics track: a band with lane lines and dashes that
 * scroll with `scroll` (px travelled), so a runner can run in place.
 */
export const Track: React.FC<{
  top: number;
  height?: number;
  scroll?: number;
  band: string;
  line: string;
  zone?: { x: number; w: number; color: string; label: string; labelColor: string };
  finishX?: number;
}> = ({ top, height = 130, scroll = 0, band, line, zone, finishX }) => {
  const dashGap = 180;
  const dashes = [];
  const off = ((scroll % dashGap) + dashGap) % dashGap;
  for (let i = -1; i < 9; i++) {
    dashes.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: i * dashGap - off,
          top: height * 0.56,
          width: 80,
          height: 8,
          borderRadius: 4,
          background: line,
          opacity: 0.7,
        }}
      />,
    );
  }
  return (
    <div style={{ position: "absolute", left: -200, width: 1480, top, height, background: band, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 8, background: line }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: line, opacity: 0.6 }} />
      {zone ? (
        <div
          style={{
            position: "absolute",
            left: zone.x + 200,
            width: zone.w,
            top: 8,
            bottom: 8,
            background: zone.color,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 10,
            fontFamily: fonts.ui,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.22em",
            color: zone.labelColor,
            borderLeft: `6px solid ${line}`,
            borderRight: `6px solid ${line}`,
          }}
        >
          {zone.label}
        </div>
      ) : null}
      {dashes.map((d, i) => (
        <div key={i} style={{ position: "absolute", left: 200, top: 0, width: 0, height: "100%" }}>
          {d}
        </div>
      ))}
      {finishX !== undefined ? (
        <div
          style={{
            position: "absolute",
            left: finishX + 200 - 14,
            top: 8,
            bottom: 8,
            width: 28,
            backgroundImage: `repeating-linear-gradient(0deg, ${line} 0 14px, transparent 14px 28px), repeating-linear-gradient(0deg, transparent 0 14px, ${line} 14px 28px)`,
            backgroundSize: "14px 100%",
            backgroundPosition: "0 0, 14px 0",
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------- Tag

/** Small pill label (e.g. "Doorsturen", "Aanmaning"), positioned by its bottom centre. */
export const Tag: React.FC<{
  text: string;
  x: number;
  y: number;
  bg: string;
  fg: string;
  scale?: number;
  rotate?: number;
  icon?: "arrow" | "check" | "alert";
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, x, y, bg, fg, scale = 1, rotate = 0, icon, size = 34, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -100%) rotate(${rotate}deg) scale(${scale})`,
      transformOrigin: "50% 100%",
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size * 0.35,
        padding: `${size * 0.32}px ${size * 0.62}px`,
        borderRadius: size,
        background: bg,
        color: fg,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: "nowrap",
        boxShadow: "0 10px 24px rgba(1,30,120,0.18)",
      }}
    >
      {icon === "alert" ? (
        <span
          style={{
            width: size * 1.05,
            height: size * 1.05,
            borderRadius: "50%",
            background: fg,
            color: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: size * 0.8,
          }}
        >
          !
        </span>
      ) : null}
      {text}
      {icon === "arrow" ? (
        <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 40 40">
          <path d="M6 20h27M22 9l11 11-11 11" fill="none" stroke={fg} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {icon === "check" ? (
        <svg width={size * 0.9} height={size * 0.9} viewBox="0 0 40 40">
          <path d="M8 21l8 8 16-17" fill="none" stroke={fg} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  </div>
);

// ---------------------------------------------------------------- Speed lines

export const SpeedLines: React.FC<{ x: number; y: number; strength: number; color: string }> = ({
  x,
  y,
  strength,
  color,
}) => {
  if (strength <= 0.01) return null;
  const lines = [
    { dy: -150, len: 160 },
    { dy: -95, len: 230 },
    { dy: -40, len: 140 },
  ];
  return (
    <>
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - l.len * strength - 20,
            top: y + l.dy,
            width: l.len * strength,
            height: 10,
            borderRadius: 5,
            background: color,
            opacity: 0.8 * strength,
          }}
        />
      ))}
    </>
  );
};

// ---------------------------------------------------------------- Podium + medal

/** Podium with three steps standing on one base line (`base` = floor y). */
export const PODIUM_STEPS = { first: 150, second: 104, third: 70, width: 230 } as const;

export const Podium: React.FC<{
  cx: number;
  base: number;
  color: string;
  side: string;
  shade: string;
  numberColor: string;
  rise: number;
}> = ({ cx, base, color, side, shade, numberColor, rise }) => {
  const W = PODIUM_STEPS.width;
  const block = (x: number, h: number, n: string, bg: string, k: number) => (
    <div
      key={n}
      style={{
        position: "absolute",
        left: x,
        width: W,
        top: base - h * k,
        height: h * k,
        background: bg,
        borderRadius: "16px 16px 0 0",
        overflow: "hidden",
        boxShadow: `inset 0 10px 0 rgba(255,255,255,0.35), inset -10px 0 0 ${shade}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 10,
          top: 18,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: numberColor,
        }}
      >
        {n}
      </div>
    </div>
  );
  return (
    <>
      {block(cx - W * 1.5, PODIUM_STEPS.second, "2", side, Math.min(1, rise * 1.15))}
      {block(cx + W * 0.5, PODIUM_STEPS.third, "3", side, Math.min(1, rise * 1.1))}
      {block(cx - W / 2, PODIUM_STEPS.first, "1", color, rise)}
      <div style={{ position: "absolute", left: cx - W * 1.5 - 30, width: W * 3 + 60, top: base, height: 8, borderRadius: 4, background: side, opacity: rise }} />
    </>
  );
};

/** Ribbon + medal, drawn with its ribbon top at (cx, top). */
export const Medal: React.FC<{
  cx: number;
  top: number;
  swing: number;
  ribbon: string;
  disc: string;
  text: string;
  textColor: string;
}> = ({ cx, top, swing, ribbon, disc, text, textColor }) => (
  <div
    style={{
      position: "absolute",
      left: cx - 60,
      top,
      width: 120,
      height: 210,
      transform: `rotate(${swing}deg)`,
      transformOrigin: "50% 0%",
    }}
  >
    <svg width={120} height={110} viewBox="0 0 120 110" style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M12 0 L50 104 L70 104 L108 0 L88 0 L60 78 L32 0 Z" fill={ribbon} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 92,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: disc,
        boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.12), 0 8px 18px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 40,
        lineHeight: 0.9,
        letterSpacing: "-0.03em",
        color: textColor,
      }}
    >
      {text}
    </div>
  </div>
);
