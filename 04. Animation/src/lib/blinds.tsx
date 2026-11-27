import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Blinds": the new scene opens in strips, like the rows of a calendar.
// Plain CSS (a repeating mask gradient), so it renders the same headless.
type BlindsProps = {
  /** Number of strips. */
  count: number;
  /** "rows" = horizontal strips, "columns" = vertical strips. */
  axis: "rows" | "columns";
  /** Frame size in px along the axis (height for rows, width for columns). */
  size: number;
};

const BlindsPresentation: React.FC<TransitionPresentationComponentProps<BlindsProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  if (p >= 0.999) return <AbsoluteFill>{children}</AbsoluteFill>;
  const strip = passedProps.size / passedProps.count;
  const open = Math.max(0, p * strip);
  const dir = passedProps.axis === "rows" ? "to bottom" : "to right";
  const mask = `repeating-linear-gradient(${dir}, #000 0px, #000 ${open}px, transparent ${open}px, transparent ${strip}px)`;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>{children}</AbsoluteFill>
  );
};

export const blinds = (props: BlindsProps): TransitionPresentation<BlindsProps> => ({
  component: BlindsPresentation,
  props,
});
