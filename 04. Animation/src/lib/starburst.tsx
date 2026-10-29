import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Starburst": the new scene bursts open through a growing, slowly turning
// star, like the price stickers of a TV-shop commercial. Plain CSS
// (clip-path polygon), so it renders the same everywhere.
type StarburstProps = {
  /** Number of star points. */
  points: number;
  /** Outer radius / inner radius. */
  spike: number;
  /** Degrees the star turns while it grows. */
  turn: number;
};

/** Star polygon in % of the element (centre 50/50). */
export const starPolygon = (inner: number, spike: number, points: number, rotDeg = 0) => {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? inner * spike : inner;
    const a = ((i / (points * 2)) * 360 + rotDeg) * (Math.PI / 180);
    pts.push(`${(50 + Math.cos(a) * r).toFixed(2)}% ${(50 + Math.sin(a) * r).toFixed(2)}%`);
  }
  return `polygon(${pts.join(", ")})`;
};

const StarburstPresentation: React.FC<TransitionPresentationComponentProps<StarburstProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * p})` }}>{children}</AbsoluteFill>;
  }
  // inner radius in %: at ~96 % even the corners of a 9:16 frame are covered.
  const inner = p * 96;
  const clip = p >= 0.999 ? undefined : starPolygon(inner, passedProps.spike, passedProps.points, p * passedProps.turn);
  return (
    <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>
      {children}
    </AbsoluteFill>
  );
};

export const starburst = (props?: Partial<StarburstProps>): TransitionPresentation<StarburstProps> => ({
  component: StarburstPresentation,
  props: { points: 14, spike: 1.35, turn: 40, ...props },
});
