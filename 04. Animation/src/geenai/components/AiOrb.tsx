import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Generic "AI" badge: a glowing orb with a four-point sparkle. No brand logo.
export const AiOrb: React.FC<{
  size: number;
  label: string;
  glow?: number;
  /** 0..1, red strike through the orb. */
  strike?: number;
  /** 0..1, drains the colour out. */
  dead?: number;
  style?: React.CSSProperties;
}> = ({ size, label, glow = 1, strike = 0, dead = 0, style }) => {
  const p = usePalette();
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${p.teal} 38%, ${p.blueMid} 100%)`,
          boxShadow: `0 0 ${60 * glow}px ${18 * glow}px rgba(79, 209, 217, ${0.45 * glow})`,
          filter: `grayscale(${dead}) brightness(${1 - 0.25 * dead})`,
        }}
      />
      <svg viewBox="0 0 100 100" width={size * 0.36} height={size * 0.36} style={{ position: "absolute", left: size * 0.6, top: size * 0.06 }}>
        <path d="M50 4C54 38 62 46 96 50C62 54 54 62 50 96C46 62 38 54 4 50C38 46 46 38 50 4Z" fill="#fff" opacity={1 - 0.6 * dead} />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: size * 0.38,
          letterSpacing: "-0.04em",
          color: "#fff",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          left: -size * 0.12,
          top: size / 2 - size * 0.045,
          width: size * 1.24,
          height: size * 0.09,
          borderRadius: size * 0.045,
          background: p.red,
          transform: `rotate(-38deg) scaleX(${strike})`,
          transformOrigin: "0% 50%",
        }}
      />
    </div>
  );
};
