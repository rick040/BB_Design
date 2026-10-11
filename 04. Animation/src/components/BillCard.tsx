import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../lib/anim";
import { usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";

export const BILL_W = 860;
export const BILL_H = 330;

const Clock: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
    <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="2.8" />
    <path d="M16 9v7.5l5 3" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

/** A bill: sender, subject, big amount and a due-date chip. Optional stamp. */
export const BillCard: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  dueLabel: string;
  urgent?: boolean;
  /** Small bump on the due chip (0..1). */
  tick?: number;
  stamp?: string;
  /** 0..1, slams the stamp in. */
  stampIn?: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, dueLabel, urgent = false, tick = 0, stamp, stampIn = 0, style }) => {
  const p = usePalette();
  const chipBg = urgent ? p.red : p.grey;
  const chipFg = urgent ? "#fff" : "#6b6b78";

  return (
    <div
      style={{
        width: BILL_W,
        height: BILL_H,
        borderRadius: 48,
        background: p.white,
        boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
        padding: "36px 44px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        position: "relative",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: p.grey,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontWeight: 600,
            color: p.blueMid,
          }}
        >
          {sender[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 600, color: p.ink }}>{sender}</div>
          <div style={{ fontSize: 30, color: p.greyText, marginTop: 2 }}>{subject}</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 44,
          right: 44,
          bottom: 34,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: 70,
            padding: "0 28px 0 20px",
            borderRadius: 35,
            background: chipBg,
            color: chipFg,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 32,
            fontWeight: 500,
            transform: `scale(${1 + tick * 0.08})`,
            transformOrigin: "0% 50%",
            whiteSpace: "nowrap",
          }}
        >
          <Clock color={chipFg} size={34} />
          {dueLabel}
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 84,
            lineHeight: 1,
            letterSpacing: headlineTracking,
            color: p.ink,
          }}
        >
          {amount}
        </div>
      </div>

      {stamp && stampIn > 0 ? (
        <div
          style={{
            position: "absolute",
            right: 50,
            top: 44,
            padding: "10px 30px 14px",
            border: `7px solid ${p.blue}`,
            borderRadius: 26,
            color: p.blue,
            background: "rgba(255,255,255,0.9)",
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 62,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            opacity: interpolate(stampIn, [0, 0.3], [0, 1], clamp),
            transform: `rotate(-9deg) scale(${interpolate(stampIn, [0, 1], [2.2, 1])})`,
          }}
        >
          {stamp}
        </div>
      ) : null}
    </div>
  );
};
