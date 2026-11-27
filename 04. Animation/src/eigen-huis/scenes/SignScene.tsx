import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Key } from "../../components/Key";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { EigenHuisProps } from "../schema";

// Timeline (frames, scene-local).
export const SIGN_T = {
  card: -10, // contract card is already there on frame 0
  key: -6, // house key next to it
  sign: 10, // the signature draws itself
  signLen: 30,
  jingle: 44, // key jiggles: the house is yours
};

const CARD = { x: 250, y: 30, w: 580, h: 760 };

export const SignScene: React.FC<{ props: EigenHuisProps["sign"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const card = pop(frame, fps, SIGN_T.card, springs.smooth);
  const key = pop(frame, fps, SIGN_T.key, springs.bouncy);
  const sign = interpolate(frame, [SIGN_T.sign, SIGN_T.sign + SIGN_T.signLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const t = frame - SIGN_T.jingle;
  const jingle = t > 0 ? Math.sin(t / 1.8) * 12 * Math.max(0, 1 - t / 26) : 0;
  const bars = [420, 380, 440, 300, 400, 340];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-14} stagger={3} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 40,
            background: p.white,
            boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
            padding: "52px 56px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            opacity: card,
            transform: `translateY(${(1 - card) * 40}px) rotate(2deg)`,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 650, color: p.ink }}>{props.title}</div>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22 }}>
            {bars.map((w, i) => (
              <div key={i} style={{ width: w, height: 18, borderRadius: 9, background: p.grey }} />
            ))}
          </div>
          <svg
            width={420}
            height={150}
            viewBox="0 0 420 150"
            style={{ position: "absolute", left: 56, bottom: 120, overflow: "visible" }}
          >
            <path
              d="M10 110 C 40 30, 70 30, 70 90 S 110 140, 130 70 S 170 20, 180 90 C 190 130, 220 60, 250 70 S 300 120, 320 80 S 370 50, 405 75"
              fill="none"
              stroke={p.blue}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - sign}
            />
          </svg>
          <div style={{ position: "absolute", left: 56, right: 56, bottom: 104, height: 4, background: p.ink, opacity: 0.6 }} />
          <div style={{ position: "absolute", left: 56, bottom: 56, fontSize: 28, color: p.greyText }}>{props.signLabel}</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 40,
            top: 610,
            transformOrigin: "20% 50%",
            transform: `scale(${key}) rotate(${-24 + jingle}deg)`,
          }}
        >
          <Key width={330} color={p.blue} hole={p.light} />
        </div>
      </Stage>
    </SceneBg>
  );
};
