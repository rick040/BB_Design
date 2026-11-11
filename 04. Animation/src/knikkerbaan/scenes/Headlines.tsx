import React from "react";
import { interpolate, Sequence, useCurrentFrame } from "remotion";
import { Headline } from "../../components/Text";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { type KnikkerbaanProps, SCENE_STARTS } from "../schema";

// Screen-space headlines over the continuous shot. Each one leaves with a
// short lift as the next spoken cue starts; only the text changes, the
// camera never cuts.
export const HEAD_T = {
  hookOut: SCENE_STARTS[1] - 6,
  runIn: SCENE_STARTS[1] + 2,
  runOut: SCENE_STARTS[2] - 6,
  againIn: SCENE_STARTS[2] + 2,
  againOut: SCENE_STARTS[3] - 8,
};

const Leave: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 8], [0, 1], clamp);
  if (t >= 1) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: 1 - t, transform: `translateY(${-40 * t}px)` }}>{children}</div>;
};

export const Headlines: React.FC<{ props: KnikkerbaanProps }> = ({ props }) => {
  const p = usePalette();
  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
  return (
    <>
      <Leave at={HEAD_T.hookOut}>
        {/* on screen at frame 0 (cover) */}
        <Headline text={props.hook.headline} color={p.blue} delay={-words(props.hook.headline) * 3 - 12} />
      </Leave>
      <Sequence from={HEAD_T.runIn} layout="none">
        <Leave at={HEAD_T.runOut - HEAD_T.runIn}>
          <Headline text={props.run.headline} color={p.blue} />
        </Leave>
      </Sequence>
      <Sequence from={HEAD_T.againIn} layout="none">
        <Leave at={HEAD_T.againOut - HEAD_T.againIn}>
          <Headline text={props.again.headline} color={p.blue} />
        </Leave>
      </Sequence>
    </>
  );
};
