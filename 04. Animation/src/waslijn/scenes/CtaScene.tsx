import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Peg, Rope, ropeY } from "../components/Laundry";
import { SpokenHeadline } from "../components/SpokenHeadline";
import { SCENE_STARTS, VOICE_END, type WaslijnProps, wordAt } from "../schema";

const S = SCENE_STARTS[3];
// Absolute frames.
export const CTA_T = {
  tagline: S - 6, // slotkop komt mee met het laken
  taglineStagger: 3,
  swing: S - 4, // Buddy hangt aan de lijn en zwaait uit
  button: wordAt("activeer") + 4,
  logo: wordAt("buddy", 2),
  subline: wordAt("buddy", 2) + 6,
  tap: VOICE_END - 2,
  blink: VOICE_END + 6,
};

const ROPE = { x0: -60, x1: 1140, y: 30, sag: 26 };
const BUDDY = 190;

export const CtaScene: React.FC<{ props: WaslijnProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const words = props.tagline.split(/\s+/).filter(Boolean);
  const at = words.map((_, i) => CTA_T.tagline + i * CTA_T.taglineStagger);

  // Buddy hangt met een knijper op zijn hoofd en zwaait uit.
  const t = Math.max(0, frame - CTA_T.swing);
  const angle = 26 * Math.cos(t * 0.24) * Math.exp(-t / 34);
  const pegX = 540;
  const pegY = ropeY(pegX, ROPE.x0, ROPE.x1, ROPE.y, ROPE.sag);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline text={props.tagline} at={at} colors={[p.white, p.blueSoft]} sizeFactor={1.15} />
      <Stage offsetY={40}>
        <Rope {...ROPE} color={p.white} />
        <div
          style={{
            position: "absolute",
            left: pegX,
            top: pegY,
            width: 0,
            height: 0,
            transform: `rotate(${angle}deg)`,
          }}
        >
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blinkScale(frame, [CTA_T.blink])}
            squash={1 + 0.04 * Math.sin(t * 0.48) * Math.exp(-t / 34)}
            look={{ x: -angle / 30, y: 0.3 }}
            style={{ position: "absolute", left: -BUDDY / 2, top: 26 }}
          />
          <div style={{ position: "absolute", left: -17, top: -14 }}>
            <Peg color={p.yellow} size={1.1} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 440,
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
            top: 625,
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
            top: 735,
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
