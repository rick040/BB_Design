import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BillPhoto } from "../components/BillPhoto";
import { Camera } from "../components/Camera";
import { Polaroid, polaroidSize } from "../components/Polaroid";
import type { PolaroidProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  fly: 8, // the developed photo flies onto the due date
  pin: 30, // photo pinned on the due date, cell lights up
  buddyIn: 40,
  rem7: 58, // flash: reminder photo on T-7
  rem2: 80, // flash: reminder photo on T-2
  subline: 98,
  blink: 112,
};

// Calendar card (stage coords).
const CAL = { x: 100, y: 10, w: 880 };
const PAD = 26;
const HEAD_H = 88;
const DAYS_H = 46;
const CELL_W = (CAL.w - PAD * 2) / 7;
const CELL_H = 150;
const ROWS = 3;
const CAL_H = PAD + HEAD_H + DAYS_H + CELL_H * ROWS + PAD;

const cellPos = (dayIndex: number) => ({
  x: CAL.x + PAD + (dayIndex % 7) * CELL_W,
  y: CAL.y + PAD + HEAD_H + DAYS_H + Math.floor(dayIndex / 7) * CELL_H,
});

const MINI_W = 92;
const MINI_TOP = 46; // below the day number
const BUDDY = 180;
const BUDDY_X = 800;
const BUDDY_FEET = CAL.y + CAL_H + 230;

