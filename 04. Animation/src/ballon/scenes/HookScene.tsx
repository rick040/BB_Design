import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Balloon, BalloonString, Pin, PopBurst } from "../components/Balloon";
import { type BallonProps, MARKERS, wordAt } from "../schema";

// [S1] + [S2] in one continuous light scene. Absolute frames, on the voice.
export const HOOK_T = {
  forgotten: wordAt("vergeten"), // card dims a little
  bill: wordAt("rekening"), // balloon bobs once
  swap: MARKERS[1], // "Hij blaast zich op." replaces the question
  blow1: wordAt("blaast"),
  blow2: wordAt("op"),
  stamp: wordAt("aanmaning"), // AANMANING + Te laat
  forty: wordAt("veertig"), // €40 on the balloon + cost chip
  buddyIn: wordAt("euro") - 4, // Buddy hops onto the card with a pin
  jump: wordAt("euro") + 8,
  pop: MARKERS[2] - 6, // pin hits, balloon pops (burst transition follows)
};

const CARD_SCALE = 0.92;
const CARD_CX = 540;
const CARD_CY = 760;
const CARD_TOP = CARD_CY - (BILL_H * CARD_SCALE) / 2;
const KNOT_Y = 560;
/** Balloon centre at full size, exported for the burst transition. */
export const BALLOON_MAX_R = 200;
export const balloonCy = (r: number) => KNOT_Y - Math.max(10, r * 0.13) - r * 1.18;
export const BALLOON_POP = { x: 540, y: balloonCy(BALLOON_MAX_R) };

const BUDDY = 140;

export const HookScene: React.FC<{ props: BallonProps["hook"]; bill: BallonProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = HOOK_T;

  // Balloon grows in breaths on the spoken words.
  const b1 = pop(frame, fps, T.blow1, springs.bouncy);
  const b2 = pop(frame, fps, T.blow2, springs.bouncy);
  const b3 = pop(frame, fps, T.stamp, springs.bouncy);
  const b4 = pop(frame, fps, T.forty, springs.bouncy);
  const bob = pop(frame, fps, T.bill, springs.bouncy);
  const r = 68 + 6 * bob + 32 * b1 + 28 * b2 + 32 * b3 + (BALLOON_MAX_R - 166) * b4;
  const popP = interpolate(frame, [T.pop, T.pop + 4], [1, 0], clamp);
  const wobble = Math.sin(frame / 7) * (2 + 3 * b4) + (frame > T.pop - 10 ? Math.sin(frame * 1.8) * 3 : 0);
  const cy = balloonCy(r);

  const landed = frame >= T.stamp;
  const sh = shake(frame, T.stamp, 14, 18);
  const stampIn = pop(frame, fps, T.stamp, springs.pop);
  const chipIn = pop(frame, fps, T.forty + 4, springs.bouncy);
  const labelIn = pop(frame, fps, T.forty, springs.pop);
  const dim = interpolate(frame, [T.forgotten, T.forgotten + 10], [1, 0.8], clamp);
  const cardOpacity = landed ? 1 : dim;

  // Question out, inflation line in.
  const qOut = interpolate(frame, [T.swap - 8, T.swap - 1], [1, 0], clamp);

  // Buddy: hop in from the left onto the card, then jump at the balloon.
  const hopIn = interpolate(frame, [T.buddyIn, T.buddyIn + 10], [0, 1], clamp);
  const jumpU = interpolate(frame, [T.jump, T.pop], [0, 1], clamp);
  const fallU = interpolate(frame, [T.pop, T.pop + 14], [0, 1], clamp);
  const restX = 270;
  const restFeet = CARD_TOP;
  let bx = interpolate(hopIn, [0, 1], [-120, restX]);
  let feet = restFeet - Math.sin(Math.PI * hopIn) * 120;
  if (frame >= T.jump) {
    bx = interpolate(jumpU, [0, 1], [restX, 300]);
    feet = restFeet - (restFeet - 450) * Math.sin((Math.PI / 2) * jumpU);
  }
  if (frame >= T.pop) {
    bx = 300 + 40 * fallU;
    feet = 450 + (restFeet - 450) * fallU * fallU;
  }
  const landSq = interpolate(frame, [T.buddyIn + 10, T.buddyIn + 13, T.buddyIn + 18], [1, 0.82, 1], clamp);
  const crouch = interpolate(frame, [T.jump - 5, T.jump], [1, 0.84], clamp);
  const squash = frame < T.jump - 5 ? landSq : frame < T.jump ? crouch : 1.08;
  const bTop = feet - BUDDY * BUDDY_RATIO;
  const pinX = bx + BUDDY * 0.32;
  const pinY = bTop + 10;
  const showBuddy = frame >= T.buddyIn;

  return (
    <SceneBg color={p.light}>
      <div style={{ opacity: qOut }}>
        <Headline text={props.question} color={p.blue} delay={-15} stagger={2} />
      </div>
      {frame >= T.swap - 4 ? <Headline text={props.inflate} color={p.blue} delay={T.swap - 3} stagger={7} /> : null}
      <Stage>
        {popP > 0 ? (
          <>
            <BalloonString
              x1={540}
              y1={KNOT_Y}
              x2={CARD_CX}
              y2={CARD_TOP + 6}
              color={p.greyText}
              sway={wobble * 4}
            />
            <Balloon
              cx={540}
              cy={cy}
              r={r}
              color={p.red}
              label={props.balloonLabel}
              labelIn={labelIn}
              tilt={wobble}
              whole={popP}
            />
          </>
        ) : null}
        <PopBurst cx={BALLOON_POP.x} cy={BALLOON_POP.y} progress={interpolate(frame, [T.pop, T.pop + 12], [0, 1], clamp)} color={p.red} />
        <div
          style={{
            position: "absolute",
            left: CARD_CX - BILL_W / 2 + sh.x,
            top: CARD_CY - BILL_H / 2 + sh.y,
            width: BILL_W,
            height: BILL_H,
            transform: `scale(${CARD_SCALE}) rotate(${sh.r}deg)`,
            opacity: cardOpacity,
          }}
        >
          <BillCard
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            dueLabel={landed ? props.lateLabel : bill.due}
            urgent={landed}
            stamp={props.stamp}
            stampIn={landed ? stampIn : 0}
          />
        </div>
        {showBuddy ? (
          <>
            <Buddy
              size={BUDDY}
              body={p.blueMascot}
              eye={p.white}
              squash={squash}
              blink={blinkScale(frame, [T.buddyIn + 20])}
              look={{ x: 0.7, y: -0.8 }}
              style={{ position: "absolute", left: bx - BUDDY / 2, top: bTop, transformOrigin: "50% 100%" }}
            />
            {frame < T.pop + 2 ? <Pin x={pinX + 70} y={pinY - 70} color={p.yellow} size={100} /> : null}
          </>
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 910,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.5 + 0.5 * chipIn})`,
          }}
        >
          <div
            style={{
              background: p.red,
              color: "#fff",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 46,
              padding: "20px 40px",
              borderRadius: 50,
              boxShadow: "0 20px 50px rgba(255, 90, 121, 0.35)",
            }}
          >
            {props.costChip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
