import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A small bill card: generic sender + its own date chip.
export const SENDER_W = 470;
export const SENDER_H = 150;

export const SenderCard: React.FC<{
  sender: string;
  dateLabel: string;
  /** 0..1, pops the yellow date chip. */
  chip?: number;
  style?: React.CSSProperties;
}> = ({ sender, dateLabel, chip = 1, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: SENDER_W,
        height: SENDER_H,
        borderRadius: 38,
        background: p.white,
        boxShadow: "0 18px 44px rgba(1, 40, 160, 0.14)",
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "0 24px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: "50%",
          background: p.grey,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
          fontWeight: 600,
          color: p.blueMid,
          flexShrink: 0,
        }}
      >
        {sender[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: p.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {sender}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "4px 18px",
            borderRadius: 22,
            background: p.red,
            color: p.ink,
            fontSize: 28,
            fontWeight: 600,
            transform: `scale(${chip})`,
            transformOrigin: "0% 50%",
          }}
        >
          {dateLabel}
        </div>
      </div>
    </div>
  );
};
