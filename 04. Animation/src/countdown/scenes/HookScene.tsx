import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, shake } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { CountdownProps } from "../schema";

const T_COUNT_START = 2;
const T_COUNT_END = 58;
const T_URGENT = T_COUNT_END + 2;

const daysAt = (frame: number, start: number) =>
  Math.max(
    1,
    Math.round(
      interpolate(frame, [T_COUNT_START, T_COUNT_END], [start, 1], {
        ...clamp,
        easing: Easing.in(Easing.quad),
      }),
    ),
  );

export const HookScene: React.FC<{
  props: CountdownProps["hook"];
  bill: CountdownProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const p = usePalette();

  const n = daysAt(frame, props.startDays);
  const changed = n !== daysAt(frame - 2, props.startDays);
  const urgent = n <= 1;
  const label = urgent ? props.dueTomorrow : props.dueLabel.replace("{n}", String(n));

  const s = shake(frame, T_URGENT, 16, 14);
  const ghostPulse = urgent ? interpolate(frame, [T_URGENT, T_URGENT + 6, T_URGENT + 14], [1, 1.08, 1], clamp) : 1;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-6} stagger={3} />

      <Stage offsetY={40}>
        {/* Ghost countdown number behind the card */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: -200,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 1000,
            lineHeight: 1,
            letterSpacing: "-0.08em",
            color: urgent ? p.red : p.blueSoft,
            opacity: urgent ? 0.22 : 0.45,
            transform: `scale(${ghostPulse})`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {n}
        </div>

        <BillCard
          sender={bill.sender}
          subject={bill.subject}
          amount={bill.amount}
          dueLabel={label}
          urgent={urgent}
          tick={changed ? 1 : 0}
          style={{
            position: "absolute",
            left: (1080 - BILL_W) / 2,
            top: 540,
            transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r * 1.5}deg)`,
          }}
        />
      </Stage>
    </SceneBg>
  );
};
