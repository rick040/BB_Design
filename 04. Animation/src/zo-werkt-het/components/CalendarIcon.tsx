import React from "react";
import { fonts } from "../../theme";

/** Generic calendar-app icon (no brand): white tile, blue band, day number. */
export const CalendarIcon: React.FC<{ size: number; day: string; band: string; ink: string }> = ({
  size,
  day,
  band,
  ink,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: "#fff",
      boxShadow: "0 0 0 2px rgba(0,0,0,0.06)",
      overflow: "hidden",
      flexShrink: 0,
      fontFamily: fonts.ui,
    }}
  >
    <div style={{ height: size * 0.28, background: band }} />
    <div
      style={{
        height: size * 0.72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
        fontWeight: 600,
        color: ink,
      }}
    >
      {day}
    </div>
  </div>
);
