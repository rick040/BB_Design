import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Paddle, SpokenHeadline } from "../components/Table";
import { SCENE_STARTS, type TafeltennisProps, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
// Buddy keeps a ball up on his paddle; the last hit drops it on the arrow of the button.
export const CTA_T = {
  buddyIn: S - 4,
  button: wordAt("activeer") + 6,
  keepUp1: S + 2,
  keepUp2: S + 11,
  keepUp3: S + 20,
  shot: S + 28,
  tap: VOICE_END - 2,
  logo: wordAt("activeer") + 12,
  subline: wordAt("activeer") + 18,
};
const HITS = [CTA_T.keepUp1, CTA_T.keepUp2, CTA_T.keepUp3, CTA_T.shot];

const BUDDY = 200;
const BX = 820;
const FEET = 330;
const PAD = { x: BX + 74, y: FEET - 215 };
const REST = { x: PAD.x + 46, y: PAD.y - 4 };
// Arrow circle of the scaled CTA pill (pill centred, scale 1.3, top 420).
const ARROW = { x: 278, y: 472 };

export const CtaScene: React.FC<{ props: TafeltennisProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const words = props.tagline.split(/\s+/).filter(Boolean).length;
  const at = Array.from({ length: words }, (_, i) => S - 4 + i * 4);

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);

  // Ball: small hops between keep-ups, then a long shot onto the arrow.
  let ball = { ...REST };
  let ballOn = frame >= CTA_T.keepUp1 - 2 && frame < CTA_T.tap + 1;
  for (let i = 0; i < HITS.length - 1; i++) {
    if (frame >= HITS[i] && frame < HITS[i + 1]) {
      const u = (frame - HITS[i]) / (HITS[i + 1] - HITS[i]);
      ball = { x: REST.x, y: REST.y - 150 * Math.sin(Math.PI * u) };
    }
  }
  if (frame >= CTA_T.shot) {
    const u = interpolate(frame, [CTA_T.shot, CTA_T.tap], [0, 1], clamp);
    ball = {
      x: REST.x + (ARROW.x - REST.x) * u,
      y: REST.y + (ARROW.y - REST.y) * u - 220 * Math.sin(Math.PI * u),
    };
  }
  const nearHit = HITS.some((h) => frame >= h - 3 && frame <= h + 2);
  const swing = HITS.reduce((acc, h) => acc + interpolate(frame, [h - 3, h, h + 4], [0, 1, 0], clamp), 0);
  const squash = frame < CTA_T.buddyIn + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : nearHit ? 0.92 : 1;
  const lookUp = frame < CTA_T.shot ? { x: 0.5, y: -0.9 } : { x: -1, y: 0.4 };

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  if (frame >= CTA_T.tap) ballOn = false;

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline
        text={props.tagline}
        at={at}
        first={p.white}
        rest={p.blueSoft}
        sizeFactor={1.2}
        top={L.safeTop - 10}
        left={L.sidePadding}
        size={L.headlineSize}
      />
      <Stage offsetY={40}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 420,
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

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.tap + 6])}
          squash={squash}
          look={lookUp}
          style={{
            position: "absolute",
            left: BX - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <Paddle
          size={92}
          rubber={p.yellow}
          handle={p.blueMascot}
          style={{
            left: PAD.x,
            top: PAD.y,
            transform: `rotate(${10 - 14 * swing}deg) scale(${Math.min(1, buddyIn)})`,
            transformOrigin: "50% 90%",
          }}
        />
        {ballOn ? (
          <div
            style={{
              position: "absolute",
              left: ball.x - 20,
              top: ball.y - 20,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: p.white,
              boxShadow: "0 6px 16px rgba(0, 10, 80, 0.35)",
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 610,
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
            top: 730,
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
