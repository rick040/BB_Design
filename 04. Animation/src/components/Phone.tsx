import React from "react";

// A simple phone frame: rounded body, screen and a pill-shaped camera.
// Children are drawn inside the screen (absolute coordinates, clipped).
export const PHONE_BEZEL = 16;

export const Phone: React.FC<{
  width: number;
  height: number;
  frame?: string;
  screen?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, frame = "#0b1640", screen = "#ffffff", children, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: width * 0.14,
      background: frame,
      padding: PHONE_BEZEL,
      boxSizing: "border-box",
      boxShadow: "0 40px 90px rgba(1, 30, 140, 0.28)",
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: width * 0.14 - PHONE_BEZEL,
        background: screen,
        overflow: "hidden",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 14,
          width: width * 0.28,
          height: 30,
          marginLeft: -width * 0.14,
          borderRadius: 15,
          background: frame,
          zIndex: 100,
        }}
      />
    </div>
  </div>
);
