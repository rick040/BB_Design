import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification } from "../../components/Notification";
import { SceneBg } from "../../components/Stage";
import { blinkScale, clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { BillCard, CARD_W, PaidCard } from "../components/ui";
import { Stage, STAGE_W, useHeroLayout } from "../layout";
import { type HeroVslProps, heroVslFrames } from "../schema";

// Steps 1–3 as one calm, continuous shot. Only one line and one object are
// on screen at a time; Buddy stays in the same spot underneath.
// Beats are in frames relative to the start of their step.
export const STEP_T = {
  // step 1 · "Stuur je rekening door."  (bill + line are there on frame 0)
  press: 22, // the Doorsturen button is pressed
  fly: 28, // the bill glides into Buddy
  flyLen: 24,
  // step 2 · "Buddy seint je op tijd."
  swapOut: 8, // old line fades out first …
  swapLen: 12, // … then the new line fades in (never both at once)
  reminder: 12, // reminder rises out of Buddy
  // step 3 · "Jij betaalt op tijd."
  paid: 8, // "Betaald" card
  check: 16, // checkmark draws
  checkLen: 14,
  hop: 10, // Buddy hops once
  hopLen: 18,
};

const SLOT_Y = 230; // centre of the object slot on the stage
const BUDDY = 190;
const BUDDY_H = BUDDY * BUDDY_RATIO;
const FEET = 722;
const BUDDY_TOP = FEET - BUDDY_H;
const BILL_H = 268;
const NOTIF_W = 900;
const NOTIF_H = 156 * (NOTIF_W / 900);

const soft = { damping: 16, stiffness: 120, mass: 0.9 };

export const StepsScene: React.FC<{ props: HeroVslProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useHeroLayout();
  const f = heroVslFrames(props.timing);
  const starts = [0, f.step1, f.step1 + f.step2];
  const [, s2, s3] = starts;

  // ── Headline: one line at a time, cross-fades at each step ──────────────
  const lineState = (i: number) => {
    const inT =
      i === 0
        ? 1
        : interpolate(frame, [starts[i] + STEP_T.swapOut, starts[i] + STEP_T.swapOut + STEP_T.swapLen], [0, 1], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          });
    const outT =
      i === 2
        ? 0
        : interpolate(frame, [starts[i + 1], starts[i + 1] + STEP_T.swapOut], [0, 1], {
            ...clamp,
            easing: Easing.in(Easing.cubic),
          });
    return { opacity: inT * (1 - outT), y: (1 - inT) * 26 - outT * 22 };
  };

  // ── Step 1: the bill glides into Buddy ──────────────────────────────────
  const press = interpolate(frame, [STEP_T.press - 3, STEP_T.press, STEP_T.press + 6], [0, 1, 0], clamp);
  const ripple = interpolate(frame, [STEP_T.press, STEP_T.press + 16], [0, 1], clamp);
  const fly = interpolate(frame, [STEP_T.fly, STEP_T.fly + STEP_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const billTop = SLOT_Y - BILL_H / 2;
  const mouthY = BUDDY_TOP + BUDDY_H * 0.42;
  const billDy = interpolate(fly, [0, 1], [0, mouthY - SLOT_Y]);
  const billScale = interpolate(fly, [0, 1], [1, 0.1]);
  const billOpacity = interpolate(fly, [0.7, 1], [1, 0], clamp);
  const caught = STEP_T.fly + STEP_T.flyLen;

  // ── Step 2: one reminder rises out of Buddy ─────────────────────────────
  const rise = spring({ frame: frame - (s2 + STEP_T.reminder), fps, config: soft });
  const reminderOut = interpolate(frame, [s3, s3 + 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const reminderTop = interpolate(rise, [0, 1], [BUDDY_TOP, SLOT_Y - NOTIF_H / 2]) - reminderOut * 40;
  const reminderVisible = frame >= s2 + STEP_T.reminder && reminderOut < 1;

  // ── Step 3: "Betaald" ───────────────────────────────────────────────────
  const paidIn = spring({ frame: frame - (s3 + STEP_T.paid), fps, config: soft });
  const check = interpolate(frame, [s3 + STEP_T.check, s3 + STEP_T.check + STEP_T.checkLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  // ── Buddy ───────────────────────────────────────────────────────────────
  const hopStart = s3 + STEP_T.hop;
  const hopT = interpolate(frame, [hopStart, hopStart + STEP_T.hopLen], [0, 1], clamp);
  const hopY = -Math.sin(hopT * Math.PI) * 70;
  const land = hopStart + STEP_T.hopLen;
  let squash = interpolate(frame, [caught - 1, caught + 4, caught + 11, caught + 18], [1, 0.84, 1.05, 1], clamp);
  const sendAt = s2 + STEP_T.reminder;
  squash *= interpolate(frame, [sendAt - 4, sendAt, sendAt + 8], [1, 0.9, 1], clamp);
  if (frame >= hopStart - 5) {
    squash = interpolate(
      frame,
      [hopStart - 5, hopStart, hopStart + 4, land - 2, land + 3, land + 10],
      [1, 0.88, 1.06, 1.03, 0.88, 1],
      clamp,
    );
  }
  const lookY = interpolate(
    frame,
    [0, STEP_T.fly, caught, caught + 8, sendAt, sendAt + 12, s3],
    [-0.9, -0.9, 0.1, 0.1, 0.1, -0.85, -0.85],
    clamp,
  );
  const happy = frame >= land ? 0.2 : 1;
  const blink = Math.min(happy, blinkScale(frame, [caught + 10, s2 + 44]));
  const idle = Math.sin(frame / 12) * 3 * (frame < hopStart - 5 || frame > land + 10 ? 1 : 0);

  return (
    <SceneBg color={p.light}>
      {/* Soft glow behind the stage */}
      <div
        style={{
          position: "absolute",
          left: L.width / 2 - 560,
          top: L.stage.top + 380 * L.stage.scale - 560,
          width: 1120,
          height: 1120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${p.blueSoft}4d 0%, ${p.blueSoft}00 66%)`,
        }}
      />

      {props.steps.map((line, i) => {
        const s = lineState(i);
        if (s.opacity <= 0.001) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: L.headTop,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: L.wide ? 28 : 22,
              opacity: s.opacity,
              transform: `translateY(${s.y}px)`,
            }}
          >
            <div
              style={{
                width: L.badge,
                height: L.badge,
                borderRadius: "50%",
                background: p.blue,
                color: p.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: L.badge * 0.5,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: L.headSize,
                letterSpacing: headlineTracking,
                lineHeight: 1,
                color: p.blue,
                whiteSpace: "nowrap",
                paddingBottom: 6,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}

      <Stage>
        {reminderVisible ? (
          <div
            style={{
              position: "absolute",
              left: (STAGE_W - NOTIF_W) / 2,
              top: reminderTop,
              opacity: Math.min(1, rise * 2) * (1 - reminderOut),
              transform: `scale(${0.4 + 0.6 * Math.min(1, rise)})`,
            }}
          >
            <Notification text={props.reminder.text} time={props.reminder.time} icon="alert" width={NOTIF_W} />
          </div>
        ) : null}

        {paidIn > 0.001 ? (
          <div
            style={{
              position: "absolute",
              left: (STAGE_W - CARD_W) / 2,
              top: SLOT_Y - 100,
              opacity: Math.min(1, paidIn * 2),
              transform: `translateY(${(1 - paidIn) * 30}px) scale(${0.9 + 0.1 * paidIn})`,
            }}
          >
            <PaidCard title={props.paid.title} text={props.paid.text} check={check} />
          </div>
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={{ x: 0, y: lookY }}
          style={{
            position: "absolute",
            left: STAGE_W / 2 - BUDDY / 2,
            top: BUDDY_TOP + idle + hopY,
          }}
        />

        {fly < 1 ? (
          <div
            style={{
              position: "absolute",
              left: (STAGE_W - CARD_W) / 2,
              top: billTop,
              opacity: billOpacity,
              transform: `translateY(${billDy}px) scale(${billScale})`,
              transformOrigin: "50% 50%",
            }}
          >
            <BillCard
              sender={props.bill.sender}
              dueLabel={props.bill.dueLabel}
              amount={props.bill.amount}
              button={props.bill.forwardButton}
              press={press}
              ripple={ripple}
            />
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
