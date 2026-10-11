import React from "react";
import { fonts } from "../theme";

// The "betaalbuddy" wordmark as used at the bottom of the ads:
// Space Grotesk Bold, tight tracking, "betaal" soft blue + "buddy" solid.
export const Wordmark: React.FC<{
  size: number;
  betaal: string;
  buddy: string;
  style?: React.CSSProperties;
}> = ({ size, betaal, buddy, style }) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "-0.06em",
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <span style={{ color: betaal }}>betaal</span>
    <span style={{ color: buddy }}>buddy</span>
  </div>
);
