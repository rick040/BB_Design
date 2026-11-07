import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A received bill as a mail, with a "Doorsturen" button that gets tapped.
export const MAIL_W = 900;
export const MAIL_H = 280;

const ForwardIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={34} height={34} viewBox="0 0 32 32">
    <path
      d="M18 7l9 8-9 8M27 15H13a8 8 0 0 0-8 8v2"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MailRow: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  button: string;
  /** 0..1 press on the button. */
  press: number;
  /** 0..1 ripple after the tap. */
  ripple: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, button, press, ripple, style }) => {
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
            flexShrink: 0,
          }}
        >
          {sender.slice(0, 1)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 600, color: p.ink }}>{sender}</div>
          <div style={{ fontSize: 30, color: p.greyText, marginTop: 2 }}>{subject}</div>
        </div>
        <div style={{ fontSize: 44, fontWeight: 600, color: p.ink }}>{amount}</div>
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 32 }}>
        <div
          style={{
            position: "relative",
            height: 76,
            padding: "0 34px 0 26px",
            borderRadius: 38,
            background: p.blue,
            color: p.white,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 32,
            fontWeight: 600,
            transform: `scale(${1 - press * 0.08})`,
          }}
        >
          <ForwardIcon color={p.white} />
          {button}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 160,
              height: 160,
              marginLeft: -80,
              marginTop: -80,
              borderRadius: "50%",
              border: `5px solid ${p.blue}`,
              opacity: ripple > 0 ? (1 - ripple) * 0.8 : 0,
              transform: `scale(${0.4 + ripple * 1.3})`,
            }}
          />
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, bottom: 52, display: "flex", gap: 14 }}>
        <div style={{ width: 220, height: 22, borderRadius: 11, background: p.grey }} />
        <div style={{ width: 120, height: 22, borderRadius: 11, background: p.grey }} />
      </div>
    </div>
  );
};
