import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Curtain": two theatre drapes close over the old scene, meet in the middle
// and open again on the new one. Plain CSS (velvet folds via a repeating
// gradient), so it renders the same everywhere.
type CurtainProps = {
  color: string;
  dark: string;
};

const CurtainPresentation: React.FC<TransitionPresentationComponentProps<CurtainProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    // The old scene stays put; the drapes are drawn by the entering side.
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const shut = 1 - Math.abs(2 * p - 1); // 0 → 1 → 0
  const eased = 1 - Math.pow(1 - shut, 2);
  const half = 50 * eased + 1; // % of the frame each drape covers (+1 overlap)
  const folds = `repeating-linear-gradient(90deg, ${passedProps.color} 0px, ${passedProps.color} 34px, ${passedProps.dark} 60px, ${passedProps.color} 86px)`;
  const drape = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    [side]: 0,
    width: `${half}%`,
    background: folds,
    boxShadow: side === "left" ? "20px 0 40px rgba(0,0,0,0.3)" : "-20px 0 40px rgba(0,0,0,0.3)",
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: p >= 0.5 ? 1 : 0 }}>{children}</AbsoluteFill>
      {shut > 0.001 ? (
        <>
          <div style={drape("left")} />
          <div style={drape("right")} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

export const curtain = (props?: Partial<CurtainProps>): TransitionPresentation<CurtainProps> => ({
  component: CurtainPresentation,
  props: { color: "#0a2bb8", dark: "#061d85", ...props },
});
