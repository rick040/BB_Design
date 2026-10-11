import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification, NOTIFICATION_H, NOTIFICATION_W } from "../../components/Notification";
import { RollingNumber, rollSequence } from "../../components/RollingNumber";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, pushedSlots, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { CountdownProps } from "../schema";

// Giant number geometry (stage coordinates).
const NUM_SIZE = 540;
const NUM_TOP = 230;
// Top of a Space Grotesk numeral inside its 1em line box.
const GLYPH_TOP = 0.165;
const PERCH_Y = NUM_TOP + NUM_SIZE * GLYPH_TOP; // where Buddy's feet go

const BUDDY = 210;

// Timeline (frames, scene-local).
const T_DROP = 8;
const T_JUMP_IN = 14;
const T_LAND = 32;
const T_NOTE_1 = 44;
const T_CROUCH = 88;
const T_HOP = 94;
const T_ROLL_START = 96;
const T_ROLL_END = 116;
const T_HOP_LAND = 118;
const T_NOTE_2 = 120;
const T_CHIP = 132;
const T_SWAP = 98;

const STACK_TOP = 735;
const GAP = 22;

export const CountdownScene: React.FC<{ props: CountdownProps["countdown"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Number drops in, then rolls first → second.
  const drop = pop(frame, fps, T_DROP, { damping: 11, stiffness: 140, mass: 0.9 });
  const values = rollSequence(props.firstNumber, props.secondNumber);
  const roll = interpolate(frame, [T_ROLL_START, T_ROLL_END], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const rollSpeed = Math.abs(
    roll -
      interpolate(frame - 1, [T_ROLL_START, T_ROLL_END], [0, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      }),
  );
  // Number squashes a bit when Buddy lands on it.
  const numberImpact =
    interpolate(frame, [T_LAND, T_LAND + 3, T_LAND + 10], [0, 1, 0], clamp) +
    interpolate(frame, [T_HOP_LAND, T_HOP_LAND + 3, T_HOP_LAND + 10], [0, 1, 0], clamp);

  // Buddy: arc jump in from bottom-left, then a vertical hop during the roll.
  const jumpT = interpolate(frame, [T_JUMP_IN, T_LAND], [0, 1], clamp);
  const startX = -160;
  const startY = 980;
  let bx = interpolate(jumpT, [0, 1], [startX, 540], { easing: Easing.out(Easing.quad) });
  let by = interpolate(jumpT, [0, 1], [startY, PERCH_Y]) - 200 * 4 * jumpT * (1 - jumpT);
  if (frame >= T_LAND) {
    bx = 540;
    by = PERCH_Y + numberImpact * 10;
  }
  const hopT = interpolate(frame, [T_HOP, T_HOP_LAND], [0, 1], clamp);
  if (frame >= T_HOP && frame < T_HOP_LAND) {
    by = PERCH_Y - 110 * 4 * hopT * (1 - hopT);
  }
  const idle = frame > T_HOP_LAND + 8 ? Math.sin((frame - T_HOP_LAND - 8) / 8) * 5 : 0;

  let squash = 1;
  if (frame < T_LAND) squash = frame >= T_JUMP_IN ? 1.12 : 1;
  else if (frame < T_CROUCH)
    squash = interpolate(frame, [T_LAND, T_LAND + 3, T_LAND + 9, T_LAND + 14], [1.12, 0.8, 1.06, 1], clamp);
  else if (frame < T_HOP) squash = interpolate(frame, [T_CROUCH, T_HOP - 1, T_HOP], [1, 0.78, 1.18], clamp);
  else if (frame < T_HOP_LAND) squash = interpolate(hopT, [0, 0.5, 1], [1.18, 1.0, 1.12]);
  else squash = interpolate(frame, [T_HOP_LAND, T_HOP_LAND + 3, T_HOP_LAND + 9, T_HOP_LAND + 14], [1.12, 0.8, 1.06, 1], clamp);

  const look = {
    x: frame < T_LAND ? 0.6 : interpolate(frame, [T_NOTE_1, T_NOTE_1 + 6, T_CROUCH - 10, T_CROUCH], [0, 0.4, 0.4, 0], clamp),
    y: frame < T_LAND ? 0 : interpolate(frame, [T_NOTE_1, T_NOTE_1 + 6, T_CROUCH - 4, T_CROUCH], [0, 1, 1, 0.8], clamp) - (frame > T_HOP_LAND + 4 ? 0.8 : 0),
  };
  const blink = blinkScale(frame, [T_LAND + 20, T_HOP_LAND + 22]);

  // Headline swap after the roll.
  const swapOut = interpolate(frame, [T_SWAP - 6, T_SWAP + 2], [1, 0], clamp);

  const arrivals = [T_NOTE_1, T_NOTE_2];
  const chip = pop(frame, fps, T_CHIP, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <div style={{ position: "absolute", inset: 0, opacity: swapOut, transform: `translateY(${(1 - swapOut) * -30}px)` }}>
        <Headline text={props.headline} color={p.white} delay={4} stagger={3} />
      </div>
      {frame >= T_SWAP ? (
        <Headline text={props.headlineAfterRoll} color={p.white} delay={T_SWAP + 2} stagger={3} />
      ) : null}

      <Stage>
        {/* Giant number */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: NUM_TOP + (1 - drop) * -900,
            transform: `scale(${1 + numberImpact * 0.02}, ${1 - numberImpact * 0.035})`,
            transformOrigin: "50% 85%",
          }}
        >
          <RollingNumber
            values={values}
            progress={roll}
            size={NUM_SIZE}
            color={p.blueSoft}
            blur={rollSpeed * 160}
          />
        </div>

        {/* Agenda chip */}
        <div
          style={{
            position: "absolute",
            left: 720,
            top: 250,
            height: 84,
            padding: "0 30px 0 18px",
            borderRadius: 42,
            background: p.white,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: fonts.ui,
            fontSize: 32,
            fontWeight: 500,
            color: p.blue,
            whiteSpace: "nowrap",
            boxShadow: "0 16px 40px rgba(0, 20, 120, 0.3)",
            opacity: Math.min(1, chip * 2),
            transform: `scale(${chip}) rotate(${6 - (1 - chip) * 20}deg)`,
            transformOrigin: "0% 50%",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: p.blueMid,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontSize: 30,
            }}
          >
            {props.secondNumber}
          </div>
          {props.agendaChip}
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          blink={blink}
          look={look}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: by - BUDDY * BUDDY_RATIO + idle,
          }}
        />

        {/* Reminder notifications, newest on top */}
        {props.notifications.map((n, i) => {
          const a = arrivals[i];
          if (frame < a - 1) return null;
          const enter = pop(frame, fps, a, { damping: 16, stiffness: 160 });
          const slots = pushedSlots(frame, fps, arrivals, i);
          return (
            <Notification
              key={i}
              text={n.text}
              time={n.time}
              icon={n.icon}
              style={{
                position: "absolute",
                left: (1080 - NOTIFICATION_W) / 2,
                top: STACK_TOP + slots * (NOTIFICATION_H + GAP) - (1 - enter) * 40,
                opacity: enter,
                transform: `scale(${(0.85 + 0.15 * enter) * (1 - slots * 0.03)})`,
                zIndex: 10 + i,
              }}
            />
          );
        })}
      </Stage>
    </SceneBg>
  );
};
