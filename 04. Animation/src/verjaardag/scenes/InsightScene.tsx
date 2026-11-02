import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { BirthdayCalendar, CAL_W } from "../components/BirthdayCalendar";
import { Confetti } from "../components/Confetti";
import { PartyBuddy, tootCurve, tootSquash } from "../components/PartyBuddy";
import { DOOR_W, WcDoor } from "../components/WcDoor";
import type { VerjaardagProps } from "../schema";

// Timeline (frames, scene-local).
export const INSIGHT_T = {
  buddyIn: 12, // Buddy hops in with his party hat on
  toot: 40, // toots his party horn at the calendar on the door
  tootLen: 20,
  confetti: 45, // confetti over the calendar
  subline: 40,
};

const DOOR = { x: 120, y: 40 };
const CAL_SCALE = 0.5;
const BUDDY = { x: 790, feet: 880, size: 250 };

export const InsightScene: React.FC<{
  props: VerjaardagProps["insight"];
  calendar: VerjaardagProps["calendar"];
  toot: string;
}> = ({ props, calendar, toot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const buddyIn = pop(frame, fps, INSIGHT_T.buddyIn, springs.bouncy);
  const hop = interpolate(buddyIn, [0, 1], [260, 0]);
  const squash = interpolate(buddyIn, [0, 0.6, 1], [1.2, 0.9, 1]) * tootSquash(frame, INSIGHT_T.toot, INSIGHT_T.tootLen);
  const unroll = tootCurve(frame, INSIGHT_T.toot, INSIGHT_T.tootLen);
  const idle = frame > INSIGHT_T.toot + INSIGHT_T.tootLen ? Math.sin((frame - INSIGHT_T.toot - INSIGHT_T.tootLen) / 7) * 4 : 0;
  const blink = blinkScale(frame, [INSIGHT_T.buddyIn + 18, 72]);
  const doorIn = pop(frame, fps, -4, springs.smooth);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={8} stagger={3} />

      <Stage offsetY={-10}>
        <WcDoor sign={props.doorSign} style={{ left: DOOR.x, top: DOOR.y + (1 - doorIn) * 60 }}>
          <div
            style={{
              position: "absolute",
              left: DOOR_W / 2 - (CAL_W * CAL_SCALE) / 2,
              top: 210,
              width: CAL_W,
              transform: `scale(${CAL_SCALE}) rotate(-2deg)`,
              transformOrigin: "0 0",
            }}
          >
            <BirthdayCalendar
              title={calendar.title}
              month={calendar.month}
              rows={calendar.rows}
              matchDay={calendar.matchDay}
              ring={1}
              style={{ left: 0, top: 0 }}
            />
          </div>
        </WcDoor>

        <Confetti frame={frame} start={INSIGHT_T.confetti} x={DOOR.x + DOOR_W / 2} y={360} direction={-70} spread={140} seed="ins" />

        <PartyBuddy
          x={BUDDY.x}
          feetY={BUDDY.feet + hop + idle}
          size={BUDDY.size}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: -0.8, y: -0.3 }}
          hornAngle={200}
          hornLength={230}
          hornUnroll={unroll}
          toot={toot}
          style={{ opacity: interpolate(buddyIn, [0, 0.2], [0, 1], clamp) }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={INSIGHT_T.subline} />
    </SceneBg>
  );
};
