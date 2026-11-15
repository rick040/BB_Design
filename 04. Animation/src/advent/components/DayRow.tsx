import React from "react";
import { fonts } from "../../theme";
import { Door } from "./Door";

// A week row of the agenda, drawn as advent doors (ma 14 … vr 18).
export const ROW_DW = 170;
export const ROW_DH = 210;
export const ROW_GAP = 20;
export const ROW_X = (1080 - (5 * ROW_DW + 4 * ROW_GAP)) / 2;

export const rowDoorX = (i: number) => ROW_X + i * (ROW_DW + ROW_GAP);
export const rowDoorCenter = (i: number) => rowDoorX(i) + ROW_DW / 2;

export const DayRow: React.FC<{
  top: number;
  days: { day: string; date: string }[];
  month: string;
  opens: number[];
  rings?: number[];
  front: string;
  frontText: string;
  recess: string;
  monthColor: string;
  /** Tag on the due-day door (0..1) with its amount. */
  dueIndex?: number;
  dueTag?: string;
  dueTagIn?: number;
  tagBg: string;
  tagText: string;
  inside?: (i: number) => React.ReactNode;
}> = ({
  top,
  days,
  month,
  opens,
  rings = [],
  front,
  frontText,
  recess,
  monthColor,
  dueIndex,
  dueTag,
  dueTagIn = 0,
  tagBg,
  tagText,
  inside,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        right: ROW_X,
        top: top - 64,
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: 44,
        letterSpacing: "-0.03em",
        color: monthColor,
      }}
    >
      {month}
    </div>
    {days.map((d, i) => (
      <Door
        key={i}
        w={ROW_DW}
        h={ROW_DH}
        label={d.date}
        sub={d.day}
        open={opens[i] ?? 0}
        ring={rings[i] ?? 0}
        front={front}
        frontText={frontText}
        recess={recess}
        radius={24}
        style={{ left: rowDoorX(i), top }}
      >
        {inside ? inside(i) : null}
      </Door>
    ))}
    {dueIndex !== undefined && dueTag && dueTagIn > 0 ? (
      <div
        style={{
          position: "absolute",
          left: rowDoorCenter(dueIndex) - 90,
          top: top + ROW_DH - 30,
          width: 180,
          textAlign: "center",
          background: tagBg,
          color: tagText,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 32,
          padding: "10px 0",
          borderRadius: 30,
          transform: `scale(${dueTagIn})`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        }}
      >
        {dueTag}
      </div>
    ) : null}
  </>
);
