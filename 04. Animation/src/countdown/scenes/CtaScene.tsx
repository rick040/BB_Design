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
import type { CountdownProps } from "../schema";

const T_TAGLINE = 4;
const TAG_STAGGER = 6;
const T_BUTTON = 22;
const T_BUDDY_DROP = 30;
const T_BUDDY_LAND = 42;
const T_TAP = 60;
const T_SUB = 34;
const T_LOGO = 44;
const BUDDY = 120;

export const CtaScene: React.FC<{ props: CountdownProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  // Tagline: words pop one by one; the very last word is white, the rest soft blue.
  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  const totalWords = lines.reduce((a, l) => a + l.length, 0);
  let wi = 0;

  const btnIn = pop(frame, fps, T_BUTTON, springs.bouncy);
  const arrowIn = pop(frame, fps, T_BUTTON + 6, springs.pop);
  const tap = interpolate(frame, [T_TAP, T_TAP + 3, T_TAP + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T_TAP + 1, T_TAP + 18], [0, 1], clamp);
  const nudge = frame > T_BUTTON + 14 ? Math.max(0, Math.sin((frame - T_BUTTON - 14) / 4)) * 8 : 0;

  // Buddy drops onto the button.
  const fall = interpolate(frame, [T_BUDDY_DROP, T_BUDDY_LAND], [-520, 0], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const squash =
    frame < T_BUDDY_LAND
      ? 1.15
      : interpolate(frame, [T_BUDDY_LAND, T_BUDDY_LAND + 3, T_BUDDY_LAND + 9, T_BUDDY_LAND + 14], [1.15, 0.78, 1.06, 1], clamp);
  const blink = blinkScale(frame, [T_BUDDY_LAND + 20, T_BUDDY_LAND + 44]);
  // The button dips when Buddy lands on it.
  const landDip = interpolate(frame, [T_BUDDY_LAND, T_BUDDY_LAND + 3, T_BUDDY_LAND + 10], [0, 1, 0], clamp);

  const subIn = interpolate(frame, [T_SUB, T_SUB + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, T_LOGO, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      {/* Tagline */}
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.6,
          lineHeight: 0.98,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const idx = wi++;
              const s = pop(frame, fps, T_TAGLINE + idx * TAG_STAGGER, springs.pop);
              const last = idx === totalWords - 1;
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: last ? p.white : p.blueSoft,
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
            left: 0,
            right: 0,
            top: 300,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap}) translateY(${landDip * 6}px)`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} arrowNudge={nudge} />
            {/* Buddy sits on the button */}
            <Buddy
              size={BUDDY}
              body={p.white}
              eye={p.blueMascot}
              squash={squash}
              blink={blink}
              look={{ x: -0.5, y: frame > T_BUDDY_LAND + 8 ? 0.6 : 0 }}
              style={{
                position: "absolute",
                left: "68%",
                top: -BUDDY * BUDDY_RATIO + 4 + fall,
                opacity: frame >= T_BUDDY_DROP ? 1 : 0,
              }}
            />
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
            top: 500,
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
            top: 680,
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
