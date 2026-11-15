import React from "react";
import { Checkmark } from "../../components/Checkmark";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const BILL_W = 860;
export const ROW_H = 74;

/**
 * A bill as Buddy reads it: four fixed rows. `lit[i]` (0..1) lights row i
 * with a numbered tick badge and a checkmark.
 */
export const RuleBill: React.FC<{
  sender: string;
  subject: string;
  fields: { label: string; value: string }[];
  lit: number[];
  style?: React.CSSProperties;
}> = ({ sender, subject, fields, lit, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: BILL_W,
        background: p.white,
        borderRadius: 36,
        padding: "30px 36px 26px",
        boxShadow: "0 24px 60px rgba(1,20,90,0.22)",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: p.grey,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 30,
            color: p.blueMascot,
          }}
        >
          {sender.slice(0, 1)}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 34, color: p.ink }}>{sender}</div>
          <div style={{ fontSize: 26, color: p.greyText, marginTop: 2 }}>{subject}</div>
        </div>
      </div>
      {fields.map((f, i) => {
        const l = Math.max(0, Math.min(1, lit[i] ?? 0));
        return (
          <div
            key={i}
            style={{
              position: "relative",
              height: ROW_H,
              display: "flex",
              alignItems: "center",
              borderTop: `2px solid ${p.grey}`,
              paddingLeft: 66,
              paddingRight: 70,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "6px -14px",
                borderRadius: 18,
                background: p.blueSoft,
                opacity: l * 0.45,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 46,
                height: 46,
                borderRadius: 23,
                background: l > 0 ? p.blue : p.grey,
                color: p.white,
                fontWeight: 700,
                fontSize: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${0.8 + 0.2 * l + Math.sin(l * Math.PI) * 0.25})`,
              }}
            >
              {l > 0 ? i + 1 : ""}
            </div>
            <div style={{ position: "relative", fontSize: 28, color: p.greyText, width: 230 }}>{f.label}</div>
            <div style={{ position: "relative", fontSize: 32, fontWeight: 600, color: p.ink, flex: 1, textAlign: "right" }}>
              {f.value}
            </div>
            <Checkmark
              size={40}
              color={p.blue}
              progress={l}
              strokeWidth={16}
              style={{ position: "absolute", right: 6, top: (ROW_H - 40) / 2 }}
            />
          </div>
        );
      })}
    </div>
  );
};
