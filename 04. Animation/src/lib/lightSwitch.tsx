import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Light switch": click, and the room is lit. The old (dark) scene dims for
// a moment, then the new scene snaps in over-exposed and settles to normal,
// like eyes adjusting to the light. Plain CSS (opacity + brightness).
type LightSwitchProps = {
  /** Over-exposure of the new scene right after the click. */
  flash: number;
  /** Progress at which the switch clicks (0..1). */
  click: number;
};

const LightSwitchPresentation: React.FC<TransitionPresentationComponentProps<LightSwitchProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const { flash, click } = passedProps;
  if (presentationDirection === "exiting") {
    const dim = p < click ? 1 - 0.4 * (p / click) : 0.6;
    return <AbsoluteFill style={{ filter: `brightness(${dim})` }}>{children}</AbsoluteFill>;
  }
  if (p < click) {
    return <AbsoluteFill style={{ opacity: 0 }}>{children}</AbsoluteFill>;
  }
  const t = (p - click) / (1 - click);
  const bright = 1 + (flash - 1) * Math.pow(1 - t, 2);
  return (
    <AbsoluteFill style={{ filter: bright > 1.01 ? `brightness(${bright})` : undefined, transform: `scale(${1.03 - 0.03 * t})` }}>
      {children}
    </AbsoluteFill>
  );
};

export const lightSwitch = (props?: Partial<LightSwitchProps>): TransitionPresentation<LightSwitchProps> => ({
  component: LightSwitchPresentation,
  props: { flash: 2.4, click: 0.35, ...props },
});
