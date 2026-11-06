import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { BOOK_W, DayPage, OpenBook, ReminderPage } from "../components/Book";
import type { BladwijzerProps } from "../schema";

// Timeline (frames, scene-local).
export const FLIP_T = {
  flips: 14, // pages start to fly by (life goes on)
  flipStagger: 7,
  stop: 42, // the book falls open at Buddy's page
  buddyUp: 50, // Buddy pops up out of the spine: here it is
  reminder: 58, // reminder card appears on the page
  subline: 76,
  blink: 92,
  flipLen: 9,
};
const FLIPS = [0, 1, 2, 3].map((i) => (i < 3 ? FLIP_T.flips + i * FLIP_T.flipStagger : FLIP_T.stop - 2));

const BOOK = { x: (1080 - BOOK_W) / 2, y: 140 };
const BUDDY = 170;
const PEEK_LOW = 34; // only the top of his head sticks out while you flip
const PEEK_HIGH = 150; // eyes above the book once he holds the page

export const FlipScene: React.FC<{
  props: BladwijzerProps["flip"];
  bill: BladwijzerProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const up = pop(frame, fps, FLIP_T.buddyUp, springs.bouncy);
  const peek = interpolate(up, [0, 1], [PEEK_LOW, PEEK_HIGH]);
  const squash = frame < FLIP_T.buddyUp ? 1 : interpolate(up, [0, 0.4, 1], [0.9, 1.15, 1]);
  const blink = blinkScale(frame, [FLIP_T.blink]);
  const lookX = interpolate(frame, [FLIP_T.reminder - 2, FLIP_T.reminder + 8], [0, 0.8], clamp);
  const reveal = interpolate(frame, [FLIP_T.reminder, FLIP_T.reminder + 12], [0, 1], clamp);
  const settle = pop(frame, fps, FLIP_T.stop + 8, { damping: 10, stiffness: 220 });
  const bump = frame >= FLIP_T.stop + 8 ? interpolate(settle, [0, 0.5, 1], [0, -8, 0]) : 0;

  const pages = [
    ...props.pages.map((pg, i) => <DayPage key={i} {...pg} />),
    <ReminderPage
      key="r"
      day={props.reminderDay}
      label={props.reminderLabel}
      sender={bill.sender}
      amount={bill.amount}
      note={props.reminderNote}
      reveal={reveal}
    />,
  ];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={4} stagger={3} sizeFactor={0.84} />

      <Stage offsetY={-20}>
        {/* Buddy sits in the spine, behind the book */}
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={{ x: lookX, y: 0.5 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: BOOK.y - peek + bump,
          }}
        />
        <OpenBook
          frame={frame}
          pages={pages}
          flips={FLIPS}
          flipLen={FLIP_T.flipLen}
          cover={p.blue}
          style={{ left: BOOK.x, top: BOOK.y + bump }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={FLIP_T.subline} />
    </SceneBg>
  );
};

export const FLIP_BUDDY_H = BUDDY * BUDDY_RATIO;
