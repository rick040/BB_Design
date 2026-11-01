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
import { Marker, MARKER_H } from "../components/Labels";
import type { NaambordProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 6,
  tagStagger: 5,
  button: 22,
  subline: 34,
  logo: 44,
  buddyIn: 36, // Buddy comes in from the right with his marker
  draw: 50, // he draws a yellow arrow down to the button
  drawLen: 20,
  head: 70, // arrowhead
  headLen: 6,
  tap: 82, // button dips, ripple
  happy: 84, // Buddy lifts the marker, happy squint
};

const BUDDY = 150;
const MARKER_ANGLE = -25;
const REST_ANGLE = -60;
const BTN_Y = 430; // top of the button row (stage)
// Hand-drawn arrow: from the upper right, curling down onto the button.
const P0 = { x: 720, y: 250 };
const P1 = { x: 600, y: 205 };
const P2 = { x: 492, y: 280 };
const P3 = { x: 468, y: 398 };
// Where the marker tip rests afterwards (Buddy to the upper right of the arrow).
const REST = { x: 790, y: 336 };
const bez = (t: number) => {
  const u = 1 - t;
  return {
    x: u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x,
    y: u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y,
  };
};
const HEAD_L = { x: P3.x - 32, y: P3.y - 32 };
const HEAD_R = { x: P3.x + 34, y: P3.y - 28 };

export const CtaScene: React.FC<{ props: NaambordProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;
  const subIn = interpolate(frame, [CTA_T.subline, CTA_T.subline + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  // Arrow drawing and the marker tip that follows it.
  const draw = interpolate(frame, [CTA_T.draw, CTA_T.draw + CTA_T.drawLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const head = interpolate(frame, [CTA_T.head, CTA_T.head + CTA_T.headLen], [0, 1], clamp);
  let tip = bez(draw);
  if (frame < CTA_T.draw) {
    const t = pop(frame, fps, CTA_T.buddyIn, { damping: 16, stiffness: 120 });
    tip = { x: interpolate(t, [0, 1], [1300, P0.x]), y: P0.y - Math.sin(t * Math.PI) * 60 };
  } else if (frame >= CTA_T.head) {
    // Short flick for the arrowhead, then the marker lifts.
    const h1 = interpolate(head, [0, 0.5], [0, 1], clamp);
    const h2 = interpolate(head, [0.5, 1], [0, 1], clamp);
    tip = head < 0.5
      ? { x: interpolate(h1, [0, 1], [P3.x, HEAD_L.x]), y: interpolate(h1, [0, 1], [P3.y, HEAD_L.y]) }
      : { x: interpolate(h2, [0, 1], [P3.x, HEAD_R.x]), y: interpolate(h2, [0, 1], [P3.y, HEAD_R.y]) };
  }
  const lift = interpolate(frame, [CTA_T.happy, CTA_T.happy + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tipShown = { x: interpolate(lift, [0, 1], [tip.x, REST.x]), y: interpolate(lift, [0, 1], [tip.y, REST.y]) - Math.sin(lift * Math.PI) * 50 };
  const angleNow = interpolate(lift, [0, 1], [MARKER_ANGLE, REST_ANGLE]);
  const rad = (angleNow * Math.PI) / 180;
  const backEnd = { x: tipShown.x + Math.cos(rad) * 200, y: tipShown.y + Math.sin(rad) * 200 };
  const drawing = frame >= CTA_T.draw && frame < CTA_T.head + CTA_T.headLen;
  const blink = frame >= CTA_T.happy
    ? interpolate(frame, [CTA_T.happy, CTA_T.happy + 6], [1, 0.2], clamp)
    : blinkScale(frame, [CTA_T.buddyIn + 10]);
  const squash = frame >= CTA_T.happy
    ? interpolate(frame, [CTA_T.happy, CTA_T.happy + 5, CTA_T.happy + 11, CTA_T.happy + 16], [1, 0.86, 1.1, 1], clamp)
    : 1;
  const idle = frame > CTA_T.happy + 16 ? Math.sin((frame - CTA_T.happy - 16) / 7) * 4 : 0;

  // Partial arrow path as a polyline (so the stroke ends exactly at the tip).
  const N = 40;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * draw;
    const q = bez(t);
    pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`);
  }
  const headL = interpolate(head, [0, 0.5], [0, 1], clamp);
  const headR = interpolate(head, [0.5, 1], [0, 1], clamp);

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

      <Stage offsetY={30}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BTN_Y,
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

        {/* Yellow marker arrow */}
        <svg width={1080} height={600} viewBox="0 0 1080 600" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {draw > 0 ? (
            <polyline points={pts.join(" ")} fill="none" stroke={p.yellow} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
          ) : null}
          {headL > 0 ? (
            <line
              x1={P3.x}
              y1={P3.y}
              x2={P3.x + (HEAD_L.x - P3.x) * headL}
              y2={P3.y + (HEAD_L.y - P3.y) * headL}
              stroke={p.yellow}
              strokeWidth={13}
              strokeLinecap="round"
            />
          ) : null}
          {headR > 0 ? (
            <line
              x1={P3.x}
              y1={P3.y}
              x2={P3.x + (HEAD_R.x - P3.x) * headR}
              y2={P3.y + (HEAD_R.y - P3.y) * headR}
              stroke={p.yellow}
              strokeWidth={13}
              strokeLinecap="round"
            />
          ) : null}
        </svg>

        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: BTN_Y + 200,
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
            top: BTN_Y + 350,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>

        {/* Marker + Buddy */}
        <div
          style={{
            position: "absolute",
            left: tipShown.x,
            top: tipShown.y - MARKER_H / 2 + idle,
            transformOrigin: `0px ${MARKER_H / 2}px`,
            transform: `rotate(${angleNow + (drawing ? Math.sin(frame / 1.8) * 3 : 0)}deg)`,
          }}
        >
          <Marker body={p.yellow} ink={p.ink} capOn={false} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: -0.7, y: 0.6 }}
          style={{
            position: "absolute",
            left: backEnd.x - BUDDY * 0.3,
            top: backEnd.y - BUDDY * BUDDY_RATIO * 0.75 + idle,
          }}
        />
      </Stage>
    </SceneBg>
  );
};
