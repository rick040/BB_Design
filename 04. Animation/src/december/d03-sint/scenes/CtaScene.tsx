import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../../components/Buddy";
import { CTA_H, CtaPill } from "../../../components/CtaPill";
import { SceneBg, Stage } from "../../../components/Stage";
import { Wordmark } from "../../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { Book } from "../Book";
import type { SintProps } from "../schema";

// Beats (frames, scene-lokaal).
export const CTA_T = {
  headline: 4,
  book: 6, // het boek komt terug, nu in het klein
  button: 14,
  buddy: 22, // Buddy kijkt over de rand van het boek
  subline: 40,
  logo: 46,
  blink: 52,
  tap: 78,
};

const BUDDY = 250;
const BOOK_SCALE = 0.68;
const BOOK_TOP = 440; // bovenkant van het boek in Stage-coördinaten

export const CtaScene: React.FC<{ props: SintProps["cta"]; book: SintProps["book"]; coverTitle: string }> = ({
  props,
  book,
  coverTitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const bookIn = pop(frame, fps, CTA_T.book, springs.bouncy);
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const nudge = frame > CTA_T.button + 14 ? Math.max(0, Math.sin((frame - CTA_T.button - 14) / 4)) * 8 : 0;

  // Buddy komt omhoog achter het boek vandaan
  const up = pop(frame, fps, CTA_T.buddy, springs.bouncy);
  const buddyTop = interpolate(up, [0, 1], [BOOK_TOP + 30, BOOK_TOP - 150]);
  const idle = frame > CTA_T.buddy + 24 ? Math.sin((frame - CTA_T.buddy) / 9) * 5 : 0;
  const blink = blinkScale(frame, [CTA_T.blink]);
  const look = { x: interpolate(frame, [CTA_T.buddy, CTA_T.buddy + 30], [0.6, -0.1], clamp), y: 0.1 };

  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={p.white} delay={CTA_T.headline} stagger={4} sizeFactor={1.15} />

      <Stage offsetY={30}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 50,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.15 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
            zIndex: 4,
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

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          look={look}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: buddyTop + idle,
            opacity: Math.min(1, up * 3),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 140,
            top: BOOK_TOP,
            transform: `scale(${BOOK_SCALE * (0.6 + 0.4 * bookIn)})`,
            transformOrigin: "50% 0%",
            opacity: Math.min(1, bookIn * 2),
          }}
        >
          <Book
            open={1}
            rows={book.rows}
            rowOn={() => 1}
            coverTitle={coverTitle}
            cover={p.red}
            coverAccent={p.blueSoft}
            ink={p.ink}
            accent={p.blue}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 826,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={76} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>

      <DSubline text={props.subline} color={p.blueText} delay={CTA_T.subline} />
    </SceneBg>
  );
};
