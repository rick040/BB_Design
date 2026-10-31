import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Ring wipe": the new scene appears through concentric rings that grow
// until they close, like a dartboard filling in. Plain CSS mask, so it
// renders the same everywhere (no WebGL).
type RingWipeProps = {
  /** Distance between ring centres in px. */
  period: number;
};

const RingWipePresentation: React.FC<TransitionPresentationComponentProps<RingWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * presentationProgress})` }}>{children}</AbsoluteFill>;
  }
  const P = passedProps.period;
  const w = Math.min(P, presentationProgress * P * 1.04);
  const mask =
    presentationProgress >= 0.999
      ? undefined
      : `repeating-radial-gradient(circle at 50% 50%, #000 0px, #000 ${w.toFixed(2)}px, transparent ${(w + 0.5).toFixed(2)}px, transparent ${P}px)`;
  return (
    <AbsoluteFill
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        transform: `scale(${1.04 - 0.04 * presentationProgress})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const ringWipe = (props?: Partial<RingWipeProps>): TransitionPresentation<RingWipeProps> => ({
  component: RingWipePresentation,
  props: { period: 150, ...props },
});
