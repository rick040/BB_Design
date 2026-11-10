import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

export const MAIL_W = 860;
export const MAIL_H = 300;

/** A received bill mail with a "Doorsturen" button that can be tapped. */
export const ForwardMail: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  button: string;
  /** 0..1 press on the button. */
  press: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, button, press, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: MAIL_W,
        height: MAIL_H,
        borderRadius: 44,
        background: p.white,
        boxShadow: "0 30px 80px rgba(0, 20, 120, 0.28)",
        padding: "34px 40px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: p.grey,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 600,
            color: p.blueMid,
          }}
        >
          {sender[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 35, fontWeight: 600, color: p.ink }}>{sender}</div>
          <div style={{ fontSize: 29, color: p.greyText, marginTop: 2 }}>{subject}</div>
        </div>
        <div style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 500, letterSpacing: "-0.05em", color: p.ink }}>
          {amount}
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 34, display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            height: 86,
            padding: "0 34px",
            borderRadius: 43,
            background: press > 0.05 ? p.blueMid : p.blue,
            color: p.white,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 34,
            fontWeight: 600,
            transform: `scale(${1 - press * 0.08})`,
          }}
        >
          {button}
          <svg width={34} height={34} viewBox="0 0 24 24">
            <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/** Small white chip with a value Buddy pulled out of the bill. */
export const ValueChip: React.FC<{ text: string; s: number; style?: React.CSSProperties }> = ({ text, s, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        height: 92,
        padding: "0 36px",
        borderRadius: 46,
        background: p.white,
        color: p.blue,
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: 46,
        letterSpacing: "-0.03em",
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        boxShadow: "0 16px 40px rgba(0, 20, 120, 0.25)",
        opacity: Math.min(1, s * 2),
        transform: `translate(-50%, 0) translateY(${(1 - s) * 40}px) scale(${0.6 + 0.4 * s})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
