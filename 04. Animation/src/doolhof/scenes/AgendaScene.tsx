import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Arrow } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { type DoolhofProps, SCENE_STARTS, wordAt } from "../schema";

// Scene 3: forward the bill, Buddy rides it straight down onto the due date.
const S = SCENE_STARTS[2];
export const AGENDA_T = {
  headline: S - 4,
  tap: wordAt("door"), // tap on Doorsturen
  hop: wordAt("door") + 4, // Buddy hops onto the shrinking bill
  ride: wordAt("door") + 10, // straight down
  land: wordAt("agenda"), // lands on the due date
  subline: wordAt("agenda") + 10,
};

const TILE_W = 130;
const TILE_H = 160;
const GAP = 12;
const STRIP_Y = 640;
const CARD_Y0 = 165;
const CARD_S0 = 0.75;
const CARD_S1 = 0.26;
const BUDDY = 110;

export const AgendaScene: React.FC<{ props: DoolhofProps["agenda"]; bill: DoolhofProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // The due tile sits right under the bill, so the line is perfectly straight.
  const stripX = 540 - TILE_W / 2 - props.dueIndex * (TILE_W + GAP);
  const tileY = STRIP_Y + TILE_H / 2;

  const cardIn = pop(frame, fps, S - 6, springs.smooth);
  const press = interpolate(frame, [AGENDA_T.tap, AGENDA_T.tap + 3, AGENDA_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [AGENDA_T.tap, AGENDA_T.tap + 14], [0, 1], clamp);
  const btnOut = interpolate(frame, [AGENDA_T.tap + 6, AGENDA_T.tap + 12], [1, 0], clamp);
  const shrink = interpolate(frame, [AGENDA_T.tap + 2, AGENDA_T.ride], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ride = interpolate(frame, [AGENDA_T.ride, AGENDA_T.land], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cs = CARD_S0 + (CARD_S1 - CARD_S0) * shrink;
  const cy = CARD_Y0 + (tileY - 20 - CARD_Y0) * ride;
  const landed = frame >= AGENDA_T.land;
  const cardFade = interpolate(frame, [AGENDA_T.land, AGENDA_T.land + 6], [1, 0], clamp);
  const tileHit = pop(frame, fps, AGENDA_T.land, springs.bouncy);

  // Buddy: hops on, rides, hops off to the right of the due tile.
  const hopIn = pop(frame, fps, AGENDA_T.hop, springs.bouncy);
  const off = interpolate(frame, [AGENDA_T.land + 2, AGENDA_T.land + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const arc = Math.sin(Math.PI * off) * 70;
  const cardTop = cy - (BILL_H * cs) / 2;
  const onCard = { x: 540, y: cardTop + 4 };
  const rest = { x: stripX + 5 * TILE_W + 4 * GAP + 120, y: STRIP_Y + TILE_H };
  const bx = onCard.x + (rest.x - onCard.x) * off;
  const by = onCard.y + (rest.y - onCard.y) * off - arc;
  const sq = landed
    ? interpolate(frame, [AGENDA_T.land + 12, AGENDA_T.land + 15, AGENDA_T.land + 20], [1, 0.8, 1], clamp)
    : interpolate(frame, [AGENDA_T.ride, AGENDA_T.ride + 4], [1, 0.9], clamp);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={AGENDA_T.headline} stagger={2} sizeFactor={0.92} />
      <Stage>
        {/* straight dashed line from the bill to the due date */}
        <div
          style={{
            position: "absolute",
            left: 535,
            top: CARD_Y0 + 140,
            height: STRIP_Y - CARD_Y0 - 150,
            width: 10,
            backgroundImage: `linear-gradient(${p.blueSoft} 55%, transparent 55%)`,
            backgroundSize: "100% 34px",
            opacity: interpolate(frame, [AGENDA_T.tap, AGENDA_T.tap + 8], [0, 0.9], clamp) * (landed ? 1 - off : 1),
          }}
        />

        {/* week strip */}
        {props.days.map((d, i) => {
          const due = i === props.dueIndex;
          const hit = due && landed;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: stripX + i * (TILE_W + GAP),
                top: STRIP_Y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 26,
                background: hit ? p.white : "rgba(255,255,255,0.14)",
                color: hit ? p.blue : p.blueText,
                fontFamily: fonts.ui,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: hit ? `scale(${1 + 0.12 * (1 - tileHit) + 0.04})` : "none",
                boxShadow: hit ? "0 18px 40px rgba(0,10,80,0.35)" : "none",
              }}
            >
              <div style={{ fontSize: 30, fontWeight: 500 }}>{d.day}</div>
              <div style={{ fontSize: 58, fontWeight: 600, lineHeight: 1.05 }}>{d.date}</div>
              {hit ? (
                <div style={{ fontSize: 24, fontWeight: 600, opacity: tileHit }}>{bill.amount}</div>
              ) : null}
            </div>
          );
        })}

        {/* the bill */}
        <div
          style={{
            position: "absolute",
            left: 540 - BILL_W / 2,
            top: cy - BILL_H / 2,
            width: BILL_W,
            height: BILL_H,
            transform: `scale(${cs * (0.9 + 0.1 * cardIn)})`,
            opacity: Math.min(1, cardIn * 2) * cardFade,
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
        </div>

        {/* Doorsturen button */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", opacity: btnOut * Math.min(1, cardIn * 2) }}>
          <div style={{ position: "relative", transform: `scale(${press})` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: p.white,
                color: p.blue,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 40,
                padding: "18px 38px",
                borderRadius: 50,
              }}
            >
              <Arrow size={40} color={p.blue} />
              {props.button}
            </div>
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
                opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
                transform: `scale(${0.3 + ripple * 1.3})`,
              }}
            />
          </div>
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={sq}
          blink={blinkScale(frame, [AGENDA_T.land + 22])}
          look={landed ? { x: -0.8, y: 0.3 } : { x: 0, y: 1 }}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: by - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, hopIn * 3),
            transform: `scale(${0.3 + 0.7 * hopIn})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
