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
import { Medal, Podium, PODIUM_STEPS } from "../components/Track";
import type { EstafetteProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  podium: 10, // podium rises
  buddyIn: 16, // Buddy pops up on step 2 ...
  hop: 24, // ... and hops over to step 1
  medal: 48, // medal pops onto his chest
  button: 30,
  subline: 44,
  logo: 54,
  happy: 58, // happy eyes
  tap: 84,
};

const BUDDY = 190;
const PODIUM_BASE = 360; // floor line of the podium (stage px)
const PODIUM_TOP = PODIUM_BASE - PODIUM_STEPS.first;

export const CtaScene: React.FC<{ props: EstafetteProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  // Tagline: first line white, the rest soft blue; words pop one by one.
  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const rise = pop(frame, fps, CTA_T.podium, springs.smooth);

  // Buddy jumps up onto the podium in an arc from below-left.
  const appear = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const jumpT = interpolate(frame, [CTA_T.hop, CTA_T.hop + 14], [0, 1], clamp);
  const step2 = PODIUM_BASE - PODIUM_STEPS.second;
  const feetY = step2 + (PODIUM_TOP - step2) * jumpT - 70 * 4 * jumpT * (1 - jumpT);
  const step2X = 540 - PODIUM_STEPS.width - 5;
  const buddyX = step2X + (540 - step2X) * Easing.inOut(Easing.quad)(jumpT);
  const squash =
    frame < CTA_T.hop
      ? interpolate(appear, [0, 0.6, 1], [0.5, 1.1, 1])
      : jumpT < 1
        ? interpolate(jumpT, [0, 0.15, 0.6, 1], [0.8, 1.15, 1.05, 1], clamp)
        : interpolate(
            frame,
            [CTA_T.hop + 14, CTA_T.hop + 17, CTA_T.hop + 23, CTA_T.medal + 2, CTA_T.medal + 5, CTA_T.medal + 10],
            [1, 0.82, 1, 1, 0.92, 1],
            clamp,
          );
  const idle = frame > CTA_T.medal + 16 ? Math.sin((frame - CTA_T.medal - 16) / 8) * 3 : 0;
  const happy = interpolate(frame, [CTA_T.happy, CTA_T.happy + 5], [1, 0.18], clamp);
  const blink = frame >= CTA_T.happy ? happy : blinkScale(frame, [CTA_T.hop + 18]);
  const buddyTop = feetY - BUDDY * BUDDY_RATIO + idle;

  // Medal pops onto his chest and swings to rest.
  const medalIn = pop(frame, fps, CTA_T.medal, springs.bouncy);
  const medalSwing = frame > CTA_T.medal ? Math.sin((frame - CTA_T.medal) / 3) * 16 * Math.exp(-(frame - CTA_T.medal) / 14) : 0;
  const medalTop = buddyTop + BUDDY * BUDDY_RATIO * 0.36;

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
          left: L.sidePadding - 20,
          right: L.sidePadding - 20,
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

      <Stage offsetY={40}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PODIUM_BASE + 10, overflow: "hidden" }}>
          <Podium cx={540} base={PODIUM_BASE} color={p.white} side={p.blueSoft} shade="rgba(1,59,255,0.12)" numberColor={p.blue} rise={rise} />
        </div>

        {frame >= CTA_T.buddyIn ? (
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            squash={squash}
            look={{ x: 0, y: 0.25 }}
            style={{ position: "absolute", left: buddyX - BUDDY / 2, top: buddyTop, opacity: Math.min(1, appear * 3) }}
          />
        ) : null}

        {frame >= CTA_T.medal ? (
          <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${0.62 * medalIn})`, transformOrigin: `${buddyX}px ${medalTop}px` }}>
            <Medal cx={buddyX} top={medalTop} swing={medalSwing} ribbon={p.blueSoft} disc={p.yellow} text={props.medal} textColor={p.blue} />
          </div>
        ) : null}

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
            top: 590,
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
            top: 720,
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
