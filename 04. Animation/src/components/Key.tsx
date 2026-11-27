import React from "react";

/** A plain house key (ring, shaft, teeth), drawn horizontally. */
export const Key: React.FC<{ width: number; color: string; hole?: string; style?: React.CSSProperties }> = ({
  width,
  color,
  hole = "#fff",
  style,
}) => (
  <svg width={width} height={width * 0.42} viewBox="0 0 100 42" style={{ display: "block", overflow: "visible", ...style }}>
    <circle cx="20" cy="21" r="19" fill={color} />
    <circle cx="14" cy="21" r="6" fill={hole} />
    <rect x="34" y="16" width="64" height="10" rx="3" fill={color} />
    <rect x="76" y="24" width="7" height="12" rx="2" fill={color} />
    <rect x="88" y="24" width="7" height="9" rx="2" fill={color} />
  </svg>
);
