import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Cookie } from "../components/Cookie";
import { Slip } from "../components/Slip";
import { SpokenLine } from "../components/SpokenLine";
import { type GelukskoekjeProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S - 4,
  button: wordAt("activeer"),
  crack: wordAt("buddy", 2) - 4,
  slip: wordAt("buddy", 2) + 2,
  subline: wordAt("activeer") + 14,
  logo: wordAt("activeer") + 8,
  tap: VOICE_END - 2,
};

const BUDDY = 190;
const FEET = 450;
const COOKIE = 190;

export const CtaScene: React.FC<{ props: GelukskoekjeProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const buddyIn = pop(frame, fps, S - 4, springs.bouncy);
  const jump = Math.sin(Math.PI * interpolate(frame, [CTA_T.crack - 8, CTA_T.crack + 4], [0, 1], clamp)) * 50;
  const squash =
    frame < S + 8
      ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1])
      : interpolate(frame, [CTA_T.crack - 8, CTA_T.crack - 4, CTA_T.crack, CTA_T.crack + 4, CTA_T.crack + 10], [1, 0.85, 1.12, 0.88, 1], clamp);
  const crack = pop(frame, fps, CTA_T.crack, springs.pop);
  const fall = interpolate(frame, [CTA_T.crack + 6, CTA_T.crack + 22], [0, 1], clamp);
  const slipOpen = interpolate(frame, [CTA_T.slip, CTA_T.slip + 10], [0, 1], clamp);
  const slipRise = pop(frame, fps, CTA_T.slip, springs.smooth);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const headTop = FEET - jump - BUDDY * BUDDY_RATIO;

  return (
    <SceneBg color={p.blue}>
      <SpokenLine text={props.tagline} at={[S - 6, S - 2, S + 2, S + 6]} first={p.white} rest={p.blueSoft} sizeFactor={1.2} />
      <Stage offsetY={40}>
        {/* Slip from Buddy's own cookie: the answer, not a guess. */}
        <Slip
          width={440}
          height={96}
          open={slipOpen}
          style={{ left: 540 - 220, top: headTop - COOKIE * 0.65 - 100 + (1 - slipRise) * 60 }}
        >
          <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 46, color: p.blue, letterSpacing: "-0.03em" }}>
            {props.slip}
          </div>
        </Slip>
        <div
          style={{
            position: "absolute",
            left: 540 - COOKIE / 2,
            top: headTop - COOKIE * 0.65 + fall * 260,
            opacity: (1 - fall) * Math.min(1, buddyIn * 3),
          }}
        >
          <Cookie width={COOKIE} crack={crack * (1 + fall)} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={frame > CTA_T.slip + 10 ? 0.18 + 0.82 * Math.max(0, 1 - (frame - CTA_T.slip - 10) / 5) : blinkScale(frame, [S + 4])}
          squash={squash}
          look={{ x: 0, y: -0.8 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: headTop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 500,
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
            top: 680,
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
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
