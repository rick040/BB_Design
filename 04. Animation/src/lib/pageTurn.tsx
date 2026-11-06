import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Page turn": the old scene turns over like a page around its left edge
// and reveals the new scene underneath. Plain CSS 3D (rotateY + perspective
// + a shade), so it renders the same everywhere, unlike WebGL presentations.
type PageTurnProps = {
  /** CSS perspective in px; lower = stronger 3D. */
  perspective: number;
  /** Max darkness of the shade on the turning page and the page below (0..1). */
  shade: number;
};

const PageTurnPresentation: React.FC<TransitionPresentationComponentProps<PageTurnProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "entering") {
    // New scene lies underneath; it gets lighter as the page lifts off.
    return (
      <AbsoluteFill>
        {children}
        <AbsoluteFill style={{ background: "#000", opacity: (1 - p) * passedProps.shade * 0.8, pointerEvents: "none" }} />
      </AbsoluteFill>
    );
  }
  // Old scene: turns around its left edge, in front of the new one.
  const deg = -100 * p;
  return (
    <AbsoluteFill style={{ zIndex: 2, perspective: passedProps.perspective, perspectiveOrigin: "0% 50%" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0% 50%",
          transform: `rotateY(${deg}deg)`,
          backfaceVisibility: "hidden",
          opacity: p > 0.92 ? (1 - p) / 0.08 : 1,
        }}
      >
        {children}
        <AbsoluteFill
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0) 30%, rgba(0,0,0,1) 100%)",
            opacity: Math.sin(Math.min(1, p * 1.2) * Math.PI * 0.5) * passedProps.shade,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const pageTurn = (props?: Partial<PageTurnProps>): TransitionPresentation<PageTurnProps> => ({
  component: PageTurnPresentation,
  props: { perspective: 2400, shade: 0.35, ...props },
});
