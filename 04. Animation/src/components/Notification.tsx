import React from "react";
import { fonts } from "../theme";
import { usePalette } from "../lib/palette";
import { AppIcon } from "./AppIcon";
import { StatusIcon, type StatusKind } from "./StatusIcon";

// Rebuilt from 02. Elements (Asset 21–23): white pill, app icon on grey
// circle, Geist title, grey subtitle with a status icon, time top-right.
export const NOTIFICATION_W = 900;
export const NOTIFICATION_H = 156;

export const Notification: React.FC<{
  text: string;
  time: string;
  icon: StatusKind;
  title?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({ text, time, icon, title = "BetaalBuddy", width = NOTIFICATION_W, style }) => {
  const p = usePalette();
  const k = width / NOTIFICATION_W;

  return (
    <div
      style={{
        width,
        height: NOTIFICATION_H * k,
        borderRadius: 57 * k,
        background: p.card,
        display: "flex",
        alignItems: "center",
        gap: 26 * k,
        padding: `0 ${40 * k}px 0 ${24 * k}px`,
        boxSizing: "border-box",
        boxShadow: "0 18px 50px rgba(1, 30, 140, 0.18)",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <AppIcon size={112 * k} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 36 * k,
              color: p.ink,
              letterSpacing: "0.03em",
              fontWeight: 450,
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: 30 * k, color: p.greyText, letterSpacing: "0.03em" }}>
            {time}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12 * k,
            marginTop: 8 * k,
          }}
        >
          <StatusIcon kind={icon} size={34 * k} />
          <span
            style={{
              fontSize: 30 * k,
              color: p.greyText,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};
