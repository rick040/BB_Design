import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Callout, InkChip, INK_W, LineEnvelope, MiniCalendar, TickBadge } from "../components/Manual";
import type { HandleidingProps } from "../schema";

// Timeline (frames, scene-local).
export const STEPS_T = {
  step1: 6, // panel ① draws in
  forward: 18, // envelope travels along the arrow to Buddy
  forwardLen: 14,
  tick1: 36, // ① klik
  step2: 40,
  amount: 50, // chip with the amount
  due: 58, // chip with the due date
  tick2: 70, // ② klik
  step3: 76,
  mail7: 86, // "nog 7 dagen" mail
  mail2: 94, // "nog 2 dagen" mail
  calendar: 102, // due date in the calendar
  tick3: 114, // ③ klik
};

const PANEL = { x: 40, w: 1000, h: 286, gap: 22 };
const MINI = 116; // small Buddy in the panels

const Panel: React.FC<{
  n: number;
  index: number;
  appear: number;
  done: number;
  caption: string;
  children: React.ReactNode;
}> = ({ n, index, appear, done, caption, children }) => {
  const p = usePalette();
  const border = done > 0.5 ? p.blue : p.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: PANEL.x,
        top: index * (PANEL.h + PANEL.gap),
        width: PANEL.w,
        height: PANEL.h,
        borderRadius: 28,
        background: p.white,
        border: `${INK_W}px solid ${border}`,
        boxSizing: "border-box",
        opacity: Math.min(1, appear * 2),
        transform: `translateY(${(1 - appear) * 50}px) scale(${0.94 + 0.06 * appear + done * 0.0})`,
      }}
    >
      <Callout n={n} size={78} color={done > 0.5 ? p.blue : p.ink} style={{ left: 26, top: 26 }} />
      {children}
      <div
        style={{
          position: "absolute",
          left: 552,
          right: 20,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 41,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: p.ink,
          whiteSpace: "pre-line",
        }}
      >
        {caption}
      </div>
      <TickBadge
        size={70}
        bg={p.blue}
        fg={p.white}
        style={{ right: -22, top: -24, transform: `scale(${done})`, opacity: done > 0.01 ? 1 : 0 }}
      />
    </div>
  );
};

const MailIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={34} height={24} viewBox="0 0 34 24">
    <rect x={2} y={2} width={30} height={20} rx={4} fill="none" stroke={color} strokeWidth={3.5} />
    <path d="M3 4 L17 14 L31 4" fill="none" stroke={color} strokeWidth={3.5} strokeLinejoin="round" />
  </svg>
);

export const StepsScene: React.FC<{
  props: HandleidingProps["steps"];
  bill: HandleidingProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const appear = (d: number) => pop(frame, fps, d, springs.smooth);
  const tick = (d: number) => (frame >= d ? pop(frame, fps, d, springs.bouncy) : 0);

  // Step 1: the envelope travels along the arrow and lands at Buddy.
  const fwd = interpolate(frame, [STEPS_T.forward, STEPS_T.forward + STEPS_T.forwardLen], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const caught = STEPS_T.forward + STEPS_T.forwardLen;
  const hop1 = interpolate(frame, [caught, caught + 4, caught + 10, caught + 15], [1, 0.82, 1.08, 1], clamp);
  const arrowDraw = interpolate(frame, [STEPS_T.step1 + 6, STEPS_T.forward], [0, 1], clamp);

  const amount = pop(frame, fps, STEPS_T.amount, springs.pop);
  const due = pop(frame, fps, STEPS_T.due, springs.pop);
  const mail7 = pop(frame, fps, STEPS_T.mail7, springs.pop);
  const mail2 = pop(frame, fps, STEPS_T.mail2, springs.pop);
  const cal = pop(frame, fps, STEPS_T.calendar, springs.bouncy);
  const blink = blinkScale(frame, [STEPS_T.tick2 + 10]);
  const read = interpolate(frame, [STEPS_T.amount - 4, STEPS_T.amount + 6], [0, 1], clamp);

  const chipStyle = (t: number, left: number, top: number): React.CSSProperties => ({
    left,
    top,
    opacity: Math.min(1, t * 2),
    transform: `scale(${0.6 + 0.4 * t})`,
    transformOrigin: "0% 50%",
  });

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-4} stagger={3} />

      <Stage offsetY={74}>
        {/* ① Forward */}
        <Panel n={1} index={0} appear={appear(STEPS_T.step1)} done={tick(STEPS_T.tick1)} caption={props.step1}>
          <LineEnvelope w={140} h={94} style={{ left: 130, top: 121, opacity: 0.25 }} />
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
            <line
              x1={286}
              y1={169}
              x2={286 + 96 * arrowDraw}
              y2={169}
              stroke={p.blueMid}
              strokeWidth={6}
              strokeLinecap="round"
            />
            {arrowDraw > 0.95 ? (
              <path d="M370 155 L386 169 L370 183" fill="none" stroke={p.blueMid} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
          </svg>
          <div
            style={{
              position: "absolute",
              left: 262,
              width: 150,
              top: 113,
              textAlign: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 22,
              color: p.blueMid,
              opacity: arrowDraw,
            }}
          >
            {props.forwardLabel}
          </div>
          <LineEnvelope
            w={140}
            h={94}
            style={{
              left: 130 + fwd * 290,
              top: 121 - Math.sin(fwd * Math.PI) * 40 + fwd * 30,
              transform: `scale(${1 - fwd * 0.55})`,
              opacity: frame < caught ? 1 : 0,
            }}
          />
          <Buddy
            size={MINI}
            body={p.blueMascot}
            eye={p.white}
            squash={hop1}
            look={{ x: -0.6 + fwd * 0.6, y: 0.2 }}
            style={{ position: "absolute", left: 404, top: 227 - MINI * BUDDY_RATIO }}
          />
        </Panel>

        {/* ② Buddy reads amount + due date */}
        <Panel n={2} index={1} appear={appear(STEPS_T.step2)} done={tick(STEPS_T.tick2)} caption={props.step2}>
          <Buddy
            size={MINI}
            body={p.blueMascot}
            eye={p.white}
            blink={blink}
            look={{ x: read, y: 0.1 }}
            style={{ position: "absolute", left: 128, top: 231 - MINI * BUDDY_RATIO }}
          />
          <InkChip text={bill.amount} size={32} style={chipStyle(amount, 272, 55)} />
          <InkChip text={bill.due} size={32} color={p.blue} style={chipStyle(due, 272, 149)} />
        </Panel>

        {/* ③ Reminders + calendar */}
        <Panel n={3} index={2} appear={appear(STEPS_T.step3)} done={tick(STEPS_T.tick3)} caption={props.step3}>
          <InkChip text={props.reminder7} size={27} style={chipStyle(mail7, 120, 61)}>
            <MailIcon color={p.ink} />
          </InkChip>
          <InkChip text={props.reminder2} size={27} style={chipStyle(mail2, 120, 155)}>
            <MailIcon color={p.ink} />
          </InkChip>
          <MiniCalendar
            size={150}
            month={bill.dueMonth}
            day={bill.dueDay}
            accent={p.blue}
            style={{
              left: 376,
              top: 67,
              opacity: Math.min(1, cal * 2),
              transform: `scale(${0.5 + 0.5 * cal}) rotate(${(1 - cal) * -12}deg)`,
            }}
          />
        </Panel>
      </Stage>
    </SceneBg>
  );
};
