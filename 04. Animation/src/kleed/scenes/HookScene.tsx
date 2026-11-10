import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard, BILL_H, BILL_W } from "../../components/BillCard";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Broom } from "../components/Broom";
import { RUG_PAD, Rug } from "../components/Rug";
import { Chip, Slip, SLIP_H, SLIP_W } from "../components/Slip";
import type { KleedProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  sweep: 0, // broom pushes the bill under the rug (already moving on frame 0)
  sweepLen: 22,
  hump: 16, // a hump grows where the bill went
  burst: 50, // the hump bursts: the bill comes back as a final notice
  cost: 60, // "Kan uitlopen op €40"
};

export const RUG = { x: 90, y: 400, w: 900, d: 220 };
const FLOOR = RUG.y + RUG.d - 20; // where the slip ends up (under the rug)
// The slip starts on the floor in front of the rug (fully visible on frame 0)
// and is pushed diagonally up and left under the front edge.
const SLIP_FROM = { x: 660, top: 660 };
const SLIP_TO = { x: 520, top: FLOOR - SLIP_H };

export const HookScene: React.FC<{ props: KleedProps["hook"]; bill: KleedProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const sw = interpolate(frame, [HOOK_T.sweep - 6, HOOK_T.sweep + HOOK_T.sweepLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const slipX = interpolate(sw, [0, 1], [SLIP_FROM.x, SLIP_TO.x]);
  const slipTop = interpolate(sw, [0, 1], [SLIP_FROM.top, SLIP_TO.top]);
  // Broom follows the slip, then backs off to the right.
  const back = interpolate(frame, [HOOK_T.sweep + HOOK_T.sweepLen, HOOK_T.sweep + HOOK_T.sweepLen + 16], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const broomX = slipX + SLIP_W * 0.65 + 70 + back * 520;
  const broomAngle = 26 + Math.sin(frame / 2.2) * 4 * (1 - sw);

  const grow = interpolate(frame, [HOOK_T.hump, HOOK_T.hump + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const swell = interpolate(frame, [HOOK_T.hump + 12, HOOK_T.burst], [1, 1.3], clamp);
  const collapse = interpolate(frame, [HOOK_T.burst, HOOK_T.burst + 4], [1, 0], clamp);
  const bump = grow * swell * collapse;
  const wobble = frame > HOOK_T.hump + 12 && frame < HOOK_T.burst ? Math.sin(frame / 1.6) * 3 : 0;

  const burst = pop(frame, fps, HOOK_T.burst, { damping: 11, stiffness: 150 });
  const s = shake(frame, HOOK_T.burst + 4, 16, 14);
  const cardScale = 1;
  const cardY = interpolate(burst, [0, 1], [RUG.y + 60, 20]);
  const cost = pop(frame, fps, HOOK_T.cost, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-24} stagger={3} />

      <Stage offsetY={110}>
        {/* the bill on the floor, swept under the rug */}
        <Slip
          sender={bill.sender}
          amount={bill.amount}
          scale={1.3}
          style={{
            left: slipX - SLIP_W / 2,
            top: slipTop,
            opacity: frame < HOOK_T.burst ? 1 : 0,
          }}
        />

        <Rug
          width={RUG.w}
          depth={RUG.d}
          base={p.blue}
          stripe={p.blueSoft}
          edge={p.blueMascot}
          fringe={p.blueMid}
          bump={bump}
          bumpX={(SLIP_TO.x - RUG.x) / RUG.w}
          wobble={wobble}
          style={{
            position: "absolute",
            left: RUG.x - RUG_PAD.x,
            top: RUG.y - RUG_PAD.y,
            transform: `translate(${s.x * 0.5}px, ${s.y * 0.5}px)`,
          }}
        />

        <Broom
          x={broomX}
          y={slipTop + SLIP_H + 4}
          angle={broomAngle}
          stick={p.blueMid}
          head={p.blueMascot}
          bristle={p.yellow}
          style={{ opacity: 1 - back }}
        />

        {/* the notice that comes back out */}
        {frame >= HOOK_T.burst ? (
          <BillCard
            sender={props.noticeSender}
            subject={props.noticeSubject}
            amount={bill.amount}
            dueLabel={props.noticeDue}
            urgent
            style={{
              position: "absolute",
              left: 540 - BILL_W / 2,
              top: cardY,
              transform: `translate(${s.x}px, ${s.y}px) rotate(${-4 * burst + s.r}deg) scale(${(0.3 + 0.7 * burst) * cardScale})`,
              transformOrigin: "50% 100%",
              opacity: Math.min(1, burst * 3),
            }}
          />
        ) : null}

        {frame >= HOOK_T.cost ? (
          <Chip
            text={props.costChip}
            bg={p.red}
            fg={p.white}
            size={42}
            style={{
              left: 0,
              right: 0,
              margin: "0 auto",
              width: "fit-content",
              top: 20 + BILL_H * cardScale - 30,
              transform: `scale(${cost}) rotate(${3 * cost}deg)`,
            }}
          />
        ) : null}
      </Stage>
    </SceneBg>
  );
};
