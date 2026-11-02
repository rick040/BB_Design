import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Confetti } from "../components/Confetti";
import { hornAnchor, PartyBuddy, tootCurve, tootSquash } from "../components/PartyBuddy";
import type { VerjaardagProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 4,
  buddyIn: 14, // Buddy pops up left of the button, party hat on
  button: 22,
  subline: 34,
  logo: 44,
  toot: 58, // the horn unrolls right into the arrow circle = the tap
  tootLen: 24,
  tap: 63,
  blink: 92,
};

const BTN_SHIFT = 95; // button sits right of centre to make room for Buddy
const BTN_SCALE = 1.3;
const BTN_TOP = 300;
const BUDDY = { x: 118, feet: 352, size: 172 };

export const CtaScene: React.FC<{ props: VerjaardagProps["cta"]; toot: string }> = ({ props, toot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const unroll = tootCurve(frame, CTA_T.toot, CTA_T.tootLen);
  const squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) * tootSquash(frame, CTA_T.toot, CTA_T.tootLen);
  const blink = blinkScale(frame, [CTA_T.buddyIn + 14, CTA_T.blink]);
  const idle = frame > CTA_T.toot + CTA_T.tootLen ? Math.sin((frame - CTA_T.toot - CTA_T.tootLen) / 8) * 4 : 0;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.tap + 10 ? Math.max(0, Math.sin((frame - CTA_T.tap - 10) / 4)) * 8 : 0;

  // Aim the horn at the arrow circle of the button.
  const pillW = 490; // approx. unscaled pill width for "activeer buddy"
  const circle = {
    x: 540 + BTN_SHIFT - (pillW * BTN_SCALE) / 2 + (CTA_H / 2) * BTN_SCALE,
    y: BTN_TOP + CTA_H / 2,
  };
  const a = hornAnchor(BUDDY.size);
  const dx = circle.x - (BUDDY.x + a.x);
  const dy = circle.y - (BUDDY.feet + a.y);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const hornLen = Math.hypot(dx, dy) - 30;

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
          fontSize: L.headlineSize * 1.15,
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
        <div
          style={{
            position: "absolute",
            left: BTN_SHIFT,
            right: -BTN_SHIFT,
            top: BTN_TOP,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${BTN_SCALE * btnIn * tap})`,
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

        <Confetti frame={frame} start={CTA_T.tap} x={circle.x} y={circle.y} count={34} spread={150} power={30} seed="cta" />

        <PartyBuddy
          x={BUDDY.x}
          feetY={BUDDY.feet + idle}
          size={BUDDY.size}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: 0.9, y: 0.4 }}
          hatTilt={12}
          hornAngle={angle}
          hornLength={hornLen}
          hornUnroll={unroll}
          style={{
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
          }}
        />

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
