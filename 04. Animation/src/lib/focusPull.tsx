import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Focus pull": the old scene drifts out of focus while the new one comes
// into focus on top of it. Plain CSS (blur + opacity + a touch of scale), so
// it renders the same everywhere, unlike the WebGL presentations.
type FocusPullProps = {
  /** Maximum blur in px at the midpoint. */
  blur: number;
};

const FocusPullPresentation: React.FC<TransitionPresentationComponentProps<FocusPullProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  const blur = entering ? (1 - p) * passedProps.blur : p * passedProps.blur;
  const style: React.CSSProperties = entering
    ? {
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${1.05 - 0.05 * p})`,
      }
    : {
        transform: `scale(${1 + 0.04 * p})`,
      };
  return (
    <AbsoluteFill style={{ ...style, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

export const focusPull = (props?: Partial<FocusPullProps>): TransitionPresentation<FocusPullProps> => ({
  component: FocusPullPresentation,
  props: { blur: 24, ...props },
});
