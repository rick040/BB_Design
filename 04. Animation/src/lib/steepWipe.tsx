import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Steep": the new scene seeps in like tea out of a bag. A few soft blobs
// grow from one point and merge until they cover the frame. Plain CSS
// (mask-image with radial gradients), so it renders the same headless.
type SteepProps = {
  /** Origin of the infusion, in % of the frame. */
  x: number;
  y: number;
};

const BLOBS = [
  { dx: 0, dy: 0, k: 1.0 },
  { dx: -14, dy: 10, k: 0.8 },
  { dx: 16, dy: 14, k: 0.75 },
  { dx: 6, dy: -16, k: 0.7 },
  { dx: -10, dy: -12, k: 0.65 },
];

const SteepPresentation: React.FC<TransitionPresentationComponentProps<SteepProps>> = ({
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
  const mask = BLOBS.map((b) => {
    const r = Math.max(0, p * 170 * b.k);
    return `radial-gradient(circle at ${passedProps.x + b.dx * p}% ${passedProps.y + b.dy * p}%, #000 ${r}%, transparent ${r + 12}%)`;
  }).join(", ");
  return (
    <AbsoluteFill style={{ maskImage: mask, WebkitMaskImage: mask }}>{children}</AbsoluteFill>
  );
};

export const steepWipe = (props?: Partial<SteepProps>): TransitionPresentation<SteepProps> => ({
  component: SteepPresentation,
  props: { x: 50, y: 55, ...props },
});
