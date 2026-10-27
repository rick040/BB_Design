import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Sheet drop": the new scene falls over the old one like a ghost sheet,
// its hem wavy. A clip-path whose bottom edge is a wave moves down the
// frame; the wave ripples while it falls. Plain CSS.
type SheetDropProps = {
  /** Number of waves along the hem. */
  waves: number;
  /** Wave height in % of the frame height. */
  amp: number;
};

const SheetDropPresentation: React.FC<TransitionPresentationComponentProps<SheetDropProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const p = presentationProgress;
  const { waves, amp } = passedProps;
  // Hem travels from above the frame to below it (amplitude included).
  const base = -amp + p * (100 + 2 * amp);
  const steps = waves * 8;
  const pts: string[] = ["0% 0%", "100% 0%"];
  for (let i = 0; i <= steps; i++) {
    const x = 100 - (i / steps) * 100;
    const y = base + amp * Math.sin((i / steps) * waves * Math.PI * 2 + p * 9);
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return (
    <AbsoluteFill style={{ clipPath: `polygon(${pts.join(", ")})` }}>{children}</AbsoluteFill>
  );
};

export const sheetDrop = (props?: Partial<SheetDropProps>): TransitionPresentation<SheetDropProps> => ({
  component: SheetDropPresentation,
  props: { waves: 4, amp: 3, ...props },
});
