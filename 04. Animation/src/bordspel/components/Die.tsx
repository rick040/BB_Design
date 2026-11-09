import React from "react";
import { fonts } from "../../theme";

// A die. Faces 1..6 show pips; face 0 shows a tiny calendar with a date
// (the closing image: no luck, a date).
const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]],
};

export const Die: React.FC<{
  size: number;
  face: number;
  bg: string;
  pip: string;
  /** Calendar face: header colour and date. */
  calHeader?: string;
  date?: string;
  style?: React.CSSProperties;
}> = ({ size, face, bg, pip, calHeader, date, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: size * 0.22,
      background: bg,
      boxShadow: `inset 0 -${size * 0.06}px 0 rgba(0,0,0,0.08), 0 ${size * 0.12}px ${size * 0.3}px rgba(1,40,160,0.22)`,
      overflow: "hidden",
      ...style,
    }}
  >
    {face === 0 ? (
      <div style={{ position: "absolute", inset: size * 0.14, borderRadius: size * 0.1, overflow: "hidden", background: "#fff", boxShadow: `inset 0 0 0 ${size * 0.025}px ${calHeader}` }}>
        <div style={{ height: "28%", background: calHeader }} />
        <div
          style={{
            height: "72%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: size * 0.34,
            letterSpacing: "-0.05em",
            color: calHeader,
          }}
        >
          {date}
        </div>
      </div>
    ) : (
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", left: 0, top: 0 }}>
        {(PIPS[face] ?? PIPS[1]).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9} fill={pip} />
        ))}
      </svg>
    )}
  </div>
);
