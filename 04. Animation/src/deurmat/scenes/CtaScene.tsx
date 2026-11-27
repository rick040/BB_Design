import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Doormat, SpokenHeadline } from "../components/parts";
import { type DeurmatProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S + 2, // "Net op jezelf. Niet alleen."
  taglineStagger: 3,
  button: wordAt("activeer"),
  subline: wordAt("activeer") + 10,
  logo: wordAt("activeer") + 6,
  tap: VOICE_END - 2,
};

const BUDDY = 170;
const MAT_Y = 1360;

export const CtaScene: React.FC<{ props: DeurmatProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const words = props.tagline.split(/\s+/).filter(Boolean).length;
  const at = Array.from({ length: words }, (_, i) => CTA_T.tagline + i * CTA_T.taglineStagger);

  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  // Buddy wipes his feet on the mat: little side-to-side shuffle.
  const wipe = Math.sin(((frame - S) / 30) * Math.PI * 2 * 1.6);
  const shuffle = 22 * wipe;
  const sq = 1 - 0.05 * Math.abs(wipe);

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline text={props.tagline} at={at} c1={p.white} c2={p.blueSoft} top={240} size={120} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
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
          top: 820,
          textAlign: "center",
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 46,
          color: p.blueText,
          opacity: subIn,
        }}
      >
        {props.subline}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", opacity: logoIn, transform: `translateY(${(1 - logoIn) * 40}px)` }}>
        <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
      </div>

      {/* doormat with Buddy wiping his feet */}
      <div style={{ position: "absolute", left: 240, top: MAT_Y }}>
        <Doormat text={props.mat} w={600} h={130} color={p.light} textColor={p.blue} />
      </div>
      <Buddy
        size={BUDDY}
        body={p.white}
        eye={p.blueMascot}
        squash={sq}
        look={{ x: wipe * 0.3, y: 0.5 }}
        blink={blinkScale(frame, [S + 20, VOICE_END - 10])}
        style={{
          position: "absolute",
          left: 540 - BUDDY / 2 + shuffle,
          top: MAT_Y + 40 - BUDDY * BUDDY_RATIO,
          transformOrigin: "50% 100%",
        }}
      />
    </SceneBg>
  );
};
