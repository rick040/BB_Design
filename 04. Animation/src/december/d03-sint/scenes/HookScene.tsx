import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline } from "../../text";
import { Book } from "../Book";
import type { SintProps } from "../schema";

// Beats (frames, scene-lokaal).
export const HOOK_T = {
  open: 0, // kaft begint open te gaan (op frame 0 staat het boek al half open)
  openLen: 28,
  rows: 26, // eerste regel in het boek krijgt zijn vinkje
  rowStagger: 3,
  bob: 70, // boek ademt even na
};

export const HookScene: React.FC<{ props: SintProps["hook"]; book: SintProps["book"] }> = ({ props, book }) => {
  const frame = useCurrentFrame();
  const p = usePalette();

  const open = interpolate(frame, [HOOK_T.open, HOOK_T.open + HOOK_T.openLen], [0.3, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const rowOn = (i: number) => {
    const t0 = HOOK_T.rows + i * HOOK_T.rowStagger;
    return interpolate(frame, [t0, t0 + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  };
  const bob = frame > HOOK_T.bob ? 1 + Math.sin((frame - HOOK_T.bob) / 5) * 0.012 : 1;

  return (
    <SceneBg color={p.light}>
      <Stage offsetY={30}>
        <Book
          open={open}
          rows={book.rows}
          rowOn={rowOn}
          coverTitle={props.coverTitle}
          cover={p.blue}
          coverAccent={p.blueSoft}
          ink={p.ink}
          accent={p.blue}
          style={{ position: "absolute", left: 140, top: 150, transform: `translateX(${-(400 / 2) * (1 - open)}px) scale(${bob * 1.14})` }}
        />
      </Stage>
      <DHeadline text={props.headline} color={p.blue} delay={-20} stagger={3} />
    </SceneBg>
  );
};
