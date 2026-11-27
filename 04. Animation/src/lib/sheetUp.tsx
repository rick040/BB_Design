import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Sheet up": the new scene slides up from the bottom like a phone sheet,
// the old one sinks back a little and dims. Plain CSS.
type SheetUpProps = {
  /** Frame height in px. */
  size: number;
};

const SheetUpPresentation: React.FC<TransitionPresentationComponentProps<SheetUpProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "entering") {
    return (
      <AbsoluteFill
        style={{
          transform: `translateY(${(1 - p) * passedProps.size}px)`,
          borderRadius: p < 0.999 ? 60 : 0,
          overflow: "hidden",
          boxShadow: "0 -30px 80px rgba(0, 10, 60, 0.35)",
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ transform: `scale(${1 - 0.08 * p})`, filter: `brightness(${1 - 0.35 * p})` }}>
      {children}
    </AbsoluteFill>
  );
};

export const sheetUp = (props: SheetUpProps): TransitionPresentation<SheetUpProps> => ({
  component: SheetUpPresentation,
  props,
});
