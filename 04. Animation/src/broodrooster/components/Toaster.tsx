import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Toaster geometry in Stage coordinates (1080 × 900).
export const TOASTER = { x: 190, y: 430, w: 700, h: 380 };
export const SLOT = { x: 270, w: 420, cx: 480 };
export const LEVER = { x: 262, top: 520, bottom: 750 };
export const DIAL = { cx: 700, cy: 690, r: 70, labelR: 122 };

/** Angle (deg, 0 = right, negative = up) of the n-th of five dial labels. */
export const dialAngle = (i: number) => -170 + i * 40;

/** The toaster body, slot, lever track and dial. The bill is drawn behind it. */
export const ToasterBody: React.FC<{
  /** Lever knob y (LEVER.top = up, LEVER.bottom = down). */
  leverY: number;
  /** Pointer angle in degrees. */
  pointer: number;
  labels: string[];
  dueIndex: number;
  /** Index that is highlighted as chosen, with 0..1 strength. */
  chosen: number;
  chosenIn: number;
  /** 0..1 glow around the dial (tap feedback). */
  ripple: number;
  /** 0..1 orange glow inside the slot (toasting). */
  heat: number;
}> = ({ leverY, pointer, labels, dueIndex, chosen, chosenIn, ripple, heat }) => {
  const p = usePalette();
  const T = TOASTER;
  return (
    <>
      {/* body */}
      <div
        style={{
          position: "absolute",
          left: T.x,
          top: T.y,
          width: T.w,
          height: T.h,
          borderRadius: "120px 120px 70px 70px",
          background: p.white,
          border: `7px solid ${p.blueSoft}`,
          boxSizing: "border-box",
          boxShadow: "0 40px 80px rgba(1, 30, 140, 0.18)",
        }}
      />
      {/* feet */}
      {[T.x + 90, T.x + T.w - 170].map((x) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: x,
            top: T.y + T.h - 6,
            width: 80,
            height: 26,
            borderRadius: "0 0 16px 16px",
            background: p.blueSoft,
          }}
        />
      ))}
      {/* slot */}
      <div
        style={{
          position: "absolute",
          left: SLOT.x,
          top: T.y + 6,
          width: SLOT.w,
          height: 26,
          borderRadius: 13,
          background: "#1b2350",
          boxShadow: heat > 0 ? `0 0 ${30 * heat}px ${10 * heat}px rgba(255, 140, 40, ${0.7 * heat})` : "none",
        }}
      />
      {/* lever track + knob */}
      <div
        style={{
          position: "absolute",
          left: LEVER.x - 12,
          top: LEVER.top - 10,
          width: 24,
          height: LEVER.bottom - LEVER.top + 20,
          borderRadius: 12,
          background: p.grey,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LEVER.x - 55,
          top: leverY - 22,
          width: 110,
          height: 44,
          borderRadius: 22,
          background: p.blueMid,
          boxShadow: "0 8px 18px rgba(1, 30, 140, 0.25)",
        }}
      />
      {/* dial labels */}
      {labels.map((l, i) => {
        const a = (dialAngle(i) * Math.PI) / 180;
        const x = DIAL.cx + DIAL.labelR * Math.cos(a);
        const y = DIAL.cy + DIAL.labelR * Math.sin(a);
        const isDue = i === dueIndex;
        const isChosen = i === chosen;
        const k = isChosen ? chosenIn : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 32,
              top: y - 32,
              width: 64,
              height: 64,
              borderRadius: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 32,
              color: isDue ? p.red : k > 0.5 ? p.ink : "#6b6b78",
              background: k > 0 ? `rgba(255, 206, 49, ${k})` : "transparent",
              transform: `scale(${1 + 0.25 * k})`,
            }}
          >
            {l}
          </div>
        );
      })}
      {/* dial */}
      <div
        style={{
          position: "absolute",
          left: DIAL.cx - DIAL.r - 30,
          top: DIAL.cy - DIAL.r - 30,
          width: (DIAL.r + 30) * 2,
          height: (DIAL.r + 30) * 2,
          borderRadius: "50%",
          border: `6px solid ${p.yellow}`,
          boxSizing: "border-box",
          opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
          transform: `scale(${0.7 + ripple * 0.6})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: DIAL.cx - DIAL.r,
          top: DIAL.cy - DIAL.r,
          width: DIAL.r * 2,
          height: DIAL.r * 2,
          borderRadius: "50%",
          background: p.blue,
          boxShadow: "0 10px 24px rgba(1, 30, 140, 0.3)",
          transform: `rotate(${pointer}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: DIAL.r + 8,
            top: DIAL.r - 7,
            width: DIAL.r - 20,
            height: 14,
            borderRadius: 7,
            background: p.white,
          }}
        />
      </div>
    </>
  );
};

/** Grey smoke puffs rising from the slot. */
export const Smoke: React.FC<{ frame: number; start: number; end: number; color: string }> = ({
  frame,
  start,
  end,
  color,
}) => {
  if (frame < start || frame > end + 40) return null;
  const puffs = [0, 9, 18, 27, 36, 45];
  return (
    <>
      {puffs.map((d, i) => {
        const t = (frame - start - d) / 36;
        if (t < 0 || t > 1 || start + d > end) return null;
        const x = SLOT.x + 60 + ((i * 137) % 300) + Math.sin(t * 6 + i) * 20;
        const y = TOASTER.y - 30 - t * 260;
        const s = 40 + t * 70;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - s / 2,
              top: y - s / 2,
              width: s,
              height: s,
              borderRadius: "50%",
              background: color,
              opacity: 0.55 * Math.sin(Math.PI * t),
              filter: "blur(4px)",
            }}
          />
        );
      })}
    </>
  );
};
