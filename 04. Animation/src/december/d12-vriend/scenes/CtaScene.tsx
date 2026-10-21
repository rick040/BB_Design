import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { CTA_H, CtaPill } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { Wordmark } from "../../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { useLayout } from "../../../lib/layout";
import { usePalette } from "../../../lib/palette";
import { dec, decFonts, decTracking } from "../../theme";
import { Mug } from "../components/Props";
import type { VriendProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  headline: -4,
  headStagger: 3,
  buddies: 6, // beide Buddies komen in beeld
  mugs: 16, // de mokken komen omhoog
  clink: 38, // proost
  button: 52,
  subline: 62,
  logo: 70,
  tap: 100,
};

const SIZE = 290;
const H = SIZE * BUDDY_RATIO;
const FEET = 390;

export const CtaScene: React.FC<{ props: VriendProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const inL = pop(frame, fps, CTA_T.buddies, springs.bouncy);
  const inR = pop(frame, fps, CTA_T.buddies + 4, springs.bouncy);
  const mugUp = pop(frame, fps, CTA_T.mugs, springs.pop);
  const approach = interpolate(frame, [CTA_T.clink - 8, CTA_T.clink], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const bounce = interpolate(frame, [CTA_T.clink, CTA_T.clink + 4, CTA_T.clink + 12], [0, 1, 0], clamp);
  const spark = interpolate(frame, [CTA_T.clink, CTA_T.clink + 14], [0, 1], clamp);
  const steam = frame / 40;
  const squashL = interpolate(frame, [CTA_T.clink - 2, CTA_T.clink + 3, CTA_T.clink + 10], [1, 0.9, 1], clamp);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  // Mokken: komen van beneden en tikken tegen elkaar in het midden.
  const mugY = FEET - 190 - mugUp * 0 + (1 - mugUp) * 120;
  const mugLx = interpolate(approach, [0, 1], [350, 470]) - bounce * 8;
  const mugRx = interpolate(approach, [0, 1], [740, 610]) + bounce * 8;

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: decFonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 0.76,
          lineHeight: 1.0,
          letterSpacing: decTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, CTA_T.headline + wi++ * CTA_T.headStagger, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? dec.white : p.blueSoft,
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

      <Stage offsetY={30}>
        <Buddy
          size={SIZE}
          body={dec.white}
          eye={p.blueMascot}
          squash={squashL * (0.5 + 0.5 * inL)}
          blink={blinkScale(frame, [30, 80])}
          look={{ x: 0.8, y: 0.3 }}
          style={{ position: "absolute", left: 80, top: FEET - H, opacity: Math.min(1, inL * 3), transformOrigin: "50% 100%" }}
        />
        <Buddy
          size={SIZE}
          body={dec.ice}
          eye={p.blueMascot}
          squash={0.5 + 0.5 * inR}
          blink={blinkScale(frame, [34, 84])}
          look={{ x: -0.8, y: 0.3 }}
          style={{ position: "absolute", left: 710, top: FEET - H, opacity: Math.min(1, inR * 3), transformOrigin: "50% 100%" }}
        />

        <Mug
          size={150}
          steam={steam}
          style={{ position: "absolute", left: mugLx - 75, top: mugY - 95, opacity: Math.min(1, mugUp * 2) }}
        />
        <Mug
          size={150}
          steam={steam + 0.4}
          body={dec.ice}
          style={{ position: "absolute", left: mugRx - 75, top: mugY - 95, opacity: Math.min(1, mugUp * 2), transform: "scaleX(-1)" }}
        />
        {/* Vonkjes bij het proosten */}
        {[-1, 0, 1].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 540 - 3 + k * 38 * spark,
              top: mugY - 84 - (k === 0 ? 40 : 14) * spark,
              width: 6,
              height: 34,
              borderRadius: 3,
              background: dec.white,
              opacity: spark > 0 ? (1 - spark) * 0.95 : 0,
              transform: `rotate(${k * 38}deg) scaleY(${0.4 + spark})`,
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 500,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap})`,
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
                border: `5px solid ${dec.white}`,
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
            top: 680,
            textAlign: "center",
            fontFamily: decFonts.text,
            fontWeight: 400,
            fontSize: 42,
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
            top: 790,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={dec.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
