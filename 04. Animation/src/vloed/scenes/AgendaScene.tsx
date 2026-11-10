import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Sea, useStageToFrame } from "../components/Sea";
import { SwimRing } from "../components/SwimRing";
import type { VloedProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  week: 8, // week strip pops in
  billDrop: 26, // the bill falls toward its due date
  billLand: 36, // ... and lands on do 17
  paddle: 50, // Buddy paddles to the reminder day
  paddleLen: 26,
  ring: 84, // bell flag pops up on ma 14 and rings
  subline: 92,
};

const TILE_W = 132;
const GAP = 10;
const ROW_X = (1080 - (7 * TILE_W + 6 * GAP)) / 2;
const ROW_Y = 150;
const TILE_H = 250;
const BUDDY = 160;
const WATER = 700;

const tileX = (i: number) => ROW_X + i * (TILE_W + GAP);

const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z" fill={color} />
    <circle cx="12" cy="19.5" r="2" fill={color} />
  </svg>
);

export const AgendaScene: React.FC<{
  props: VloedProps["agenda"];
  bill: VloedProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const S = useStageToFrame(0);

  const week = pop(frame, fps, AGENDA_T.week, springs.smooth);
  const land = interpolate(frame, [AGENDA_T.billDrop, AGENDA_T.billLand], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const settle = pop(frame, fps, AGENDA_T.billLand, springs.bouncy);
  const landed = frame >= AGENDA_T.billLand;

  // Buddy paddles from the middle to under the reminder day.
  const startX = 760;
  const endX = tileX(props.reminderDay) + TILE_W / 2 + 70;
  const pad = interpolate(frame, [AGENDA_T.paddle, AGENDA_T.paddle + AGENDA_T.paddleLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const bx = startX + (endX - startX) * pad;
  const bob = Math.sin(frame / 9) * 7;
  const feet = WATER + 40 + bob;
  const tilt = Math.sin(pad * Math.PI) * -8;
  const hop = interpolate(frame, [AGENDA_T.ring - 6, AGENDA_T.ring, AGENDA_T.ring + 8], [0, -36, 0], clamp);
  const squash = interpolate(frame, [AGENDA_T.ring - 8, AGENDA_T.ring - 6, AGENDA_T.ring, AGENDA_T.ring + 8, AGENDA_T.ring + 12], [1, 0.86, 1.12, 0.92, 1], clamp);
  const lookX = frame < AGENDA_T.paddle ? 0.3 : -0.5;
  const blink = frame > AGENDA_T.ring + 14 ? 0.18 : blinkScale(frame, [AGENDA_T.billLand + 6]);

  const bell = pop(frame, fps, AGENDA_T.ring, springs.bouncy);
  const swing = frame >= AGENDA_T.ring ? Math.sin((frame - AGENDA_T.ring) / 2.2) * 18 * Math.exp(-(frame - AGENDA_T.ring) / 20) : 0;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />

      <Sea level={S.y(WATER) - 24 * S.scale} color={p.blueSoft} foam={p.white} amplitude={14} phase={0.5} speed={0.08} />

      <Stage>
        <div
          style={{
            position: "absolute",
            left: ROW_X,
            top: ROW_Y - 74,
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 44,
            letterSpacing: "-0.03em",
            color: p.blue,
            opacity: week,
          }}
        >
          {props.month}
        </div>
        {props.days.map((d, i) => {
          const s = pop(frame, fps, AGENDA_T.week + i * 2, springs.pop);
          const isBill = i === props.billDay && landed;
          const isRem = i === props.reminderDay && frame >= AGENDA_T.ring;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: tileX(i),
                top: ROW_Y,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 30,
                background: isBill ? p.blue : p.white,
                border: isRem ? `5px solid ${p.blue}` : `3px solid ${p.grey}`,
                boxSizing: "border-box",
                boxShadow: "0 14px 34px rgba(1, 40, 160, 0.10)",
                fontFamily: fonts.ui,
                textAlign: "center",
                paddingTop: 18,
                opacity: Math.min(1, s * 1.5),
                transform: `translateY(${(1 - s) * 30}px) scale(${isBill ? 1 + 0.06 * (1 - settle) : 1})`,
              }}
            >
              <div style={{ fontSize: 30, color: isBill ? p.blueSoft : p.greyText, fontWeight: 500 }}>{d.name}</div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 64,
                  fontWeight: 500,
                  letterSpacing: "-0.05em",
                  color: isBill ? p.white : p.ink,
                  lineHeight: 1.1,
                }}
              >
                {d.date}
              </div>
              {isBill ? (
                <div style={{ marginTop: 18, color: p.white, fontSize: 25, fontWeight: 600, lineHeight: 1.2 }}>
                  {bill.short}
                  <br />
                  {bill.amount}
                </div>
              ) : null}
            </div>
          );
        })}

        {/* The bill drops onto its due date. */}
        {!landed && frame >= AGENDA_T.billDrop - 6 ? (
          <div
            style={{
              position: "absolute",
              left: tileX(props.billDay) + TILE_W / 2,
              top: ROW_Y + TILE_H / 2 - 260 * (1 - land),
              transform: `translate(-50%, -50%) rotate(${(1 - land) * 10}deg) scale(${1.25 - 0.25 * land})`,
              width: TILE_W,
              height: 120,
              borderRadius: 24,
              background: p.blue,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 40px rgba(1, 40, 160, 0.3)",
              opacity: interpolate(frame, [AGENDA_T.billDrop - 6, AGENDA_T.billDrop], [0, 1], clamp),
            }}
          >
            <div>{bill.short}</div>
            <div>{bill.amount}</div>
          </div>
        ) : null}

        {/* Bell flag on the reminder day. */}
        <div
          style={{
            position: "absolute",
            left: tileX(props.reminderDay) + TILE_W / 2,
            top: ROW_Y + TILE_H - 64,
            transform: `translate(-50%, 0) scale(${bell}) rotate(${swing}deg)`,
            transformOrigin: "50% 0%",
            opacity: Math.min(1, bell * 2),
          }}
        >
          <Bell size={56} color={p.blue} />
        </div>
        <div
          style={{
            position: "absolute",
            left: tileX(props.reminderDay) - 4,
            top: ROW_Y + TILE_H + 16,
            height: 54,
            padding: "0 22px",
            borderRadius: 27,
            background: p.blue,
            color: p.white,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 28,
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            opacity: Math.min(1, bell * 2),
            transform: `scale(${0.6 + 0.4 * bell})`,
            transformOrigin: "0% 0%",
          }}
        >
          {props.reminderLabel}
        </div>

        <SwimRing
          part="back"
          width={BUDDY * 1.7}
          red={p.red}
          white={p.white}
          style={{ left: bx - BUDDY * 0.85, top: feet - BUDDY * 0.78 + hop * 0.6, transform: `rotate(${tilt}deg)` }}
        />
        <div
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: feet - BUDDY * BUDDY_RATIO + hop,
            transform: `rotate(${tilt}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <Buddy size={BUDDY} body={p.blue} eye={p.white} blink={blink} squash={squash} look={{ x: lookX, y: -0.8 }} />
        </div>
        <SwimRing
          width={BUDDY * 1.7}
          red={p.red}
          white={p.white}
          style={{ left: bx - BUDDY * 0.85, top: feet - BUDDY * 0.78 + hop * 0.6, transform: `rotate(${tilt}deg)` }}
        />
      </Stage>

      <Sea level={S.y(WATER) + 30 * S.scale} color={p.blueSoft} amplitude={12} phase={2.5} speed={0.1} opacity={0.95} />

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
