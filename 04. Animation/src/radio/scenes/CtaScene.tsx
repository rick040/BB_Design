import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { AntennaBuddy } from "../components/AntennaBuddy";
import { type RadioProps, VO_WORDS } from "../schema";

// Beats (scene-local = spoken word frame minus the scene start).
export const ctaBeats = (start: number) => ({
  tagline: 0,
  tagStagger: 4,
  buddyIn: 4,
  broadcast: VO_WORDS.Activeer - start, // "Activeer Buddy": Buddy goes on air
  button: VO_WORDS.Activeer - start + 4,
  subline: VO_WORDS.Activeer - start + 14,
  logo: VO_WORDS.Activeer - start + 20,
  tap: VO_WORDS.Activeer - start + 28,
});

const BUDDY = 180;
const FEET = { x: 540, y: 300 };

export const CtaScene: React.FC<{ props: RadioProps["cta"]; start: number }> = ({ props, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const T = ctaBeats(start);

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, T.buddyIn, springs.bouncy);
  const on = frame >= T.broadcast;
  const squash = on
    ? interpolate(frame, [T.broadcast, T.broadcast + 3, T.broadcast + 9, T.broadcast + 14], [1, 0.86, 1.08, 1], clamp)
    : interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  const btnIn = pop(frame, fps, T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, T.button + 6, springs.pop);
  const tap = interpolate(frame, [T.tap, T.tap + 3, T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 16], [0, 1], clamp);
  const subIn = interpolate(frame, [T.subline, T.subline + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, T.logo, springs.smooth);

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
              const s = pop(frame, fps, T.tagline + wi++ * T.tagStagger, springs.pop);
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
        <AntennaBuddy
          feetX={FEET.x}
          feetY={FEET.y}
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          blink={on && frame < T.broadcast + 16 ? 0.2 : blinkScale(frame, [T.tap + 8])}
          look={{ x: 0, y: 0.3 }}
          glow={on ? 1 : 0}
          waves={on ? (frame - T.broadcast) / 20 : 0}
          waveColor={p.blueSoft}
          tipColor={on ? p.yellow : p.blueSoft}
          stickColor={p.white}
          opacity={Math.min(1, buddyIn * 3)}
          scale={0.4 + 0.6 * buddyIn}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 340,
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
            top: 530,
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
