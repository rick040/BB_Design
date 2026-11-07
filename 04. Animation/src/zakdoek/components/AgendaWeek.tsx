import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";

// One week of an agenda (Mon..Sun). The reminder day fills blue with a
// bell and a short label; the due day gets a ring and a knot on its edge.
export const AGENDA_W = 960;
export const AGENDA_H = 420;
const HEAD = 96;
const PAD = 18;
export const CELL_W = (AGENDA_W - PAD * 2) / 7;
const CELL_H = AGENDA_H - HEAD - PAD;
const DAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];

/** Agenda-local centre x of column i, and the bottom y of the cells. */
export const cellCenterX = (i: number) => PAD + CELL_W * i + CELL_W / 2;
export const CELL_BOTTOM = HEAD + CELL_H;

const Bell: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path
      d="M16 4a8 8 0 0 0-8 8v6l-3 4h22l-3-4v-6a8 8 0 0 0-8-8zM12.5 25a3.5 3.5 0 0 0 7 0"
      fill="none"
      stroke={color}
      strokeWidth={2.8}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

export const AgendaWeek: React.FC<{
  month: string;
  firstDay: number;
  dueDay: number;
  remindDay: number;
  remindLabel: string;
  /** 0..1 reminder fill on the reminder day. */
  remind: number;
  /** 0..1 ring on the due day. */
  due: number;
  style?: React.CSSProperties;
}> = ({ month, firstDay, dueDay, remindDay, remindLabel, remind, due, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: AGENDA_W,
        height: AGENDA_H,
        borderRadius: 44,
        background: p.white,
        boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 22,
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 50,
          letterSpacing: headlineTracking,
          color: p.ink,
        }}
      >
        {month}
      </div>
      {DAYS.map((d, i) => {
        const n = firstDay + i;
        const isRemind = n === remindDay;
        const isDue = n === dueDay;
        const fill = isRemind ? remind : 0;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: PAD + CELL_W * i + 5,
              top: HEAD,
              width: CELL_W - 10,
              height: CELL_H,
              borderRadius: 26,
              background: fill > 0 ? `rgba(1,59,255,${fill})` : p.light,
              border: isDue && due > 0 ? `${5 * due}px solid ${p.blue}` : `2px solid ${p.grey}`,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 18,
              color: fill > 0.5 ? p.white : p.ink,
              transform: isRemind ? `scale(${1 + Math.sin(Math.PI * fill) * 0.08})` : undefined,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 500, opacity: 0.6 }}>{d}</div>
            <div style={{ fontFamily: fonts.display, fontSize: 60, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              {n}
            </div>
            {isRemind ? (
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  opacity: interpolate(remind, [0.4, 1], [0, 1], clamp),
                  textAlign: "center",
                  fontSize: 28,
                  fontWeight: 600,
                  lineHeight: 1.1,
                  padding: "0 6px",
                }}
              >
                <Bell color={p.white} size={44} />
                {remindLabel}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
