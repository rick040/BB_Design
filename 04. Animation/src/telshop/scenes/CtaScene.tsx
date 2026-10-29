import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { CallBar, Starburst } from "../components/Telshop";
import type { TelshopProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  bar: 4, // yellow "BEL NU!" bar slides in
  tagline: 8, // "Niet bellen." ...
  tagStagger: 4,
  drop: 16, // Buddy drops from above ...
  land: 24, // ... lands on the bar and stamps it out
  strikeLen: 8,
  line2: 32, // ... "Gewoon doorsturen."
  button: 44,
  bursts: 56, // "Geen app!" and "Geen bankkoppeling!" starbursts
  burstStagger: 6,
  logo: 68,
  wink: 76, // Buddy winks at the viewer from his spot on the bar
  tap: 86,
};

const BAR = { x: 230, y: 200, w: 620 };
const BUDDY = 170;

export const CtaScene: React.FC<{ props: TelshopProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  const wordDelay = (li: number, i: number) =>
    li === 0 ? CTA_T.tagline + i * CTA_T.tagStagger : CTA_T.line2 + i * CTA_T.tagStagger;

  const barIn = pop(frame, fps, CTA_T.bar, springs.pop);
  const strike = interpolate(frame, [CTA_T.land, CTA_T.land + CTA_T.strikeLen], [0, 1], clamp);
  const hit = shake(frame, CTA_T.land, 12, 8);
  const tilt = frame >= CTA_T.land ? -3 * pop(frame, fps, CTA_T.land, springs.bouncy) : 0;

  // Buddy falls onto the bar, squashes, then stays there (closing image).
  const fall = interpolate(frame, [CTA_T.drop, CTA_T.land], [0, 1], { ...clamp, easing: (t) => t * t });
  const feet = BAR.y + 4;
  const buddyTop = interpolate(fall, [0, 1], [feet - BUDDY * BUDDY_RATIO - 160, feet - BUDDY * BUDDY_RATIO]);
  const lt = frame - CTA_T.land;
  const squash = lt < 0 ? 1.1 : interpolate(lt, [0, 3, 8, 14], [0.7, 1.12, 0.96, 1], clamp);
  const wink = frame >= CTA_T.wink && frame < CTA_T.wink + 8 ? 0.1 : blinkScale(frame, [CTA_T.land + 30]);
  const idle = lt > 14 ? Math.sin((lt - 14) / 9) * 3 : 0;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding - 40,
          right: L.sidePadding - 40,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 0.98,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, wordDelay(li, i), springs.pop);
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
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 900,
            transform: `translate(${hit.x}px, ${hit.y}px)`,
          }}
        >
          <CallBar
            text={props.callBar}
            strike={strike}
            w={BAR.w}
            style={{
              left: BAR.x + (1 - barIn) * -900,
              top: BAR.y,
              transform: `rotate(${tilt}deg)`,
            }}
          />
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={wink}
            squash={squash}
            look={frame >= CTA_T.wink ? { x: 0.3, y: 0.3 } : { x: 0, y: 0.6 }}
            style={{
              position: "absolute",
              left: 540 - BUDDY / 2 + 120,
              top: buddyTop + idle,
              opacity: interpolate(frame, [CTA_T.drop, CTA_T.drop + 3], [0, 1], clamp),
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 390,
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

        {props.bursts.map((b, i) => {
          const f = CTA_T.bursts + i * CTA_T.burstStagger;
          const t = frame >= f ? pop(frame, fps, f, springs.bouncy) : 0;
          return (
            <Starburst
              key={i}
              text={b}
              size={250}
              t={t}
              rotate={i === 0 ? -10 : 8}
              fontSize={37}
              style={{ left: i === 0 ? 180 : 650, top: 530 }}
            />
          );
        })}

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
          <Wordmark size={88} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
