import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { brand, fonts, headlineTracking } from "../../theme";
import { Sea, useStageToFrame } from "../components/Sea";
import { SwimRing } from "../components/SwimRing";
import type { VloedProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 26, // "Vloed komt. Jij staat droog." pops word by word
  tagStagger: 5,
  button: 50,
  subline: 60,
  logo: 68,
  swell: 74, // a big swell lifts Buddy; he stays dry and happy
  swellLen: 30,
  tap: 94,
};

const BUDDY = 170;
const WATER = 740;

export const CtaScene: React.FC<{ props: VloedProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const S = useStageToFrame(0);

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  // A swell lifts the water (and Buddy) and sets him down again.
  const swell = interpolate(frame, [CTA_T.swell, CTA_T.swell + CTA_T.swellLen / 2, CTA_T.swell + CTA_T.swellLen], [0, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const water = WATER - swell * 40;
  const bob = Math.sin(frame / 9) * 8;
  const feet = water + 40 + bob;
  const buddyIn = pop(frame, fps, 4, springs.bouncy);
  const blink = frame > CTA_T.swell + 6 ? 0.18 : blinkScale(frame, [CTA_T.tagline + 8]);
  const tilt = Math.sin(frame / 14) * 5;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.2,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, CTA_T.tagline + wi++ * CTA_T.tagStagger, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? p.white : p.blueSoft,
                      opacity: Math.min(1, s * 1.4),
                      transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                      filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                    }}
                  >
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <Stage>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 120,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.25 * btnIn * tap})`,
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
            top: 290,
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
            top: 380,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={88} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>

      <Sea level={S.y(water) - 24 * S.scale} color={brand.blueMid} amplitude={16} phase={0.8} speed={0.08} />
      <Stage>
        <SwimRing
          part="back"
          width={BUDDY * 1.7}
          red={p.red}
          white={p.white}
          style={{
            left: 540 - BUDDY * 0.85,
            top: feet - BUDDY * 0.78,
            transform: `rotate(${tilt}deg)`,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: feet - BUDDY * BUDDY_RATIO,
            transform: `rotate(${tilt}deg) scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
            opacity: Math.min(1, buddyIn * 3),
          }}
        >
          <Buddy size={BUDDY} body={p.white} eye={brand.blueMascot} blink={blink} look={{ x: 0, y: 0.1 }} />
        </div>
        <SwimRing
          width={BUDDY * 1.7}
          red={p.red}
          white={p.white}
          style={{
            left: 540 - BUDDY * 0.85,
            top: feet - BUDDY * 0.78,
            transform: `rotate(${tilt}deg)`,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
      </Stage>
      <Sea level={S.y(water) + 30 * S.scale + bob * 0.3 * S.scale} color={brand.blueMid} amplitude={12} phase={3} speed={0.1} opacity={0.92} />
    </SceneBg>
  );
};
