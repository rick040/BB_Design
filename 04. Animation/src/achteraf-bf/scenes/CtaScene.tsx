import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CtaPill } from "../../components/CtaPill";
import { Parcel, PARCEL_RATIO } from "../../components/Parcel";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import type { AchterafProps } from "../schema";

// Timeline (frames, scene-local). The first ~12 frames overlap the transition.
export const CTA_T = {
  box: -6, // a parcel sits in the middle
  open: 4, // flaps swing open
  buddy: 8, // Buddy pops up out of the parcel
  wordmark: 6,
  button: 12,
  blink: 30,
};

const BOX_W = 320;
const BOX_TOP = 200;
const BUDDY = 200;

export const CtaScene: React.FC<{ props: AchterafProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const boxIn = pop(frame, fps, CTA_T.box, springs.pop);
  const open = interpolate(frame, [CTA_T.open, CTA_T.open + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const rise = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const boxBottom = BOX_TOP + BOX_W * PARCEL_RATIO;
  const feet = interpolate(rise, [0, 1], [boxBottom - 4, BOX_TOP + 60]);
  const squash = interpolate(rise, [0, 0.5, 1], [0.8, 1.12, 1]);
  const wm = pop(frame, fps, CTA_T.wordmark, springs.smooth);
  const btn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrow = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  return (
    <SceneBg color={p.blue}>
      <Stage offsetY={-20}>
        {/* Buddy is drawn first, the parcel front covers his lower half */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: boxBottom - 2, overflow: "hidden" }}>
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blinkScale(frame, [CTA_T.blink])}
            look={{ x: 0, y: 0.3 }}
            squash={squash}
            style={{ position: "absolute", left: 540 - BUDDY / 2, top: feet - BUDDY * BUDDY_RATIO }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 540 - BOX_W / 2,
            top: BOX_TOP,
            transform: `scale(${boxIn})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Parcel width={BOX_W} body={p.blueSoft} tape={p.white} edge="rgba(255,255,255,0.35)" open={open} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
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
            top: 650,
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
