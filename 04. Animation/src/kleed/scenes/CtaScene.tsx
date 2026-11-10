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
import { Broom } from "../components/Broom";
import type { KleedProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 4,
  sweep: 14, // Buddy sweeps the button into view with his broom
  sweepLen: 28,
  subline: 40,
  logo: 48,
  blink: 56,
  tap: 72,
};

const FLOOR = 330;
const BUDDY = 150;
const PILL_W = 560; // approx. rendered width of the pill at scale 1
const PILL_SCALE = 1.12;
const PILL_END = 640; // centre x
const PUFFS = [0, 5, 10, 15, 20, 25];

export const CtaScene: React.FC<{ props: KleedProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const sw = interpolate(frame, [CTA_T.sweep, CTA_T.sweep + CTA_T.sweepLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const pillX = interpolate(sw, [0, 1], [-PILL_W, PILL_END]);
  const headX = pillX - (PILL_W * PILL_SCALE) / 2 - 92;
  const buddyX = headX - 80;
  const sweeping = frame >= CTA_T.sweep && frame < CTA_T.sweep + CTA_T.sweepLen;
  const brush = sweeping ? Math.sin((frame - CTA_T.sweep) / 1.8) * 6 : 0;
  const broomAngle = -24 + brush;
  const hop = sweeping ? -Math.abs(Math.sin((frame - CTA_T.sweep) / 2.6)) * 18 : 0;
  const settle = interpolate(frame, [CTA_T.sweep + CTA_T.sweepLen - 2, CTA_T.sweep + CTA_T.sweepLen + 2, CTA_T.sweep + CTA_T.sweepLen + 8], [1, 0.86, 1], clamp);
  const blink = blinkScale(frame, [CTA_T.blink]);
  const idle = frame > CTA_T.sweep + CTA_T.sweepLen + 10 ? Math.sin((frame - CTA_T.sweepLen - CTA_T.sweep) / 9) * 3 : 0;
  const lookX = frame < CTA_T.sweep + CTA_T.sweepLen ? 0.8 : interpolate(frame, [CTA_T.tap - 10, CTA_T.tap], [0.8, 0.1], clamp);

  const arrowIn = pop(frame, fps, CTA_T.sweep + CTA_T.sweepLen - 4, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.sweep + CTA_T.sweepLen + 8 ? Math.max(0, Math.sin((frame - CTA_T.sweep - CTA_T.sweepLen - 8) / 4)) * 8 : 0;

  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 20,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.08,
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
                      color: li === lines.length - 1 ? p.blueSoft : p.white,
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

      <Stage offsetY={L.tall ? 110 : 150}>
        {/* dust puffs behind the broom */}
        {PUFFS.map((d, i) => {
          const t = interpolate(frame, [CTA_T.sweep + d, CTA_T.sweep + d + 16], [0, 1], clamp);
          if (t <= 0 || t >= 1) return null;
          const x0 = interpolate(Math.min(1, (d + 2) / CTA_T.sweepLen), [0, 1], [-PILL_W, PILL_END]) - (PILL_W * PILL_SCALE) / 2 - 92;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x0 - 40 - t * 40,
                top: FLOOR - 40 - t * 50 - (i % 2) * 20,
                width: 60 + t * 50,
                height: 60 + t * 50,
                borderRadius: "50%",
                background: p.blueSoft,
                opacity: (1 - t) * 0.5,
              }}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: pillX - 400,
            width: 800,
            top: FLOOR - CTA_H * PILL_SCALE + 6,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${PILL_SCALE * tap}) rotate(${sweeping ? -2 : 0}deg)`,
            transformOrigin: "50% 100%",
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

        <Broom x={headX} y={FLOOR + 4} angle={broomAngle} stick={p.blueSoft} head={p.blueText} bristle={p.yellow} scale={0.72} />

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={settle}
          look={{ x: lookX, y: 0.1 }}
          style={{
            position: "absolute",
            left: buddyX - BUDDY / 2,
            top: FLOOR + 4 - BUDDY * BUDDY_RATIO + hop + idle,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: FLOOR + 90,
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
            top: FLOOR + 250,
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
