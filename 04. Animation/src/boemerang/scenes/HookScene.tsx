import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Trail } from "../components/Flight";
import { type BoemerangProps, wordAt } from "../schema";

// Absolute frames; the landing hangs on the spoken word "aanmaning".
export const HOOK_T = {
  windUp: 0,
  throw: 8,
  land: wordAt("aanmaning"),
  chip: wordAt("aanmaning") + 8,
};

const CX = 540;
const CY = 380;

// Boomerang loop: out to the right, over the top, back in from the left.
const flight = (u: number) => ({
  x: CX + 1000 * Math.sin(2 * Math.PI * u),
  y: CY - 1500 * Math.sin(Math.PI * u),
});

export const HookScene: React.FC<{ props: BoemerangProps["hook"]; bill: BoemerangProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const u = interpolate(frame, [HOOK_T.throw, HOOK_T.land], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const pos = flight(u);
  const far = Math.sin(Math.PI * u);
  const windUp = interpolate(frame, [0, HOOK_T.throw], [-4, -14], clamp);
  const rot = frame < HOOK_T.throw ? windUp : -14 - 720 * u;
  const landed = frame >= HOOK_T.land;
  const sh = shake(frame, HOOK_T.land, 14, 22);
  const stampIn = pop(frame, fps, HOOK_T.land, springs.pop);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);
  const scale = 1.08 * (1 - 0.6 * far);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-15} stagger={2} />
      <Stage>
        <Trail at={flight} u={u} length={0.22} color={p.blueSoft} dot={26} />
        <div
          style={{
            position: "absolute",
            left: pos.x + sh.x - BILL_W / 2,
            top: pos.y + sh.y - BILL_H / 2,
            width: BILL_W,
            height: BILL_H,
            transform: `rotate(${rot + sh.r}deg) scale(${scale})`,
          }}
        >
          <BillCard
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            dueLabel={landed ? props.lateLabel : bill.due}
            urgent={landed}
            stamp={props.stamp}
            stampIn={landed ? stampIn : 0}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 690,
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
