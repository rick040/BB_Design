import React from "react";
import { BUDDY_VIEWBOX } from "./Buddy";

// A sleep mask for Buddy, drawn in his own viewBox and passed through the
// `accessory` prop of <Buddy>, so it is clipped to his outline and follows
// squash & stretch. `lift` 0 = over the eyes ("I'm not looking"),
// 1 = pushed up onto his head (eyes free).
const BAND_TOP = 34;
const BAND_H = 138;
const LIFT_PX = 118;

export const SleepMask: React.FC<{
  lift: number;
  color: string;
  lineColor: string;
}> = ({ lift, color, lineColor }) => {
  const { width, eyes } = BUDDY_VIEWBOX;
  const y = -lift * LIFT_PX;
  return (
    <g transform={`translate(0 ${y})`}>
      <rect x={-20} y={BAND_TOP} width={width + 40} height={BAND_H} fill={color} />
      {/* Soft top highlight so it reads as fabric, not a stripe of paint. */}
      <rect x={-20} y={BAND_TOP} width={width + 40} height={10} fill={lineColor} opacity={0.18} />
      {/* Drawn closed eyes with lashes: the classic sleep-mask print. */}
      {eyes.map((e, i) => {
        const cy = e.cy + 8;
        return (
          <g key={i} fill="none" stroke={lineColor} strokeWidth={11} strokeLinecap="round">
            <path d={`M ${e.cx - 34} ${cy} Q ${e.cx} ${cy + 34} ${e.cx + 34} ${cy}`} />
            <path d={`M ${e.cx - 22} ${cy + 18} l -10 16`} />
            <path d={`M ${e.cx} ${cy + 25} l 0 18`} />
            <path d={`M ${e.cx + 22} ${cy + 18} l 10 16`} />
          </g>
        );
      })}
    </g>
  );
};
