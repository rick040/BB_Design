import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { CLOSED_H, CLOSED_W, ClosedBook } from "../components/Book";
import type { BladwijzerProps } from "../schema";

// Timeline (frames, scene-local).
export const MARK_T = {
  card: 6, // the bill comes back as a mail card
  tap: 18, // tap on "Doorsturen"
  fly: 24, // card flies into the book
  flyLen: 16,
  buddyDrop: 44, // Buddy drops in from above, stretched like a ribbon
  land: 56, // ... and slides into the book: only his eyes stick out
  amount: 66, // chip with the amount
  due: 72, // chip with the due date
  subline: 78,
  blink: 86,
};

const BOOK_SCALE = 1.1;
const BOOK = { x: (1080 - CLOSED_W) / 2, y: 270 };
const CARD_W = 760;
const CARD = { x: (1080 - CARD_W) / 2, y: 30 };
const BUDDY = 210;
// Final position of Buddy's top: this much above the top of the book.
const PEEK = 150;

export const MarkScene: React.FC<{
  props: BladwijzerProps["mark"];
  bill: BladwijzerProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, MARK_T.card, springs.pop);
  const tap = interpolate(frame, [MARK_T.tap, MARK_T.tap + 3, MARK_T.tap + 8], [1, 0.92, 1], clamp);
  const ripple = interpolate(frame, [MARK_T.tap + 1, MARK_T.tap + 14], [0, 1], clamp);
  const fly = interpolate(frame, [MARK_T.fly, MARK_T.fly + MARK_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  // Card: from its slot to the top of the book, shrinking, then down into it.
  const cardX = interpolate(fly, [0, 1], [CARD.x, BOOK.x + CLOSED_W / 2 - CARD_W / 2]);
  const cardY = interpolate(fly, [0, 0.7, 1], [CARD.y, BOOK.y - 140, BOOK.y + 60]);
  const cardScale = interpolate(fly, [0, 0.7, 1], [1, 0.5, 0.45]);

  // Buddy drops from above, stretched, then squashes as he slides in.
  const dropT = interpolate(frame, [MARK_T.buddyDrop, MARK_T.land], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const restTop = BOOK.y - PEEK;
  const top = interpolate(dropT, [0, 1], [-140, restTop + 26]);
  const settle = pop(frame, fps, MARK_T.land, springs.bouncy);
  const buddyTop = frame < MARK_T.land ? top : interpolate(settle, [0, 1], [restTop + 26, restTop]);
  const squash =
    frame < MARK_T.land
      ? interpolate(dropT, [0, 0.3, 1], [1, 1.45, 1.5])
      : interpolate(settle, [0, 0.5, 1], [0.8, 1.08, 1]);
  const blink = blinkScale(frame, [MARK_T.blink]);
  const lookX = interpolate(frame, [MARK_T.amount - 4, MARK_T.amount + 4, MARK_T.due + 2, MARK_T.due + 10], [0, -0.7, -0.7, 0.7], clamp);
  const buddyOpacity = interpolate(frame, [MARK_T.buddyDrop, MARK_T.buddyDrop + 4], [0, 1], clamp);

  const amount = pop(frame, fps, MARK_T.amount, springs.bouncy);
  const due = pop(frame, fps, MARK_T.due, springs.bouncy);

  const chip = (text: string, s: number): React.CSSProperties => ({
    padding: "16px 30px",
    borderRadius: 50,
    background: p.white,
    color: p.blue,
    fontFamily: fonts.display,
    fontWeight: 600,
    fontSize: 48,
    letterSpacing: "-0.02em",
    opacity: Math.min(1, s * 2),
    transform: `translateY(${(1 - s) * 30}px) scale(${0.7 + 0.3 * s})`,
  });

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} sizeFactor={0.84} />

      <Stage offsetY={0}>
        <ClosedBook
          title={props.bookTitle}
          cover={p.white}
          titleColor={p.blue}
          style={{ left: BOOK.x, top: BOOK.y, transform: `scale(${BOOK_SCALE})`, transformOrigin: "50% 0%" }}
          behind={
            <>
              {/* The forwarded mail slides in behind the cover */}
              {fly > 0.7 ? (
                <MailCard
                  bill={bill}
                  label={props.forwardLabel}
                  style={{
                    left: cardX - BOOK.x,
                    top: cardY - BOOK.y,
                    transform: `scale(${cardScale})`,
                  }}
                />
              ) : null}
              <Buddy
                size={BUDDY}
                body={p.white}
                eye={p.blueMascot}
                blink={blink}
                squash={squash}
                look={{ x: lookX, y: frame < MARK_T.land ? 0.6 : 0.3 }}
                style={{
                  position: "absolute",
                  left: CLOSED_W / 2 - BUDDY / 2,
                  top: buddyTop - BOOK.y,
                  opacity: buddyOpacity,
                }}
              />
            </>
          }
        />

        {/* Mail card in front, until it dives into the book */}
        {fly <= 0.7 ? (
          <MailCard
            bill={bill}
            label={props.forwardLabel}
            ripple={ripple}
            style={{
              left: cardX,
              top: cardY,
              opacity: Math.min(1, cardIn * 2),
              transform: `scale(${cardScale * (0.85 + 0.15 * cardIn)})`,
            }}
            buttonScale={tap}
          />
        ) : null}

        <div style={{ position: "absolute", left: 0, right: 0, top: BOOK.y + CLOSED_H * BOOK_SCALE + 24, display: "flex", justifyContent: "center", gap: 24 }}>
          <div style={chip(bill.amount, amount)}>{bill.amount}</div>
          <div style={chip(props.dueChip, due)}>{props.dueChip}</div>
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={MARK_T.subline} />
    </SceneBg>
  );
};

const MailCard: React.FC<{
  bill: BladwijzerProps["bill"];
  label: string;
  style?: React.CSSProperties;
  ripple?: number;
  buttonScale?: number;
}> = ({ bill, label, style, ripple = 0, buttonScale = 1 }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: CARD_W,
        padding: "28px 34px",
        borderRadius: 30,
        background: p.white,
        boxShadow: "0 20px 40px rgba(0, 20, 90, 0.25)",
        transformOrigin: "50% 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div>
        <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 32, color: p.greyText }}>
          {bill.title} · {bill.sender}
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 66, letterSpacing: "-0.03em", color: p.ink, marginTop: 4 }}>
          {bill.amount}
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            padding: "14px 24px",
            borderRadius: 40,
            background: p.blue,
            color: p.white,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 34,
            transform: `scale(${buttonScale})`,
          }}
        >
          {label} →
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
            opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
            transform: `scale(${0.3 + ripple})`,
          }}
        />
      </div>
    </div>
  );
};
