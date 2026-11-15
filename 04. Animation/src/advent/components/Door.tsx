import React from "react";
import { fonts } from "../../theme";

/**
 * An advent-calendar door: a numbered front that swings open on its left
 * hinge (CSS 3D, no WebGL) and shows `children` in the recess behind it.
 */
export const Door: React.FC<{
  w: number;
  h: number;
  label: string;
  /** Small second line under the number (e.g. weekday). */
  sub?: string;
  /** 0 = closed, 1 = fully open (≈ 115°). */
  open: number;
  front: string;
  frontText: string;
  recess: string;
  /** Optional highlight ring (0..1), e.g. the chosen reminder day. */
  ring?: number;
  ringColor?: string;
  radius?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  w,
  h,
  label,
  sub,
  open,
  front,
  frontText,
  recess,
  ring = 0,
  ringColor = "#ffce31",
  radius = 26,
  children,
  style,
}) => {
  const angle = -115 * Math.max(0, Math.min(1.08, open));
  return (
    <div style={{ position: "absolute", width: w, height: h, perspective: 1600, ...style }}>
      {/* Recess behind the door */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: recess,
          boxShadow: "inset 0 10px 24px rgba(0,0,0,0.22)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
      {/* Door leaf on the left hinge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: front,
          transformOrigin: "0% 50%",
          transform: `rotateY(${angle}deg)`,
          backfaceVisibility: "hidden",
          boxShadow: open > 0.02 ? `${-10 * open}px 12px 30px rgba(0,0,0,${0.18 * Math.min(1, open)})` : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: frontText,
          fontFamily: fonts.display,
        }}
      >
        <div style={{ fontSize: h * 0.38, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{label}</div>
        {sub ? <div style={{ fontSize: h * 0.13, fontWeight: 500, marginTop: 6, opacity: 0.8 }}>{sub}</div> : null}
      </div>
      {ring > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: radius + 10,
            border: `8px solid ${ringColor}`,
            opacity: Math.min(1, ring),
            transform: `scale(${0.9 + 0.1 * ring})`,
          }}
        />
      ) : null}
    </div>
  );
};

/** A simple star (the nice surprise behind a door). */
export const Star: React.FC<{ size: number; color: string; rot?: number }> = ({ size, color, rot = 0 }) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 50 : 21;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rot}deg)` }}>
      <polygon points={pts.join(" ")} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={6} />
    </svg>
  );
};

/** Bell icon for the reminder. */
export const Bell: React.FC<{ size: number; color: string; swing?: number }> = ({ size, color, swing = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    style={{ transform: `rotate(${swing}deg)`, transformOrigin: "50% 10%" }}
  >
    <path
      d="M24 5c-1.7 0-3 1.3-3 3v1.4C15.3 10.8 12 15.6 12 21v9l-4 5v2h32v-2l-4-5v-9c0-5.4-3.3-10.2-9-11.6V8c0-1.7-1.3-3-3-3z"
      fill={color}
    />
    <circle cx="24" cy="41" r="4.5" fill={color} />
  </svg>
);
