import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Door, Star } from "../components/Door";
import { type AdventProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S - 8,
  door: S + 2, // door 24 swings open
  buddy: S + 6, // Buddy waves from behind it
  button: wordAt("activeer") + 4,
  logo: wordAt("buddy", 2),
  tap: VOICE_END - 4,
};

const DOOR_W = 330;
const DOOR_H = 380;
const DOOR_X = 540 - DOOR_W / 2;
const DOOR_Y = 10;
const BUDDY = 200;

export const CtaScene: React.FC<{ props: AdventProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const open = pop(frame, fps, CTA_T.door, springs.pop);
  const bIn = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const wave = Math.sin((frame - CTA_T.buddy) / 3) * 0.5;
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

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
              const s = pop(frame, fps, CTA_T.tagline + wi++ * 3, springs.pop);
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

      <Stage offsetY={20}>
        <Door
          w={DOOR_W}
          h={DOOR_H}
          label={props.doorNumber}
          open={open}
          front={p.blueMid}
          frontText={p.white}
          recess="#0a1f7a"
          radius={36}
          style={{ left: DOOR_X, top: DOOR_Y }}
        >
          <div style={{ position: "absolute", right: 26, top: 24, transform: `scale(${bIn})` }}>
            <Star size={60} color={p.yellow} rot={frame * 2} />
          </div>
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={frame > CTA_T.buddy + 14 ? 0.2 : 1}
            look={{ x: wave, y: 0.2 }}
            squash={interpolate(bIn, [0, 0.6, 1], [0.6, 1.1, 1])}
            style={{
              position: "absolute",
              left: DOOR_W / 2 - BUDDY / 2,
              top: DOOR_H - BUDDY * BUDDY_RATIO * bIn - 10,
            }}
          />
        </Door>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 450,
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
            left: 0,
            right: 0,
            top: 640,
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
