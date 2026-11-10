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
import { Mug, MUG_W, MUG_H } from "../components/Mug";
import type { TheeProps } from "../schema";

// Timeline (frames, scene-local). The tagline words land on the spoken
// words: "Thee laat je trekken, rekeningen niet."
export const CTA_T = {
  w1: 5, // "Thee"
  w2: 19, // "laat"
  w3: 25, // "je"
  w4: 28, // "trekken"
  w5: 44, // "Rekeningen"
  w6: 60, // "niet."
  buddyIn: 16, // Buddy plops onto the rim of the mug
  heart: 44, // steam curls into a heart
  button: 62,
  subline: 72,
  logo: 76,
  tap: 90,
};

const WORD_AT = [CTA_T.w1, CTA_T.w2, CTA_T.w3, CTA_T.w4, CTA_T.w5, CTA_T.w6];
const BUDDY = 130;
const MUG_SCALE = 0.5;
const MUG_LEFT = 540 - MUG_W / 2 - 20;
const MUG_TOP = 250 - MUG_H; // bottom of the scaled mug sits on y=250
const RIM = 250 - MUG_H * MUG_SCALE + 30 * MUG_SCALE;

export const CtaScene: React.FC<{ props: TheeProps["cta"]; tea: TheeProps["tea"] }> = ({ props, tea }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const bIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const drop = (1 - bIn) * -160;
  const squash = interpolate(bIn, [0, 0.6, 1], [1.2, 0.85, 1]);
  const blink = frame > CTA_T.heart ? 0.18 : 1;
  const sway = frame > CTA_T.heart ? Math.sin((frame - CTA_T.heart) / 7) * 3 : 0;
  const heart = interpolate(frame, [CTA_T.heart, CTA_T.heart + 30], [0, 1], clamp);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 12], [0, 1], clamp);
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
          fontSize: L.headlineSize * 1.08,
          lineHeight: 1.02,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, WORD_AT[Math.min(wi++, WORD_AT.length - 1)], springs.pop);
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

      <Stage offsetY={L.tall ? 170 : 60}>
        {/* steam heart */}
        <svg
          width={120}
          height={110}
          viewBox="0 0 120 110"
          style={{
            position: "absolute",
            left: 650,
            top: -10 - heart * 50,
            opacity: heart < 0.85 ? heart * 1.2 : (1 - heart) * 6,
            transform: `scale(${0.5 + heart * 0.6})`,
          }}
        >
          <path
            d="M60 100 C 10 65, 0 35, 22 18 C 40 4, 56 14, 60 30 C 64 14, 80 4, 98 18 C 120 35, 110 65, 60 100 Z"
            fill="none"
            stroke={p.blueSoft}
            strokeWidth={10}
            strokeLinejoin="round"
          />
        </svg>
        <Mug
          steep={0.12}
          fresh={tea.fresh}
          bitter={tea.bitter}
          cup={p.white}
          outline={p.blueSoft}
          bag={false}
          steam={0}
          scale={MUG_SCALE}
          style={{ left: MUG_LEFT, top: MUG_TOP }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          blink={blink}
          look={{ x: 0, y: 0.3 }}
          style={{
            position: "absolute",
            left: 540 - 20 - BUDDY / 2,
            top: RIM - BUDDY * BUDDY_RATIO + drop,
            opacity: Math.min(1, bIn * 3),
            transform: `rotate(${sway}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

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
            top: 510,
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
            top: 650,
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
