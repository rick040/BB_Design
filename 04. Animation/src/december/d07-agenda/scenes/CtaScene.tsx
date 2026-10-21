import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { CTA_H, CtaPill } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { Wordmark } from "../../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import type { AgendaProps } from "../schema";
import { CARD, CARD_H, COL_W, WeekCard } from "../WeekCard";

// Beats (frames, scene-lokaal).
export const CTA_T = {
  headline: 4,
  button: 10,
  split: 16, // de agenda schuift uit elkaar
  splitLen: 22,
  buddy: 34, // Buddy komt in de open plek omhoog
  subline: 46,
  logo: 52,
  blink: 62,
  tap: 92,
};

const SCALE = 0.64;
const GAP = 280;
const TOP = 250; // bovenkant van de kaart in Stage-coördinaten
const BUDDY = 230;
// De agenda splitst tussen kolom 4 en 5 (zo wordt geen gebeurtenis doorgesneden).
const CUT = (CARD.pad + 4 * COL_W) / CARD.w;

export const CtaScene: React.FC<{ props: AgendaProps["cta"]; week: AgendaProps["week"] }> = ({ props, week }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  const split = interpolate(frame, [CTA_T.split, CTA_T.split + CTA_T.splitLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const shift = (GAP / 2) * split;
  const cardLeft = 540 - (CARD.w * SCALE) / 2;
  const boundaryX = cardLeft + CARD.w * SCALE * CUT;

  const buddyIn = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const idle = frame > CTA_T.buddy + 24 ? Math.sin((frame - CTA_T.buddy) / 9) * 4 : 0;
  const blink = blinkScale(frame, [CTA_T.blink]);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const cardBottom = TOP + CARD_H * SCALE;

  const half = (side: "left" | "right") => {
    const clip =
      side === "left"
        ? `inset(0 ${(1 - CUT) * 100}% 0 0 round 44px 22px 22px 44px)`
        : `inset(0 0 0 ${CUT * 100}% round 22px 44px 44px 22px)`;
    return (
      <div
        style={{
          position: "absolute",
          left: cardLeft,
          top: TOP,
          width: CARD.w,
          height: CARD_H,
          transform: `translateX(${side === "left" ? -shift : shift}px) scale(${SCALE})`,
          transformOrigin: "0% 0%",
          filter: "drop-shadow(0 24px 30px rgba(0, 20, 120, 0.35))",
        }}
      >
        <div style={{ position: "absolute", inset: 0, clipPath: clip }}>
          <WeekCard week={week} eventOn={() => 1} showPusher allDay={{ flag7: 1, flag2: 1 }} style={{ left: 0, top: 0 }} />
        </div>
      </div>
    );
  };

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={p.white} delay={CTA_T.headline} stagger={3} />

      <Stage offsetY={20}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 40,
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

        {half("left")}
        {half("right")}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          look={{ x: 0, y: 0.1 }}
          style={{
            position: "absolute",
            left: boundaryX - BUDDY / 2,
            top: cardBottom - BUDDY * BUDDY_RATIO - 6 + idle + (1 - buddyIn) * 180,
            opacity: Math.min(1, buddyIn * 3),
            zIndex: 5,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: cardBottom + 28,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={78} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>

      <DSubline text={props.subline} color={p.blueText} delay={CTA_T.subline} />
    </SceneBg>
  );
};
