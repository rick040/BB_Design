import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { PolaroidProps } from "../schema";

// What's on the photo: a paper bill lying on a table, slightly turned.
// Drawn in a 500 × 500 box and scaled to the photo size.
export const BillPhoto: React.FC<{
  size: number;
  bill: PolaroidProps["bill"];
}> = ({ size, bill }) => {
  const p = usePalette();
  const k = size / 500;
  const bar = (w: number, top: number) => (
    <div style={{ position: "absolute", left: 34, top, width: w, height: 12, borderRadius: 6, background: p.grey }} />
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #e3e9fb, #c9d4f4)" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 500,
          height: 500,
          transform: `scale(${k})`,
          transformOrigin: "0 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 46,
            width: 356,
            height: 420,
            background: p.white,
            borderRadius: 6,
            boxShadow: "0 14px 30px rgba(10, 30, 110, 0.18)",
            transform: "rotate(-4deg)",
            fontFamily: fonts.ui,
          }}
        >
          <div style={{ position: "absolute", left: 34, top: 30, width: 46, height: 46, borderRadius: 12, background: p.blue }} />
          <div style={{ position: "absolute", left: 94, top: 28, fontSize: 26, fontWeight: 600, color: p.ink, letterSpacing: "-0.01em" }}>
            {bill.sender}
          </div>
          <div style={{ position: "absolute", left: 94, top: 60, fontSize: 17, color: "#7a7f8f" }}>{bill.subject}</div>
          {bar(250, 112)}
          {bar(200, 136)}
          {bar(226, 160)}
          <div style={{ position: "absolute", left: 34, top: 206, fontSize: 19, color: "#7a7f8f" }}>{bill.amountLabel}</div>
          <div
            style={{
              position: "absolute",
              left: 32,
              top: 228,
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 70,
              letterSpacing: "-0.04em",
              color: p.ink,
            }}
          >
            {bill.amount}
          </div>
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 330,
              padding: "8px 18px",
              borderRadius: 30,
              background: "#eef2ff",
              color: p.blue,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {bill.due}
          </div>
        </div>
      </div>
    </div>
  );
};
