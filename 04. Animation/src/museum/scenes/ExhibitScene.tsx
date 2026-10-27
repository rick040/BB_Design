import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { ExhibitBill, MuseumFrame, Plaque, Torch } from "../components/Museum";
import type { MuseumProps } from "../schema";

// Timeline (frames, scene-local).
export const EXHIBIT_T = {
  forward: 14, // "Doorsturen" tag pops on the frame
  tap: 24, // the tag gets tapped
  buddyIn: 28, // Buddy hops in from the right with his torch
  beam: 38, // torch beam on the frame
  lift: 48, // the bill comes off the wall and flies to Buddy
  catch: 64, // Buddy catches it (squash)
  plaque: 70, // plaque flips to "Uitgeleend aan je agenda"
  chips: 80, // amount and due date pop out
  chipStagger: 6,
  subline: 90,
};

const FRAME = { x: 290, y: 30, w: 500, h: 500, border: 18, mat: 30 };
const BILL = { x: FRAME.x + FRAME.border + FRAME.mat, y: FRAME.y + FRAME.border + FRAME.mat };
const BILL_W = FRAME.w - 2 * (FRAME.border + FRAME.mat);
const BILL_H = FRAME.h - 2 * (FRAME.border + FRAME.mat);
const BUDDY = 170;
const BUDDY_X = 830;
const BUDDY_FEET = 850;

