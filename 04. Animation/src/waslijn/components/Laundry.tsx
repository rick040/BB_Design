import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

/** Doorhangende waslijn tussen twee punten (kwadratische boog). */
export const ropeY = (x: number, x0: number, x1: number, y: number, sag: number) => {
  const t = (x - x0) / (x1 - x0);
  return y + sag * 4 * t * (1 - t);
};

export const Rope: React.FC<{ x0: number; x1: number; y: number; sag: number; color: string; width?: number }> = ({
  x0,
  x1,
  y,
  sag,
  color,
  width = 7,
}) => (
  <svg
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    width={1}
    height={1}
  >
    <path
      d={`M${x0} ${y} Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
    />
  </svg>
);

/** Paal met een klein dwarsstuk, voet op (x, groundY). */
export const Pole: React.FC<{ x: number; top: number; groundY: number; color: string }> = ({ x, top, groundY, color }) => (
  <div
    style={{
      position: "absolute",
      left: x - 9,
      top,
      width: 18,
      height: groundY - top,
      borderRadius: 9,
      background: color,
    }}
  />
);

/** Wasknijper, getekend rond het klempunt bovenaan (0,0). */
export const Peg: React.FC<{ color: string; size?: number }> = ({ color, size = 1 }) => (
  <svg
    width={34 * size}
    height={70 * size}
    viewBox="-17 -20 34 70"
    style={{ display: "block", overflow: "visible" }}
  >
    <rect x={-13} y={-20} width={12} height={68} rx={6} fill={color} />
    <rect x={1} y={-20} width={12} height={68} rx={6} fill={color} />
    <rect x={-15} y={10} width={30} height={9} rx={3} fill="#c9a21f" />
  </svg>
);

export const FIELD_W = 220;
export const FIELD_H = 168;

/** Eén veld van de rekening als kaartje aan de lijn. */
export const FieldCard: React.FC<{ label: string; value: string; link?: boolean }> = ({ label, value, link }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: FIELD_W,
        height: FIELD_H,
        borderRadius: 26,
        background: p.white,
        boxShadow: "0 18px 40px rgba(0, 12, 80, 0.28)",
        padding: "30px 18px 0",
        boxSizing: "border-box",
        textAlign: "center",
        fontFamily: fonts.ui,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 500, color: "#6b6b78", letterSpacing: "0.01em" }}>{label}</div>
      <div
        style={{
          marginTop: 14,
          fontFamily: fonts.display,
          fontSize: value.length > 8 ? 38 : 46,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: p.blue,
          textDecoration: link ? "underline" : "none",
          textUnderlineOffset: 8,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
};

/** De gesloten, donkere doos van "een app": niemand ziet wat erin zit. */
export const DarkBox: React.FC<{ label: string; w: number; h: number; color: string }> = ({ label, w, h, color }) => (
  <div style={{ position: "relative", width: w, height: h }}>
    {/* deksel */}
    <div
      style={{
        position: "absolute",
        left: -18,
        top: 0,
        width: w + 36,
        height: 64,
        borderRadius: 18,
        background: color,
        filter: "brightness(1.35)",
      }}
    />
    {/* gleuf */}
    <div
      style={{
        position: "absolute",
        left: w / 2 - 150,
        top: 24,
        width: 300,
        height: 16,
        borderRadius: 8,
        background: "#05070c",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 56,
        width: w,
        height: h - 56,
        borderRadius: "0 0 28px 28px",
        background: color,
      }}
    />
    {/* hangslot */}
    <svg
      width={110}
      height={130}
      viewBox="0 0 110 130"
      style={{ position: "absolute", left: w / 2 - 55, top: 140 }}
    >
      <path d="M28 60 V40 a27 27 0 0 1 54 0 V60" fill="none" stroke="#c7cbd6" strokeWidth={12} />
      <rect x={10} y={56} width={90} height={70} rx={16} fill="#c7cbd6" />
      <circle cx={55} cy={86} r={10} fill={color} />
      <rect x={50} y={88} width={10} height={22} rx={4} fill={color} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 34,
        textAlign: "center",
        fontFamily: fonts.display,
        fontSize: 40,
        fontWeight: 500,
        color: "#8a90a0",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </div>
  </div>
);
