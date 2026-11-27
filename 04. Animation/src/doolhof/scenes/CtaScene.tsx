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
import { type DoolhofProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

// Scene 4: Buddy at the start of one straight line that runs into the button.
const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S - 4,
  button: wordAt("activeer"),
  line: wordAt("activeer") + 4, // the straight line draws from Buddy to the button
  logo: wordAt("activeer") + 10,
  subline: wordAt("activeer") + 14,
  tap: VOICE_END + 2,
};

const LINE_Y = 470;
const BUDDY = 170;
const BUDDY_X = 150;
const BTN_SCALE = 1.1;
const BTN_LEFT = 330;

export const CtaScene: React.FC<{ props: DoolhofProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, S - 2, springs.bouncy);
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const lineU = interpolate(frame, [CTA_T.line, CTA_T.line + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const lean = interpolate(frame, [CTA_T.line, CTA_T.line + 6, CTA_T.line + 14], [1, 0.88, 1.04], clamp);
  const lineStart = BUDDY_X + BUDDY / 2 + 20;
  const lineEnd = BTN_LEFT + 6;

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
          fontSize: L.headlineSize * 1.12,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, CTA_T.tagline + wi++ * 3, springs.pop);
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

      <Stage offsetY={30}>
        {/* the straight line */}
        <div
          style={{
            position: "absolute",
            left: lineStart,
            top: LINE_Y - 5,
            width: (lineEnd - lineStart) * lineU,
            height: 10,
            backgroundImage: `linear-gradient(90deg, ${p.blueSoft} 55%, transparent 55%)`,
            backgroundSize: "34px 100%",
          }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={frame < S + 10 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : lean}
          blink={blinkScale(frame, [CTA_T.line + 20])}
          look={{ x: frame >= CTA_T.button ? 1 : 0.2, y: 0.1 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: LINE_Y + BUDDY * BUDDY_RATIO * 0.5 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: BTN_LEFT,
            top: LINE_Y - (CTA_H * BTN_SCALE) / 2,
            transform: `scale(${BTN_SCALE * btnIn * tap})`,
            transformOrigin: "0 50%",
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
            top: 610,
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
            top: 730,
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
