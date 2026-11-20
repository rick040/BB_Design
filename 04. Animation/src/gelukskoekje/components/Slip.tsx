import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

/** The paper fortune slip. `open` 0..1 unrolls it from the centre. */
export const Slip: React.FC<{
  width: number;
  height: number;
  open: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width, height, open, children, style }) => {
  const p = usePalette();
  const o = Math.max(0, Math.min(1, open));
  const inset = ((1 - o) * 50).toFixed(2);
  return (
    <div style={{ position: "absolute", width, height, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: p.white,
          borderRadius: 14,
          boxShadow: "0 24px 60px rgba(1, 40, 160, 0.16)",
          clipPath: `inset(-40px ${inset}% -40px ${inset}%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          overflow: "visible",
        }}
      >
        {/* Faint print border, like a real fortune slip. */}
        <div
          style={{
            position: "absolute",
            inset: 12,
            border: `3px dashed ${p.blueSoft}`,
            borderRadius: 8,
          }}
        />
        {children}
      </div>
    </div>
  );
};
