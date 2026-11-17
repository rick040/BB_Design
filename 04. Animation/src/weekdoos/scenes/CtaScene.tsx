import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BOX_H, BOX_W, LID_H, PillBox } from "../components/PillBox";
import { SCENE_STARTS, VOICE_END, type WeekdoosProps, wordAt } from "../schema";

const S = SCENE_STARTS[3];
// Buddy drops onto the closed box and sits on it like an extra lid.
export const CTA_T = {
  buddyDrop: S + 2,
  buddyLand: S + 12,
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 8,
  subline: wordAt("activeer") + 14,
  tap: VOICE_END - 2,
};

const BOX_SCALE = 0.5;
const BOX_BOTTOM = 330;
const BUDDY = 140;
const SEAT = BOX_BOTTOM - (BOX_H + LID_H) * BOX_SCALE + 4;

export const CtaScene: React.FC<{ props: WeekdoosProps["cta"]; notas: WeekdoosProps["notas"] }> = ({
  props,
  notas,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = CTA_T;

  const fall = interpolate(frame, [T.buddyDrop, T.buddyLand], [0, 1], { ...clamp, easing: (t) => t * t });
  const squash = interpolate(frame, [T.buddyLand, T.buddyLand + 3, T.buddyLand + 10], [1, 0.72, 1], clamp);
  const btnIn = pop(frame, fps, T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, T.button + 6, springs.pop);
  const tap = interpolate(frame, [T.tap, T.tap + 3, T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, T.subline, springs.smooth);
  const logoIn = pop(frame, fps, T.logo, springs.smooth);
  const ones = notas.map(() => 1);
  const zeros = notas.map(() => 0);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.tagline} color={p.white} delay={S - 2} stagger={3} sizeFactor={1.15} />
      <Stage offsetY={40}>
        <PillBox
          slots={notas.map((n) => n.slot)}
          open={zeros}
          filled={ones}
          checked={ones}
          scale={BOX_SCALE}
          lidColor={p.white}
          checkColor={p.blue}
          style={{ left: (1080 - BOX_W) / 2, top: BOX_BOTTOM - (BOX_H + LID_H) }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          blink={frame > T.buddyLand + 20 ? 0.2 : blinkScale(frame, [T.buddyLand + 4])}
          look={{ x: 0, y: 0.5 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: SEAT - BUDDY * BUDDY_RATIO - (1 - fall) * 700,
            transformOrigin: "50% 100%",
            opacity: frame < T.buddyDrop ? 0 : 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 420,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap})`,
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
