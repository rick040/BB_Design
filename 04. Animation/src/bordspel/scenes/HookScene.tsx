import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Board, BOARD_W, type SquareLook } from "../components/Board";
import { Die } from "../components/Die";
import { hopAlong } from "../components/hop";
import { Pawn, PAWN_H, PAWN_W } from "../components/Pawn";
import type { BordspelProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  roll: 4, // you throw the die
  rollLen: 16,
  hops: 22, // your pawn hops square by square ...
  hopLen: 4,
  pastDue: 30, // ... straight past the due date
  land: 46, // and lands on "Aanmaning"
  notice: 48, // reminder card slams in, board shakes
  fee: 58, // chip "Kan uitlopen op €40"
};

const BOARD = { x: (1080 - BOARD_W) / 2, y: 0 };
const DIE = { size: 170, x: 110, y: 730 };

export const HookScene: React.FC<{
  props: BordspelProps["hook"];
  board: BordspelProps["board"];
  bill: BordspelProps["bill"];
}> = ({ props, board, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const throwN = Math.max(1, Math.min(6, board.penaltyIndex - board.startIndex));
  const hopsEnd = HOOK_T.hops + throwN * HOOK_T.hopLen;

  // Die: jumps up and tumbles, faces flicker, lands on the throw.
  const rt = interpolate(frame, [HOOK_T.roll, HOOK_T.roll + HOOK_T.rollLen], [0, 1], clamp);
  const dieY = -170 * 4 * rt * (1 - rt);
  const dieRot = rt * 540 + (rt >= 1 ? 0 : 0);
  const rolling = rt > 0 && rt < 1;
  const face = rolling ? ((Math.floor(frame / 3) * 5) % 6) + 1 : rt >= 1 ? throwN : 3;
  const dieLand = interpolate(frame, [HOOK_T.roll + HOOK_T.rollLen, HOOK_T.roll + HOOK_T.rollLen + 3, HOOK_T.roll + HOOK_T.rollLen + 9], [1, 0.86, 1], clamp);

  // Pawn: from the start square, one square per hop.
  const pawn = hopAlong(frame, HOOK_T.hops, board.startIndex, board.startIndex + throwN, HOOK_T.hopLen, 60);

  const s = shake(frame, HOOK_T.notice, 16, 14);
  const pastDue = frame >= HOOK_T.pastDue ? interpolate(frame, [HOOK_T.pastDue, HOOK_T.pastDue + 4, HOOK_T.pastDue + 12], [1, 1.12, 1], clamp) : 1;
  const landed = frame >= hopsEnd;
  const penPop = landed ? pop(frame, fps, hopsEnd, springs.bouncy) : 0;

  const looks: Record<number, SquareLook> = {
    [board.dueIndex]: { bg: p.yellow, fg: p.ink, tag: board.dueLabel, scale: pastDue },
    [board.penaltyIndex]: landed
      ? { bg: p.red, fg: p.white, tag: board.penaltyLabel, scale: 0.9 + 0.1 * penPop }
      : { ring: p.red, fg: p.red, tag: board.penaltyLabel },
  };

  const notice = pop(frame, fps, HOOK_T.notice, { damping: 12, stiffness: 190 });
  const fee = pop(frame, fps, HOOK_T.fee, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-24} stagger={3} />

      <Stage offsetY={70}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` }}>
          <Board days={board.days} looks={looks} bg={p.white} square={p.grey} track="#dfe6f7" style={{ left: BOARD.x, top: BOARD.y }}>
            <Pawn
              color={p.ink}
              shine="#ffffff"
              squash={pawn.squash}
              style={{ left: pawn.x - PAWN_W / 2, top: pawn.y + 44 - PAWN_H }}
            />
          </Board>

          <Die
            size={DIE.size}
            face={face}
            bg={p.white}
            pip={p.blue}
            style={{
              left: DIE.x,
              top: DIE.y + dieY,
              transform: `rotate(${dieRot}deg) scale(${dieLand})`,
            }}
          />
        </div>

        {/* The reminder you rolled into */}
        <div
          style={{
            position: "absolute",
            left: 330,
            top: 700,
            width: 660,
            borderRadius: 40,
            background: p.red,
            color: p.white,
            padding: "26px 36px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            boxShadow: "0 30px 70px rgba(255, 90, 121, 0.35)",
            opacity: frame >= HOOK_T.notice ? Math.min(1, notice * 2) : 0,
            transform: `translateY(${(1 - notice) * -80}px) rotate(${(1 - notice) * -6 + 2}deg) scale(${0.85 + 0.15 * notice})`,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.9 }}>{bill.sender}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 6 }}>
            <div style={{ fontFamily: fonts.display, fontSize: 64, fontWeight: 600, letterSpacing: "-0.04em" }}>{props.noticeTitle}</div>
            <div style={{ fontFamily: fonts.display, fontSize: 56, fontWeight: 600, letterSpacing: "-0.04em" }}>{bill.amount}</div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 440,
            top: 890,
            padding: "14px 30px",
            borderRadius: 999,
            background: p.ink,
            color: p.white,
            fontFamily: fonts.ui,
            fontSize: 38,
            fontWeight: 600,
            whiteSpace: "nowrap",
            opacity: frame >= HOOK_T.fee ? Math.min(1, fee * 2) : 0,
            transform: `scale(${0.6 + 0.4 * fee})`,
            transformOrigin: "30% 50%",
          }}
        >
          {props.feeChip}
        </div>
      </Stage>
    </SceneBg>
  );
};
