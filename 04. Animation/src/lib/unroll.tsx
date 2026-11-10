import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Unroll": the new scene unrolls from the left like a rug, with a rolled-up
// cylinder at the moving edge that gets thinner as it unrolls. Plain CSS.
type UnrollProps = {
  /** Colour of the roll (usually the new scene's background). */
  roll: string;
  /** Stripe colour on the roll. */
  stripe: string;
};

const UnrollPresentation: React.FC<TransitionPresentationComponentProps<UnrollProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width: W } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const r = 70 * (1 - p) + 14; // roll radius
  const edge = (W + r * 2) * p - r;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0px ${Math.max(0, W - edge)}px 0px 0px)` }}>{children}</AbsoluteFill>
      {p > 0.001 && p < 0.999 ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: edge - r,
            width: r * 2,
            background: `linear-gradient(90deg, rgba(0,10,60,0.22), rgba(255,255,255,0.0) 30%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 70%, rgba(0,10,60,0.28)), ${passedProps.roll}`,
            boxShadow: "18px 0 40px rgba(0,10,60,0.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: r * 0.75,
              width: r * 0.5,
              background: passedProps.stripe,
              opacity: 0.85,
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const unroll = (props?: Partial<UnrollProps>): TransitionPresentation<UnrollProps> => ({
  component: UnrollPresentation,
  props: { roll: "#fafbff", stripe: "#b6c7ff", ...props },
});
