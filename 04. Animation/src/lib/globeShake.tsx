import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Globe shake": the old scene is shaken like a snow globe (growing jitter,
// tilt and blur) while the new scene drifts down into place, the way snow
// settles. Plain CSS only.
type GlobeShakeProps = { amp: number; blur: number };

const GlobeShakePresentation: React.FC<TransitionPresentationComponentProps<GlobeShakeProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    const a = passedProps.amp * Math.sin(p * Math.PI);
    const x = Math.sin(p * 40) * a;
    const r = Math.sin(p * 31) * a * 0.04;
    return (
      <AbsoluteFill
        style={{
          transform: `translateX(${x}px) rotate(${r}deg) scale(${1 + 0.05 * p})`,
          filter: `blur(${p * passedProps.blur}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, p * 1.8),
        transform: `translateY(${-(1 - p) * 90}px)`,
        filter: p < 0.95 ? `blur(${(1 - p) * passedProps.blur * 0.6}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const globeShake = (props?: Partial<GlobeShakeProps>): TransitionPresentation<GlobeShakeProps> => ({
  component: GlobeShakePresentation,
  props: { amp: 40, blur: 18, ...props },
});
