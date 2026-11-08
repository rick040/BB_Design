import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Arrow } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { PlateOnStick } from "../components/Plate";
import type { BordjesProps } from "../schema";
import { SPIN } from "./HookScene";

// Timeline (frames, scene-local).
export const FWD_T = {
  card: 4, // the bill mail settles
  tap: 22, // tap on "Doorsturen"
  morph: 30, // mail shrinks and turns into a plate
  morphLen: 14,
  land: 44, // plate lands on its stick, wobbling
  bump: 50, // Buddy hops and bumps the stick: the plate spins
  amount: 60, // chip with the amount
  due: 67, // chip with the due date
  subline: 74,
};

const CARD = { x: 70, y: 10, w: 940, h: 300 };
const PLATE = { x: 400, tip: 470, floor: 860, rx: 170 };
const BUDDY = 230;
const BUDDY_X = 720;
const BUDDY_FEET = 860;

export const ForwardScene: React.FC<{
  props: BordjesProps["forward"];
  bill: BordjesProps["bill"];
  label: string;
}> = ({ props, bill, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, FWD_T.card - 10, springs.smooth);
  const press = interpolate(frame, [FWD_T.tap, FWD_T.tap + 3, FWD_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FWD_T.tap, FWD_T.tap + 14], [0, 1], clamp);
  const m = interpolate(frame, [FWD_T.morph, FWD_T.morph + FWD_T.morphLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const cardCx = interpolate(m, [0, 1], [CARD.x + CARD.w / 2, PLATE.x]);
  const cardCy = interpolate(m, [0, 1], [CARD.y + CARD.h / 2, PLATE.tip]);
  const cardScale = interpolate(m, [0, 1], [1, 0.3]);
  const cardOpacity = interpolate(m, [0.45, 0.85], [1, 0], clamp);

  const stickIn = interpolate(frame, [FWD_T.morph + 2, FWD_T.land], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const plateIn = interpolate(m, [0.5, 1], [0, 1], clamp);
  const landT = frame - FWD_T.land;
  const settleWobble = landT >= 0 && frame < FWD_T.bump + 4 ? Math.sin(landT * 0.9) * 10 * Math.exp(-landT / 10) : 0;
  const spinT = Math.max(0, frame - FWD_T.bump - 1);
  const phase = SPIN * 1.3 * (spinT - 6 * (1 - Math.exp(-spinT / 6)));

  // Buddy hops sideways into the stick, bumps it, and hops back.
  const hopT = interpolate(frame, [FWD_T.bump - 8, FWD_T.bump + 8], [0, 1], clamp);
  const hopY = -120 * 4 * hopT * (1 - hopT);
  const hopX = interpolate(frame, [FWD_T.bump - 8, FWD_T.bump, FWD_T.bump + 10], [0, -120, 0], clamp);
  const squash = interpolate(
    frame,
    [FWD_T.bump - 11, FWD_T.bump - 8, FWD_T.bump - 4, FWD_T.bump, FWD_T.bump + 3, FWD_T.bump + 8, FWD_T.bump + 11, FWD_T.bump + 16],
    [1, 0.82, 1.12, 0.88, 1.06, 1.04, 0.86, 1],
    clamp,
  );
  const buddyIn = pop(frame, fps, FWD_T.morph, springs.bouncy);
  const stickSway = interpolate(frame, [FWD_T.bump, FWD_T.bump + 3, FWD_T.bump + 9], [0, -4, 0], clamp);
  const look =
    frame < FWD_T.bump - 8
      ? { x: -0.7, y: -0.9 }
      : { x: interpolate(frame, [FWD_T.bump + 10, FWD_T.amount + 8], [-0.8, -0.3], clamp), y: -0.8 };
  const blink = blinkScale(frame, [FWD_T.due + 10]);
  const idle = frame > FWD_T.bump + 16 ? Math.sin((frame - FWD_T.bump - 16) / 8) * 4 : 0;

  const amount = pop(frame, fps, FWD_T.amount, springs.bouncy);
  const due = pop(frame, fps, FWD_T.due, springs.bouncy);

  const chip = (text: string, s: number, start: number, left: number) => (
    <div
      style={{
        position: "absolute",
        left,
        top: 230,
        padding: "16px 30px",
        borderRadius: 999,
        background: p.white,
        color: p.blue,
        fontFamily: fonts.ui,
        fontWeight: 700,
        fontSize: 48,
        whiteSpace: "nowrap",
        opacity: frame >= start ? Math.min(1, s * 2) : 0,
        transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s})`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      }}
    >
      {text}
    </div>
  );

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} />

      <Stage offsetY={-10}>
        {/* stick + plate */}
        {stickIn > 0 ? (
          <PlateOnStick
            x={PLATE.x}
            tipY={PLATE.floor - (PLATE.floor - PLATE.tip) * stickIn}
            floorY={PLATE.floor}
            rx={PLATE.rx}
            label={label}
            phase={phase}
            wobble={settleWobble}
            hidePlate={plateIn <= 0}
            stickColor={p.blueSoft}
            stickSway={stickSway}
            plateOpacity={plateIn}
            plateScale={0.5 + 0.5 * plateIn}
          />
        ) : null}

        {chip(bill.amount, amount, FWD_T.amount, 90)}
        {chip(bill.due, due, FWD_T.due, 430)}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2 + hopX,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + hopY + idle,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.3 + 0.7 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* the forwarded bill mail */}
        {cardOpacity > 0 ? (
          <div
            style={{
              position: "absolute",
              left: cardCx - CARD.w / 2,
              top: cardCy - CARD.h / 2,
              width: CARD.w,
              height: CARD.h,
              borderRadius: 36,
              background: p.white,
              boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
              opacity: cardOpacity * Math.min(1, cardIn * 2),
              transform: `scale(${cardScale * (0.92 + 0.08 * cardIn)})`,
              fontFamily: fonts.ui,
              padding: "34px 40px",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  background: p.grey,
                  color: p.blue,
                  fontWeight: 700,
                  fontSize: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {bill.sender.slice(0, 1)}
              </div>
              <div>
                <div style={{ fontSize: 46, fontWeight: 700, color: p.ink }}>{bill.sender}</div>
                <div style={{ fontSize: 38, color: "#6b6f7a", marginTop: 6 }}>{bill.subject}</div>
              </div>
            </div>
            <div style={{ marginTop: 26, height: 16, width: 380, borderRadius: 8, background: p.grey }} />
            <div style={{ marginTop: 14, height: 16, width: 280, borderRadius: 8, background: p.grey }} />
            <div
              style={{
                position: "absolute",
                right: 34,
                bottom: 30,
                transform: `scale(${press})`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: p.blue,
                  color: p.white,
                  fontWeight: 600,
                  fontSize: 40,
                  padding: "18px 24px 18px 34px",
                  borderRadius: 999,
                }}
              >
                {props.forwardButton}
                <Arrow size={40} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 200,
                  height: 200,
                  marginLeft: -100,
                  marginTop: -100,
                  borderRadius: "50%",
                  border: `5px solid ${p.blue}`,
                  opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.8 : 0,
                  transform: `scale(${0.3 + ripple})`,
                }}
              />
            </div>
          </div>
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={FWD_T.subline} />
    </SceneBg>
  );
};
