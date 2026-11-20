import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { type BrievenbusProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Absolute frames, hung on the spoken words.
export const SLOT_T = {
  head: S + 4, // "Stuur alleen die ene door."
  flap: wordAt("rekening") - 6, // the letterbox flap lifts
  through: wordAt("rekening"), // the bill pushes through the slot
  drop: wordAt("door", 1) + 2, // bill drops out
  catch: wordAt("door", 1) + 10, // Buddy catches it on his head
  read: wordAt("buddy", 2) + 2, // the four fields pop out of the bill
  fieldStagger: 3,
};

const SLOT_Y = 150;
const SCALE = 0.62;
const BW = BILL_W * SCALE;
const BH = BILL_H * SCALE;
const BUDDY = 180;
const FEET = 960;
const BUDDY_TOP = FEET - BUDDY * BUDDY_RATIO;
const REST_Y = BUDDY_TOP - BH + 14;
const GRID = [
  { x: 330, y: 340 },
  { x: 750, y: 340 },
  { x: 330, y: 450 },
  { x: 750, y: 450 },
];

export const SlotScene: React.FC<{ props: BrievenbusProps["slot"]; bill: BrievenbusProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const flap = interpolate(frame, [SLOT_T.flap, SLOT_T.flap + 6, SLOT_T.catch + 6, SLOT_T.catch + 12], [0, 1, 1, 0], clamp);
  // y of the bill's top edge (stage coords)
  const through = interpolate(frame, [SLOT_T.through, SLOT_T.drop], [SLOT_Y - BH, SLOT_Y + 6], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const fall = interpolate(frame, [SLOT_T.drop, SLOT_T.catch], [SLOT_Y + 6, REST_Y], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const billY = frame < SLOT_T.drop ? through : fall;
  const billR = interpolate(frame, [SLOT_T.drop, SLOT_T.catch, SLOT_T.catch + 8], [0, 4, -2], clamp);
  const catchSq = interpolate(frame, [SLOT_T.catch, SLOT_T.catch + 3, SLOT_T.catch + 10], [1, 0.82, 1], clamp);
  const buddyIn = pop(frame, fps, S + 6, springs.bouncy);
  const squash = frame < S + 18 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : catchSq;
  const readIdx = Math.max(0, Math.min(3, Math.floor((frame - SLOT_T.read) / SLOT_T.fieldStagger)));
  const look =
    frame < SLOT_T.catch
      ? { x: 0, y: -1 }
      : frame < SLOT_T.read
        ? { x: 0, y: -0.6 }
        : { x: GRID[readIdx].x < 540 ? -0.7 : 0.7, y: -0.9 };

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={SLOT_T.head - 6} stagger={3} />
      <Stage>
        {/* the inside of the front door */}
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: -40,
            height: 300,
            borderRadius: "0 0 40px 40px",
            background: p.blue,
          }}
        />
        {/* bill: clipped above the slot, so it seems to push through */}
        <div style={{ position: "absolute", left: 0, right: 0, top: SLOT_Y, bottom: -400, overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 540 - BW / 2,
              top: billY - SLOT_Y,
              width: BW,
              height: BH,
              transform: `rotate(${billR}deg)`,
            }}
          >
            <div style={{ transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
              <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
            </div>
          </div>
        </div>
        {/* letterbox plate */}
        <div
          style={{
            position: "absolute",
            left: 540 - 270,
            top: SLOT_Y - 55,
            width: 540,
            height: 110,
            borderRadius: 24,
            background: p.yellow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              width: 460,
              height: 44,
              borderRadius: 12,
              background: "#0b1d6b",
              transform: `scaleY(${0.3 + 0.7 * flap})`,
            }}
          />
        </div>
        {/* fields read from the bill */}
        {props.fields.map((f, i) => {
          const s = pop(frame, fps, SLOT_T.read + i * SLOT_T.fieldStagger, springs.smooth);
          if (s <= 0.001) return null;
          const g = GRID[i];
          const fromY = REST_Y + BH / 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540 + (g.x - 540) * s - 190,
                top: fromY + (g.y - fromY) * s - 44,
                width: 380,
                height: 88,
                borderRadius: 44,
                background: p.white,
                boxShadow: "0 12px 30px rgba(1, 30, 120, 0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 38,
                color: p.ink,
                opacity: Math.min(1, s * 2),
                transform: `scale(${0.5 + 0.5 * s})`,
              }}
            >
              <Checkmark size={36} color={p.blue} progress={Math.min(1, s)} />
              {f}
            </div>
          );
        })}
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          squash={squash}
          look={look}
          blink={blinkScale(frame, [SLOT_T.read + 22])}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: BUDDY_TOP,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
    </SceneBg>
  );
};
