import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { CTA_H, CtaPill } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { Wordmark } from "../../../components/Wordmark";
import { clamp, pop, springs } from "../../../lib/anim";
import { useLayout } from "../../../lib/layout";
import { usePalette } from "../../../lib/palette";
import { dec, decFonts, decTracking } from "../../theme";
import { Burst } from "../components/Burst";
import type { AftellenProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  headline: -6,
  headStagger: 3,
  burst1: 14, // het vuurwerk knalt, ver weg van de rekeningen
  burst2: 28,
  burst3: 42,
  burstLen: 26, // duur van een knal
  button: 56,
  subline: 66,
  logo: 74,
  tap: 100,
};

const BUDDY = 210;
const FEET = 560;

export const CtaScene: React.FC<{ props: AftellenProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, 2, springs.bouncy);
  // Hij kijkt omhoog naar het vuurwerk en blijft rustig.
  const look = frame < CTA_T.burst1 ? { x: 0, y: 0 } : { x: frame < CTA_T.burst2 ? -0.7 : frame < CTA_T.burst3 ? 0.7 : 0, y: -0.9 };
  const happy = interpolate(frame, [CTA_T.burst1 + 6, CTA_T.burst1 + 12], [1, 0.2], clamp);
  const breathe = 1 + Math.sin(frame / 14) * 0.025;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  const burstT = (start: number) => interpolate(frame, [start, start + CTA_T.burstLen], [0, 1], clamp);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: decFonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 0.94,
          lineHeight: 1.0,
          letterSpacing: decTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, CTA_T.headline + wi++ * CTA_T.headStagger, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? dec.white : p.blueSoft,
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

      <Stage offsetY={30}>
        <Burst x={200} y={230} r={160} t={burstT(CTA_T.burst1)} color={dec.white} />
        <Burst x={880} y={200} r={170} t={burstT(CTA_T.burst2)} color={p.blueSoft} />
        <Burst x={540} y={90} r={140} t={burstT(CTA_T.burst3)} color={dec.white} rays={12} />

        <Buddy
          size={BUDDY}
          body={dec.white}
          eye={p.blueMascot}
          blink={happy}
          squash={breathe * (0.6 + 0.4 * buddyIn)}
          look={look}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 620,
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
                border: `5px solid ${dec.white}`,
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
            top: 790,
            textAlign: "center",
            fontFamily: decFonts.text,
            fontWeight: 400,
            fontSize: 42,
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
            top: 880,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={92} betaal={p.blueSoft} buddy={dec.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
