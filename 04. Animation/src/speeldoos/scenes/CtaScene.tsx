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
import { BOX_W, MusicBox, Note } from "../components/MusicBox";
import { SCENE_STARTS, type SpeeldoosProps, TOTAL_FRAMES, VOICE_END } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S - 6, // tagline words pop in fast
  rise: S + 2, // Buddy rises out of the box like the dancer
  button: S + 10,
  logo: S + 16,
  subline: S + 22,
  tap: Math.min(VOICE_END + 4, TOTAL_FRAMES - 14),
};

const BOX_SCALE = 0.52;
const BOX_TOP = 300; // stage y of the box front
const BOX_LEFT = 540 - (BOX_W * BOX_SCALE) / 2 - 18;
const BUDDY = 120;

export const CtaScene: React.FC<{ props: SpeeldoosProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const rise = interpolate(frame, [CTA_T.rise, CTA_T.rise + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const spin = Math.max(0, frame - CTA_T.rise) * 9; // degrees, pirouette
  const facing = Math.cos((spin * Math.PI) / 180);
  const lid = interpolate(frame, [S - 2, S + 6], [0, 1], clamp);
  const feetY = BOX_TOP - 70 - 40 * rise; // spindle top
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
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
          fontSize: L.headlineSize * 0.98,
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

      <Stage offsetY={60}>
        {/* spindle */}
        <div
          style={{
            position: "absolute",
            left: 540 - 6,
            top: feetY,
            width: 12,
            height: BOX_TOP - feetY,
            background: p.blueSoft,
            borderRadius: 6,
            opacity: rise,
          }}
        />
        <div style={{ position: "absolute", left: BOX_LEFT, top: BOX_TOP, transform: `scale(${BOX_SCALE})`, transformOrigin: "0 0" }}>
          <MusicBox lid={lid} crank={-90 + Math.max(0, frame - S) * 10} phase={Math.max(0, frame - S) * 5} body={p.white} face={p.blueSoft} inside="#0a2bb8" accent={p.yellow} slot={false} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.rise + 24])}
          look={{ x: Math.sin((spin * Math.PI) / 180) * 0.8, y: 0 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: feetY - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, rise * 3),
            transform: `scaleX(${0.35 + 0.65 * Math.abs(facing)}) scale(${0.5 + 0.5 * rise})`,
            transformOrigin: "50% 100%",
          }}
        />
        {[0, 1, 2].map((i) => {
          const t = frame - (CTA_T.rise + 6 + i * 10);
          if (t < 0) return null;
          const u = (t % 36) / 36;
          return (
            <Note
              key={i}
              size={48}
              color={i === 1 ? p.yellow : p.blueSoft}
              style={{
                left: 540 + (i - 1) * 190 + Math.sin(t / 5) * 14,
                top: BOX_TOP - 40 - u * 220,
                opacity: Math.sin(u * Math.PI),
              }}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 460,
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
            top: 640,
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
            top: 740,
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
