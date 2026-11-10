import React from "react";

/**
 * Headphones that sit around Buddy. Drawn in Buddy's own box (pass the same
 * `size` as <Buddy>), positioned over him with the same left/top. Not an
 * `accessory`, because accessories are clipped to his silhouette.
 */
export const Headphones: React.FC<{
  size: number;
  band: string;
  cup: string;
  style?: React.CSSProperties;
}> = ({ size, band, cup, style }) => {
  // Buddy viewBox is 465 × 506; his "head" (upper bowl) spans x 0..315.
  return (
    <svg
      width={size}
      height={size * (506 / 465)}
      viewBox="0 0 465 506"
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <path d="M -6 120 C -10 -70, 322 -70, 318 120" fill="none" stroke={band} strokeWidth={30} strokeLinecap="round" />
      <rect x={-46} y={70} width={62} height={120} rx={28} fill={cup} />
      <rect x={292} y={70} width={62} height={120} rx={28} fill={cup} />
    </svg>
  );
};
