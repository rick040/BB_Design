import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Balloon, balloonKnot, BalloonString, StringLayer } from "../components/Balloon";
import type { BallonProps } from "../schema";

// Timeline (frames, scene-local).
export const FORWARD_T = {
  mail: 2, // forwarded mail pops in
  buddyIn: 12, // Buddy hops up from below
  tap: 24, // "Doorsturen" gets tapped
  fly: 30, // mail shrinks and flies to the middle
  flyLen: 14,
  inflate: 40, // ... and blows up into a balloon, string to Buddy
  amount: 52, // amount appears on the balloon
  due: 60, // due date appears under it
  lift: 74, // balloon tugs: Buddy is lifted off the ground
  land: 92, // Buddy lands again, holds on
};

const MAIL_W = 900;
const MAIL_Y = 30;
const BAL = { x: 540, y: 300, w: 340 };
const BUDDY = 250;
const FEET = 850;

export const ForwardScene: React.FC<{
  props: BallonProps["forward"];
  bill: BallonProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const mailIn = pop(frame, fps, FORWARD_T.mail, springs.pop);
  const tap = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 3, FORWARD_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FORWARD_T.tap + 1, FORWARD_T.tap + 16], [0, 1], clamp);
  const fly = interpolate(frame, [FORWARD_T.fly, FORWARD_T.fly + FORWARD_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });

  const inflate = pop(frame, fps, FORWARD_T.inflate, { damping: 10, stiffness: 140 });
  const amountIn = pop(frame, fps, FORWARD_T.amount, springs.pop);
  const dueIn = pop(frame, fps, FORWARD_T.due, springs.pop);

  // Lift: up while the balloon tugs, then a bouncy landing.
  const up = interpolate(frame, [FORWARD_T.lift, FORWARD_T.lift + 10, FORWARD_T.land - 4, FORWARD_T.land], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const liftPx = up * 80;
  const buddyIn = pop(frame, fps, FORWARD_T.buddyIn, springs.bouncy);
  let squash = interpolate(buddyIn, [0, 0.6, 1], [1.25, 1.06, 1]);
  if (frame >= FORWARD_T.lift) squash = interpolate(frame, [FORWARD_T.lift, FORWARD_T.lift + 6, FORWARD_T.lift + 12], [1, 1.14, 1.06], clamp);
  if (frame >= FORWARD_T.land - 1)
    squash = interpolate(frame, [FORWARD_T.land - 1, FORWARD_T.land + 3, FORWARD_T.land + 8, FORWARD_T.land + 13], [1.06, 0.82, 1.06, 1], clamp);
  const blink = blinkScale(frame, [FORWARD_T.inflate + 26, FORWARD_T.land + 10]);
  const lookY = interpolate(frame, [FORWARD_T.inflate - 4, FORWARD_T.inflate + 6], [0, -0.9], clamp);

  const bob = Math.sin(frame / 10) * 6;
  const balY = BAL.y + bob - liftPx * 0.9;
  const knot = balloonKnot(BAL.x, balY, BAL.w);
  const buddyTop = FEET - liftPx - BUDDY * BUDDY_RATIO * squash;
  const holdPoint = { x: 540 + 22, y: buddyTop + 26 };

  // Mail flies from its spot to the balloon centre.
  const mailX = interpolate(fly, [0, 1], [540, BAL.x]);
  const mailY = interpolate(fly, [0, 1], [MAIL_Y + 110, BAL.y]);
  const mailScale = interpolate(fly, [0, 1], [1, 0.12]) * (0.85 + 0.15 * mailIn) * tap;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} />

      <Stage offsetY={10}>
        {frame >= FORWARD_T.inflate ? (
          <StringLayer>
            <BalloonString from={knot} to={holdPoint} color={p.blueSoft} bend={Math.sin(frame / 7) * 14} width={5} opacity={Math.min(1, inflate * 3)} />
          </StringLayer>
        ) : null}

        {frame >= FORWARD_T.inflate ? (
          <Balloon
            cx={BAL.x}
            cy={balY}
            w={BAL.w}
            color={p.white}
            textColor={p.blue}
            label={bill.amount}
            sub={bill.dueLabel}
            subIn={dueIn}
            labelIn={amountIn}
            labelSize={78}
            scale={inflate}
            rotate={Math.sin(frame / 12) * 3}
            opacity={1}
          />
        ) : null}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: 0.2, y: lookY }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO - liftPx,
            opacity: Math.min(1, buddyIn * 3),
            transform: `translateY(${(1 - buddyIn) * 160}px)`,
          }}
        />

        {fly < 1 ? (
          <div
            style={{
              position: "absolute",
              left: mailX - MAIL_W / 2,
              top: mailY - 110,
              width: MAIL_W,
              transform: `scale(${mailScale})`,
              opacity: Math.min(1, mailIn * 2) * (1 - interpolate(fly, [0.7, 1], [0, 1], clamp)),
              background: p.white,
              borderRadius: 34,
              padding: "32px 40px",
              boxSizing: "border-box",
              boxShadow: "0 24px 70px rgba(0, 20, 120, 0.3)",
              fontFamily: fonts.ui,
              zIndex: 4,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  background: p.grey,
                  color: p.blue,
                  fontWeight: 600,
                  fontSize: 32,
                  padding: "10px 22px",
                  borderRadius: 999,
                }}
              >
                {props.forwardedChip}
              </div>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    background: p.blue,
                    color: p.white,
                    fontWeight: 600,
                    fontSize: 34,
                    padding: "14px 30px",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {props.forwardButton}
                  <svg width={32} height={32} viewBox="0 0 32 32">
                    <path d="M18 7l9 8-9 8M27 15H13a8 8 0 0 0-8 8v2" fill="none" stroke={p.white} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 160,
                    height: 160,
                    marginLeft: -80,
                    marginTop: -80,
                    borderRadius: "50%",
                    border: `5px solid ${p.blue}`,
                    opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.8 : 0,
                    transform: `scale(${0.3 + ripple})`,
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: 24, fontSize: 36, color: p.ink, opacity: 0.6 }}>
              {props.fromLabel}: {bill.sender}
            </div>
            <div style={{ marginTop: 8, fontSize: 48, fontWeight: 600, color: p.ink, letterSpacing: "-0.01em" }}>
              {bill.subject}
            </div>
          </div>
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={FORWARD_T.amount + 4} />
    </SceneBg>
  );
};
