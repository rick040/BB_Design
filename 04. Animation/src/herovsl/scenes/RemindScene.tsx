import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification } from "../../components/Notification";
import { SceneBg } from "../../components/Stage";
import { blinkScale, clamp, pop, pushedSlots, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { CalendarIcon, SignalArcs } from "../components/ui";
import { DetailText, VisualBox } from "../layout";
import type { HeroVslProps } from "../schema";

// Step 3 in detail: two weeks of the agenda. The due date is in it, and on
// 7 and 2 days before, Buddy sends a reminder by mail.
export const REMIND_T = {
  card: 2, // agenda is there
  event: 10, // due-date event drops in
  remind7: 22, // day -7 lights up + first reminder
  remind2: 44, // day -2 lights up + second reminder
  notifDelay: 5, // reminder lands after its day lights up
};

const CARD = { left: 90, top: 20, w: 820, h: 486 };
const COLS = 7;
const CELL_W = (CARD.w - 60) / COLS;
const ROW_H = 150;
const GRID_TOP = 150; // card-local
const NOTIF_W = 650;
const BUDDY = 150;
const BUDDY_H = BUDDY * BUDDY_RATIO;
const FEET = 846;
const BX = 838;

export const RemindScene: React.FC<{ props: HeroVslProps["remind"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, REMIND_T.card, springs.smooth);
  const eventIn = pop(frame, fps, REMIND_T.event, springs.bouncy);
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = props.firstDay + i;
    return d > props.daysInMonth ? { n: d - props.daysInMonth, other: true } : { n: d, other: false };
  });
  const idxOf = (day: number) => days.findIndex((d) => !d.other && d.n === day);
  const dueIdx = idxOf(props.dueDay);
  const r7Idx = idxOf(props.dueDay - 7);
  const r2Idx = idxOf(props.dueDay - 2);
  const lit = [
    pop(frame, fps, REMIND_T.remind7, springs.pop),
    pop(frame, fps, REMIND_T.remind2, springs.pop),
  ];

  const arrivals = [REMIND_T.remind7 + REMIND_T.notifDelay, REMIND_T.remind2 + REMIND_T.notifDelay];
  const notifs = [
    { ...props.remind7, icon: "warning" as const },
    { ...props.remind2, icon: "alert" as const },
  ];
  const pulse = (at: number) => interpolate(frame, [at - 2, at + 2, at + 8], [1, 0.88, 1], clamp);
  const enter = pop(frame, fps, 0, springs.bouncy);
  const squash = interpolate(enter, [0, 0.6, 1], [0.7, 1.08, 1]) * pulse(arrivals[0] - 2) * pulse(arrivals[1] - 2);
  const blink = blinkScale(frame, [36, 80]);
  const idle = Math.sin(frame / 9) * 3;
  const lookY = interpolate(frame, [0, arrivals[0], arrivals[0] + 8], [-0.8, -0.8, 0.3], clamp);

  return (
    <SceneBg color={p.blue}>
      <DetailText title={props.title} body={props.body} />

      <VisualBox>
        <div
          style={{
            position: "absolute",
            left: CARD.left,
            top: CARD.top,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 46,
            background: p.white,
            boxShadow: "0 30px 80px rgba(0, 10, 90, 0.28)",
            fontFamily: fonts.ui,
            opacity: Math.min(1, cardIn * 1.5),
            transform: `translateY(${(1 - cardIn) * 30}px)`,
          }}
        >
          <div style={{ position: "absolute", left: 40, top: 30, display: "flex", alignItems: "center", gap: 14 }}>
            <CalendarIcon size={40} color={p.blue} />
            <span style={{ fontSize: 34, fontWeight: 600, color: p.ink }}>{props.month}</span>
          </div>
          {props.weekdays.map((w, c) => (
            <div
              key={w}
              style={{
                position: "absolute",
                left: 30 + c * CELL_W,
                width: CELL_W,
                top: 100,
                textAlign: "center",
                fontSize: 24,
                color: p.greyText,
                letterSpacing: "0.04em",
              }}
            >
              {w}
            </div>
          ))}
          <div style={{ position: "absolute", left: 30, right: 30, top: GRID_TOP - 8, height: 2, background: p.grey }} />
          <div
            style={{ position: "absolute", left: 30, right: 30, top: GRID_TOP + ROW_H - 4, height: 2, background: p.grey }}
          />

          {days.map((d, i) => {
            const r = Math.floor(i / COLS);
            const c = i % COLS;
            const isDue = i === dueIdx;
            const remindN = i === r7Idx ? 0 : i === r2Idx ? 1 : -1;
            const l = remindN >= 0 ? lit[remindN] : 0;
            const ring = remindN >= 0 ? interpolate(frame, [arrivals[remindN] - 6, arrivals[remindN] + 12], [0, 1], clamp) : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 30 + c * CELL_W,
                  top: GRID_TOP + r * ROW_H,
                  width: CELL_W,
                  height: ROW_H - 12,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: (CELL_W - 58) / 2,
                    top: 14,
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: isDue ? p.blue : remindN >= 0 ? `rgba(182,199,255,${l})` : "transparent",
                    transform: `scale(${remindN >= 0 ? 1 + Math.min(l, 1) * 0.1 : 1})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    fontWeight: isDue || l > 0.5 ? 600 : 400,
                    color: isDue ? p.white : d.other ? "#c9ccd4" : l > 0.5 ? p.blue : p.ink,
                  }}
                >
                  {d.n}
                </div>
                {remindN >= 0 && ring > 0 && ring < 1 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: (CELL_W - 58) / 2,
                      top: 14,
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      border: `4px solid ${p.blueMid}`,
                      opacity: 1 - ring,
                      transform: `scale(${1 + ring * 0.9})`,
                    }}
                  />
                ) : null}
                {remindN >= 0 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 84,
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 600,
                      color: p.blueMid,
                      opacity: l,
                    }}
                  >
                    {remindN === 0 ? "−7" : "−2"}
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* Due-date event, spans into the next day */}
          {dueIdx >= 0 ? (
            <div
              style={{
                position: "absolute",
                left: 30 + (dueIdx % COLS) * CELL_W + 8,
                top: GRID_TOP + Math.floor(dueIdx / COLS) * ROW_H + 82,
                height: 42,
                padding: "0 14px",
                borderRadius: 12,
                background: p.blue,
                color: p.white,
                fontSize: 21,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
                opacity: Math.min(1, eventIn * 2),
                transform: `translateY(${(1 - eventIn) * -24}px)`,
                transformOrigin: "0 50%",
              }}
            >
              {props.eventLabel}
            </div>
          ) : null}
        </div>

        {notifs.map((n, i) => {
          const s = pop(frame, fps, arrivals[i], springs.pop);
          if (s <= 0.001) return null;
          const slots = pushedSlots(frame, fps, arrivals, i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CARD.left,
                top: 548 + slots * 136 - (1 - s) * 40,
                opacity: Math.min(1, s * 1.6),
                transform: `scale(${0.88 + 0.12 * s})`,
                transformOrigin: "0 50%",
                zIndex: 10 + i,
              }}
            >
              <Notification text={n.text} time={n.time} icon={n.icon} width={NOTIF_W} />
            </div>
          );
        })}

        {arrivals.map((at, i) => (
          <div key={i} style={{ position: "absolute", left: BX - 70, top: FEET - BUDDY_H - 92 + idle }}>
            <SignalArcs progress={interpolate(frame, [at - 6, at + 14], [0, 1], clamp)} color={p.white} size={140} />
          </div>
        ))}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: -0.7, y: lookY }}
          style={{
            position: "absolute",
            left: BX - BUDDY / 2,
            top: FEET - BUDDY_H + idle,
            opacity: Math.min(1, enter * 3),
          }}
        />
      </VisualBox>
    </SceneBg>
  );
};
