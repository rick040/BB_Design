import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const DIALOG_W = 760;
export const DIALOG_H = 500;

const stroke = { fill: "none", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// Generic permission icons (no third-party look-alikes).
const PermIcon: React.FC<{ index: number; color: string }> = ({ index, color }) => {
  if (index === 0) {
    // open envelope
    return (
      <svg width={40} height={40} viewBox="0 0 32 32">
        <path d="M4 13 16 5l12 8v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" {...stroke} stroke={color} />
        <path d="m4 13 12 8 12-8" {...stroke} stroke={color} />
      </svg>
    );
  }
  if (index === 1) {
    // people
    return (
      <svg width={40} height={40} viewBox="0 0 32 32">
        <circle cx="12" cy="11" r="4.5" {...stroke} stroke={color} />
        <path d="M4 26c.8-4.6 4-7 8-7s7.2 2.4 8 7" {...stroke} stroke={color} />
        <circle cx="22.5" cy="12.5" r="3.5" {...stroke} stroke={color} />
        <path d="M22 19c3.4 0 5.6 2 6.2 5.6" {...stroke} stroke={color} />
      </svg>
    );
  }
  // trash
  return (
    <svg width={40} height={40} viewBox="0 0 32 32">
      <path d="M5 9h22M12 9V6h8v3M8 9l1.4 17a2 2 0 0 0 2 1.8h9.2a2 2 0 0 0 2-1.8L24 9" {...stroke} stroke={color} />
    </svg>
  );
};

/**
 * A generic "this app wants access to your mailbox" consent dialog.
 * `flag` 0..1 turns the first permission red; `allowPulse` scales the button.
 */
export const PermissionDialog: React.FC<{
  title: string;
  permissions: string[];
  deny: string;
  allow: string;
  flag?: number;
  allowPulse?: number;
  style?: React.CSSProperties;
}> = ({ title, permissions, deny, allow, flag = 0, allowPulse = 1, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: DIALOG_W,
        height: DIALOG_H,
        borderRadius: 48,
        background: p.white,
        boxShadow: "0 30px 90px rgba(1, 40, 160, 0.18)",
        padding: "42px 48px 40px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: 40,
          fontWeight: 600,
          lineHeight: 1.15,
          color: p.ink,
          textAlign: "center",
          whiteSpace: "pre-line",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>

      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 4 }}>
        {permissions.map((text, i) => {
          const f = i === 0 ? flag : 0;
          const color = f > 0.5 ? p.red : p.ink;
          return (
            <div
              key={i}
              style={{
                height: 62,
                borderRadius: 20,
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                gap: 20,
                background: `rgba(255, 90, 121, ${0.14 * f})`,
                transform: `scale(${1 + interpolate(f, [0, 0.6, 1], [0, 0.05, 0.02], clamp)})`,
                transformOrigin: "50% 50%",
              }}
            >
              <PermIcon index={i} color={i === 0 && f > 0.5 ? p.red : p.blueMid} />
              <span style={{ fontSize: 32, fontWeight: i === 0 && f > 0.5 ? 600 : 450, color, whiteSpace: "nowrap" }}>
                {text}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 36,
        }}
      >
        <span style={{ fontSize: 32, fontWeight: 500, color: "#6b6b78" }}>{deny}</span>
        <div
          style={{
            height: 80,
            padding: "0 44px",
            borderRadius: 40,
            background: p.blue,
            color: p.white,
            display: "flex",
            alignItems: "center",
            fontSize: 32,
            fontWeight: 600,
            transform: `scale(${allowPulse})`,
          }}
        >
          {allow}
        </div>
      </div>
    </div>
  );
};
