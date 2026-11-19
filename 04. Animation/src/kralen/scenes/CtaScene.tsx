import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO, BUDDY_VIEWBOX } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { useBeadColors } from "../components/Bead";
import { type KralenProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S - 4,
  buddyIn: S - 2,
  firstBead: S + 4, // necklace beads click on one by one
  beadStagger: 3,
  button: wordAt("activeer") + 6,
  logo: wordAt("buddy", 2),
  subline: wordAt("buddy", 2) + 6,
  tap: VOICE_END + 2,
};

const BUDDY = 260;
const FEET = 330;
// Necklace curve in Buddy's own viewBox (465 × 506).
const NECK = { x1: 30, y1: 300, cx: 232, cy: 470, x2: 440, y2: 300 };
const neckPoint = (t: number) => {
  const u = 1 - t;
  return {
    x: u * u * NECK.x1 + 2 * u * t * NECK.cx + t * t * NECK.x2,
    y: u * u * NECK.y1 + 2 * u * t * NECK.cy + t * t * NECK.y2,
  };
};

export const CtaScene: React.FC<{ props: KralenProps["cta"]; beads: KralenProps["beads"] }> = ({ props, beads }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const colors = useBeadColors();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const buddyIn = pop(frame, fps, CTA_T.buddyIn, springs.bouncy);
  const lastBead = CTA_T.firstBead + (beads.length - 1) * CTA_T.beadStagger;
  // A proud little hop once the necklace is complete.
  const hop = interpolate(frame, [lastBead + 4, lastBead + 11, lastBead + 18], [0, -46, 0], clamp);
  const land = interpolate(frame, [lastBead + 18, lastBead + 21, lastBead + 27], [1, 0.86, 1], clamp);
  const squash = frame < CTA_T.buddyIn + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : land;
  const proud = frame >= lastBead + 8 && frame < lastBead + 30;

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  const bx = 540 - BUDDY / 2;
  const by = FEET - BUDDY * BUDDY_RATIO + hop;

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
              const s = pop(frame, fps, CTA_T.tagline + wi++ * 3, springs.pop);
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

      <Stage offsetY={20}>
        <div
          style={{
            position: "absolute",
            left: bx,
            top: by,
            width: BUDDY,
            height: BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={proud ? 0.18 : blinkScale(frame, [lastBead + 40])}
            squash={squash}
            look={{ x: 0, y: proud ? 0 : 0.6 }}
            style={{ position: "absolute", left: 0, top: 0 }}
          />
          {/* necklace: thread + the five beads, in date order */}
          <svg
            viewBox={`0 0 ${BUDDY_VIEWBOX.width} ${BUDDY_VIEWBOX.height}`}
            width={BUDDY}
            height={BUDDY * BUDDY_RATIO}
            style={{ position: "absolute", left: 0, top: 0, overflow: "visible", transform: `scale(1, ${squash}) scale(${1 / Math.sqrt(squash)}, 1)`, transformOrigin: "50% 100%" }}
          >
            <path
              d={`M ${NECK.x1} ${NECK.y1} Q ${NECK.cx} ${NECK.cy} ${NECK.x2} ${NECK.y2}`}
              fill="none"
              stroke={p.yellow}
              strokeWidth={11}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - interpolate(frame, [CTA_T.buddyIn, CTA_T.firstBead], [0, 1], clamp)}
            />
            {beads.map((_, i) => {
              const s = pop(frame, fps, CTA_T.firstBead + i * CTA_T.beadStagger, springs.pop);
              const pt = neckPoint(0.14 + i * 0.18);
              return (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r={42 * s}
                  fill={colors[i].fill}
                  stroke={p.blue}
                  strokeOpacity={0.15}
                  strokeWidth={4}
                />
              );
            })}
          </svg>
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
