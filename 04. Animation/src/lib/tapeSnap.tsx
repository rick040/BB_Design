import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";

// "Tape snap": a finish tape stretches across the frame, snaps in the
// middle, and the two halves whip away to the sides while the new scene
// opens from the centre. Plain CSS (clip-path + transforms).
type TapeSnapProps = {
  tapeColor: string;
  /** Vertical position of the tape, 0..1 of the frame height. */
  y: number;
};

const TapeSnapPresentation: React.FC<TransitionPresentationComponentProps<TapeSnapProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  // First 20%: the tape stretches (bows). After that it snaps and opens.
  const open = interpolate(p, [0.2, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bow = interpolate(p, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const half = (width / 2) * open;
  const ty = height * passedProps.y;
  const tapeH = 40;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${width / 2 - half}px 0 ${width / 2 - half}px)` }}>{children}</AbsoluteFill>
      {p < 1
        ? [0, 1].map((side) => {
            const dir = side === 0 ? -1 : 1;
            const len = open > 0 ? width / 2 - half : width / 2;
            const sag = open > 0 ? 0 : bow * 26;
            return (
              <div
                key={side}
                style={{
                  position: "absolute",
                  left: side === 0 ? 0 : width / 2 + half,
                  top: ty - tapeH / 2 + sag,
                  width: Math.max(0, len),
                  height: tapeH,
                  background: passedProps.tapeColor,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                  transformOrigin: side === 0 ? "0% 50%" : "100% 50%",
                  transform: `rotate(${dir * (open > 0 ? -open * 28 : -bow * 3)}deg)`,
                  opacity: 1 - open * 0.3,
                }}
              />
            );
          })
        : null}
    </AbsoluteFill>
  );
};

export const tapeSnap = (props: TapeSnapProps): TransitionPresentation<TapeSnapProps> => ({
  component: TapeSnapPresentation,
  props,
});
