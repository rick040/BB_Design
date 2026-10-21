import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { CTA_H, CtaPill } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { Wordmark } from "../../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { useLayout } from "../../../lib/layout";
import { usePalette } from "../../../lib/palette";
import { dec, decFonts, decTracking } from "../../theme";
import type { AdventProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: -6,
  tagStagger: 3,
  door: 8, // het slotdeurtje (24) komt in beeld
  leaf: 26, // het blad zwaait open
  buddy: 32, // Buddy komt omhoog uit het deurtje
  button: 48,
  subline: 58,
  logo: 66,
  blink: 62,
  tap: 88,
};

const DOOR_W = 350;
const DOOR_H = 430;
const FRAME_PAD = 22;

export const CtaScene: React.FC<{ props: AdventProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const doorIn = pop(frame, fps, CTA_T.door, springs.pop);
  const leafOpen = interpolate(frame, [CTA_T.leaf, CTA_T.leaf + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
  const rise = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const BUDDY = 230;
  const buddyY = interpolate(rise, [0, 1], [DOOR_H - 20, DOOR_H - BUDDY * BUDDY_RATIO + 8]);
  const squash = interpolate(rise, [0, 0.6, 1], [0.75, 1.1, 1]);
  const blink = blinkScale(frame, [CTA_T.blink]);

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
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: decFonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 0.88,
          lineHeight: 1.0,
          letterSpacing: decTracking,
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

      <Stage offsetY={70}>
        {/* Het slotdeurtje: Buddy staat erin */}
        <div
          style={{
            position: "absolute",
            left: 540 - DOOR_W / 2 - FRAME_PAD,
            top: 0,
            width: DOOR_W + FRAME_PAD * 2,
            height: DOOR_H + FRAME_PAD,
            borderRadius: "40px 40px 18px 18px",
            background: dec.deep,
            opacity: Math.min(1, doorIn * 2),
            transform: `scale(${0.85 + 0.15 * doorIn})`,
            transformOrigin: "50% 100%",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: FRAME_PAD,
              top: FRAME_PAD,
              width: DOOR_W,
              height: DOOR_H - FRAME_PAD,
              perspective: 900,
              perspectiveOrigin: "0% 50%",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "26px 26px 8px 8px",
                background: dec.ink,
                overflow: "hidden",
              }}
            >
              <Buddy
                size={BUDDY}
                body={dec.white}
                eye={p.blueMascot}
                blink={blink}
                squash={squash}
                look={{ x: 0, y: 0.7 }}
                style={{ position: "absolute", left: (DOOR_W - BUDDY) / 2, top: buddyY - FRAME_PAD }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "26px 26px 8px 8px",
                background: dec.white,
                transformOrigin: "0% 50%",
                transform: `rotateY(${-leafOpen * 118}deg)`,
                backfaceVisibility: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontFamily: decFonts.display, fontWeight: 500, fontSize: 190, color: dec.blue, letterSpacing: decTracking, lineHeight: 1 }}>
                {props.doorNumber}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 535,
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
            top: 715,
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
            top: 810,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={dec.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
