import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand } from "../../theme";
import { MiniBill, panPos, PriceTag, Scale, Weight } from "../components/Scale";
import { SCENE_STARTS, type WeegschaalProps, wordAt } from "../schema";

// Scene 3: Buddy jumps onto the empty pan and outweighs the €40 weight,
// which slides off the rising pan and drops out of frame.
const S = SCENE_STARTS[2];
export const BUDDY_T = {
  headline: S - 4,
  headlineStagger: 3,
  jump: S + 2,
  jumpLen: 14,
  tag: wordAt("drie"),
  per: wordAt("maand"),
};
const LAND = BUDDY_T.jump + BUDDY_T.jumpLen;
const BS = 210;

export const BuddyScene: React.FC<{
  props: WeegschaalProps["buddy"];
  bill: WeegschaalProps["bill"];
  weight: string;
}> = ({ props, bill, weight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const tip = spring({ frame: frame - LAND, fps, config: { damping: 8, stiffness: 120, mass: 1 } });
  const angle = 19 - 35 * tip;

  // Buddy's jump from the top left onto the left pan.
  const pan = panPos("left", angle, 200);
  const j = interpolate(frame, [BUDDY_T.jump, LAND], [0, 1], clamp);
  const sx = -160;
  const sy = 120;
  const bx = sx + (pan.x - sx) * j;
  const by = sy + (pan.y - sy) * j - Math.sin(Math.PI * j) * 260;
  const landSquash = frame >= LAND ? interpolate(frame - LAND, [0, 3, 10], [0.7, 1.1, 1], clamp) : 1.08;

  // The weight slides off the right pan once that pan rises.
  const slide = interpolate(frame, [LAND + 2, LAND + 26], [0, 1], { ...clamp, easing: (t) => t * t });
  const tagIn = pop(frame, fps, BUDDY_T.tag, springs.pop);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={BUDDY_T.headline} stagger={BUDDY_T.headlineStagger} />
      <Stage offsetY={0}>
        <Scale
          angle={angle}
          line={p.white}
          pan={p.blue}
          right={
            <>
              <Weight
                label={weight}
                fill={brand.ink}
                text={brand.white}
                style={{
                  transform: `translate(${slide * 520}px, ${slide * slide * 900}px) rotate(${slide * 70}deg)`,
                  marginBottom: -6,
                  opacity: frame > LAND + 30 ? 0 : 1,
                }}
              />
              <MiniBill sender={bill.sender} amount={bill.amount} alert={p.red} style={{ transform: "rotate(-3deg)" }} />
            </>
          }
        />
        <div style={{ position: "absolute", left: bx, top: by + 4, width: 0, height: 0 }}>
          <Buddy
            size={BS}
            body={p.white}
            eye={p.blueMascot}
            blink={blinkScale(frame, [LAND + 30])}
            look={{ x: frame < LAND ? 0.6 : 0.8, y: 0.2 }}
            squash={landSquash}
            style={{ position: "absolute", left: -BS / 2, top: -BS * BUDDY_RATIO, transformOrigin: "50% 100%" }}
          />
          <div
            style={{
              position: "absolute",
              left: -10,
              top: -BS * BUDDY_RATIO - 150,
              transform: `scale(${tagIn}) rotate(${-8 + Math.sin(frame / 6) * 3}deg)`,
              transformOrigin: "0% 100%",
              opacity: Math.min(1, tagIn * 2),
            }}
          >
            <PriceTag price={props.price} per={props.per} fill={p.yellow} text={brand.ink} />
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
