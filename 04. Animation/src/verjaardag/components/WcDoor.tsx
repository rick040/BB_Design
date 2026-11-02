import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A plain toilet door in flat shapes: frame, two panels, handle, sign plate.
export const DOOR_W = 440;
export const DOOR_H = 880;

export const WcDoor: React.FC<{ sign: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  sign,
  children,
  style,
}) => {
  const p = usePalette();
  return (
    <div style={{ position: "absolute", width: DOOR_W, height: DOOR_H, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: -22,
          bottom: 0,
          borderRadius: "16px 16px 0 0",
          background: p.blueMid,
        }}
      />
      <div style={{ position: "absolute", inset: 0, borderRadius: "8px 8px 0 0", background: p.light }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: 150, height: 300, border: `4px solid ${p.grey}`, borderRadius: 10 }} />
        <div style={{ position: "absolute", left: 40, right: 40, top: 500, height: 330, border: `4px solid ${p.grey}`, borderRadius: 10 }} />
        {/* handle */}
        <div style={{ position: "absolute", right: 30, top: 470, width: 70, height: 20, borderRadius: 10, background: p.greyText }} />
        <div style={{ position: "absolute", right: 34, top: 462, width: 20, height: 36, borderRadius: 10, background: p.greyText }} />
        {/* sign */}
        <div
          style={{
            position: "absolute",
            left: DOOR_W / 2 - 60,
            top: 40,
            width: 120,
            height: 66,
            borderRadius: 14,
            background: p.white,
            boxShadow: "0 4px 10px rgba(1,40,160,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 40,
            color: p.blue,
            letterSpacing: "0.02em",
          }}
        >
          {sign}
        </div>
        {children}
      </div>
    </div>
  );
};
