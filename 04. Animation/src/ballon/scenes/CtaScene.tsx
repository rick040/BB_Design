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
import { Balloon, balloonKnot, BalloonString, StringLayer } from "../components/Balloon";
import type { BallonProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 0,
  tagStagger: 4,
  buddyIn: 8, // Buddy pops up holding a bunch of balloons
  balloons: 12,
  balloonStagger: 4,
  button: 20,
  subline: 32,
  logo: 40,
  blink: 38,
  float: 60, // the bunch lifts Buddy gently off the ground, happy eyes
  tap: 80,
};

const BUDDY = 150;
const FEET = 290;
const BAL_W = 150;
const BUNCH = [
  { x: 400, y: 70 },
  { x: 540, y: 20 },
  { x: 680, y: 70 },
];

export const CtaScene: React.FC<{ props: BallonProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const floatT = interpolate(frame, [CTA_T.float, CTA_T.float + 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const hover = floatT * (26 + Math.sin((frame - CTA_T.float) / 9) * 6);
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (frame >= CTA_T.float) squash = interpolate(frame, [CTA_T.float, CTA_T.float + 6, CTA_T.float + 14], [1, 1.1, 1.03], clamp);
  const blink = frame >= CTA_T.float + 6 ? interpolate(frame, [CTA_T.float + 6, CTA_T.float + 10], [1, 0.18], clamp) : blinkScale(frame, [CTA_T.blink]);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  const buddyTop = FEET - BUDDY * BUDDY_RATIO * squash - hover;
  const hold = { x: 540, y: buddyTop + 10 };
  const colors = [
    { bg: p.blueSoft, fg: p.blue },
    { bg: p.white, fg: p.blue },
    { bg: p.teal, fg: p.ink },
  ];

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
          fontSize: L.headlineSize * 1.0,
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

      <Stage offsetY={100}>
        {BUNCH.map((b, i) => {
          const s = pop(frame, fps, CTA_T.balloons + i * CTA_T.balloonStagger, { damping: 10, stiffness: 150 });
          const by = b.y + Math.sin((frame + i * 11) / (10 + i)) * 6 - hover;
          const knot = balloonKnot(b.x, by, BAL_W);
          return (
            <React.Fragment key={i}>
              <StringLayer>
                <BalloonString from={knot} to={hold} color={p.blueSoft} width={4} opacity={Math.min(1, s * 3)} bend={(b.x - 540) * 0.1} />
              </StringLayer>
              <Balloon
                cx={b.x}
                cy={by}
                w={BAL_W}
                color={colors[i].bg}
                textColor={colors[i].fg}
                label={props.balloons[i]}
                labelSize={30}
                scale={s}
                rotate={(b.x - 540) * 0.03 + Math.sin((frame + i * 7) / 12) * 3}
              />
            </React.Fragment>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: 0, y: 0.2 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO - hover,
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
            top: 350,
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
            top: 540,
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
            top: 700,
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
