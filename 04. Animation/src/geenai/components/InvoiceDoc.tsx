import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { GeenAiProps } from "../schema";

// The forwarded bill as a document: four fields Buddy reads, the rest is noise.
export const DOC_W = 700;
export const DOC_H = 820;
/** Field rectangles inside the document, in spoken order (bedrag, vervaldatum, betaallink, kenmerk). */
export const FIELDS = [
  { x: 36, y: 186, w: 356, h: 118 },
  { x: 36, y: 334, w: 356, h: 118 },
  { x: 36, y: 482, w: 356, h: 118 },
  { x: 36, y: 630, w: 356, h: 118 },
];

const Bar: React.FC<{ x: number; y: number; w: number; h?: number; c: string }> = ({ x, y, w, h = 18, c }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: h / 2, background: c }} />
);

export const InvoiceDoc: React.FC<{
  invoice: GeenAiProps["invoice"];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ invoice, children, style }) => {
  const p = usePalette();
  const fields: [string, React.ReactNode][] = [
    [invoice.amountLabel, <span style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 60, letterSpacing: "-0.04em" }}>{invoice.amount}</span>],
    [invoice.dueLabel, <span style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 52, letterSpacing: "-0.04em" }}>{invoice.due}</span>],
    [
      invoice.linkLabel,
      <span
        style={{
          display: "inline-block",
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 34,
          color: "#fff",
          background: p.blue,
          padding: "8px 30px",
          borderRadius: 30,
          marginTop: 4,
        }}
      >
        {invoice.link}
      </span>,
    ],
    [invoice.refLabel, <span style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 42, letterSpacing: "0.04em" }}>{invoice.ref}</span>],
  ];
  return (
    <div
      style={{
        position: "absolute",
        width: DOC_W,
        height: DOC_H,
        borderRadius: 36,
        background: p.white,
        boxShadow: "0 30px 80px rgba(1, 59, 255, 0.16)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* header */}
      <div style={{ position: "absolute", left: 36, top: 40, width: 76, height: 76, borderRadius: 38, background: p.grey }} />
      <div style={{ position: "absolute", left: 132, top: 40, fontFamily: fonts.ui, fontWeight: 600, fontSize: 36, color: p.ink }}>
        {invoice.sender}
      </div>
      <div style={{ position: "absolute", left: 132, top: 86, fontFamily: fonts.ui, fontSize: 28, color: p.greyText }}>
        {invoice.title}
      </div>
      {/* noise: everything Buddy skips */}
      {FIELDS.map((f, i) => (
        <React.Fragment key={i}>
          <Bar x={460} y={f.y + 16} w={200} c={p.grey} />
          <Bar x={460} y={f.y + 50} w={160} c={p.grey} />
          <Bar x={460} y={f.y + 84} w={190} c={p.grey} />
        </React.Fragment>
      ))}
      <Bar x={36} y={772} w={620} h={16} c={p.grey} />
      {/* the four fields */}
      {FIELDS.map((f, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: f.x,
            top: f.y,
            width: f.w,
            height: f.h,
            padding: "14px 22px",
            boxSizing: "border-box",
            borderRadius: 20,
            background: "#f3f6ff",
            color: p.ink,
          }}
        >
          <div style={{ fontFamily: fonts.ui, fontSize: 24, color: p.greyText, marginBottom: 2 }}>{fields[i][0]}</div>
          <div style={{ lineHeight: 1 }}>{fields[i][1]}</div>
        </div>
      ))}
      {children}
    </div>
  );
};
