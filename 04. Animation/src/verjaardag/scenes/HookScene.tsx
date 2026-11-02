import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { BirthdayCalendar, CAL_W, MarkerRing } from "../components/BirthdayCalendar";
import type { VerjaardagProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  bill: 20, // the energy bill slides in next to the calendar
  line2: 28, // "Je rekeningen wel." appears in red
  ring: 40, // yellow ring around the 18th on the calendar AND on the bill
  overdue: 64, // bill flips to "Aanmaning", shakes
};

const CAL = { x: (1080 - CAL_W) / 2 - 40, y: 40 };
const BILL_SCALE = 0.8;
const BILL = { x: 1080 - BILL_W * BILL_SCALE - 30, y: 600 };

export const HookScene: React.FC<{
  props: VerjaardagProps["hook"];
  calendar: VerjaardagProps["calendar"];
  bill: VerjaardagProps["bill"];
}> = ({ props, calendar, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const sway = Math.sin(frame / 22) * 0.8;
  const billIn = pop(frame, fps, HOOK_T.bill, { damping: 15, stiffness: 120 });
  const ring = interpolate(frame, [HOOK_T.ring, HOOK_T.ring + 12], [0, 1], clamp);
  const tick = interpolate(frame, [HOOK_T.ring + 4, HOOK_T.ring + 8, HOOK_T.ring + 14], [0, 1, 0], clamp);
  const overdue = frame >= HOOK_T.overdue;
  const s = shake(frame, HOOK_T.overdue, 16, 14);
  const flip = interpolate(frame, [HOOK_T.overdue - 3, HOOK_T.overdue, HOOK_T.overdue + 4], [1, 0.9, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.line1} color={p.blue} delay={-16} stagger={3} />
      <Headline text={props.line2} color={p.red} delay={HOOK_T.line2} stagger={3} top={L.safeTop + L.headlineSize * 2.02} />

      <Stage offsetY={110}>
        <BirthdayCalendar
          title={calendar.title}
          month={calendar.month}
          rows={calendar.rows}
          matchDay={calendar.matchDay}
          ring={ring}
          style={{ left: CAL.x, top: CAL.y, transform: `rotate(${-2.5 + sway}deg)`, transformOrigin: "50% -80px" }}
        />

        <div
          style={{
            position: "absolute",
            left: BILL.x + (1 - billIn) * 1100,
            opacity: frame < HOOK_T.bill ? 0 : 1,
            top: BILL.y,
            width: BILL_W,
            height: BILL_H,
            transform: `translate(${s.x}px, ${s.y}px) rotate(${4 + s.r}deg) scale(${BILL_SCALE * flip})`,
            transformOrigin: "0 0",
          }}
        >
          <BillCard
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            dueLabel={overdue ? props.overdue : bill.due}
            urgent={overdue}
            tick={tick}
          />
          {!overdue ? (
            <MarkerRing
              width={360}
              height={110}
              progress={ring}
              color={p.yellow}
              style={{ left: 20, top: BILL_H - 34 - 70 - 20 }}
            />
          ) : null}
        </div>
      </Stage>
    </SceneBg>
  );
};
