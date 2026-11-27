import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CalendarGrid, calendarCells, cellRect, type GridGeom } from "../../components/CalendarGrid";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { SENDER_H, SENDER_W, SenderCard } from "../components/SenderCard";
import type { EigenHuisProps } from "../schema";

// Timeline (frames, scene-local).
export const GATHER_T = {
  first: 10, // first card hops from the pile to Buddy
  every: 12, // …then one card every 12 frames
  hopLen: 6, // pile → Buddy
  flyLen: 10, // Buddy → its date in the calendar
  subline: 40, // "Buddy onthoudt de datums."
};

const GEOM: GridGeom = { x: 60, y: 330, cellW: 130, cellH: 96, gap: 8, headerH: 40 };
const BUDDY = 140;
const FEET = 292;
const PILE = { x: 740, y: 40, scale: 0.55 };

export const GatherScene: React.FC<{ props: EigenHuisProps["gather"]; bills: EigenHuisProps["bills"] }> = ({
  props,
  bills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const cells = calendarCells(props.startDate, props.weeks);
  const byIso = Object.fromEntries(cells.map((c) => [c.iso, c]));
  const focusMonth = Number(props.startDate.slice(5, 7)) + (Number(props.startDate.slice(8, 10)) > 7 ? 1 : 0);

  const launch = (i: number) => GATHER_T.first + i * GATHER_T.every;
  const catchAt = (i: number) => launch(i) + GATHER_T.hopLen;
  const landAt = (i: number) => catchAt(i) + GATHER_T.flyLen;

  // Buddy squashes each time he catches a card.
  let squash = 1;
  bills.forEach((_, i) => {
    const c = catchAt(i);
    if (frame >= c - 2 && frame <= c + 8) {
      squash = interpolate(frame, [c - 2, c + 1, c + 5, c + 8], [1, 0.82, 1.06, 1], clamp);
    }
  });
  const buddyTop = FEET - BUDDY * BUDDY_RATIO;
  const head = { x: 540, y: buddyTop + 20 };
  const lastLand = landAt(bills.length - 1);
  const look = frame < lastLand ? { x: 0.6, y: frame % 24 < 12 ? -0.3 : 0.6 } : { x: 0, y: 0.8 };

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: GEOM.x + 4,
            top: GEOM.y - 50,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 34,
            color: p.blueSoft,
          }}
        >
          {props.monthLabel}
        </div>
        <CalendarGrid geom={GEOM} cells={cells} weekdays={props.weekdays} focusMonth={focusMonth} dark />

        {/* Tiles that have landed */}
        {bills.map((b, i) => {
          const c = byIso[b.date];
          if (!c || frame < landAt(i)) return null;
          const r = cellRect(GEOM, c.row, c.col);
          const t = pop(frame, fps, landAt(i), springs.bouncy);
          return (
            <div
              key={`tile-${i}`}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                borderRadius: 22,
                background: p.white,
                fontFamily: fonts.ui,
                transform: `scale(${0.6 + 0.4 * t})`,
                boxShadow: "0 8px 20px rgba(0, 20, 120, 0.3)",
              }}
            >
              <div style={{ position: "absolute", left: 14, top: 8, fontSize: 32, fontWeight: 600, color: p.blue }}>
                {c.day}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 10,
                  right: 6,
                  bottom: 10,
                  fontSize: 21,
                  fontWeight: 600,
                  color: p.ink,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {b.short}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 10,
                  top: 12,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: p.red,
                }}
              />
            </div>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [lastLand + 6])}
          look={look}
          squash={squash}
          style={{ position: "absolute", left: 540 - BUDDY / 2, top: buddyTop }}
        />

        {/* Pile of cards on the right, then each card's flight */}
        {bills
          .map((b, i) => {
            const L = launch(i);
            if (frame >= landAt(i)) return null;
            // How far the pile has moved up (cards before i have left).
            let gone = 0;
            for (let j = 0; j < i; j++) gone += interpolate(frame, [launch(j), launch(j) + 6], [0, 1], clamp);
            const k = i - gone;
            const pileX = PILE.x + k * 8;
            const pileY = PILE.y + k * 16;
            let x = pileX + (SENDER_W * PILE.scale) / 2;
            let y = pileY + (SENDER_H * PILE.scale) / 2;
            let sc = PILE.scale;
            let rot = 0;
            if (frame >= L) {
              const u1 = interpolate(frame, [L, catchAt(i)], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
              x = x + (head.x - x) * u1;
              y = y + (head.y - y) * u1 - Math.sin(Math.PI * u1) * 60;
              sc = PILE.scale * (1 - 0.4 * u1);
              rot = -20 * u1;
            }
            if (frame >= catchAt(i)) {
              const c = byIso[b.date];
              const r = c ? cellRect(GEOM, c.row, c.col) : { x: 540, y: 600, w: 0, h: 0 };
              const u2 = interpolate(frame, [catchAt(i), landAt(i)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
              x = head.x + (r.x + r.w / 2 - head.x) * u2;
              y = head.y + (r.y + r.h / 2 - head.y) * u2 - Math.sin(Math.PI * u2) * 90;
              sc = PILE.scale * 0.6 * (1 - 0.5 * u2);
              rot = -20 + 380 * u2;
            }
            return (
              <SenderCard
                key={`card-${i}`}
                sender={b.sender}
                dateLabel={b.dateLabel}
                style={{
                  position: "absolute",
                  left: x - SENDER_W / 2,
                  top: y - SENDER_H / 2,
                  zIndex: frame >= L ? 50 : bills.length - i,
                  transform: `scale(${sc}) rotate(${rot}deg)`,
                }}
              />
            );
          })}
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={GATHER_T.subline} />
    </SceneBg>
  );
};
