import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { RollingNumber } from "../../components/RollingNumber";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, shake } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { amountSteps, type TwaalfProps } from "../schema";
import { AMOUNT_SIZE } from "./HookScene";

// Timeline (frames, scene-local).
export const GROW_T = {
  roll: 12, // €12 rolls up to €52
  rollLen: 34,
  land: 46, // lands on €52, shakes; yellow marker is full
  shakeLen: 14,
  subline: 42, // "Er kan €40 incassokosten bij."
};

export const GrowScene: React.FC<{ props: TwaalfProps["grow"]; amounts: TwaalfProps["amounts"] }> = ({
  props,
  amounts,
}) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const values = amountSteps(amounts.start, amounts.end, amounts.currency);
  const u = interpolate(frame, [GROW_T.roll, GROW_T.roll + GROW_T.rollLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const speed = Math.sin(Math.PI * u);
  const s = shake(frame, GROW_T.land, GROW_T.shakeLen, 18);
  const size = AMOUNT_SIZE * 1.06;
  const marker = interpolate(frame, [GROW_T.roll + 6, GROW_T.land], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />
      <Stage>
        {/* Yellow highlighter behind the number (yellow text on light would not read) */}
        <div
          style={{
            position: "absolute",
            left: 540 - 320 * marker,
            width: 640 * marker,
            top: 170 + size * 0.38,
            height: size * 0.5,
            background: p.red,
            borderRadius: 24,
            transform: `translate(${s.x}px, ${s.y}px) rotate(-2deg)`,
          }}
        />
        <div style={{ position: "absolute", left: 0, right: 0, top: 170, transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}>
          <RollingNumber values={values} progress={u} size={size} color={p.blue} blur={speed * 12} />
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={GROW_T.subline} />
    </SceneBg>
  );
};
