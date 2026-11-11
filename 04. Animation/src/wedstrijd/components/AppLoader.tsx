import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

/** A generic, unbranded app icon with a download ring around it. */
export const AppLoader: React.FC<{
  size: number;
  /** 0..100 */
  pct: number;
  /** Spinner rotation in degrees. */
  spin: number;
  ring?: string;
  track?: string;
  style?: React.CSSProperties;
}> = ({ size, pct, spin, ring, track, style }) => {
  const p = usePalette();
  const r = 46;
  const C = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size, position: "relative", ...style }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke={track ?? p.grey} strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={ring ?? p.greyText}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(C * pct) / 100} ${C}`}
          transform="rotate(-90 50 50)"
        />
        {/* Little spinner tick that keeps running round. */}
        <circle
          cx="50"
          cy="4"
          r="4.5"
          fill={ring ?? p.greyText}
          transform={`rotate(${spin} 50 50)`}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: size * 0.2,
          top: size * 0.2,
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: size * 0.16,
          background: p.grey,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: size * 0.26,
          color: p.greyText,
        }}
      >
        €
      </div>
    </div>
  );
};

/** Download progress for the "other app": crawls and never quite gets there. */
export const appPct = (frame: number) => Math.min(9, 1 + frame * 0.03);
export const appSpin = (frame: number) => frame * 14;
