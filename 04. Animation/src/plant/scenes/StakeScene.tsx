import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { HousePlant, POT_BOTTOM } from "../components/HousePlant";
import type { PlantProps } from "../schema";

// Timeline (frames, scene-local).
export const STAKE_T = {
  card: 6, // forwarded bill drops in
  buddyIn: 16, // Buddy hops in next to the pot
  read: 34, // amount + due date light up on the card
  fly: 44, // due date leaves the card ...
  flyLen: 16, // ... and flies to the pot
  push: 60, // Buddy pushes the stake into the soil
  subline: 64,
  blink: 84,
};

const CARD = { x: 110, y: -10, w: 860, h: 280 };
const PLANT = { x: 230, top: 880 - POT_BOTTOM };
// Stake label (plant coords 176..288 × 104..160) in stage coords.
const TAG = { x: PLANT.x + 176, y: PLANT.top + 104, w: 112, h: 56 };
const DUE_CHIP = { x: CARD.x + 200, y: CARD.y + 190 };
const BUDDY = 220;
const BUDDY_X = 640;
const FEET = 880;

export const StakeScene: React.FC<{
  props: PlantProps["stake"];
  bill: PlantProps["bill"];
  potLabel: string;
}> = ({ props, bill, potLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, STAKE_T.card, springs.pop);
  const readHi = pop(frame, fps, STAKE_T.read, springs.pop);
  const fly = interpolate(frame, [STAKE_T.fly, STAKE_T.fly + STAKE_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const landed = frame >= STAKE_T.fly + STAKE_T.flyLen;
  const flyX = interpolate(fly, [0, 1], [DUE_CHIP.x + 120, TAG.x]);
  const flyY = interpolate(fly, [0, 1], [DUE_CHIP.y, TAG.y]) - Math.sin(fly * Math.PI) * 120;

  const pushDip = interpolate(frame, [STAKE_T.push, STAKE_T.push + 4, STAKE_T.push + 10], [0, 1, 0], clamp);

  const buddyIn = pop(frame, fps, STAKE_T.buddyIn, springs.bouncy);
  const hop = interpolate(buddyIn, [0, 0.5, 1], [0, 1, 0], clamp);
  let squash = interpolate(buddyIn, [0, 0.7, 1], [0.7, 1.08, 1], clamp);
  if (frame >= STAKE_T.push - 6) {
    squash = interpolate(
      frame,
      [STAKE_T.push - 6, STAKE_T.push, STAKE_T.push + 5, STAKE_T.push + 12],
      [1, 1.1, 0.84, 1],
      clamp,
    );
  }
  const lean = interpolate(frame, [STAKE_T.push - 6, STAKE_T.push, STAKE_T.push + 12], [0, -12, 0], clamp);
  const look =
    frame < STAKE_T.fly
      ? { x: -0.4, y: -0.8 }
      : frame < STAKE_T.push + 12
        ? { x: -0.9, y: interpolate(fly, [0, 1], [-0.8, 0.2]) }
        : { x: 0.1, y: 0.1 };
  const blink = blinkScale(frame, [STAKE_T.blink]);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} sizeFactor={0.9} />

      <Stage offsetY={20}>
        {/* Forwarded bill */}
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 40,
            background: p.card,
            boxShadow: "0 24px 60px rgba(0, 10, 80, 0.28)",
            padding: "28px 40px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            opacity: Math.min(1, cardIn * 2),
            transform: `translateY(${(1 - cardIn) * -80}px) scale(${0.9 + 0.1 * cardIn})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              background: p.blueSoft,
              color: p.blue,
              fontWeight: 600,
              fontSize: 28,
            }}
          >
            {props.forwardedChip}
          </div>
          <div style={{ marginTop: 14, fontWeight: 600, fontSize: 44, color: p.ink, letterSpacing: "-0.01em" }}>
            {bill.sender}
          </div>
          <div style={{ marginTop: 2, fontSize: 32, color: p.greyText }}>{bill.subject}</div>
          <div style={{ position: "absolute", left: 40, top: 190, display: "flex", gap: 18, alignItems: "center" }}>
            {[bill.amount, `${bill.duePrefix} ${bill.dueDate}`].map((t, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 18px",
                  borderRadius: 14,
                  fontWeight: 600,
                  fontSize: 36,
                  background: interpolate(readHi, [0, 1], [0, 1]) > 0.5 ? p.yellow : p.grey,
                  color: p.ink,
                  transform: `scale(${1 + Math.sin(Math.min(1, readHi) * Math.PI) * 0.08})`,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 900, transform: "scale(1.15)", transformOrigin: "540px 880px" }}>
        <HousePlant
          sway={Math.sin(frame / 14) * 1.5}
          leafColor={p.white}
          leafDry={p.white}
          stemColor={p.blueSoft}
          potColor={p.white}
          potShade={p.blueSoft}
          label={potLabel}
          labelColor={p.white}
          labelBg={p.blue}
          stake={landed ? { text: bill.dueDate, insert: 1, color: p.yellow, textColor: p.ink } : undefined}
          style={{ left: PLANT.x, top: PLANT.top + pushDip * 10 }}
        />

        {/* Due date flying from the card to the pot */}
        {frame >= STAKE_T.fly && !landed ? (
          <div
            style={{
              position: "absolute",
              left: flyX,
              top: flyY,
              width: TAG.w,
              height: TAG.h,
              borderRadius: 14,
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${Math.sin(fly * Math.PI) * -12}deg)`,
              boxShadow: "0 12px 30px rgba(0, 10, 80, 0.3)",
            }}
          >
            {bill.dueDate}
          </div>
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X + (1 - buddyIn) * 300,
            top: FEET - BUDDY * BUDDY_RATIO - hop * 90,
            opacity: Math.min(1, buddyIn * 3),
            transform: `rotate(${lean}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={STAKE_T.subline} />
    </SceneBg>
  );
};
