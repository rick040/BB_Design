import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Whip pan": the camera swings sideways like following a thrown dart.
// Both scenes move together with a horizontal smear (CSS blur + skew).
type WhipPanProps = {
  /** Maximum blur in px at the midpoint (keep around 12). */
  blur: number;
  /** "left" = scenes move to the left (new one comes from the right). */
  direction: "left" | "right";
};

const WhipPanPresentation: React.FC<TransitionPresentationComponentProps<WhipPanProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width } = useVideoConfig();
  const p = presentationProgress;
  const sign = passedProps.direction === "left" ? -1 : 1;
  const entering = presentationDirection === "entering";
  const x = entering ? -sign * (1 - p) * width : sign * p * width;
  const smear = Math.sin(Math.PI * p);
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${x}px) skewX(${sign * smear * -6}deg)`,
        filter: smear > 0.05 ? `blur(${smear * passedProps.blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const whipPan = (props?: Partial<WhipPanProps>): TransitionPresentation<WhipPanProps> => ({
  component: WhipPanPresentation,
  props: { blur: 12, direction: "left", ...props },
});
