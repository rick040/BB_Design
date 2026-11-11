import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Coin, Piggy, SLOT } from "../components/Piggy";
import { SCENE_STARTS, type SpaarpotProps, VOICE_END, wordAt } from "../schema";

// "Drie euro negenenveertig per maand. Activeer Buddy."
// Buddy flips one coin into the piggy: that is all it costs.
const S = SCENE_STARTS[3];
export const CTA_T = {
  price: S,
  per: wordAt("per"),
  flip: wordAt("per") - 4,
  drop: wordAt("maand") + 12,
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 8,
  subline: wordAt("activeer") + 12,
  tap: VOICE_END - 2,
};

const PIG_S = 0.55;
const PIG = { x: 600, y: 300 };
const SLOT_POS = { x: PIG.x + SLOT.x * PIG_S, y: PIG.y + SLOT.y * PIG_S };
const BUDDY = 150;
const BUDDY_X = 360;
const FEET = 470;

export const CtaScene: React.FC<{ props: SpaarpotProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const priceIn = pop(frame, fps, CTA_T.price - 2, springs.pop);
  const perIn = pop(frame, fps, CTA_T.per, springs.smooth);
  const stageIn = pop(frame, fps, S, springs.bouncy);

  // Coin arc from Buddy's head into the slot.
  const u = interpolate(frame, [CTA_T.flip, CTA_T.drop], [0, 1], clamp);
  const start = { x: BUDDY_X + 30, y: FEET - BUDDY * BUDDY_RATIO - 20 };
  const cx = interpolate(u, [0, 1], [start.x, SLOT_POS.x]);
  const cy = interpolate(u, [0, 1], [start.y, SLOT_POS.y - 20]) - Math.sin(Math.PI * u) * 260;
  const coinVisible = frame < CTA_T.drop;
  const flipSq = interpolate(frame, [CTA_T.flip - 5, CTA_T.flip, CTA_T.flip + 6], [1, 0.8, 1.06], clamp);
  const pigBump = interpolate(frame, [CTA_T.drop, CTA_T.drop + 4, CTA_T.drop + 12], [1, 1.08, 1], clamp);
  const happy = frame > CTA_T.drop + 2 ? 0.2 : blinkScale(frame, [S + 20]);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 20,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.display,
          letterSpacing: headlineTracking,
        }}
      >
        <div
          style={{
            fontSize: 230,
            fontWeight: 500,
            lineHeight: 1,
            color: p.white,
            transform: `scale(${0.6 + 0.4 * priceIn})`,
            opacity: Math.min(1, priceIn * 1.5),
          }}
        >
          {props.price}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 500,
            color: p.blueSoft,
            marginTop: 6,
            opacity: perIn,
            transform: `translateY(${(1 - perIn) * 20}px)`,
          }}
        >
          {props.per}
        </div>
      </div>

      <Stage offsetY={60}>
        <div
          style={{
            position: "absolute",
            left: PIG.x,
            top: PIG.y,
            transform: `scale(${PIG_S * pigBump * stageIn})`,
            transformOrigin: "0 0",
          }}
        >
          <Piggy body={p.white} shade={p.blueSoft} slot={p.blue} />
        </div>
        {coinVisible ? (
          <div
            style={{
              position: "absolute",
              left: cx - 35,
              top: cy - 35,
              opacity: frame >= CTA_T.flip - 6 ? 1 : 0,
            }}
          >
            <Coin size={70} color={p.yellow} edge="#e0a800" spin={u * 12} />
          </div>
        ) : null}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={happy}
          squash={frame < S + 10 ? 0.6 + 0.4 * stageIn : flipSq}
          look={frame >= CTA_T.flip ? { x: 0.9, y: -0.3 } : { x: 0.2, y: -0.8 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            transformOrigin: "50% 100%",
            transform: `scale(${stageIn})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 540,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.25 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <CtaPill text={props.button} arrowIn={arrowIn} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 540 + CTA_H + 50,
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
            top: 790,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={90} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
