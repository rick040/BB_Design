import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard, BILL_W } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Dart } from "../components/Dart";
import type { DartsProps } from "../schema";

// Timeline (frames, scene-local).
export const AIM_T = {
  bill: 6, // forwarded bill slides in
  buddy: 22, // Buddy hops up
  readAmount: 38, // ring around the amount
  readDate: 46, // ring around the due date
  subline: 50, // "Hij leest het bedrag en de vervaldatum."
  dateFly: 58, // the date flies from the bill onto a dart
  dateFlyLen: 14,
  windUp: 80, // Buddy squats and aims
};

const CARD = { x: (1080 - BILL_W) / 2, y: 60 };
// Bill-local centres of the amount and the due chip (BillCard layout).
const AMOUNT_C = { x: CARD.x + BILL_W - 44 - 140, y: CARD.y + 330 - 34 - 42 };
const DUE_C = { x: CARD.x + 44 + 150, y: CARD.y + 330 - 34 - 35 };
const BUDDY = 270;
const BUDDY_X = 330; // centre
const FEET = 880;
const DART_TIP = { x: 820, y: 540 };
const DART_ANGLE = 150;
const TAG_AT = {
  x: DART_TIP.x + Math.cos((DART_ANGLE * Math.PI) / 180) * 276,
  y: DART_TIP.y + Math.sin((DART_ANGLE * Math.PI) / 180) * 276 + 22,
};

const Ring: React.FC<{ cx: number; cy: number; w: number; h: number; t: number; color: string }> = ({ cx, cy, w, h, t, color }) =>
  t > 0 ? (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        borderRadius: h / 2,
        border: `6px solid ${color}`,
        opacity: Math.min(1, t * 2),
        transform: `scale(${interpolate(t, [0, 1], [1.3, 1])})`,
        zIndex: 5,
      }}
    />
  ) : null;

export const AimScene: React.FC<{ props: DartsProps["aim"]; bill: DartsProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, AIM_T.bill, springs.smooth);
  const chipIn = pop(frame, fps, AIM_T.bill + 8, springs.pop);
  const buddyIn = pop(frame, fps, AIM_T.buddy, springs.bouncy);
  const r1 = frame >= AIM_T.readAmount ? pop(frame, fps, AIM_T.readAmount, springs.pop) : 0;
  const r2 = frame >= AIM_T.readDate ? pop(frame, fps, AIM_T.readDate, springs.pop) : 0;

  const fly = interpolate(frame, [AIM_T.dateFly, AIM_T.dateFly + AIM_T.dateFlyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const dartIn = pop(frame, fps, AIM_T.dateFly + 4, springs.pop);
  const flyX = interpolate(fly, [0, 1], [DUE_C.x, TAG_AT.x]);
  const flyY = interpolate(fly, [0, 1], [DUE_C.y, TAG_AT.y + 30]) - Math.sin(Math.PI * fly) * 120;

  // Buddy: hop in, look at the bill, then at the date, then wind up.
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  if (frame >= AIM_T.windUp) {
    squash = interpolate(frame, [AIM_T.windUp, AIM_T.windUp + 6, AIM_T.windUp + 14, AIM_T.windUp + 20], [1, 0.84, 1.06, 0.95], clamp);
  }
  const lookX = interpolate(frame, [AIM_T.readAmount - 6, AIM_T.readAmount, AIM_T.readDate, AIM_T.dateFly + 10, AIM_T.windUp], [0, 0.7, -0.4, 0.6, 1], clamp);
  const lookY = interpolate(frame, [AIM_T.buddy, AIM_T.readAmount, AIM_T.dateFly + 10, AIM_T.windUp], [-0.2, -1, 0.2, -0.6], clamp);
  const blink = blinkScale(frame, [AIM_T.buddy + 20, AIM_T.windUp + 16]);
  const aimWiggle = frame > AIM_T.windUp ? Math.sin((frame - AIM_T.windUp) / 3) * 3 : 0;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage offsetY={0}>
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y - 64,
            padding: "10px 24px 12px",
            borderRadius: 999,
            background: p.blueMid,
            color: p.white,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 30,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: Math.min(1, chipIn * 2),
            transform: `translateY(${(1 - chipIn) * 20}px)`,
          }}
        >
          <svg width={28} height={28} viewBox="0 0 32 32">
            <path d="M18 7l9 8-9 8M27 15H13a8 8 0 0 0-8 8v2" fill="none" stroke={p.white} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {props.forwardedChip}
        </div>
        <BillCard
          sender={bill.sender}
          subject={bill.subject}
          amount={bill.amount}
          dueLabel={bill.dueLabel}
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            opacity: Math.min(1, cardIn * 2),
            transform: `translateX(${(1 - cardIn) * -700}px) rotate(${(1 - cardIn) * -6}deg)`,
          }}
        />
        <Ring cx={AMOUNT_C.x} cy={AMOUNT_C.y} w={330} h={120} t={r1} color={p.yellow} />
        <Ring cx={DUE_C.x} cy={DUE_C.y} w={330} h={100} t={r2} color={p.yellow} />

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: lookX, y: lookY }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Buddy's dart, ready to throw */}
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, dartIn * 2), transform: `translate(${aimWiggle}px, ${-aimWiggle}px)` }}>
          <Dart
            x={DART_TIP.x}
            y={DART_TIP.y}
            angle={DART_ANGLE}
            scale={0.8 + 0.4 * dartIn}
            barrel={p.white}
            flight={p.blueSoft}
            tag={fly >= 1 ? bill.dueShort : undefined}
            tagBg={p.yellow}
            tagFg={p.ink}
          />
        </div>

        {/* the due date travelling from the bill to the dart */}
        {fly > 0 && fly < 1 ? (
          <div
            style={{
              position: "absolute",
              left: flyX,
              top: flyY,
              transform: "translate(-50%, -50%)",
              padding: "12px 26px",
              borderRadius: 999,
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 34,
              whiteSpace: "nowrap",
              zIndex: 8,
            }}
          >
            {bill.dueShort}
          </div>
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={AIM_T.subline} />
    </SceneBg>
  );
};
