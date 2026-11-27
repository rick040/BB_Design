import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { TwaalfProps } from "../schema";

// Timeline (frames, scene-local). The first ~12 frames overlap the transition.
export const CTA_T = {
  buddy: -4, // Buddy stands next to the bill that stayed small
  chip: 2,
  wordmark: 4,
  button: 10,
  blink: 28,
};

const BUDDY = 170;

export const CtaScene: React.FC<{ props: TwaalfProps["cta"]; bill: TwaalfProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const b = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const chip = pop(frame, fps, CTA_T.chip, springs.bouncy);
  const wm = pop(frame, fps, CTA_T.wordmark, springs.smooth);
  const btn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrow = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  return (
    <SceneBg color={p.blue}>
      <Stage offsetY={-10}>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.blink])}
          look={{ x: 0.7, y: 0.1 }}
          squash={0.8 + 0.2 * b}
          style={{
            position: "absolute",
            left: 250,
            top: 320 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, b * 3),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 450,
            top: 190,
            height: 120,
            padding: "0 30px 0 40px",
            borderRadius: 60,
            background: p.white,
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 76,
            letterSpacing: "-0.04em",
            color: p.blue,
            transform: `scale(${chip})`,
            transformOrigin: "0% 50%",
          }}
        >
          {bill.amount}
          <Checkmark size={56} color={p.blue} progress={chip} strokeWidth={16} />
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
