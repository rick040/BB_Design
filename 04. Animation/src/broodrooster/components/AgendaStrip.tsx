import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const TILE = { left: 72, top: 0, w: 176, h: 210, gap: 14 };
export const tileCenter = (i: number) => ({
  x: TILE.left + i * (TILE.w + TILE.gap) + TILE.w / 2,
  y: TILE.top + TILE.h / 2,
});

/** A week of agenda tiles; one carries the reminder, one the due bill. */
export const AgendaStrip: React.FC<{
  days: { day: string; date: string }[];
  dueIndex: number;
  reminderIndex: number;
  /** 0..1 the due tile gets the bill amount. */
  dueIn: number;
  /** 0..1 the reminder tile lights up. */
  reminderIn: number;
  amount: string;
  reminderLabel: string;
  dueLabel: string;
  style?: React.CSSProperties;
}> = ({ days, dueIndex, reminderIndex, dueIn, reminderIn, amount, reminderLabel, dueLabel, style }) => {
  const p = usePalette();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 300, ...style }}>
      {days.map((d, i) => {
        const isDue = i === dueIndex;
        const isRem = i === reminderIndex;
        const bg = isRem && reminderIn > 0 ? p.yellow : p.white;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: TILE.left + i * (TILE.w + TILE.gap),
              top: TILE.top,
              width: TILE.w,
              height: TILE.h,
              borderRadius: 34,
              background: bg,
              border: `5px solid ${isDue && dueIn > 0 ? p.blue : p.grey}`,
              boxSizing: "border-box",
              boxShadow: "0 18px 40px rgba(1, 30, 140, 0.12)",
              fontFamily: fonts.ui,
              textAlign: "center",
              paddingTop: 18,
              transform: `scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, isRem ? reminderIn : isDue ? dueIn : 0))})`,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 500, color: "#6b6b78" }}>{d.day}</div>
            <div style={{ fontSize: 64, fontWeight: 600, color: p.ink, lineHeight: 1.05 }}>{d.date}</div>
            {isRem && reminderIn > 0 ? (
              <div style={{ fontSize: 23, fontWeight: 600, color: p.ink, marginTop: 8, opacity: reminderIn }}>
                <Bell size={30} color={p.ink} />
                <div>{reminderLabel}</div>
              </div>
            ) : null}
            {isDue && dueIn > 0 ? (
              <div style={{ marginTop: 8, opacity: dueIn }}>
                <div style={{ fontSize: 23, fontWeight: 600, color: p.red }}>{dueLabel}</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: p.blue }}>{amount}</div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block", margin: "0 auto" }}>
    <path
      d="M16 4c-5 0-8 3.6-8 8.5v5.5l-2.5 4h21L24 18v-5.5C24 7.6 21 4 16 4Z"
      fill="none"
      stroke={color}
      strokeWidth="2.8"
      strokeLinejoin="round"
    />
    <path d="M12.5 25.5a3.5 3.5 0 0 0 7 0" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);
