import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { STICKER_H, STICKER_POS, STICKER_W, Sticker } from "../components/Parcel";
import { StickerBill } from "../components/StickerBill";
import { type LaterProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const PEEL_T = {
  headline: S - 4,
  crouch: wordAt("maakt") - 6,
  grab: wordAt("van"),
  peeled: wordAt("van") + 10,
  landed: wordAt("later", 3) + 4,
  date: wordAt("datum", 2),
  strip: wordAt("datum", 2) - 6,
  fly: wordAt("in") - 4,
  tile: wordAt("agenda"),
  wink: wordAt("agenda") + 6,
};

const CARD = { x: 110, y: 30 };
const STICKER = { x: CARD.x + STICKER_POS.left, y: CARD.y + BILL_H - STICKER_POS.bottom - STICKER_H };
const BUDDY = 240;
const BX = 240;
const FEET = 840;
const REST_TOP = FEET - BUDDY * BUDDY_RATIO;
const TILE_W = 170;
const TILE_H = 210;
const GAP = 18;
const STRIP_X = 460;
const STRIP_Y = 590;
const tileCenter = (i: number) => ({ x: STRIP_X + i * (TILE_W + GAP) + TILE_W / 2, y: STRIP_Y + TILE_H / 2 });

export const PeelScene: React.FC<{ props: LaterProps["peel"]; bill: LaterProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Buddy: crouch, jump to the sticker's left corner, fall back holding it.
  const up = interpolate(frame, [PEEL_T.crouch + 4, PEEL_T.grab], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const down = interpolate(frame, [PEEL_T.grab + 2, PEEL_T.landed], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const jumpH = REST_TOP - (STICKER.y + STICKER_H - 10);
  const lift = jumpH * up * (1 - down);
  const buddyTop = REST_TOP - lift;
  const crouch = interpolate(frame, [PEEL_T.crouch, PEEL_T.crouch + 4, PEEL_T.crouch + 8], [1, 0.8, 1.12], clamp);
  const landSq = interpolate(frame, [PEEL_T.landed, PEEL_T.landed + 3, PEEL_T.landed + 9], [1, 0.8, 1], clamp);
  const squash = frame < PEEL_T.grab ? crouch : Math.min(1, landSq);
  const enter = pop(frame, fps, S - 8, springs.bouncy);

  // Sticker: hinges on its right edge, then goes with Buddy.
  const peel = interpolate(frame, [PEEL_T.grab, PEEL_T.peeled], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const detached = frame >= PEEL_T.peeled;
  const hand = { x: BX, y: buddyTop + 10 };

  const revealIn = pop(frame, fps, PEEL_T.date, springs.pop);
  const stripIn = pop(frame, fps, PEEL_T.strip, springs.smooth);
  const flyU = interpolate(frame, [PEEL_T.fly, PEEL_T.tile], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const tileIn = pop(frame, fps, PEEL_T.tile, springs.pop);
  const target = tileCenter(props.dueIndex);
  const chipFrom = { x: CARD.x + 230, y: CARD.y + BILL_H - 61 };
  const chipPos = {
    x: chipFrom.x + (target.x - chipFrom.x) * flyU,
    y: chipFrom.y + (target.y - chipFrom.y) * flyU - 160 * Math.sin(Math.PI * flyU),
  };
  const lookX = frame < PEEL_T.landed ? 0.2 : frame < PEEL_T.fly ? 0.5 : 0.9;
  const lookY = frame < PEEL_T.landed ? -0.9 : frame < PEEL_T.fly ? -0.6 : 0.3;
  const dueText = bill.due.replace(/^Vervalt\s+/i, "");

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={PEEL_T.headline} stagger={3} />
      <Stage offsetY={0}>
        {/* the bill, its due chip now readable */}
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: BILL_W, height: BILL_H }}>
          <StickerBill bill={bill} showSticker={false} tick={Math.sin(Math.PI * Math.min(1, revealIn)) * 1.4} />
        </div>
        {/* blue highlight ring around the revealed date */}
        <div
          style={{
            position: "absolute",
            left: CARD.x + 36,
            top: CARD.y + BILL_H - 34 - 78,
            width: 392,
            height: 86,
            borderRadius: 43,
            border: `6px solid ${p.blue}`,
            opacity: revealIn * (1 - flyU * 0.6),
            transform: `scale(${1.25 - 0.25 * revealIn})`,
          }}
        />

        {/* sticker */}
        <div
          style={{
            position: "absolute",
            left: detached ? hand.x - STICKER_W * 0.2 : STICKER.x,
            top: detached ? hand.y - STICKER_H - 30 : STICKER.y,
            transformOrigin: detached ? "50% 100%" : "100% 50%",
            transform: detached
              ? `rotate(${-28 + Math.sin(frame / 3) * 4}deg) scale(0.55)`
              : `perspective(900px) rotateY(${-peel * 70}deg) rotate(${-2 - peel * 20}deg)`,
            zIndex: 3,
          }}
        >
          <Sticker text={bill.sticker} />
        </div>

        {/* agenda strip */}
        {props.days.map((d, i) => {
          const isDue = i === props.dueIndex;
          const fill = isDue ? tileIn : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: STRIP_X + i * (TILE_W + GAP),
                top: STRIP_Y + (1 - stripIn) * 60,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 34,
                background: fill > 0.02 ? p.blue : p.white,
                boxShadow: "0 16px 40px rgba(1, 40, 160, 0.12)",
                fontFamily: fonts.ui,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 22,
                boxSizing: "border-box",
                opacity: stripIn,
                transform: `scale(${isDue ? 1 + 0.14 * Math.sin(Math.PI * Math.min(1, tileIn)) : 1})`,
              }}
            >
              <div style={{ fontSize: 32, color: fill > 0.02 ? p.blueSoft : p.greyText, fontWeight: 500 }}>{d.day}</div>
              <div style={{ fontSize: 72, fontWeight: 600, color: fill > 0.02 ? p.white : p.ink, lineHeight: 1.05 }}>{d.date}</div>
              {isDue && fill > 0.02 ? (
                <div style={{ fontSize: 30, fontWeight: 600, color: p.white, opacity: Math.min(1, tileIn), marginTop: 4 }}>
                  {bill.amount}
                </div>
              ) : null}
            </div>
          );
        })}

        {/* the date flies from the bill into the agenda */}
        {frame >= PEEL_T.fly && frame < PEEL_T.tile + 2 ? (
          <div
            style={{
              position: "absolute",
              left: chipPos.x - 130,
              top: chipPos.y - 34,
              width: 260,
              height: 68,
              borderRadius: 34,
              background: p.blue,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${1 - 0.45 * flyU})`,
              zIndex: 4,
            }}
          >
            {dueText}
          </div>
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={squash}
          blink={blinkScale(frame, [PEEL_T.wink, PEEL_T.wink + 9])}
          look={{ x: lookX, y: lookY }}
          style={{
            position: "absolute",
            left: BX - BUDDY / 2,
            top: buddyTop,
            opacity: Math.min(1, enter * 2),
            transform: `scale(${0.5 + 0.5 * enter})`,
            transformOrigin: "50% 100%",
            zIndex: 2,
          }}
        />
      </Stage>
    </SceneBg>
  );
};
