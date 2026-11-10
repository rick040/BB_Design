import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Crack shatter": the new scene breaks through the old one along a jagged,
// star-shaped crack that grows from a point. CSS clip-path only, so it
// renders the same headless as in Studio. Made for concept 61 (dun ijs).
type CrackShatterProps = {
  width: number;
  height: number;
  /** origin of the crack, 0..1 of the frame */
  cx: number;
  cy: number;
  points: number;
};

const JITTER = [1, 0.62, 0.93, 0.55, 1.08, 0.7, 0.88, 0.5, 1.02, 0.66, 0.95, 0.58, 1.1, 0.64, 0.9, 0.52, 1.04, 0.6];

const CrackShatterPresentation: React.FC<TransitionPresentationComponentProps<CrackShatterProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height, cx, cy, points } = passedProps;
  if (presentationDirection === "exiting") {
    // the old scene gives a small jolt as the ice breaks
    const t = presentationProgress;
    const jolt = t < 0.35 ? Math.sin(t * 60) * 10 * (1 - t / 0.35) : 0;
    return <AbsoluteFill style={{ transform: `translate(${jolt}px, ${jolt * 0.4}px)` }}>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const maxR = Math.hypot(width, height) * 1.25;
  const r = p * maxR;
  const ox = cx * width;
  const oy = cy * height;
  const n = points * 2;
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.2;
    const k = JITTER[i % JITTER.length] * (i % 2 === 0 ? 1 : 0.7 + 0.3 * p);
    pts.push(`${(ox + Math.cos(a) * r * k).toFixed(1)}px ${(oy + Math.sin(a) * r * k).toFixed(1)}px`);
  }
  return (
    <AbsoluteFill style={{ clipPath: p >= 0.999 ? undefined : `polygon(${pts.join(",")})` }}>{children}</AbsoluteFill>
  );
};

export const crackShatter = (
  props: Pick<CrackShatterProps, "width" | "height"> & Partial<CrackShatterProps>,
): TransitionPresentation<CrackShatterProps> => ({
  component: CrackShatterPresentation,
  props: { cx: 0.5, cy: 0.55, points: 9, ...props },
});
