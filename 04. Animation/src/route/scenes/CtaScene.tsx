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
import type { RouteProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  button: 16,
  road: 20, // a road with one parking bay slides in under the button
  drive: 26, // Buddy drives in from the left...
  driveLen: 20,
  park: 46, // ...and brakes into the bay
  sign: 50, // "P" sign pops
  subline: 40,
  logo: 50,
  blink: 70,
  tap: 84,
};

const BUDDY = 150;
const ROAD_Y = 330;
const ROAD_H = 130;
const FEET = ROAD_Y + ROAD_H - 26;

export const CtaScene: React.FC<{ props: RouteProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  const road = interpolate(frame, [CTA_T.road, CTA_T.road + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bx = interpolate(frame, [CTA_T.drive, CTA_T.park], [-160, 540], { ...clamp, easing: Easing.out(Easing.cubic) });
  // Leans forward while driving, rocks back when braking.
  const lean = interpolate(frame, [CTA_T.drive, CTA_T.park - 6, CTA_T.park, CTA_T.park + 6, CTA_T.park + 12], [6, 6, -7, 2, 0], clamp);
  const squash = interpolate(frame, [CTA_T.park - 2, CTA_T.park + 3, CTA_T.park + 9, CTA_T.park + 14], [1, 0.84, 1.06, 1], clamp);
  const blink = blinkScale(frame, [CTA_T.blink]);
  const look = frame < CTA_T.park + 8 ? { x: 1, y: 0 } : { x: 0, y: 0.2 };
  const sign = pop(frame, fps, CTA_T.sign, springs.bouncy);

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
          fontSize: L.headlineSize * 1.05,
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

      <Stage offsetY={70}>
        {/* Button */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 110,
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

        {/* Road with one parking bay */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1080,
            top: ROAD_Y,
            height: ROAD_H,
            background: "#1d4cff",
            opacity: road,
            transform: `scaleX(${road})`,
          }}
        >
          <svg width={1080} height={ROAD_H} style={{ position: "absolute", inset: 0 }}>
            {/* parking bay */}
            <path
              d={`M${540 - 120} 14 V${ROAD_H - 14} H${540 + 120} V14`}
              fill="none"
              stroke={p.white}
              strokeWidth={6}
              strokeDasharray="18 12"
              opacity={0.9}
            />
          </svg>
        </div>

        {/* P sign */}
        <div
          style={{
            position: "absolute",
            left: 540 + 150,
            top: ROAD_Y - 64,
            width: 64,
            height: 64,
            borderRadius: 16,
            background: p.white,
            color: p.blue,
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 48,
            lineHeight: "64px",
            textAlign: "center",
            transform: `scale(${sign})`,
            transformOrigin: "50% 100%",
            opacity: frame >= CTA_T.sign ? 1 : 0,
          }}
        >
          P
        </div>

        {/* Buddy drives in and parks */}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            transform: `rotate(${lean}deg)`,
            transformOrigin: "50% 100%",
            opacity: frame >= CTA_T.drive ? 1 : 0,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 510,
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
            top: 650,
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
