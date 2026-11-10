import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Wave wipe": the new scene washes in behind a wavy waterline, like the
// tide coming in (concept 57, "Vloed komt. Jij staat droog."). Plain CSS
// clip-path, so it renders the same everywhere, unlike WebGL presentations.
type WaveWipeProps = {
  /** "up" = water rises from the bottom, "left" = a wave rolls in from the right. */
  direction: "up" | "left";
  /** Wave height in % of the frame. */
  amplitude: number;
  /** Number of wave crests across the edge. */
  crests: number;
};

const STEPS = 48;

const WaveWipePresentation: React.FC<TransitionPresentationComponentProps<WaveWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { direction, amplitude, crests } = passedProps;
  const p = presentationProgress;

  if (presentationDirection === "exiting") {
    // The old scene sinks back a little as the water takes over.
    const shift = direction === "up" ? `translateY(${-p * 4}%)` : `translateX(${-p * 4}%)`;
    return <AbsoluteFill style={{ transform: shift }}>{children}</AbsoluteFill>;
  }

  // Edge position in % (overshoots so the crests fully clear the frame).
  const edge = 100 + amplitude - p * (100 + amplitude * 2);
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * 100;
    const wobble = Math.sin((t / 100) * Math.PI * 2 * crests + p * 9) * amplitude;
    const e = Math.max(-amplitude * 2, edge + wobble);
    pts.push(direction === "up" ? `${t}% ${e}%` : `${e}% ${t}%`);
  }
  const poly =
    direction === "up"
      ? `polygon(0% 100%, ${pts.join(", ")}, 100% 100%)`
      : `polygon(100% 0%, ${pts.join(", ")}, 100% 100%)`;

  return <AbsoluteFill style={{ clipPath: poly, WebkitClipPath: poly }}>{children}</AbsoluteFill>;
};

export const waveWipe = (props?: Partial<WaveWipeProps>): TransitionPresentation<WaveWipeProps> => ({
  component: WaveWipePresentation,
  props: { direction: "up", amplitude: 3.5, crests: 2.5, ...props },
});
