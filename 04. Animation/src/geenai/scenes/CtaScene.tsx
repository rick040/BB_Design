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
import { Stencil } from "../components/Stencil";
import { type GeenAiProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
// Absolute frames. Slotbeeld: one stencil with one hole, and that hole frames the button.
export const CTA_T = {
  plate: S + 2, // stencil plate settles
  peek: wordAt("niet") - 2, // Buddy peeks over the plate
  button: wordAt("activeer"), // button pops inside the hole
  logo: wordAt("activeer") + 8,
  subline: wordAt("activeer") + 14,
  tap: VOICE_END - 4,
};

const PLATE = { x: 120, y: 210, w: 840, h: 300 };
const HOLE = { x: 70, y: 70, w: 700, h: 160 };
const BUDDY = 170;

export const CtaScene: React.FC<{ props: GeenAiProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const plate = pop(frame, fps, CTA_T.plate - 6, { damping: 14, stiffness: 200, mass: 0.6 });
  const peek = pop(frame, fps, CTA_T.peek, springs.bouncy);
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const lit = pop(frame, fps, CTA_T.button + 2, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const lookY = frame >= CTA_T.button ? 0.9 : 0.3;

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
          fontSize: L.headlineSize * 1.05,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, S - 8 + wi++ * 3, springs.pop);
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

      <Stage offsetY={20}>
        {/* Buddy behind the plate, peeking over its top edge */}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.tap + 10])}
          look={{ x: -0.2, y: lookY }}
          style={{
            position: "absolute",
            left: 760 - BUDDY / 2,
            top: PLATE.y - BUDDY * BUDDY_RATIO * 0.62 * peek + 40 * (1 - peek),
          }}
        />
        <Stencil
          w={PLATE.w}
          h={PLATE.h}
          holes={[HOLE]}
          color={p.blueMid}
          lit={[lit]}
          radius={40}
          pad={0}
          style={{
            left: PLATE.x,
            top: PLATE.y - 260 * (1 - plate),
            opacity: Math.min(1, plate * 3),
            filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.25))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: PLATE.y + HOLE.y + HOLE.h / 2 - CTA_H / 2 - 260 * (1 - plate),
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
            top: PLATE.y + PLATE.h + 50,
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
            top: PLATE.y + PLATE.h + 160,
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
