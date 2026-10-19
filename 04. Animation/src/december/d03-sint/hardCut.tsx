import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";

// Harde wissel: op het midden van de overgang springt het beeld naar de volgende
// scène, zonder fade of beweging ("harde wissel naar een telefoon").
const HardCutPresentation: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const visible = presentationDirection === "entering" ? presentationProgress >= 0.5 : presentationProgress < 0.5;
  return <AbsoluteFill style={{ opacity: visible ? 1 : 0 }}>{children}</AbsoluteFill>;
};

export const hardCut = (): TransitionPresentation<Record<string, never>> => ({
  component: HardCutPresentation,
  props: {},
});
