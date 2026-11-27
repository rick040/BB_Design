import React from "react";

// A plain envelope icon (no text, no logo): stands for "a letter arrives"
// without imitating a real reminder letter.
export const Envelope: React.FC<{ width: number; paper: string; line: string; style?: React.CSSProperties }> = ({
  width,
  paper,
  line,
  style,
}) => (
  <svg width={width} height={width * 0.68} viewBox="0 0 100 68" style={{ display: "block", overflow: "visible", ...style }}>
    <rect x="2" y="2" width="96" height="64" rx="8" fill={paper} stroke={line} strokeWidth="3.5" />
    <path d="M4 6 L50 40 L96 6" fill="none" stroke={line} strokeWidth="3.5" strokeLinejoin="round" />
  </svg>
);
