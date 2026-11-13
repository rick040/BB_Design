import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { type BallonProps, MARKERS, wordAt } from "../schema";

// [S3] Blue: the balloon is gone, Buddy names his price and puts the bill in your agenda.
export const PRICE_T = {
  land: MARKERS[2] + 4, // Buddy drops in after the pop
  price: wordAt("drie"), // "€3,49"
  per: wordAt("per"),
  month: wordAt("maand"),
  cardFall: wordAt("drie") + 6, // the bill drifts down onto Buddy's head
  cardOnHead: wordAt("negenenveertig") + 8,
  strip: wordAt("en") - 4, // agenda strip appears
  toss: wordAt("zet"), // Buddy tosses the bill
  inAgenda: wordAt("agenda"), // lands on the due day
  reminder: wordAt("zet") + 2, // reminder chip on the day you chose
  subline: wordAt("zet") - 2,
};

const BUDDY = 190;
const BX = 540;
const FEET = 470;
const CARD_W = 300;
const CARD_H = 116;
const TILE_W = 170;
const TILE_H = 180;
const TILE_GAP = 20;
const STRIP_Y = 610;
const tileX = (i: number) => (1080 - (5 * TILE_W + 4 * TILE_GAP)) / 2 + i * (TILE_W + TILE_GAP);

export const PriceScene: React.FC<{ props: BallonProps["price"]; bill: BallonProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const T = PRICE_T;

  // Headline words on the spoken words.
  const lines = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  const spoken = [T.price, T.per, T.month];
  let wi = 0;

  // Buddy drops in and squashes.
  const dropU = interpolate(frame, [MARKERS[2] - 6, T.land], [0, 1], clamp);
  const feetDrop = interpolate(dropU, [0, 1], [FEET - 140, FEET]);
  const landSq = interpolate(frame, [T.land, T.land + 3, T.land + 10], [1, 0.8, 1], clamp);
  const headSq = interpolate(frame, [T.cardOnHead, T.cardOnHead + 3, T.cardOnHead + 10], [1, 0.86, 1], clamp);
  const tossSq = interpolate(frame, [T.toss - 6, T.toss, T.toss + 6], [1, 0.84, 1.08], clamp);
  const hop = Math.sin(Math.PI * interpolate(frame, [T.toss, T.toss + 14], [0, 1], clamp)) * 70;
  const squash = Math.min(landSq, headSq) * (frame >= T.toss - 6 ? tossSq : 1);
  const feet = (frame < T.land ? feetDrop : FEET) - hop;
  const bTop = feet - BUDDY * BUDDY_RATIO * squash;

  // The bill: falls onto Buddy's head, then flies to the due day.
  const fallU = interpolate(frame, [T.cardFall, T.cardOnHead], [0, 1], clamp);
  const head = { x: BX, y: bTop - CARD_H / 2 + 6 };
  const dueX = tileX(props.dueIndex) + TILE_W / 2;
  const dueY = STRIP_Y + TILE_H / 2 + 20;
  const flyU = interpolate(frame, [T.toss, T.inAgenda], [0, 1], clamp);
  let cx: number;
  let cy: number;
  let rot: number;
  let sc = 1;
  if (frame < T.toss) {
    cx = interpolate(fallU, [0, 1], [BX + 160, head.x]);
    cy = interpolate(fallU * fallU, [0, 1], [-120, head.y]);
    rot = interpolate(fallU, [0, 1], [24, -4]) + Math.sin(frame / 4) * (1 - fallU) * 10;
  } else {
    cx = interpolate(flyU, [0, 1], [head.x, dueX]);
    cy = interpolate(flyU, [0, 1], [head.y, dueY]) - Math.sin(Math.PI * flyU) * 220;
    rot = -4 + 360 * flyU;
    sc = interpolate(flyU, [0, 1], [1, 0.48]);
  }
  const inTile = frame >= T.inAgenda;

  const stripIn = pop(frame, fps, T.strip, springs.smooth);
  const tileHit = pop(frame, fps, T.inAgenda, springs.bouncy);
  const remIn = pop(frame, fps, T.reminder, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.1,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const at = spoken[wi] ?? spoken[spoken.length - 1];
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

      <Stage offsetY={-30}>
        {/* Agenda strip */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: STRIP_Y,
            width: 1080,
            height: TILE_H + 60,
            opacity: stripIn,
            transform: `translateY(${(1 - stripIn) * 60}px)`,
          }}
        >
          {props.days.map((d, i) => {
            const due = i === props.dueIndex;
            const rem = i === props.reminderIndex;
            const filled = due && inTile;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: tileX(i),
                  top: 20,
                  width: TILE_W,
                  height: TILE_H,
                  borderRadius: 30,
                  background: filled ? p.yellow : p.white,
                  transform: due ? `scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, tileHit))})` : undefined,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: 18,
                  boxSizing: "border-box",
                  fontFamily: fonts.display,
                  color: p.blue,
                }}
              >
                <div style={{ fontSize: 34, opacity: 0.7 }}>{d.day}</div>
                <div style={{ fontSize: 62, fontWeight: 600, lineHeight: 1.05, letterSpacing: headlineTracking }}>{d.date}</div>
                {filled ? (
                  <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 30, marginTop: 6, opacity: tileHit }}>
                    {bill.amount}
                  </div>
                ) : null}
                {rem ? (
                  <div
                    style={{
                      position: "absolute",
                      top: -34,
                      left: "50%",
                      transform: `translateX(-50%) scale(${remIn})`,
                      background: p.red,
                      color: "#fff",
                      fontFamily: fonts.ui,
                      fontWeight: 600,
                      fontSize: 28,
                      padding: "8px 18px",
                      borderRadius: 30,
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <svg width={26} height={26} viewBox="0 0 24 24">
                      <path
                        d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2 15a2 2 0 0 0 4 0"
                        fill="#fff"
                      />
                    </svg>
                    {props.reminderLabel}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          blink={blinkScale(frame, [T.cardOnHead + 2, T.inAgenda + 10])}
          look={frame >= T.toss ? { x: 0.8, y: 0.6 } : frame >= T.cardFall ? { x: 0.3, y: -0.9 } : { x: 0, y: 0 }}
          style={{ position: "absolute", left: BX - BUDDY / 2, top: feet - BUDDY * BUDDY_RATIO, transformOrigin: "50% 100%" }}
        />

        {frame >= T.cardFall && !inTile ? (
          <div
            style={{
              position: "absolute",
              left: cx - CARD_W / 2,
              top: cy - CARD_H / 2,
              width: CARD_W,
              height: CARD_H,
              borderRadius: 24,
              background: p.white,
              boxShadow: "0 16px 40px rgba(0,0,40,0.3)",
              transform: `rotate(${rot}deg) scale(${sc})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 26px",
              boxSizing: "border-box",
              fontFamily: fonts.ui,
              color: p.ink,
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 500, opacity: 0.7 }}>{bill.sender.slice(0, 12)}</span>
            <span style={{ fontSize: 36, fontWeight: 700 }}>{bill.amount}</span>
          </div>
        ) : null}
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={T.subline} />
    </SceneBg>
  );
};
