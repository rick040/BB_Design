import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Hanky } from "../components/Hanky";
import { SCENE_STARTS, VOICE_END, wordAt, type ZakdoekProps } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  buddyIn: S - 2,
  untie: wordAt("knopen"),
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 12,
  tap: VOICE_END - 2,
};
const SPOKEN = [wordAt("geen"), wordAt("knopen"), wordAt("meer")];

const BUDDY = 200;
const FEET = 1010;

export const CtaScene: React.FC<{ props: ZakdoekProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  // The knots pop open one by one on "knopen".
  const knots = [0, 1, 2].map((i) => 1 - pop(frame, fps, CTA_T.untie + i * 4, springs.pop));
  const yank = interpolate(frame, [CTA_T.untie - 3, CTA_T.untie, CTA_T.untie + 10], [1, 0.84, 1.06], clamp);
  const squash = frame < CTA_T.buddyIn + 14 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : yank;
  const wave = Math.sin(frame / 5);
  const flagRot = -18 + Math.sin(frame / 7) * 10;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 70,
          right: 70,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 124,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const at = SPOKEN[wi] ?? SPOKEN[SPOKEN.length - 1];
              wi++;
              const s = pop(frame, fps, at - 3, springs.pop);
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

      {/* Buddy waves the untied handkerchief like a little flag. */}
      <div
        style={{
          position: "absolute",
          left: 540 - BUDDY / 2,
          top: FEET - BUDDY * BUDDY_RATIO,
          width: BUDDY,
          height: BUDDY * BUDDY_RATIO,
          opacity: Math.min(1, buddyIn * 3),
          transform: `scale(${0.4 + 0.6 * buddyIn})`,
          transformOrigin: "50% 100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: BUDDY * 0.78,
            top: -BUDDY * 0.62,
            width: 10,
            height: BUDDY * 0.9,
            borderRadius: 5,
            background: p.blueSoft,
            transform: `rotate(${flagRot * 0.4}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <div style={{ position: "absolute", left: 6, top: -10, transform: `rotate(${flagRot}deg)`, transformOrigin: "0% 0%" }}>
            <Hanky size={190} cloth={p.white} check={p.blueSoft} knots={[knots[0], knots[1], knots[2], 0]} wave={wave} />
          </div>
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={frame > CTA_T.untie + 16 && frame < CTA_T.untie + 40 ? 0.18 : blinkScale(frame, [CTA_T.button + 18])}
          squash={squash}
          look={{ x: 0.5, y: -0.6 }}
          style={{ position: "absolute", left: 0, top: 0 }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1090,
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
          top: 1280,
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
          top: 1400,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 40}px)`,
        }}
      >
        <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
      </div>
    </>
  );
};
