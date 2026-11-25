import React from "react";
import { fonts } from "../theme";

export const CARDBOARD = "#e2c393";
export const CARDBOARD_DARK = "#c49e68";
export const CARDBOARD_INSIDE = "#8f6c3f";
export const INK = "#111827";

export const BOX_W = 600;
export const BOX_H = 360;

/** Back wall + dark inside of the open shoebox (drawn behind the slips). */
export const BoxBack: React.FC = () => (
  <div style={{ position: "absolute", left: 0, top: -70, width: BOX_W, height: 90 }}>
    <div
      style={{
        position: "absolute",
        left: 22,
        right: 22,
        top: 0,
        height: 90,
        background: CARDBOARD_DARK,
        borderRadius: "10px 10px 0 0",
      }}
    />
    <div style={{ position: "absolute", left: 34, right: 34, top: 14, height: 90, background: CARDBOARD_INSIDE }} />
  </div>
);

/** Front face of the box, drawn over the slips. */
export const BoxFront: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: BOX_W,
      height: BOX_H,
      background: CARDBOARD,
      borderRadius: 14,
      boxShadow: "0 30px 60px rgba(17, 24, 39, 0.18), inset 0 10px 0 rgba(255,255,255,0.25)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 170,
        top: 120,
        width: 260,
        height: 84,
        background: "#fffdf7",
        borderRadius: 8,
        transform: "rotate(-3deg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: 40,
        color: INK,
        letterSpacing: "-0.03em",
      }}
    >
      {label}
    </div>
  </div>
);

/** The lid; `close` 0 = high above the frame, 1 = shut on the box. */
export const Lid: React.FC<{ close: number }> = ({ close }) => (
  <div
    style={{
      position: "absolute",
      left: -20,
      top: -84 - (1 - close) * 1400,
      width: BOX_W + 40,
      height: 96,
      background: CARDBOARD_DARK,
      borderRadius: 12,
      boxShadow: "0 12px 30px rgba(17,24,39,0.18)",
      opacity: close > 0 ? 1 : 0,
    }}
  />
);

/** A loose bill slip in the box. */
export const Slip: React.FC<{ sender: string; amount: string }> = ({ sender, amount }) => (
  <div
    style={{
      width: 300,
      height: 180,
      background: "#ffffff",
      borderRadius: 14,
      boxShadow: "0 8px 20px rgba(17,24,39,0.15)",
      padding: "22px 24px",
      boxSizing: "border-box",
      fontFamily: fonts.ui,
    }}
  >
    <div style={{ fontSize: 26, fontWeight: 600, color: INK }}>{sender}</div>
    <div style={{ marginTop: 12, height: 12, width: 200, background: "#e8edf2", borderRadius: 6 }} />
    <div style={{ marginTop: 10, height: 12, width: 150, background: "#e8edf2", borderRadius: 6 }} />
    <div style={{ marginTop: 16, fontSize: 30, fontWeight: 600, color: "#9aa3b2" }}>{amount}</div>
  </div>
);

export const DownloadIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <path
      d="M20 6v20M11 18l9 9 9-9M8 33h24"
      fill="none"
      stroke={color}
      strokeWidth={3.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
