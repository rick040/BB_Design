import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_W, BillCard } from "../../components/BillCard";
import { RollingNumber } from "../../components/RollingNumber";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import type { TwaalfProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  amount: -10, // big "€12" is already there on frame 0
  bill: -6, // bill card under it
  subline: 16, // "Nog geen ramp."
  breathe: 24, // the amount breathes a little
};

export const AMOUNT_SIZE = 320;

export const HookScene: React.FC<{
  props: TwaalfProps["hook"];
  bill: TwaalfProps["bill"];
  amounts: TwaalfProps["amounts"];
}> = ({ props, bill, amounts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const a = pop(frame, fps, HOOK_T.amount, springs.pop);
  const b = pop(frame, fps, HOOK_T.bill, springs.smooth);
  const breathe = frame > HOOK_T.breathe ? 1 + Math.sin((frame - HOOK_T.breathe) / 7) * 0.015 : 1;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-8} stagger={3} />
      <Stage>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, transform: `scale(${(0.85 + 0.15 * a) * breathe})` }}>
          <RollingNumber values={[`${amounts.currency}${amounts.start}`]} progress={0} size={AMOUNT_SIZE} color={p.blue} />
        </div>
        <div
          style={{
            position: "absolute",
            left: (1080 - BILL_W) / 2,
            top: 460,
            opacity: b,
            transform: `translateY(${(1 - b) * 60}px) scale(0.84)`,
            transformOrigin: "50% 0%",
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={HOOK_T.subline} />
    </SceneBg>
  );
};
