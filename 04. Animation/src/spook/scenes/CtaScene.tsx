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
import { GhostSheet, SHEET_H, SHEET_W, useNight } from "../components/Spook";
import type { SpookProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  ghostIn: 12, // a ghost floats down: it is Buddy under a sheet
  boo: 22, // "boe!"
  button: 26,
  subline: 38,
  unmask: 50, // the sheet whips off: just Buddy
  unmaskLen: 14,
  blink: 62,
  logo: 46,
  tap: 82,
};

const BUDDY = 190;
const BUDDY_FEET = 262;

export const CtaScene: React.FC<{ props: SpookProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  // Tagline: first line white, the rest soft blue; words pop one by one.
  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const n = useNight();
  const ghostIn = pop(frame, fps, CTA_T.ghostIn, springs.smooth);
  const bob = Math.sin(frame / 6) * 10;
  const off = interpolate(frame, [CTA_T.unmask, CTA_T.unmask + CTA_T.unmaskLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const unmasked = frame >= CTA_T.unmask;
  const boo = pop(frame, fps, CTA_T.boo, springs.bouncy);
  const booOut = interpolate(frame, [CTA_T.unmask - 4, CTA_T.unmask + 2], [1, 0], clamp);
  const squash = unmasked
    ? interpolate(frame, [CTA_T.unmask, CTA_T.unmask + 4, CTA_T.unmask + 10, CTA_T.unmask + 16], [1, 1.12, 0.9, 1], clamp)
    : 1;
  const blink = blinkScale(frame, [CTA_T.blink]);
  // While hidden, Buddy floats with the sheet; once it is off he settles on the ground.
  const float = unmasked ? interpolate(frame, [CTA_T.unmask, CTA_T.unmask + 8], [bob - 20, 0], clamp) : bob - 20;
  const idle = frame > CTA_T.unmask + 16 ? Math.sin((frame - CTA_T.unmask - 16) / 8) * 4 : 0;
  const buddyY = BUDDY_FEET - BUDDY * BUDDY_RATIO + float + idle - (1 - ghostIn) * 90;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

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
          fontSize: L.headlineSize * 1.08,
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

      <Stage offsetY={60}>
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
            top: buddyY,
            opacity: unmasked ? 1 : 0,
            transformOrigin: "50% 100%",
          }}
        />
        {off < 1 ? (
          <GhostSheet
            color={p.white}
            holes={n.room}
            style={{
              left: 540 - SHEET_W / 2,
              top: BUDDY_FEET - SHEET_H + 30 + float - (1 - ghostIn) * 90 - off * 420,
              opacity: Math.min(1, ghostIn * 2) * (1 - off),
              transform: `rotate(${off * 24 + Math.sin(frame / 6) * 3}deg) scale(${0.82 + off * 0.2})`,
              transformOrigin: "50% 100%",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 540 + 120,
            top: BUDDY_FEET - 300,
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 64,
            letterSpacing: "-0.03em",
            color: p.blueSoft,
            opacity: frame >= CTA_T.boo ? Math.min(1, boo * 2) * booOut : 0,
            transform: `rotate(-8deg) scale(${0.6 + 0.4 * boo}) skewX(-10deg)`,
          }}
        >
          {props.boo}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
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
