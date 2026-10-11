import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { SceneBg, Stage } from "../components/Stage";
import { Headline, Subline } from "../components/Text";
import { blinkScale, clamp } from "../lib/anim";
import { usePalette } from "../lib/palette";
import type { AdProps } from "../schema";

const SIZE = 470;
const GROUND = 820; // y of Buddy's feet inside the stage

// Classic jump: rise (stretch) → apex → fall → land (squash) → settle.
const T_RISE = 6;
const T_APEX = 17;
const T_LAND = 25;

export const BuddyScene: React.FC<{ props: AdProps["buddy"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const p = usePalette();

  const rise = interpolate(frame, [T_RISE, T_APEX], [620, -80], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const fall = interpolate(frame, [T_APEX, T_LAND], [-80, 0], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const idle = frame > T_LAND + 10 ? Math.sin((frame - T_LAND - 10) / 9) * 8 : 0;
  const y = (frame < T_APEX ? rise : fall) + idle;

  const squash =
    frame < T_LAND
      ? interpolate(frame, [T_RISE, T_RISE + 5, T_APEX - 2, T_APEX, T_LAND - 2], [1.2, 1.18, 1.0, 0.98, 1.12], clamp)
      : interpolate(frame, [T_LAND, T_LAND + 3, T_LAND + 8, T_LAND + 13], [1.12, 0.85, 1.05, 1], clamp);

  const look = {
    x: interpolate(frame, [44, 50, 62, 68], [0, 0.25, 0.25, 0], clamp),
    y: interpolate(frame, [T_LAND + 6, T_LAND + 12, 50, 58], [0, -0.9, -0.9, 0.1], clamp),
  };
  const blink = blinkScale(frame, [T_LAND + 18, 66]);

  // Shadow shrinks while Buddy is in the air.
  const air = Math.max(0, -y) / 80;
  const shadowScale = frame < T_RISE + 4 ? 0 : 1 - Math.min(0.5, air * 0.5);

  // Dust puffs on landing.
  const puff = interpolate(frame, [T_LAND, T_LAND + 16], [0, 1], clamp);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={T_LAND - 4} stagger={4} sizeFactor={1.15} />

      <Stage>
        {/* shadow */}
        <div
          style={{
            position: "absolute",
            left: 540 - 190,
            top: GROUND - 22,
            width: 380,
            height: 44,
            borderRadius: "50%",
            background: "rgba(0, 10, 90, 0.28)",
            transform: `scale(${shadowScale})`,
            filter: "blur(6px)",
          }}
        />
        {/* dust puffs */}
        {[-1, 1].map((dir) => (
          <div
            key={dir}
            style={{
              position: "absolute",
              left: 540 + dir * (210 + puff * 90) - 30,
              top: GROUND - 40 - puff * 30,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: p.blueText,
              opacity: frame >= T_LAND ? (1 - puff) * 0.8 : 0,
              transform: `scale(${0.4 + puff})`,
            }}
          />
        ))}
        <Buddy
          size={SIZE}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          blink={blink}
          look={look}
          style={{
            position: "absolute",
            left: 540 - SIZE / 2,
            top: GROUND - SIZE * BUDDY_RATIO + y,
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={T_LAND + 14} />
    </SceneBg>
  );
};
