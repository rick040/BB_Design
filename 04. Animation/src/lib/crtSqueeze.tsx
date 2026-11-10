import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "CRT squeeze": the old scene collapses into one bright horizontal line
// (an old screen switching off) and the new scene opens out of that line.
// Plain CSS transforms, safe for headless renders.
type CrtSqueezeProps = {
  /** Colour of the line flash in the middle. */
  lineColor: string;
};

const CrtSqueezePresentation: React.FC<TransitionPresentationComponentProps<CrtSqueezeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    // First half: squeeze to a line.
    const t = Math.min(1, p * 2);
    const sy = Math.max(0.004, 1 - t);
    return (
      <AbsoluteFill style={{ transform: `scaleY(${sy})`, opacity: p < 0.5 ? 1 : 0 }}>{children}</AbsoluteFill>
    );
  }
  // Second half: open from the line.
  const t = Math.max(0, p * 2 - 1);
  const sy = Math.max(0.004, t);
  const flash = p > 0.35 && p < 0.75 ? 1 - Math.abs(p - 0.55) / 0.2 : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scaleY(${sy})`, opacity: p >= 0.5 ? 1 : 0 }}>{children}</AbsoluteFill>
      {flash > 0 ? (
        <div
          style={{
            position: "absolute",
            left: `${(1 - flash) * 30}%`,
            right: `${(1 - flash) * 30}%`,
            top: "50%",
            height: 10,
            marginTop: -5,
            borderRadius: 5,
            background: passedProps.lineColor,
            boxShadow: `0 0 40px 12px ${passedProps.lineColor}`,
            opacity: flash,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const crtSqueeze = (props?: Partial<CrtSqueezeProps>): TransitionPresentation<CrtSqueezeProps> => ({
  component: CrtSqueezePresentation,
  props: { lineColor: "#ffffff", ...props },
});
