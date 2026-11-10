import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import type { SneeuwbolProps } from "../schema";
import { wordAt } from "../vo";

// Beats (scene-local): tap on "Stuur", the mail flies on "door", Buddy catches on "Buddy".
export const forwardBeats = (start: number) => ({
  tap: wordAt("hem") - start,
  fly: wordAt("door") - start,
  catch: wordAt("Buddy") - start,
});

const CARD_W = 860;
const CARD_H = 340;
const CARD = { x: (1080 - CARD_W) / 2, y: 60 };
const BUDDY = 230;
const FEET = 860;

export const ForwardScene: React.FC<{
  props: SneeuwbolProps["forward"];
  bill: SneeuwbolProps["bill"];
  start: number;
}> = ({ props, bill, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const B = forwardBeats(start);

  const tap = interpolate(frame, [B.tap, B.tap + 3, B.tap + 8], [1, 0.9, 1], clamp);
  const fly = interpolate(frame, [B.fly, B.catch], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const buddyIn = pop(frame, fps, 4, springs.bouncy);
  const gulp = interpolate(frame, [B.catch, B.catch + 4, B.catch + 9, B.catch + 14], [1, 0.82, 1.08, 1], clamp);
  const mouthY = FEET - BUDDY * BUDDY_RATIO * 0.55;
  const cx = interpolate(fly, [0, 1], [CARD.x + CARD_W / 2, 540]);
  const cy = interpolate(fly, [0, 1], [CARD.y + CARD_H / 2, mouthY]) - Math.sin(fly * Math.PI) * 120;
  const scale = 1 - fly * 0.88;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={-8} stagger={2} />
      <Stage offsetY={10}>
        <div
          style={{
            position: "absolute",
            left: cx - CARD_W / 2,
            top: cy - CARD_H / 2,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 44,
            background: p.white,
            boxShadow: "0 30px 80px rgba(0,0,0,0.18)",
            padding: "38px 44px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            transform: `scale(${scale}) rotate(${fly * -12}deg)`,
            opacity: frame > B.catch ? 0 : 1,
          }}
        >
          <div style={{ fontSize: 30, color: p.greyText }}>
            {props.fromLabel}: <span style={{ color: p.ink, fontWeight: 600 }}>{bill.sender}</span>
          </div>
          <div style={{ fontSize: 40, color: p.ink, fontWeight: 600, marginTop: 10 }}>{bill.subject}</div>
          <div
            style={{
              position: "absolute",
              left: 44,
              bottom: 36,
              fontFamily: fonts.display,
              fontSize: 76,
              fontWeight: 500,
              letterSpacing: headlineTracking,
              color: p.ink,
            }}
          >
            {bill.amount}
          </div>
          <div
            style={{
              position: "absolute",
              right: 40,
              bottom: 40,
              height: 84,
              padding: "0 34px",
              borderRadius: 42,
              background: p.blue,
              color: p.white,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 36,
              fontWeight: 600,
              transform: `scale(${tap})`,
            }}
          >
            {props.forwardButton}
            <svg width="34" height="34" viewBox="0 0 24 24">
              <path d="M4 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* tap ripple */}
          <div
            style={{
              position: "absolute",
              right: 110,
              bottom: 42,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: p.blueSoft,
              opacity: interpolate(frame, [B.tap, B.tap + 4, B.tap + 14], [0, 0.7, 0], clamp),
              transform: `scale(${interpolate(frame, [B.tap, B.tap + 14], [0.4, 1.8], clamp)})`,
            }}
          />
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [B.catch + 18])}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) * gulp}
          look={{ x: 0, y: interpolate(fly, [0, 1], [-0.7, 0]) }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
    </SceneBg>
  );
};
