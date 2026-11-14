import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

/** Front view of a parcel box. `open` 0..1 swings the two top flaps open. */
export const Parcel: React.FC<{ w: number; h: number; open?: number; label?: string; children?: React.ReactNode }> = ({
  w,
  h,
  open = 0,
  label,
  children,
}) => {
  const p = usePalette();
  const flapH = h * 0.32;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      {/* flaps behind the box when open */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: i === 0 ? 0 : w / 2,
            width: w / 2,
            height: flapH,
            background: "#C9D6FF",
            borderRadius: 10,
            transformOrigin: i === 0 ? "0% 0%" : "100% 0%",
            transform: `rotate(${(i === 0 ? 1 : -1) * 110 * open}deg)`,
            opacity: open > 0.02 ? 1 : 0,
          }}
        />
      ))}
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: p.blueSoft,
          borderRadius: 18,
          boxShadow: "0 30px 70px rgba(1, 40, 160, 0.18)",
        }}
      >
        {/* tape */}
        <div
          style={{
            position: "absolute",
            left: w / 2 - w * 0.09,
            width: w * 0.18,
            top: 0,
            height: h * 0.38,
            background: p.yellow,
            opacity: 1 - open,
            borderRadius: "0 0 6px 6px",
          }}
        />
        {label ? (
          <div
            style={{
              position: "absolute",
              left: w * 0.12,
              right: w * 0.12,
              bottom: h * 0.12,
              height: h * 0.3,
              background: p.white,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: h * 0.13,
              color: p.blue,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** The yellow "Betaal later" sticker that sits over the due chip of a bill. */
export const STICKER_W = 400;
export const STICKER_H = 86;
export const Sticker: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: STICKER_W,
        height: STICKER_H,
        background: p.yellow,
        borderRadius: 14,
        boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 46,
        letterSpacing: "-0.03em",
        color: p.ink,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Position of the sticker inside a BillCard (covers the due chip). */
export const STICKER_POS = { left: 30, bottom: 26 };
