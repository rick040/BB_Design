import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SceneBg, Stage } from "../components/Stage";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";
import type { EndCardProps } from "./common";

// Beats (frames, scene-local).
export const END_T = {
  wordmark: 2, // brand on screen right at the start of the card
  buddy: 6,
  line: 8,
  button: 14,
  small: 24,
  blink: 34,
  tap: 46,
};

const BUDDY = 150;

/** Shared brand end card: Buddy on the wordmark, CTA pill, small print. */
export const EndCard: React.FC<{ props: EndCardProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const blue = props.bg === "blue";
  const fg = blue ? p.white : p.blue;

  const wm = pop(frame, fps, END_T.wordmark, springs.smooth);
  const bIn = pop(frame, fps, END_T.buddy, springs.bouncy);
  const lineIn = pop(frame, fps, END_T.line, springs.pop);
  const btn = pop(frame, fps, END_T.button, springs.bouncy);
  const arrow = pop(frame, fps, END_T.button + 6, springs.pop);
  const smallIn = interpolate(frame, [END_T.small, END_T.small + 12], [0, 1], clamp);
  const tap = interpolate(frame, [END_T.tap, END_T.tap + 3, END_T.tap + 9], [1, 0.94, 1], clamp);
  const ripple = interpolate(frame, [END_T.tap + 1, END_T.tap + 18], [0, 1], clamp);
  // Buddy drops onto the "y" of the wordmark and settles with a squash.
  const drop = interpolate(bIn, [0, 1], [-160, 0]);
  const squash = interpolate(bIn, [0, 0.55, 0.8, 1], [1.15, 0.8, 1.06, 1]);
  const idle = frame > END_T.tap + 10 ? Math.sin((frame - END_T.tap - 10) / 7) * 3 : 0;

  return (
    <SceneBg color={blue ? p.blue : p.light}>
      {props.line ? (
        <div
          style={{
            position: "absolute",
            top: L.safeTop + 10,
            left: L.sidePadding,
            right: L.sidePadding,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: L.headlineSize * 0.82,
            lineHeight: 1.02,
            letterSpacing: headlineTracking,
            color: fg,
            textWrap: "balance",
            opacity: Math.min(1, lineIn * 1.4),
            transform: `translateY(${(1 - lineIn) * 30}px)`,
          }}
        >
          {props.line}
        </div>
      ) : null}

      <Stage offsetY={70}>
        {/* wordmark + Buddy standing on it */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 250,
            display: "flex",
            justifyContent: "center",
            opacity: wm,
            transform: `translateY(${(1 - wm) * 30}px)`,
          }}
        >
          <Wordmark size={128} betaal={blue ? p.blueSoft : p.blueSoft} buddy={fg} />
        </div>
        <Buddy
          size={BUDDY}
          body={blue ? p.white : p.blueMascot}
          eye={blue ? p.blueMascot : p.white}
          blink={blinkScale(frame, [END_T.blink])}
          squash={squash}
          look={{ x: -0.2, y: 0.35 }}
          style={{
            position: "absolute",
            left: 760 - BUDDY / 2,
            top: 262 - BUDDY * BUDDY_RATIO + drop + idle,
            opacity: Math.min(1, bIn * 3),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.2 * btn * tap})`,
            opacity: Math.min(1, btn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrow} outline={!blue} />
            <div
              style={{
                position: "absolute",
                left: CTA_H / 2 - 80,
                top: CTA_H / 2 - 80,
                width: 160,
                height: 160,
                borderRadius: "50%",
                border: `5px solid ${blue ? p.white : p.blue}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.2})`,
              }}
            />
          </div>
        </div>

        {props.small ? (
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 660,
              textAlign: "center",
              fontFamily: fonts.display,
              fontSize: 42,
              color: blue ? p.blueText : p.blueDim,
              opacity: smallIn,
            }}
          >
            {props.small}
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
