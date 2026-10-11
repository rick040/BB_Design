import React from "react";
import { fonts, headlineTracking } from "../theme";
import { usePalette } from "../lib/palette";

// Rebuilt from 02. Elements/SVG/Asset 34vector.svg ("activeer buddy").
export const CTA_H = 104;

export const Arrow: React.FC<{ size: number; color?: string }> = ({
  size,
  color = "#fff",
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <path
      d="M6 20h27M22 9l11 11-11 11"
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CtaPill: React.FC<{
  text: string;
  /** 0..1, slides the arrow circle in from the left. */
  arrowIn?: number;
  /** Extra nudge on the arrow (px). */
  arrowNudge?: number;
  outline?: boolean;
  style?: React.CSSProperties;
}> = ({ text, arrowIn = 1, arrowNudge = 0, outline = false, style }) => {
  const p = usePalette();
  const circle = CTA_H * 0.68;

  return (
    <div
      style={{
        height: CTA_H,
        borderRadius: CTA_H / 2,
        background: p.white,
        border: outline ? `2px solid ${p.blue}66` : "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 26,
        padding: `0 46px 0 ${(CTA_H - circle) / 2}px`,
        boxSizing: "border-box",
        boxShadow: "0 20px 60px rgba(0, 20, 120, 0.25)",
        ...style,
      }}
    >
      <div
        style={{
          width: circle,
          height: circle,
          borderRadius: "50%",
          background: p.blueMid,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${(1 - arrowIn) * -40}px) scale(${0.4 + 0.6 * arrowIn})`,
          opacity: arrowIn,
        }}
      >
        <div style={{ transform: `translateX(${arrowNudge}px)` }}>
          <Arrow size={circle * 0.56} />
        </div>
      </div>
      <span
        style={{
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 50,
          letterSpacing: headlineTracking,
          color: p.blue,
          lineHeight: 1,
          paddingBottom: 4,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
};
