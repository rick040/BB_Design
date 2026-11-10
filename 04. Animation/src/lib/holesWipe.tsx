import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Holes wipe": the new scene shows through a grid of round holes (like the
// mesh of a sieve) that grow until they cover the frame. Plain CSS mask, so
// it renders the same everywhere, unlike the WebGL presentations.
type HolesWipeProps = {
  /** Distance between hole centres in px. */
  cell: number;
};

const HolesWipePresentation: React.FC<TransitionPresentationComponentProps<HolesWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const c = passedProps.cell;
  // At r = c / sqrt(2) the circles touch the cell corners: fully covered.
  const r = presentationProgress * c * 0.72 + 0.01;
  const mask = `radial-gradient(circle at ${c / 2}px ${c / 2}px, #000 ${r}px, transparent ${r + 1}px)`;
  const style: React.CSSProperties = {
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskSize: `${c}px ${c}px`,
    maskSize: `${c}px ${c}px`,
    WebkitMaskRepeat: "repeat",
    maskRepeat: "repeat",
  };
  return <AbsoluteFill style={presentationProgress >= 0.999 ? undefined : style}>{children}</AbsoluteFill>;
};

export const holesWipe = (props?: Partial<HolesWipeProps>): TransitionPresentation<HolesWipeProps> => ({
  component: HolesWipePresentation,
  props: { cell: 120, ...props },
});
