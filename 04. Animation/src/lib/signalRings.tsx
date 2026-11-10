import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Signal rings": the new scene arrives as radio waves. Concentric rings
// grow out of one point and thicken until they close up. Plain CSS
// (mask-image with a repeating radial gradient), no WebGL.
type SignalRingsProps = {
  /** Origin of the rings, in % of the frame. */
  x: number;
  y: number;
  /** Distance between ring centres in px. */
  period: number;
};

const SignalRingsPresentation: React.FC<TransitionPresentationComponentProps<SignalRingsProps>> = ({
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
  const { period, x, y } = passedProps;
  // Rings get thicker (band) and the whole pattern grows outward (radius).
  const band = Math.min(period, period * p * 1.25);
  const reach = 2600 * Math.min(1, p * 1.4);
  const mask = `radial-gradient(circle at ${x}% ${y}%, #000 ${reach - 1}px, transparent ${reach}px), repeating-radial-gradient(circle at ${x}% ${y}%, #000 0px, #000 ${band}px, transparent ${band + 1}px, transparent ${period}px)`;
  return (
    <AbsoluteFill
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const signalRings = (props?: Partial<SignalRingsProps>): TransitionPresentation<SignalRingsProps> => ({
  component: SignalRingsPresentation,
  props: { x: 50, y: 60, period: 120, ...props },
});
