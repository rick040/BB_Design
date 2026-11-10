import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useLayout } from "../../lib/layout";

/** Stage (1080 × 900 design box) y → frame y, matching <Stage offsetY>. */
export const useStageToFrame = (offsetY = 0) => {
  const L = useLayout();
  return {
    y: (y: number) => L.stageCenterY + (offsetY + y - 450) * L.stageScale,
    x: (x: number) => L.width / 2 + (x - 540) * L.stageScale,
    scale: L.stageScale,
  };
};

/**
 * A full-width band of sea with a moving wavy waterline. `level` is the
 * frame y of the waterline; everything below it is water. Draw a "back" layer
 * behind the scene and a "front" layer on top to put things *in* the water.
 */
export const Sea: React.FC<{
  level: number;
  color: string;
  foam?: string;
  amplitude?: number;
  wavelength?: number;
  speed?: number;
  phase?: number;
  opacity?: number;
}> = ({ level, color, foam, amplitude = 16, wavelength = 360, speed = 0.09, phase = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const steps = 36;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = level + Math.sin((x / wavelength) * Math.PI * 2 + frame * speed + phase) * amplitude;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const edge = `M${pts.join(" L")}`;
  const fill = `${edge} L${width},${height + 10} L0,${height + 10} Z`;
  return (
    <svg
      width={width}
      height={height}
      style={{ position: "absolute", left: 0, top: 0, opacity, pointerEvents: "none" }}
    >
      <path d={fill} fill={color} />
      {foam ? <path d={edge} fill="none" stroke={foam} strokeWidth={7} strokeLinecap="round" opacity={0.85} /> : null}
    </svg>
  );
};
