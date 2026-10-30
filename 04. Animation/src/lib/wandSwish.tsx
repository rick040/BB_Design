import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Wand swish": the new scene is revealed behind a diagonal edge that sweeps
// from bottom-left to top-right, with a trail of sparkles riding the edge,
// as if a magic wand wipes the frame. Plain CSS (clip-path), no WebGL.
type WandSwishProps = {
  sparkle: string;
};

const STAR = "M0 -50 Q 7 -7 50 0 Q 7 7 0 50 Q -7 7 -50 0 Q -7 -7 0 -50 Z";

const WandSwishPresentation: React.FC<TransitionPresentationComponentProps<WandSwishProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  // The edge is the line x + y = d (in % of the frame), d runs 0 → 200.
  const d = p * 210 - 5;
  // Polygon of everything with x + (100 - y) <= d.
  const pts: string[] = [];
  const corners: Array<[number, number]> = [
    [0, 100],
    [100, 100],
    [100, 0],
    [0, 0],
  ];
  const inside = ([x, y]: [number, number]) => x + (100 - y) <= d;
  for (let i = 0; i < 4; i++) {
    const a = corners[i];
    const b = corners[(i + 1) % 4];
    if (inside(a)) pts.push(`${a[0]}% ${a[1]}%`);
    const fa = a[0] + (100 - a[1]) - d;
    const fb = b[0] + (100 - b[1]) - d;
    if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) {
      const t = fa / (fa - fb);
      pts.push(`${a[0] + (b[0] - a[0]) * t}% ${a[1] + (b[1] - a[1]) * t}%`);
    }
  }
  const polygon = pts.length >= 3 ? `polygon(${pts.join(", ")})` : "polygon(0 0, 0 0, 0 0)";

  // Sparkles along the edge.
  const stars = [0.1, 0.27, 0.44, 0.61, 0.78, 0.92];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: polygon }}>{children}</AbsoluteFill>
      {p > 0.02 && p < 0.98 ? (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          {stars.map((s, i) => {
            // point on the edge line: x + (100 - y) = d
            const x = -10 + s * 120;
            const y = 100 - (d - x);
            if (y < -5 || y > 105) return null;
            const size = 0.07 + (i % 2) * 0.04;
            return (
              <path
                key={i}
                d={STAR}
                transform={`translate(${x} ${y}) scale(${size} ${size * 0.56})`}
                fill={passedProps.sparkle}
              />
            );
          })}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

export const wandSwish = (props?: Partial<WandSwishProps>): TransitionPresentation<WandSwishProps> => ({
  component: WandSwishPresentation,
  props: { sparkle: "#ffce31", ...props },
});
