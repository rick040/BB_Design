import React from "react";

/** Paper plane seen from the side-top, nose to the right. viewBox 120 × 70. */
export const PaperPlane: React.FC<{ size: number; fill: string; line: string; style?: React.CSSProperties }> = ({
  size,
  fill,
  line,
  style,
}) => (
  <svg width={size} height={(size * 70) / 120} viewBox="0 0 120 70" style={{ overflow: "visible", ...style }}>
    <path d="M2 30 L118 4 L46 44 Z" fill={fill} stroke={line} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M46 44 L118 4 L62 66 Z" fill={fill} stroke={line} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M46 44 L52 56 L62 66" fill="none" stroke={line} strokeWidth="3.5" strokeLinejoin="round" />
  </svg>
);

/** Folded paper hat (seen from the front). viewBox 120 × 70. */
export const PaperHat: React.FC<{ size: number; fill: string; line: string }> = ({ size, fill, line }) => (
  <svg width={size} height={(size * 70) / 120} viewBox="0 0 120 70" style={{ overflow: "visible" }}>
    <path d="M6 60 L60 4 L114 60 Z" fill={fill} stroke={line} strokeWidth="4" strokeLinejoin="round" />
    <path d="M0 58 H120 V68 H0 Z" fill={fill} stroke={line} strokeWidth="4" strokeLinejoin="round" />
    <path d="M60 4 L60 58" stroke={line} strokeWidth="3" opacity="0.5" />
  </svg>
);

/** One chain link, centred on (x, y). */
export const ChainLink: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  rot?: number;
  vertical?: boolean;
}> = ({ x, y, w, h, color, rot = 0, vertical = false }) => {
  const W = vertical ? h * 0.55 : w;
  const H = vertical ? h : h;
  return (
    <div
      style={{
        position: "absolute",
        left: x - W / 2,
        top: y - (vertical ? H : H * 0.6) / 2,
        width: W,
        height: vertical ? H : H * 0.6,
        borderRadius: 999,
        border: `11px solid ${color}`,
        boxSizing: "border-box",
        transform: `rotate(${rot}deg)`,
      }}
    />
  );
};

/** Small eye icon (being read). */
export const EyeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 40 24">
    <path d="M2 12 C10 1 30 1 38 12 C30 23 10 23 2 12 Z" fill="none" stroke={color} strokeWidth="3" />
    <circle cx="20" cy="12" r="5" fill={color} />
  </svg>
);

/** Mail list row used in hook and forward scenes. */
export const MailRow: React.FC<{
  name: string;
  width: number;
  bg: string;
  ink: string;
  avatar: string;
  bar: string;
  right?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ name, width, bg, ink, avatar, bar, right, style }) => (
  <div
    style={{
      width,
      height: 96,
      borderRadius: 26,
      background: bg,
      display: "flex",
      alignItems: "center",
      gap: 22,
      padding: "0 24px",
      boxSizing: "border-box",
      fontFamily: "'Geist', system-ui, sans-serif",
      ...style,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: avatar,
        color: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 28,
        flexShrink: 0,
      }}
    >
      {name.slice(0, 1)}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 34, fontWeight: 600, color: ink, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ marginTop: 8, height: 12, width: "70%", borderRadius: 6, background: bar }} />
    </div>
    {right}
  </div>
);
