import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Plate spin": the old scene spins away edge-on (squeezes to a sliver,
// like a plate turning on its rim) and the new scene spins back open.
// 2D CSS only (scaleX + skew), no 3D or WebGL.
type PlateSpinProps = {
  /** Skew at the thinnest point, in degrees. */
  skew: number;
};

const PlateSpinPresentation: React.FC<TransitionPresentationComponentProps<PlateSpinProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const entering = presentationDirection === "entering";
  // exiting uses the first half, entering the second half
  const t = entering ? Math.max(0, (p - 0.5) * 2) : Math.min(1, p * 2);
  const open = entering ? t : 1 - t;
  const visible = entering ? p > 0.5 : p < 0.5;
  const skew = (1 - open) * passedProps.skew * (entering ? -1 : 1);
  return (
    <AbsoluteFill
      style={{
        visibility: visible ? "visible" : "hidden",
        transform: `scaleX(${Math.max(0.02, open)}) skewY(${skew}deg)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const plateSpin = (props?: Partial<PlateSpinProps>): TransitionPresentation<PlateSpinProps> => ({
  component: PlateSpinPresentation,
  props: { skew: 8, ...props },
});
