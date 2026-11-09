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
import { Die } from "../components/Die";
import type { BordspelProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  buddyIn: 12, // Buddy is already there, die in his hands
  toss: 24, // he tosses the die ...
  tossLen: 18,
  dieLand: 42, // ... it lands on the calendar face: a date, not luck
  button: 34,
  subline: 48,
  logo: 56,
  blink: 62,
  tap: 82,
};

const BUDDY = 190;
const BUDDY_X = 400; // centre
const FEET = 262;
const DIE = 150;
const DIE_REST = { x: 560, y: FEET - DIE };

export const CtaScene: React.FC<{ props: BordspelProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const bIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  // Toss: Buddy squashes and throws; die flies in an arc to its rest spot.
  const tt = interpolate(frame, [CTA_T.toss, CTA_T.toss + CTA_T.tossLen], [0, 1], clamp);
  const dieX = interpolate(tt, [0, 1], [BUDDY_X + 20, DIE_REST.x]);
  const baseY = interpolate(tt, [0, 1], [FEET - DIE - 40, DIE_REST.y]);
  const dieY = baseY - 70 * 4 * tt * (1 - tt);
  const spinning = tt > 0 && tt < 1;
  const face = spinning ? ((Math.floor(frame / 3) * 5) % 6) + 1 : tt >= 1 ? 0 : 6;
  const dieRot = interpolate(tt, [0, 1], [0, 720], { ...clamp, easing: Easing.out(Easing.quad) });
  const land = interpolate(frame, [CTA_T.dieLand, CTA_T.dieLand + 3, CTA_T.dieLand + 10], [1, 0.84, 1], clamp);
  const dieIn = pop(frame, fps, CTA_T.buddyIn + 2, springs.pop);

  let squash = interpolate(bIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (frame >= CTA_T.toss - 6) {
    squash = interpolate(frame, [CTA_T.toss - 6, CTA_T.toss, CTA_T.toss + 5, CTA_T.toss + 12], [1, 0.82, 1.14, 1], clamp);
  }
  const look = tt > 0 ? { x: 0.9, y: interpolate(tt, [0, 0.5, 1], [-0.2, -0.9, 0.3]) } : { x: 0, y: -0.6 };
  const blink = frame >= CTA_T.dieLand + 4 && frame < CTA_T.blink ? 0.18 : blinkScale(frame, [CTA_T.blink]);
  const idle = frame > CTA_T.toss + 16 ? Math.sin((frame - CTA_T.toss - 16) / 8) * 4 : 0;

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
          fontSize: L.headlineSize * 1.15,
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
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + idle,
            opacity: Math.min(1, bIn * 3),
            transform: `scale(${0.4 + 0.6 * bIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <Die
          size={DIE}
          face={face}
          bg={p.white}
          pip={p.blue}
          calHeader={p.blue}
          date={props.dieDate}
          style={{
            left: dieX,
            top: dieY,
            opacity: Math.min(1, dieIn * 3),
            transform: `rotate(${dieRot}deg) scale(${(0.5 + 0.5 * dieIn) * land})`,
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
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
                opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
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
            top: 520,
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
            top: 690,
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
