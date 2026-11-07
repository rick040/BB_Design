import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Cloth wipe": the new scene is pulled over the old one like a handkerchief,
// with a soft, waving edge. Plain CSS clip-path (no WebGL), so headless
// renders look the same everywhere. Made for concept 50 (zakdoek).
type ClothWipeProps = {
  direction: "up" | "down" | "left" | "right";
  /** Wave height of the cloth edge in px. */
  amp: number;
  /** Number of waves across the edge. */
  waves: number;
};

const ClothWipePresentation: React.FC<TransitionPresentationComponentProps<ClothWipeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  const { direction, amp, waves } = passedProps;
  // Springs crawl towards 1; speed up the tail so no sliver of the old
  // scene stays visible at the end.
  const p = Math.min(1, presentationProgress * 1.08);

  if (presentationDirection === "exiting") {
    // The old scene just sinks back a touch under the cloth.
    return (
      <AbsoluteFill style={{ transform: `scale(${1 - 0.04 * p})`, filter: `brightness(${1 - 0.12 * p})` }}>
        {children}
      </AbsoluteFill>
    );
  }

  const vertical = direction === "up" || direction === "down";
  const span = vertical ? height : width; // distance the edge travels
  const across = vertical ? width : height; // length of the edge
  const travel = (span + amp * 2) * p - amp; // covered depth in px
  const phase = p * Math.PI * 3;
  const N = 36;
  const edge: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const a = (across * i) / N;
    // The wave is larger mid-way (cloth flutters), flat at the end.
    const w = amp * Math.sin(Math.PI * Math.min(1, p * 1.15)) * Math.sin((i / N) * Math.PI * 2 * waves + phase);
    edge.push([a, travel + w]);
  }
  const pts = edge.map(([a, d]) => {
    switch (direction) {
      case "up":
        return `${a}px ${height - d}px`;
      case "down":
        return `${a}px ${d}px`;
      case "left":
        return `${width - d}px ${a}px`;
      default:
        return `${d}px ${a}px`;
    }
  });
  const closing =
    direction === "up"
      ? [`${width}px ${height}px`, `0px ${height}px`]
      : direction === "down"
        ? [`${width}px 0px`, `0px 0px`]
        : direction === "left"
          ? [`${width}px ${height}px`, `${width}px 0px`]
          : [`0px ${height}px`, `0px 0px`];
  const clip = p >= 0.999 ? undefined : `polygon(${[...pts, ...closing].join(", ")})`;

  return <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>;
};

export const clothWipe = (props?: Partial<ClothWipeProps>): TransitionPresentation<ClothWipeProps> => ({
  component: ClothWipePresentation,
  props: { direction: "up", amp: 70, waves: 1.5, ...props },
});
