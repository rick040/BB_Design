import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Peeling, type PeelCorner } from "./peel";

// "Sticker peel": the old scene is a sticker that gets pulled off from one
// corner. The fold sweeps diagonally over the frame, the backing paper shows
// on the flap, and the new scene lies underneath. CSS clip-path + SVG only.
type StickerPeelProps = {
  corner: PeelCorner;
  /** Angle of the peel direction in degrees (0 = horizontal). */
  angle: number;
  backing: string;
};

const StickerPeelPresentation: React.FC<TransitionPresentationComponentProps<StickerPeelProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const { width, height } = useVideoConfig();
  if (presentationDirection === "entering") {
    // Underneath: a faint shadow lifts off as the sticker goes.
    const shade = (1 - presentationProgress) * 0.18;
    return (
      <AbsoluteFill style={{ zIndex: 0 }}>
        {children}
        <AbsoluteFill style={{ background: `rgba(0, 10, 60, ${shade})`, pointerEvents: "none" }} />
      </AbsoluteFill>
    );
  }
  // Ease in a little so the corner "grabs" before it rips.
  const p = Math.pow(presentationProgress, 1.25);
  return (
    <AbsoluteFill style={{ zIndex: 1 }}>
      <Peeling
        w={width}
        h={height}
        progress={p}
        corner={passedProps.corner}
        angle={passedProps.angle}
        backing={passedProps.backing}
        shadow={0.4}
      >
        <AbsoluteFill>{children}</AbsoluteFill>
      </Peeling>
    </AbsoluteFill>
  );
};

export const stickerPeel = (props?: Partial<StickerPeelProps>): TransitionPresentation<StickerPeelProps> => ({
  component: StickerPeelPresentation,
  props: { corner: "br", angle: 34, backing: "#f3f1ea", ...props },
});
