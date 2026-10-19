import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { CTA_H, CtaPill } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { Wordmark } from "../../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { Parcel } from "../Parcel";
import type { PakketjesProps } from "../schema";

// Beats (frames, scene-lokaal).
export const CTA_T = {
  headline: 4,
  stack: 8, // drie nette pakketjes vormen een zitplek
  stackStagger: 5,
  buddyIn: 20, // Buddy hupt op de stapel
  button: 12,
  subline: 38,
  logo: 46,
  blink: 44,
  tap: 74,
};

const BUDDY = 240;
const STACK_TOP = 456; // bovenkant van het bovenste pakketje (Buddy's voeten)

export const CtaScene: React.FC<{ props: PakketjesProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const parcels = [
    { x: 395, y: 668, w: 290, h: 170, body: p.white, tape: p.blueSoft, d: 0 },
    { x: 685, y: 668, w: 290, h: 170, body: p.red, tape: p.blueSoft, d: 1 },
    { x: 540, y: 528, w: 270, h: 150, body: p.blueSoft, tape: p.white, d: 2 },
  ];

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const hop = Math.max(0, 1 - buddyIn) * 220; // valt van boven op de stapel
  const squash = interpolate(buddyIn, [0, 0.55, 0.8, 1], [1.12, 1.12, 0.84, 1], clamp);
  const idle = frame > CTA_T.buddyIn + 22 ? Math.sin((frame - CTA_T.buddyIn) / 8) * 3 : 0;
  const blink = blinkScale(frame, [CTA_T.blink]);
  const look = { x: interpolate(frame, [CTA_T.button, CTA_T.button + 20], [0, -0.1], clamp), y: -0.6 };

  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={p.white} delay={CTA_T.headline} stagger={3} sizeFactor={0.92} />

      <Stage offsetY={40}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 30,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.15 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
            zIndex: 4,
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

        {parcels.map((pc) => {
          const s = pop(frame, fps, CTA_T.stack + pc.d * CTA_T.stackStagger, springs.bouncy);
          return (
            <div
              key={pc.d}
              style={{
                position: "absolute",
                left: pc.x - pc.w / 2,
                top: pc.y - pc.h / 2 - (1 - s) * 500,
                opacity: Math.min(1, s * 3),
              }}
            >
              <Parcel w={pc.w} h={pc.h} color={pc.body} tape={pc.tape} />
            </div>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: STACK_TOP + 6 - BUDDY * BUDDY_RATIO - hop + idle,
            opacity: Math.min(1, buddyIn * 3),
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 790,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={80} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>

      <DSubline text={props.subline} color={p.blueText} delay={CTA_T.subline} />
    </SceneBg>
  );
};
