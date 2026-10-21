import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { CalendarCard, calCell, PARCEL_COLORS } from "../CalendarCard";
import { Parcel } from "../Parcel";
import type { PakketjesProps } from "../schema";

// Beats (frames, scene-lokaal).
export const SPREAD_T = {
  card: 4, // kalender ploft in beeld
  first: 20, // eerste pakketje rolt naar zijn dag
  stagger: 6, // tussen twee pakketjes
  flyLen: 16, // duur van één rol
  subline: 92,
};

const START = { x: 540, y: 880 };
const FLY_W = 164;
const FLY_H = 120;

export const spreadLanding = (i: number) => SPREAD_T.first + i * SPREAD_T.stagger + SPREAD_T.flyLen;

export const SpreadScene: React.FC<{ props: PakketjesProps["spread"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const card = pop(frame, fps, SPREAD_T.card, springs.smooth);

  const landed = (day: number) => {
    const i = props.payDays.indexOf(day);
    return pop(frame, fps, spreadLanding(i), springs.bouncy);
  };

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage offsetY={48}>
        <CalendarCard
          monthLabel={props.monthLabel}
          weekdays={props.weekdays}
          startCol={props.startCol}
          days={props.days}
          payDays={props.payDays}
          parcelOn={(d) => (frame >= spreadLanding(props.payDays.indexOf(d)) ? landed(d) : 0)}
          flagOn={() => 0}
          flag7={p.blue}
          flag2={p.ink}
          accent={p.blue}
          numberColor={p.blue}
          cellColor={p.light}
          style={{ opacity: card, transform: `translateY(${(1 - card) * 60}px) scale(${0.96 + 0.04 * card})` }}
        />

        {/* Pakketjes rollen vanaf de stapel naar hun dag */}
        {props.payDays.map((day, i) => {
          const t0 = SPREAD_T.first + i * SPREAD_T.stagger;
          const t = interpolate(frame, [t0, t0 + SPREAD_T.flyLen], [0, 1], {
            ...clamp,
            easing: Easing.inOut(Easing.cubic),
          });
          if (frame < t0 - 6 || t >= 1) return null;
          const c = calCell(day, props.startCol);
          const x = interpolate(t, [0, 1], [START.x, c.cx]);
          const y = interpolate(t, [0, 1], [START.y, c.cy + 6]) - Math.sin(t * Math.PI) * 170;
          const scale = interpolate(t, [0, 1], [1, 0.5]);
          const col = PARCEL_COLORS[i % PARCEL_COLORS.length];
          const appear = interpolate(frame, [t0 - 6, t0], [0, 1], clamp);
          return (
            <div
              key={day}
              style={{
                position: "absolute",
                left: x - FLY_W / 2,
                top: y - FLY_H / 2,
                transform: `rotate(${t * 360 * (i % 2 === 0 ? 1 : -1)}deg) scale(${scale * appear})`,
                zIndex: 5,
              }}
            >
              <Parcel w={FLY_W} h={FLY_H} color={col.body} tape={col.tape} />
            </div>
          );
        })}

      </Stage>

      <DSubline text={props.subline} color={p.blueSoft} delay={SPREAD_T.subline} />
    </SceneBg>
  );
};
