import React from "react";
import { fonts } from "../../theme";

export const Chip: React.FC<{ text: string; bg: string; color: string; style?: React.CSSProperties }> = ({ text, bg, color, style }) => (
  <div
    style={{
      position: "absolute",
      fontFamily: fonts.ui,
      fontWeight: 700,
      fontSize: 40,
      letterSpacing: "0.02em",
      color,
      background: bg,
      padding: "12px 34px",
      borderRadius: 40,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);
