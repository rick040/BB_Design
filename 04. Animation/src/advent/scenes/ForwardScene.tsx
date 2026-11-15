import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Arrow } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { DayRow, rowDoorCenter } from "../components/DayRow";
import { type AdventProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[1];
export const FORWARD_T = {
  headline: S - 6,
  tap: wordAt("door"), // tap on Doorsturen
  fly: wordAt("door") + 4, // bill flies to Buddy
  catch: wordAt("dan"), // Buddy catches it
  hop: wordAt("zet"), // Buddy hops to the due day
  open: wordAt("in") + 1, // door "do 17" opens
  drop: wordAt("je", 2) + 2, // bill drops in
  shut: wordAt("agenda") + 2, // door closes with a tag
};

const ROW_TOP = 680;
const BUDDY = 150;
const FEET = ROW_TOP - 6;
const HEAD = FEET - BUDDY * BUDDY_RATIO;

export const ForwardScene: React.FC<{
  props: AdventProps["forward"];
  bill: AdventProps["bill"];
  pick: AdventProps["pick"];
}> = ({ props, bill, pick }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const startX = 300;
  const dueX = rowDoorCenter(pick.dueIndex);

  const press = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 3, FORWARD_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 14], [0, 1], clamp);
  const btnFade = interpolate(frame, [FORWARD_T.fly, FORWARD_T.fly + 6], [1, 0], clamp);

  // Bill: card → Buddy's hands → into the door.
  const fu = interpolate(frame, [FORWARD_T.fly, FORWARD_T.catch], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const hop = interpolate(frame, [FORWARD_T.hop, FORWARD_T.hop + 12], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const bx = startX + (dueX - startX) * hop;
  const hopY = -110 * Math.sin(Math.PI * hop);
  const du = interpolate(frame, [FORWARD_T.drop, FORWARD_T.drop + 8], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  let cardX = 540;
  let cardY = 190;
  let cardS = 0.9;
  let cardR = 0;
  if (frame >= FORWARD_T.fly) {
    cardX = 540 + (startX - 540) * fu;
    cardY = 190 + (HEAD - 40 - 190) * fu - 120 * Math.sin(Math.PI * fu);
    cardS = 0.9 - 0.72 * fu;
    cardR = -20 * fu;
  }
  if (frame >= FORWARD_T.catch) {
    cardX = bx;
    cardY = HEAD - 40 + hopY;
    cardS = 0.18;
    cardR = -20 + 20 * hop;
  }
  if (frame >= FORWARD_T.drop) {
    cardY = HEAD - 40 + (ROW_TOP + 100 - (HEAD - 40)) * du;
    cardS = 0.18 * (1 - 0.4 * du);
  }
  const cardVisible = frame < FORWARD_T.drop + 8;

  const open = interpolate(frame, [FORWARD_T.open, FORWARD_T.open + 7, FORWARD_T.shut, FORWARD_T.shut + 6], [0, 1, 1, 0], clamp);
  const opens = pick.days.map((_, i) => (i === pick.dueIndex ? open : 0));
  const tagIn = pop(frame, fps, FORWARD_T.shut + 4, springs.pop);

  const buddyIn = pop(frame, fps, S - 2, springs.bouncy);
  const catchSq = interpolate(frame, [FORWARD_T.catch, FORWARD_T.catch + 3, FORWARD_T.catch + 9], [1, 0.82, 1], clamp);
  const landSq = interpolate(frame, [FORWARD_T.hop + 11, FORWARD_T.hop + 14, FORWARD_T.hop + 20], [1, 0.8, 1], clamp);
  const squash =
    frame < S + 10 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : Math.min(catchSq, landSq);
  const lookAt =
    frame < FORWARD_T.catch
      ? { x: 0.6, y: -0.8 }
      : frame >= FORWARD_T.open
        ? { x: 0, y: 0.9 }
        : { x: 0.7, y: 0 };
  const happy = frame > FORWARD_T.shut + 6 ? 0.2 : blinkScale(frame, [FORWARD_T.hop + 18]);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={FORWARD_T.headline} stagger={2} />
      <Stage>
        <DayRow
          top={ROW_TOP}
          days={pick.days}
          month={pick.month}
          opens={opens}
          front={p.blueMid}
          frontText={p.white}
          recess="#0a1f7a"
          monthColor={p.blueSoft}
          dueIndex={pick.dueIndex}
          dueTag={bill.amount}
          dueTagIn={tagIn}
          tagBg={p.white}
          tagText={p.blue}
          inside={(i) =>
            i === pick.dueIndex && frame >= FORWARD_T.drop + 6 ? (
              <div
                style={{
                  position: "absolute",
                  left: 22,
                  right: 22,
                  top: 70,
                  height: 70,
                  borderRadius: 12,
                  background: p.white,
                }}
              />
            ) : null
          }
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 375,
            display: "flex",
            justifyContent: "center",
            opacity: btnFade,
          }}
        >
          <div style={{ position: "relative", transform: `scale(${press})` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: p.white,
                color: p.blue,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 44,
                padding: "20px 42px",
                borderRadius: 60,
                boxShadow: "0 20px 60px rgba(0, 20, 120, 0.3)",
              }}
            >
              {props.button}
              <Arrow size={38} color={p.blue} />
            </div>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 200,
                height: 200,
                marginLeft: -100,
                marginTop: -100,
                borderRadius: "50%",
                border: `6px solid ${p.white}`,
                opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0,
                transform: `scale(${0.3 + ripple * 1.3})`,
              }}
            />
          </div>
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={happy}
          look={lookAt}
          squash={squash}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: HEAD + hopY,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
        {cardVisible ? (
          <div
            style={{
              position: "absolute",
              left: cardX - BILL_W / 2,
              top: cardY - BILL_H / 2,
              width: BILL_W,
              height: BILL_H,
              transform: `rotate(${cardR}deg) scale(${cardS})`,
              opacity: frame >= FORWARD_T.drop ? 1 - du * 0.6 : 1,
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        ) : null}
      </Stage>
    </SceneBg>
  );
};
