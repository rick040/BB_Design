import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Nav tilt": like a navigation camera that tilts into 3D view. The old scene
// tips backwards and drives away up the screen; the new one rises flat from
// below. Plain CSS 3D transforms (perspective + rotateX), no WebGL.
type NavTiltProps = {
  /** Maximum tilt of the outgoing scene, in degrees. */
  tilt: number;
};

const NavTiltPresentation: React.FC<TransitionPresentationComponentProps<NavTiltProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  const entering = presentationDirection === "entering";
  const style: React.CSSProperties = entering
    ? {
        transform: `perspective(1800px) translateY(${(1 - p) * 60}%) rotateX(${(1 - p) * -passedProps.tilt * 0.5}deg)`,
        transformOrigin: "50% 0%",
      }
    : {
        transform: `perspective(1800px) rotateX(${p * passedProps.tilt}deg) translateY(${-p * 30}%) scale(${1 - 0.15 * p})`,
        transformOrigin: "50% 100%",
        opacity: 1 - p * 0.6,
      };
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const navTilt = (props?: Partial<NavTiltProps>): TransitionPresentation<NavTiltProps> => ({
  component: NavTiltPresentation,
  props: { tilt: 55, ...props },
});
