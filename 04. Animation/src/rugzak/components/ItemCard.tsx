import React from "react";
import { brand, fonts } from "../../theme";

export const ITEM_W = 400;
export const ITEM_H = 132;

/** One field Buddy keeps from a forwarded bill. */
export const ItemCard: React.FC<{ label: string; value: string; width?: number; style?: React.CSSProperties }> = ({
  label,
  value,
  width = ITEM_W,
  style,
}) => (
  <div
    style={{
      width,
      height: ITEM_H,
      borderRadius: 30,
      background: brand.card,
      boxShadow: "0 14px 30px rgba(0, 20, 90, 0.22)",
      padding: "22px 30px",
      boxSizing: "border-box",
      fontFamily: fonts.ui,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 6,
      ...style,
    }}
  >
    <div style={{ fontSize: 28, color: brand.greyText, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 42, color: brand.ink, fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{value}</div>
  </div>
);
