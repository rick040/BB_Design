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
import { Balloon, BalloonString } from "../components/Balloon";
import { type BallonProps, MARKERS, VOICE_END, wordAt } from "../schema";

// [S4] Light: the button floats in on a balloon that Buddy holds on a string.
export const CTA_T = {
  tagline: MARKERS[3] - 8,
  button: wordAt("activeer"), // button rises on its balloon
  tug: wordAt("buddy", 2), // Buddy tugs the string on "Buddy."
  subline: wordAt("activeer") + 14,
  logo: wordAt("activeer") + 10,
  tap: VOICE_END - 2,
};

const PILL_SCALE = 1.2;
const PILL_TOP = 300;
const BUDDY = 120;
const FEET = 640;

export const CtaScene: React.FC<{ props: BallonProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const rise = pop(frame, fps, CTA_T.button - 6, springs.smooth);
  const tug = interpolate(frame, [CTA_T.tug, CTA_T.tug + 4, CTA_T.tug + 14], [0, 1, 0], clamp);
  const bobY = Math.sin(frame / 9) * 8 + tug * 30;
  const lift = (1 - rise) * 520;
  const pillTop = PILL_TOP + lift + bobY;
  const pillH = CTA_H * PILL_SCALE;
  const balloonR = 78;
  const balloonCy = pillTop - 150;
  const sway = Math.sin(frame / 11) * 4;

  const arrowIn = pop(frame, fps, CTA_T.button + 8, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const buddyIn = pop(frame, fps, CTA_T.button - 2, springs.bouncy);
  const squash = interpolate(frame, [CTA_T.tug, CTA_T.tug + 4, CTA_T.tug + 12], [1, 0.85, 1], clamp);
  const bTop = FEET - BUDDY * BUDDY_RATIO * squash;
  const handX = 540 + BUDDY * 0.42;
  const handY = bTop + 26;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.tagline} color={p.blue} delay={CTA_T.tagline} stagger={3} />
      <Stage offsetY={10}>
        <BalloonString x1={540} y1={balloonCy + balloonR * 1.18 + 10} x2={540} y2={pillTop} color={p.greyText} sway={sway * 2} />
        <BalloonString x1={540 + 120} y1={pillTop + pillH} x2={handX} y2={handY} color={p.greyText} sway={-20} />
        <Balloon cx={540} cy={balloonCy} r={balloonR} color={p.blue} tilt={sway} />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: pillTop,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${PILL_SCALE * tap}) rotate(${sway * 0.4}deg)`,
            transformOrigin: "50% 0%",
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} outline />
            <div
              style={{
                position: "absolute",
                left: CTA_H / 2 - 90,
                top: CTA_H / 2 - 90,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: `5px solid ${p.blueMid}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.2})`,
              }}
            />
          </div>
        </div>
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={squash}
          blink={blinkScale(frame, [CTA_T.tap - 10])}
          look={{ x: 0.2, y: -0.9 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2 + 120,
            top: bTop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 680,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueMid,
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
            top: 770,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.blue} />
        </div>
      </Stage>
    </SceneBg>
  );
};
