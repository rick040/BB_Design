import React from "react";
import { usePalette } from "../lib/palette";
import { fonts } from "../theme";

// A month-style grid (ma..zo) that can span two months. Scenes draw their
// own things on top using cellRect(), so the grid itself stays simple.

export type CalCell = {
  iso: string; // "2026-12-03"
  day: number;
  month: number; // 1..12
  row: number;
  col: number;
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** `weeks` rows of 7 days, starting at `startIso` (should be a Monday). */
export const calendarCells = (startIso: string, weeks: number): CalCell[] => {
  const start = new Date(`${startIso}T12:00:00Z`);
  const out: CalCell[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    out.push({ iso: iso(d), day: d.getUTCDate(), month: d.getUTCMonth() + 1, row: Math.floor(i / 7), col: i % 7 });
  }
  return out;
};

export type GridGeom = { x: number; y: number; cellW: number; cellH: number; gap: number; headerH: number };

export const gridSize = (g: GridGeom, weeks: number) => ({
  w: 7 * g.cellW + 6 * g.gap,
  h: g.headerH + weeks * g.cellH + (weeks - 1) * g.gap,
});

/** Top-left + size of a cell, in the same coordinates as the grid's x/y. */
export const cellRect = (g: GridGeom, row: number, col: number) => ({
  x: g.x + col * (g.cellW + g.gap),
  y: g.y + g.headerH + row * (g.cellH + g.gap),
  w: g.cellW,
  h: g.cellH,
});

export const CalendarGrid: React.FC<{
  geom: GridGeom;
  cells: CalCell[];
  weekdays: string[];
  /** Month (1..12) that is "current"; other days are dimmed. */
  focusMonth: number;
  /** On blue (dark) or on light. */
  dark?: boolean;
  /** 0..1 per iso date: fills the cell (blue on light, white on blue). */
  fill?: Record<string, number>;
  /** 0..1 per iso date: fades a cell in (default 1). */
  appear?: (cell: CalCell) => number;
  numberSize?: number;
}> = ({ geom, cells, weekdays, focusMonth, dark = false, fill = {}, appear, numberSize }) => {
  const p = usePalette();
  const nSize = numberSize ?? Math.round(geom.cellH * 0.34);
  return (
    <>
      {weekdays.map((w, i) => (
        <div
          key={`wd-${i}`}
          style={{
            position: "absolute",
            left: geom.x + i * (geom.cellW + geom.gap),
            top: geom.y,
            width: geom.cellW,
            height: geom.headerH,
            textAlign: "center",
            fontFamily: fonts.ui,
            fontWeight: 500,
            fontSize: Math.round(geom.headerH * 0.52),
            color: dark ? p.blueText : p.greyText,
            lineHeight: `${geom.headerH * 0.8}px`,
          }}
        >
          {w}
        </div>
      ))}
      {cells.map((c) => {
        const r = cellRect(geom, c.row, c.col);
        const f = Math.min(1, Math.max(0, fill[c.iso] ?? 0));
        const a = appear ? appear(c) : 1;
        const inMonth = c.month === focusMonth;
        const baseBg = dark ? "rgba(255,255,255,0.10)" : p.white;
        const fillBg = dark ? p.white : p.blue;
        const numColor = f > 0.5 ? (dark ? p.blue : p.white) : dark ? (inMonth ? p.white : p.blueText) : inMonth ? p.ink : p.greyText;
        return (
          <div
            key={c.iso}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: r.w,
              height: r.h,
              borderRadius: Math.min(26, geom.cellH * 0.24),
              background: baseBg,
              boxShadow: dark ? "none" : "0 8px 22px rgba(1, 40, 160, 0.07)",
              opacity: (inMonth ? 1 : 0.55) * a,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: fillBg,
                opacity: f,
                transform: `scale(${0.6 + 0.4 * f})`,
                borderRadius: "inherit",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: geom.cellW * 0.12,
                top: geom.cellH * 0.1,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: nSize,
                color: numColor,
              }}
            >
              {c.day}
            </div>
          </div>
        );
      })}
    </>
  );
};
