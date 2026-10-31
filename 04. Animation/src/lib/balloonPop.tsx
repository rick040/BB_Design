import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Balloon pop": the old scene inflates (it swells and its corners round
// off into a balloon shape), then pops with a ring of burst lines and the
// new scene is there underneath. Plain CSS + SVG, no WebGL.
type BalloonPopProps = {
  /** Progress (0..1) at which the old scene pops. */
  popAt: number;
  /** Colour of the burst lines. */
  burstColor: string;
};

const BalloonPopPresentation: React.FC<TransitionPresentationComponentProps<BalloonPopProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const { popAt, burstColor } = passedProps;

  if (presentationDirection === "entering") {
    // Underneath the old scene; settles from a small bump after the pop.
    const after = Math.max(0, (p - popAt) / (1 - popAt));
    const bump = p < popAt ? 1.04 : 1.04 - 0.04 * after;
    return <AbsoluteFill style={{ zIndex: 1, transform: `scale(${bump})` }}>{children}</AbsoluteFill>;
  }

  // Exiting: inflate, then pop.
  const t = Math.min(1, p / popAt);
  const popped = p >= popAt;
  const scale = 1 + 0.1 * t * t;
  const radius = 46 * t;
  const wobble = Math.sin(t * Math.PI * 4) * 1.2 * t;
  const burst = popped ? Math.min(1, (p - popAt) / (1 - popAt)) : 0;
  const n = 14;

  return (
    <AbsoluteFill style={{ zIndex: 2, pointerEvents: "none" }}>
      {!popped ? (
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) rotate(${wobble}deg)`,
            borderRadius: `${radius}%`,
            overflow: "hidden",
          }}
        >
          {children}
        </AbsoluteFill>
      ) : (
        <svg viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {Array.from({ length: n }).map((_, i) => {
            const a = (i / n) * Math.PI * 2 + 0.15;
            const r0 = 30 + 60 * burst;
            const len = 18 * (1 - burst);
            return (
              <line
                key={i}
                x1={Math.cos(a) * r0}
                y1={Math.sin(a) * r0}
                x2={Math.cos(a) * (r0 + len)}
                y2={Math.sin(a) * (r0 + len)}
                stroke={burstColor}
                strokeWidth={4.5}
                strokeLinecap="round"
                opacity={1 - burst}
              />
            );
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const balloonPop = (props?: Partial<BalloonPopProps>): TransitionPresentation<BalloonPopProps> => ({
  component: BalloonPopPresentation,
  props: { popAt: 0.5, burstColor: "#ffffff", ...props },
});
