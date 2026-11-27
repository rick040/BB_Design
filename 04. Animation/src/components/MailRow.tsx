import React from "react";
import { usePalette } from "../lib/palette";
import { fonts } from "../theme";

// Inbox row in the style of 02. Elements/Asset 30: avatar letter, sender,
// subject and time. No logos: senders are generic ("Webshop").
export const MAIL_ROW_W = 900;
export const MAIL_ROW_H = 150;

export const MailRow: React.FC<{
  sender: string;
  subject: string;
  time: string;
  unread?: boolean;
  width?: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, time, unread = true, width = MAIL_ROW_W, style }) => {
  const p = usePalette();
  const k = width / MAIL_ROW_W;
  return (
    <div
      style={{
        width,
        height: MAIL_ROW_H * k,
        borderRadius: 44 * k,
        background: p.white,
        display: "flex",
        alignItems: "center",
        gap: 26 * k,
        padding: `0 ${40 * k}px 0 ${28 * k}px`,
        boxSizing: "border-box",
        boxShadow: "0 18px 50px rgba(1, 30, 140, 0.18)",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          width: 92 * k,
          height: 92 * k,
          borderRadius: "50%",
          background: p.grey,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40 * k,
          fontWeight: 600,
          color: p.blueMid,
          flexShrink: 0,
        }}
      >
        {sender[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 38 * k, fontWeight: unread ? 650 : 500, color: p.ink }}>{sender}</span>
          <span style={{ fontSize: 28 * k, color: p.greyText }}>{time}</span>
        </div>
        <div
          style={{
            fontSize: 32 * k,
            color: "#4a4a55",
            marginTop: 4 * k,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {subject}
        </div>
      </div>
      {unread ? (
        <div style={{ width: 20 * k, height: 20 * k, borderRadius: "50%", background: p.blue, flexShrink: 0 }} />
      ) : null}
    </div>
  );
};
