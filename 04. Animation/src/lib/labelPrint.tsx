import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";

// "Label print": a strip of label tape prints across the middle of the frame
// (left to right, zigzag cut at the front), then opens up top and bottom and
// becomes the next scene. CSS clip-path only.
type LabelPrintProps = {
  tape: string;
  /** Height of the tape strip as a fraction of the frame height. */
  band: number;
};

const ease = Easing.inOut(Easing.cubic);

const LabelPrintPresentation: React.FC<TransitionPresentationComponentProps<LabelPrintProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width: W, height: H } = useVideoConfig();
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ zIndex: 0 }}>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const band = H * passedProps.band;
  const run = ease(Math.min(1, p / 0.5));
  const open = ease(Math.max(0, (p - 0.5) / 0.5));
  const h = band + (H - band) * open;
  const top = (H - h) / 2;
  const bottom = top + h;
  // Front edge of the tape with a zigzag cut.
  const tooth = 18;
  const x = -tooth * 2 + (W + tooth * 4) * run;
  const pts: string[] = [`0px ${top}px`, `${x}px ${top}px`];
  const steps = Math.max(2, Math.round(h / (tooth * 2)));
  for (let i = 1; i <= steps; i++) {
    const y = top + (h * i) / steps;
    const xx = i % 2 === 1 ? x + tooth : x;
    pts.push(`${xx}px ${y}px`);
  }
  pts.push(`0px ${bottom}px`);
  const tapeOpacity = interpolate(p, [0.5, 0.72], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ zIndex: 1, clipPath: `polygon(${pts.join(", ")})` }}>
      {children}
      {tapeOpacity > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top,
            height: h,
            background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 26%, rgba(0,0,0,0) 74%, rgba(0,0,0,0.1) 100%), ${passedProps.tape}`,
            opacity: tapeOpacity,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

export const labelPrint = (props?: Partial<LabelPrintProps>): TransitionPresentation<LabelPrintProps> => ({
  component: LabelPrintPresentation,
  props: { tape: "#ffce31", band: 0.13, ...props },
});
