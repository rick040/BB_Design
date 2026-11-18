import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Chip, Hanky } from "../components/Hanky";
import { stripLayout, WeekStrip } from "../components/WeekStrip";
import { INK, SCENE_STARTS, wordAt, type ZakdoekProps } from "../schema";

// Scene 1 (hook, full screen) that becomes the top screen "Zonder Buddy".
export const WITHOUT_T = {
  tags: wordAt("welke"),
  subline: wordAt("welke") - 2,
  split: SCENE_STARTS[1] - 8,
  splitEnd: SCENE_STARTS[1] + 6,
  strip: SCENE_STARTS[2] - 4,
  sweepFrom: SCENE_STARTS[2] + 6,
  sweepTo: wordAt("herinnert") + 10,
};

const TILE_W = 110;
const TILE_GAP = 12;
const STRIP_Y = 720;
// Corner offsets of the knot tags, in hanky units (fraction of size).
const TAG_POS = [
  { x: -0.08, y: -0.06 },
  { x: 1.02, y: 0.02 },
  { x: 0.96, y: 1.0 },
];

export const WithoutPanel: React.FC<{ hook: ZakdoekProps["hook"]; split: ZakdoekProps["split"] }> = ({ hook, split }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const s = interpolate(frame, [WITHOUT_T.split, WITHOUT_T.splitEnd], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const size = interpolate(s, [0, 1], [600, 300]);
  const cy = interpolate(s, [0, 1], [960, 520]);
  const wave = Math.sin(frame / 9) * 0.6;
  const tilt = Math.sin(frame / 14) * 3 - 6;

  // Week sweep: a "today" marker runs past the due date, nothing happens.
  const L = stripLayout(TILE_W, TILE_GAP, STRIP_Y);
  const stripIn = pop(frame, fps, WITHOUT_T.strip, springs.smooth);
  const sweep = interpolate(frame, [WITHOUT_T.sweepFrom, WITHOUT_T.sweepTo], [0, 4.4], clamp);
  const markerX = L.center(0) + sweep * (TILE_W + TILE_GAP);
  const passedDue = sweep >= split.dueIndex;
  const passedAt = WITHOUT_T.sweepFrom + ((WITHOUT_T.sweepTo - WITHOUT_T.sweepFrom) * split.dueIndex) / 4.4;
  const forgot = pop(frame, fps, passedAt + 4, springs.pop);

  return (
    <>
      <div style={{ opacity: 1 - s }}>
        <Headline text={hook.headline} color={p.blue} delay={-24} stagger={2} />
        <Subline text={hook.subline} color={INK} delay={WITHOUT_T.subline} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 262,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: s,
          transform: `translateY(${(1 - s) * -30}px)`,
        }}
      >
        <Chip text={split.without} bg={INK} fg={p.white} size={30} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - size / 2,
          top: cy - size / 2,
          width: size,
          height: size,
          transform: `rotate(${tilt}deg)`,
        }}
      >
        <Hanky size={size} cloth={p.white} check={p.blue} knots={[1, 1, 1, 0]} wave={wave} />
        {hook.knotTags.map((t, i) => {
          const tagIn = pop(frame, fps, WITHOUT_T.tags + i * 5, springs.pop);
          const pos = TAG_POS[i];
          const tagSize = interpolate(s, [0, 1], [44, 30]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: pos.x * size,
                top: pos.y * size,
                transform: `translate(-50%, -50%) rotate(${-tilt + (i - 1) * 8}deg) scale(${tagIn})`,
              }}
            >
              <Chip text={t} bg={INK} fg={p.white} size={tagSize} />
            </div>
          );
        })}
      </div>

      {frame >= WITHOUT_T.strip ? (
        <>
          <WeekStrip
            days={split.days}
            tileW={TILE_W}
            tileH={120}
            gap={TILE_GAP}
            y={STRIP_Y}
            bg={p.grey}
            fg={INK}
            dayFg="#6b7280"
            opacity={stripIn}
            highlight={passedDue ? { index: split.dueIndex, bg: INK, fg: p.white, amount: 1 } : null}
          />
          <div
            style={{
              position: "absolute",
              left: markerX - 14,
              top: STRIP_Y + 134,
              width: 28,
              height: 10,
              borderRadius: 5,
              background: INK,
              opacity: stripIn * (frame < passedAt + 4 ? 1 : 0),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: L.center(split.dueIndex),
              top: STRIP_Y + 128,
              transform: `translateX(-50%) scale(${forgot})`,
              transformOrigin: "50% 0%",
            }}
          >
            <Chip text={split.forgotChip} bg={INK} fg={p.white} size={28} />
          </div>
        </>
      ) : null}
    </>
  );
};
