import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Arrow } from "../../components/CtaPill";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { LabelChip, SpokenLine } from "../components/SpokenLine";
import { type GelukskoekjeProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
// Rules tick one after another on "vaste regels".
export const FACT_T = {
  label: S - 2,
  card: S + 4,
  forwarded: wordAt("doorgestuurde"),
  rule0: wordAt("vaste") - 6,
  rule1: wordAt("vaste") + 6,
  rule2: wordAt("regels") + 4,
  rule3: wordAt("regels") + 14,
};
const RULES = [FACT_T.rule0, FACT_T.rule1, FACT_T.rule2, FACT_T.rule3];

const BUDDY = 150;
const ROW_Y0 = 440;
const ROW_H = 112;
const ROW_GAP = 14;
const rowY = (i: number) => ROW_Y0 + i * (ROW_H + ROW_GAP);

export const FactScene: React.FC<{ props: GelukskoekjeProps["fact"]; bill: GelukskoekjeProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const labelIn = pop(frame, fps, FACT_T.label, springs.pop);
  const cardIn = pop(frame, fps, FACT_T.card, springs.smooth);
  const fwdIn = pop(frame, fps, FACT_T.forwarded, springs.bouncy);

  // Buddy hops down the rules, landing on each one as it ticks.
  const hopIdx = RULES.reduce((acc, t, i) => (frame >= t - 8 ? i : acc), -1);
  const target = Math.max(0, hopIdx);
  const hopStart = hopIdx >= 0 ? RULES[hopIdx] - 8 : 0;
  const hopU = hopIdx > 0 ? interpolate(frame, [hopStart, hopStart + 8], [0, 1], clamp) : 1;
  const fromY = hopIdx > 0 ? rowY(hopIdx - 1) : rowY(0);
  const feetY = fromY + (rowY(target) - fromY) * hopU + ROW_H - 6 - Math.sin(Math.PI * hopU) * 70;
  const buddyIn = pop(frame, fps, RULES[0] - 12, springs.bouncy);
  const landT = hopIdx >= 0 ? RULES[hopIdx] : -100;
  const squash = interpolate(frame, [landT, landT + 3, landT + 9], [1, 0.82, 1], clamp);

  return (
    <SceneBg color={p.blue}>
      <SpokenLine
        text={props.headline}
        at={[wordAt("nee"), wordAt("vaste"), wordAt("regels")]}
        first={p.white}
        rest={p.blueSoft}
      />
      <Stage>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", justifyContent: "center" }}>
          <LabelChip text={props.label} bg={p.white} fg={p.blue} scale={labelIn} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 540 - BILL_W / 2,
            top: 100,
            width: BILL_W,
            height: BILL_H,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * -80}px) scale(0.96)`,
            transformOrigin: "50% 0%",
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          <div
            style={{
              position: "absolute",
              right: 30,
              top: -26,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 32,
              padding: "10px 24px 10px 14px",
              borderRadius: 30,
              opacity: Math.min(1, fwdIn * 2),
              transform: `scale(${fwdIn}) rotate(4deg)`,
            }}
          >
            <Arrow size={32} color={p.ink} />
            {props.forwardedChip}
          </div>
        </div>

        {props.rules.map((r, i) => {
          const s = pop(frame, fps, RULES[i], springs.pop);
          const tick = interpolate(frame, [RULES[i] + 2, RULES[i] + 10], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 40,
                width: 840,
                top: rowY(i),
                height: ROW_H,
                borderRadius: 30,
                background: "rgba(255,255,255,0.12)",
                border: "2px solid rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "0 34px 0 22px",
                boxSizing: "border-box",
                fontFamily: fonts.display,
                opacity: Math.min(1, s * 1.5),
                transform: `translateX(${(1 - s) * -60}px)`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: p.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Checkmark size={40} color={p.blue} progress={tick} strokeWidth={16} />
              </div>
              <div style={{ fontSize: 30, color: p.blueSoft, width: 118, letterSpacing: "0.02em", opacity: 0.85 }}>Regel {i + 1}</div>
              <div style={{ fontSize: 44, color: p.white, flex: 1 }}>{r.name}</div>
              <div style={{ fontSize: 48, fontWeight: 500, color: p.yellow, letterSpacing: "-0.03em" }}>{r.value}</div>
            </div>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [RULES[3] + 16])}
          squash={squash}
          look={{ x: -0.7, y: 0.3 }}
          style={{
            position: "absolute",
            left: 965 - BUDDY / 2,
            top: feetY - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
    </SceneBg>
  );
};
