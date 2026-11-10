import React from "react";

/**
 * Front half of a red-and-white swim ring, drawn over Buddy's lower body so he
 * sits *in* the ring. `width` is the outer width in px; anchor with `style`.
 */
export const SwimRing: React.FC<{
  width: number;
  red: string;
  white: string;
  /** "front" = lower half (draw over Buddy), "back" = upper half (draw behind him). */
  part?: "front" | "back";
  outline?: string;
  style?: React.CSSProperties;
}> = ({ width, red, white, part = "front", outline = "#0a2a9e", style }) => {
  const h = width * 0.5;
  const rx = width / 2 - 2;
  const ry = h / 2 - 2;
  const cx = width / 2;
  const cy = h / 2;
  const ir = rx * 0.52;
  const iry = ry * 0.38;
  const clipId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  // Six stripes around the ring, as angular sectors.
  const sectors = Array.from({ length: 8 }, (_, i) => {
    const a0 = (i / 8) * Math.PI * 2 + 0.2;
    const a1 = ((i + 1) / 8) * Math.PI * 2 + 0.2;
    const R = width;
    return {
      d: `M${cx},${cy} L${cx + Math.cos(a0) * R},${cy + Math.sin(a0) * R} L${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R} Z`,
      fill: i % 2 === 0 ? red : white,
    };
  });
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} style={{ position: "absolute", overflow: "visible", ...style }}>
      <defs>
        <clipPath id={`ring-${clipId}`}>
          {/* Only the front half (below the centre line) plus the outer rim. */}
          <path
            d={
              part === "front"
                ? `M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy} L${cx + ir},${cy} A${ir},${iry} 0 0 1 ${cx - ir},${cy} Z`
                : `M${cx - rx},${cy} A${rx},${ry} 0 0 1 ${cx + rx},${cy} L${cx + ir},${cy} A${ir},${iry} 0 0 0 ${cx - ir},${cy} Z`
            }
          />
        </clipPath>
      </defs>
      <g clipPath={`url(#ring-${clipId})`}>
        {sectors.map((s, i) => (
          <path key={i} d={s.d} fill={s.fill} />
        ))}
      </g>
      <path
        d={
          part === "front"
            ? `M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy} M${cx + ir},${cy} A${ir},${iry} 0 0 1 ${cx - ir},${cy}`
            : `M${cx - rx},${cy} A${rx},${ry} 0 0 1 ${cx + rx},${cy} M${cx + ir},${cy} A${ir},${iry} 0 0 0 ${cx - ir},${cy}`
        }
        fill="none"
        stroke={outline}
        strokeOpacity={0.35}
        strokeWidth={width * 0.012}
      />
      {/* Highlight on the rim. */}
      {part === "front" ? <path
        d={`M${cx - rx * 0.78},${cy + ry * 0.38} A${rx * 0.86},${ry * 0.7} 0 0 0 ${cx - rx * 0.2},${cy + ry * 0.78}`}
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.55}
        strokeWidth={width * 0.025}
        strokeLinecap="round"
      /> : null}
    </svg>
  );
};
