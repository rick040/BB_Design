import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification } from "../../components/Notification";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, pushedSlots, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { CAL_H, CAL_W, CalendarCard, Chip, Sparkle, Starburst } from "../components/Telshop";
import type { TelshopProps } from "../schema";

// Timeline (frames, scene-local).
export const MORE_T = {
  calendar: 8, // November calendar pops in
  buddyIn: 12,
  mail7: 26, // mail 7 days before: day marked + notification
  mail2: 44, // mail 2 days before: day marked + notification on top
  due: 60, // due day circled blue + chip "In je agenda"
  tada: 70, // Buddy stretches "ta-da", sparkles
  burst: 80, // starburst "7 en 2 dagen vooraf!"
};

const CAL = { x: 40, y: -10 };
const NOTE_Y = 630;
const NOTE_STEP = 172;
const BUDDY = 190;
const BUDDY_X = 900;
const BUDDY_FEET = 540;

export const MoreScene: React.FC<{ props: TelshopProps["more"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const calIn = pop(frame, fps, MORE_T.calendar, springs.pop);
  const mark = (f: number) => (frame >= f ? pop(frame, fps, f, springs.bouncy) : 0);
  const marks = [mark(MORE_T.mail7), mark(MORE_T.mail2), mark(MORE_T.due)];

  const arrivals = [MORE_T.mail7, MORE_T.mail2];
  const notes = [
    { text: props.notify7, time: `${props.mailDays[0]} nov`, icon: "warning" as const },
    { text: props.notify2, time: `${props.mailDays[1]} nov`, icon: "alert" as const },
  ];

  // Buddy hops a little at every mark, then a big "ta-da" stretch.
  const buddyIn = pop(frame, fps, MORE_T.buddyIn, springs.bouncy);
  const bump = (f: number) => {
    const t = frame - f;
    return t >= 0 && t <= 10 ? Math.sin((t / 10) * Math.PI) * 50 : 0;
  };
  const hop = bump(MORE_T.mail7) + bump(MORE_T.mail2) + bump(MORE_T.due);
  const tadaT = frame - MORE_T.tada;
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (tadaT >= 0) squash = interpolate(tadaT, [0, 4, 10, 16], [0.85, 1.22, 0.95, 1], clamp);
  const look = frame < MORE_T.tada ? { x: -1, y: 0.2 } : { x: 0, y: 0 };
  const blink = frame >= MORE_T.tada && frame < MORE_T.tada + 14 ? 0.18 : blinkScale(frame, [MORE_T.buddyIn + 16, MORE_T.tada + 26]);

  const dueChip = pop(frame, fps, MORE_T.due + 4, springs.bouncy);
  const burst = pop(frame, fps, MORE_T.burst, springs.bouncy);
  const sp = (d: number) => (frame - MORE_T.tada - d) / 16;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage offsetY={0}>
        <CalendarCard
          month={props.month}
          mailDays={props.mailDays}
          dueDay={props.dueDay}
          marks={marks}
          style={{
            left: CAL.x,
            top: CAL.y,
            opacity: Math.min(1, calIn * 2),
            transform: `scale(${0.85 + 0.15 * calIn}) rotate(${-2 * calIn}deg)`,
          }}
        />
        <Chip
          text={props.dueLabel}
          t={frame >= MORE_T.due + 4 ? dueChip : 0}
          style={{ left: CAL.x + CAL_W - 250, top: CAL.y + CAL_H - 40, background: p.blue, color: p.white }}
        />

        {notes.map((n, i) => {
          const a = arrivals[i];
          const t = frame >= a ? pop(frame, fps, a, springs.pop) : 0;
          const pushed = pushedSlots(frame, fps, arrivals, i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 90,
                top: NOTE_Y + pushed * NOTE_STEP - (1 - t) * 40,
                opacity: Math.min(1, t * 2),
                transform: `scale(${0.85 + 0.15 * t})`,
                zIndex: 10 + i,
              }}
            >
              <Notification text={n.text} time={n.time} icon={n.icon} />
            </div>
          );
        })}

        <Sparkle size={90} t={sp(0)} color={p.yellow} style={{ left: 760, top: 290 }} />
        <Sparkle size={70} t={sp(5)} color={p.blueSoft} style={{ left: 980, top: 350 }} />

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO - hop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        <Starburst text={props.burst} size={250} t={frame >= MORE_T.burst ? burst : 0} rotate={10} style={{ left: 790, top: 10 }} />
      </Stage>
    </SceneBg>
  );
};
