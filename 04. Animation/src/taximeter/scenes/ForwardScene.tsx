import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Meter, METER_W } from "../components/Meter";
import { SpokenHeadline } from "../components/SpokenHeadline";
import { euro, SCENE_STARTS, type TaximeterProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const FWD_T = {
  buddyIn: S + 2,
  tap: wordAt("door"),
  swallow: wordAt("door") + 12,
  jump: wordAt("buddy") + 2,
  stop: wordAt("buddy") + 12,
  chip: wordAt("op", 2),
};

const METER_LEFT = (1080 - METER_W) / 2 - 20;
const METER_TOP = 230;
const BUDDY = 160;
const START = { x: 360, y: METER_TOP };
const LAND = { x: METER_LEFT + METER_W - 90, y: METER_TOP };
const BILL_FROM = { x: 540, y: 735 };

export const ForwardScene: React.FC<{
  props: TaximeterProps["forward"];
  hook: TaximeterProps["hook"];
  bill: TaximeterProps["bill"];
}> = ({ props, hook, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const words = [wordAt("stuur"), wordAt("hem"), wordAt("door"), wordAt("buddy"), wordAt("herinnert"), wordAt("je")];

  const buddyIn = pop(frame, fps, FWD_T.buddyIn, springs.bouncy);
  // Bill flies from the forward card into Buddy's mouth.
  const fly = interpolate(frame, [FWD_T.tap + 2, FWD_T.swallow], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const billX = BILL_FROM.x + (START.x - BILL_FROM.x) * fly;
  const billY = BILL_FROM.y + (START.y - 90 - BILL_FROM.y) * fly - Math.sin(Math.PI * fly) * 160;
  const billScale = 0.5 * (1 - 0.85 * fly);
  const billGone = frame >= FWD_T.swallow;
  const btnTap = interpolate(frame, [FWD_T.tap, FWD_T.tap + 3, FWD_T.tap + 8], [1, 0.9, 1], clamp);
  const btnOut = interpolate(frame, [FWD_T.swallow - 4, FWD_T.swallow + 4], [1, 0], clamp);

  // Buddy hops onto the flag lever.
  const j = interpolate(frame, [FWD_T.jump, FWD_T.stop], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const bx = START.x + (LAND.x - START.x) * j;
  const by = START.y - Math.sin(Math.PI * j) * 190;
  const swallowSq = interpolate(frame, [FWD_T.swallow, FWD_T.swallow + 3, FWD_T.swallow + 9], [1, 1.18, 1], clamp);
  const jumpSq = interpolate(frame, [FWD_T.jump - 4, FWD_T.jump, FWD_T.jump + 4], [1, 0.82, 1.1], clamp);
  const landSq = interpolate(frame, [FWD_T.stop, FWD_T.stop + 3, FWD_T.stop + 10], [1, 0.72, 1], clamp);
  const introSq = frame < FWD_T.buddyIn + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : 1;
  const squash = introSq * (frame < FWD_T.jump - 4 ? swallowSq : frame < FWD_T.stop ? jumpSq : landSq);

  const stopped = frame >= FWD_T.stop;
  const flag = interpolate(frame, [FWD_T.stop - 2, FWD_T.stop + 4], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const meterSh = shake(frame, FWD_T.stop, 10, 12);
  const lamp = stopped ? 0 : 0.6 + 0.4 * Math.sin(frame / 4);
  const chipIn = pop(frame, fps, FWD_T.chip, springs.bouncy);
  const look = frame < FWD_T.swallow ? { x: 0.5, y: 0.8 } : frame < FWD_T.stop ? { x: 0.9, y: 0.2 } : { x: -0.3, y: 0.3 };

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline text={props.headline} at={words} colors={[p.white, p.blueSoft]} />
      <Stage>
        <Meter
          label={stopped ? props.stoppedLabel : hook.meterLabel}
          value={euro(stopped ? 0 : hook.meterMax)}
          lamp={lamp}
          flag={flag}
          digitColor={stopped ? p.blueSoft : undefined}
          style={{ left: METER_LEFT + meterSh.x, top: METER_TOP + meterSh.y }}
        />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [FWD_T.stop + 16])}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: by - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        {!billGone ? (
          <div
            style={{
              position: "absolute",
              left: billX - BILL_W / 2,
              top: billY - BILL_H / 2,
              width: BILL_W,
              height: BILL_H,
              transform: `scale(${billScale}) rotate(${-8 * fly}deg)`,
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 840,
            display: "flex",
            justifyContent: "center",
            opacity: btnOut,
            transform: `scale(${btnTap})`,
          }}
        >
          <div
            style={{
              background: p.white,
              color: p.blue,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 40,
              padding: "16px 40px",
              borderRadius: 40,
              boxShadow: frame >= FWD_T.tap && frame < FWD_T.tap + 8 ? `0 0 0 10px ${p.blueSoft}88` : "0 16px 40px rgba(0,20,120,0.25)",
            }}
          >
            {props.button} →
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 650,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.5 + 0.5 * chipIn})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              background: p.white,
              borderRadius: 50,
              padding: "14px 36px 14px 14px",
              boxShadow: "0 20px 50px rgba(0, 20, 120, 0.3)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: p.blueMid,
                color: p.white,
                fontFamily: fonts.display,
                fontWeight: 700,
                fontSize: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {props.agendaDate}
            </div>
            <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 42, color: p.blue }}>{props.agendaChip}</div>
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
