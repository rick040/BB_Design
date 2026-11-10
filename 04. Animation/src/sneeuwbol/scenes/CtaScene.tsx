import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { DayTile, SnowGlobe } from "../components/SnowGlobe";
import type { SneeuwbolProps } from "../schema";
import { wordAt } from "../vo";

// Beats (scene-local). On "dwarrelen" the globe is shaken hard: all the
// paper flakes whirl, but Buddy keeps standing on his one date.
export const ctaBeats = (start: number) => ({
  tagline: 2,
  tagStagger: 4,
  shake: wordAt("dwarrelen") - start,
  shakeLen: 30,
  button: wordAt("rest") - start,
  subline: wordAt("dwarrelen") - start + 10,
  logo: wordAt("dwarrelen") - start + 18,
  happy: wordAt("dwarrelen") - start + 26,
  tap: wordAt("dwarrelen") - start + 40,
});

const R = 220;
const GX = 540 - R;
const GY = 0;
const BUDDY = 130;
const TILE = 96;

export const CtaScene: React.FC<{ props: SneeuwbolProps["cta"]; start: number }> = ({ props, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const B = ctaBeats(start);

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  // Shake: tilt + jitter, flakes whirl up; then calm again.
  const sh = interpolate(frame, [B.shake, B.shake + 4, B.shake + B.shakeLen], [0, 1, 0], clamp);
  const tilt = Math.sin(frame * 1.3) * 9 * sh;
  const jx = Math.sin(frame * 2.1) * 22 * sh;
  const spread = interpolate(frame, [0, B.shake, B.shake + 6, B.shake + 60], [0.15, 0.15, 1, 0.6], clamp);
  const swirlSpeed = 0.02 + sh * 0.25;
  // integrate swirl so it never jumps
  let swirl = 0;
  for (let f = 0; f < frame; f++) {
    const s = interpolate(f, [B.shake, B.shake + 4, B.shake + B.shakeLen], [0, 1, 0], clamp);
    swirl += 0.02 + s * 0.25;
  }
  void swirlSpeed;

  const buddyIn = pop(frame, fps, 4, springs.bouncy);
  const blink = frame >= B.happy ? interpolate(frame, [B.happy, B.happy + 4], [1, 0.2], clamp) : blinkScale(frame, [B.shake + 2]);
  const floorY = R * 1.72;

  const btnIn = pop(frame, fps, B.button, springs.bouncy);
  const arrowIn = pop(frame, fps, B.button + 6, springs.pop);
  const tap = interpolate(frame, [B.tap, B.tap + 3, B.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [B.tap + 1, B.tap + 18], [0, 1], clamp);
  const nudge = frame > B.button + 14 ? Math.max(0, Math.sin((frame - B.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [B.subline, B.subline + 12], [0, 1], clamp);
  const logoIn = pop(frame, fps, B.logo, springs.smooth);

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
          fontSize: L.headlineSize * 1.15,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, B.tagline + wi++ * B.tagStagger - 6, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? p.white : p.blueSoft,
                      opacity: Math.min(1, s * 1.4),
                      transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
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
        <div
          style={{
            position: "absolute",
            left: GX,
            top: GY,
            transform: `translateX(${jx}px) rotate(${tilt}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <SnowGlobe
            r={R}
            swirl={swirl}
            spread={spread}
            flakes={34}
            childrenOnTop
            water="#2a5cff"
            glass={p.blueSoft}
            base={p.white}
            slip={p.white}
            slipLine={p.blueSoft}
          >
            {/* Buddy stays put on his date, whatever whirls around him */}
            <DayTile
              w={TILE}
              day={props.tileDay}
              date={props.tileDate}
              bg={p.white}
              fg={p.blue}
              sub={p.greyText}
              style={{ position: "absolute", left: R - TILE / 2, top: floorY - TILE * 1.15 + 20, transform: `rotate(${-tilt}deg)` }}
            />
            <Buddy
              size={BUDDY}
              body={p.white}
              eye={p.blueMascot}
              blink={blink}
              squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1])}
              look={{ x: Math.sin(frame / 5) * sh, y: -0.2 }}
              style={{
                position: "absolute",
                left: R - BUDDY / 2,
                top: floorY - TILE * 1.15 + 24 - BUDDY * BUDDY_RATIO * 1.02,
                transform: `rotate(${-tilt}deg) scale(${0.4 + 0.6 * buddyIn})`,
                transformOrigin: "50% 100%",
                opacity: Math.min(1, buddyIn * 3),
              }}
            />
          </SnowGlobe>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 580,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.25 * btnIn * tap})`,
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
            top: 730,
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
            top: 810,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={92} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
