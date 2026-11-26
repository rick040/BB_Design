import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { brand } from "../../theme";
import { Rugzak, RUGZAK_H, RUGZAK_W } from "../components/Rugzak";
import { type RugzakProps, SCENE_STARTS, TOTAL_FRAMES, VOICE_END, wordAt } from "../schema";

// Slot: Buddy holds the upturned bag; the last thing that falls out is the button.
export const CTA_T = {
  start: SCENE_STARTS[3],
  shake: SCENE_STARTS[3] + 2,
  drop: wordAt("activeer") + 6, // the button falls out of the bag
  dropLen: 12,
  logo: wordAt("activeer") + 20,
  subline: wordAt("activeer") + 24,
  tap: Math.min(VOICE_END + 4, TOTAL_FRAMES - 20),
};

const BAG = 230;
const bagH = (BAG * RUGZAK_H) / RUGZAK_W;
const BAG_C = { x: 540, y: 130 };
const BTN_Y = 430;
const BUD = 150;

export const CtaScene: React.FC<{ props: RugzakProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const [first, ...rest] = props.tagline.split("\n");

  const shakeK = interpolate(frame, [CTA_T.shake, CTA_T.drop + 4], [1, 0], clamp);
  const shake = Math.sin(frame * 1.9) * 12 * shakeK;
  const fall = interpolate(frame, [CTA_T.drop, CTA_T.drop + CTA_T.dropLen], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const land = pop(frame, fps, CTA_T.drop + CTA_T.dropLen, springs.bouncy);
  const landed = frame >= CTA_T.drop + CTA_T.dropLen;
  const btnY = BAG_C.y + 40 + (BTN_Y - BAG_C.y - 40) * fall;
  const btnS = 0.35 + 0.65 * fall;
  const squ = landed ? 1 - 0.12 * Math.sin(Math.min(1, land) * Math.PI) : 1;
  const arrowIn = pop(frame, fps, CTA_T.drop + CTA_T.dropLen + 4, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const visible = frame >= CTA_T.drop - 1;

  return (
    <SceneBg color={p.blue}>
      <Headline text={first} color={p.white} delay={CTA_T.start - 8} stagger={2} sizeFactor={1.1} />
      <Headline
        text={rest.join("\n")}
        color={p.blueSoft}
        delay={CTA_T.start - 4}
        stagger={2}
        sizeFactor={1.1}
        top={L.safeTop + L.headlineSize * 1.1}
      />
      <Stage offsetY={10}>
        <div
          style={{
            position: "absolute",
            left: BAG_C.x - BAG / 2 + shake,
            top: BAG_C.y - bagH / 2,
            transform: `rotate(${180 + shake * 0.4}deg)`,
            zIndex: 3,
          }}
        >
          <Rugzak width={BAG} body={p.white} flap={p.blueSoft} pocket={p.blueSoft} accent={brand.blueMascot} open={1} />
        </div>
        <Buddy
          size={BUD}
          body={p.white}
          eye={brand.blueMascot}
          blink={landed ? (frame > CTA_T.drop + 30 ? blinkScale(frame, [CTA_T.drop + 40]) : 0.22) : 1}
          look={{ x: -0.7, y: landed ? 0.4 : -0.7 }}
          style={{ position: "absolute", left: 760, top: 330 - BUD * BUDDY_RATIO, zIndex: 1 }}
        />
        {visible ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: btnY,
              display: "flex",
              justifyContent: "center",
              transform: `scale(${1.25 * btnS * tap * (2 - squ)}, ${1.25 * btnS * tap * squ}) rotate(${(1 - fall) * 14}deg)`,
              transformOrigin: "50% 100%",
              zIndex: 2,
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
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 680,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 30}px)`,
          }}
        >
          <Wordmark size={84} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={CTA_T.subline} />
    </SceneBg>
  );
};
