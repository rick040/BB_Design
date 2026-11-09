import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { GAME_H, GAME_W, GameCard } from "../components/GameCard";
import type { BordspelProps } from "../schema";

// Timeline (frames, scene-local).
export const FWD_T = {
  tap: 22, // tap on "Doorsturen"
  flip: 30, // the mail flips over into a game card
  flipLen: 12,
  buddyIn: 44, // Buddy jumps up from below ...
  catch: 56, // ... and catches the card on his head
  subline: 66,
};

const MAIL = { x: (1080 - BILL_W) / 2, y: 30 };
const CARD_REST = { x: (1080 - GAME_W) / 2, y: 30 };
const BUDDY = 300;
const BUDDY_FEET = 940;
const CARD_SCALE = 0.8;

export const ForwardScene: React.FC<{
  props: BordspelProps["forward"];
  bill: BordspelProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const mailIn = pop(frame, fps, 4, springs.pop);
  const btnIn = pop(frame, fps, 10, springs.pop);
  const tap = interpolate(frame, [FWD_T.tap, FWD_T.tap + 3, FWD_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FWD_T.tap + 1, FWD_T.tap + 16], [0, 1], clamp);

  // Flip: mail folds to 0 width, the game card unfolds.
  const f = interpolate(frame, [FWD_T.flip, FWD_T.flip + FWD_T.flipLen], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mailX = f < 0.5 ? 1 - f * 2 : 0;
  const cardX = f > 0.5 ? (f - 0.5) * 2 : 0;
  const btnOut = interpolate(frame, [FWD_T.flip, FWD_T.flip + 6], [1, 0], clamp);

  // Buddy jumps in from below the stage.
  const bIn = interpolate(frame, [FWD_T.buddyIn, FWD_T.catch], [0, 1], clamp);
  const buddyLift = interpolate(bIn, [0, 0.7, 1], [420, -40, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  const squash =
    frame < FWD_T.buddyIn
      ? 1
      : interpolate(
          frame,
          [FWD_T.buddyIn, FWD_T.buddyIn + 6, FWD_T.catch, FWD_T.catch + 3, FWD_T.catch + 9, FWD_T.catch + 14],
          [0.9, 1.15, 1, 0.82, 1.06, 1],
          clamp,
        );
  const buddyTop = BUDDY_FEET - BUDDY * BUDDY_RATIO + buddyLift;

  // Card drops onto Buddy's head when he arrives.
  const drop = interpolate(frame, [FWD_T.catch - 8, FWD_T.catch], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const restTop = buddyTop + BUDDY * BUDDY_RATIO * (1 - squash) - GAME_H + 10; // scaled from its bottom edge
  const cardTop = interpolate(drop, [0, 1], [CARD_REST.y, restTop]);
  const cardScale = interpolate(drop, [0, 1], [1, CARD_SCALE]);
  const wobble = frame > FWD_T.catch ? Math.sin((frame - FWD_T.catch) / 3) * 4 * Math.max(0, 1 - (frame - FWD_T.catch) / 24) : 0;

  const blink = blinkScale(frame, [FWD_T.catch + 18]);
  const idle = frame > FWD_T.catch + 14 ? Math.sin((frame - FWD_T.catch - 14) / 8) * 3 : 0;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={8} stagger={3} />

      <Stage offsetY={0}>
        {/* The bill as a mail, with a forward button */}
        <div
          style={{
            position: "absolute",
            left: MAIL.x,
            top: MAIL.y,
            transform: `scaleX(${Math.max(0.001, mailX)}) scale(${0.9 + 0.1 * mailIn})`,
            opacity: f < 0.5 ? Math.min(1, mailIn * 2) : 0,
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.dueDate} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: MAIL.y + BILL_H + 40,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, btnIn * 2) * btnOut,
            transform: `scale(${(0.8 + 0.2 * btnIn) * tap})`,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "22px 46px",
              borderRadius: 999,
              background: p.white,
              color: p.blue,
              fontFamily: fonts.ui,
              fontSize: 44,
              fontWeight: 600,
            }}
          >
            {props.forwardButton}
            <svg width={44} height={44} viewBox="0 0 32 32">
              <path d="M6 16h18M17 8l8 8-8 8" fill="none" stroke={p.blue} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
                border: `5px solid ${p.white}`,
                opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.4})`,
              }}
            />
          </div>
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: 0, y: frame < FWD_T.catch ? -0.9 : -0.4 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: buddyTop + idle,
            opacity: frame >= FWD_T.buddyIn ? 1 : 0,
          }}
        />

        {/* The game card */}
        <GameCard
          name={bill.shortName}
          amount={bill.amount}
          due={bill.dueDate}
          style={{
            left: CARD_REST.x,
            top: cardTop + (frame > FWD_T.catch ? idle : 0),
            transform: `scaleX(${Math.max(0.001, cardX)}) scale(${cardScale}) rotate(${wobble}deg)`,
            transformOrigin: "50% 100%",
            opacity: f > 0.5 ? 1 : 0,
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={FWD_T.subline} />
    </SceneBg>
  );
};
