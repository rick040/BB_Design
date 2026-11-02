import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Door swing": the old scene swings open like a door on its left hinge
// (away from the viewer) and reveals the new scene behind it. Plain CSS 3D
// transforms plus a clip-path on the new scene, no WebGL.
type DoorSwingProps = {
  /** Maximum rotation in degrees. */
  angle: number;
  perspective: number;
};

const DoorSwingPresentation: React.FC<TransitionPresentationComponentProps<DoorSwingProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const { width: W } = useVideoConfig();
  const theta = (p * passedProps.angle * Math.PI) / 180;
  const d = passedProps.perspective;
  if (presentationDirection === "entering") {
    // The entering scene is drawn on top, so clip it to the area the door
    // no longer covers (projected right edge of the swinging door).
    const edge = Math.max(0, (W * Math.cos(theta) * d) / (d + W * Math.sin(theta)));
    return (
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${edge}px)` }}>
        {children}
        <AbsoluteFill style={{ background: "#000", opacity: (1 - p) * 0.25 }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ perspective: d, perspectiveOrigin: "0% 50%" }}>
      <AbsoluteFill
        style={{
          transform: `rotateY(${p * passedProps.angle}deg)`,
          transformOrigin: "0% 50%",
          backfaceVisibility: "hidden",
          boxShadow: `0 0 ${80 * p}px rgba(0,0,0,${0.35 * p})`,
        }}
      >
        {children}
        <AbsoluteFill style={{ background: "#000", opacity: p * 0.3 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const doorSwing = (props?: Partial<DoorSwingProps>): TransitionPresentation<DoorSwingProps> => ({
  component: DoorSwingPresentation,
  props: { angle: 100, perspective: 2200, ...props },
});
