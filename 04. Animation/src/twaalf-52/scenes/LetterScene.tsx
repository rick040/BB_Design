import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Envelope } from "../../components/Envelope";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import type { TwaalfProps } from "../schema";

// Timeline (frames, scene-local).
export const LETTER_T = {
  envelope: 4, // a plain envelope drops in (no imitation letter)
  flips: 18, // day pages flip, one every flipStagger frames
  flipStagger: 3,
  badge: 16, // yellow dot on the envelope
};

const BLOCK = { x: 420, y: 170, w: 420, h: 470 };
const HEADER_H = 96;

export const LetterScene: React.FC<{ props: TwaalfProps["letter"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const env = interpolate(frame, [LETTER_T.envelope, LETTER_T.envelope + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const badge = pop(frame, fps, LETTER_T.badge, springs.bouncy);
  const blockIn = pop(frame, fps, 0, springs.smooth);

  const total = Math.max(1, props.toDay - props.fromDay);
  const t = (frame - LETTER_T.flips) / LETTER_T.flipStagger;
  const k = Math.max(0, Math.min(total, Math.floor(t) + 1));
  const flipping = t >= 0 && Math.floor(t) < total;
  const flipU = flipping ? t - Math.floor(t) : 0;
  const shown = props.fromDay + (t < 0 ? 0 : k);
  const prev = shown - 1;

  const page = (day: number) => (
    <>
      <div
        style={{
          height: HEADER_H,
          background: p.blue,
          color: p.white,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "40px 40px 0 0",
        }}
      >
        {props.month}
      </div>
      <div
        style={{
          height: BLOCK.h - HEADER_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 250,
          letterSpacing: headlineTracking,
          color: p.ink,
          background: p.white,
          borderRadius: "0 0 40px 40px",
        }}
      >
        {day}
      </div>
    </>
  );

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: BLOCK.x,
            top: BLOCK.y,
            width: BLOCK.w,
            height: BLOCK.h,
            borderRadius: 40,
            boxShadow: "0 30px 80px rgba(1, 40, 160, 0.16)",
            opacity: blockIn,
            transform: `scale(${0.9 + 0.1 * blockIn})`,
          }}
        >
          {page(shown)}
          {flipping && flipU > 0 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "100% 0%",
                transform: `translate(${-60 * flipU}px, ${-220 * flipU}px) rotate(${-16 * flipU}deg)`,
                opacity: interpolate(flipU, [0, 0.5, 1], [1, 1, 0]),
              }}
            >
              {page(prev)}
            </div>
          ) : null}
        </div>

        <div
          style={{
            position: "absolute",
            left: 110,
            top: 130,
            opacity: Math.min(1, env * 2),
            transform: `translate(${(1 - env) * -260}px, ${(1 - env) * -200}px) rotate(${-10 - (1 - env) * 30}deg)`,
          }}
        >
          <Envelope width={330} paper={p.white} line={p.blue} />
          <div
            style={{
              position: "absolute",
              right: -18,
              top: -18,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: p.red,
              transform: `scale(${badge})`,
              boxShadow: "0 6px 14px rgba(120, 90, 0, 0.25)",
            }}
          />
        </div>
      </Stage>
    </SceneBg>
  );
};
