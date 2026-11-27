import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CtaPill } from "../../components/CtaPill";
import { Key } from "../../components/Key";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import type { EigenHuisProps } from "../schema";

// Timeline (frames, scene-local). The first ~12 frames overlap the transition.
export const CTA_T = {
  drop: 0, // the house key drops from above…
  land: 14, // …and lands on Buddy's head (squash), then wobbles
  wordmark: 6,
  button: 14,
  blink: 40,
};

const BUDDY = 190;
const FEET = 330;
const KEY_W = 200;

export const CtaScene: React.FC<{ props: EigenHuisProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const buddyIn = pop(frame, fps, -8, springs.bouncy);
  const buddyTop = FEET - BUDDY * BUDDY_RATIO;
  const fall = interpolate(frame, [CTA_T.drop, CTA_T.land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const keyY = interpolate(fall, [0, 1], [-260, buddyTop - KEY_W * 0.42 + 8]);
  const t = frame - CTA_T.land;
  const wobble = t > 0 ? Math.sin(t / 2.2) * 14 * Math.max(0, 1 - t / 30) : 0;
  const squash = interpolate(frame, [CTA_T.land - 1, CTA_T.land + 2, CTA_T.land + 7, CTA_T.land + 12], [1, 0.8, 1.06, 1], clamp);
  const wm = pop(frame, fps, CTA_T.wordmark, springs.smooth);
  const btn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrow = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const headDip = frame >= CTA_T.land ? (1 - squash) * BUDDY * BUDDY_RATIO : 0;

  return (
    <SceneBg color={p.blue}>
      <Stage offsetY={-10}>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={frame < CTA_T.land ? 1 : blinkScale(frame, [CTA_T.blink])}
          look={frame < CTA_T.land ? { x: 0, y: -1 } : { x: 0, y: 0.2 }}
          squash={squash}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: buddyTop,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - KEY_W / 2 + 10,
            top: keyY + headDip,
            transformOrigin: "50% 100%",
            transform: `rotate(${(1 - fall) * -40 + wobble}deg)`,
          }}
        >
          <Key width={KEY_W} color={p.red} hole={p.blue} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 420,
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
            top: 610,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btn * 2),
            transform: `scale(${1.3 * btn})`,
          }}
        >
          <CtaPill text={props.button} arrowIn={arrow} arrowNudge={nudge} />
        </div>
      </Stage>
    </SceneBg>
  );
};
