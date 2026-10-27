import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { MuseumFrame, Plaque } from "../components/Museum";
import type { MuseumProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  drop: 12, // the bill drops into the calendar
  land: 26, // lands on the due day
  mail7: 38, // reminder mail 7 days before
  mail2: 50, // reminder mail 2 days before
  buddy: 30, // Buddy (guide) pops up next to the plaque
  subline: 62,
};

const FRAME = { x: 140, y: -20, w: 800, h: 700, border: 16, mat: 24 };
const INNER_W = FRAME.w - 2 * (FRAME.border + FRAME.mat);
const CELL_W = INNER_W / 7;
const CELL_H = 84;
const GRID_TOP = 116;
const WEEKDAYS = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const BUDDY = 140;

const Envelope: React.FC<{ size: number; color: string; bg: string }> = ({ size, color, bg }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke={color} strokeWidth="2.2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  </div>
);

export const AgendaScene: React.FC<{
  props: MuseumProps["agenda"];
  bill: MuseumProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const offset = props.firstWeekday - 1;
  const cellPos = (d: number) => {
    const i = d - 1 + offset;
    return { x: (i % 7) * CELL_W, y: GRID_TOP + Math.floor(i / 7) * CELL_H };
  };
  const due = cellPos(props.dueDay);
  const reminders = props.reminderDays.map((n, i) => ({
    day: props.dueDay - n,
    n,
    at: i === 0 ? AGENDA_T.mail7 : AGENDA_T.mail2,
  }));

  const drop = interpolate(frame, [AGENDA_T.drop, AGENDA_T.land], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const landed = frame >= AGENDA_T.land;
  const thump = interpolate(frame, [AGENDA_T.land, AGENDA_T.land + 4, AGENDA_T.land + 10], [1, 1.14, 1], clamp);

  const buddyIn = pop(frame, fps, AGENDA_T.buddy, springs.bouncy);
  const blink = blinkScale(frame, [AGENDA_T.buddy + 30, AGENDA_T.buddy + 70]);
  const lookX = frame < AGENDA_T.mail2 + 10 ? 0.9 : 0.1;

  return (
    <SceneBg color={p.light}>
      <Stage offsetY={20}>
        <div style={{ position: "absolute", left: -400, right: -400, top: 760, height: 1400, background: "#eceff7" }} />

        <MuseumFrame w={FRAME.w} h={FRAME.h} border={FRAME.border} mat={FRAME.mat} style={{ left: FRAME.x, top: FRAME.y }}>
          <div style={{ position: "absolute", inset: 0, background: p.white, fontFamily: fonts.ui }}>
            <div
              style={{
                position: "absolute",
                left: 28,
                top: 22,
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: 46,
                letterSpacing: "-0.04em",
                color: p.ink,
              }}
            >
              {props.month}
            </div>
            {WEEKDAYS.map((w, i) => (
              <div
                key={w}
                style={{
                  position: "absolute",
                  left: i * CELL_W,
                  width: CELL_W,
                  top: GRID_TOP - 38,
                  textAlign: "center",
                  fontSize: 22,
                  color: p.greyText,
                  fontWeight: 500,
                }}
              >
                {w}
              </div>
            ))}
            {Array.from({ length: props.daysInMonth }, (_, k) => k + 1).map((d) => {
              const c = cellPos(d);
              const isDue = d === props.dueDay && landed;
              const rem = reminders.find((r) => r.day === d);
              const remIn = rem ? pop(frame, fps, rem.at, springs.bouncy) : 0;
              const showRem = rem && frame >= rem.at;
              return (
                <div
                  key={d}
                  style={{
                    position: "absolute",
                    left: c.x + 6,
                    top: c.y + 4,
                    width: CELL_W - 12,
                    height: CELL_H - 8,
                    zIndex: isDue ? 2 : 1,
                    borderRadius: 14,
                    background: isDue ? p.blue : showRem ? "#fff4cc" : "transparent",
                    transform: isDue ? `scale(${thump})` : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: isDue ? 700 : 500,
                    color: isDue ? p.white : p.ink,
                  }}
                >
                  {showRem && rem ? (
                    <div style={{ transform: `scale(${remIn})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <Envelope size={44} color={p.ink} bg={p.yellow} />
                      <div style={{ fontSize: 17, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>
                        {`${rem.n} ${props.reminderLabel}`}
                      </div>
                    </div>
                  ) : isDue ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
                      <div>{d}</div>
                      <div style={{ fontSize: 17, fontWeight: 600, marginTop: 6, whiteSpace: "nowrap" }}>{bill.amount}</div>
                    </div>
                  ) : (
                    d
                  )}
                </div>
              );
            })}
          </div>
        </MuseumFrame>

        {/* the bill tile dropping onto the due day, with its amount under it */}
        {(() => {
          const inner = FRAME.border + FRAME.mat;
          const tx = FRAME.x + inner + due.x + CELL_W / 2;
          const ty = FRAME.y + inner + due.y + CELL_H / 2;
          if (!landed) {
            const y = interpolate(drop, [0, 1], [-60, ty]);
            return (
              <div
                style={{
                  position: "absolute",
                  left: tx - 110,
                  top: y - 40,
                  width: 220,
                  padding: "14px 0",
                  borderRadius: 16,
                  background: p.blue,
                  color: p.white,
                  textAlign: "center",
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 32,
                  opacity: interpolate(frame, [AGENDA_T.drop, AGENDA_T.drop + 4], [0, 1], clamp),
                  transform: `scale(${interpolate(drop, [0, 1], [1.2, 0.5])}) rotate(${(1 - drop) * -8}deg)`,
                  boxShadow: "0 16px 28px rgba(1,59,255,0.35)",
                }}
              >
                {bill.amount}
              </div>
            );
          }
          return null;
        })()}

        <Plaque
          text={props.plaque}
          width={420}
          size={26}
          style={{ left: 540 - 210 + 60, top: FRAME.y + FRAME.h + 30 }}
        />

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          look={{ x: lookX, y: -0.5 }}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1])}
          style={{
            position: "absolute",
            left: 150,
            top: 830 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>

      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />
      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
