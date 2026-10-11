import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../components/Buddy";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SceneBg, Stage } from "../components/Stage";
import { Headline } from "../components/Text";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { usePalette } from "../lib/palette";
import type { AdProps } from "../schema";
import { fonts } from "../theme";

const T_BUTTON = 16;
const T_TAP = 50;
const T_LOGO = 30;
const T_PEEK = 40;

export const CtaScene: React.FC<{ props: AdProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const btnIn = pop(frame, fps, T_BUTTON, springs.bouncy);
  const arrowIn = pop(frame, fps, T_BUTTON + 6, springs.pop);
  const breathe = frame > T_BUTTON + 20 ? 1 + Math.sin((frame - T_BUTTON - 20) / 7) * 0.02 : 1;
  const tap = interpolate(frame, [T_TAP, T_TAP + 3, T_TAP + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T_TAP + 1, T_TAP + 18], [0, 1], clamp);
  const nudge = frame > T_BUTTON + 14 ? Math.max(0, Math.sin((frame - T_BUTTON - 14) / 4)) * 8 : 0;

  const subIn = interpolate(frame, [T_BUTTON + 10, T_BUTTON + 24], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const logoIn = pop(frame, fps, T_LOGO, springs.smooth);

  // Buddy peeks in from the right edge and blinks at the viewer.
  const peek = pop(frame, fps, T_PEEK, springs.bouncy);
  const blink = blinkScale(frame, [T_PEEK + 24, T_PEEK + 46]);
  const peekSize = L.tall ? 300 : 230;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} sizeFactor={1.1} />

      <Stage>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 170,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * breathe * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} arrowNudge={nudge} />
            <div
              style={{
                position: "absolute",
                left: CTA_H / 2 - 90,
                top: CTA_H / 2 - 90,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: `5px solid ${p.white}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.2})`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 360,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            letterSpacing: "0.01em",
            color: p.blueText,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
          }}
        >
          {props.subline}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 600,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>

      <Buddy
        size={peekSize}
        body={p.white}
        eye={p.blueMascot}
        blink={blink}
        look={{ x: -0.8, y: interpolate(frame, [T_PEEK + 10, T_PEEK + 20], [0, 0.4], clamp) }}
        style={{
          position: "absolute",
          right: -peekSize * 0.42 - (1 - peek) * peekSize * 0.7,
          top: L.tall ? 1060 : 760,
          transform: `rotate(${-18 + (1 - peek) * -20}deg)`,
          transformOrigin: "50% 50%",
        }}
      />
    </SceneBg>
  );
};
