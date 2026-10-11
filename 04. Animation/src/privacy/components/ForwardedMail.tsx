import React from "react";
import { Easing, interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A forwarded bill as a full mail. While `scan` runs 0 → 1 a reading line
// sweeps down: the four fields Buddy needs get a highlighter mark, the
// rest of the mail goes out of focus.
export const FWD_W = 820;
export const FWD_H = 712;

const PAD = 44;
const FIELD_TOP = 366;
const FIELD_STEP = 60;
const FIELD_H = 56;
export const SCAN_FROM = 230;
export const SCAN_TO = 700;

/** Card-local y of each field's centre (used to sync the scan line). */
export const fieldCenterY = (i: number) => FIELD_TOP + FIELD_STEP * i + FIELD_H / 2;

const ForwardIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={30} height={30} viewBox="0 0 32 32">
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

export const ForwardedMail: React.FC<{
  chip: string;
  fromLabel: string;
  sender: string;
  subjectLabel: string;
  subject: string;
  greeting: string;
  signOff: string;
  fields: { label: string; value: string; link: boolean }[];
  /** 0..1 progress of the reading line. */
  scan: number;
  style?: React.CSSProperties;
}> = ({ chip, fromLabel, sender, subjectLabel, subject, greeting, signOff, fields, scan, style }) => {
  const p = usePalette();
  const scanY = SCAN_FROM + (SCAN_TO - SCAN_FROM) * scan;
  // 0..1: how far the reading line has passed a given y.
  const passed = (y: number) => interpolate(scanY - y, [0, 36], [0, 1], clamp);
  const dimStyle = (y: number): React.CSSProperties => {
    const d = passed(y);
    return { opacity: 1 - 0.68 * d, filter: d > 0.02 ? `blur(${d * 3.2}px)` : undefined };
  };
  const bar = (top: number, width: number): React.ReactNode => (
    <div
      key={top}
      style={{
        position: "absolute",
        left: PAD,
        top,
        width,
        height: 16,
        borderRadius: 8,
        background: p.grey,
        ...dimStyle(top + 8),
      }}
    />
  );
  const lineOpacity = interpolate(scan, [0, 0.06, 0.92, 1], [0, 1, 1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        width: FWD_W,
        height: FWD_H,
        borderRadius: 48,
        background: p.white,
        boxShadow: "0 30px 90px rgba(1, 40, 160, 0.16)",
        fontFamily: fonts.ui,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Forwarded chip */}
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 40,
          height: 56,
          padding: "0 26px 0 18px",
          borderRadius: 28,
          background: p.blue,
          color: p.white,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        <ForwardIcon color={p.white} />
        {chip}
      </div>

      {/* Header */}
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 120, fontSize: 30, color: p.ink, whiteSpace: "nowrap" }}>
        <span style={{ color: "#8b8b96" }}>{fromLabel}: </span>
        <span style={{ fontWeight: 600 }}>{sender}</span>
      </div>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 162, fontSize: 30, color: p.ink, whiteSpace: "nowrap" }}>
        <span style={{ color: "#8b8b96" }}>{subjectLabel}: </span>
        {subject}
      </div>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 220, height: 2, background: p.grey }} />

      {/* Body */}
      <div style={{ position: "absolute", left: PAD, top: 244, fontSize: 30, color: p.ink, ...dimStyle(261) }}>{greeting}</div>
      {bar(296, 640)}
      {bar(326, 520)}

      {fields.map((f, i) => {
        const top = FIELD_TOP + FIELD_STEP * i;
        const hi = passed(fieldCenterY(i));
        const mark = interpolate(hi, [0, 1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div key={i} style={{ position: "absolute", left: PAD - 16, right: PAD - 16, top, height: FIELD_H }}>
            {/* Highlighter stroke, drawn left to right */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 16,
                background: p.blueSoft,
                opacity: 0.6,
                transform: `scaleX(${mark})`,
                transformOrigin: "0% 50%",
              }}
            />
            <div
              style={{
                position: "relative",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                fontSize: 30,
                transform: `scale(${1 + interpolate(hi, [0, 0.5, 1], [0, 0.03, 0], clamp)})`,
                transformOrigin: "0% 50%",
              }}
            >
              <span style={{ color: hi > 0.5 ? p.blue : "#8b8b96", fontWeight: hi > 0.5 ? 500 : 400 }}>{f.label}</span>
              <span
                style={{
                  color: f.link ? p.blueMid : p.ink,
                  fontWeight: 600,
                  fontSize: 34,
                  textDecoration: f.link ? "underline" : "none",
                  textUnderlineOffset: 6,
                  whiteSpace: "nowrap",
                }}
              >
                {f.value}
              </span>
            </div>
          </div>
        );
      })}

      {bar(618, 600)}
      <div style={{ position: "absolute", left: PAD, top: 648, fontSize: 30, color: p.ink, ...dimStyle(665) }}>{signOff}</div>

      {/* Reading line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: scanY - 4,
          height: 8,
          background: p.blueMid,
          boxShadow: `0 0 28px 8px ${p.blueSoft}`,
          opacity: lineOpacity,
        }}
      />
    </div>
  );
};
