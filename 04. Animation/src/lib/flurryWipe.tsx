import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Flurry wipe": the new scene appears through falling snowflakes. Two
// offset grids of round holes grow (and drift down) until they cover the
// frame. CSS mask only, so it renders the same headless.
type FlurryProps = { cell: number };

const FlurryPresentation: React.FC<TransitionPresentationComponentProps<FlurryProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const c = passedProps.cell;
  if (p >= 0.999) return <AbsoluteFill>{children}</AbsoluteFill>;
  const rad = p * c * 0.75;
  const fall = p * c * 2.5;
  const g = `radial-gradient(circle, #000 ${rad}px, transparent ${rad + 1}px)`;
  const mask = `${g}, ${g}`;
  const pos = `0px ${fall}px, ${c / 2}px ${fall * 1.3 + c / 2}px`;
  return (
    <AbsoluteFill
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: `${c}px ${c}px`,
        maskSize: `${c}px ${c}px`,
        WebkitMaskPosition: pos,
        maskPosition: pos,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const flurryWipe = (props?: Partial<FlurryProps>): TransitionPresentation<FlurryProps> => ({
  component: FlurryPresentation,
  props: { cell: 110, ...props },
});