export const AgendaScene: React.FC<{
  props: PolaroidProps["agenda"];
  bill: PolaroidProps["bill"];
  caption: string;
}> = ({ props, bill, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const days = Array.from({ length: 7 * ROWS }, (_, i) => props.firstDay + i);
  const idx = (day: number) => day - props.firstDay;

  // Big photo flies from the centre onto the due date and shrinks.
  const due = cellPos(idx(props.dueDay));
  const fly = interpolate(frame, [AGENDA_T.fly, AGENDA_T.pin], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const pinPop = pop(frame, fps, AGENDA_T.pin, springs.bouncy);
  const BIG_W = 360;
  const w = interpolate(fly, [0, 1], [BIG_W, MINI_W + 8]);
  const ph = polaroidSize(w);
  const cx = interpolate(fly, [0, 1], [540, due.x + CELL_W / 2 + 10]);
  const cy = interpolate(fly, [0, 1], [CAL.y + CAL_H / 2, due.y + MINI_TOP + polaroidSize(MINI_W + 8).height / 2]);
  const rot = interpolate(fly, [0, 1], [5, -6]);
  const lit = frame >= AGENDA_T.pin ? pinPop : 0;

  const buddyIn = pop(frame, fps, AGENDA_T.buddyIn, springs.bouncy);
  const flashAt = (t: number) => {
    const d = frame - t;
    return d >= 0 ? interpolate(d, [0, 2, 12], [0, 1, 0], clamp) : 0;
  };
  const flash = Math.max(flashAt(AGENDA_T.rem7), flashAt(AGENDA_T.rem2));
  const recoil = Math.max(
    ...[AGENDA_T.rem7, AGENDA_T.rem2].map((t) => {
      const d = frame - t;
      return d >= 0 ? interpolate(d, [0, 2, 8], [0, 1, 0], clamp) : 0;
    }),
  );
  const squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) - recoil * 0.08;
  const blink = blinkScale(frame, [AGENDA_T.blink]);
  const remT = [AGENDA_T.rem7, AGENDA_T.rem2];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />

      <Stage offsetY={0}>
        {/* Calendar */}
        <div
          style={{
            position: "absolute",
            left: CAL.x,
            top: CAL.y,
            width: CAL.w,
            height: CAL_H,
            background: p.white,
            borderRadius: 36,
            boxShadow: "0 24px 70px rgba(10, 30, 120, 0.14)",
            fontFamily: fonts.ui,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: PAD + 10,
              top: PAD + 8,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 54,
              letterSpacing: "-0.04em",
              color: p.blue,
            }}
          >
            {props.month}
          </div>
          {props.weekdays.map((d, i) => (
            <div
              key={d + i}
              style={{
                position: "absolute",
                left: PAD + i * CELL_W,
                width: CELL_W,
                top: PAD + HEAD_H,
                textAlign: "center",
                fontSize: 28,
                fontWeight: 500,
                color: p.greyText,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {days.map((d, i) => {
          const pos = cellPos(i);
          const isDue = d === props.dueDay;
          const valid = d <= props.lastDayOfMonth;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.x + 5,
                top: pos.y + 5,
                width: CELL_W - 10,
                height: CELL_H - 10,
                borderRadius: 20,
                background: isDue ? `rgba(1, 59, 255, ${0.12 + 0.88 * lit})` : "#f2f5fd",
                fontFamily: fonts.ui,
                fontSize: 30,
                fontWeight: 600,
                color: isDue && lit > 0.5 ? p.white : "#5d6377",
                padding: "10px 0 0 14px",
                boxSizing: "border-box",
                opacity: valid ? 1 : 0,
              }}
            >
              {valid ? d : ""}
            </div>
          );
        })}

        {/* Reminder photos on T-7 and T-2 */}
        {props.reminders.map((r, i) => {
          const t = remT[i];
          const s = pop(frame, fps, t + 2, springs.bouncy);
          const pos = cellPos(idx(r.day));
          const mw = MINI_W;
          return frame >= t + 2 ? (
            <Polaroid
              key={i}
              width={mw}
              style={{
                left: pos.x + (CELL_W - mw) / 2 + 10,
                top: pos.y + MINI_TOP,
                transform: `rotate(${i === 0 ? 5 : -5}deg) scale(${0.4 + 0.6 * s})`,
                opacity: Math.min(1, s * 2),
              }}
            >
              <MailIcon size={polaroidSize(mw).photo} />
            </Polaroid>
          ) : null;
        })}

        {/* Due-date photo */}
        <Polaroid
          width={w}
          caption={fly > 0.6 ? undefined : caption}
          style={{
            left: cx - w / 2,
            top: cy - ph.height / 2,
            transform: `rotate(${rot}deg) scale(${1 + (frame >= AGENDA_T.pin ? (1 - pinPop) * 0.25 : 0)})`,
          }}
        >
          <BillPhoto size={ph.photo} bill={bill} />
        </Polaroid>
        {/* Pin */}
        {frame >= AGENDA_T.pin ? (
          <div
            style={{
              position: "absolute",
              left: cx - 13,
              top: cy - ph.height / 2 - 12,
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: p.red,
              boxShadow: "0 4px 8px rgba(0,0,0,0.25)",
              transform: `scale(${pinPop})`,
            }}
          />
        ) : null}

        {/* Reminder labels under the calendar */}
        {props.reminders.map((r, i) => {
          const t = remT[i] + 6;
          const s = pop(frame, fps, t, springs.pop);
          return frame >= t ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CAL.x + 10,
                top: CAL.y + CAL_H + 30 + i * 100,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 28px 16px 18px",
                borderRadius: 40,
                background: p.white,
                boxShadow: "0 12px 30px rgba(10, 30, 120, 0.12)",
                fontFamily: fonts.ui,
                fontSize: 38,
                fontWeight: 600,
                color: p.ink,
                opacity: Math.min(1, s * 2),
                transform: `translateX(${(1 - s) * -40}px)`,
              }}
            >
              <span
                style={{
                  padding: "4px 14px",
                  borderRadius: 20,
                  background: p.blue,
                  color: p.white,
                  fontSize: 30,
                }}
              >
                {r.day} {props.month.slice(0, 3).toLowerCase()}
              </span>
              {r.label}
            </div>
          ) : null;
        })}

        {/* Buddy with camera, bottom right */}
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={{ x: -0.6, y: -0.6 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO,
            opacity: frame >= AGENDA_T.buddyIn ? Math.min(1, buddyIn * 3) : 0,
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <Camera
          width={190}
          flash={flash}
          body={p.blueSoft}
          accent={p.white}
          style={{
            left: BUDDY_X - 85 - 40,
            top: BUDDY_FEET - 100 - recoil * 6,
            opacity: frame >= AGENDA_T.buddyIn ? Math.min(1, buddyIn * 3) : 0,
            transform: `scale(${0.5 + 0.5 * buddyIn}) rotate(-14deg)`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};

const MailIcon: React.FC<{ size: number }> = ({ size }) => {
  const p = usePalette();
  return (
    <div style={{ position: "absolute", inset: 0, background: p.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 40 40">
        <rect x={4} y={9} width={32} height={22} rx={4} fill={p.white} />
        <path d="M5 11l15 11 15-11" fill="none" stroke={p.blue} strokeWidth={2.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
