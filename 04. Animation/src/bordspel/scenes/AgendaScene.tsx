import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Board, BOARD_W, type SquareLook, squareCenter, squarePos, SQ_W } from "../components/Board";
import { hopAlong } from "../components/hop";
import type { BordspelProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  buddyIn: 10, // Buddy pops onto the first square: he is the pawn now
  hop1: 18, // hops to the reminder day ...
  hop1Len: 8,
  flag: 28, // ... and plants the reminder flag
  hop2: 40, // hops on to the due date, no die needed
  hop2Len: 6,
  place: 60, // puts the bill on the due date
  cancel: 72, // the "Aanmaning" square is crossed out
  subline: 82,
};

const BOARD = { x: (1080 - BOARD_W) / 2, y: 70 };
const BUDDY = 130;

export const AgendaScene: React.FC<{
  props: BordspelProps["agenda"];
  board: BordspelProps["board"];
  bill: BordspelProps["bill"];
}> = ({ props, board, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const start = 0;
  const pos =
    frame < AGENDA_T.hop2
      ? hopAlong(frame, AGENDA_T.hop1, start, board.reminderIndex, AGENDA_T.hop1Len, 70)
      : hopAlong(frame, AGENDA_T.hop2, board.reminderIndex, board.dueIndex, AGENDA_T.hop2Len, 56);
  const bIn = pop(frame, fps, AGENDA_T.buddyIn, springs.bouncy);
  const hopDone = frame >= AGENDA_T.hop2 + (board.dueIndex - board.reminderIndex) * AGENDA_T.hop2Len;
  const blink = blinkScale(frame, [AGENDA_T.place + 20]);
  const happy = frame >= AGENDA_T.cancel + 4 ? 0.2 : blink;

  const flag = pop(frame, fps, AGENDA_T.flag, springs.bouncy);
  const place = pop(frame, fps, AGENDA_T.place, springs.bouncy);
  const cancel = interpolate(frame, [AGENDA_T.cancel, AGENDA_T.cancel + 10], [0, 1], clamp);
  const header = pop(frame, fps, 2, springs.pop);

  const placed = frame >= AGENDA_T.place;
  const looks: Record<number, SquareLook> = {
    [board.reminderIndex]: frame >= AGENDA_T.flag ? { bg: p.white, ring: p.blueMid, fg: p.blue, tag: board.reminderLabel, scale: 0.92 + 0.08 * flag } : {},
    [board.dueIndex]: placed
      ? { bg: p.blueSoft, fg: p.blue, tag: bill.shortName, scale: 0.9 + 0.1 * place }
      : { ring: p.blue, fg: p.blue, tag: board.dueLabel },
    [board.penaltyIndex]: { ring: p.red, fg: p.red, tag: board.penaltyLabel, strike: cancel, opacity: 1 - 0.55 * cancel },
  };

  // Little bell flag on the reminder square.
  const rp = squarePos(board.reminderIndex);
  const amountPos = squareCenter(board.dueIndex);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />

      <Stage offsetY={30}>
        {/* Month header turns the board into your agenda */}
        <div
          style={{
            position: "absolute",
            left: BOARD.x,
            width: BOARD_W,
            top: BOARD.y - 74,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, header * 2),
            transform: `translateY(${(1 - header) * 20}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 34px", borderRadius: 999, background: p.blue, color: p.white, fontFamily: fonts.display, fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>
            <svg width={38} height={38} viewBox="0 0 32 32">
              <rect x="3" y="6" width="26" height="23" rx="5" fill="none" stroke={p.white} strokeWidth="3" />
              <path d="M3 13h26M10 3v6M22 3v6" stroke={p.white} strokeWidth="3" strokeLinecap="round" />
            </svg>
            {board.month}
          </div>
        </div>

        <Board days={board.days} looks={looks} bg={p.white} square={p.grey} track="#dfe6f7" style={{ left: BOARD.x, top: BOARD.y }}>
          {/* Bell flag on the reminder day */}
          <div
            style={{
              position: "absolute",
              left: rp.x + SQ_W - 66,
              top: rp.y - 30,
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: p.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: frame >= AGENDA_T.flag ? 1 : 0,
              transform: `scale(${flag}) rotate(${Math.sin(Math.max(0, frame - AGENDA_T.flag) / 2) * 14 * Math.max(0, 1 - (frame - AGENDA_T.flag) / 24)}deg)`,
            }}
          >
            <svg width={44} height={44} viewBox="0 0 32 32">
              <path d="M16 4c-5 0-8 3.6-8 8.5V19l-3 4h22l-3-4v-6.5C24 7.6 21 4 16 4z" fill={p.white} />
              <circle cx="16" cy="26.5" r="3" fill={p.white} />
            </svg>
          </div>

          {/* Amount chip that lands with the bill */}
          <div
            style={{
              position: "absolute",
              left: amountPos.x - 90,
              top: amountPos.y + 70,
              width: 180,
              textAlign: "center",
              padding: "8px 0",
              borderRadius: 999,
              background: p.ink,
              color: p.white,
              fontFamily: fonts.ui,
              fontSize: 30,
              fontWeight: 650,
              opacity: placed ? Math.min(1, place * 2) : 0,
              transform: `scale(${0.6 + 0.4 * place})`,
            }}
          >
            {bill.amount}
          </div>

          {/* Buddy is the pawn */}
          <Buddy
            size={BUDDY}
            body={p.blue}
            eye={p.white}
            blink={happy}
            squash={pos.squash * (frame < AGENDA_T.buddyIn + 8 ? 0.6 + 0.4 * bIn : 1)}
            look={{ x: hopDone ? 0 : 0.6, y: 0.3 }}
            style={{
              position: "absolute",
              left: pos.x - BUDDY / 2,
              top: pos.y + 40 - BUDDY * BUDDY_RATIO,
              opacity: frame >= AGENDA_T.buddyIn ? Math.min(1, bIn * 3) : 0,
              zIndex: 5,
            }}
          />
        </Board>
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
