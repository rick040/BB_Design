import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CalendarGrid, calendarCells, cellRect, type GridGeom } from "../../components/CalendarGrid";
import { Parcel, PARCEL_RATIO } from "../../components/Parcel";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { AchterafProps } from "../schema";

// Timeline (frames, scene-local). `spread` is the default of timing.spreadAt
// (2,5 s); the scene reads the real value from the props.
export const CAL_T = {
  drop: -36, // parcels drop onto the buy date (most already landed on frame 0)
  dropStagger: 3,
  spread: 75, // pile wobbles, then topples: each parcel flies to its own date
  wobbleLen: 10,
  flyStagger: 4,
  flyLen: 18,
  headline2: 80, // "Betalen op negen dagen." (spread + 5)
};

export const GEOM: GridGeom = { x: 48, y: 160, cellW: 132, cellH: 100, gap: 10, headerH: 50 };
const BOX_W = 84;
const BOX_H = BOX_W * PARCEL_RATIO;

/** Pyramid rows from the bottom: 4, 3, 2, 1, 1… */
export const pileSlots = (n: number, base: { x: number; y: number }) => {
  const out: { x: number; y: number }[] = [];
  let remaining = n;
  let width = 4;
  let row = 0;
  while (remaining > 0) {
    const take = Math.min(width, remaining);
    for (let k = 0; k < take; k++) {
      out.push({
        x: base.x + (k - (take - 1) / 2) * (BOX_W + 4),
        y: base.y - (row + 1) * (BOX_H + 2),
      });
    }
    remaining -= take;
    width = Math.max(1, width - 1);
    row++;
  }
  return out;
};

export const CalendarScene: React.FC<{ props: AchterafProps["calendar"]; spreadAt: number }> = ({
  props,
  spreadAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const S = spreadAt;

  const cells = calendarCells(props.startDate, props.weeks);
  const byIso = Object.fromEntries(cells.map((c) => [c.iso, c]));
  const buy = byIso[props.buyDate] ?? cells[4];
  const buyR = cellRect(GEOM, buy.row, buy.col);
  const base = { x: buyR.x + buyR.w / 2, y: buyR.y + buyR.h - 6 };
  const slots = pileSlots(props.payDates.length, base);
  const n = slots.length;
  const focusMonth = Number(props.payDates[0]?.slice(5, 7) ?? 12);

  // Anticipation: the pile wobbles before it falls over.
  const wob = frame > S - CAL_T.wobbleLen && frame < S + 6 ? Math.sin((frame - S) * 1.3) * 4 : 0;

  const h1Out = interpolate(frame, [S, S + 5], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const chipIn = pop(frame, fps, -12, springs.pop);
  const chipOut = interpolate(frame, [S, S + 8], [1, 0], clamp);

  return (
    <SceneBg color={p.light}>
      <div style={{ opacity: 1 - h1Out, transform: `translateY(${-30 * h1Out}px)` }}>
        <Headline text={props.headline} color={p.blue} delay={-12} stagger={2} />
      </div>
      {frame >= S + 4 ? <Headline text={props.spreadHeadline} color={p.blue} delay={S + 5} stagger={3} /> : null}

      <Stage>
        <div
          style={{
            position: "absolute",
            left: GEOM.x + 4,
            top: GEOM.y - 62,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 36,
            color: p.blue,
          }}
        >
          {props.monthLabel}
        </div>

        <CalendarGrid
          geom={GEOM}
          cells={cells}
          weekdays={props.weekdays}
          focusMonth={focusMonth}
          fill={{ [buy.iso]: 1 }}
        />

        {/* Yellow dots: one per payment date, they appear where a parcel lands */}
        {props.payDates.map((d, i) => {
          const c = byIso[d];
          if (!c) return null;
          const launch = S + (n - 1 - i) * CAL_T.flyStagger;
          const land = launch + CAL_T.flyLen;
          const dot = pop(frame, fps, land - 2, springs.bouncy);
          if (frame < land - 2) return null;
          const r = cellRect(GEOM, c.row, c.col);
          return (
            <div
              key={`dot-${i}`}
              style={{
                position: "absolute",
                left: r.x + r.w - 50,
                top: r.y + r.h - 50,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: p.red,
                boxShadow: "0 4px 10px rgba(120, 90, 0, 0.25)",
                transform: `scale(${dot})`,
              }}
            />
          );
        })}

        {/* The pile of parcels */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 900,
            transformOrigin: `${base.x}px ${base.y}px`,
            transform: `rotate(${wob}deg)`,
          }}
        >
          {slots.map((slot, i) => {
            const dropAt = CAL_T.drop + i * CAL_T.dropStagger;
            const fall = interpolate(frame, [dropAt, dropAt + 9], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
            const bounce = interpolate(frame, [dropAt + 9, dropAt + 12, dropAt + 16], [1, 0.86, 1], clamp);
            let x = slot.x;
            let y = slot.y - (1 - fall) * 360;
            let rot = (1 - fall) * (i % 2 ? 14 : -10);
            let scale = 1;
            let sq = bounce;

            const launch = S + (n - 1 - i) * CAL_T.flyStagger;
            const u = interpolate(frame, [launch, launch + CAL_T.flyLen], [0, 1], {
              ...clamp,
              easing: Easing.inOut(Easing.quad),
            });
            if (frame >= launch) {
              const c = byIso[props.payDates[i]];
              const r = c ? cellRect(GEOM, c.row, c.col) : { x: slot.x, y: slot.y, w: 0, h: 0 };
              const tx = r.x + r.w - 33;
              const ty = r.y + r.h - 33 - BOX_H / 2;
              x = slot.x + (tx - slot.x) * u;
              y = slot.y + (ty - slot.y) * u - Math.sin(Math.PI * u) * 150;
              rot = (i % 2 ? 1 : -1) * 300 * u;
              scale = interpolate(u, [0, 0.75, 1], [1, 0.8, 0.1], clamp);
              sq = 1;
              if (u >= 1) return null;
            }
            if (frame < dropAt - 1) return null;
            return (
              <div
                key={`box-${i}`}
                style={{
                  position: "absolute",
                  left: x - BOX_W / 2,
                  top: y,
                  zIndex: 10 + i,
                  transformOrigin: "50% 100%",
                  transform: `rotate(${rot}deg) scale(${scale / Math.sqrt(sq)}, ${scale * sq})`,
                }}
              >
                <Parcel width={BOX_W} body={p.blueSoft} tape={p.white} edge="rgba(1, 59, 255, 0.35)" />
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: base.x - 150,
            width: 300,
            top: slots[slots.length - 1].y - 78,
            display: "flex",
            justifyContent: "center",
            opacity: chipOut,
            transform: `scale(${chipIn})`,
            zIndex: 30,
          }}
        >
          <div
            style={{
              background: p.blue,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 32,
              padding: "10px 26px",
              borderRadius: 30,
              whiteSpace: "nowrap",
            }}
          >
            {props.buyLabel}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
