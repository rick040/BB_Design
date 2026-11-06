import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BillPage, BOOK_W, DayPage, NoticePage, OpenBook } from "../components/Book";
import type { BladwijzerProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  billShown: 8, // the bill page lies open (page turn reveals it)
  skip: 30, // ... and gets turned over without a second look
  notice: 46, // the reminder letter page: red "Aanmaning", book shakes
  chip: 56, // "Kan uitlopen op €40"
  flipLen: 10,
};
// When each page starts to turn (first one is already turning on frame 0).
const FLIPS = [-14, HOOK_T.billShown, HOOK_T.skip, HOOK_T.skip + 7, HOOK_T.notice - 2];

const BOOK = { x: (1080 - BOOK_W) / 2, y: 40 };

export const HookScene: React.FC<{
  props: BladwijzerProps["hook"];
  bill: BladwijzerProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const glow = interpolate(frame, [HOOK_T.billShown + 6, HOOK_T.billShown + 12, HOOK_T.skip - 2, HOOK_T.skip + 2], [0, 1, 1, 0], clamp);
  const s = shake(frame, HOOK_T.notice + 6, 16, 14);
  const chip = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  const pages = [
    <DayPage key="b0" {...props.pagesBefore[0]} />,
    <DayPage key="b1" {...props.pagesBefore[1]} />,
    <BillPage key="bill" day={props.billDay} title={bill.title} sender={bill.sender} amount={bill.amount} due={bill.due} glow={glow} />,
    <DayPage key="a0" {...props.pagesAfter[0]} />,
    <DayPage key="a1" {...props.pagesAfter[1]} />,
    <NoticePage key="n" title={props.noticeTitle} sender={bill.sender} amount={bill.amount} />,
  ];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-20} stagger={3} />

      <Stage offsetY={10}>
        <OpenBook
          frame={frame}
          pages={pages}
          flips={FLIPS}
          flipLen={HOOK_T.flipLen}
          cover={p.blue}
          style={{
            left: BOOK.x,
            top: BOOK.y,
            transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BOOK.y + 800,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chip * 2),
            transform: `scale(${0.6 + 0.4 * chip})`,
          }}
        >
          <div
            style={{
              padding: "18px 36px",
              borderRadius: 60,
              background: p.red,
              color: p.white,
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: "-0.02em",
              boxShadow: "0 14px 30px rgba(255, 90, 121, 0.35)",
            }}
          >
            {props.noticeChip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
