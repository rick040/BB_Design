import React from "react";
import { brand, fonts } from "../../theme";

/**
 * A glass drawer seen from the front, with a little depth on top.
 * `frost` 0 = clear glass, 1 = fully frosted (contents unreadable).
 */
export const GlassDrawer: React.FC<{
  width: number;
  height: number;
  frost: number;
  /** Tint of the glass edges. */
  edge: string;
  /** Background behind the glass (to fake the frost). */
  backdrop: string;
  /** How far the tray is pulled out, 0..1 (moves the front down, shows the rim). */
  open?: number;
  children?: React.ReactNode;
  label?: string;
  labelColor?: string;
  style?: React.CSSProperties;
}> = ({ width, height, frost, edge, backdrop, open = 0, children, label, labelColor, style }) => {
  const rim = 40 + open * 70;
  return (
    <div style={{ position: "absolute", width, height: height + rim, ...style }}>
      {/* rim / depth of the tray */}
      <div
        style={{
          position: "absolute",
          left: 26,
          right: 26,
          top: 0,
          height: rim + 10,
          borderRadius: "22px 22px 0 0",
          border: `5px solid ${edge}`,
          borderBottom: "none",
          background: `linear-gradient(180deg, ${edge}22, ${edge}44)`,
          transform: "perspective(600px) rotateX(38deg)",
          transformOrigin: "50% 100%",
        }}
      />
      {/* front pane */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: rim,
          width,
          height,
          borderRadius: 30,
          border: `6px solid ${edge}`,
          boxSizing: "border-box",
          overflow: "hidden",
          background: `linear-gradient(160deg, ${edge}26, ${edge}0d)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, filter: `blur(${frost * 18}px)` }}>{children}</div>
        <div style={{ position: "absolute", inset: 0, background: backdrop, opacity: frost * 0.72 }} />
        {/* glare */}
        <div
          style={{
            position: "absolute",
            top: -40,
            left: "18%",
            width: 70,
            height: height + 80,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            transform: "rotate(18deg)",
          }}
        />
        {label ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 220,
              color: labelColor,
              opacity: frost,
            }}
          >
            {label}
          </div>
        ) : null}
        {/* handle */}
        <div
          style={{
            position: "absolute",
            left: width / 2 - 90,
            top: 22,
            width: 180,
            height: 26,
            borderRadius: 13,
            background: edge,
          }}
        />
      </div>
    </div>
  );
};

/** One stored field: label + value, Geist UI card. */
export const FieldCard: React.FC<{
  label: string;
  value: string;
  width: number;
  style?: React.CSSProperties;
  strike?: number;
}> = ({ label, value, width, style, strike = 0 }) => (
  <div
    style={{
      position: "absolute",
      width,
      height: 104,
      borderRadius: 22,
      background: brand.card,
      boxShadow: "0 12px 30px rgba(0,20,120,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      boxSizing: "border-box",
      fontFamily: fonts.ui,
      ...style,
    }}
  >
    <span style={{ fontSize: 34, color: brand.greyText, fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: 40, color: brand.ink, fontWeight: 600 }}>{value}</span>
    {strike > 0 ? (
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 50,
          height: 5,
          width: (width - 48) * strike,
          background: brand.red,
          borderRadius: 3,
        }}
      />
    ) : null}
  </div>
);

/** Rubber squeegee blade with a handle; drawn vertically, centred on x. */
export const Squeegee: React.FC<{ x: number; top: number; height: number; color: string; handle: string }> = ({
  x,
  top,
  height,
  color,
  handle,
}) => (
  <div style={{ position: "absolute", left: x - 18, top, width: 36, height, pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: color, boxShadow: "0 0 40px rgba(0,0,0,0.25)" }} />
    <div style={{ position: "absolute", left: 10, top: 0, bottom: 0, width: 8, borderRadius: 4, background: "#222" }} />
    <div
      style={{
        position: "absolute",
        left: -150,
        top: height / 2 - 22,
        width: 150,
        height: 44,
        borderRadius: 22,
        background: handle,
      }}
    />
  </div>
);

/** Small polishing cloth Buddy holds. */
export const Cloth: React.FC<{ size: number; color: string; rot?: number; style?: React.CSSProperties }> = ({
  size,
  color,
  rot = 0,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", overflow: "visible", ...style }}>
    <g transform={`rotate(${rot} 50 50)`}>
      <path d="M12 22 Q50 6 88 20 L84 78 Q50 94 16 80 Z" fill={color} />
      <path d="M22 40 Q50 30 78 38 M22 58 Q50 50 78 56" stroke="#00000022" strokeWidth={5} fill="none" />
    </g>
  </svg>
);
