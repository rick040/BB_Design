import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { dec } from "../../theme";
import { AdventCalendar, doorPos, DW, Flag, type DoorState } from "../components/AdventCalendar";
import type { AdventProps } from "../schema";

// Timeline (frames, scene-local). Deurtje 3 staat al open (komt uit de hook).
export const DOORS_T = {
  flags3: 12, // Buddy hangt het 7- en 2-vlaggetje bij deurtje 3
  open9: 40, // deurtje 9 gaat open
  flags9: 54,
  open14: 80, // deurtje 14
  flags14: 94,
  sub: 98, // subregel verschijnt
  flagGap: 6,
  throwLen: 14, // duur van de worp
};

const BUDDY = 140;
const FEET_Y = 915;
const BUDDY_X = 540;

const openAt = (frame: number, start: number) =>
  interpolate(frame, [start, start + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });

type FlagSpec = { target: number; kind: "far" | "near"; at: number };

/** Doel van een vlaggetje: bovenhoek van een deurtje; n < 1 valt links buiten het rooster. */
const flagSpot = (target: number, kind: "far" | "near") => {
  const n = Math.max(1, target);
  const { x, y } = doorPos(n);
  if (target < 1) return { x: x - 30, y: y + 52 };
  return kind === "far" ? { x: x + 34, y: y + 46 } : { x: x + DW - 42, y: y + 46 };
};

export const DoorsScene: React.FC<{ props: AdventProps["doors"]; bills: AdventProps["bills"] }> = ({ props, bills }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const [b3, b9, b14] = bills;

  const focusOf = (start: number, next: number) =>
    interpolate(frame, [start + 4, start + 14, next, next + 10], [0, 1, 1, 0], clamp);

  const states: Record<number, DoorState> = {
    1: { open: 1, focus: 0, content: { kind: "choc" } },
    2: { open: 1, focus: 0, content: { kind: "choc" } },
    [b3.n]: {
      open: 1,
      focus: interpolate(frame, [0, DOORS_T.open9 - 4, DOORS_T.open9 + 6], [1, 1, 0], clamp),
      content: { kind: "bill", label: b3.label, amount: b3.amount },
    },
    [b9.n]: {
      open: openAt(frame, DOORS_T.open9),
      focus: focusOf(DOORS_T.open9, DOORS_T.open14),
      content: { kind: "bill", label: b9.label, amount: b9.amount },
    },
    [b14.n]: {
      open: openAt(frame, DOORS_T.open14),
      focus: interpolate(frame, [DOORS_T.open14 + 4, DOORS_T.open14 + 14, DOORS_T.flags14 + 30], [0, 1, 1], clamp),
      content: { kind: "bill", label: b14.label, amount: b14.amount },
    },
  };

  const g = DOORS_T.flagGap;
  const flags: FlagSpec[] = [
    { target: b3.n - 7, kind: "far", at: DOORS_T.flags3 },
    { target: b3.n - 2, kind: "near", at: DOORS_T.flags3 + g },
    { target: b9.n - 7, kind: "far", at: DOORS_T.flags9 },
    { target: b9.n - 2, kind: "near", at: DOORS_T.flags9 + g },
    { target: b14.n - 7, kind: "far", at: DOORS_T.flags14 },
    { target: b14.n - 2, kind: "near", at: DOORS_T.flags14 + g },
  ];

  // Buddy kijkt naar het deurtje waar hij een vlaggetje naartoe gooit.
  const active = [...flags].reverse().find((f) => frame >= f.at - 6);
  const lookTarget = active ? flagSpot(active.target, active.kind) : { x: 540, y: 400 };
  const lookX = Math.max(-1, Math.min(1, (lookTarget.x - 540) / 540));
  let squash = 1;
  for (const f of flags) {
    squash *= interpolate(frame, [f.at - 5, f.at - 1, f.at + 3, f.at + 9], [1, 0.84, 1.1, 1], clamp);
  }
  const blink = blinkScale(frame, [30, 70, 108]);
  const buddyIn = pop(frame, fps, -6, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={dec.white} delay={-4} stagger={3} />
      <Stage offsetY={36}>
        <AdventCalendar
          states={states}
          leaf={dec.deep}
          cavity={dec.white}
          numberColor={dec.white}
          textColor={dec.ink}
          accent={p.blue}
        />

        {flags.map((f, i) => {
          const spot = flagSpot(f.target, f.kind);
          const t = interpolate(frame, [f.at, f.at + DOORS_T.throwLen], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          if (frame < f.at) return null;
          const x = interpolate(t, [0, 1], [BUDDY_X, spot.x]);
          const arc = Math.sin(Math.PI * t) * 150;
          const y = interpolate(t, [0, 1], [FEET_Y - 60, spot.y]) - arc;
          const land = pop(frame, fps, f.at + DOORS_T.throwLen - 2, { damping: 8, stiffness: 220 });
          return (
            <Flag
              key={i}
              x={x}
              y={y}
              label={f.kind === "far" ? props.flagFar : props.flagNear}
              pennant={dec.white}
              ink={dec.blue}
              scale={0.55 + 0.45 * t}
              rotate={(1 - t) * -50}
              wave={Math.sin((frame - f.at) / 3) * 4 * land}
            />
          );
        })}

        <Buddy
          size={BUDDY}
          body={dec.white}
          eye={p.blueMascot}
          squash={squash}
          blink={blink}
          look={{ x: lookX, y: -0.6 }}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: FEET_Y - BUDDY * BUDDY_RATIO,
            transform: `scale(${0.5 + 0.5 * buddyIn})`,
            transformOrigin: "50% 100%",
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
      </Stage>
      <DSubline text={props.subline} color={p.blueSoft} delay={DOORS_T.sub} />
    </SceneBg>
  );
};
