import React from "react";
import { fonts } from "../../theme";

// A single agenda day tile: month strip, weekday, big day number and an
// event line that drops in (eventIn 0..1).
export const AGENDA_W = 380;
export const AGENDA_H = 400;

export const AgendaDay: React.FC<{
  month: string;
  weekday: string;
  day: string;
  event: string;
  eventIn: number;
  blue: string;
  soft: string;
  style?: React.CSSProperties;
}> = ({ month, weekday, day, event, eventIn, blue, soft, style }) => (
  <div
    style={{
      position: "absolute",
      width: AGENDA_W,
      height: AGENDA_H,
      borderRadius: 34,
      background: "#ffffff",
      boxShadow: "0 24px 60px rgba(1,40,160,0.18)",
      overflow: "hidden",
      fontFamily: fonts.ui,
      ...style,
    }}
  >
    <div style={{ height: 84, background: blue, color: "#ffffff", fontSize: 40, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.04em" }}>
      {month}
    </div>
    <div style={{ textAlign: "center", color: blue, marginTop: 12 }}>
      <div style={{ fontSize: 40, fontWeight: 500, opacity: 0.7 }}>{weekday}</div>
      <div style={{ fontFamily: fonts.display, fontSize: 150, fontWeight: 600, lineHeight: 0.95, letterSpacing: "-0.05em" }}>{day}</div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 22,
        right: 22,
        bottom: 22,
        padding: "14px 16px",
        borderRadius: 16,
        background: soft,
        color: blue,
        fontSize: 30,
        fontWeight: 600,
        textAlign: "center",
        opacity: Math.min(1, eventIn * 1.5),
        transform: `translateY(${(1 - eventIn) * -60}px) scale(${0.85 + 0.15 * eventIn})`,
      }}
    >
      {event}
    </div>
  </div>
);

/** Small bell icon, drawn as SVG (no emoji). */
export const Bell: React.FC<{ size: number; color: string; ring?: number }> = ({ size, color, ring = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block", transform: `rotate(${Math.sin(ring) * 14}deg)` }}>
    <path d="M24 6c-7 0-12 5-12 12v9l-4 6h32l-4-6v-9c0-7-5-12-12-12z" fill={color} />
    <circle cx={24} cy={39} r={5} fill={color} />
  </svg>
);