export const ExhibitScene: React.FC<{
  props: MuseumProps["exhibit"];
  bill: MuseumProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const tag = pop(frame, fps, EXHIBIT_T.forward, springs.pop);
  const tap = interpolate(frame, [EXHIBIT_T.tap, EXHIBIT_T.tap + 3, EXHIBIT_T.tap + 8], [1, 0.9, 1], clamp);
  const tagOut = interpolate(frame, [EXHIBIT_T.lift - 4, EXHIBIT_T.lift + 4], [1, 0], clamp);

  // Buddy hops in along a low arc.
  const hop = interpolate(frame, [EXHIBIT_T.buddyIn, EXHIBIT_T.buddyIn + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.quad),
  });
  const bx = interpolate(hop, [0, 1], [1160, BUDDY_X]);
  const by = -Math.sin(hop * Math.PI) * 120;
  let squash = 1;
  if (frame >= EXHIBIT_T.buddyIn + 12) {
    squash = interpolate(frame, [EXHIBIT_T.buddyIn + 12, EXHIBIT_T.buddyIn + 15, EXHIBIT_T.buddyIn + 20], [0.82, 1.06, 1], clamp);
  }
  if (frame >= EXHIBIT_T.catch) {
    squash = interpolate(frame, [EXHIBIT_T.catch, EXHIBIT_T.catch + 3, EXHIBIT_T.catch + 9, EXHIBIT_T.catch + 14], [1, 0.78, 1.08, 1], clamp);
  }
  const looking = frame < EXHIBIT_T.catch + 6;
  const look = looking ? { x: -0.9, y: -0.7 } : { x: -0.2, y: 0.2 };
  const blink = blinkScale(frame, [EXHIBIT_T.catch + 20, EXHIBIT_T.catch + 50]);

  const beam = interpolate(frame, [EXHIBIT_T.beam, EXHIBIT_T.beam + 6], [0, 1], clamp) *
    interpolate(frame, [EXHIBIT_T.catch + 2, EXHIBIT_T.catch + 10], [1, 0], clamp);

  // Bill flight: from its spot on the mat to Buddy's chest, shrinking.
  const fly = interpolate(frame, [EXHIBIT_T.lift, EXHIBIT_T.catch], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const targetX = BUDDY_X + BUDDY / 2 - BILL_W / 2;
  const targetY = BUDDY_FEET - BUDDY * 0.6 - BILL_H / 2;
  const fx = interpolate(fly, [0, 1], [BILL.x, targetX]);
  const fy = interpolate(fly, [0, 1], [BILL.y, targetY]) - Math.sin(fly * Math.PI) * 160;
  const fs = interpolate(fly, [0, 1], [1, 0.12]);
  const fr = interpolate(fly, [0, 1], [0, 28]);
  const billGone = frame >= EXHIBIT_T.catch;

  // Plaque flip (rotateX through 90° and swap the text).
  const flip = interpolate(frame, [EXHIBIT_T.plaque, EXHIBIT_T.plaque + 10], [0, 1], clamp);
  const plaqueText = `${bill.sender}\n${flip < 0.5 ? props.plaqueBefore : props.plaqueAfter}`;
  const flipDeg = flip < 0.5 ? flip * 180 : (flip - 1) * 180;

  const chips = [bill.amount, bill.dueLabel];

  return (
    <SceneBg color={p.blue}>
      <Stage offsetY={30}>
        <div style={{ position: "absolute", left: -400, right: -400, top: 700, height: 1400, background: "rgba(0,0,40,0.16)" }} />

        <MuseumFrame w={FRAME.w} h={FRAME.h} border={FRAME.border} mat={FRAME.mat} style={{ left: FRAME.x, top: FRAME.y }}>
          {/* where the bill used to hang: a nail and a faint outline */}
          <div
            style={{
              position: "absolute",
              inset: 18,
              border: "3px dashed rgba(17,17,20,0.16)",
              borderRadius: 4,
            }}
          />
          <div style={{ position: "absolute", left: "50%", top: 12, width: 12, height: 12, marginLeft: -6, borderRadius: 6, background: p.greyText }} />
        </MuseumFrame>

        {/* torch beam from Buddy to the frame */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: beam * 0.9,
            clipPath: `polygon(${bx - 4}px ${BUDDY_FEET - 100 + by}px, ${FRAME.x + 30}px ${FRAME.y + 40}px, ${FRAME.x + FRAME.w - 10}px ${FRAME.y + FRAME.h + 10}px)`,
            background: "linear-gradient(225deg, rgba(255,236,170,0.75), rgba(255,236,170,0.15))",
          }}
        />

        {!billGone ? (
          <div
            style={{
              position: "absolute",
              left: fx,
              top: fy,
              width: BILL_W,
              height: BILL_H,
              transform: `scale(${fs}) rotate(${fr}deg)`,
              transformOrigin: "50% 50%",
              boxShadow: fly > 0 ? "0 18px 30px rgba(0,0,40,0.3)" : undefined,
            }}
          >
            <ExhibitBill sender={bill.sender} title={bill.title} amount={bill.amount} scale={0.95} />
          </div>
        ) : null}

        {/* Doorsturen tag */}
        <div
          style={{
            position: "absolute",
            left: FRAME.x + FRAME.w - 150,
            top: FRAME.y - 34,
            transform: `scale(${tag * tap}) rotate(${4 - 4 * tag}deg)`,
            opacity: Math.min(1, tag * 2) * tagOut,
            padding: "14px 26px",
            borderRadius: 999,
            background: p.yellow,
            color: p.ink,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 34,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 20px rgba(0,0,40,0.25)",
          }}
        >
          {props.forwardTag} →
        </div>

        <div
          style={{
            position: "absolute",
            left: FRAME.x + 40,
            top: FRAME.y + FRAME.h + 22,
            width: FRAME.w - 80,
            perspective: 800,
          }}
        >
          <Plaque
            text={plaqueText}
            width={FRAME.w - 80}
            size={28}
            accent={flip >= 0.5 ? p.blue : undefined}
            style={{ position: "relative", transform: `rotateX(${flipDeg}deg)` }}
          />
        </div>

        {/* chips */}
        <div
          style={{
            position: "absolute",
            left: 60,
            width: 720,
            top: 735,
            display: "flex",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {chips.map((c, i) => {
            const t = pop(frame, fps, EXHIBIT_T.chips + i * EXHIBIT_T.chipStagger, springs.bouncy);
            return (
              <div
                key={i}
                style={{
                  padding: "14px 26px",
                  borderRadius: 999,
                  background: p.white,
                  color: p.blue,
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 38,
                  whiteSpace: "nowrap",
                  opacity: Math.min(1, t * 2),
                  transform: `translateY(${(1 - t) * 30}px) scale(${0.7 + 0.3 * t})`,
                }}
              >
                {c}
              </div>
            );
          })}
        </div>

        <Torch
          style={{
            left: bx - 66,
            top: BUDDY_FEET - 120 + by,
            transform: "rotate(-145deg)",
            opacity: hop > 0 ? 1 : 0,
          }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          look={look}
          blink={blink}
          squash={squash}
          style={{
            position: "absolute",
            left: bx,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + by,
            opacity: hop > 0 ? 1 : 0,
          }}
        />
      </Stage>

      <Headline text={props.headline} color={p.white} delay={6} stagger={3} />
      <Subline text={props.subline} color={p.blueText} delay={EXHIBIT_T.subline} />
    </SceneBg>
  );
};
