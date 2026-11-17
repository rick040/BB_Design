import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const NOTA_W = 290;
export const NOTA_H = 350;

/** A small healthcare bill ("zorgnota") slip. `flash` 0..1 tints the date chip yellow. */
export const NotaCard: React.FC<{
  sender: string;
  amount: string;
  due: string;
  flash?: number;
  style?: React.CSSProperties;
}> = ({ sender, amount, due, flash = 0, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: NOTA_W,
        height: NOTA_H,
        borderRadius: 34,
        background: p.white,
        boxShadow: "0 26px 60px rgba(0, 25, 120, 0.22)",
        padding: "30px 28px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: p.grey,
            color: p.blue,
            fontWeight: 600,
            fontSize: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {sender.slice(0, 1)}
        </div>
        <div style={{ fontWeight: 600, fontSize: 32, color: p.ink }}>{sender}</div>
      </div>
      <div style={{ marginTop: 22, fontSize: 26, color: p.greyText }}>Zorgnota</div>
      <div style={{ height: 14, width: "80%", borderRadius: 7, background: p.grey, marginTop: 16 }} />
      <div style={{ height: 14, width: "55%", borderRadius: 7, background: p.grey, marginTop: 12 }} />
      <div
        style={{
          marginTop: "auto",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 58,
          letterSpacing: "-0.04em",
          color: p.ink,
        }}
      >
        {amount}
      </div>
      <div
        style={{
          marginTop: 10,
          alignSelf: "flex-start",
          padding: "8px 18px",
          borderRadius: 22,
          fontSize: 26,
          fontWeight: 600,
          background: flash > 0.5 ? p.yellow : p.grey,
          color: p.ink,
          transform: `scale(${1 + 0.12 * Math.sin(Math.PI * flash)})`,
        }}
      >
        {due}
      </div>
    </div>
  );
};
