import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

// "Camera flash": the old scene burns out to white like a flash going off,
// the new scene comes back out of the white (slightly zoomed, settling).
// Plain CSS, renders the same everywhere.
type CameraFlashProps = {
  /** Colour of the flash. */
  color: string;
  /** Progress (0..1) at which the frame is fully white. */
  peak: number;
};

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const CameraFlashPresentation: React.FC<TransitionPresentationComponentProps<CameraFlashProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const { peak, color } = passedProps;
  if (presentationDirection === "exiting") {
    const white = interpolate(p, [0, peak], [0, 1], clampOpts);
    return (
      <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * white})` }}>
        {children}
        <AbsoluteFill style={{ background: color, opacity: white }} />
      </AbsoluteFill>
    );
  }
  const visible = p >= peak ? 1 : 0;
  const white = interpolate(p, [peak, 1], [1, 0], clampOpts);
  return (
    <AbsoluteFill style={{ opacity: visible, transform: `scale(${1.04 - 0.04 * (1 - white)})` }}>
      {children}
      <AbsoluteFill style={{ background: color, opacity: white }} />
    </AbsoluteFill>
  );
};

export const cameraFlash = (props?: Partial<CameraFlashProps>): TransitionPresentation<CameraFlashProps> => ({
  component: CameraFlashPresentation,
  props: { color: "#ffffff", peak: 0.4, ...props },
});
