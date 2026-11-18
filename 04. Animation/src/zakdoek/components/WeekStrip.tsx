import React from "react";
import { fonts } from "../../theme";

export const stripLayout = (tileW: number, gap: number, y: number) => {
  const x0 = (1080 - (5 * tileW + 4 * gap)) / 2;
  return { x0, y, center: (i: number) => x0 + i * (tileW + gap) + tileW / 2 };
};

/** Five day tiles. `highlight` fills one tile; `extra` renders inside a tile. */
export const WeekStrip: React.FC<{
  days: { day: string; date: string }[];
  tileW: number;
  tileH: number;
  gap: number;
  y: number;
  bg: string;
  fg: string;
  dayFg: string;
  highlight?: { index: number; bg: string; fg: string; amount: number } | null;
  extra?: (i: number) => React.ReactNode;
  opacity?: number;
}> = ({ days, tileW, tileH, gap, y, bg, fg, dayFg, highlight, extra, opacity = 1 }) => {
  const L = stripLayout(tileW, gap, y);
  return (
    <>
      {days.map((d, i) => {
        const hi = highlight && highlight.index === i ? highlight.amount : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: L.x0 + i * (tileW + gap),
              top: y,
              width: tileW,
              height: tileH,
              borderRadius: tileW * 0.18,
              background: hi > 0.5 && highlight ? highlight.bg : bg,
              color: hi > 0.5 && highlight ? highlight.fg : fg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              opacity,
              transform: `scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, hi))})`,
            }}
          >
            <div style={{ fontSize: tileW * 0.24, color: hi > 0.5 && highlight ? highlight.fg : dayFg }}>{d.day}</div>
            <div style={{ fontSize: tileW * 0.42, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.04em" }}>{d.date}</div>
            {extra ? extra(i) : null}
          </div>
        );
      })}
    </>
  );
};
