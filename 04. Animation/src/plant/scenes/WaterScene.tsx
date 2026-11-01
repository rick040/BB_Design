import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification, NOTIFICATION_W } from "../../components/Notification";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, pushedSlots, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { HousePlant, POT_BOTTOM } from "../components/HousePlant";
import { WateringCan } from "../components/WateringCan";
import type { PlantProps } from "../schema";

// Timeline (frames, scene-local).
export const WATER_T = {
  pour7: 18, // first watering ...
  note7: 28, // ... "Nog 7 dagen"
  pour2: 58, // second watering ...
  note2: 68, // ... "Nog 2 dagen" lands on top
  pourLen: 26,
  bloom: 94, // the plant flowers
  hop: 96, // Buddy hops, eyes happy
  agenda: 104, // "18 dec staat in je agenda"
};

const SLOT = 176;
const PLANT = { x: 130, top: 880 - POT_BOTTOM };
const BUDDY = 220;
const BUDDY_X = 650;
const FEET = 880;
const CAN = { x: 432, y: 586 };

const pourCurve = (frame: number, start: number, len: number) =>
  interpolate(frame, [start, start + 7, start + len - 7, start + len], [0, 1, 1, 0], clamp);

export const WaterScene: React.FC<{
  props: PlantProps["water"];
  bill: PlantProps["bill"];
  potLabel: string;
}> = ({ props, bill, potLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const pour = Math.max(pourCurve(frame, WATER_T.pour7, WATER_T.pourLen), pourCurve(frame, WATER_T.pour2, WATER_T.pourLen));
  const tilt = -34 * pour;

  // Thirsty at the start, perks up after the first watering, grows after the second.
  const perk = pop(frame, fps, WATER_T.pour7 + 12, springs.smooth);
  const grow2 = pop(frame, fps, WATER_T.pour2 + 12, springs.bouncy);
  const wilt = 0.28 * (1 - perk);
  const grow = 1 + 0.05 * perk + 0.07 * grow2;
  const bloom = pop(frame, fps, WATER_T.bloom, springs.bouncy);

  const arrivals = [WATER_T.note7, WATER_T.note2];
  const notes = [
    { text: props.note7, time: props.time7, icon: "warning" as const },
    { text: props.note2, time: props.time2, icon: "alert" as const },
  ];

  const hop = pop(frame, fps, WATER_T.hop, springs.bouncy);
  const hopY = frame >= WATER_T.hop ? Math.sin(Math.min(1, (frame - WATER_T.hop) / 12) * Math.PI) * 70 : 0;
  const squash =
    frame >= WATER_T.hop
      ? interpolate(frame, [WATER_T.hop, WATER_T.hop + 3, WATER_T.hop + 12, WATER_T.hop + 16, WATER_T.hop + 22], [1, 0.86, 1.08, 0.9, 1], clamp)
      : 1 + pour * 0.03;
  const happy = frame >= WATER_T.hop + 4 && frame < WATER_T.hop + 30;
  const blink = happy ? 0.18 : blinkScale(frame, [8, 50]);
  const agenda = pop(frame, fps, WATER_T.agenda, springs.pop);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage offsetY={30}>
        {notes.map((n, i) => {
          if (frame < arrivals[i]) return null;
          const s = pop(frame, fps, arrivals[i], springs.pop);
          const slots = pushedSlots(frame, fps, arrivals, i);
          return (
            <Notification
              key={i}
              text={n.text}
              time={n.time}
              icon={n.icon}
              style={{
                position: "absolute",
                left: (1080 - NOTIFICATION_W) / 2,
                top: slots * SLOT + (1 - s) * -40,
                opacity: Math.min(1, s * 2),
                transform: `scale(${0.85 + 0.15 * s})`,
                zIndex: 10 + i,
              }}
            />
          );
        })}

        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 900, transform: "scale(1.18)", transformOrigin: "540px 880px" }}>
        <HousePlant
          wilt={wilt}
          grow={grow}
          bloom={frame >= WATER_T.bloom ? bloom : 0}
          sway={Math.sin(frame / 12) * 1.2}
          leafColor={p.blueMid}
          leafDry={p.greyText}
          stemColor={p.blueMid}
          potColor={p.blue}
          potShade={p.blueMascot}
          label={potLabel}
          labelColor={p.blue}
          labelBg={p.white}
          stake={{ text: bill.dueDate, insert: 1, color: p.yellow, textColor: p.ink }}
          style={{ left: PLANT.x, top: PLANT.top }}
        />

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={frame < WATER_T.hop ? { x: -0.8, y: 0.5 } : { x: 0, y: 0 }}
          style={{
            position: "absolute",
            left: BUDDY_X,
            top: FEET - BUDDY * BUDDY_RATIO - hopY,
            transformOrigin: "50% 100%",
          }}
        />
        <WateringCan
          body={p.blueSoft}
          shade={p.blueMid}
          water={p.blueMid}
          tilt={tilt}
          pour={pour}
          frame={frame}
          style={{ left: CAN.x, top: CAN.y - hopY * (hop > 0 ? 1 : 0) }}
        />

        </div>

        {/* Agenda chip */}
        <div
          style={{
            position: "absolute",
            left: 450,
            top: 380,
            opacity: frame >= WATER_T.agenda ? Math.min(1, agenda * 2) : 0,
            transform: `scale(${0.6 + 0.4 * agenda})`,
            transformOrigin: "50% 50%",
            padding: "16px 28px",
            borderRadius: 999,
            background: p.blue,
            color: p.white,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 36,
            whiteSpace: "nowrap",
            boxShadow: "0 14px 34px rgba(1, 59, 255, 0.3)",
          }}
        >
          {props.agendaChip}
        </div>
      </Stage>
    </SceneBg>
  );
};
