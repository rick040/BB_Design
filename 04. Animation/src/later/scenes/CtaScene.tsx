import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Parcel } from "../components/Parcel";
import { type LaterProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[4];
export const CTA_T = {
  tagline: S - 6,
  box: S - 6,
  open: S + 2,
  buddy: S + 6,
  slap: wordAt("activeer"),
  subline: wordAt("activeer") + 8,
  logo: wordAt("activeer") + 12,
  wink: VOICE_END + 4,
};

const BOX_W = 520;
const BOX_H = 380;
const BOX_X = 540 - BOX_W / 2;
const BOX_Y = 300;
const BUDDY = 200;

export const CtaScene: React.FC<{ props: LaterProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const boxIn = pop(frame, fps, CTA_T.box, springs.bouncy);
  const open = interpolate(frame, [CTA_T.open, CTA_T.open + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const rise = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const slapSq = interpolate(frame, [CTA_T.slap, CTA_T.slap + 3, CTA_T.slap + 9], [1, 0.82, 1], clamp);
  const label = pop(frame, fps, CTA_T.slap, springs.pop);
  const arrowIn = pop(frame, fps, CTA_T.slap + 6, springs.pop);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const buddyTop = BOX_Y + 40 - rise * BUDDY * BUDDY_RATIO * 0.98;

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.1,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, CTA_T.tagline + wi++ * 2, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? p.white : p.blueSoft,
                      opacity: Math.min(1, s * 1.4),
                      transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                      filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                    }}
                  >
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <Stage offsetY={30}>
        <div
          style={{
            position: "absolute",
            left: BOX_X,
            top: BOX_Y,
            transform: `scale(${0.5 + 0.5 * boxIn})`,
            transformOrigin: "50% 100%",
            opacity: Math.min(1, boxIn * 2),
          }}
        >
          <Parcel w={BOX_W} h={BOX_H} open={open}>
            {/* Buddy pops out of the box (drawn behind the box front) */}
            <Buddy
              size={BUDDY}
              body={p.white}
              eye={p.blueMascot}
              squash={frame < CTA_T.slap ? interpolate(rise, [0, 0.7, 1], [0.7, 1.1, 1]) : slapSq}
              blink={blinkScale(frame, [CTA_T.wink])}
              look={frame < CTA_T.slap ? { x: 0, y: -0.4 } : { x: 0, y: 0.8 }}
              style={{
                position: "absolute",
                left: BOX_W / 2 - BUDDY / 2,
                top: buddyTop - BOX_Y,
                opacity: rise > 0.02 ? 1 : 0,
              }}
            />
          </Parcel>
          {/* the CTA is slapped on the box front as its shipping label */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: BOX_H * 0.5 - CTA_H / 2,
              display: "flex",
              justifyContent: "center",
              opacity: Math.min(1, label * 2),
              transform: `rotate(${(1 - label) * -12 - 2}deg) scale(${interpolate(label, [0, 1], [1.6, 1])})`,
            }}
          >
            <CtaPill text={props.button} arrowIn={arrowIn} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: BOX_Y + BOX_H + 40,
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
            top: BOX_Y + BOX_H + 130,
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
