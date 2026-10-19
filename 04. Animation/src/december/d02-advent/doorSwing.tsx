import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// "Deurtje open": de oude scène zwaait als een deur open (scharnier links)
// en laat de nieuwe scène erachter zien. Alleen CSS (3D-transform + filter).
type Props = { degrees: number };

const DoorSwingPresentation: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = presentationProgress;
  if (presentationDirection === "entering") {
    return <AbsoluteFill style={{ zIndex: 1 }}>{children}</AbsoluteFill>;
  }
  const ease = p;
  return (
    <AbsoluteFill style={{ zIndex: 2, perspective: 1600, perspectiveOrigin: "0% 50%" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0% 50%",
          transform: `rotateY(${-ease * passedProps.degrees}deg)`,
          backfaceVisibility: "hidden",
          filter: `brightness(${1 - ease * 0.22})`,
          boxShadow: "30px 0 80px rgba(0, 20, 120, 0.25)",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const doorSwing = (props?: Partial<Props>): TransitionPresentation<Props> => ({
  component: DoorSwingPresentation,
  props: { degrees: 108, ...props },
});
