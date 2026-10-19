import React from "react";
import { dec, decFonts, decTracking } from "../theme";

/** Tekst met *gemarkeerde* woorden (lichtblauwe markeerstift). */
export const Rich: React.FC<{ text: string; mark: string }> = ({ text, mark }) => (
  <>
    {text.split("*").map((part, i) =>
      i % 2 === 1 ? (
        <span
          key={i}
          style={{
            background: mark,
            borderRadius: 10,
            padding: "0 14px 0 10px",
            margin: "0 -4px",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          }}
        >
          {part}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

/** Puntjes voor "slide x van y", rechtsboven. */
export const Pager: React.FC<{ index: number; total: number; color: string; dim: string }> = ({ index, total, color, dim }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        style={{
          width: i + 1 === index ? 38 : 14,
          height: 14,
          borderRadius: 7,
          background: i + 1 === index ? color : dim,
        }}
      />
    ))}
  </div>
);

/** Kopregel van een slide: label links, pager rechts. */
export const SlideTop: React.FC<{ label: string; index: number; total: number; color: string; dim: string }> = ({
  label,
  index,
  total,
  color,
  dim,
}) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      right: 90,
      top: 84,
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <span style={{ fontFamily: decFonts.display, fontWeight: 500, letterSpacing: decTracking, fontSize: 32, color }}>{label}</span>
    <Pager index={index} total={total} color={color} dim={dim} />
  </div>
);

/** Veegaanwijzing onderaan de eerste slide. */
export const SwipeHint: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: decFonts.text, fontWeight: 500, fontSize: 30, color }}>
    {text}
    <svg width={36} height={36} viewBox="0 0 40 40">
      <path d="M6 20h27M22 9l11 11-11 11" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** Een mailrij als skeleton of met tekst (UI-lettertype). */
export const MailRow: React.FC<{
  sender: string;
  subject?: string;
  tag?: string;
  width: number;
  highlight?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ sender, subject, tag, width, highlight = false, opacity = 1, style }) => (
  <div
    style={{
      width,
      height: 104,
      borderRadius: 30,
      background: dec.white,
      boxShadow: highlight ? "0 14px 40px rgba(1, 59, 255, 0.28)" : "0 8px 24px rgba(1, 40, 160, 0.10)",
      border: highlight ? `3px solid ${dec.blue}` : "3px solid transparent",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 22,
      padding: "0 28px 0 22px",
      fontFamily: decFonts.ui,
      opacity,
      ...style,
    }}
  >
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: highlight ? dec.blue : dec.grey,
        color: dec.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 26,
        flexShrink: 0,
      }}
    >
      {highlight ? sender.slice(0, 1) : null}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 30, fontWeight: 600, color: dec.ink, lineHeight: 1.1 }}>{sender}</div>
      {subject ? (
        <div style={{ fontSize: 26, color: dec.greyText, marginTop: 4, lineHeight: 1.1 }}>{subject}</div>
      ) : (
        <div style={{ height: 14, width: "62%", borderRadius: 7, background: dec.grey, marginTop: 10 }} />
      )}
    </div>
    {tag ? (
      <div
        style={{
          background: highlight ? dec.blue : dec.grey,
          color: highlight ? dec.white : dec.greyText,
          borderRadius: 999,
          padding: "8px 18px",
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        {tag}
      </div>
    ) : null}
  </div>
);
