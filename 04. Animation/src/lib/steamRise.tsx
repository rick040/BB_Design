import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Steam rise": the old scene drifts upward and dissolves like steam off a
// cup, while the new scene settles in underneath. CSS only (transform,
// opacity, blur).
type SteamProps = { rise: number; blur: number };

const SteamPresentation: React.FC<TransitionPresentationComponentProps<SteamProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    // Rendered under the entering scene; the entering scene fades in, so
    // the rising, blurring old scene stays visible until mid-way.
    return (
      <AbsoluteFill
        style={{
          transform: `translateY(${-p * passedProps.rise}px) scale(${1 + 0.06 * p})`,
          filter: p > 0.01 ? `blur(${p * passedProps.blur}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, p * 1.25),
        transform: `translateY(${(1 - p) * 80}px)`,
        filter: p < 0.99 ? `blur(${(1 - p) * 10}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const steamRise = (props?: Partial<SteamProps>): TransitionPresentation<SteamProps> => ({
  component: SteamPresentation,
  props: { rise: 260, blur: 22, ...props },
});
