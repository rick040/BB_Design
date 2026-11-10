import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import type { KleedProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  fly: 14, // the bill flies in ...
  land: 28, // ... and lands on the due date
  pick: 38, // a ring hops over the days: you pick the reminder day
  pickLen: 14,
  bell: 54, // reminder bell lands on the chosen day
  subline: 62,
};

// The calendar is a rug too: same fringe on its short sides.
const CARD = { x: 60, y: 150, w: 960, h: 450 };
const TILE_W = 118;
const TILE_GAP = 14;
const TILE_H = 240;
const TILES_X = CARD.x + (CARD.w - (7 * TILE_W + 6 * TILE_GAP)) / 2;
const TILES_Y = CARD.y + 160;
const tileX = (i: number) => TILES_X + i * (TILE_W + TILE_GAP);
const BUDDY = 150;

const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <path d="M20 5c-6 0-10 4.5-10 10.5v7L6.5 28h27L30 22.5v-7C30 9.5 26 5 20 5z" fill={color} />
    <circle cx="20" cy="32.5" r="4" fill={color} />
  </svg>
);

export const AgendaScene: React.FC<{ props: KleedProps["agenda"]; bill: KleedProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const cardIn = pop(frame, fps, -6, springs.smooth);
  const flyT = interpolate(frame, [AGENDA_T.fly, AGENDA_T.land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const landed = frame >= AGENDA_T.land;
  const landPop = pop(frame, fps, AGENDA_T.land, springs.bouncy);
  const dueX = tileX(props.dueIndex);

  // Ring hops from the tile before the due date down to the chosen day.
  const pickFrom = Math.max(0, props.dueIndex - 1);
  const pickT = interpolate(frame, [AGENDA_T.pick, AGENDA_T.pick + AGENDA_T.pickLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const ringX = interpolate(pickT, [0, 1], [tileX(pickFrom), tileX(props.reminderIndex)]);
  const ringIn = pop(frame, fps, AGENDA_T.pick - 4, springs.pop);
  const ringOut = interpolate(frame, [AGENDA_T.bell, AGENDA_T.bell + 8], [1, 0], clamp);
  const bell = pop(frame, fps, AGENDA_T.bell, springs.bouncy);
  const ring = frame >= AGENDA_T.bell ? Math.sin((frame - AGENDA_T.bell) / 1.5) * 14 * Math.max(0, 1 - (frame - AGENDA_T.bell) / 24) : 0;

  // Buddy sits on the calendar's top edge, hops when the bill lands.
  const hopT = interpolate(frame, [AGENDA_T.land, AGENDA_T.land + 12], [0, 1], clamp);
  const hop = -70 * 4 * hopT * (1 - hopT);
  const sq = interpolate(frame, [AGENDA_T.land - 3, AGENDA_T.land, AGENDA_T.land + 12, AGENDA_T.land + 15, AGENDA_T.land + 20], [1, 0.85, 1.08, 0.88, 1], clamp);
  const happy = frame >= AGENDA_T.bell + 6 && frame < AGENDA_T.bell + 22 ? 0.2 : blinkScale(frame, [10]);
  const lookX = frame < AGENDA_T.pick ? -0.6 : interpolate(pickT, [0, 1], [-0.6, -1]);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={4} stagger={3} />

      <Stage offsetY={120}>
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 40}px)`,
          }}
        >
          {/* fringe */}
          {[0, 1].map((side) =>
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`${side}-${i}`}
                style={{
                  position: "absolute",
                  top: 30 + i * 36,
                  left: side === 0 ? -30 : CARD.w - 6,
                  width: 36,
                  height: 7,
                  borderRadius: 4,
                  background: p.blueSoft,
                }}
              />
            )),
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 36,
              background: p.white,
              border: `10px solid ${p.blueSoft}`,
              boxSizing: "border-box",
              boxShadow: "0 30px 80px rgba(1,40,160,0.14)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 56,
              top: 40,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 56,
              letterSpacing: headlineTracking,
              color: p.blue,
            }}
          >
            {props.month}
          </div>
        </div>

        {props.days.map((d, i) => {
          const isDue = i === props.dueIndex && landed;
          const isRem = i === props.reminderIndex && frame >= AGENDA_T.bell;
          const bg = isDue ? p.blue : isRem ? p.blueSoft : p.grey;
          const fg = isDue ? p.white : p.blue;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: tileX(i),
                top: TILES_Y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 26,
                background: bg,
                color: fg,
                fontFamily: fonts.display,
                textAlign: "center",
                opacity: cardIn,
                transform: isDue ? `scale(${0.9 + 0.1 * landPop})` : undefined,
              }}
            >
              <div style={{ fontSize: 36, marginTop: 34, opacity: 0.8 }}>{d.weekday}</div>
              <div style={{ fontSize: 72, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{d.date}</div>
              {isDue ? (
                <div style={{ fontFamily: fonts.ui, fontSize: 27, fontWeight: 600, marginTop: 10 }}>{bill.amount}</div>
              ) : null}
            </div>
          );
        })}

        {/* pick ring */}
        {frame >= AGENDA_T.pick - 4 && ringOut > 0 ? (
          <div
            style={{
              position: "absolute",
              left: ringX - 10,
              top: TILES_Y - 10,
              width: TILE_W + 20,
              height: TILE_H + 20,
              borderRadius: 32,
              border: `7px solid ${p.yellow}`,
              boxSizing: "border-box",
              opacity: ringIn * ringOut,
              transform: `scale(${0.8 + 0.2 * ringIn})`,
            }}
          />
        ) : null}

        {/* bell + label on the chosen day */}
        {frame >= AGENDA_T.bell ? (
          <>
            <div
              style={{
                position: "absolute",
                left: tileX(props.reminderIndex) + TILE_W / 2 - 38,
                top: TILES_Y - 62,
                width: 76,
                height: 76,
                borderRadius: 38,
                background: p.yellow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${bell}) rotate(${ring}deg)`,
                transformOrigin: "50% 10%",
              }}
            >
              <Bell size={40} color={p.ink} />
            </div>
            <div
              style={{
                position: "absolute",
                left: Math.max(CARD.x - 10, tileX(props.reminderIndex) + TILE_W / 2 - 130),
                top: CARD.y + CARD.h + 26,
                height: 84,
                padding: "0 36px",
                borderRadius: 42,
                background: p.blueSoft,
                color: p.blue,
                display: "flex",
                alignItems: "center",
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 42,
                transform: `scale(${bell})`,
                transformOrigin: "30% 0%",
              }}
            >
              {props.reminderLabel}
            </div>
          </>
        ) : null}

        {/* the bill flying onto the due date */}
        {frame >= AGENDA_T.fly && !landed ? (
          <div
            style={{
              position: "absolute",
              left: interpolate(flyT, [0, 1], [700, dueX - 10]),
              top: interpolate(flyT, [0, 1], [-120, TILES_Y + 40]),
              width: TILE_W + 20,
              height: 120,
              borderRadius: 18,
              background: p.white,
              boxShadow: "0 18px 40px rgba(1,40,160,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontSize: 30,
              fontWeight: 500,
              color: p.ink,
              transform: `rotate(${(1 - flyT) * 18}deg) scale(${1.3 - 0.3 * flyT})`,
            }}
          >
            {bill.amount}
          </div>
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={happy}
          squash={sq}
          look={{ x: lookX, y: 0.6 }}
          style={{
            position: "absolute",
            left: CARD.x + CARD.w - BUDDY - 50,
            top: CARD.y + 8 - BUDDY * BUDDY_RATIO + hop,
            opacity: cardIn,
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
