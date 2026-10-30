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
import type { HandleidingProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: -4,
  tagStagger: 5,
  buddyIn: 12, // Buddy pops up, the folded manual still on his head
  button: 24,
  subline: 34,
  logo: 42,
  toss: 54, // Buddy bounces and tosses the manual away: not needed any more
  tossLen: 26,
  happy: 60, // happy eyes while the sheet flies off
  tap: 82,
};

const BUDDY = 190;
const BUDDY_FEET = 262;

/** The folded instruction sheet Buddy wears on his head. */
const FoldedSheet: React.FC<{ label: string; style?: React.CSSProperties }> = ({ label, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: 150,
        height: 110,
        background: p.white,
        borderRadius: 10,
        border: `4px solid ${p.ink}`,
        boxSizing: "border-box",
        padding: "12px 14px",
        fontFamily: fonts.display,
        ...style,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: p.ink, letterSpacing: "-0.02em" }}>{label}</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 6, borderRadius: 3, background: p.grey, marginTop: 10, width: `${90 - i * 18}%` }} />
      ))}
      {/* fold crease */}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, background: p.grey }} />
    </div>
  );
};

export const CtaScene: React.FC<{ props: HandleidingProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (frame >= CTA_T.toss - 6) {
    squash = interpolate(
      frame,
      [CTA_T.toss - 6, CTA_T.toss, CTA_T.toss + 5, CTA_T.toss + 12],
      [1, 0.8, 1.14, 1],
      clamp,
    );
  }
  const happy = frame >= CTA_T.happy && frame < CTA_T.happy + 22;
  const blink = happy
    ? interpolate(frame, [CTA_T.happy, CTA_T.happy + 3, CTA_T.happy + 18, CTA_T.happy + 22], [1, 0.18, 0.18, 1], clamp)
    : blinkScale(frame, [CTA_T.buddyIn + 20, CTA_T.tap + 8]);
  const hop = frame >= CTA_T.toss ? -Math.sin(interpolate(frame, [CTA_T.toss, CTA_T.toss + 14], [0, Math.PI], clamp)) * 40 : 0;
  const idle = frame > CTA_T.toss + 16 ? Math.sin((frame - CTA_T.toss - 16) / 8) * 4 : 0;

  // Sheet: rides on his head, then flies off in an arc to the right.
  const toss = interpolate(frame, [CTA_T.toss, CTA_T.toss + CTA_T.tossLen], [0, 1], clamp);
  const sheetX = toss * 640;
  const sheetY = -Math.sin(toss * Math.PI * 0.75) * 60 + toss * toss * 520;
  const sheetR = -8 + toss * 300;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  const buddyTop = BUDDY_FEET - BUDDY * BUDDY_RATIO + idle + hop;

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
          fontSize: L.headlineSize * 0.96,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
          whiteSpace: "nowrap",
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

      <Stage offsetY={60}>
        <div
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: buddyTop,
            width: BUDDY,
            height: BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Buddy size={BUDDY} body={p.white} eye={p.blueMascot} blink={blink} squash={squash} look={{ x: toss > 0 ? 0.7 : 0, y: toss > 0 ? -0.4 : 0.2 }} />
          {toss < 1 ? (
            <FoldedSheet
              label={props.sheetLabel}
              style={{
                left: BUDDY / 2 - 75 + sheetX,
                top: -86 + (1 - squash) * 40 + sheetY,
                transform: `rotate(${sheetR}deg)`,
                opacity: interpolate(toss, [0.8, 1], [1, 0], clamp),
              }}
            />
          ) : null}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 300,
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
            top: 500,
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
