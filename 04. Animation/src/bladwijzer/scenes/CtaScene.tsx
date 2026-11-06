import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { CLOSED_H, CLOSED_W, ClosedBook } from "../components/Book";
import type { BladwijzerProps } from "../schema";

// Timeline (frames, scene-local).
export const CTA_T = {
  tagline: 4,
  tagStagger: 5,
  book: 10, // the closed book lands
  buddyUp: 20, // Buddy rises out of the top: the bookmark
  button: 30,
  subline: 40,
  logo: 48,
  blink: 58,
  peekDown: 64, // Buddy looks down at the button
  tap: 78,
};

const SCALE = 0.72;
const BOOK = { x: 540 - (CLOSED_W * SCALE) / 2, y: 150 };
const BUDDY = 230; // in book units (book is drawn at SCALE)

export const CtaScene: React.FC<{
  props: BladwijzerProps["cta"];
  bookTitle: string;
}> = ({ props, bookTitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const bookIn = pop(frame, fps, CTA_T.book, springs.pop);
  const up = pop(frame, fps, CTA_T.buddyUp, springs.bouncy);
  const buddyTop = interpolate(up, [0, 1], [10, -175]);
  const squash = interpolate(up, [0, 0.5, 1], [1, 1.18, 1]);
  const blink = blinkScale(frame, [CTA_T.blink]);
  const lookY = interpolate(frame, [CTA_T.peekDown, CTA_T.peekDown + 8], [0, 1], clamp);
  const idle = frame > CTA_T.buddyUp + 20 ? Math.sin((frame - CTA_T.buddyUp - 20) / 7) * 6 : 0;

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

      <Stage offsetY={10}>
        <div
          style={{
            position: "absolute",
            left: BOOK.x,
            top: BOOK.y,
            width: CLOSED_W,
            height: CLOSED_H,
            transform: `scale(${SCALE * (0.6 + 0.4 * bookIn)})`,
            transformOrigin: "0 0",
            opacity: Math.min(1, bookIn * 2),
          }}
        >
          <ClosedBook
            title={bookTitle}
            cover={p.white}
            titleColor={p.blue}
            behind={
              <Buddy
                size={BUDDY}
                body={p.white}
                eye={p.blueMascot}
                blink={blink}
                squash={squash}
                look={{ x: 0, y: lookY }}
                style={{ position: "absolute", left: CLOSED_W / 2 - BUDDY / 2, top: buddyTop + idle }}
              />
            }
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 590,
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
            top: 760,
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
            top: 850,
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
