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
import { DRAPE, Drapes, Sparkle } from "../components/Magic";
import type { GoochelProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 7,
  tagStagger: 5,
  buddyIn: 16, // Buddy pops up on his little podium, top hat on
  button: 24,
  subline: 36,
  logo: 46,
  bow: 58, // the bow: Buddy dips, the hat lifts off his head and lands again
  bowLen: 22,
  tap: 88,
  close: 92, // the drapes start to close at the very end
};

const BUDDY = 180;
const FEET = 262;

/** A small top hat the right way up, worn by Buddy. */
const TopHat: React.FC<{ w: number; color: string; band: string; style?: React.CSSProperties }> = ({ w, color, band, style }) => {
  const h = w * 0.86;
  return (
    <svg width={w} height={h} viewBox="0 0 100 86" style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d="M22 6 Q50 0 78 6 L74 70 L26 70 Z" fill={color} />
      <rect x={24} y={52} width={52} height={12} fill={band} />
      <ellipse cx={50} cy={72} rx={50} ry={11} fill={color} />
    </svg>
  );
};

export const CtaScene: React.FC<{ props: GoochelProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  // The bow.
  const b0 = CTA_T.bow;
  const bow = interpolate(frame, [b0, b0 + 6, b0 + 14, b0 + CTA_T.bowLen], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const hatLift = interpolate(frame, [b0 + 2, b0 + 8, b0 + 14, b0 + 20], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  squash *= 1 - 0.18 * bow;
  const blink = Math.min(blinkScale(frame, [CTA_T.buddyIn + 18]), 1 - 0.8 * bow);
  const idle = frame > b0 + CTA_T.bowLen ? Math.sin((frame - b0 - CTA_T.bowLen) / 8) * 3 : 0;
  const buddyH = BUDDY * BUDDY_RATIO * squash;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const close = interpolate(frame, [CTA_T.close, CTA_T.close + 20], [0, 0.1], { ...clamp, easing: Easing.inOut(Easing.quad) });

  const hatW = BUDDY * 0.5;

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
              const s = pop(frame, fps, CTA_T.tagline + wi++ * CTA_T.tagStagger, springs.pop);
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
        {/* spotlight + podium */}
        <div
          style={{
            position: "absolute",
            left: 340,
            width: 400,
            top: FEET - 330,
            height: 360,
            background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 100%)",
            clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)",
            opacity: buddyIn,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - 150,
            width: 300,
            top: FEET - 18,
            height: 36,
            borderRadius: "50%",
            background: p.blueSoft,
            opacity: buddyIn,
            transform: `scaleX(${0.4 + 0.6 * buddyIn})`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + idle,
            width: BUDDY,
            height: BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            squash={squash}
            look={{ x: 0, y: 0.2 + 0.8 * bow }}
            style={{ position: "absolute", left: 0, top: 0 }}
          />
          {/* the top hat sits on his upper-left bump, follows the squash, and lifts during the bow */}
          <TopHat
            w={hatW}
            color="#16161c"
            band={p.blueSoft}
            style={{
              left: BUDDY * 0.34 - hatW / 2,
              top: BUDDY * BUDDY_RATIO - buddyH - hatW * 0.74 - hatLift * 70,
              transform: `rotate(${-10 - 22 * hatLift}deg)`,
              transformOrigin: "50% 90%",
            }}
          />
        </div>

        {frame >= b0 + 4 && frame < b0 + 30
          ? [
              { x: 380, y: 40, s: 40 },
              { x: 670, y: 70, s: 34 },
              { x: 330, y: 190, s: 28 },
              { x: 720, y: 210, s: 30 },
            ].map((s, i) => {
              const t = (frame - b0 - 4) / 26;
              return (
                <Sparkle
                  key={i}
                  size={s.s}
                  color={p.yellow}
                  style={{ left: s.x, top: s.y - t * 30, opacity: Math.sin(t * Math.PI), transform: `scale(${0.5 + t})` }}
                />
              );
            })
          : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} arrowNudge={nudge} />
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
            top: 500,
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
            top: 680,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>

      <Drapes close={close} edge={46} color={DRAPE.color} dark={DRAPE.dark} valance />
    </SceneBg>
  );
};
