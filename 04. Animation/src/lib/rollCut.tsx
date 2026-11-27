import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Roll cut": both scenes roll past like the reel of a slot machine, with a
// little vertical motion blur. direction "up" rolls forward, "down" rewinds.
// Plain CSS (transform + blur), so it renders the same headless.
type RollCutProps = {
  direction: "up" | "down";
  /** Frame height in px. */
  size: number;
  /** Max blur in px at the midpoint. */
  blur: number;
};

const RollCutPresentation: React.FC<TransitionPresentationComponentProps<RollCutProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const sign = passedProps.direction === "up" ? 1 : -1;
  const entering = presentationDirection === "entering";
  const y = entering ? sign * (1 - p) * passedProps.size : -sign * p * passedProps.size;
  const blur = Math.sin(Math.PI * p) * passedProps.blur;
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${y}px)`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const rollCut = (props: RollCutProps): TransitionPresentation<RollCutProps> => ({
  component: RollCutPresentation,
  props,
});
