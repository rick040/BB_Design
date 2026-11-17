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
import { PaperHat, PaperPlane } from "../components/Paper";
import { SCENE_STARTS, type VliegtuigProps, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S - 6, // tagline words pop in
  taglineStagger: 3,
  button: wordAt("activeer") + 2,
  planeIn: S + 2, // the plane flies in and folds into a hat
  hat: S + 18,
  logo: wordAt("buddy", 2) - 4,
  subline: wordAt("buddy", 2) + 6,
  tap: VOICE_END + 4,
};

const BUDDY = 170;
const FEET = 300;
const HEAD = FEET - BUDDY * BUDDY_RATIO;

export const CtaScene: React.FC<{ props: VliegtuigProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const ink = p.red;

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, S - 2, springs.bouncy);
  const u = interpolate(frame, [CTA_T.planeIn, CTA_T.hat], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const hatOn = frame >= CTA_T.hat;
  const hatK = pop(frame, fps, CTA_T.hat, springs.bouncy);
  const plane = { x: -200 + (540 + 200) * u, y: HEAD - 40 - 160 * Math.sin(Math.PI * u) };
  const hatSq = interpolate(frame, [CTA_T.hat, CTA_T.hat + 3, CTA_T.hat + 10], [1, 0.82, 1], clamp);
  const squash = frame < S + 10 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : hatSq;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  // happy eyes once the hat sits
  const blink = hatOn && frame > CTA_T.hat + 8 && frame < CTA_T.hat + 26 ? 0.18 : blinkScale(frame, [CTA_T.tap + 6]);

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
              const s = pop(frame, fps, CTA_T.tagline + wi++ * CTA_T.taglineStagger, springs.pop);
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
        <div
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: HEAD,
            width: BUDDY,
            height: BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Buddy size={BUDDY} body={p.white} eye={p.blueMascot} blink={blink} squash={squash} look={hatOn ? { x: 0, y: -0.6 } : { x: -0.6, y: -0.5 }} />
          {hatOn ? (
            <div
              style={{
                position: "absolute",
                left: BUDDY / 2 - 70 - 6,
                top: -58 + (1 - squash) * BUDDY * 0.9,
                transform: `rotate(-8deg) scale(${0.6 + 0.4 * hatK})`,
                transformOrigin: "50% 100%",
              }}
            >
              <PaperHat size={130} fill={p.white} line={ink} />
            </div>
          ) : null}
        </div>
        {!hatOn && frame >= CTA_T.planeIn ? (
          <div style={{ position: "absolute", left: plane.x - 70, top: plane.y - 40, transform: `rotate(${12 - 20 * u}deg)` }}>
            <PaperPlane size={140} fill={p.white} line={ink} />
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 360,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} />
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
            top: 550,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueText,
            opacity: subIn,
          }}
        >
          {props.subline}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 670,
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
