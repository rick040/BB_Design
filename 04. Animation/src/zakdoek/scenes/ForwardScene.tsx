import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Knot } from "../components/Cloth";
import { HangTag, TAG_HOLE, TAG_W } from "../components/HangTag";
import { MAIL_W, MailRow } from "../components/MailRow";
import type { ZakdoekProps } from "../schema";

// Timeline (frames, scene-local).
export const FORWARD_T = {
  tap: 18, // tap on "Doorsturen"
  fly: 26, // the mail flies down and turns into a label
  buddy: 30, // Buddy pops up
  tag: 42, // the label lands
  thread: 46, // a thread runs from Buddy to the label ...
  knot: 54, // ... and Buddy ties the knot (squash)
  line: 58, // label lines: sender, amount, due date
  lineStagger: 6,
  subline: 76,
};

const MAIL = { x: (1080 - MAIL_W) / 2, y: 0 };
const TAG = { x: 560, y: 420 };
const BUDDY = 250;
const BUDDY_X = 290; // centre
const BUDDY_FEET = 850;
const KNOT_AT = { x: BUDDY_X + 40, y: BUDDY_FEET - BUDDY * BUDDY_RATIO + 6 };

export const ForwardScene: React.FC<{
  props: ZakdoekProps["forward"];
  bill: ZakdoekProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const press = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 3, FORWARD_T.tap + 8], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [FORWARD_T.tap + 1, FORWARD_T.tap + 18], [0, 1], clamp);
  const fly = interpolate(frame, [FORWARD_T.fly, FORWARD_T.tag], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mailIn = pop(frame, fps, -6, springs.pop);

  const tagIn = pop(frame, fps, FORWARD_T.tag, { damping: 8, stiffness: 120 });
  const swing = frame >= FORWARD_T.tag ? (1 - tagIn) * 22 + Math.sin((frame - FORWARD_T.tag) / 9) * 2.5 : 0;

  const buddyIn = pop(frame, fps, FORWARD_T.buddy, springs.bouncy);
  const squash =
    frame < FORWARD_T.knot - 4
      ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1])
      : interpolate(
          frame,
          [FORWARD_T.knot - 4, FORWARD_T.knot, FORWARD_T.knot + 5, FORWARD_T.knot + 11],
          [1, 0.82, 1.08, 1],
          clamp,
        );
  const blink = blinkScale(frame, [FORWARD_T.knot + 18]);
  const look = { x: frame < FORWARD_T.tag ? 0.2 : 0.9, y: frame < FORWARD_T.tag ? -0.9 : 0.2 };
  const idle = frame > FORWARD_T.knot + 12 ? Math.sin((frame - FORWARD_T.knot - 12) / 8) * 4 : 0;

  const thread = interpolate(frame, [FORWARD_T.thread, FORWARD_T.knot], [0, 1], clamp);
  const knotIn = pop(frame, fps, FORWARD_T.knot, springs.bouncy);
  const lines = interpolate(frame, [FORWARD_T.line, FORWARD_T.line + FORWARD_T.lineStagger * 3], [0, 3], clamp);

  // Thread from Buddy's head to the hole of the label (stage coords).
  const hole = { x: TAG.x + TAG_HOLE.x, y: TAG.y + TAG_HOLE.y };
  const kx = KNOT_AT.x;
  const ky = KNOT_AT.y + idle;
  const path = `M${kx},${ky} C${kx + 120},${ky - 120} ${hole.x - 120},${hole.y - 40} ${hole.x},${hole.y}`;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} sizeFactor={0.86} />

      <Stage offsetY={10}>
        {fly < 1 ? (
          <MailRow
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            button={props.button}
            press={press}
            ripple={ripple}
            style={{
              left: interpolate(fly, [0, 1], [MAIL.x, TAG.x - 160]),
              top: interpolate(fly, [0, 1], [MAIL.y, TAG.y - 20]),
              transform: `scale(${(0.9 + 0.1 * mailIn) * (1 - 0.6 * fly)}) rotate(${fly * 10}deg)`,
              transformOrigin: "50% 50%",
              opacity: interpolate(fly, [0.7, 1], [1, 0], clamp),
            }}
          />
        ) : null}

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

        {frame >= FORWARD_T.tag - 4 ? (
          <HangTag
            sender={bill.sender}
            amount={bill.amount}
            due={bill.due}
            lines={lines}
            style={{
              left: TAG.x,
              top: TAG.y,
              width: TAG_W,
              transform: `rotate(${swing}deg) scale(${0.5 + 0.5 * Math.min(1, tagIn)})`,
              transformOrigin: `${TAG_HOLE.x}px ${TAG_HOLE.y}px`,
              opacity: Math.min(1, tagIn * 3),
            }}
          />
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + idle,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        {frame >= FORWARD_T.knot ? (
          <Knot size={110} angle={-15} style={{ left: kx - 55, top: ky - 55, transform: `scale(${knotIn})` }} />
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={FORWARD_T.subline} />
    </SceneBg>
  );
};
