import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, random } from "remotion";

// "Static wipe": the new scene is revealed behind a band of TV static that
// sweeps over the frame, like tuning past a station. Plain CSS (clip-path +
// gradients), so it renders the same everywhere, unlike the WebGL presentations.
type StaticWipeProps = {
  /** "down" sweeps top to bottom, "up" bottom to top. */
  direction: "down" | "up";
  /** Height of the static band as a fraction of the frame. */
  band: number;
};

const StaticWipePresentation: React.FC<TransitionPresentationComponentProps<StaticWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const { direction, band } = passedProps;
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  // Edge position travels from -band to 1 + band so the band fully passes.
  const edge = -band + p * (1 + 2 * band);
  const revealed = Math.max(0, Math.min(1, edge)) * 100;
  const clip = direction === "down" ? `inset(0 0 ${100 - revealed}% 0)` : `inset(${100 - revealed}% 0 0 0)`;
  const bandTop = direction === "down" ? edge - band : 1 - edge;
  // Stripes jump every step of progress, like real static.
  const step = Math.floor(p * 40);
  const o1 = Math.floor(random(`sw-a-${step}`) * 40);
  const o2 = Math.floor(random(`sw-b-${step}`) * 23);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
      {p > 0 && p < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${bandTop * 100}%`,
            height: `${band * 100}%`,
            backgroundColor: "#c9d3ff",
            backgroundImage: [
              `repeating-linear-gradient(0deg, rgba(1,59,255,0.55) 0px, rgba(1,59,255,0.55) 3px, transparent 3px, transparent ${7 + (o2 % 5)}px)`,
              `repeating-linear-gradient(90deg, rgba(255,255,255,0.9) 0px, rgba(255,255,255,0.9) ${2 + (o1 % 4)}px, transparent ${2 + (o1 % 4)}px, transparent ${11 + (o2 % 7)}px)`,
              `repeating-linear-gradient(90deg, rgba(17,17,20,0.35) 0px, rgba(17,17,20,0.35) 2px, transparent 2px, transparent ${17 + (o1 % 9)}px)`,
            ].join(","),
            backgroundPosition: `${o1}px ${o2}px, ${o2 * 3}px 0px, ${o1 * 2}px 0px`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const staticWipe = (props?: Partial<StaticWipeProps>): TransitionPresentation<StaticWipeProps> => ({
  component: StaticWipePresentation,
  props: { direction: "down", band: 0.16, ...props },
});
