import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { ZoWerktProps } from "../schema";

// Timeline (frames, scene-local). The first ~12 frames overlap the transition.
// Buddy hops over the three step badges; each turns into a check.
export const CTA_T = {
  hop1: 4,
  hop2: 16,
  hop3: 28,
  hopLen: 10,
  wordmark: 10,
  button: 22,
  subline: 34,
  blink: 50,
};

const STEPS = [340, 540, 740];
const STEP_Y = 230;
const STEP_R = 58;
const BUDDY = 120;

export const CtaScene: React.FC<{ props: ZoWerktProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const hops = [CTA_T.hop1, CTA_T.hop2, CTA_T.hop3];
  // Buddy starts left of step 1, hops onto 1, 2, 3.
  const xs = [160, ...STEPS];
  let bx = xs[0];
  let lift = 0;
  let squash = 1;
  hops.forEach((h, i) => {
    const u = interpolate(frame, [h, h + CTA_T.hopLen], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
    if (frame >= h) {
      bx = xs[i] + (xs[i + 1] - xs[i]) * u;
      lift = Math.sin(Math.PI * u) * 110;
    }
    const land = h + CTA_T.hopLen;
    if (frame >= land && frame <= land + 8) squash = interpolate(frame, [land, land + 3, land + 8], [1, 0.8, 1], clamp);
  });
  const feet = STEP_Y - STEP_R + 6 - lift;
  const wm = pop(frame, fps, CTA_T.wordmark, springs.smooth);
  const btn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrow = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const sub = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <SceneBg color={p.blue}>
      <Stage offsetY={-20}>
        {STEPS.map((x, i) => {
          const done = frame >= hops[i] + CTA_T.hopLen;
          const c = pop(frame, fps, hops[i] + CTA_T.hopLen, springs.bouncy);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - STEP_R,
                top: STEP_Y - STEP_R,
                width: STEP_R * 2,
                height: STEP_R * 2,
                borderRadius: "50%",
                background: done ? p.white : "rgba(255,255,255,0.14)",
                border: `4px solid ${p.white}`,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 60,
                color: p.white,
              }}
            >
              {done ? <Checkmark size={64} color={p.blue} progress={c} strokeWidth={16} /> : i + 1}
            </div>
          );
        })}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.blink])}
          look={{ x: 0.7, y: 0.4 }}
          squash={squash}
          style={{ position: "absolute", left: bx - BUDDY / 2, top: feet - BUDDY * BUDDY_RATIO }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 380,
            display: "flex",
            justifyContent: "center",
            opacity: wm,
            transform: `translateY(${(1 - wm) * 30}px)`,
          }}
        >
          <Wordmark size={124} betaal={p.blueSoft} buddy={p.white} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btn * 2),
            transform: `scale(${1.3 * btn})`,
          }}
        >
          <CtaPill text={props.button} arrowIn={arrow} arrowNudge={nudge} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 740,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 40,
            color: p.blueText,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          {props.subline}
        </div>
      </Stage>
    </SceneBg>
  );
};
