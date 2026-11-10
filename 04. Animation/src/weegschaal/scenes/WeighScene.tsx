import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand } from "../../theme";
import { MiniBill, Scale, Weight } from "../components/Scale";
import { SCENE_STARTS, type WeegschaalProps, wordAt } from "../schema";

// Scenes 1 + 2 share one scale: the bill sits on the right pan, then the
// "€40" weight drops on top of it and the beam slams down.
export const WEIGH_T = {
  headline: -24,
  headlineStagger: 3,
  forgotten: wordAt("vergeten"),
  fineHeadline: SCENE_STARTS[1] - 2,
  stamp: wordAt("aanmaning"),
  weightFall: wordAt("veertig") - 9,
  weightLand: wordAt("veertig"),
};

export const WeighScene: React.FC<{
  hook: WeegschaalProps["hook"];
  fine: WeegschaalProps["fine"];
  bill: WeegschaalProps["bill"];
}> = ({ hook, fine, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const intro = pop(frame + 14, fps, 0, springs.smooth);
  const sway = Math.sin(frame / 9) * 2.2 * interpolate(frame, [WEIGH_T.weightLand - 4, WEIGH_T.weightLand], [1, 0], clamp);
  const slam = spring({ frame: frame - WEIGH_T.weightLand, fps, config: { damping: 7, stiffness: 140, mass: 0.9 } });
  const angle = 7 + sway + 12 * slam;
  const fall = interpolate(frame, [WEIGH_T.weightFall, WEIGH_T.weightLand], [0, 1], { ...clamp, easing: (t) => t * t });
  const sh = shake(frame, WEIGH_T.weightLand, 14, 14);
  const faded = interpolate(frame, [WEIGH_T.forgotten, WEIGH_T.forgotten + 10, WEIGH_T.stamp - 6, WEIGH_T.stamp], [0, 1, 1, 0], clamp);
  const stampIn = pop(frame, fps, WEIGH_T.stamp, springs.pop);
  const hookOut = interpolate(frame, [SCENE_STARTS[1] - 8, SCENE_STARTS[1]], [1, 0], clamp);

  return (
    <SceneBg color={p.light}>
      <div style={{ opacity: hookOut }}>
        <Headline text={hook.headline} color={p.blue} delay={WEIGH_T.headline} stagger={WEIGH_T.headlineStagger} />
      </div>
      {frame >= SCENE_STARTS[1] - 4 ? (
        <Headline text={fine.headline} color={p.blue} delay={WEIGH_T.fineHeadline} stagger={3} />
      ) : null}
      <Stage offsetY={0} style={{ transform: `translate(${sh.x}px, ${sh.y + (1 - intro) * 60}px)` }}>
        <Scale
          angle={angle}
          line={p.blue}
          pan={p.light}
          right={
            <>
              {fall > 0 ? (
                <Weight
                  label={fine.weight}
                  fill={brand.ink}
                  text={brand.white}
                  style={{ transform: `translateY(${(1 - fall) * -900}px)`, marginBottom: -6, zIndex: 2 }}
                />
              ) : null}
              <MiniBill
                sender={bill.sender}
                amount={bill.amount}
                stamp={bill.stamp}
                stampIn={stampIn}
                alert={p.red}
                faded={faded}
                style={{ transform: `rotate(${-3 + faded * 4}deg)` }}
              />
            </>
          }
        />
      </Stage>
    </SceneBg>
  );
};
