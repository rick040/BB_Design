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
import { Boomerang, Trail } from "../components/Flight";
import { type BoemerangProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  buddyIn: S - 4,
  throw: wordAt("hij", 2),
  catch: wordAt("activeer") - 6,
  button: wordAt("activeer"),
  subline: wordAt("activeer") + 12,
  logo: wordAt("activeer") + 6,
  tap: VOICE_END - 2,
};
// Tagline words land on the spoken words.
const SPOKEN = [wordAt("nu"), wordAt("komt", 2), wordAt("hij", 2), wordAt("op"), wordAt("tijd"), wordAt("terug", 2)];

const BUDDY = 190;
const FEET = 330;
const HAND = { x: 540 + 120, y: FEET - 120 };
// Loop around the button area and back into Buddy's hand.
const loop = (u: number) => {
  const a = -Math.PI / 2 + 0.35 + 2 * Math.PI * u;
  return { x: 540 + 470 * Math.cos(a), y: 470 + 260 * Math.sin(a) };
};

export const CtaScene: React.FC<{ props: BoemerangProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const u = interpolate(frame, [CTA_T.throw, CTA_T.catch], [0, 1], clamp);
  const flying = frame >= CTA_T.throw && frame < CTA_T.catch;
  const bPos = flying ? loop(u) : frame < CTA_T.throw ? HAND : loop(1);
  const bRot = flying ? 1440 * u : 0;
  const throwSq = interpolate(frame, [CTA_T.throw - 5, CTA_T.throw, CTA_T.throw + 6], [1, 0.86, 1], clamp);
  const catchSq = interpolate(frame, [CTA_T.catch, CTA_T.catch + 3, CTA_T.catch + 9], [1, 0.84, 1], clamp);
  const squash = frame < CTA_T.buddyIn + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : Math.min(throwSq, catchSq);
  const lookA = flying ? -Math.PI / 2 + 2 * Math.PI * u : 0;
  const look = flying ? { x: Math.cos(lookA), y: Math.sin(lookA) * 0.8 } : { x: 0.3, y: 0.4 };

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
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.catch + 14])}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        {flying ? <Trail at={loop} u={u} length={0.25} color={p.blueSoft} dot={20} /> : null}
        <div
          style={{
            position: "absolute",
            left: bPos.x - 60,
            top: bPos.y - 60,
            width: 120,
            height: 120,
            transform: `rotate(${bRot - 20}deg) scale(${Math.min(1, buddyIn)})`,
          }}
        >
          <Boomerang size={120} color={p.yellow} />
        </div>

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
