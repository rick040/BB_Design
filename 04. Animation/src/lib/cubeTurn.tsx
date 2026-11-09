import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Cube turn": like a die rolling one face over. The old scene folds away to
// the left (shrinking, getting darker), the new face unfolds from the right.
// 2D CSS only (scaleX + brightness), no 3D or WebGL.
type CubeTurnProps = {
  /** How dark the face that turns away gets (0..1). */
  shade: number;
};

const CubeTurnPresentation: React.FC<TransitionPresentationComponentProps<CubeTurnProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const entering = presentationDirection === "entering";
  const style: React.CSSProperties = entering
    ? {
        transform: `scaleX(${Math.max(0.001, p)})`,
        transformOrigin: "100% 50%",
        filter: p < 0.999 ? `brightness(${1 - (1 - p) * passedProps.shade})` : undefined,
      }
    : {
        transform: `scaleX(${Math.max(0.001, 1 - p)})`,
        transformOrigin: "0% 50%",
        filter: p > 0.001 ? `brightness(${1 - p * passedProps.shade})` : undefined,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const cubeTurn = (props?: Partial<CubeTurnProps>): TransitionPresentation<CubeTurnProps> => ({
  component: CubeTurnPresentation,
  props: { shade: 0.45, ...props },
});
