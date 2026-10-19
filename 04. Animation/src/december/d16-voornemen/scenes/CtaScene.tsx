import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { CTA_H, CtaPill } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { Wordmark } from "../../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { useLayout } from "../../../lib/layout";
import { usePalette } from "../../../lib/palette";
import { DHeadline } from "../../text";
import { decFonts } from "../../theme";
import { GoalCard, goalCardHeight, GoalRow } from "../GoalRow";
import type { VoornemenProps } from "../schema";

// Beats (frames, scene-lokaal).
export const CTA_T = {
  tagline: 6,
  tagStagger: 4,
  card: 14, // balk "Rekeningen op tijd", al op 100 %
  check: 22,
  buddy: 20, // Buddy leunt tegen de kaart
  button: 36,
  subline: 48,
  logo: 58,
  tap: 82,
};

const BUDDY = 200;

export const CtaScene: React.FC<{ props: VoornemenProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const cardIn = pop(frame, fps, CTA_T.card, springs.smooth);
  const check = interpolate(frame, [CTA_T.check, CTA_T.check + 12], [0, 1], clamp);
  const buddyIn = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const lean = interpolate(buddyIn, [0, 1], [0, -7]);
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const idle = frame > CTA_T.button + 10 ? Math.sin((frame - CTA_T.button) / 9) * 3 : 0;

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.tagline} color={p.white} delay={CTA_T.tagline} stagger={CTA_T.tagStagger} sizeFactor={L.tall ? 0.9 : 1.05} />
      <Stage offsetY={30}>
        <GoalCard
          width={900}
          k={1.1}
          style={{
            position: "absolute",
            left: 90,
            top: 20,
            zIndex: 2,
            opacity: Math.min(1, cardIn * 2),
            transform: `translateY(${(1 - cardIn) * 40}px)`,
          }}
        >
          <GoalRow label={props.goalLabel} shown={100} fill={100} width={900 - 80 * 1.1} k={1.1} check={check} />
        </GoalCard>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={frame > CTA_T.buddy + 14 ? Math.min(blinkScale(frame, [50, 100]), 1) * 0.3 + 0.0 : 1}
          squash={0.6 + 0.4 * Math.min(1, buddyIn)}
          look={{ x: -0.6, y: 0.1 }}
          style={{
            position: "absolute",
            left: 740,
            top: 20 + goalCardHeight(1, 1.1) + 200 - BUDDY * BUDDY_RATIO + idle,
            opacity: Math.min(1, buddyIn * 3),
            transform: `rotate(${lean}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 450,
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
            top: 640,
            textAlign: "center",
            fontFamily: decFonts.text,
            fontWeight: 500,
            fontSize: 42,
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
            top: 770,
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
