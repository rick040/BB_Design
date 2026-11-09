import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Pip wipe": the new scene appears through the five pips of a die that
// grow until they cover the frame (centre pip first). Plain CSS mask with
// radial gradients, so it renders the same headless as in Studio.
type PipWipeProps = {
  /** Frames of lead the centre pip gets over the corner pips (0..0.5 of progress). */
  lead: number;
};

const PIPS: [number, number, number][] = [
  // x %, y %, start offset (0 = centre first)
  [50, 50, 0],
  [25, 25, 1],
  [75, 25, 1],
  [25, 75, 1],
  [75, 75, 1],
];

const PipWipePresentation: React.FC<TransitionPresentationComponentProps<PipWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const maxR = Math.max(width, height) * 0.36;
  const p = presentationProgress;
  const layers = PIPS.map(([x, y, o]) => {
    const local = Math.min(1, Math.max(0, (p - o * passedProps.lead) / (1 - o * passedProps.lead)));
    const r = Math.max(0.01, local * maxR);
    return `radial-gradient(circle at ${x}% ${y}%, #000 ${r}px, transparent ${r + 1}px)`;
  }).join(", ");
  const mask = p >= 0.999 ? undefined : layers;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>{children}</AbsoluteFill>
  );
};

export const pipWipe = (props?: Partial<PipWipeProps>): TransitionPresentation<PipWipeProps> => ({
  component: PipWipePresentation,
  props: { lead: 0.25, ...props },
});
