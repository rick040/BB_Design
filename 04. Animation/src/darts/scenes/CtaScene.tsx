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
import { Dart, dartFlight } from "../components/Dart";
import type { DartsProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  button: 18,
  buddyIn: 26, // Buddy hops in next to the wordmark
  subline: 34,
  logo: 40,
  throwAt: 52, // Buddy throws one last dart...
  hit: 62, // ...right into the arrow of the button
  cheer: 70, // happy hop, eyes closed
};

const BUDDY = 150;
const BUDDY_X = 905; // centre
const FEET = 720;
const BTN_TOP = 200;

export const CtaScene: React.FC<{ props: DartsProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const hitPush = interpolate(frame, [CTA_T.hit, CTA_T.hit + 3, CTA_T.hit + 10], [1, 0.94, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.hit + 1, CTA_T.hit + 18], [0, 1], clamp);
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (frame >= CTA_T.throwAt - 6 && frame < CTA_T.throwAt + 8) {
    squash = interpolate(frame, [CTA_T.throwAt - 6, CTA_T.throwAt, CTA_T.throwAt + 4, CTA_T.throwAt + 8], [1, 0.84, 1.12, 1], clamp);
  }
  let hop = 0;
  if (frame >= CTA_T.cheer) {
    const c = frame - CTA_T.cheer;
    hop = -Math.abs(Math.sin(c / 5)) * 46 * Math.exp(-c / 20);
  }
  const blink = frame >= CTA_T.cheer ? 0.18 : 1;
  const look = frame >= CTA_T.throwAt - 10 ? { x: -1, y: -0.8 } : { x: -0.4, y: 0 };

  // The button (scaled 1.3) is centred; its arrow circle sits CTA_H/2 from its left edge.
  // The dart is drawn inside the button's own coordinates so it lands exactly in the arrow.
  const tip = { x: CTA_H / 2 + 6, y: CTA_H / 2 - 4 };
  const d = dartFlight(frame, CTA_T.throwAt, CTA_T.hit, { x: tip.x + 520, y: tip.y + 300 }, tip, 25, 220);

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
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BTN_TOP,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative", transform: `translateX(${(1 - hitPush) * -60}px)` }}>
            <CtaPill text={props.button} arrowIn={arrowIn} />
            <div
              style={{
                position: "absolute",
                left: CTA_H / 2 - 90,
                top: CTA_H / 2 - 90,
                width: 180,
                height: 180,
                borderRadius: "50%",
                border: `5px solid ${p.yellow}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.95 : 0,
                transform: `scale(${0.3 + ripple * 1.2})`,
              }}
            />
            <Dart
              x={d.x}
              y={d.y}
              angle={d.angle}
              scale={d.scale * 0.62}
              opacity={d.opacity}
              thud={d.thud}
              barrel={p.yellow}
              flight={p.blueSoft}
              zIndex={4}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 420,
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
            top: 600,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + hop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
    </SceneBg>
  );
};
