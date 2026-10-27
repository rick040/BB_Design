import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Concept-own parts for "Eng was hij alleen in het donker.": the dark room
// colours, a bare bulb on a pull cord, the unopened mail, the monster shadow
// it casts, the calendar tiles and the ghost sheet Buddy hides under.

/** Mix two hex colours, t = 0 → a, t = 1 → b. */
export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa
    .map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0"))
    .join("")}`;
};

/** The dark room is derived from the brand blue, so it follows the colour props. */
export const useNight = () => {
  const p = usePalette();
  return {
    room: mix(p.blue, "#000000", 0.86),
    wall: mix(p.blue, "#000000", 0.62),
    shadow: mix(p.blue, "#000000", 0.95),
    bulbOn: "#fff4cf",
    bulbOff: mix(p.blue, "#000000", 0.45),
  };
};

/** Light on the wall around the bulb (and the mail): a soft radial glow. */
export const WallGlow: React.FC<{ x: number; y: number; r: number; on: number }> = ({ x, y, r, on }) => {
  const n = useNight();
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${n.wall} 0%, ${n.wall}00 70%)`,
        opacity: 0.35 + 0.65 * on,
      }}
    />
  );
};

export const BULB_W = 96;

/** A bare bulb on a cord. `on` 0..1, `pull` stretches the cord down (px). */
export const Bulb: React.FC<{
  x: number;
  y: number;
  on: number;
  pull?: number;
  handle?: boolean;
  cordLen?: number;
}> = ({ x, y, on, pull = 0, handle = false, cordLen = 260 }) => {
  const n = useNight();
  const glass = on > 0.5 ? n.bulbOn : n.bulbOff;
  return (
    <>
      {/* glow */}
      <div
        style={{
          position: "absolute",
          left: x - 260,
          top: y + 40 - 260,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${n.bulbOn}88 0%, ${n.bulbOn}22 30%, ${n.bulbOn}00 65%)`,
          opacity: on,
        }}
      />
      {/* cord from far above the frame */}
      <div style={{ position: "absolute", left: x - 2, top: y - 1400, width: 4, height: 1400, background: "#05081c" }} />
      <svg
        width={BULB_W}
        height={140}
        viewBox="0 0 96 140"
        style={{ position: "absolute", left: x - BULB_W / 2, top: y - 4, overflow: "visible" }}
      >
        <rect x={34} y={0} width={28} height={34} rx={4} fill="#5b6077" />
        <rect x={34} y={10} width={28} height={4} fill="#3b3f52" />
        <rect x={34} y={20} width={28} height={4} fill="#3b3f52" />
        <path d="M30 34 C 0 60 6 112 48 118 C 90 112 96 60 66 34 Z" fill={glass} />
        <path d="M40 60 q 8 -10 16 0 q -8 14 -16 0" fill="none" stroke={on > 0.5 ? "#f2b630" : "#060a24"} strokeWidth={4} />
      </svg>
      {handle ? (
        <>
          <div
            style={{
              position: "absolute",
              left: x + 34,
              top: y + 20,
              width: 3,
              height: cordLen + pull,
              background: "#c9cfe6",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: x + 35.5 - 13,
              top: y + 20 + cordLen + pull,
              width: 26,
              height: 40,
              borderRadius: 13,
              background: "#c9cfe6",
            }}
          />
        </>
      ) : null}
    </>
  );
};

export const MAIL_W = 780;
export const MAIL_H = 200;

const Envelope: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <rect x={5} y={9} width={30} height={22} rx={4} fill="none" stroke={color} strokeWidth={3} />
    <path d="M6 11 L20 22 L34 11" fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
  </svg>
);

/** The unopened mail. `press` 0..1 animates a tap on the forward button. */
export const MailCard: React.FC<{
  sender: string;
  subject: string;
  preview: string;
  age: string;
  forward?: string;
  press?: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, preview, age, forward, press = 0, style }) => {
  const p = usePalette();
  const ripple = press > 0 && press < 1 ? press : 0;
  return (
    <div
      style={{
        position: "absolute",
        width: MAIL_W,
        height: MAIL_H,
        borderRadius: 40,
        background: p.card,
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 40,
          width: 92,
          height: 92,
          borderRadius: "50%",
          background: p.grey,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Envelope color={p.ink} size={56} />
      </div>
      {/* unread dot */}
      <div style={{ position: "absolute", left: 112, top: 38, width: 26, height: 26, borderRadius: 13, background: p.blue, border: `4px solid ${p.card}` }} />
      <div style={{ position: "absolute", left: 156, top: 34, right: 40, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: p.ink }}>{sender}</span>
        <span style={{ fontSize: 30, color: p.greyText, paddingTop: 8 }}>{age}</span>
      </div>
      <div style={{ position: "absolute", left: 156, top: 86, fontSize: 36, fontWeight: 600, color: p.ink }}>{subject}</div>
      <div
        style={{
          position: "absolute",
          left: 156,
          top: 136,
          right: forward ? 270 : 40,
          fontSize: 28,
          color: p.greyText,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {preview}
      </div>
      {forward ? (
        <div
          style={{
            position: "absolute",
            right: 30,
            bottom: 26,
            height: 58,
            padding: "0 26px",
            borderRadius: 29,
            background: p.blue,
            color: p.white,
            fontSize: 28,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            transform: `scale(${1 - 0.08 * Math.sin(Math.PI * Math.min(1, press * 2))})`,
          }}
        >
          {forward} →
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 140,
              height: 140,
              marginLeft: -70,
              marginTop: -70,
              borderRadius: "50%",
              border: `5px solid ${p.blue}`,
              opacity: ripple ? 1 - ripple : 0,
              transform: `scale(${0.3 + ripple})`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export const MONSTER_W = 640;
export const MONSTER_H = 720;

/** The shadow the unopened mail casts: horns, claws, teeth, glowing eyes. */
export const MonsterShadow: React.FC<{
  color: string;
  teeth: string;
  eyes: number;
  eyeColor: string;
  style?: React.CSSProperties;
}> = ({ color, teeth, eyes, eyeColor, style }) => {
  const arm = "M140 420 C90 400 50 350 30 290 L10 250 L45 270 L40 225 L70 262 L85 230 L95 290 C110 330 130 360 150 380 Z";
  return (
    <svg
      width={MONSTER_W}
      height={MONSTER_H}
      viewBox={`0 0 ${MONSTER_W} ${MONSTER_H}`}
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <g fill={color}>
        <path d="M130 720 L130 400 C130 270 180 190 240 170 L200 40 L290 150 C310 146 330 146 350 150 L440 40 L400 170 C460 190 510 270 510 400 L510 720 Z" />
        <path d={arm} />
        <path d={arm} transform={`translate(${MONSTER_W} 0) scale(-1 1)`} />
      </g>
      <path
        d="M236 340 L404 340 L392 374 L376 346 L360 380 L344 346 L328 380 L312 346 L296 380 L280 346 L264 374 Z"
        fill={teeth}
      />
      {eyes > 0 ? (
        <g fill={eyeColor} style={{ filter: `drop-shadow(0 0 14px ${eyeColor})` }}>
          <ellipse cx={268} cy={268} rx={28} ry={16 * eyes} transform="rotate(12 268 268)" />
          <ellipse cx={372} cy={268} rx={28} ry={16 * eyes} transform="rotate(-12 372 268)" />
        </g>
      ) : null}
    </svg>
  );
};

export const TILE_W = 236;
export const TILE_H = 250;

/** A calendar tile: blue band with the month, big day, label chip. */
export const DateTile: React.FC<{
  day: string;
  month: string;
  label: string;
  strong?: boolean;
  style?: React.CSSProperties;
}> = ({ day, month, label, strong = false, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: TILE_W,
        height: TILE_H,
        borderRadius: 34,
        background: p.white,
        overflow: "hidden",
        boxShadow: "0 18px 40px rgba(1,59,255,0.14)",
        fontFamily: fonts.display,
        ...style,
      }}
    >
      <div
        style={{
          height: 62,
          background: strong ? p.blue : p.blueMid,
          color: p.white,
          fontSize: 32,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "0.04em",
        }}
      >
        {month}
      </div>
      <div style={{ textAlign: "center", fontSize: 96, fontWeight: 600, color: p.ink, lineHeight: 1.1, letterSpacing: "-0.04em" }}>{day}</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "6px 20px",
            borderRadius: 20,
            background: strong ? p.blue : p.grey,
            color: strong ? p.white : p.ink,
            fontFamily: fonts.ui,
            fontSize: 26,
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export const SHEET_W = 300;
export const SHEET_H = 330;

/** A ghost costume: a sheet with two eye holes and a wavy hem. */
export const GhostSheet: React.FC<{ color: string; holes: string; style?: React.CSSProperties }> = ({
  color,
  holes,
  style,
}) => (
  <svg width={SHEET_W} height={SHEET_H} viewBox="0 0 300 330" style={{ position: "absolute", overflow: "visible", ...style }}>
    <path
      d="M20 300 C 10 180 20 40 150 30 C 280 40 290 180 280 300 Q 262 330 244 300 Q 226 270 206 304 Q 186 334 166 302 Q 148 272 128 304 Q 108 334 90 302 Q 72 272 54 304 Q 36 330 20 300 Z"
      fill={color}
    />
    <ellipse cx={110} cy={140} rx={20} ry={30} fill={holes} />
    <ellipse cx={186} cy={140} rx={20} ry={30} fill={holes} />
    <path d="M60 110 Q 70 230 80 280" stroke={holes} strokeOpacity={0.08} strokeWidth={10} fill="none" />
    <path d="M230 110 Q 222 230 214 280" stroke={holes} strokeOpacity={0.08} strokeWidth={10} fill="none" />
  </svg>
);
