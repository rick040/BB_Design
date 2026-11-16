import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Meter, METER_W } from "../components/Meter";
import { SpokenHeadline } from "../components/SpokenHeadline";
import { euro, SCENE_STARTS, type TaximeterProps, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  roll: S + 2,
  rollEnd: S + 26,
  buddyIn: S + 14,
  perMaand: wordAt("per"),
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 12,
  tap: VOICE_END - 2,
};

const METER_LEFT = (1080 - METER_W) / 2 - 20;
const METER_TOP = 110;
const BUDDY = 150;

export const CtaScene: React.FC<{ props: TaximeterProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const roll = interpolate(frame, [CTA_T.roll, CTA_T.rollEnd], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const value = Math.round(props.price * 100 * roll) / 100;
  const settle = interpolate(frame, [CTA_T.rollEnd, CTA_T.rollEnd + 3, CTA_T.rollEnd + 9], [0, 1, 0], clamp);
  const labelIn = frame >= CTA_T.perMaand;
  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const glow = frame >= CTA_T.button ? 0.6 + 0.4 * Math.sin((frame - CTA_T.button) / 3) : 0;
  const squash = frame < CTA_T.buddyIn + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : 1;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline text={props.tagline} at={[S, S + 6]} colors={[p.white]} sizeFactor={1.15} />
      <Stage>
        {/* Buddy on top of the meter, like the light on a taxi roof */}
        <div
          style={{
            position: "absolute",
            left: 540 - 20 - 120,
            top: METER_TOP - BUDDY * BUDDY_RATIO - 40,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${p.yellow}AA 0%, ${p.yellow}00 65%)`,
            opacity: glow,
          }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.button + 18]) * (frame > CTA_T.tap ? 0.18 : 1)}
          squash={squash}
          look={{ x: 0, y: 0.6 }}
          style={{
            position: "absolute",
            left: 540 - 20 - BUDDY / 2,
            top: METER_TOP - BUDDY * BUDDY_RATIO + 6,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <Meter
          label={labelIn ? props.priceLabel : "TARIEF"}
          value={euro(value)}
          lamp={0}
          flag={1}
          tick={settle}
          style={{ left: METER_LEFT, top: METER_TOP }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 520,
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
            top: 690,
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
