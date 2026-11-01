import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { NaambordBill } from "../schema";
import { MailIcon } from "./Labels";

export const ROW_W = 860;
export const ROW_H = 168;
// The due chip, relative to the row (for the marker circle around it).
export const DUE_CHIP = { right: 40, w: 250, h: 62 };

/** A forwarded bill as a wide row (scene 2). */
export const BillRow: React.FC<{
  bill: NaambordBill;
  dueLabel: string;
  /** 0..1: yellow marker circle drawn around the due date. */
  circle?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ bill, dueLabel, circle = 0, style, children }) => {
  const p = usePalette();
  const chipLeft = ROW_W - DUE_CHIP.right - DUE_CHIP.w;
  const chipTop = (ROW_H - DUE_CHIP.h) / 2;
  return (
    <div
      style={{
        position: "absolute",
        width: ROW_W,
        height: ROW_H,
        borderRadius: 36,
        background: p.white,
        boxShadow: "0 24px 60px rgba(0, 10, 80, 0.25)",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ position: "absolute", left: 34, top: (ROW_H - 84) / 2 }}>
        <MailIcon size={84} color={p.blueMid} bg={p.grey} />
      </div>
      <div style={{ position: "absolute", left: 142, top: 40, right: DUE_CHIP.w + DUE_CHIP.right + 16 }}>
        <div style={{ fontSize: 33, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{bill.sender}</div>
        <div style={{ fontSize: 29, color: "#7a7a88", marginTop: 6 }}>{bill.amount}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: chipLeft,
          top: chipTop,
          width: DUE_CHIP.w,
          height: DUE_CHIP.h,
          borderRadius: DUE_CHIP.h / 2,
          background: p.grey,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: 27,
          fontWeight: 600,
          color: "#4b4b58",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontWeight: 400 }}>{dueLabel}</span> {bill.due}
      </div>
      {circle > 0 ? (
        <svg
          width={DUE_CHIP.w + 60}
          height={DUE_CHIP.h + 56}
          viewBox={`0 0 ${DUE_CHIP.w + 60} ${DUE_CHIP.h + 56}`}
          style={{ position: "absolute", left: chipLeft - 30, top: chipTop - 28, overflow: "visible" }}
        >
          <path
            d={`M ${DUE_CHIP.w * 0.62} 10 C ${DUE_CHIP.w + 70} 4, ${DUE_CHIP.w + 66} ${DUE_CHIP.h + 50}, ${(DUE_CHIP.w + 60) / 2} ${DUE_CHIP.h + 48} C -6 ${DUE_CHIP.h + 46}, -10 8, ${DUE_CHIP.w * 0.5} 8 L ${DUE_CHIP.w * 0.72} 14`}
            fill="none"
            stroke={p.yellow}
            strokeWidth={7}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - circle}
          />
        </svg>
      ) : null}
      {children}
    </div>
  );
};
