import React from "react";
import { AbsoluteFill } from "remotion";
import { STAGE_H, STAGE_W, useLayout } from "../lib/layout";
import { fonts } from "../theme";

/** Full-frame scene background. */
export const SceneBg: React.FC<{
  color: string;
  children: React.ReactNode;
}> = ({ color, children }) => (
  <AbsoluteFill style={{ background: color, overflow: "hidden", fontFamily: fonts.display }}>
    {children}
  </AbsoluteFill>
);

/**
 * The 1080 × 900 design box for a scene's visual. Children use absolute
 * coordinates inside this box; the box is placed/scaled per format.
 */
export const Stage: React.FC<{
  children: React.ReactNode;
  offsetY?: number;
  style?: React.CSSProperties;
}> = ({ children, offsetY = 0, style }) => {
  const L = useLayout();
  return (
    <div
      style={{
        position: "absolute",
        width: STAGE_W,
        height: STAGE_H,
        left: (L.width - STAGE_W) / 2,
        top: L.stageCenterY - STAGE_H / 2 + offsetY * L.stageScale,
        transform: `scale(${L.stageScale})`,
        transformOrigin: "50% 50%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
