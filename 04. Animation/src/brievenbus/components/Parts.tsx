import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

/** A yellow key with an optional label tag. */
export const Key: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg width={size} height={size * 0.42} viewBox="0 0 200 84" style={{ overflow: "visible", ...style }}>
    <circle cx="42" cy="42" r="34" fill={color} />
    <circle cx="42" cy="42" r="13" fill="rgba(0,0,0,0.18)" />
    <rect x="70" y="32" width="122" height="20" rx="6" fill={color} />
    <rect x="150" y="50" width="14" height="22" rx="3" fill={color} />
    <rect x="174" y="50" width="14" height="30" rx="3" fill={color} />
  </svg>
);

/** Small open eye, used on mails that a linked app can read. */
export const Eye: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 50 31">
    <path d="M2 15.5 C 12 1, 38 1, 48 15.5 C 38 30, 12 30, 2 15.5 Z" fill="none" stroke={color} strokeWidth="4" />
    <circle cx="25" cy="15.5" r="6.5" fill={color} />
  </svg>
);

/** A mail row: envelope stub, label and an eye. */
export const MailTab: React.FC<{ label: string; width?: number; style?: React.CSSProperties }> = ({
  label,
  width = 330,
  style,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        width,
        height: 92,
        borderRadius: 26,
        background: p.white,
        boxShadow: "0 14px 34px rgba(1, 30, 120, 0.18)",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 24px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 36,
        color: p.ink,
        ...style,
      }}
    >
      <div style={{ width: 44, height: 32, borderRadius: 6, background: p.grey, position: "relative", flexShrink: 0 }}>
        <svg width="44" height="32" viewBox="0 0 44 32" style={{ position: "absolute", inset: 0 }}>
          <path d="M3 4 L22 18 L41 4" fill="none" stroke={p.greyText} strokeWidth="3.5" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>{label}</div>
      <Eye size={44} color={p.blue} />
    </div>
  );
};

/** Pill chip. */
export const Chip: React.FC<{ text: string; bg: string; fg: string; size?: number; style?: React.CSSProperties }> = ({
  text,
  bg,
  fg,
  size = 44,
  style,
}) => (
  <div
    style={{
      background: bg,
      color: fg,
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: size,
      padding: `${size * 0.42}px ${size * 0.85}px`,
      borderRadius: 999,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

/**
 * A front door. `open` 0..1 swings the leaf around its left hinge.
 * With `slot`, a letterbox plate sits in the leaf; `flap` 0..1 lifts its flap.
 */
export const Door: React.FC<{
  width: number;
  height: number;
  open: number;
  leaf: string;
  frame?: string;
  inside?: React.ReactNode;
  slot?: boolean;
  flap?: number;
  lockLeft?: boolean;
  style?: React.CSSProperties;
}> = ({ width, height, open, leaf, frame = "#d7deea", inside, slot = false, flap = 0, style }) => {
  const p = usePalette();
  const r = width * 0.5;
  return (
    <div style={{ position: "relative", width, height, ...style }}>
      {/* frame + dark inside */}
      <div
        style={{
          position: "absolute",
          inset: -18,
          borderRadius: `${r + 18}px ${r + 18}px 14px 14px`,
          background: frame,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: `${r}px ${r}px 8px 8px`,
          background: "#0b1d6b",
          overflow: "hidden",
        }}
      >
        {inside}
      </div>
      {/* leaf */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: `${r}px ${r}px 8px 8px`,
          background: leaf,
          transform: `perspective(1600px) rotateY(${-open * 108}deg)`,
          transformOrigin: "0% 50%",
          boxShadow: "inset 0 0 0 10px rgba(255,255,255,0.12)",
          backfaceVisibility: "visible",
        }}
      >
        {/* panels */}
        <div
          style={{
            position: "absolute",
            left: width * 0.16,
            right: width * 0.16,
            top: height * 0.12,
            height: height * 0.3,
            borderRadius: `${r}px ${r}px 12px 12px`,
            border: "8px solid rgba(255,255,255,0.16)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: width * 0.16,
            right: width * 0.16,
            top: height * 0.62,
            height: height * 0.28,
            borderRadius: 12,
            border: "8px solid rgba(255,255,255,0.16)",
          }}
        />
        {slot ? (
          <div
            style={{
              position: "absolute",
              left: width * 0.2,
              right: width * 0.2,
              top: height * 0.47,
              height: height * 0.09,
              borderRadius: 14,
              background: p.yellow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "78%",
                height: "40%",
                borderRadius: 8,
                background: "#0b1d6b",
                transform: `scaleY(${0.35 + 0.65 * flap})`,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              right: width * 0.1,
              top: height * 0.52,
              width: width * 0.07,
              height: width * 0.07,
              borderRadius: "50%",
              background: p.yellow,
            }}
          />
        )}
      </div>
    </div>
  );
};
