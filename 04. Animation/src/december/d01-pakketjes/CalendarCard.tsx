import React from "react";
import { decFonts, decTracking } from "../theme";
import { Flag, Parcel } from "./Parcel";

// Ontwerpmaten in Stage-coördinaten (1080 × 900).
export const CAL = { x: 60, y: 120, w: 960, headerH: 112, rowH: 108, pad: 24, rows: 5 } as const;
export const CAL_H = CAL.headerH + CAL.rows * CAL.rowH + 20;

export const calCell = (day: number, startCol: number) => {
  const idx = day - 1 + startCol;
  const col = idx % 7;
  const row = Math.floor(idx / 7);
  const cw = (CAL.w - CAL.pad * 2) / 7;
  return {
    col,
    row,
    cw,
    cx: CAL.x + CAL.pad + (col + 0.5) * cw,
    cy: CAL.y + CAL.headerH + (row + 0.5) * CAL.rowH,
  };
};

export const PARCEL_COLORS = [
  { body: "#013bff", tape: "#0026a8" },
  { body: "#0026a8", tape: "#b6c7ff" },
  { body: "#111827", tape: "#99b1ff" },
  { body: "#b6c7ff", tape: "#013bff" },
  { body: "#2459fd", tape: "#e8eeff" },
];

/**
 * Decemberkalender als witte kaart. Dagen in `payDays` krijgen een pakketje
 * (schaal via `parcelOn`) en hun vlaggetjes via `flagOn` (0..1).
 */
export const CalendarCard: React.FC<{
  monthLabel: string;
  weekdays: string[];
  startCol: number;
  days: number;
  payDays: number[];
  parcelOn: (day: number) => number;
  flagOn: (day: number, kind: 7 | 2) => number;
  flag7: string;
  flag2: string;
  accent: string;
  numberColor: string;
  cellColor: string;
  style?: React.CSSProperties;
}> = ({ monthLabel, weekdays, startCol, days, payDays, parcelOn, flagOn, flag7, flag2, accent, numberColor, cellColor, style }) => {
  const cw = (CAL.w - CAL.pad * 2) / 7;
  // Vlaggen per cel: dag − 7 en dag − 2 van elk pakketje.
  const flagsFor = (day: number) => {
    const out: { kind: 7 | 2; of: number }[] = [];
    payDays.forEach((d) => {
      if (d - 7 === day) out.push({ kind: 7, of: d });
      if (d - 2 === day) out.push({ kind: 2, of: d });
    });
    return out;
  };
  return (
    <div
      style={{
        position: "absolute",
        left: CAL.x,
        top: CAL.y,
        width: CAL.w,
        height: CAL_H,
        borderRadius: 44,
        background: "#fff",
        boxShadow: "0 30px 80px rgba(1, 30, 140, 0.22)",
        overflow: "hidden",
        fontFamily: decFonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          height: 62,
          marginTop: 18,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          fontFamily: decFonts.display,
          fontWeight: 500,
          fontSize: 50,
          lineHeight: 1,
          color: accent,
          letterSpacing: decTracking,
        }}
      >
        {monthLabel}
      </div>
      <div style={{ display: "flex", padding: `0 ${CAL.pad}px`, height: 30 }}>
        {weekdays.map((w, i) => (
          <div key={i} style={{ width: cw, textAlign: "center", fontSize: 25, fontWeight: 600, color: "#9aa3b2" }}>
            {w}
          </div>
        ))}
      </div>
      {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
        const c = calCell(day, startCol);
        const isPay = payDays.includes(day);
        const on = isPay ? parcelOn(day) : 0;
        const pi = payDays.indexOf(day);
        const flags = flagsFor(day);
        return (
          <div
            key={day}
            style={{
              position: "absolute",
              left: c.cx - CAL.x - cw / 2 + 4,
              top: c.cy - CAL.y - CAL.rowH / 2 + 4,
              width: cw - 8,
              height: CAL.rowH - 8,
              borderRadius: 16,
              background: isPay && on > 0.5 ? cellColor : "transparent",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 4,
                fontSize: 25,
                fontWeight: 600,
                color: isPay && on > 0.5 ? numberColor : "#9aa3b2",
              }}
            >
              {day}
            </div>
            {isPay && on > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: (cw - 8) / 2 - 37,
                  top: 42,
                  transform: `scale(${on})`,
                  transformOrigin: "50% 100%",
                }}
              >
                <Parcel w={74} h={54} color={PARCEL_COLORS[pi % PARCEL_COLORS.length].body} tape={PARCEL_COLORS[pi % PARCEL_COLORS.length].tape} />
              </div>
            ) : null}
            {flags.map((f, k) => {
              const s = flagOn(f.of, f.kind);
              if (s <= 0) return null;
              return (
                <div
                  key={`${f.of}-${f.kind}`}
                  style={{
                    position: "absolute",
                    left: cw - 8 - 10 - 36 * (flags.length - k),
                    top: 3,
                    transform: `scale(${s}) rotate(${(1 - s) * -25}deg)`,
                    transformOrigin: "30% 100%",
                  }}
                >
                  <Flag size={38} color={f.kind === 7 ? flag7 : flag2} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
