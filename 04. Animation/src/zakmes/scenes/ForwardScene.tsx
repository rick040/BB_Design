import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Knife } from "../components/Knife";
import { SCENE_STARTS, type ZakmesProps, wordAt } from "../schema";
import { EMBLEM, KNIFE_CX, KNIFE_CY } from "./OpenScene";

const S = SCENE_STARTS[2];
// Absolute frames, hung on the spoken words.
export const FWD_T = {
  card: wordAt("rekening") - 6, // the bill pops out of the mail tool
  tap: wordAt("door") - 6, // tap "Doorsturen"
  fly: wordAt("door"), // bill flies into Buddy
  gulp: wordAt("door") + 12,
  subline: wordAt("buddy") - 4,
  date: wordAt("vervaldatum"), // date chip leaves Buddy
  land: wordAt("vervaldatum") + 18, // lands on the agenda tool
  tile: wordAt("agenda", 2) - 4, // calendar tile pops
  reminder: wordAt("agenda", 2) + 6,
};

const CARD = { x: 300, y: 120, w: 470, h: 210 };
const TILE = { x: 790, y: 125, w: 260, h: 250 };
const BUD = { x: KNIFE_CX, y: KNIFE_CY };

export const ForwardScene: React.FC<{ props: ZakmesProps["forward"]; bill: ZakmesProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, FWD_T.card, springs.pop);
  const tap = interpolate(frame, [FWD_T.tap, FWD_T.tap + 3, FWD_T.tap + 8], [1, 0.9, 1], clamp);
  const fly = interpolate(frame, [FWD_T.fly, FWD_T.gulp], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const cardX = CARD.x + (BUD.x - CARD.x) * fly;
  const cardY = CARD.y + (BUD.y - CARD.y) * fly - Math.sin(fly * Math.PI) * 60;
  const cardS = (0.6 + 0.4 * cardIn) * (1 - 0.85 * fly);
  const cardGone = frame >= FWD_T.gulp;

  const gulp = interpolate(frame - FWD_T.gulp, [0, 3, 8, 14], [1, 0.8, 1.12, 1], clamp);
  const push = interpolate(frame - FWD_T.date, [-3, 0, 6], [1, 1.1, 1], clamp);

  const d = interpolate(frame, [FWD_T.date, FWD_T.land], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const chipX = BUD.x + (TILE.x - BUD.x) * d;
  const chipY = BUD.y - 40 + (TILE.y + 40 - (BUD.y - 40)) * d - Math.sin(d * Math.PI) * 120;
  const chipShow = frame >= FWD_T.date && frame < FWD_T.tile + 4;
  const chipIn = pop(frame, fps, FWD_T.date, springs.pop);

  const tileIn = pop(frame, fps, FWD_T.tile, springs.bouncy);
  const remIn = pop(frame, fps, FWD_T.reminder, springs.bouncy);

  const look =
    frame < FWD_T.fly
      ? { x: -0.8, y: -0.8 }
      : frame < FWD_T.date
        ? { x: -0.3, y: -0.4 }
        : { x: 0.8, y: -0.8 };

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={S - 2} stagger={3} />
      <Stage>
        <Knife cx={KNIFE_CX} cy={KNIFE_CY} handleColor={p.blue} rivetColor={p.blueSoft} openA={1} openB={1} iconColor={p.blue}>
          <Buddy
            size={EMBLEM}
            body={p.white}
            eye={p.blueMascot}
            blink={blinkScale(frame, [FWD_T.gulp + 16])}
            look={look}
            squash={Math.min(gulp, push)}
            style={{
              position: "absolute",
              left: KNIFE_CX - EMBLEM / 2,
              top: KNIFE_CY - (EMBLEM * BUDDY_RATIO) / 2,
            }}
          />
        </Knife>

        {/* forwarded bill */}
        {!cardGone ? (
          <div
            style={{
              position: "absolute",
              left: cardX - CARD.w / 2,
              top: cardY - CARD.h / 2,
              width: CARD.w,
              height: CARD.h,
              borderRadius: 36,
              background: p.white,
              boxShadow: "0 24px 60px rgba(1, 59, 255, 0.16)",
              padding: "26px 34px",
              boxSizing: "border-box",
              transform: `scale(${cardS}) rotate(${-4 + fly * 30}deg)`,
              opacity: Math.min(1, cardIn * 2),
            }}
          >
            <div style={{ fontFamily: fonts.ui, fontSize: 32, color: p.greyText }}>{bill.sender}</div>
            <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 64, color: p.ink, letterSpacing: "-0.03em" }}>
              {bill.amount}
            </div>
            <div
              style={{
                position: "absolute",
                right: 26,
                bottom: 24,
                background: p.blue,
                color: "#fff",
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 30,
                padding: "12px 24px",
                borderRadius: 30,
                transform: `scale(${tap})`,
              }}
            >
              {props.button}
            </div>
          </div>
        ) : null}

        {/* due date flies to the agenda tool */}
        {chipShow ? (
          <div
            style={{
              position: "absolute",
              left: chipX - 110,
              top: chipY - 36,
              width: 220,
              display: "flex",
              justifyContent: "center",
              transform: `scale(${chipIn})`,
            }}
          >
            <div
              style={{
                background: p.yellow,
                color: p.ink,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 38,
                padding: "12px 26px",
                borderRadius: 30,
                whiteSpace: "nowrap",
              }}
            >
              {props.weekday} {props.day} {props.month}
            </div>
          </div>
        ) : null}

        {/* calendar tile at the agenda tool */}
        <div
          style={{
            position: "absolute",
            left: TILE.x - TILE.w / 2,
            top: TILE.y - TILE.h / 2,
            width: TILE.w,
            height: TILE.h,
            borderRadius: 40,
            background: p.white,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(1, 59, 255, 0.18)",
            transform: `scale(${tileIn}) rotate(${(1 - tileIn) * 10}deg)`,
            opacity: Math.min(1, tileIn * 3),
            textAlign: "center",
          }}
        >
          <div style={{ background: p.blueMid, color: "#fff", fontFamily: fonts.ui, fontWeight: 600, fontSize: 36, padding: "12px 0" }}>
            {props.month}
          </div>
          <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 120, color: p.blue, lineHeight: 1.1, letterSpacing: "-0.04em" }}>
            {props.day}
          </div>
          <div style={{ fontFamily: fonts.ui, fontSize: 32, color: p.greyText }}>{props.weekday}</div>
        </div>

        {/* reminder chip under the handle */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 680,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, remIn * 2),
            transform: `scale(${0.5 + 0.5 * remIn})`,
          }}
        >
          <div
            style={{
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 44,
              padding: "18px 38px",
              borderRadius: 44,
              boxShadow: "0 16px 40px rgba(255, 206, 49, 0.35)",
            }}
          >
            {props.reminder}
          </div>
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={FWD_T.subline} />
    </SceneBg>
  );
};
