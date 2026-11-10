import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const SLIP_W = 620;
export const SLIP_H = 250;

/** The energy bill as a card. `overdue` turns it into the reminder letter. */
export const BillSlip: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  due: string;
  overdue?: string;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, due, overdue, style }) => {
  const p = usePalette();
  const urgent = Boolean(overdue);
  return (
    <div
      style={{
        position: "absolute",
        width: SLIP_W,
        height: SLIP_H,
        borderRadius: 36,
        background: p.card,
        boxShadow: "0 24px 60px rgba(1,59,255,0.18)",
        border: urgent ? `6px solid ${p.red}` : `2px solid ${p.grey}`,
        boxSizing: "border-box",
        padding: "30px 38px",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 600, color: p.ink }}>{sender}</div>
        {urgent ? (
          <div
            style={{
              background: p.red,
              color: p.white,
              fontSize: 28,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 999,
            }}
          >
            {overdue}
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: 28, color: p.greyText, marginTop: 6 }}>{subject}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 34 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 76, fontWeight: 600, letterSpacing: "-0.04em", color: p.blue, lineHeight: 1 }}>
          {amount}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: urgent ? p.red : p.blue,
            background: urgent ? "rgba(255,90,121,0.12)" : "rgba(1,59,255,0.08)",
            padding: "10px 18px",
            borderRadius: 16,
          }}
        >
          {due}
        </div>
      </div>
    </div>
  );
};
