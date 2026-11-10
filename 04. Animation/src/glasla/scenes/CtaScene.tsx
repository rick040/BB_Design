import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { brand } from "../../theme";
import { Squeegee } from "../components/Glass";
import { type GlaslaProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

const S = SCENE_STARTS[4];
export const CTA_T = {
  tagline: S - 4,
  taglineStagger: 3,
  pane: S - 6,
  wipeStart: S + 4,
  wipeLen: 20,
  hopUp: S + 26,
  logo: wordAt("buddy", 2) - 4,
  subline: wordAt("buddy", 2) + 4,
  tap: VOICE_END - 2,
};

// Frosted pane in front of the button; Buddy wipes it clear with a squeegee.
const PANE = { x: 110, y: 330, w: 860, h: 290 };
const BTN_Y = PANE.y + PANE.h / 2 - CTA_H / 2;

export const CtaScene: React.FC<{ props: GlaslaProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const paneIn = pop(frame, fps, CTA_T.pane, springs.smooth);
  const w = interpolate(frame, [CTA_T.wipeStart, CTA_T.wipeStart + CTA_T.wipeLen], [0, 1], clamp);
  const we = w * w * (3 - 2 * w);
  const bladeX = PANE.x - 20 + (PANE.w + 60) * we;
  const clearW = Math.max(0, bladeX - PANE.x);
  const bladeOut = interpolate(frame, [CTA_T.hopUp - 4, CTA_T.hopUp + 4], [1, 0], clamp);
  const hop = pop(frame, fps, CTA_T.hopUp, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.wipeStart + CTA_T.wipeLen - 4, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const frostFade = interpolate(frame, [CTA_T.hopUp, CTA_T.hopUp + 8], [1, 0], clamp);

  // Buddy pushes the squeegee by its handle, then hops onto the pane.
  const pushPos = { x: bladeX - 150 - 120, y: PANE.y + PANE.h / 2 - 60 };
  const seatPos = { x: PANE.x + PANE.w - 200, y: PANE.y - 140 * BUDDY_RATIO + 6 };
  const bx = pushPos.x + (seatPos.x - pushPos.x) * hop;
  const by = pushPos.y + (seatPos.y - pushPos.y) * hop - Math.sin(Math.PI * Math.min(1, hop)) * 80;
  const buddyIn = pop(frame, fps, CTA_T.wipeStart - 6, springs.bouncy);

  const button = (blur: number) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: BTN_Y,
        width: 1080,
        display: "flex",
        justifyContent: "center",
        filter: blur ? `blur(${blur}px)` : undefined,
        transform: `scale(${1.25 * tap})`,
      }}
    >
      <CtaPill text={props.button} arrowIn={blur ? 1 : arrowIn} />
    </div>
  );

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.tagline} color={p.white} delay={CTA_T.tagline} stagger={CTA_T.taglineStagger} sizeFactor={1.15} />
      <Stage offsetY={30}>
        {/* sharp button, revealed left of the blade */}
        <div style={{ position: "absolute", inset: 0, clipPath: frostFade < 1 ? undefined : `inset(0 ${1080 - PANE.x - clearW}px 0 0)` }}>
          {button(0)}
        </div>
        {/* frosted part, right of the blade */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: paneIn * frostFade,
            clipPath: `inset(0 0 0 ${PANE.x + clearW}px)`,
          }}
        >
          {button(16)}
          <div
            style={{
              position: "absolute",
              left: PANE.x,
              top: PANE.y,
              width: PANE.w,
              height: PANE.h,
              borderRadius: 34,
              background: "rgba(255,255,255,0.42)",
            }}
          />
        </div>
        {/* glass frame */}
        <div
          style={{
            position: "absolute",
            left: PANE.x,
            top: PANE.y,
            width: PANE.w,
            height: PANE.h,
            borderRadius: 34,
            border: `6px solid ${p.white}`,
            boxSizing: "border-box",
            opacity: paneIn * (0.35 + 0.65 * frostFade),
          }}
        />
        <div style={{ opacity: bladeOut * buddyIn }}>
          <Squeegee x={bladeX} top={PANE.y - 20} height={PANE.h + 40} color={brand.yellow} handle={brand.yellow} />
        </div>
        <Buddy
          size={140}
          body={p.white}
          eye={p.blueMascot}
          blink={frame > CTA_T.hopUp + 14 ? blinkScale(frame, [CTA_T.tap - 14]) : 1}
          look={hop > 0.5 ? { x: -0.6, y: 0.7 } : { x: 1, y: 0 }}
          squash={hop > 0.9 ? interpolate(frame, [CTA_T.hopUp + 10, CTA_T.hopUp + 14, CTA_T.hopUp + 20], [1, 0.82, 1], clamp) : 1}
          style={{ position: "absolute", left: bx, top: by, opacity: Math.min(1, buddyIn * 3) }}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: PANE.y + PANE.h + 50,
            textAlign: "center",
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
            top: PANE.y + PANE.h + 150,
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
