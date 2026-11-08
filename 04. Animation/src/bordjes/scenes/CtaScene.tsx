import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { PlateOnStick } from "../components/Plate";
import type { BordjesProps } from "../schema";
import { SPIN } from "./HookScene";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  plates: 10, // three small plates pop up, already spinning
  plateStagger: 4,
  button: 22,
  subline: 34,
  blink: 40,
  logo: 44,
  nudge: 58, // Buddy hops into the last stick: all spin on
  tap: 76,
};

const BUDDY = 130;
const BUDDY_FEET = 250;
const MINI = { xs: [250, 480, 710], tips: [80, 40, 80], rx: 100 };
const BUDDY_X = 890;

export const CtaScene: React.FC<{ props: BordjesProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  // Tagline: first line white, the rest soft blue; words pop one by one.
  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.plates + 8, springs.bouncy);
  const hopT = interpolate(frame, [CTA_T.nudge - 8, CTA_T.nudge + 8], [0, 1], clamp);
  const hopY = -70 * 4 * hopT * (1 - hopT);
  const hopX = interpolate(frame, [CTA_T.nudge - 8, CTA_T.nudge, CTA_T.nudge + 10], [0, -80, 0], clamp);
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (frame >= CTA_T.nudge - 11) {
    squash = interpolate(
      frame,
      [CTA_T.nudge - 11, CTA_T.nudge - 8, CTA_T.nudge - 4, CTA_T.nudge, CTA_T.nudge + 3, CTA_T.nudge + 9, CTA_T.nudge + 12, CTA_T.nudge + 17],
      [1, 0.82, 1.12, 0.86, 1.06, 1.04, 0.86, 1],
      clamp,
    );
  }
  const blink = Math.min(blinkScale(frame, [CTA_T.blink]), frame > CTA_T.nudge + 14 ? 0.3 : 1);
  const lastSway = interpolate(frame, [CTA_T.nudge, CTA_T.nudge + 3, CTA_T.nudge + 9], [0, -4, 0], clamp);

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
          fontSize: L.headlineSize * 1.25,
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

      <Stage offsetY={60}>
        {MINI.xs.map((x, i) => {
          const s = pop(frame, fps, CTA_T.plates + i * CTA_T.plateStagger, springs.bouncy);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                opacity: Math.min(1, s * 2),
                transform: `translateY(${(1 - s) * 60}px)`,
              }}
            >
              <PlateOnStick
                x={x}
                tipY={MINI.tips[i]}
                floorY={BUDDY_FEET}
                rx={MINI.rx}
                label=""
                phase={frame * SPIN * 1.2 + i * 0.33}
                wobble={Math.sin(frame / 9 + i * 1.7) * 2}
                stickColor={p.blueSoft}
                stickSway={i === 2 ? lastSway : 0}
              />
            </div>
          );
        })}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: -0.7, y: -0.6 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2 + hopX,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + hopY,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
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
            top: 500,
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
            top: 680,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
