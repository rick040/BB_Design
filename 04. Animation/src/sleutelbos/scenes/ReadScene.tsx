import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { SCENE_STARTS, type SleutelbosProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const READ_T = {
  headline: S - 4,
  amount: wordAt("bedrag"), // chip "Bedrag €128,95"
  date: wordAt("datum"), // chip "Datum vr 12 dec"
};

const CARD = { x: 540 - BILL_W / 2, y: 120 };
const BUDDY = 150;

const Row: React.FC<{ label: string; value: string; t: number; top: number }> = ({ label, value, t, top }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: 170,
        right: 170,
        top,
        height: 104,
        borderRadius: 52,
        background: p.blue,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "0 34px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        color: p.white,
        opacity: Math.min(1, t * 2),
        transform: `translateY(${(1 - t) * 40}px) scale(${0.85 + 0.15 * t})`,
      }}
    >
      <Checkmark size={52} color={p.white} progress={interpolate(t, [0.4, 1], [0, 1], clamp)} strokeWidth={9} />
      <span style={{ fontSize: 38, color: p.blueSoft }}>{label}</span>
      <span style={{ fontSize: 42, fontWeight: 600, marginLeft: "auto" }}>{value}</span>
    </div>
  );
};

export const ReadScene: React.FC<{ props: SleutelbosProps["read"]; bill: SleutelbosProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const a = pop(frame, fps, READ_T.amount - 2, springs.pop);
  const d = pop(frame, fps, READ_T.date - 2, springs.pop);
  const buddyIn = pop(frame, fps, S, springs.bouncy);
  const look = frame < READ_T.amount ? { x: -0.6, y: 0.5 } : { x: 0, y: 0.9 };

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={READ_T.headline} stagger={2} />
      <Stage>
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y }}>
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          look={look}
          blink={blinkScale(frame, [READ_T.date + 8])}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1])}
          style={{
            position: "absolute",
            left: CARD.x + BILL_W - BUDDY - 40,
            top: CARD.y - BUDDY * BUDDY_RATIO + 8,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
        <Row label={props.amountLabel} value={bill.amount} t={a} top={CARD.y + BILL_H + 50} />
        <Row label={props.dateLabel} value={props.date} t={d} top={CARD.y + BILL_H + 174} />
      </Stage>
    </SceneBg>
  );
};
