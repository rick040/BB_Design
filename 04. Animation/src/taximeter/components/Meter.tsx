import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const METER_W = 700;
export const METER_H = 330;

/**
 * A taximeter: dark body, label row, lit display and a flag lever on the right.
 * flag: 0 = up (running), 1 = down (stopped).
 */
export const Meter: React.FC<{
  label: string;
  value: string;
  /** 0..1 glow of the "running" lamp. */
  lamp: number;
  flag: number;
  /** Scale pulse on each tick (0..1). */
  tick?: number;
  digitColor?: string;
  style?: React.CSSProperties;
}> = ({ label, value, lamp, flag, tick = 0, digitColor, style }) => {
  const p = usePalette();
  const body = "#111827";
  const digits = digitColor ?? p.yellow;
  return (
    <div style={{ position: "absolute", width: METER_W, height: METER_H, ...style }}>
      {/* flag lever */}
      <div
        style={{
          position: "absolute",
          left: METER_W - 30,
          top: 150,
          width: 24,
          height: 24,
          transform: `rotate(${-20 + flag * 110}deg)`,
          transformOrigin: "12px 12px",
        }}
      >
        <div style={{ position: "absolute", left: 6, top: -170, width: 12, height: 182, borderRadius: 6, background: body }} />
        <div
          style={{
            position: "absolute",
            left: 12,
            top: -176,
            width: 92,
            height: 64,
            borderRadius: "6px 18px 18px 6px",
            background: p.yellow,
            border: `6px solid ${body}`,
            boxSizing: "border-box",
          }}
        />
        <div style={{ position: "absolute", left: -6, top: -6, width: 36, height: 36, borderRadius: 18, background: body }} />
      </div>
      {/* body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 48,
          background: body,
          boxShadow: "0 30px 80px rgba(1, 20, 80, 0.28)",
          padding: "34px 44px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 30, letterSpacing: "0.14em", color: "#9CA3AF" }}>
            {label}
          </div>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              background: lamp > 0.05 ? p.yellow : "#374151",
              opacity: 0.35 + 0.65 * lamp,
              boxShadow: lamp > 0.05 ? `0 0 ${30 * lamp}px ${p.yellow}` : "none",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 22,
            height: 190,
            borderRadius: 28,
            background: "#0B1020",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 150,
            letterSpacing: "-0.04em",
            color: digits,
            textShadow: `0 0 28px ${digits}55`,
            fontVariantNumeric: "tabular-nums",
            transform: `scale(${1 + tick * 0.04})`,
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};
