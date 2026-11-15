import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification, NOTIFICATION_W } from "../../components/Notification";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Bell } from "../components/Door";
import { DayRow, ROW_DH, rowDoorCenter } from "../components/DayRow";
import { type AdventProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const PICK_T = {
  headline: S - 6,
  tap: wordAt("kies"), // you tap your reminder day
  subline: wordAt("jij") + 2,
  open: wordAt("herinnert") - 8, // the chosen door opens
  buddy: wordAt("herinnert") - 4, // Buddy pops out with a bell
  note: wordAt("herinnert") + 2, // reminder notification
};

const ROW_TOP = 470;
const BUDDY = 130;

export const PickScene: React.FC<{ props: AdventProps["pick"]; bill: AdventProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const ring = pop(frame, fps, PICK_T.tap, springs.pop);
  const ripple = interpolate(frame, [PICK_T.tap, PICK_T.tap + 14], [0, 1], clamp);
  const open = pop(frame, fps, PICK_T.open, springs.smooth, 10);
  const opens = props.days.map((_, i) => (i === props.reminderIndex ? open : 0));
  const rings = props.days.map((_, i) => (i === props.reminderIndex ? ring : 0));

  const bIn = pop(frame, fps, PICK_T.buddy, springs.bouncy);
  const noteIn = pop(frame, fps, PICK_T.note, springs.pop);
  const swing = Math.sin((frame - PICK_T.buddy) / 2.2) * 18 * Math.max(0, 1 - (frame - PICK_T.buddy) / 40);
  const rx = rowDoorCenter(props.reminderIndex);
  const feet = ROW_TOP + ROW_DH - 18;
  const lift = 40 * bIn;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={PICK_T.headline} stagger={2} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: (1080 - NOTIFICATION_W) / 2,
            top: 120,
            opacity: Math.min(1, noteIn * 2),
            transform: `translateY(${(1 - noteIn) * -60}px) scale(${0.9 + 0.1 * noteIn})`,
          }}
        >
          <Notification text={props.reminderText} time={props.reminderTime} icon="new" title="Herinnering" />
        </div>
        <DayRow
          top={ROW_TOP}
          days={props.days}
          month={props.month}
          opens={opens}
          rings={rings}
          front={p.blue}
          frontText={p.white}
          recess="#dfe6ff"
          monthColor={p.blue}
          dueIndex={props.dueIndex}
          dueTag={bill.amount}
          dueTagIn={1}
          tagBg={p.white}
          tagText={p.blue}
        />
        {/* tap ripple on the chosen day */}
        <div
          style={{
            position: "absolute",
            left: rx - 100,
            top: ROW_TOP + ROW_DH / 2 - 100,
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `6px solid ${p.yellow}`,
            opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0,
            transform: `scale(${0.3 + ripple * 1.2})`,
          }}
        />
        {bIn > 0.01 ? (
          <>
            <Buddy
              size={BUDDY}
              body={p.blueMascot}
              eye={p.white}
              blink={blinkScale(frame, [PICK_T.note + 10])}
              look={{ x: 0, y: -0.6 }}
              squash={interpolate(bIn, [0, 0.6, 1], [0.6, 1.12, 1])}
              style={{
                position: "absolute",
                left: rx - BUDDY / 2,
                top: feet - BUDDY * BUDDY_RATIO - lift,
                transform: `scale(${Math.min(1, bIn)})`,
                transformOrigin: "50% 100%",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: rx - 34,
                top: feet - BUDDY * BUDDY_RATIO - lift - 78,
                transform: `scale(${Math.min(1, bIn)})`,
              }}
            >
              <Bell size={68} color={p.yellow} swing={swing} />
            </div>
          </>
        ) : null}
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={PICK_T.subline} />
    </SceneBg>
  );
};
