import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Meter, METER_H, METER_W } from "../components/Meter";
import { euro, SCENE_STARTS, type TaximeterProps, wordAt } from "../schema";

// Scenes 1 and 2 (one shot): the meter runs, then races to €40 on "veertig".
export const METER_T = {
  swap: SCENE_STARTS[1],
  aanmaning: wordAt("aanmaning"),
  forty: wordAt("veertig"),
  slowStep: 8,
};

const METER_TOP = 380;

/** Extra costs on the meter at a frame (euros, 10 cent steps). */
export const meterValue = (frame: number, max: number) => {
  const slow = Math.floor(frame / METER_T.slowStep) * 0.1;
  const slowAtA = Math.floor(METER_T.aanmaning / METER_T.slowStep) * 0.1;
  if (frame < METER_T.aanmaning) return slow;
  const u = interpolate(frame, [METER_T.aanmaning, METER_T.forty], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return Math.round((slowAtA + (max - slowAtA) * u) * 10) / 10;
};

export const MeterScene: React.FC<{ props: TaximeterProps["hook"]; bill: TaximeterProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const value = meterValue(frame, props.meterMax);
  const slowTick = frame < METER_T.aanmaning ? interpolate(frame % METER_T.slowStep, [0, 3], [1, 0], clamp) : 0;
  const fastTick = frame >= METER_T.aanmaning && frame < METER_T.forty ? 0.5 + 0.5 * Math.sin(frame * 2.2) : 0;
  const landed = frame >= METER_T.aanmaning;
  const stampIn = pop(frame, fps, METER_T.aanmaning, springs.pop);
  const billSh = shake(frame, METER_T.aanmaning, 12, 16);
  const meterSh = shake(frame, METER_T.forty, 16, 20);
  const chipIn = pop(frame, fps, METER_T.forty + 2, springs.bouncy);
  const h1Out = interpolate(frame, [METER_T.swap - 8, METER_T.swap + 2], [1, 0], clamp);
  const lamp = 0.6 + 0.4 * Math.sin(frame / 4);

  return (
    <SceneBg color={p.light}>
      <AbsoluteFill style={{ opacity: h1Out, transform: `translateY(${(1 - h1Out) * -40}px)` }}>
        <Headline text={props.headline} color={p.blue} delay={-14} stagger={2} />
      </AbsoluteFill>
      {frame >= METER_T.swap - 4 ? <Headline text={props.headline2} color={p.blue} delay={METER_T.swap - 2} stagger={3} /> : null}
      <Stage offsetY={70}>
        <div
          style={{
            position: "absolute",
            left: (1080 - BILL_W) / 2 + billSh.x,
            top: -30 + billSh.y,
            width: BILL_W,
            height: BILL_H,
            transform: `rotate(${-3 + billSh.r}deg) scale(0.8)`,
          }}
        >
          <BillCard
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            dueLabel={landed ? "Te laat" : bill.due}
            urgent={landed}
            stamp={props.stamp}
            stampIn={landed ? stampIn : 0}
          />
        </div>
        <Meter
          label={props.meterLabel}
          value={euro(value)}
          lamp={lamp}
          flag={0}
          tick={Math.max(slowTick, fastTick)}
          style={{ left: (1080 - METER_W) / 2 - 20 + meterSh.x, top: METER_TOP + meterSh.y }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: METER_TOP + METER_H + 60,
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
              boxShadow: "0 20px 50px rgba(17, 24, 39, 0.3)",
            }}
          >
            {props.costChip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
