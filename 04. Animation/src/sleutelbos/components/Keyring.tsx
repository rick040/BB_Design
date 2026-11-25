import React from "react";
import { brand, fonts } from "../../theme";

// A key ring with four keys, each with a tag. Drawn in its own 600 × 520 box;
// the ring centre is at (300, 70). Position it with `style`.
export const KEYRING_W = 600;
export const KEYRING_H = 520;
const CX = 300;
const CY = 70;
const ANGLES = [-40, -13, 13, 40];
const KEY_COLORS = [brand.yellow, brand.blueSoft, "#d9dee6", brand.yellow];
const LEN = 300;

const Key: React.FC<{ color: string }> = ({ color }) => (
  // Key pointing down from (0,0): bow at the top, teeth at the bottom.
  <g>
    <circle cx={0} cy={70} r={38} fill={color} stroke="#111827" strokeWidth={5} />
    <circle cx={0} cy={58} r={11} fill="#ffffff" stroke="#111827" strokeWidth={4} />
    <rect x={-12} y={104} width={24} height={LEN - 120} rx={6} fill={color} stroke="#111827" strokeWidth={5} />
    <path
      d={`M12 ${LEN - 70} h26 v18 h-14 v14 h14 v18 h-26`}
      fill={color}
      stroke="#111827"
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </g>
);

export const Keyring: React.FC<{
  tags: string[];
  /** Extra swing of the keys in degrees. */
  swing?: number;
  /** Tag opacity 0..1. */
  tagsIn?: number;
  style?: React.CSSProperties;
}> = ({ tags, swing = 0, tagsIn = 1, style }) => (
  <div style={{ position: "absolute", width: KEYRING_W, height: KEYRING_H, ...style }}>
    <svg width={KEYRING_W} height={KEYRING_H} viewBox={`0 0 ${KEYRING_W} ${KEYRING_H}`} style={{ position: "absolute" }}>
      {ANGLES.map((a, i) => (
        <g key={i} transform={`translate(${CX} ${CY}) rotate(${-(a + swing * (1 - i * 0.12))})`}>
          <Key color={KEY_COLORS[i % KEY_COLORS.length]} />
        </g>
      ))}
      <circle cx={CX} cy={CY} r={58} fill="none" stroke="#8a93a3" strokeWidth={14} />
      <circle cx={CX} cy={CY} r={58} fill="none" stroke="#c9d0db" strokeWidth={5} />
    </svg>
    {ANGLES.map((a, i) => {
      const rad = ((a + swing * (1 - i * 0.12)) * Math.PI) / 180;
      const r = LEN - 10;
      const x = CX + Math.sin(rad) * r;
      const y = CY + Math.cos(rad) * r;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y + 8,
            transform: `translate(-50%, 0) scale(${0.6 + 0.4 * tagsIn})`,
            opacity: tagsIn,
            background: "#ffffff",
            color: "#111827",
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 34,
            padding: "8px 18px",
            borderRadius: 14,
            border: "4px solid #111827",
            whiteSpace: "nowrap",
          }}
        >
          {tags[i]}
        </div>
      );
    })}
  </div>
);

/** A small chip with dark ink, used for labels. */
export const Chip: React.FC<{ text: string; dark?: boolean; style?: React.CSSProperties }> = ({
  text,
  dark = true,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      background: dark ? "#111827" : "#ffffff",
      color: dark ? "#ffffff" : "#111827",
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: 40,
      padding: "14px 30px",
      borderRadius: 40,
      whiteSpace: "nowrap",
      boxShadow: "0 14px 40px rgba(0, 20, 80, 0.18)",
      ...style,
    }}
  >
    {text}
  </div>
);
