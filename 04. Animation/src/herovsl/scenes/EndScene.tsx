import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { PopWords, useHeroLayout } from "../layout";
import type { HeroVslProps } from "../schema";

// Promise + CTA. Buddy hops in next to the button and looks at it, so the
// eye goes to the button (and to the real button under the video).
export const END_T = {
  headline: 6,
  headStagger: 3,
  buddyIn: 18,
  button: 24,
  subline: 30,
  logo: 38,
  lookAtButton: 44,
  blink: 52,
  tap: 66,
};

export const EndScene: React.FC<{ props: HeroVslProps["end"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useHeroLayout();

  const headSize = L.wide ? 104 : 84;
  const buddySize = L.wide ? 150 : 132;
  const btnScale = L.wide ? 1.12 : 1.0;

  const buddyIn = pop(frame, fps, END_T.buddyIn, springs.bouncy);
  const btnIn = pop(frame, fps, END_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, END_T.button + 6, springs.pop);
  const subIn = interpolate(frame, [END_T.subline, END_T.subline + 14], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const logoIn = pop(frame, fps, END_T.logo, springs.smooth);
  const tap = interpolate(frame, [END_T.tap, END_T.tap + 3, END_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [END_T.tap + 1, END_T.tap + 18], [0, 1], clamp);
  const nudge = frame > END_T.button + 14 ? Math.max(0, Math.sin((frame - END_T.button - 14) / 4)) * 8 : 0;
  const look = interpolate(frame, [END_T.lookAtButton, END_T.lookAtButton + 6], [0, 1], clamp);
  const blink = blinkScale(frame, [END_T.blink]);
  const idle = frame > END_T.buddyIn + 14 ? Math.sin((frame - END_T.buddyIn) / 8) * 3 : 0;

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: L.wide ? 10 : 30,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: headSize,
            letterSpacing: headlineTracking,
            lineHeight: 1.0,
            textAlign: "center",
          }}
        >
          <PopWords
            text={props.headline}
            delay={END_T.headline}
            stagger={END_T.headStagger}
            colorForLine={(li) => (li === 0 ? p.white : p.blueSoft)}
          />
        </div>

        <div
          style={{
            marginTop: L.wide ? 34 : 30,
            fontFamily: fonts.display,
            fontSize: L.wide ? 40 : 38,
            letterSpacing: "0.01em",
            color: p.blueText,
            textAlign: "center",
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
          }}
        >
          {props.subline}
        </div>

        <div
          style={{
            marginTop: L.wide ? 64 : 70,
            height: Math.max(CTA_H * btnScale, buddySize * BUDDY_RATIO),
            display: "flex",
            alignItems: "flex-end",
            gap: 26,
          }}
        >
          <Buddy
            size={buddySize}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1])}
            look={{ x: props.showButton ? look * 0.9 : 0, y: props.showButton ? look * 0.25 : 0.1 }}
            style={{
              transform: `translateY(${idle}px) scale(${0.4 + 0.6 * buddyIn})`,
              transformOrigin: "50% 100%",
              opacity: Math.min(1, buddyIn * 3),
              marginBottom: props.showButton ? (CTA_H * btnScale - buddySize * BUDDY_RATIO) / 2 : 0,
            }}
          />
          {props.showButton ? (
            <div
              style={{
                position: "relative",
                transform: `scale(${btnScale * btnIn * tap})`,
                transformOrigin: "0% 50%",
                opacity: Math.min(1, btnIn * 2),
                marginRight: L.wide ? 60 : 40,
                width: undefined,
                alignSelf: "center",
              }}
            >
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
          ) : null}
        </div>

        <div
          style={{
            marginTop: L.wide ? 90 : 110,
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 30}px)`,
          }}
        >
          <Wordmark size={L.wide ? 76 : 70} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </div>
    </SceneBg>
  );
};
