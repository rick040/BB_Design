import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Chip } from "../components/Slip";
import { SieveBack, SieveFront } from "../components/Sieve";
import { Slip } from "../components/Slip";
import type { ZeefProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  jiggle: 6, // the sieve starts to wobble
  slip: 16, // the Energie slip sinks into the mesh
  out: 32, // it drops out under the sieve
  land: 46, // it lands as an overdue notice, card shakes
  fee: 58, // red chip "Kan uitlopen op €40"
};

const SIEVE = { x: 160, y: 60 };
// Slips in the bowl (stage coords, top-left + rotation). Last one falls.
// Sieve-local coords: the rim is at y = 50, so these stick out above it.
const SLOTS = [
  { x: 330, y: -116, r: 3 },
  { x: 110, y: -72, r: -12 },
  { x: 450, y: -40, r: 9 },
  { x: 250, y: -58, r: -4 },
];
const CARD = { x: (1080 - BILL_W) / 2, y: 440 };

export const HookScene: React.FC<{ props: ZeefProps["hook"]; bill: ZeefProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const wob = frame >= HOOK_T.jiggle && frame < HOOK_T.out + 8 ? Math.sin((frame - HOOK_T.jiggle) / 2.2) * 3 : 0;

  // Falling slip: sinks into the mesh (shrinks), then drops out below.
  const sink = interpolate(frame, [HOOK_T.slip, HOOK_T.out], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const drop = interpolate(frame, [HOOK_T.out, HOOK_T.land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const last = SLOTS[3];
  const slipY = last.y + sink * 230 + drop * 300;
  const slipScale = 1 - sink * 0.45 + drop * 0.25;
  const slipR = last.r + drop * 40;
  const morph = interpolate(frame, [HOOK_T.land - 2, HOOK_T.land + 4], [0, 1], clamp);

  const cardIn = pop(frame, fps, HOOK_T.land, springs.pop);
  const s = shake(frame, HOOK_T.land, 16, 14);
  const fee = pop(frame, fps, HOOK_T.fee, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-14} stagger={3} />

      <Stage offsetY={90}>
        <div style={{ position: "absolute", left: SIEVE.x, top: SIEVE.y, transform: `rotate(${wob}deg)`, transformOrigin: "50% 30%", scale: "1.12" }}>
          <SieveBack inner={p.grey} />
          {/* Slips in the bowl, sieve-local coords */}
          {props.slips.slice(0, 3).map((label, i) => (
            <Slip
              key={i}
              label={label}
              style={{ left: SLOTS[i].x, top: SLOTS[i].y, transform: `rotate(${SLOTS[i].r}deg)` }}
            />
          ))}
          {morph < 1 ? (
            <Slip
              label={props.slips[3]}
              amount={props.slipAmount}
              style={{
                left: last.x,
                top: slipY,
                transform: `rotate(${slipR}deg) scale(${slipScale})`,
                opacity: 1 - morph,
              }}
            />
          ) : null}
          <SieveFront mesh={p.blueSoft} rim={p.blue} />
        </div>

        {frame >= HOOK_T.land - 2 ? (
          <div
            style={{
              position: "absolute",
              left: CARD.x,
              top: CARD.y,
              transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg) scale(${0.86 * (0.7 + 0.3 * cardIn)})`,
              transformOrigin: "50% 0%",
              opacity: morph,
            }}
          >
            <BillCard
              sender={bill.sender}
              subject={props.noticeSubject}
              amount={bill.amount}
              dueLabel={props.noticeDue}
              urgent
            />
          </div>
        ) : null}

        {frame >= HOOK_T.fee ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: CARD.y + BILL_H * 0.86 + 30, display: "flex", justifyContent: "center" }}>
            <Chip
              text={props.fee}
              bg={p.red}
              fg={p.white}
              size={40}
              style={{ position: "relative", transform: `scale(${fee})`, opacity: Math.min(1, fee * 2) }}
            />
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
