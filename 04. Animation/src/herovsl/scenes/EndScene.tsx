import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { useHeroLayout } from "../layout";
import type { HeroVslProps } from "../schema";

// Promise + CTA, calm: the headline fades in line by line, then Buddy and
// the button, then the wordmark. Buddy looks at the button.
export const END_T = {
  headline: 8,
  lineStagger: 7,
  button: 24,
  subline: 30,
  logo: 36,
  lookAtButton: 46,
  blink: 62,
};

const soft = { damping: 16, stiffness: 120, mass: 0.9 };

export const EndScene: React.FC<{ props: HeroVslProps["end"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useHeroLayout();

  const headSize = L.wide ? 104 : 86;
  const buddySize = L.wide ? 150 : 136;
  const btnScale = L.wide ? 1.12 : 1.04;
  const lines = props.headline.split("\n");

  const fade = (at: number, len = 14) =>
    interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const btnIn = spring({ frame: frame - END_T.button, fps, config: soft });
  const arrowIn = spring({ frame: frame - END_T.button - 8, fps, config: soft });
  const subIn = fade(END_T.subline);
  const logoIn = fade(END_T.logo, 18);
  const look = interpolate(frame, [END_T.lookAtButton, END_T.lookAtButton + 8], [0, 1], clamp);
  const blink = blinkScale(frame, [END_T.blink]);
  const idle = Math.sin(frame / 12) * 3;

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
            lineHeight: 1.02,
            textAlign: "center",
          }}
        >
          {lines.map((line, i) => {
            const t = fade(END_T.headline + i * END_T.lineStagger);
            return (
              <div
                key={i}
                style={{
                  color: i === 0 ? p.white : p.blueSoft,
                  opacity: t,
                  transform: `translateY(${(1 - t) * 26}px)`,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>

        {props.subline ? (
          <div
            style={{
              marginTop: L.wide ? 30 : 26,
              fontFamily: fonts.display,
              fontSize: L.wide ? 40 : 38,
              letterSpacing: "0.01em",
              color: p.blueText,
              textAlign: "center",
              opacity: subIn,
            }}
          >
            {props.subline}
          </div>
        ) : null}

        <div
          style={{
            marginTop: L.wide ? 64 : 74,
            height: Math.max(CTA_H * btnScale, buddySize * BUDDY_RATIO),
            display: "flex",
            alignItems: "center",
            gap: 30,
            opacity: Math.min(1, btnIn * 2),
            transform: `translateY(${(1 - btnIn) * 30}px)`,
          }}
        >
          <Buddy
            size={buddySize}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            look={{ x: props.showButton ? look * 0.9 : 0, y: props.showButton ? look * 0.2 : 0.1 }}
            style={{ transform: `translateY(${idle}px)` }}
          />
          {props.showButton ? (
            // zoom (not transform) so the scaled button keeps the row centred
            <div style={{ zoom: btnScale }}>
              <CtaPill text={props.button} arrowIn={arrowIn} />
            </div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: L.wide ? 84 : 104,
            opacity: logoIn,
          }}
        >
          <Wordmark size={L.wide ? 74 : 68} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </div>
    </SceneBg>
  );
};
