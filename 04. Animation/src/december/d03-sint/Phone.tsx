import React from "react";

export const PHONE_W = 560;
export const PHONE_H = 800;

/** Vlakke telefoon met schermvak (inhoud in schermcoördinaten, 492 × 772). */
export const Phone: React.FC<{
  bezel: string;
  screen: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ bezel, screen, children, style }) => (
  <div
    style={{
      position: "absolute",
      width: PHONE_W,
      height: PHONE_H,
      borderRadius: 78,
      background: bezel,
      boxShadow: "0 40px 100px rgba(1, 20, 120, 0.3)",
      padding: 14,
      boxSizing: "border-box",
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 64,
        background: screen,
        overflow: "hidden",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: "50%",
          marginLeft: -62,
          width: 124,
          height: 32,
          borderRadius: 16,
          background: bezel,
        }}
      />
    </div>
  </div>
);
