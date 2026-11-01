import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import type { NaambordBill } from "../schema";
import { MailIcon } from "./Labels";

export const MINI_W = 322;
export const MINI_H = 300;

/** Small bill card (scene 1): mail icon, sender, amount, due date. */
export const MiniBill: React.FC<{
  bill: NaambordBill;
  dueLabel: string;
  style?: React.CSSProperties;
}> = ({ bill, dueLabel, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: MINI_W,
        height: MINI_H,
        borderRadius: 34,
        background: p.white,
        boxShadow: "0 26px 60px rgba(1, 40, 160, 0.14)",
        padding: "30px 26px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <MailIcon size={62} color={p.blueMid} bg={p.grey} />
      <div
        style={{
          marginTop: 20,
          fontSize: 27,
          fontWeight: 600,
          color: p.ink,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {bill.sender}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 64,
          letterSpacing: headlineTracking,
          color: p.ink,
          lineHeight: 1,
        }}
      >
        {bill.amount}
      </div>
      <div style={{ marginTop: 12, fontSize: 27, color: "#6e6e7c" }}>
        {dueLabel.toLowerCase()} {bill.due}
      </div>
    </div>
  );
};
