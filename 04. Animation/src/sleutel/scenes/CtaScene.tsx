import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { SlotPlate, SpokenHeadline } from "../components/Props";
import { SCENE_STARTS, type SleutelProps, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
// Absolute frames. The button comes out of Buddy's letterbox like a letter.
export const CTA_T = {
  tagline: S - 6, // tagline words pop in
  taglineStagger: 2,
  eyes: S - 2, // Buddy's eyes in the slot
  button: wordAt("activeer") + 2, // button slides out of the slot
  buttonLen: 16,
  subline: wordAt("buddy", 2) + 4,
  logo: wordAt("buddy", 2) + 8,
  tap: VOICE_END - 2,
  wink: VOICE_END + 8,
};

const SLOT_CY = 150;

export const CtaScene: React.FC<{ props: SleutelProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const words = props.tagline.split(/\s+/).filter(Boolean).length;
  const at = Array.from({ length: words }, (_, i) => CTA_T.tagline + i * CTA_T.taglineStagger);

  const eyes = pop(frame, fps, CTA_T.eyes, springs.bouncy);
  const out = interpolate(frame, [CTA_T.button, CTA_T.button + CTA_T.buttonLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });
  const btnTop = SLOT_CY - CTA_H * 1.25 + out * 230;
  const arrowIn = pop(frame, fps, CTA_T.button + CTA_T.buttonLen - 4, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const look = interpolate(out, [0, 1], [0, 0]) + (frame > CTA_T.button + 4 ? 0 : 0);
  const eyeDown = frame > CTA_T.button + 2 ? 0.35 : 0;
  const wink = interpolate(frame, [CTA_T.wink, CTA_T.wink + 3, CTA_T.wink + 8, CTA_T.wink + 11], [1, 0.1, 0.1, 1], clamp);

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline text={props.tagline} at={at} color={p.white} secondColor={p.blueSoft} />
      <Stage offsetY={90}>
        {/* button, clipped at the slot so it comes out of it */}
        <div style={{ position: "absolute", left: 0, right: 0, top: SLOT_CY, height: 700, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: btnTop - SLOT_CY,
              display: "flex",
              justifyContent: "center",
              transform: `scale(${tap})`,
            }}
          >
            <div style={{ position: "relative", transform: "scale(1.25)", transformOrigin: "50% 0" }}>
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
        </div>
        <SlotPlate
          cx={540}
          cy={SLOT_CY}
          w={820}
          plate={p.white}
          slot="#0a1f7a"
          eyes={eyes}
          look={look}
          blink={wink}
          eyeColor={p.white}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 560,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueText,
            opacity: subIn,
            transform: `translateY(${eyeDown * 0}px)`,
          }}
        >
          {props.subline}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 670,
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
