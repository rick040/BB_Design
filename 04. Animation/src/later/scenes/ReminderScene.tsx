import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { StickerBill } from "../components/StickerBill";
import { type LaterProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
export const REMINDER_T = {
  headline: S - 4,
  drop: S - 6,
  stamp: wordAt("aanmaning"),
  chip: wordAt("aanmaning") + 10,
};

export const ReminderScene: React.FC<{ props: LaterProps["reminder"]; bill: LaterProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const drop = pop(frame, fps, REMINDER_T.drop, springs.bouncy);
  const stampIn = frame >= REMINDER_T.stamp ? pop(frame, fps, REMINDER_T.stamp, springs.pop) : 0;
  const sh = shake(frame, REMINDER_T.stamp + 2, 14, 24);
  const chip = pop(frame, fps, REMINDER_T.chip, springs.bouncy);
  const tint = interpolate(frame, [REMINDER_T.stamp, REMINDER_T.stamp + 8], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <div style={{ position: "absolute", inset: 0, background: p.red, opacity: tint * 0.08 }} />
      <Headline text={props.headline} color={p.blue} delay={REMINDER_T.headline} stagger={2} />
      <Stage offsetY={20}>
        <div
          style={{
            position: "absolute",
            left: 540 - BILL_W / 2 + sh.x,
            top: 180 + sh.y + (1 - drop) * -300,
            width: BILL_W,
            height: BILL_H,
            transform: `rotate(${-3 + sh.r + (1 - drop) * -10}deg)`,
            opacity: Math.min(1, drop * 2),
          }}
        >
          <StickerBill bill={bill} stamp={props.stamp} stampIn={stampIn} urgent />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 600,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chip * 2),
            transform: `scale(${0.5 + 0.5 * chip})`,
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
