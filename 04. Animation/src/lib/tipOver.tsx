import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Tip over": the old scene tips over its bottom-left corner and falls out
// of the frame, like emptying a sieve; the new scene is already underneath.
// Plain CSS transform.
type TipOverProps = {
  /** Final rotation of the old scene in degrees. */
  angle: number;
};

const TipOverPresentation: React.FC<TransitionPresentationComponentProps<TipOverProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "entering") {
    return (
      <AbsoluteFill style={{ transform: `scale(${0.96 + 0.04 * presentationProgress})` }}>{children}</AbsoluteFill>
    );
  }
  const p = presentationProgress;
  const eased = p * p;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0% 100%",
        transform: `rotate(${eased * passedProps.angle}deg) translateY(${eased * 30}%)`,
        boxShadow: `0 40px 120px rgba(0, 10, 60, ${0.35 * (1 - p)})`,
        zIndex: 2,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const tipOver = (props?: Partial<TipOverProps>): TransitionPresentation<TipOverProps> => ({
  component: TipOverPresentation,
  props: { angle: 70, ...props },
});
