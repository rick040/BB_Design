import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Tip over": the old scene topples off its bottom corner like a plate that
// loses its balance, uncovering the new scene that already sits underneath.
// Plain CSS (transform + opacity), so it renders the same everywhere.
type TipOverProps = {
  /** Which bottom corner the old scene pivots on. */
  pivot: "left" | "right";
  /** Rotation at the end, in degrees. */
  angle: number;
};

const TipOverPresentation: React.FC<TransitionPresentationComponentProps<TipOverProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "entering") {
    return <AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * p})` }}>{children}</AbsoluteFill>;
  }
  const sign = passedProps.pivot === "left" ? 1 : -1;
  const eased = p * p; // starts slow, then falls
  return (
    <AbsoluteFill
      style={{
        zIndex: 2,
        transformOrigin: passedProps.pivot === "left" ? "0% 100%" : "100% 100%",
        transform: `translateY(${eased * 420}px) rotate(${sign * eased * passedProps.angle}deg)`,
        opacity: 1 - Math.max(0, p - 0.75) * 4,
        boxShadow: `0 30px 80px rgba(0,0,0,${0.25 * p})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const tipOver = (props?: Partial<TipOverProps>): TransitionPresentation<TipOverProps> => ({
  component: TipOverPresentation,
  props: { pivot: "left", angle: 34, ...props },
});
