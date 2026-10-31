import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Balloon, balloonKnot, BalloonString, StringLayer } from "../components/Balloon";
import type { BallonProps } from "../schema";

// Timeline (frames, scene-local).
export const TIE_T = {
  hopIn: 8, // Buddy hops in along the top of the calendar, balloon above him
  hopLen: 28,
  tie: 40, // he ties the string to the due date
  tieLen: 10,
  filled: 48, // due date cell turns blue
  aside: 58, // Buddy hops aside
  remind7: 68, // tag "nog 7 dagen" on the string, cell lights up
  remind2: 88, // tag "nog 2 dagen"
  happy: 104, // happy eyes
};

const CAL_X = 90;
const CAL_W = 900;
const CAL_Y = 420;
const PAD = 24;
const HEAD_H = 130; // month + weekday rows
const ROW_H = 104;
const CELL_W = (CAL_W - PAD * 2) / 7;
const BUDDY = 140;
const BAL_W = 260;

const cellOf = (day: number, firstDay: number) => {
  const idx = day - firstDay;
  if (idx < 0 || idx > 20) return null;
  const r = Math.floor(idx / 7);
  const c = idx % 7;
  return {
    r,
    c,
    x: CAL_X + PAD + c * CELL_W,
    y: CAL_Y + HEAD_H + r * ROW_H,
    cx: CAL_X + PAD + (c + 0.5) * CELL_W,
    cy: CAL_Y + HEAD_H + (r + 0.5) * ROW_H,
  };
};

