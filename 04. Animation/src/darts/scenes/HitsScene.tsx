import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Dart, dartFlight } from "../components/Dart";
import { Dartboard, zonePoint } from "../components/Dartboard";
import type { DartsProps } from "../schema";

// Timeline (frames, scene-local).
export const HITS_T = {
  throw1: 16, // dart 1 leaves Buddy
  hit1: 26, // outer ring: 7 days before
  throw2: 40,
  hit2: 50, // middle ring: 2 days before
  throw3: 64,
  hit3: 76, // bullseye: the due date, in your calendar
  cheer: 94, // Buddy hops, eyes closed
};

const R = 300;
const BOARD = { x: 610, y: 310 };
const at = (zone: 0 | 1 | 2, deg: number) => {
  const z = zonePoint(R, zone, deg);
  return { x: BOARD.x + z.x, y: BOARD.y + z.y };
};
const TARGETS = [at(0, 295), at(1, 35), at(2, 0)];
const THROWS = [
  [HITS_T.throw1, HITS_T.hit1],
  [HITS_T.throw2, HITS_T.hit2],
  [HITS_T.throw3, HITS_T.hit3],
] as const;
const BUDDY = 200;
const BUDDY_X = 135;
const FEET = 610;
const HAND = { x: BUDDY_X + 70, y: FEET - 150 };
const CHIP_TOP = 660;
const CHIP_STEP = 92;

const MailIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={40} viewBox="0 0 32 32">
    <rect x="3" y="7" width="26" height="19" rx="4" fill="none" stroke={color} strokeWidth="2.8" />
    <path d="M4 9l12 9 12-9" fill="none" stroke={color} strokeWidth="2.8" strokeLinejoin="round" />
  </svg>
);
const CalIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={40} viewBox="0 0 32 32">
    <rect x="3" y="6" width="26" height="23" rx="4" fill="none" stroke={color} strokeWidth="2.8" />
    <path d="M3 13h26M10 3v6M22 3v6" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    <circle cx="16" cy="21" r="3" fill={color} />
  </svg>
);

export const HitsScene: React.FC<{ props: DartsProps["hits"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const boardIn = pop(frame, fps, -4, springs.smooth);
  const buddyIn = pop(frame, fps, 0, springs.bouncy);
  const bullShake = shake(frame, HITS_T.hit3, 12, 7);

  // Buddy: squat before every throw, stretch on release, hop at the end.
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  for (const [t] of THROWS) {
    if (frame >= t - 6 && frame < t + 8) {
      squash = interpolate(frame, [t - 6, t, t + 4, t + 8], [1, 0.85, 1.1, 1], clamp);
    }
  }
  let hop = 0;
  if (frame >= HITS_T.cheer) {
    const c = frame - HITS_T.cheer;
    hop = -Math.abs(Math.sin(c / 5)) * 60 * Math.exp(-c / 24);
    squash = 1 + Math.sin(c / 5 + Math.PI / 2) * 0.05;
  }
  const happy = frame >= HITS_T.cheer ? 0.18 : blinkScale(frame, [HITS_T.hit2 + 6]);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={4} stagger={3} />

      <Stage offsetY={10}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${bullShake.x}px, ${bullShake.y}px)` }}>
          <Dartboard
            R={R}
            glow={[0, 1, 2].map((i) => {
              const hit = THROWS[i][1];
              if (frame < hit) return 0;
              return interpolate(frame - hit, [0, 3, 16], [0, 0.9, 0], clamp);
            }) as [number, number, number]}
            style={{
              left: BOARD.x - R,
              top: BOARD.y - R,
              opacity: boardIn,
              transform: `scale(${0.9 + 0.1 * boardIn})`,
            }}
          />
          {TARGETS.map((to, i) => {
            const [t0, t1] = THROWS[i];
            const d = dartFlight(frame, t0, t1, HAND, to, 160, 140);
            return (
              <Dart
                key={i}
                x={d.x}
                y={d.y}
                angle={d.angle}
                scale={d.landed ? 1 : interpolate(d.scale, [1, 1.7], [1, 0.75])}
                opacity={d.opacity}
                thud={d.thud}
                zIndex={2 + i}
              />
            );
          })}
        </div>

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={happy}
          squash={squash}
          look={{ x: 1, y: -0.5 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + hop,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.5 + 0.5 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* what each hit means */}
        {props.chips.map((c, i) => {
          const hit = THROWS[i][1];
          const s = frame >= hit + 2 ? pop(frame, fps, hit + 2, springs.pop) : 0;
          const last = i === 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 140,
                width: 800,
                top: CHIP_TOP + i * CHIP_STEP,
                height: 78,
                borderRadius: 39,
                background: last ? p.blue : p.white,
                boxShadow: "0 14px 34px rgba(1, 40, 160, 0.12)",
                display: "flex",
                alignItems: "center",
                gap: 18,
                padding: "0 30px",
                boxSizing: "border-box",
                fontFamily: fonts.ui,
                fontSize: 36,
                color: last ? p.white : p.ink,
                opacity: Math.min(1, s * 2),
                transform: `translateX(${(1 - s) * 60}px) scale(${0.9 + 0.1 * s})`,
              }}
            >
              {last ? <CalIcon color={p.white} /> : <MailIcon color={p.blue} />}
              <span style={{ fontWeight: 700, color: last ? p.white : p.blue, minWidth: 130 }}>{c.date}</span>
              <span style={{ fontWeight: 500 }}>{c.text}</span>
            </div>
          );
        })}
      </Stage>
    </SceneBg>
  );
};
