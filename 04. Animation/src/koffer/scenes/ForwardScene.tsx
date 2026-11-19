import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard, BILL_H, BILL_W } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { type KofferProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const FORWARD_T = {
  card: S - 4,
  tap: wordAt("is") - 4,
  flyLen: 18,
  catch: wordAt("is") + 14,
  week: wordAt("buddy") - 2,
  jump: wordAt("zet"),
  jumpLen: 16,
  chip: wordAt("datum"),
  subline: wordAt("agenda", 2) - 6,
};
// Headline words land on the spoken words.
const SPOKEN = [wordAt("doorsturen"), wordAt("is"), wordAt("genoeg")];

const CARD_SCALE = 0.78;
const BUDDY = 190;
const TILE_W = 168;
const TILE_H = 170;
const GAP = 14;
const WEEK_Y = 660;

export const ForwardScene: React.FC<{ props: KofferProps["forward"]; bill: KofferProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const T = FORWARD_T;

  const words = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const cardIn = pop(frame, fps, T.card, springs.pop);
  const fly = interpolate(frame, [T.tap + 4, T.tap + 4 + T.flyLen], [0, 1], { ...clamp, easing: (t) => t * t });
  const cardX = 540;
  const cardY0 = 40 + (BILL_H * CARD_SCALE) / 2;
  const buddyHome = { x: 540, feet: 600 };
  const cx = interpolate(fly, [0, 1], [cardX, buddyHome.x]);
  const cy = interpolate(fly, [0, 1], [cardY0, buddyHome.feet - 80]) - Math.sin(fly * Math.PI) * 60;
  const cs = interpolate(fly, [0, 1], [CARD_SCALE, 0.08]);
  const btnIn = pop(frame, fps, T.card + 6, springs.pop);
  const tapS = interpolate(frame, [T.tap, T.tap + 3, T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 16], [0, 1], clamp);
  const btnOut = interpolate(fly, [0, 0.5], [1, 0], clamp);

  const weekIn = (i: number) => pop(frame, fps, T.week + i * 3, springs.pop);
  const dueX = 540 + (props.dueIndex - 2) * (TILE_W + GAP);
  const jump = interpolate(frame, [T.jump, T.jump + T.jumpLen], [0, 1], clamp);
  const bx = interpolate(jump, [0, 1], [buddyHome.x, dueX]);
  const bFeet = interpolate(jump, [0, 1], [buddyHome.feet, WEEK_Y + 4]) - Math.sin(jump * Math.PI) * 220;
  const catchSq = interpolate(frame, [T.catch, T.catch + 3, T.catch + 10], [1, 0.75, 1], clamp);
  const landSq = interpolate(frame, [T.jump + T.jumpLen, T.jump + T.jumpLen + 3, T.jump + T.jumpLen + 10], [1, 0.78, 1], clamp);
  const buddyIn = pop(frame, fps, T.card + 8, springs.bouncy);
  const chip = pop(frame, fps, T.chip, springs.bouncy);
  const look = frame < T.catch ? { x: 0, y: -1 } : frame < T.jump ? { x: 0.8, y: 0.6 } : { x: 0, y: 0.8 };

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {words.map((ws, li) => (
          <div key={li}>
            {ws.map((w, i) => {
              const at = SPOKEN[wi] ?? SPOKEN[SPOKEN.length - 1];
              wi++;
              const s = pop(frame, fps, at - 3, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li === 0 ? p.white : p.blueSoft,
                      opacity: Math.min(1, s * 1.4),
                      transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                      filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                    }}
                  >
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <Stage offsetY={20}>
        {/* bill + Doorsturen button */}
        {fly < 1 ? (
          <div
            style={{
              position: "absolute",
              left: cx - BILL_W / 2,
              top: cy - BILL_H / 2,
              transform: `scale(${cs * (0.6 + 0.4 * cardIn)}) rotate(${fly * -25}deg)`,
              opacity: Math.min(1, cardIn * 2),
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
            top: 40 + BILL_H * CARD_SCALE + 26,
            display: "flex",
            justifyContent: "center",
            opacity: btnOut * Math.min(1, btnIn * 2),
            transform: `scale(${btnIn * tapS})`,
          }}
        >
          <div style={{ position: "relative", padding: "18px 44px", borderRadius: 999, background: p.white, color: p.blue, fontFamily: fonts.ui, fontWeight: 600, fontSize: 38 }}>
            ↪ {props.button}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 160,
                height: 160,
                marginLeft: -80,
                marginTop: -80,
                borderRadius: "50%",
                border: `5px solid ${p.white}`,
                opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.3})`,
              }}
            />
          </div>
        </div>

        {/* week strip */}
        {props.days.map((d, i) => {
          const s = weekIn(i);
          const x = 540 + (i - 2) * (TILE_W + GAP) - TILE_W / 2;
          const due = i === props.dueIndex;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: WEEK_Y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 28,
                background: due && chip > 0.5 ? p.white : "rgba(255,255,255,0.14)",
                transform: `translateY(${(1 - s) * 60}px)`,
                opacity: Math.min(1, s * 2),
                fontFamily: fonts.ui,
                textAlign: "center",
                paddingTop: 16,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 500, color: due && chip > 0.5 ? p.blue : p.blueText }}>{d.day}</div>
              <div style={{ fontSize: 56, fontWeight: 700, color: due && chip > 0.5 ? p.blue : p.white, lineHeight: 1.1 }}>{d.date}</div>
              {due ? (
                <div
                  style={{
                    marginTop: 6,
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 12,
                    background: p.yellow,
                    color: "#111827",
                    fontSize: 26,
                    fontWeight: 700,
                    transform: `scale(${chip})`,
                  }}
                >
                  {bill.amount}
                </div>
              ) : null}
            </div>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [T.catch + 2, T.jump + T.jumpLen + 8])}
          look={look}
          squash={Math.min(catchSq, landSq)}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: bFeet - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * Math.min(1, buddyIn)})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={T.subline} />
    </SceneBg>
  );
};
