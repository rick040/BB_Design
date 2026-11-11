import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { SCENE_STARTS, VOICE_END, type WedstrijdProps, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S - 8,
  taglineStagger: 3,
  button: wordAt("activeer"),
  hopStart: wordAt("activeer") + 4,
  hopLand: wordAt("buddy", 2) + 4,
  logo: wordAt("activeer") + 8,
  subline: wordAt("activeer") + 14,
  tap: VOICE_END - 4,
};

const BUDDY = 170;
const BTN_TOP = 380;
const BTN_SCALE = 1.3;

export const CtaScene: React.FC<{ props: WedstrijdProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.95, 1], clamp);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);

  // Buddy leaps in from the left in one arc and lands on the button like a winner on the podium.
  const hop = interpolate(frame, [CTA_T.hopStart, CTA_T.hopLand], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const podiumY = BTN_TOP + (CTA_H * (1 - BTN_SCALE)) / 2 + 4;
  const x = interpolate(hop, [0, 1], [-260, 540 - BUDDY / 2]);
  const feet = podiumY - Math.sin(hop * Math.PI) * 150;
  const landSq = interpolate(frame, [CTA_T.hopLand, CTA_T.hopLand + 3, CTA_T.hopLand + 10], [1, 0.78, 1], clamp);
  const takeoff = interpolate(frame, [CTA_T.hopStart, CTA_T.hopLand], [1, 1.15], clamp);
  const tapSq = interpolate(frame, [CTA_T.tap - 3, CTA_T.tap, CTA_T.tap + 6], [1, 0.86, 1], clamp);
  const squash = frame < CTA_T.hopLand ? takeoff : Math.min(landSq, tapSq);
  const happy = frame > CTA_T.hopLand + 8;

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

      <Stage offsetY={40}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BTN_TOP,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${BTN_SCALE * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <CtaPill text={props.button} arrowIn={arrowIn} />
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={happy ? 0.2 : 1}
          squash={squash}
          look={frame < CTA_T.hopLand ? { x: 1, y: 0.5 } : { x: 0, y: 0.6 }}
          style={{
            position: "absolute",
            left: x,
            top: feet - BUDDY * BUDDY_RATIO,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 650,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 780,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueText,
            opacity: subIn,
          }}
        >
          {props.subline}
        </div>
      </Stage>
    </SceneBg>
  );
};
