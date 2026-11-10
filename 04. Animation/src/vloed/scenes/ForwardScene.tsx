import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand } from "../../theme";
import { ForwardMail, MAIL_H, MAIL_W, ValueChip } from "../components/ForwardMail";
import { Sea, useStageToFrame } from "../components/Sea";
import { SwimRing } from "../components/SwimRing";
import type { VloedProps } from "../schema";

// Timeline (frames, scene-local).
export const FORWARD_T = {
  tap: 24, // tap on "Doorsturen"
  flyLen: 20, // mail folds up and flies to Buddy
  catch: 46, // Buddy catches it in his ring (squash)
  amount: 58, // chip: amount
  due: 64, // chip: due date
  subline: 72,
};

const BUDDY = 220;
const BUDDY_X = 540;
const WATER = 730; // stage y of the waterline
const MAIL_Y = 40;

export const ForwardScene: React.FC<{
  props: VloedProps["forward"];
  bill: VloedProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const S = useStageToFrame(0);

  const press = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 3, FORWARD_T.tap + 8], [0, 1, 0], clamp);
  const fly = interpolate(frame, [FORWARD_T.tap + 4, FORWARD_T.tap + 4 + FORWARD_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const mailIn = pop(frame, fps, 2, springs.smooth);

  const bob = Math.sin(frame / 9) * 8;
  const feet = WATER + 40 + bob;
  const mailX = 540 + (BUDDY_X - 540) * fly;
  const mailY = MAIL_Y + MAIL_H / 2 + (feet - BUDDY * 0.7 - (MAIL_Y + MAIL_H / 2)) * fly - Math.sin(fly * Math.PI) * 120;
  const mailScale = (1 - fly * 0.86) * (0.9 + 0.1 * mailIn);

  const t = frame - FORWARD_T.catch;
  const squash = interpolate(t, [-2, 0, 4, 10, 16], [1, 0.8, 1.12, 0.96, 1], clamp);
  const blink = blinkScale(frame, [FORWARD_T.due + 12]);
  const look = frame < FORWARD_T.catch ? { x: 0, y: -0.9 } : { x: 0, y: -0.5 };

  const a = pop(frame, fps, FORWARD_T.amount, springs.bouncy);
  const d = pop(frame, fps, FORWARD_T.due, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={6} stagger={3} />

      <Sea level={S.y(WATER) - 24 * S.scale} color={brand.blueMid} amplitude={14} phase={1} speed={0.08} />

      <Stage>
        {fly < 1 ? (
          <ForwardMail
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            button={props.button}
            press={press}
            style={{
              left: mailX - MAIL_W / 2,
              top: mailY - MAIL_H / 2,
              transform: `scale(${mailScale}) rotate(${fly * -12}deg)`,
              opacity: Math.min(1, mailIn * 2) * interpolate(fly, [0.85, 1], [1, 0], clamp),
            }}
          />
        ) : null}

        <ValueChip text={bill.amount} s={a} style={{ left: 300, top: 360 }} />
        <ValueChip text={bill.due.replace(/^Vervalt\s+/i, "")} s={d} style={{ left: 760, top: 360 }} />

        <SwimRing
          part="back"
          width={BUDDY * 1.7}
          red={p.red}
          white={p.white}
          style={{ left: BUDDY_X - BUDDY * 0.85, top: feet - BUDDY * 0.78 }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={brand.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: feet - BUDDY * BUDDY_RATIO,
          }}
        />
        <SwimRing
          width={BUDDY * 1.7}
          red={p.red}
          white={p.white}
          style={{ left: BUDDY_X - BUDDY * 0.85, top: feet - BUDDY * 0.78 }}
        />
      </Stage>

      <Sea level={S.y(WATER) + 30 * S.scale + bob * S.scale * 0.3} color={brand.blueMid} amplitude={12} phase={3} speed={0.1} opacity={0.92} />

      <Subline text={props.subline} color={p.white} delay={FORWARD_T.subline} />
    </SceneBg>
  );
};
