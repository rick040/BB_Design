import React from "react";

/** Small notification bell (same shape as the one in concept 62). */
export const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block" }}>
    <path d="M16 4c-5 0-8 3.6-8 8.5V18l-3 4h22l-3-4v-5.5C24 7.6 21 4 16 4Z" fill={color} />
    <circle cx="16" cy="26" r="3" fill={color} />
  </svg>
);

/** Yellow round badge with a bell: "een seintje" on a calendar day. */
export const BellBadge: React.FC<{
  size: number;
  bg: string;
  fg: string;
  /** Ring angle in degrees (wiggle). */
  ring?: number;
  style?: React.CSSProperties;
}> = ({ size, bg, fg, ring = 0, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 16px rgba(0, 20, 120, 0.25)",
      ...style,
    }}
  >
    <div style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
      <Bell size={size * 0.62} color={fg} />
    </div>
  </div>
);
