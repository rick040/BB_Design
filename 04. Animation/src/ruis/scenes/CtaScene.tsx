import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Headphones } from "../components/Headphones";
import { Wave } from "../components/Noise";
import type { RuisProps } from "../schema";

// Timeline (frames, scene-local). The scene starts 6 frames before the
// spoken "Geen" ([S4]). The tagline words land on the spoken words:
// Geen 6, ruis 16, Gewoon 30, op 41, tijd 46.
export const CTA_T = {
  buddyIn: 10, // Buddy with headphones, bobbing on a calm signal
  button: 50,
  subline: 56,
  logo: 62,
  tap: 74,
};
const WORD_AT = [6, 16, 30, 41, 46];

const BUDDY = 180;
const BUDDY_FEET = 250;

export const CtaScene: React.FC<{ props: RuisProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const waveIn = interpolate(frame, [CTA_T.buddyIn - 6, CTA_T.buddyIn + 10], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  // Calm bob + nod to the beat, eyes happily closed.
  const bob = Math.sin(frame / 6) * 10;
  const nod = Math.sin(frame / 3) * 4;
  const squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) + Math.sin(frame / 3) * 0.02;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 16], [0, 1], clamp);
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
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
          fontSize: L.headlineSize * 1.25,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const at = WORD_AT[wi] ?? WORD_AT[WORD_AT.length - 1] + 4 * (wi - WORD_AT.length + 1);
              wi++;
              const s = pop(frame, fps, at - 2, springs.pop);
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
        {/* Calm, clean signal under Buddy */}
        <Wave
          width={1000 * waveIn}
          height={80}
          amplitude={14}
          phase={frame / 5}
          periods={4 * waveIn}
          color={p.blueSoft}
          stroke={8}
          style={{ left: 540 - 500 * waveIn, top: BUDDY_FEET - 40, opacity: 0.8 }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + bob - 20,
            width: BUDDY,
            height: BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn}) rotate(${nod}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <Buddy size={BUDDY} body={p.white} eye={p.blueMascot} blink={0.18} squash={squash} look={{ x: 0, y: 0.3 }} />
          <Headphones size={BUDDY} band={p.blueSoft} cup={p.blueSoft} style={{ left: 0, top: 0 }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
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
            top: 520,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            letterSpacing: "0.01em",
            color: p.blueText,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
          }}
        >
          {props.subline}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 690,
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
