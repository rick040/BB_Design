import React from "react";

/** A thick checkmark that draws itself as `progress` goes 0 → 1. */
export const Checkmark: React.FC<{
  size: number;
  color: string;
  progress: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({ size, color, progress, strokeWidth = 14, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <path
      d="M14 54 L39 78 L88 22"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
    />
  </svg>
);
