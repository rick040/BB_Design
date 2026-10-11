import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const MAIL_W = 470;
export const MAIL_H = 124;

const Eye: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block" }}>
    <path
      d="M3 16c3.4-5.6 7.8-8.4 13-8.4S25.6 10.4 29 16c-3.4 5.6-7.8 8.4-13 8.4S6.4 21.6 3 16Z"
      fill="none"
      stroke="#fff"
      strokeWidth={2.8}
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="4.2" fill="#fff" />
  </svg>
);

/** A personal mail in someone's inbox. `seen` 0..1 pops a red "eye" badge on it. */
export const PrivateMailCard: React.FC<{
  from: string;
  subject: string;
  seen?: number;
  style?: React.CSSProperties;
}> = ({ from, subject, seen = 0, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: MAIL_W,
        height: MAIL_H,
        borderRadius: 32,
        background: p.white,
        boxShadow: "0 18px 50px rgba(1, 30, 140, 0.16)",
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "0 30px 0 22px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          flexShrink: 0,
          borderRadius: "50%",
          background: p.grey,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          fontWeight: 600,
          color: p.blueMid,
        }}
      >
        {from.replace(/^Je\s+/i, "")[0]?.toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 32, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{from}</div>
        <div
          style={{
            fontSize: 27,
            color: "#6b6b78",
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subject}
        </div>
      </div>
      {seen > 0 ? (
        <div
          style={{
            position: "absolute",
            right: -14,
            top: -14,
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: p.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(255, 90, 121, 0.35)",
            transform: `scale(${seen})`,
            opacity: Math.min(1, seen * 2),
          }}
        >
          <Eye size={36} />
        </div>
      ) : null}
    </div>
  );
};
