import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { SCENE_STARTS, type WeegschaalProps, VOICE_END, wordAt } from "../schema";

// Scene 5: the sum. "€3,49 < €40", a sum line, and the button as the answer.
// Buddy sits on top of his own price and looks down at the button.
const S = SCENE_STARTS[4];
export const CTA_T = {
  tagline: S - 4,
  taglineStagger: 4,
  left: S,
  buddyHop: S + 6,
  less: wordAt("maar"),
  right: wordAt("uit"),
  lineStart: wordAt("uit") + 4,
  lineLen: 10,
  button: wordAt("activeer") - 4,
  logo: wordAt("buddy", 2) - 2,
  subline: wordAt("buddy", 2) + 4,
  tap: VOICE_END - 2,
};

const ROW_Y = 150;
const LINE_Y = 470;
const BS = 150;

export const CtaScene: React.FC<{ props: WeegschaalProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const leftIn = pop(frame, fps, CTA_T.left, springs.pop);
  const lessIn = pop(frame, fps, CTA_T.less, springs.pop);
  const rightIn = pop(frame, fps, CTA_T.right, springs.pop);
  const line = interpolate(frame, [CTA_T.lineStart, CTA_T.lineStart + CTA_T.lineLen], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const btnIn = pop(frame, fps, CTA_T.button, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const hop = pop(frame, fps, CTA_T.buddyHop, springs.bouncy);

  const num = (txt: string, x: number, s: number, color: string, size = 190) => (
    <div
      style={{
        position: "absolute",
        left: x - 300,
        width: 600,
        top: ROW_Y,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.06em",
        color,
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      {txt}
    </div>
  );
  const label = (txt: string, x: number, s: number) => (
    <div
      style={{
        position: "absolute",
        left: x - 170,
        width: 340,
        top: ROW_Y + 165,
        textAlign: "center",
        fontFamily: fonts.display,
        fontSize: 34,
        lineHeight: 1.15,
        color: p.blueText,
        opacity: s,
      }}
    >
      {txt}
    </div>
  );

  const buddyX = 300;
  // Buddy sits on top of his own price.
  const buddyY = ROW_Y + 10 - BS * BUDDY_RATIO;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.tagline} color={p.white} delay={CTA_T.tagline} stagger={CTA_T.taglineStagger} sizeFactor={1.15} />
      <Stage offsetY={0}>
        {num(props.left, 290, leftIn, p.white, 140)}
        {num("<", 568, lessIn, p.blueSoft, 110)}
        {num(props.right, 810, rightIn, p.blueSoft, 140)}
        {label(props.leftLabel, 290, leftIn)}
        {label(props.rightLabel, 810, rightIn)}
        <Buddy
          size={BS}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [S + 40])}
          look={{ x: frame > CTA_T.button ? 0.3 : 0.9, y: frame > CTA_T.button ? 1 : 0 }}
          squash={interpolate(hop, [0, 0.6, 1], [0.7, 1.1, 1])}
          style={{
            position: "absolute",
            left: buddyX - BS / 2 - 20,
            top: buddyY - (1 - hop) * 200,
            opacity: Math.min(1, hop * 3),
            transformOrigin: "50% 100%",
          }}
        />
        <div style={{ position: "absolute", left: 120, top: LINE_Y, width: 840 * line, height: 10, borderRadius: 5, background: p.white }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 1080,
            top: LINE_Y + 70,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.2 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
            height: CTA_H,
          }}
        >
          <CtaPill text={props.button} arrowIn={btnIn} />
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: LINE_Y + 280, display: "flex", justifyContent: "center", opacity: logoIn, transform: `translateY(${(1 - logoIn) * 30}px)` }}>
          <Wordmark size={84} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={CTA_T.subline} />
    </SceneBg>
  );
};
