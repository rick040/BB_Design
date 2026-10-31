import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Float away": the old scene is carried up and out of frame by balloon
// strings, swaying a little, and reveals the new scene underneath.
// Plain CSS + SVG, no WebGL.
type FloatAwayProps = {
  /** Colour of the strings that lift the scene. */
  stringColor: string;
  /** Maximum sway in degrees. */
  sway: number;
};

const FloatAwayPresentation: React.FC<TransitionPresentationComponentProps<FloatAwayProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "entering") {
    return <AbsoluteFill style={{ zIndex: 1, transform: `scale(${1.03 - 0.03 * p})` }}>{children}</AbsoluteFill>;
  }
  // Ease in: a small lift first, then it rises away.
  const rise = p * p * (3 - 2 * p);
  const rot = Math.sin(p * Math.PI * 2) * passedProps.sway * (1 - p * 0.5);
  return (
    <AbsoluteFill
      style={{
        zIndex: 2,
        overflow: "visible",
        transform: `translateY(${-112 * rise}%) rotate(${rot}deg)`,
        transformOrigin: "50% 0%",
        boxShadow: "0 40px 80px rgba(0, 0, 0, 0.18)",
      }}
    >
      {children}
      {/* strings from the top edge up to balloons out of frame */}
      <svg style={{ position: "absolute", left: 0, top: "-60%", width: "100%", height: "60%", overflow: "visible" }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {[22, 50, 78].map((x, i) => (
          <path
            key={i}
            d={`M ${x} 100 Q ${x + (i - 1) * 6} 50 ${50 + (i - 1) * 8} 0`}
            fill="none"
            stroke={passedProps.stringColor}
            strokeWidth={0.5}
            vectorEffect="non-scaling-stroke"
            style={{ strokeWidth: 5 }}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const floatAway = (props?: Partial<FloatAwayProps>): TransitionPresentation<FloatAwayProps> => ({
  component: FloatAwayPresentation,
  props: { stringColor: "#b6c7ff", sway: 2.5, ...props },
});
