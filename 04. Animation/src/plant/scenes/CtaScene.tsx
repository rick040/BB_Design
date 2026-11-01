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
import type { PlantProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  pot: 12, // Buddy pops up out of a flower pot
  button: 24,
  sprout: 40, // a sprout grows on Buddy's head
  subline: 36,
  logo: 46,
  blink: 58,
  tap: 76,
};

const BUDDY = 160;
const POT_TOP = 196;

export const CtaScene: React.FC<{ props: PlantProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const potIn = pop(frame, fps, CTA_T.pot, springs.pop);
  const rise = pop(frame, fps, CTA_T.pot + 6, springs.bouncy);
  const sprout = pop(frame, fps, CTA_T.sprout, springs.bouncy);
  const sproutSquash = interpolate(frame, [CTA_T.sprout, CTA_T.sprout + 4, CTA_T.sprout + 10], [1, 1.08, 1], clamp);
  const blink = blinkScale(frame, [CTA_T.blink]);
  const idle = frame > CTA_T.sprout + 12 ? Math.sin((frame - CTA_T.sprout - 12) / 8) * 3 : 0;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  const buddyH = BUDDY * BUDDY_RATIO;
  // Buddy sits in the pot: his lower ~40% is hidden behind the pot front.
  const buddyTop = POT_TOP - buddyH * 0.86 + (1 - rise) * buddyH * 0.7 + idle;

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
          fontSize: L.headlineSize * 1.0,
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

      <Stage offsetY={40}>
        {/* Buddy in a flower pot, a sprout on his head */}
        <div
          style={{
            position: "absolute",
            left: 540 - 130,
            top: 0,
            width: 260,
            height: 300,
            opacity: Math.min(1, potIn * 2),
            transform: `scale(${1.3 * (0.6 + 0.4 * potIn)})`,
            transformOrigin: "50% 100%",
          }}
        >
          {/* Clip Buddy at the pot rim so he really sits inside it */}
          <div style={{ position: "absolute", left: 0, top: -120, width: 260, height: POT_TOP + 120 + 10, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                left: 130 - BUDDY / 2,
                top: buddyTop + 120,
                width: BUDDY,
                height: buddyH,
                transform: `scale(1, ${sproutSquash})`,
                transformOrigin: "50% 100%",
              }}
            >
              {/* Sprout */}
              <svg
                width={120}
                height={110}
                viewBox="0 0 120 110"
                style={{
                  position: "absolute",
                  left: BUDDY * 0.3 - 60,
                  top: -96,
                  overflow: "visible",
                  transform: `scale(${sprout})`,
                  transformOrigin: "50% 100%",
                  opacity: frame >= CTA_T.sprout ? 1 : 0,
                }}
              >
                <path d="M60,110 L60,52" stroke={p.blueSoft} strokeWidth={9} strokeLinecap="round" />
                <path d="M60,60 C40,30 12,34 4,44 C14,64 42,70 60,60 Z" fill={p.blueSoft} />
                <path d="M60,52 C76,16 108,14 116,26 C108,50 80,60 60,52 Z" fill={p.white} />
              </svg>
              <Buddy
                size={BUDDY}
                body={p.white}
                eye={p.blueMascot}
                blink={blink}
                look={{ x: 0, y: 0.2 }}
                style={{ position: "absolute", left: 0, top: 0 }}
              />
            </div>
          </div>
          {/* Pot front */}
          <svg width={260} height={130} viewBox="0 0 260 130" style={{ position: "absolute", left: 0, top: POT_TOP - 20 }}>
            <rect x={10} y={0} width={240} height={40} rx={12} fill={p.blueSoft} />
            <path d="M26,34 L234,34 L210,128 L50,128 Z" fill={p.blueSoft} />
            <rect x={10} y={30} width={240} height={10} fill={p.blueMid} opacity={0.25} />
          </svg>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 350,
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
            top: 540,
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
            top: 700,
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
