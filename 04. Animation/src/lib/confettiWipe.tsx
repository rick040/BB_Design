import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, random, useVideoConfig } from "remotion";

// "Confetti wipe": the new scene is revealed along a diagonal edge that
// sweeps from bottom-left to top-right, with a band of confetti riding the
// edge. Only clip-path and transforms, so it renders the same everywhere.
type ConfettiWipeProps = {
  colors: string[];
  pieces: number;
};

const ConfettiWipePresentation: React.FC<TransitionPresentationComponentProps<ConfettiWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width: W, height: H } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const s = p * (W + H) * 1.04;
  const clip = `polygon(0px ${H}px, ${s}px ${H}px, 0px ${H - s}px)`;
  const band = p > 0.001 && p < 0.999;
  return (
    <>
      <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
      {band ? (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {Array.from({ length: passedProps.pieces }).map((_, i) => {
            // Spread pieces along the edge line x + (H - y) = s.
            const t = random(`cw-t${i}`);
            const x = t * s;
            const y = H - (s - x);
            const off = (random(`cw-o${i}`) - 0.5) * 90;
            const size = 16 + random(`cw-s${i}`) * 16;
            const rot = random(`cw-r${i}`) * 360 + p * 400 * (random(`cw-d${i}`) - 0.5);
            if (y < -60 || y > H + 60 || x > W + 60) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x + off * 0.7,
                  top: y + off * 0.7,
                  width: size,
                  height: size * 1.7,
                  borderRadius: 3,
                  background: passedProps.colors[i % passedProps.colors.length],
                  transform: `rotate(${rot}deg)`,
                }}
              />
            );
          })}
        </AbsoluteFill>
      ) : null}
    </>
  );
};

export const confettiWipe = (props?: Partial<ConfettiWipeProps>): TransitionPresentation<ConfettiWipeProps> => ({
  component: ConfettiWipePresentation,
  props: { colors: ["#ffce31", "#ff5a79", "#4fd1d9", "#b6c7ff", "#ffffff"], pieces: 90, ...props },
});
