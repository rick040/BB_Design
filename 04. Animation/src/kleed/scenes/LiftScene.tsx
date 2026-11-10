import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard, BILL_W } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Arrow } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { RUG_PAD, Rug } from "../components/Rug";
import { Chip, Slip, SLIP_H, SLIP_W } from "../components/Slip";
import type { KleedProps } from "../schema";

// Timeline (frames, scene-local).
export const LIFT_T = {
  forward: 12, // "Doorsturen" button pops in
  tap: 24, // ... and gets tapped
  buddyIn: 30, // Buddy hops in at the right end of the rug
  roll: 46, // Buddy rolls the rug up, right to left
  rollLen: 34,
  rise: 84, // the bill under the rug stands up as a card
  amount: 96, // chip: amount
  due: 102, // chip: due date
  subline: 104,
};

// Slightly narrower and shifted left so Buddy fits to the right of it.
export const RUG = { x: 60, y: 470, w: 780, d: 200 };
const FLOOR = RUG.y + RUG.d - 20;
const BUDDY = 170;
const SLIP_X = 450;

export const LiftScene: React.FC<{ props: KleedProps["lift"]; bill: KleedProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Forward button + tap
  const fwd = pop(frame, fps, LIFT_T.forward, springs.pop);
  const tap = interpolate(frame, [LIFT_T.tap, LIFT_T.tap + 3, LIFT_T.tap + 9], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [LIFT_T.tap + 1, LIFT_T.tap + 16], [0, 1], clamp);
  const fwdOut = interpolate(frame, [LIFT_T.tap + 14, LIFT_T.tap + 26], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });

  // Roll
  const roll = interpolate(frame, [LIFT_T.roll, LIFT_T.roll + LIFT_T.rollLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const inset = RUG.d * 0.32;
  const minEdge = inset + 40;
  const edgeX = RUG.x + minEdge + (RUG.w - minEdge) * (1 - roll);
  const rollR = 16 + 26 * roll;

  // Buddy: hops in from the right, then walks with the roll.
  const inT = interpolate(frame, [LIFT_T.buddyIn, LIFT_T.buddyIn + 12], [0, 1], clamp);
  const startX = 1160;
  const restX = RUG.x + RUG.w + 16 + BUDDY / 2 + 6; // at the right end before rolling
  let bx = interpolate(inT, [0, 1], [startX, restX]);
  if (frame >= LIFT_T.roll) bx = edgeX + rollR + BUDDY / 2 + 6;
  const hopIn = -150 * 4 * inT * (1 - inT);
  const walk = frame >= LIFT_T.roll && frame < LIFT_T.roll + LIFT_T.rollLen ? -Math.abs(Math.sin((frame - LIFT_T.roll) / 2.4)) * 22 : 0;
  const landSq = interpolate(frame, [LIFT_T.buddyIn + 11, LIFT_T.buddyIn + 14, LIFT_T.buddyIn + 20], [1, 0.82, 1], clamp);
  const pushSq = frame >= LIFT_T.roll - 4 && frame < LIFT_T.roll ? 0.9 : 1;
  const riseHop = interpolate(frame, [LIFT_T.rise, LIFT_T.rise + 12], [0, 1], clamp);
  const cheer = -60 * 4 * riseHop * (1 - riseHop);
  const lookX = frame < LIFT_T.rise ? -0.8 : 0.5;
  const lookY = frame < LIFT_T.rise ? 0.3 : -0.8;
  const blink = blinkScale(frame, [LIFT_T.buddyIn + 18, LIFT_T.due + 8]);

  // Bill: flat under the rug, then stands up as a card.
  const rise = pop(frame, fps, LIFT_T.rise, springs.pop);
  const cardScale = 0.9;
  const amount = pop(frame, fps, LIFT_T.amount, springs.bouncy);
  const due = pop(frame, fps, LIFT_T.due, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage offsetY={140}>
        {/* bill hidden under the rug */}
        {frame < LIFT_T.rise + 4 ? (
          <Slip
            sender={bill.sender}
            amount={bill.amount}
            style={{ left: SLIP_X - SLIP_W / 2, top: FLOOR - SLIP_H, opacity: 1 - rise }}
          />
        ) : null}

        <Rug
          width={RUG.w}
          depth={RUG.d}
          base={p.blueSoft}
          stripe={p.white}
          edge={p.blueText}
          fringe={p.white}
          bump={frame < LIFT_T.roll + 10 ? 1.1 : 0}
          bumpX={(SLIP_X - RUG.x) / RUG.w}
          roll={roll}
          style={{ position: "absolute", left: RUG.x - RUG_PAD.x, top: RUG.y - RUG_PAD.y }}
        />

        {/* forward button */}
        {fwdOut < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 90,
              display: "flex",
              justifyContent: "center",
              opacity: Math.min(1, fwd * 2) * (1 - fwdOut),
              transform: `scale(${(0.6 + 0.4 * fwd) * tap * (1 - 0.3 * fwdOut)}) translateY(${fwdOut * 200}px)`,
            }}
          >
            <div
              style={{
                position: "relative",
                height: 120,
                borderRadius: 60,
                background: p.white,
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "0 50px 0 22px",
                boxShadow: "0 24px 60px rgba(0,10,80,0.3)",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  background: p.blueMid,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Arrow size={44} />
              </div>
              <span style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 48, color: p.ink }}>{props.forward}</span>
              <div
                style={{
                  position: "absolute",
                  left: 62 - 80,
                  top: 60 - 80,
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  border: `5px solid ${p.white}`,
                  opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                  transform: `scale(${0.3 + ripple * 1.2})`,
                }}
              />
            </div>
          </div>
        ) : null}

        {/* the bill stands up as a card */}
        {frame >= LIFT_T.rise ? (
          <BillCard
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            dueLabel={bill.due}
            style={{
              position: "absolute",
              left: 540 - BILL_W / 2,
              top: interpolate(rise, [0, 1], [FLOOR - 330, -20]),
              transform: `scale(${(0.5 + 0.5 * rise) * cardScale}) rotate(${(1 - rise) * 6}deg)`,
              transformOrigin: "50% 0%",
              opacity: Math.min(1, rise * 2.5),
            }}
          />
        ) : null}

        {frame >= LIFT_T.amount ? (
          <Chip text={props.amountChip} bg={p.yellow} fg={p.ink} size={44} style={{ left: 190, top: 330, transform: `scale(${amount}) rotate(${-4 * amount}deg)` }} />
        ) : null}
        {frame >= LIFT_T.due ? (
          <Chip text={props.dueChip} bg={p.white} fg={p.blue} size={44} style={{ left: 540, top: 330, transform: `scale(${due}) rotate(${3 * due}deg)` }} />
        ) : null}

        {frame >= LIFT_T.buddyIn ? (
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            squash={landSq * pushSq}
            look={{ x: lookX, y: lookY }}
            style={{
              position: "absolute",
              left: bx - BUDDY / 2,
              top: FLOOR + 20 - BUDDY * BUDDY_RATIO + hopIn + walk + cheer,
            }}
          />
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={LIFT_T.subline} />
    </SceneBg>
  );
};
