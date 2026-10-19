import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop, shake, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline } from "../../text";
import { dec } from "../../theme";
import { AdventCalendar, type DoorState } from "../components/AdventCalendar";
import type { AdventProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  open1: 16, // deurtje 1 gaat open: chocola
  open2: 30, // deurtje 2: chocola
  open3: 50, // deurtje 3: een rekening (huur)
  focus3Len: 12, // duur: het geopende deurtje wordt groter
  nudge: 80, // het deurtje trilt even, klaar voor de volgende scène
};

const openAt = (frame: number, start: number) =>
  interpolate(frame, [start, start + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });

export const HookScene: React.FC<{ props: AdventProps["hook"]; bills: AdventProps["bills"] }> = ({ props, bills }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const first = bills[0];

  const focus3 = interpolate(frame, [HOOK_T.open3 + 4, HOOK_T.open3 + 4 + HOOK_T.focus3Len], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const s = shake(frame, HOOK_T.nudge, 14, 5);

  const states: Record<number, DoorState> = {
    1: { open: openAt(frame, HOOK_T.open1), focus: 0, content: { kind: "choc" } },
    2: { open: openAt(frame, HOOK_T.open2), focus: 0, content: { kind: "choc" } },
    [first.n]: {
      open: openAt(frame, HOOK_T.open3),
      focus: focus3,
      content: { kind: "bill", label: first.label, amount: first.amount },
      wobble: s.x,
    },
  };

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={-20} stagger={3} />
      <Stage offsetY={100}>
        <AdventCalendar
          states={states}
          leaf={p.blue}
          cavity={dec.white}
          numberColor={dec.white}
          textColor={dec.ink}
          accent={p.blue}
          appear={(n) => pop(frame, fps, -20 + (n % 6) * 1, springs.pop)}
        />
      </Stage>
    </SceneBg>
  );
};
