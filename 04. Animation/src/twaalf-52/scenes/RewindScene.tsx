import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Bell } from "../../components/Bell";
import { BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { RollingNumber } from "../../components/RollingNumber";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { amountSteps, type TwaalfProps } from "../schema";

// Timeline (frames, scene-local).
export const REWIND_T = {
  rewind: 6, // €52 rolls back to €12 (reverse roll)
  rewindLen: 24,
  bill: 18, // bill card slides up
  buddy: 26, // Buddy hops onto the card
  chip: 38, // "seintje vooraf" chip(s) pop, bell rings
  chipStagger: 6,
  check: 54, // checkmark draws next to the amount
};

const NUM = 230;
const CARD_Y = 340;
const CARD_SCALE = 0.84;
const BUDDY = 130;

export const RewindScene: React.FC<{
  props: TwaalfProps["rewind"];
  bill: TwaalfProps["bill"];
  amounts: TwaalfProps["amounts"];
}> = ({ props, bill, amounts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const values = amountSteps(amounts.start, amounts.end, amounts.currency);
  const u = interpolate(frame, [REWIND_T.rewind, REWIND_T.rewind + REWIND_T.rewindLen], [1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const speed = Math.sin(Math.PI * u);

  const card = pop(frame, fps, REWIND_T.bill, springs.smooth);
  const hop = interpolate(frame, [REWIND_T.buddy, REWIND_T.buddy + 12], [0, 1], clamp);
  const cardTop = CARD_Y;
  const cardLeft = (1080 - BILL_W * CARD_SCALE) / 2;
  const feetX = cardLeft + 110;
  const startX = -100;
  const bx = startX + (feetX - startX) * hop;
  const by = cardTop - Math.sin(Math.PI * hop) * 160;
  const land = interpolate(frame, [REWIND_T.buddy + 12, REWIND_T.buddy + 15, REWIND_T.buddy + 20], [1, 0.8, 1], clamp);
  const check = interpolate(frame, [REWIND_T.check, REWIND_T.check + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const checkBg = pop(frame, fps, REWIND_T.check - 4, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} />
      <Stage>
        <div style={{ position: "absolute", left: 0, right: 0, top: 30 }}>
          <RollingNumber values={values} progress={u} size={NUM} color={p.white} blur={speed * 12} />
        </div>
        {frame >= REWIND_T.check - 4 ? (
          <div
            style={{
              position: "absolute",
              left: 810,
              top: 70,
              width: 130,
              height: 130,
              borderRadius: "50%",
              background: p.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${checkBg})`,
            }}
          >
            <Checkmark size={78} color={p.blue} progress={check} strokeWidth={16} />
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: (1080 - BILL_W) / 2,
            top: CARD_Y,
            opacity: card,
            transform: `translateY(${(1 - card) * 80}px) scale(${CARD_SCALE})`,
            transformOrigin: "50% 0%",
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
        </div>

        {frame >= REWIND_T.buddy ? (
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blinkScale(frame, [REWIND_T.check + 10])}
            look={frame < REWIND_T.chip ? { x: 0.6, y: -0.6 } : { x: 0.4, y: 1 }}
            squash={land}
            style={{ position: "absolute", left: bx - BUDDY / 2, top: by - BUDDY * BUDDY_RATIO }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: CARD_Y + 330 * CARD_SCALE + 50,
            display: "flex",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {props.reminders.map((r, i) => {
            const at = REWIND_T.chip + i * REWIND_T.chipStagger;
            const c = pop(frame, fps, at, springs.bouncy);
            const tt = frame - at;
            const ring = tt > 0 ? Math.sin(tt / 1.6) * 16 * Math.max(0, 1 - tt / 24) : 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: p.red,
                  color: p.ink,
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 46,
                  padding: "16px 32px 16px 22px",
                  borderRadius: 44,
                  transform: `scale(${c})`,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
                  <Bell size={42} color={p.ink} />
                </div>
                {r}
              </div>
            );
          })}
        </div>
      </Stage>
    </SceneBg>
  );
};
