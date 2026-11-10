import React from "react";
import { fonts } from "../../theme";

export const ROW_W = 830;
export const ROW_H = 150;

/** A compact mail row (sender + subject) used inside the static. */
export const MailRow: React.FC<{
  from: string;
  subject: string;
  bg: string;
  ink: string;
  dot: string;
  style?: React.CSSProperties;
}> = ({ from, subject, bg, ink, dot, style }) => (
  <div
    style={{
      position: "absolute",
      width: ROW_W,
      height: ROW_H,
      borderRadius: 30,
      background: bg,
      display: "flex",
      alignItems: "center",
      gap: 26,
      padding: "0 34px",
      boxSizing: "border-box",
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      ...style,
    }}
  >
    <div style={{ width: 72, height: 72, borderRadius: 36, background: dot, flexShrink: 0 }} />
    <div style={{ fontFamily: fonts.ui, color: ink, minWidth: 0 }}>
      <div style={{ fontWeight: 600, fontSize: 42, lineHeight: 1.15 }}>{from}</div>
      <div style={{ fontWeight: 400, fontSize: 35, opacity: 0.6, whiteSpace: "nowrap" }}>{subject}</div>
    </div>
  </div>
);
