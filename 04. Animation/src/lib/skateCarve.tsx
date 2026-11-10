import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Skate carve": the new scene is carved in by an S-shaped edge that sweeps
// across the frame like the curve of a skate stroke, with a thin white
// ice line on the edge. CSS clip-path path(), no WebGL. Concept 61.
type SkateCarveProps = {
  width: number;
  height: number;
  fromRight: boolean;
  edgeColor: string;
};

const SkateCarvePresentation: React.FC<TransitionPresentationComponentProps<SkateCarveProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const { width: W, height: H, fromRight, edgeColor } = passedProps;
  const p = presentationProgress;
  const bulge = W * 0.28;
  // leading edge x at the vertical middle; travels past both ends
  const e = -bulge + p * (W + bulge * 2);
  const top = e - bulge;
  const bot = e + bulge * 0.2;
  const edge = `M ${top} 0 C ${e + bulge} ${H * 0.33}, ${e - bulge} ${H * 0.66}, ${bot} ${H}`;
  const shape = `M 0 0 L ${top} 0 C ${e + bulge} ${H * 0.33}, ${e - bulge} ${H * 0.66}, ${bot} ${H} L 0 ${H} Z`;
  const flip = fromRight ? `scaleX(-1)` : undefined;
  return (
    <AbsoluteFill style={{ transform: flip }}>
      <AbsoluteFill style={{ clipPath: p >= 0.999 ? undefined : `path('${shape}')` }}>
        <AbsoluteFill style={{ transform: flip }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {p > 0.001 && p < 0.999 ? (
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={edge} fill="none" stroke={edgeColor} strokeWidth={14} strokeLinecap="round" opacity={0.9} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

export const skateCarve = (
  props: Pick<SkateCarveProps, "width" | "height"> & Partial<SkateCarveProps>,
): TransitionPresentation<SkateCarveProps> => ({
  component: SkateCarvePresentation,
  props: { fromRight: false, edgeColor: "#ffffff", ...props },
});
