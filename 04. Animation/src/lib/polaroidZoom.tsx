import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

// "Polaroid zoom": the new scene arrives as an instant photo (white frame,
// wide bottom strip, tilted) that flies in and grows until it fills the
// screen; the frame shrinks away as it lands. Plain CSS.
type PolaroidZoomProps = {
  /** Starting scale of the photo. */
  from: number;
  /** Starting tilt in degrees. */
  tilt: number;
  /** Frame border (px, in full-frame units) at the start. */
  border: number;
};

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const PolaroidZoomPresentation: React.FC<TransitionPresentationComponentProps<PolaroidZoomProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    const dim = interpolate(p, [0, 1], [0, 0.35], clampOpts);
    return (
      <AbsoluteFill style={{ transform: `scale(${1 - 0.04 * p})` }}>
        {children}
        <AbsoluteFill style={{ background: "#000", opacity: dim }} />
      </AbsoluteFill>
    );
  }
  const scale = interpolate(p, [0, 1], [passedProps.from, 1], clampOpts);
  const rot = interpolate(p, [0, 1], [passedProps.tilt, 0], clampOpts);
  const y = interpolate(p, [0, 1], [18, 0], clampOpts);
  const b = interpolate(p, [0, 0.75, 1], [passedProps.border, passedProps.border * 0.35, 0], clampOpts);
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${y}%) rotate(${rot}deg) scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      {b > 0.5 ? (
        <div
          style={{
            position: "absolute",
            left: -b,
            right: -b,
            top: -b,
            bottom: -b * 3.2,
            background: "#fdfdfb",
            boxShadow: `0 ${b}px ${b * 2}px rgba(0, 0, 0, 0.3)`,
          }}
        />
      ) : null}
      <AbsoluteFill style={{ overflow: "hidden" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const polaroidZoom = (props?: Partial<PolaroidZoomProps>): TransitionPresentation<PolaroidZoomProps> => ({
  component: PolaroidZoomPresentation,
  props: { from: 0.38, tilt: -8, border: 70, ...props },
});
