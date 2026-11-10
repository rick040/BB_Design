import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Wave } from "../components/Noise";
import type { RuisProps } from "../schema";

// Timeline (frames, scene-local). The scene starts 6 frames before the
// spoken "want" ([S3]); "agenda" is spoken at local 32-50.
export const AGENDA_T = {
  flatten: 0, // the clean signal flattens into a line
  flattenLen: 12,
  tiles: 8, // day tiles rise out of the line
  tileStagger: 2,
  land: 26, // the bill lands on its due day
  reminder: 36, // bell on the reminder day
  subline: 14,
};

const TILE_W = 128;
const TILE_H = 210;
const GAP = 16;
const ROW_X = (1080 - (7 * TILE_W + 6 * GAP)) / 2;
const LINE_Y = 290;

const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path d="M16 4c-5 0-8 3.6-8 8.5v5L5.5 22h21L24 17.5v-5C24 7.6 21 4 16 4z" fill={color} />
    <circle cx="16" cy="25.5" r="3" fill={color} />
  </svg>
);

export const AgendaScene: React.FC<{
  props: RuisProps["agenda"];
  bill: RuisProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const flat = interpolate(frame, [AGENDA_T.flatten, AGENDA_T.flatten + AGENDA_T.flattenLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const land = pop(frame, fps, AGENDA_T.land, springs.bouncy);
  const bell = pop(frame, fps, AGENDA_T.reminder, springs.bouncy);
  const ring = frame > AGENDA_T.reminder ? Math.sin((frame - AGENDA_T.reminder) / 1.6) * 14 * Math.max(0, 1 - (frame - AGENDA_T.reminder) / 20) : 0;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-6} stagger={2} />

      <Stage offsetY={60}>
        <Wave
          width={1000}
          height={160}
          amplitude={70 * (1 - flat)}
          phase={frame / 4}
          periods={3}
          color={p.blue}
          stroke={10}
          style={{ left: 40, top: LINE_Y - 80, opacity: 1 - interpolate(frame, [AGENDA_T.tiles + 6, AGENDA_T.tiles + 14], [0, 1], clamp) }}
        />

        {props.days.map((d, i) => {
          const t = pop(frame, fps, AGENDA_T.tiles + i * AGENDA_T.tileStagger, springs.pop);
          const isBill = i === props.billDay;
          const isRem = i === props.reminderDay;
          const fill = isBill ? land : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: ROW_X + i * (TILE_W + GAP),
                top: LINE_Y - 30,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 30,
                background: fill > 0.5 ? p.blue : p.white,
                boxShadow: "0 14px 34px rgba(1,59,255,0.14)",
                border: isRem && bell > 0.5 ? `5px solid ${p.yellow}` : `5px solid transparent`,
                boxSizing: "border-box",
                textAlign: "center",
                fontFamily: fonts.display,
                color: fill > 0.5 ? p.white : p.ink,
                transform: `translateY(${(1 - t) * 60}px) scaleY(${t}) scale(${isBill ? 1 + 0.08 * Math.sin(Math.min(1, land) * Math.PI) : 1})`,
                transformOrigin: "50% 0%",
                opacity: Math.min(1, t * 2),
              }}
            >
              <div style={{ fontSize: 36, marginTop: 32, opacity: 0.7 }}>{d.day}</div>
              <div style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.1 }}>{d.date}</div>
            </div>
          );
        })}

        {/* Reminder bell above its day */}
        {frame >= AGENDA_T.reminder ? (
          <div
            style={{
              position: "absolute",
              left: ROW_X + props.reminderDay * (TILE_W + GAP) - 20,
              top: LINE_Y - 30 - 92,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px 10px 14px",
              borderRadius: 34,
              background: p.yellow,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 30,
              color: p.ink,
              transform: `scale(${bell}) rotate(${ring * 0.3}deg)`,
              transformOrigin: "30% 100%",
            }}
          >
            <div style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%", display: "flex" }}>
              <Bell size={38} color={p.ink} />
            </div>
            {props.reminderLabel}
          </div>
        ) : null}

        {/* The bill lands on its due day */}
        {frame >= AGENDA_T.land - 8 ? (
          <div
            style={{
              position: "absolute",
              left: 140,
              right: 140,
              top: LINE_Y + TILE_H + 40,
              height: 190,
              borderRadius: 40,
              background: p.blue,
              color: p.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 44px",
              boxSizing: "border-box",
              fontFamily: fonts.ui,
              transform: `translateY(${interpolate(land, [0, 1], [-120, 0])}px) scale(${0.85 + 0.15 * land})`,
              opacity: Math.min(1, land * 2),
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 42 }}>{bill.sender}</div>
              <div style={{ fontSize: 36, color: p.blueSoft }}>{bill.due}</div>
            </div>
            <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 80, letterSpacing: "-0.04em" }}>
              {bill.amount}
            </div>
          </div>
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
