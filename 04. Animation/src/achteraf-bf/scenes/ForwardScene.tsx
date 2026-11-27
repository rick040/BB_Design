import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BellBadge } from "../../components/Bell";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CalendarGrid, calendarCells, cellRect, type GridGeom } from "../../components/CalendarGrid";
import { Arrow } from "../../components/CtaPill";
import { MailRow } from "../../components/MailRow";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { AchterafProps } from "../schema";

// Timeline (frames, scene-local).
export const FWD_T = {
  row: 6, // "Betaalverzoek · Webshop" slides in
  press: 22, // "Doorsturen" is tapped
  fly: 26, // the mail flies down to Buddy
  catch: 40, // Buddy catches it (squash)
  light: 46, // payment dates light up in the agenda, one by one
  lightStagger: 3,
  bell: 51, // a bell (seintje) pops on each date
  subline: 50,
};

const ROW = { x: 110, y: 30, w: 860 };
const ROW_H = 143;
const BUDDY = 140;
const FEET = 340;
const GEOM: GridGeom = { x: 60, y: 352, cellW: 130, cellH: 62, gap: 8, headerH: 34 };

export const ForwardScene: React.FC<{
  props: AchterafProps["forward"];
  calendar: AchterafProps["calendar"];
}> = ({ props, calendar }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const rowIn = pop(frame, fps, FWD_T.row, springs.smooth);
  const btnIn = pop(frame, fps, FWD_T.row + 6, springs.pop);
  const press = interpolate(frame, [FWD_T.press, FWD_T.press + 3, FWD_T.press + 8], [1, 0.88, 1], clamp);
  const ripple = interpolate(frame, [FWD_T.press + 1, FWD_T.press + 14], [0, 1], clamp);

  const buddyTop = FEET - BUDDY * BUDDY_RATIO;
  const target = { x: 540, y: buddyTop + 50 };
  const u = interpolate(frame, [FWD_T.fly, FWD_T.catch], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const from = { x: ROW.x + ROW.w / 2, y: ROW.y + ROW_H / 2 };
  const mx = from.x + (target.x - from.x) * u + Math.sin(Math.PI * u) * 120;
  const my = from.y + (target.y - from.y) * u;

  const buddyIn = pop(frame, fps, 4, springs.bouncy);
  const squash = interpolate(
    frame,
    [FWD_T.catch - 2, FWD_T.catch + 2, FWD_T.catch + 7, FWD_T.catch + 12],
    [1, 0.74, 1.1, 1],
    clamp,
  );
  const look = frame < FWD_T.catch ? { x: 0.3, y: -1 } : { x: 0, y: 0.9 };

  const cells = calendarCells(calendar.startDate, calendar.weeks);
  const byIso = Object.fromEntries(cells.map((c) => [c.iso, c]));
  const focusMonth = Number(calendar.payDates[0]?.slice(5, 7) ?? 12);
  const fill: Record<string, number> = {};
  calendar.payDates.forEach((d, i) => {
    fill[d] = pop(frame, fps, FWD_T.light + i * FWD_T.lightStagger, springs.smooth);
  });
  const calIn = pop(frame, fps, 0, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage>
        <div style={{ opacity: calIn, transform: `translateY(${(1 - calIn) * 40}px)` }}>
          <CalendarGrid geom={GEOM} cells={cells} weekdays={calendar.weekdays} focusMonth={focusMonth} dark fill={fill} />
          {calendar.payDates.map((d, i) => {
            const c = byIso[d];
            if (!c) return null;
            const r = cellRect(GEOM, c.row, c.col);
            const lit = FWD_T.light + i * FWD_T.lightStagger;
            const dotOut = interpolate(frame, [lit, lit + 6], [1, 0], clamp);
            const b = pop(frame, fps, FWD_T.bell + i * FWD_T.lightStagger, springs.bouncy);
            const t = frame - (FWD_T.bell + i * FWD_T.lightStagger);
            const ring = t > 0 ? Math.sin(t / 1.6) * 18 * Math.max(0, 1 - t / 22) : 0;
            return (
              <React.Fragment key={d}>
                <div
                  style={{
                    position: "absolute",
                    left: r.x + r.w - 34,
                    top: r.y + r.h - 34,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: p.red,
                    transform: `scale(${dotOut})`,
                  }}
                />
                {t >= 0 ? (
                  <BellBadge
                    size={44}
                    bg={p.red}
                    fg={p.ink}
                    ring={ring}
                    style={{
                      position: "absolute",
                      left: r.x + r.w - 30,
                      top: r.y - 14,
                      transform: `scale(${b})`,
                    }}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [FWD_T.light + 20])}
          look={look}
          squash={squash}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: buddyTop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        {frame < FWD_T.catch ? (
          <div
            style={{
              position: "absolute",
              left: mx - ROW.w / 2,
              top: my - ROW_H / 2,
              opacity: rowIn,
              transform: `translateY(${(1 - rowIn) * -60}px) scale(${1 - 0.9 * u}) rotate(${20 * u}deg)`,
            }}
          >
            <MailRow sender={props.sender} subject={props.subject} time={props.time} width={ROW.w} />
          </div>
        ) : null}

        {frame < FWD_T.fly + 2 ? (
          <div
            style={{
              position: "absolute",
              right: ROW.x,
              top: ROW.y + ROW_H + 18,
              transform: `scale(${btnIn * press})`,
              transformOrigin: "100% 0%",
            }}
          >
            <div
              style={{
                position: "relative",
                height: 70,
                padding: "0 24px 0 32px",
                borderRadius: 35,
                background: p.white,
                color: p.blue,
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: fonts.ui,
                fontSize: 32,
                fontWeight: 600,
              }}
            >
              {props.button}
              <Arrow size={32} color={p.blue} />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 240,
                  height: 240,
                  marginLeft: -120,
                  marginTop: -120,
                  borderRadius: "50%",
                  border: `6px solid ${p.white}`,
                  opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                  transform: `scale(${0.2 + ripple})`,
                }}
              />
            </div>
          </div>
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={FWD_T.subline} />
    </SceneBg>
  );
};
