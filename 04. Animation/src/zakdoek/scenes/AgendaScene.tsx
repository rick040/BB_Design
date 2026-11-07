import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { AGENDA_H, AgendaWeek, CELL_BOTTOM, cellCenterX } from "../components/AgendaWeek";
import { Knot } from "../components/Cloth";
import { HangTag, TAG_HOLE, TAG_W } from "../components/HangTag";
import type { ZakdoekProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  week: 4, // the agenda week pops in
  tag: 12, // the label rises in from below ...
  thread: 26, // ... its thread runs up to the due day ...
  knot: 36, // ... and is knotted onto it (due day gets a ring)
  hop: 50, // Buddy hops ...
  remind: 56, // ... and the reminder day fills blue: "Nog 2 dagen"
  subline: 80,
};

const AG = { x: 60, y: 40 };
const TAG = { x: 470, y: 600 };
const BUDDY = 190;
const BUDDY_X = 250;
const BUDDY_FEET = 860;

export const AgendaScene: React.FC<{
  props: ZakdoekProps["agenda"];
  bill: ZakdoekProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const weekIn = pop(frame, fps, AGENDA_T.week, springs.pop);
  const tagIn = pop(frame, fps, AGENDA_T.tag, { damping: 12, stiffness: 110 });
  const swing = Math.sin(frame / 10) * 2 * Math.min(1, tagIn);
  const thread = interpolate(frame, [AGENDA_T.thread, AGENDA_T.knot], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const knotIn = pop(frame, fps, AGENDA_T.knot, springs.bouncy);
  const due = interpolate(frame, [AGENDA_T.knot, AGENDA_T.knot + 8], [0, 1], clamp);
  const remind = interpolate(frame, [AGENDA_T.remind, AGENDA_T.remind + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // Buddy: hops on the spot, lands as the reminder appears.
  const hopT = interpolate(frame, [AGENDA_T.hop, AGENDA_T.remind + 4], [0, 1], clamp);
  const hop = -150 * 4 * hopT * (1 - hopT);
  const squash = interpolate(
    frame,
    [AGENDA_T.hop - 5, AGENDA_T.hop, AGENDA_T.hop + 4, AGENDA_T.remind + 4, AGENDA_T.remind + 8, AGENDA_T.remind + 14],
    [1, 0.84, 1.12, 1, 0.86, 1],
    clamp,
  );
  const happy = frame > AGENDA_T.remind + 6 && frame < AGENDA_T.remind + 30 ? 0.2 : blinkScale(frame, [AGENDA_T.knot - 8, 100]);
  const look = frame < AGENDA_T.hop ? { x: 0.9, y: 0.3 } : { x: 0.3, y: -0.9 };

  const dueI = props.dueDay - props.firstDay;
  const remindI = props.remindDay - props.firstDay;
  const top = { x: AG.x + cellCenterX(dueI), y: AG.y + CELL_BOTTOM - 6 };
  const hole = { x: TAG.x + TAG_HOLE.x, y: TAG.y + TAG_HOLE.y + (1 - tagIn) * 300 };
  const path = `M${hole.x},${hole.y} C${hole.x - 70},${hole.y - 60} ${top.x + 40},${top.y + 90} ${top.x},${top.y}`;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />

      <Stage>
        <AgendaWeek
          month={props.month}
          firstDay={props.firstDay}
          dueDay={props.dueDay}
          remindDay={remindI >= 0 && remindI < 7 ? props.remindDay : -1}
          remindLabel={props.remindLabel}
          remind={remind}
          due={due}
          style={{
            left: AG.x,
            top: AG.y,
            transform: `scale(${0.92 + 0.08 * weekIn})`,
            opacity: Math.min(1, weekIn * 2),
          }}
        />

        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d={path}
            fill="none"
            stroke={p.blueSoft}
            strokeWidth={8}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - thread}
          />
        </svg>

        <HangTag
          sender={bill.sender}
          amount={bill.amount}
          due={bill.due}
          lines={3}
          style={{
            left: TAG.x,
            top: TAG.y + (1 - tagIn) * 300,
            width: TAG_W,
            opacity: Math.min(1, tagIn * 2),
            transform: `rotate(${swing - 6}deg)`,
            transformOrigin: `${TAG_HOLE.x}px ${TAG_HOLE.y}px`,
          }}
        />

        {frame >= AGENDA_T.knot ? (
          <Knot size={96} angle={10} style={{ left: top.x - 48, top: top.y - 40, transform: `scale(${knotIn})` }} />
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={happy}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + hop,
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};

export { AGENDA_H };
