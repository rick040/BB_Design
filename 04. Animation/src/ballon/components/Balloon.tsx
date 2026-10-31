import React from "react";
import { fonts, headlineTracking } from "../../theme";

// A party balloon with a label, drawn in SVG so the text stays editable.
// Position it by the centre of its body (cx, cy) in stage coordinates.
// The knot (where the string starts) is at balloonKnot(cx, cy, w).
export const BALLOON_RATIO = 1.2; // body height / width

export const balloonKnot = (cx: number, cy: number, w: number) => ({
  x: cx,
  y: cy + (w * BALLOON_RATIO) / 2 + w * 0.06,
});

const BODY =
  "M50 0 C79 0 100 24 100 54 C100 86 74 112 54 118 L46 118 C26 112 0 86 0 54 C0 24 21 0 50 0 Z";

export const Balloon: React.FC<{
  cx: number;
  cy: number;
  w: number;
  color: string;
  textColor: string;
  label?: string;
  /** Optional second line under the label (smaller). */
  sub?: string;
  /** 0..1 how far the second line is shown. */
  subIn?: number;
  /** 0..1 how far the label is shown. */
  labelIn?: number;
  labelSize?: number;
  /** Rotation in degrees around the knot. */
  rotate?: number;
  /** Overall scale around the knot (inflate). */
  scale?: number;
  opacity?: number;
}> = ({ cx, cy, w, color, textColor, label, sub, subIn = 1, labelIn = 1, labelSize, rotate = 0, scale = 1, opacity = 1 }) => {
  const h = w * BALLOON_RATIO;
  const knot = balloonKnot(cx, cy, w);
  const size = labelSize ?? w * 0.2;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h + w * 0.08,
        transformOrigin: `${w / 2}px ${knot.y - (cy - h / 2)}px`,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity,
      }}
    >
      <svg viewBox="0 0 100 128" width={w} height={w * 1.28} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={BODY} fill={color} />
        {/* knot */}
        <path d="M44 126 L50 116 L56 126 Q50 129 44 126 Z" fill={color} />
        {/* highlight */}
        <ellipse cx={28} cy={30} rx={9} ry={16} fill="#ffffff" opacity={0.32} transform="rotate(28 28 30)" />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: h * 0.46 - (sub ? size * 0.75 : size * 0.55),
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: size,
            letterSpacing: headlineTracking,
            lineHeight: 1,
            color: textColor,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ opacity: labelIn, transform: `scale(${0.6 + 0.4 * labelIn})` }}>{label}</div>
          {sub ? (
            <div
              style={{
                marginTop: size * 0.22,
                fontFamily: fonts.ui,
                fontWeight: 500,
                fontSize: size * 0.46,
                letterSpacing: "0",
                opacity: subIn,
                transform: `translateY(${(1 - subIn) * 12}px)`,
              }}
            >
              {sub}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

/** A balloon string as a soft curve between two stage points. */
export const BalloonString: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  /** Sideways bend in px (positive = to the right). */
  bend?: number;
  width?: number;
  opacity?: number;
}> = ({ from, to, color, bend = 0, width = 4, opacity = 1 }) => {
  const mx = (from.x + to.x) / 2 + bend;
  const my = (from.y + to.y) / 2;
  return (
    <path
      d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      opacity={opacity}
    />
  );
};

/** Full-stage SVG layer for strings (1080 × 900, overflow visible). */
export const StringLayer: React.FC<{ children: React.ReactNode; zIndex?: number }> = ({ children, zIndex }) => (
  <svg
    width={1080}
    height={900}
    viewBox="0 0 1080 900"
    style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex }}
  >
    {children}
  </svg>
);

/** Short burst lines where a balloon pops. */
export const PopBurst: React.FC<{ x: number; y: number; t: number; color: string; radius?: number }> = ({
  x,
  y,
  t,
  color,
  radius = 90,
}) => {
  if (t <= 0 || t >= 1) return null;
  const n = 10;
  const r0 = radius * (0.35 + 0.65 * t);
  const len = radius * 0.45 * (1 - t);
  return (
    <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.2;
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r0}
            y1={y + Math.sin(a) * r0}
            x2={x + Math.cos(a) * (r0 + len)}
            y2={y + Math.sin(a) * (r0 + len)}
            stroke={color}
            strokeWidth={9}
            strokeLinecap="round"
            opacity={1 - t * 0.6}
          />
        );
      })}
    </svg>
  );
};
