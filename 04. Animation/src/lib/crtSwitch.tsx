import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

// "CRT switch": an old TV changing channel. The old scene collapses into a
// bright horizontal line, the new one opens up from that line. Plain CSS
// (scaleY + brightness) on a dark backdrop.
type CrtSwitchProps = {
  /** Colour behind the collapsing picture. */
  backdrop: string;
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const CrtSwitchPresentation: React.FC<TransitionPresentationComponentProps<CrtSwitchProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    // 0 → 0.5: squeeze to a line and glow; after that only the backdrop.
    const sy = interpolate(p, [0, 0.42, 0.5], [1, 0.006, 0.002], clamp);
    const sx = interpolate(p, [0.38, 0.5], [1, 0.6], clamp);
    const glow = interpolate(p, [0, 0.45], [1, 3.2], clamp);
    return (
      <AbsoluteFill style={{ background: passedProps.backdrop }}>
        <AbsoluteFill
          style={{
            transform: `scale(${sx}, ${sy})`,
            filter: `brightness(${glow})`,
            opacity: p < 0.5 ? 1 : 0,
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  // 0.5 → 1: open up from the line.
  const sy = interpolate(p, [0.5, 0.62, 1], [0.004, 0.04, 1], clamp);
  const glow = interpolate(p, [0.5, 0.9], [3, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        opacity: p < 0.5 ? 0 : 1,
        transform: `scaleY(${sy})`,
        filter: glow > 1.01 ? `brightness(${glow})` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const crtSwitch = (props?: Partial<CrtSwitchProps>): TransitionPresentation<CrtSwitchProps> => ({
  component: CrtSwitchPresentation,
  props: { backdrop: "#0b0b12", ...props },
});
