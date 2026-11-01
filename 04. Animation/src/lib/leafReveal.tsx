import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";

// "Leaf reveal" (concept 40): the new scene unfurls inside a growing leaf
// shape from the centre, at an angle, with a faint midrib that fades out.
// Plain CSS clip-path + SVG overlay, so it renders the same everywhere.
type LeafRevealProps = {
  /** Leaf angle in degrees (0 = horizontal). */
  angle: number;
  /** Midrib colour on the entering scene. */
  vein: string;
};

const leafPath = (cx: number, cy: number, len: number, angle: number) => {
  const w = len * 0.5;
  const a = (angle * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const pt = (x: number, y: number) => `${(cx + x * cos - y * sin).toFixed(1)},${(cy + x * sin + y * cos).toFixed(1)}`;
  const h = len / 2;
  return `M${pt(-h, 0)} C${pt(-h * 0.45, -w)} ${pt(h * 0.45, -w)} ${pt(h, 0)} C${pt(h * 0.45, w)} ${pt(-h * 0.45, w)} ${pt(-h, 0)} Z`;
};

const LeafRevealPresentation: React.FC<TransitionPresentationComponentProps<LeafRevealProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ transform: `scale(${1 + 0.05 * p})`, filter: p > 0.02 ? `brightness(${1 - 0.15 * p})` : undefined }}>
        {children}
      </AbsoluteFill>
    );
  }
  const eased = p * p * (3 - 2 * p);
  const len = eased * Math.hypot(width, height) * 2.2;
  const cx = width / 2;
  const cy = height / 2;
  const d = leafPath(cx, cy, Math.max(2, len), passedProps.angle);
  const a = (passedProps.angle * Math.PI) / 180;
  const h = len / 2;
  return (
    <AbsoluteFill style={{ clipPath: p < 0.999 ? `path('${d}')` : undefined }}>
      {children}
      {p < 0.999 ? (
        <svg width={width} height={height} style={{ position: "absolute", left: 0, top: 0 }}>
          <line
            x1={cx - h * Math.cos(a)}
            y1={cy - h * Math.sin(a)}
            x2={cx + h * Math.cos(a)}
            y2={cy + h * Math.sin(a)}
            stroke={passedProps.vein}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={0.5 * (1 - p)}
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

export const leafReveal = (props?: Partial<LeafRevealProps>): TransitionPresentation<LeafRevealProps> => ({
  component: LeafRevealPresentation,
  props: { angle: -35, vein: "#ffffff", ...props },
});
