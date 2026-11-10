import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Broom sweep": the new scene is swept in behind a slanted edge with a
// bristle (zigzag) fringe, like one stroke of a broom. Plain CSS clip-path,
// so it renders the same everywhere.
type BroomSweepProps = {
  /** "from-left" or "from-right". */
  direction: "from-left" | "from-right";
  /** Bristle colour drawn along the moving edge. */
  bristle: string;
};

const TEETH = 26;

const BroomSweepPresentation: React.FC<TransitionPresentationComponentProps<BroomSweepProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width: W, height: H } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const slant = W * 0.28;
  const amp = 34;
  const span = W + slant + amp * 2;
  const lead = -slant - amp + span * p; // edge x at the top
  const pts: string[] = [];
  const edge: string[] = [];
  for (let i = 0; i <= TEETH; i++) {
    const t = i / TEETH;
    const y = H * t;
    const x = lead + slant * t + (i % 2 === 0 ? 0 : amp);
    edge.push(`${x}px ${y}px`);
  }
  const mirror = (s: string) => {
    const [x, y] = s.split(" ").map((v) => parseFloat(v));
    return `${W - x}px ${y}px`;
  };
  const left = passedProps.direction === "from-left";
  if (left) {
    pts.push(`0px 0px`, ...edge, `0px ${H}px`);
  } else {
    pts.push(`${W}px 0px`, ...edge.map(mirror), `${W}px ${H}px`);
  }
  // Bristle band just ahead of the clip edge.
  const band: string[] = [];
  const bandW = 26;
  const e2 = edge.map((s) => {
    const [x, y] = s.split(" ").map((v) => parseFloat(v));
    return `${x + bandW}px ${y}px`;
  });
  band.push(...edge, ...e2.reverse());
  const bandPts = left ? band : band.map(mirror);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `polygon(${pts.join(",")})` }}>{children}</AbsoluteFill>
      {p > 0.001 && p < 0.999 ? (
        <AbsoluteFill style={{ clipPath: `polygon(${bandPts.join(",")})`, background: passedProps.bristle }} />
      ) : null}
    </AbsoluteFill>
  );
};

export const broomSweep = (props?: Partial<BroomSweepProps>): TransitionPresentation<BroomSweepProps> => ({
  component: BroomSweepPresentation,
  props: { direction: "from-left", bristle: "#ffce31", ...props },
});
