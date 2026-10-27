import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Plaque flip": the old scene tips backwards around its top edge like a
// hinged museum label, the new one swings up from its bottom edge.
type PlaqueFlipProps = {
  perspective: number;
};

const PlaqueFlipPresentation: React.FC<TransitionPresentationComponentProps<PlaqueFlipProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const exiting = presentationDirection === "exiting";
  const deg = exiting ? -p * 90 : (1 - p) * 90;
  return (
    <AbsoluteFill style={{ perspective: passedProps.perspective }}>
      <AbsoluteFill
        style={{
          transform: `rotateX(${deg}deg)`,
          transformOrigin: exiting ? "50% 0%" : "50% 100%",
          backfaceVisibility: "hidden",
          filter: exiting ? `brightness(${1 - 0.4 * p})` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const plaqueFlip = (props?: Partial<PlaqueFlipProps>): TransitionPresentation<PlaqueFlipProps> => ({
  component: PlaqueFlipPresentation,
  props: { perspective: 2400, ...props },
});
