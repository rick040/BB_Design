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
import { ropePoint, VelvetRope } from "../components/Museum";
import type { MuseumProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  rope: 12, // velvet rope + "Open" sign drop in
  buddyIn: 22, // Buddy hops in behind the rope
  flip: 40, // Buddy flips the sign to "Gesloten"
  flipLen: 10,
  button: 30,
  subline: 46,
  logo: 54,
  tap: 80,
};

const ROPE = { x1: 230, x2: 850, top: 70, postH: 150, sag: 26 };
const SIGN_T = 0.36;
const BUDDY = 150;
const BUDDY_X = 640;
const BUDDY_FEET = 220;

export const CtaScene: React.FC<{ props: MuseumProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const rope = pop(frame, fps, CTA_T.rope, springs.smooth);
  const sign = ropePoint(ROPE.x1, ROPE.x2, ROPE.top, ROPE.sag, SIGN_T);

  // Buddy hops in from the right, lands behind the rope next to the sign.
  const hop = interpolate(frame, [CTA_T.buddyIn, CTA_T.buddyIn + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const bx = interpolate(hop, [0, 1], [1150, BUDDY_X]);
  const by = -Math.sin(hop * Math.PI) * 90;
  let squash = 1;
  if (frame >= CTA_T.buddyIn + 12) {
    squash = interpolate(frame, [CTA_T.buddyIn + 12, CTA_T.buddyIn + 15, CTA_T.buddyIn + 20], [0.84, 1.05, 1], clamp);
  }
  // The flip: Buddy leans into the sign.
  const lean = interpolate(frame, [CTA_T.flip - 4, CTA_T.flip, CTA_T.flip + 8], [0, -26, 0], clamp);
  if (frame >= CTA_T.flip - 4 && frame < CTA_T.flip + 10) {
    squash = interpolate(frame, [CTA_T.flip - 4, CTA_T.flip, CTA_T.flip + 6, CTA_T.flip + 10], [1, 0.88, 1.06, 1], clamp);
  }
  const look = frame < CTA_T.flip + 12 ? { x: -0.9, y: 0.3 } : { x: 0, y: 0.25 };
  const blink = blinkScale(frame, [CTA_T.flip + 20, CTA_T.flip + 58]);
  const idle = frame > CTA_T.flip + 20 ? Math.sin((frame - CTA_T.flip - 20) / 9) * 3 : 0;

  const flip = interpolate(frame, [CTA_T.flip, CTA_T.flip + CTA_T.flipLen], [0, 1], clamp);
  const flipDeg = flip < 0.5 ? flip * 180 : (flip - 1) * 180;
  const closed = flip >= 0.5;
  const swing = frame > CTA_T.flip + CTA_T.flipLen
    ? Math.sin((frame - CTA_T.flip - CTA_T.flipLen) / 4) * 8 * Math.exp(-(frame - CTA_T.flip - CTA_T.flipLen) / 14)
    : Math.sin(frame / 7) * 2;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
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
          fontSize: L.headlineSize * 1.12,
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

      <Stage offsetY={70}>
        {/* Buddy stands behind the rope */}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          look={look}
          blink={blink}
          squash={squash}
          style={{
            position: "absolute",
            left: bx,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + by + idle,
            opacity: hop > 0 ? 1 : 0,
            transform: `rotate(${lean}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

        <div style={{ position: "absolute", inset: 0, opacity: rope, transform: `translateY(${(1 - rope) * -40}px)` }}>
          <VelvetRope {...ROPE} post={p.blueSoft} rope={p.red} />
          <div
            style={{
              position: "absolute",
              left: sign.x - 150,
              top: sign.y - 4,
              width: 300,
              transform: `rotate(${swing}deg)`,
              transformOrigin: "50% 0%",
              perspective: 700,
            }}
          >
            <div style={{ margin: "0 auto", width: 4, height: 20, background: p.blueSoft }} />
            <div
              style={{
                transform: `rotateY(${flipDeg}deg)`,
                background: closed ? p.white : p.blueSoft,
                color: p.blue,
                borderRadius: 12,
                padding: "10px 0",
                textAlign: "center",
                fontFamily: fonts.ui,
                fontWeight: 700,
                fontSize: 46,
                boxShadow: "0 10px 20px rgba(0,0,40,0.25)",
              }}
            >
              {closed ? props.signAfter : props.signBefore}
            </div>
          </div>
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
    </SceneBg>
  );
};
