import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Spotlight sweep": a cone of light opens from a lamp above the frame and
// reveals the new scene inside it, while the old scene dims like a museum
// room when the lights go down. Plain CSS (clip-path + filter), no WebGL.
type SpotlightSweepProps = {
  /** Horizontal position of the lamp, 0..1 of the frame width. */
  lampX: number;
  /** How dark the old scene gets at the end (0..1). */
  dim: number;
};

const SpotlightSweepPresentation: React.FC<TransitionPresentationComponentProps<SpotlightSweepProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ filter: `brightness(${1 - passedProps.dim * p})` }}>{children}</AbsoluteFill>
    );
  }
  // Apex sits above the frame; at p = 1 the cone is wide enough to cover
  // every corner (half-width at the top edge has to reach 100%).
  const apexX = passedProps.lampX * 100;
  const half = p * 900;
  const clip = `polygon(${apexX}% -25%, ${apexX + half}% 125%, ${apexX - half}% 125%)`;
  return (
    <AbsoluteFill style={{ clipPath: p >= 0.999 ? undefined : clip }}>
      {children}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, rgba(255,236,170,0.55), rgba(255,236,170,0))",
          opacity: (1 - p) * 0.9,
        }}
      />
    </AbsoluteFill>
  );
};

export const spotlightSweep = (props?: Partial<SpotlightSweepProps>): TransitionPresentation<SpotlightSweepProps> => ({
  component: SpotlightSweepPresentation,
  props: { lampX: 0.5, dim: 0.6, ...props },
});
