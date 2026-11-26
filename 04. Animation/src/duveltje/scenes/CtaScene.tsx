import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { JackBox } from "../components/JackBox";
import { type DuveltjeProps, SCENE_STARTS, TOTAL_FRAMES, VOICE_END, wordAt } from "../schema";

// Slot: Buddy himself is the jack-in-the-box. He springs out on "draait".
export const CTA_T = {
  start: SCENE_STARTS[3],
  crank: SCENE_STARTS[3] + 4,
  out: wordAt("draait"),
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 12,
  tap: Math.min(VOICE_END - 2, TOTAL_FRAMES - 22),
};
const SPOKEN = [wordAt("hij"), wordAt("springt", 2), wordAt("pas"), wordAt("als", 2), wordAt("jij", 2), wordAt("draait")];

const BOX_BOTTOM = 1150;
const BOX_W = 250;
const BUD = 170;

export const CtaScene: React.FC<{ props: DuveltjeProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const out = pop(frame, fps, CTA_T.out, springs.bouncy);
  const isOut = frame >= CTA_T.out;
  const crank = frame < CTA_T.out ? (frame - CTA_T.crank) * 9 : (CTA_T.out - CTA_T.crank) * 9;
  const spring = isOut ? 190 * out : 0;
  const lid = isOut ? Math.min(1, out * 1.4) : 0;
  const squash = isOut ? interpolate(out, [0, 0.5, 0.8, 1], [0.6, 1.2, 0.92, 1]) : 1;
  const sway = isOut ? Math.sin((frame - CTA_T.out) * 0.25) * 6 * Math.max(0, 1 - (frame - CTA_T.out) / 60) : 0;

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
          fontSize: L.headlineSize * 1.15,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const at = SPOKEN[wi] ?? SPOKEN[SPOKEN.length - 1];
              wi++;
              // first word already visible at the cut so the frame is never empty
              const s = pop(frame, fps, Math.max(at - 3, CTA_T.start - 6), springs.pop);
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

      <JackBox
        cx={540}
        bottom={BOX_BOTTOM}
        w={BOX_W}
        body={p.blueSoft}
        trim={p.blue}
        crank={crank}
        lid={lid}
        spring={spring}
        crankColor={p.white}
        springColor={p.white}
        rot={sway * 0.3}
      >
        <div style={{ transform: `rotate(${sway}deg)`, transformOrigin: "50% 100%" }}>
          <Buddy
            size={BUD}
            body={p.white}
            eye={p.blueMascot}
            squash={squash}
            blink={frame > CTA_T.out + 30 ? blinkScale(frame, [CTA_T.out + 40]) : isOut ? 0.25 : 1}
            look={{ x: 0, y: 0.3 }}
            style={{ position: "relative", width: BUD, height: BUD * BUDDY_RATIO }}
          />
        </div>
      </JackBox>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1215,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${1.25 * btnIn * tap})`,
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
          top: 1385,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 42,
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
          top: 1465,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 30}px)`,
        }}
      >
        <Wordmark size={80} betaal={p.blueSoft} buddy={p.white} />
      </div>
    </SceneBg>
  );
};
