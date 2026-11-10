import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Needle sweep": a tuning needle slides across the frame like the needle
// on a radio dial; behind it the new scene is revealed. Plain CSS
// (clip-path + a coloured bar), so it renders the same everywhere.
type NeedleSweepProps = {
  direction: "from-left" | "from-right";
  color: string;
  /** Needle width in px. */
  width: number;
};

const NeedleSweepPresentation: React.FC<TransitionPresentationComponentProps<NeedleSweepProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const fromLeft = passedProps.direction === "from-left";
  if (presentationDirection === "exiting") {
    // Old scene shivers a little, like a station drifting away.
    return <AbsoluteFill style={{ transform: `translateX(${Math.sin(p * 40) * 6 * p}px)` }}>{children}</AbsoluteFill>;
  }
  const pct = p * 100;
  const clip = fromLeft ? `inset(0 ${100 - pct}% 0 0)` : `inset(0 0 0 ${100 - pct}%)`;
  const visible = p > 0.001 && p < 0.999;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
      {visible ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: passedProps.width,
            left: fromLeft ? `calc(${pct}% - ${passedProps.width / 2}px)` : `calc(${100 - pct}% - ${passedProps.width / 2}px)`,
            background: passedProps.color,
            boxShadow: `0 0 40px ${passedProps.color}`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const needleSweep = (props?: Partial<NeedleSweepProps>): TransitionPresentation<NeedleSweepProps> => ({
  component: NeedleSweepPresentation,
  props: { direction: "from-left", color: "#ff5a79", width: 22, ...props },
});
