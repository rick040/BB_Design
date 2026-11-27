import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Doors": the old scene splits down the middle and both halves slide away
// sideways, like two doors opening onto the new scene. Plain CSS.
type DoorsProps = {
  /** Frame width in px. */
  width: number;
};

const DoorsPresentation: React.FC<TransitionPresentationComponentProps<DoorsProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const dx = p * passedProps.width * 0.55;
  if (presentationDirection === "entering") {
    // The new scene is drawn on top, so only show it in the gap between the doors.
    const gap = Math.max(0, 50 - (dx / passedProps.width) * 100);
    return (
      <AbsoluteFill style={{ clipPath: p >= 0.999 ? undefined : `inset(0 ${gap}% 0 ${gap}%)` }}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "inset(0 50% 0 0)", transform: `translateX(${-dx}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "inset(0 0 0 50%)", transform: `translateX(${dx}px)` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const doors = (props: DoorsProps): TransitionPresentation<DoorsProps> => ({
  component: DoorsPresentation,
  props,
});
