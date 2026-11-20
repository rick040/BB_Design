import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { type BrievenbusProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  peek: S + 2, // Buddy's eyes rise into the letterbox slot
  shut: wordAt("niet") + 2, // on "niet" he squeezes his eyes shut
  button: wordAt("activeer"), // button pops
  open: wordAt("activeer") + 4, // eyes open again, look down at the button
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 10,
  tap: VOICE_END - 2,
};
// Tagline words land on the spoken words.
const SPOKEN = [wordAt("de"), wordAt("rest"), wordAt("ziet"), wordAt("hij"), wordAt("niet")];

const PLATE_W = 560;
const PLATE_H = 170;
const WIN_W = 460;
const WIN_H = 96;
const BUDDY = 300;
const EYE_CX = (155.26 / 464.69) * BUDDY;
const EYE_CY = (105.1 / 506.36) * BUDDY;

export const CtaScene: React.FC<{ props: BrievenbusProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const peek = pop(frame, fps, CTA_T.peek, springs.smooth);
  const plateIn = pop(frame, fps, S - 4, springs.pop);
  const shut = interpolate(frame, [CTA_T.shut, CTA_T.shut + 4, CTA_T.open, CTA_T.open + 5], [1, 0.08, 0.08, 1], clamp);
  const blink = Math.min(shut, blinkScale(frame, [CTA_T.tap + 10]));
  const lookX = frame < CTA_T.shut ? Math.sin((frame - S) / 6) * 0.9 : 0;
  const look = frame >= CTA_T.open ? { x: 0.2, y: 1 } : { x: lookX, y: 0 };

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
          fontSize: L.headlineSize * 1.2,
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

      <Stage offsetY={40}>
        {/* letterbox plate with Buddy's eyes peeking through the slot */}
        <div
          style={{
            position: "absolute",
            left: 540 - PLATE_W / 2,
            top: 40,
            width: PLATE_W,
            height: PLATE_H,
            borderRadius: 34,
            background: p.yellow,
            boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            transform: `scale(${0.6 + 0.4 * plateIn})`,
            opacity: Math.min(1, plateIn * 2),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: (PLATE_W - WIN_W) / 2,
              top: (PLATE_H - WIN_H) / 2,
              width: WIN_W,
              height: WIN_H,
              borderRadius: 18,
              background: "#0b1d6b",
              overflow: "hidden",
            }}
          >
            <Buddy
              size={BUDDY}
              body={p.white}
              eye={p.blueMascot}
              blink={blink}
              look={look}
              style={{
                position: "absolute",
                left: WIN_W / 2 - EYE_CX,
                top: WIN_H / 2 - EYE_CY + (1 - peek) * 140,
              }}
            />
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
            fontSize: 46,
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
            top: 630,
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
