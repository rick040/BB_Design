import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import type { CountdownProps } from "../schema";

const T_CHECK = 6;
const T_CARD = 18;
const T_STAMP = 36;
const HOPS = [12, 30];
const BUDDY = 190;
const BUDDY_X = 830;
const BUDDY_FEET = 440;

export const PaidScene: React.FC<{
  props: CountdownProps["paid"];
  bill: CountdownProps["bill"];
  dueLabel: string;
}> = ({ props, bill, dueLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const check = interpolate(frame, [T_CHECK, T_CHECK + 18], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const checkPop = pop(frame, fps, T_CHECK + 16, { damping: 10, stiffness: 200 });

  // Two happy hops with squinting eyes.
  let hopY = 0;
  let squash = 1;
  for (const h of HOPS) {
    const t = interpolate(frame, [h, h + 14], [0, 1], clamp);
    if (t > 0 && t < 1) {
      hopY = -110 * 4 * t * (1 - t);
      squash = interpolate(t, [0, 0.15, 0.5, 0.9, 1], [0.85, 1.15, 1, 1.08, 0.9]);
    }
  }
  const settle = interpolate(frame, [HOPS[1] + 14, HOPS[1] + 18, HOPS[1] + 24], [0.85, 1.05, 1], clamp);
  if (frame >= HOPS[1] + 14) squash = settle;
  const buddyIn = pop(frame, fps, 4, { damping: 12, stiffness: 160 });
  const happy = frame >= 10 && frame < 64 ? 0.18 : 1;

  const cardIn = pop(frame, fps, T_CARD, { damping: 15, stiffness: 140 });
  const stampIn = pop(frame, fps, T_STAMP, { damping: 12, stiffness: 260, mass: 0.6 });

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={4} stagger={4} />

      <Stage>
        <Checkmark
          size={400}
          color={p.blue}
          progress={check}
          strokeWidth={15}
          style={{
            position: "absolute",
            left: 540 - 260,
            top: 20,
            transform: `scale(${1 + (checkPop - 1) * 0.15})`,
          }}
        />

        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          squash={squash}
          blink={happy}
          look={{ x: -0.6, y: -0.2 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + hopY + (1 - buddyIn) * 260,
            opacity: Math.min(1, buddyIn * 2),
          }}
        />

        <BillCard
          sender={bill.sender}
          subject={bill.subject}
          amount={bill.amount}
          dueLabel={dueLabel}
          stamp={props.stamp}
          stampIn={frame >= T_STAMP ? stampIn : 0}
          style={{
            position: "absolute",
            left: (1080 - BILL_W) / 2,
            top: 520 + (1 - cardIn) * 500,
            opacity: Math.min(1, cardIn * 1.5),
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={T_STAMP + 6} />
    </SceneBg>
  );
};