const Envelope: React.FC<{ size: number; color: string; flap: string }> = ({ size, color, flap }) => (
  <svg width={size} height={size * 0.74} viewBox="0 0 40 30" style={{ display: "block", flexShrink: 0 }}>
    <rect x={1} y={1} width={38} height={28} rx={5} fill={color} />
    <path d="M3 4 L20 17 L37 4" fill="none" stroke={flap} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TieScene: React.FC<{
  props: BallonProps["tie"];
  bill: BallonProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const due = cellOf(bill.dueDay, props.firstDay) ?? cellOf(props.firstDay + 17, props.firstDay)!;
  const r7 = cellOf(bill.dueDay - 7, props.firstDay);
  const r2 = cellOf(bill.dueDay - 2, props.firstDay);

  // Buddy: hops in (three hops), then hops aside after tying.
  const hopEnd = TIE_T.hopIn + TIE_T.hopLen;
  const arriveX = due.cx - 150;
  const asideX = CAL_X + 10;
  let bx = interpolate(frame, [TIE_T.hopIn, hopEnd], [-120, arriveX], clamp);
  bx = interpolate(frame, [TIE_T.aside, TIE_T.aside + 12], [bx, asideX], clamp);
  const hopPhase = (frame - TIE_T.hopIn) / (TIE_T.hopLen / 3);
  const hopping = frame >= TIE_T.hopIn && frame < hopEnd;
  let hopY = hopping ? Math.abs(Math.sin(hopPhase * Math.PI)) * 46 : 0;
  if (frame >= TIE_T.aside && frame < TIE_T.aside + 12) hopY = Math.sin(((frame - TIE_T.aside) / 12) * Math.PI) * 60;
  let squash = hopping ? 1 + Math.sin(hopPhase * Math.PI * 2) * 0.06 : 1;
  // tying: a little press
  if (frame >= TIE_T.tie && frame < TIE_T.tie + 16)
    squash = interpolate(frame, [TIE_T.tie, TIE_T.tie + 5, TIE_T.tie + 10, TIE_T.tie + 16], [1, 0.84, 1.06, 1], clamp);
  const blink = frame >= TIE_T.happy ? interpolate(frame, [TIE_T.happy, TIE_T.happy + 4], [1, 0.18], clamp) : blinkScale(frame, [TIE_T.filled + 30]);
  const lookX = frame < TIE_T.tie ? 0.6 : frame < TIE_T.aside ? 0.4 : 0.8;

  const buddyTop = CAL_Y - BUDDY * BUDDY_RATIO - hopY;
  const hold = { x: bx + BUDDY * 0.62, y: buddyTop + 28 };

  // Balloon: follows Buddy, then moves above the due date.
  const tieT = interpolate(frame, [TIE_T.tie, TIE_T.tie + TIE_T.tieLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const tug7 = interpolate(frame, [TIE_T.remind7, TIE_T.remind7 + 5, TIE_T.remind7 + 14], [0, -16, 0], clamp);
  const tug2 = interpolate(frame, [TIE_T.remind2, TIE_T.remind2 + 5, TIE_T.remind2 + 14], [0, -16, 0], clamp);
  const balX = interpolate(tieT, [0, 1], [bx + 120, due.cx]);
  const balY = 115 + Math.sin(frame / 11) * 6 + tug7 + tug2;
  const knot = balloonKnot(balX, balY, BAL_W);
  const anchor = {
    x: interpolate(tieT, [0, 1], [hold.x, due.cx]),
    y: interpolate(tieT, [0, 1], [hold.y, due.y + 14]),
  };

  const filled = pop(frame, fps, TIE_T.filled, springs.pop);
  const in7 = pop(frame, fps, TIE_T.remind7, springs.bouncy);
  const in2 = pop(frame, fps, TIE_T.remind2, springs.bouncy);
  const calIn = pop(frame, fps, 0, springs.smooth);

  // Tags hang to the right of the string, above the calendar.
  const tagAt = (t: number) => ({
    x: interpolate(t, [0, 1], [knot.x, anchor.x]),
    y: interpolate(t, [0, 1], [knot.y, anchor.y]),
  });
  const tags = [
    // left of the string first (7 days), then right of it (2 days)
    { text: props.reminder7, at: tagAt(0.1), s: in7, show: frame >= TIE_T.remind7, left: true },
    { text: props.reminder2, at: tagAt(0.1), s: in2, show: frame >= TIE_T.remind2, left: false },
  ];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={8} stagger={3} />

      <Stage offsetY={0}>
        {/* Calendar */}
        <div
          style={{
            position: "absolute",
            left: CAL_X,
            top: CAL_Y,
            width: CAL_W,
            height: HEAD_H + ROW_H * 3 + PAD,
            background: p.white,
            borderRadius: 40,
            boxShadow: "0 24px 70px rgba(1, 59, 255, 0.12)",
            transform: `translateY(${(1 - calIn) * 40}px)`,
            fontFamily: fonts.ui,
          }}
        >
          <div style={{ position: "absolute", left: PAD + 14, top: 26, fontFamily: fonts.display, fontWeight: 600, fontSize: 48, letterSpacing: "-0.04em", color: p.blue }}>
            {props.month}
          </div>
          {props.weekdays.map((d, i) => (
            <div
              key={d + i}
              style={{ position: "absolute", left: PAD + i * CELL_W, width: CELL_W, top: 90, textAlign: "center", fontSize: 28, fontWeight: 500, color: p.greyText }}
            >
              {d}
            </div>
          ))}
        </div>
        {Array.from({ length: 21 }).map((_, i) => {
          const day = props.firstDay + i;
          const c = cellOf(day, props.firstDay)!;
          const isDue = day === bill.dueDay;
          const is7 = r7 && day === bill.dueDay - 7;
          const is2 = r2 && day === bill.dueDay - 2;
          const lit = isDue ? filled : is7 ? in7 : is2 ? in2 : 0;
          const litOn = isDue ? frame >= TIE_T.filled : is7 ? frame >= TIE_T.remind7 : is2 ? frame >= TIE_T.remind2 : false;
          const bg = isDue ? p.blue : p.blueSoft;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x + 6,
                top: c.y + 6,
                width: CELL_W - 12,
                height: ROW_H - 12,
                borderRadius: 22,
                background: litOn ? bg : p.grey,
                opacity: (litOn ? 1 : 0.55) * calIn,
                transform: `scale(${litOn ? 0.8 + 0.2 * lit : 1})`,
                fontFamily: fonts.ui,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  top: 10,
                  fontSize: 32,
                  fontWeight: 600,
                  color: litOn && isDue ? p.white : p.blue,
                }}
              >
                {day}
              </div>
              {litOn && !isDue ? (
                <div style={{ position: "absolute", right: 12, bottom: 12 }}>
                  <Envelope size={36} color={p.blue} flap={p.blueSoft} />
                </div>
              ) : null}
            </div>
          );
        })}

        <StringLayer zIndex={3}>
          <BalloonString from={knot} to={anchor} color={p.greyText} bend={Math.sin(frame / 8) * 10 * (1 - tieT * 0.6)} width={5} />
          {/* bow where it is tied */}
          {tieT >= 1 ? (
            <g transform={`translate(${anchor.x} ${anchor.y}) scale(${filled})`}>
              <path d="M0 0 C-22 -16 -30 6 0 0 C30 6 22 -16 0 0 Z" fill={p.white} stroke={p.greyText} strokeWidth={4} />
              <circle cx={0} cy={0} r={6} fill={p.greyText} />
            </g>
          ) : null}
        </StringLayer>

        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 4 }}>
          <Balloon
            cx={balX}
            cy={balY}
            w={BAL_W}
            color={p.blue}
            textColor={p.white}
            label={bill.amount}
            sub={bill.dueLabel}
            labelSize={62}
            rotate={Math.sin(frame / 12) * 3 + interpolate(tieT, [0, 0.5, 1], [0, -6, 0])}
          />
        </div>

        {tags.map((t, i) =>
          t.show ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: t.left ? undefined : t.at.x + 18,
                right: t.left ? 1080 - t.at.x + 18 : undefined,
                top: t.at.y - 4 + i * 6,
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: p.white,
                border: `3px solid ${p.blueSoft}`,
                borderRadius: 999,
                padding: "10px 22px 10px 16px",
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 36,
                color: p.blue,
                whiteSpace: "nowrap",
                boxShadow: "0 10px 30px rgba(1, 59, 255, 0.14)",
                transformOrigin: t.left ? "100% 50%" : "0% 50%",
                transform: `scale(${t.s}) rotate(${Math.sin((frame + i * 9) / 7) * 2}deg)`,
              }}
            >
              <Envelope size={40} color={p.blue} flap={p.white} />
              {t.text}
            </div>
          ) : null,
        )}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={{ x: frame >= TIE_T.aside ? lookX : lookX, y: -0.5 }}
          style={{ position: "absolute", left: bx, top: buddyTop, zIndex: 6 }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={TIE_T.remind7 + 6} />
    </SceneBg>
  );
};
