import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Flicker": the light stutters like a bad bulb in a horror film. The old
// scene blinks out, a few dark frames, then the new scene stutters on.
// Plain CSS (opacity + brightness), the dark comes from whatever sits
// behind the TransitionSeries, so give that a dark background.
type FlickerProps = {
  /** Brightness of the "bulb surge" just before the old scene dies. */
  surge: number;
};

const stepOut = (p: number) => (p < 0.12 ? 1 : p < 0.2 ? 0 : p < 0.3 ? 1 : p < 0.38 ? 0.35 : 0);
const stepIn = (p: number) => (p < 0.52 ? 0 : p < 0.6 ? 1 : p < 0.68 ? 0 : p < 0.8 ? 0.8 : p < 0.86 ? 0.25 : 1);

const FlickerPresentation: React.FC<TransitionPresentationComponentProps<FlickerProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const entering = presentationDirection === "entering";
  const opacity = entering ? stepIn(p) : stepOut(p);
  const bright = !entering && p >= 0.2 && p < 0.3 ? passedProps.surge : 1;
  return (
    <AbsoluteFill style={{ opacity, filter: bright !== 1 ? `brightness(${bright})` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

export const flicker = (props?: Partial<FlickerProps>): TransitionPresentation<FlickerProps> => ({
  component: FlickerPresentation,
  props: { surge: 1.6, ...props },
});
