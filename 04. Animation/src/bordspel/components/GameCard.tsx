import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// The forwarded bill as a game card: what Buddy read from it.
export const GAME_W = 520;
export const GAME_H = 330;

export const GameCard: React.FC<{
  name: string;
  amount: string;
  due: string;
  style?: React.CSSProperties;
}> = ({ name, amount, due, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: GAME_W,
        height: GAME_H,
        borderRadius: 44,
        background: p.white,
        boxShadow: `inset 0 0 0 14px ${p.blueSoft}, 0 30px 70px rgba(0, 10, 80, 0.3)`,
        fontFamily: fonts.display,
        color: p.blue,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        ...style,
      }}
    >
      <div style={{ fontFamily: fonts.ui, fontSize: 34, fontWeight: 600, color: p.blueMid }}>{name}</div>
      <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1 }}>{amount}</div>
      <div
        style={{
          fontFamily: fonts.ui,
          fontSize: 34,
          fontWeight: 600,
          padding: "10px 26px",
          borderRadius: 999,
          background: p.blue,
          color: p.white,
        }}
      >
        {due}
      </div>
    </div>
  );
};
