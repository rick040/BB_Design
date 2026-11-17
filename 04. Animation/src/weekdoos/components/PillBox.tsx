import React from "react";
import { Checkmark } from "../../components/Checkmark";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const BOX_W = 960;
export const BOX_H = 250;
export const LID_H = 56;
export const slotX = (i: number, n = 3) => (BOX_W / n) * (i + 0.5);

/**
 * A weekly pill organiser with one compartment per due date. `open[i]` 0..1
 * swings lid i up around its left hinge; `filled[i]` shows the slip inside;
 * `checked[i]` draws a check on the lid.
 */
export const PillBox: React.FC<{
  slots: string[];
  open: number[];
  filled: number[];
  checked: number[];
  highlight?: number;
  scale?: number;
  lidColor?: string;
  checkColor?: string;
  style?: React.CSSProperties;
}> = ({ slots, open, filled, checked, highlight = 0, scale = 1, lidColor, checkColor, style }) => {
  const p = usePalette();
  const n = slots.length;
  const w = BOX_W / n;
  return (
    <div
      style={{
        position: "absolute",
        width: BOX_W,
        height: BOX_H + LID_H,
        transform: `scale(${scale})`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      {slots.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: i * w + 8, top: 0, width: w - 16, height: BOX_H + LID_H }}>
          {/* compartment */}
          <div
            style={{
              position: "absolute",
              top: LID_H,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "0 0 46px 46px",
              background: p.blueSoft,
              border: `6px solid ${p.blue}`,
              borderTop: "none",
              boxSizing: "border-box",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 26,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                width: 150,
                height: 110,
                marginLeft: -75,
                borderRadius: 16,
                background: p.white,
                transform: `translateY(${(1 - filled[i]) * -160}px) rotate(${-6 + 12 * (i % 2)}deg)`,
                opacity: filled[i] > 0 ? 1 : 0,
                boxShadow: "0 8px 20px rgba(0,25,120,0.2)",
              }}
            >
              <div style={{ height: 12, width: 90, borderRadius: 6, background: p.grey, margin: "22px 0 0 20px" }} />
              <div style={{ height: 12, width: 60, borderRadius: 6, background: p.grey, margin: "12px 0 0 20px" }} />
            </div>
            <div
              style={{
                position: "relative",
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 64,
                letterSpacing: "-0.05em",
                color: highlight > 0.5 ? p.white : p.blue,
                background: highlight > 0.5 ? p.blue : "transparent",
                borderRadius: 30,
                padding: "0 22px",
              }}
            >
              {s}
            </div>
          </div>
          {/* lid, hinged at its left edge */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: -4,
              right: -4,
              height: LID_H,
              borderRadius: 22,
              background: lidColor ?? p.blue,
              transformOrigin: "0% 100%",
              transform: `rotate(${-115 * open[i]}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkmark size={44} color={checkColor ?? p.white} progress={checked[i]} strokeWidth={16} />
          </div>
        </div>
      ))}
    </div>
  );
};
