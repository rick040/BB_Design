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
import { KNIFE, Knife } from "../components/Knife";
import { SCENE_STARTS, VOICE_END, type ZakmesProps, wordAt } from "../schema";

const S = SCENE_STARTS[3];
// Absolute frames: the knife clicks shut, Buddy hops out, the handle becomes the button.
export const CTA_T = {
  fold: S + 2,
  shut: S + 13,
  hop: wordAt("buddy", 2) - 10,
  land: wordAt("buddy", 2) + 6,
  button: S + 15,
  logo: S + 16,
  subline: S + 22,
  tap: VOICE_END - 2,
};

const CY = 420;
const EMB = 134;
const BIG = 150;
const LAND = { x: 125, feet: CY + 80 };

export const CtaScene: React.FC<{ props: ZakmesProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const open = interpolate(frame, [CTA_T.fold, CTA_T.shut], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const click = interpolate(frame - CTA_T.shut, [0, 2, 7], [1, 0.94, 1], clamp);
  const toButton = interpolate(frame, [CTA_T.button, CTA_T.button + 8], [0, 1], clamp);
  const btnPop = pop(frame, fps, CTA_T.button, springs.pop);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  // Buddy: emblem on the handle, then hops out to the left of the button and grows.
  const h = interpolate(frame, [CTA_T.hop, CTA_T.land], [0, 1], clamp);
  const size = EMB + (BIG - EMB) * h;
  const startFeet = { x: 540, y: CY + (EMB * BUDDY_RATIO) / 2 };
  const fx = startFeet.x + (LAND.x - startFeet.x) * h;
  const fy = startFeet.y + (LAND.feet - startFeet.y) * h - Math.sin(h * Math.PI) * 170;
  const landSq = interpolate(frame - CTA_T.land, [0, 3, 9], [0.8, 1.1, 1], clamp);
  const takeOff = interpolate(frame - CTA_T.hop, [-4, 0, 4], [1, 0.82, 1.1], clamp);
  const squash = frame >= CTA_T.land ? landSq : frame >= CTA_T.hop - 4 && frame < CTA_T.hop + 4 ? takeOff : 1;
  const onHandle = h === 0;
  const body = onHandle ? p.blueMascot : p.white;
  const eye = onHandle ? p.white : p.blueMascot;
  const happy = frame >= CTA_T.land + 12;

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
          fontSize: L.headlineSize * 1.2,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, S - 4 + wi++ * 3, springs.pop);
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

      <Stage offsetY={40}>
        {/* the knife clicks shut, its handle fades into the button */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - toButton,
            transform: `scale(${click}, ${1 / click})`,
            transformOrigin: `540px ${CY}px`,
          }}
        >
          <Knife cx={540} cy={CY} handleColor={p.white} rivetColor={p.blueSoft} openA={open} openB={open} iconColor={p.blue} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: CY - (CTA_H * 1.3) / 2,
            height: CTA_H * 1.3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: toButton,
            transform: `scale(${(0.92 + 0.08 * btnPop) * tap})`,
          }}
        >
          <div style={{ position: "relative", transform: "scale(1.3)" }}>
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

        <Buddy
          size={size}
          body={body}
          eye={eye}
          blink={happy ? 0.2 : blinkScale(frame, [CTA_T.hop - 8])}
          look={h > 0 && !happy ? { x: 0.8, y: 0.2 } : { x: 0, y: 0 }}
          squash={squash}
          style={{
            position: "absolute",
            left: fx - size / 2,
            top: fy - size * BUDDY_RATIO,
            zIndex: 2,
          }}
        />

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

export const CTA_HANDLE_W = KNIFE.handleW;
