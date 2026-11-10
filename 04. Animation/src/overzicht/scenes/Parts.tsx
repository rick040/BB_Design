import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import type { OverzichtProps } from "../schema";

type Bill = OverzichtProps["bills"][number];

export const NOTE_W = 300;
export const NOTE_H = 170;

/** A loose bill in the "zonder Buddy" panel: sticky note, letter, mail or receipt. */
export const LooseNote: React.FC<{ bill: Bill; badge: string; badgeIn: number }> = ({ bill, badge, badgeIn }) => {
  const p = usePalette();
  const sticky = bill.look === "sticky";
  const receipt = bill.look === "receipt";
  return (
    <div
      style={{
        position: "relative",
        width: NOTE_W,
        height: NOTE_H,
        background: sticky ? p.yellow : p.white,
        borderRadius: sticky ? 6 : receipt ? 4 : 18,
        boxShadow: "0 14px 34px rgba(0, 20, 120, 0.18)",
        padding: "26px 26px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        color: p.ink,
        overflow: "visible",
        clipPath: receipt
          ? "polygon(0 0,100% 0,100% 92%,95% 100%,90% 92%,85% 100%,80% 92%,75% 100%,70% 92%,65% 100%,60% 92%,55% 100%,50% 92%,45% 100%,40% 92%,35% 100%,30% 92%,25% 100%,20% 92%,15% 100%,10% 92%,5% 100%,0 92%)"
          : undefined,
      }}
    >
      {bill.look === "mail" ? (
        <svg width={44} height={32} viewBox="0 0 44 32" style={{ display: "block", marginBottom: 10 }}>
          <rect x={1.5} y={1.5} width={41} height={29} rx={5} fill="none" stroke={p.blueMid} strokeWidth={3} />
          <path d="M3 5l19 14L41 5" fill="none" stroke={p.blueMid} strokeWidth={3} strokeLinejoin="round" />
        </svg>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
          <div style={{ width: 120, height: 9, borderRadius: 5, background: sticky ? "#e6b41f" : p.grey }} />
          <div style={{ width: 80, height: 9, borderRadius: 5, background: sticky ? "#e6b41f" : p.grey }} />
        </div>
      )}
      <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{bill.sender}</div>
      <div style={{ fontSize: 28, fontWeight: 500, color: p.blue, marginTop: 4 }}>{bill.amount}</div>
      <div
        style={{
          position: "absolute",
          right: -14,
          top: -18,
          padding: "8px 16px",
          borderRadius: 30,
          background: p.red,
          color: p.white,
          fontSize: 24,
          fontWeight: 600,
          transform: `scale(${badgeIn})`,
          opacity: Math.min(1, badgeIn * 2),
        }}
      >
        {badge}
      </div>
    </div>
  );
};

export const ROW_H = 124;

/** One row of Buddy's overview list. */
export const ListRow: React.FC<{
  bill: Bill;
  width: number;
  /** 0..1, grows the date chip in. */
  dateIn: number;
  /** 0..1, flashes the amount. */
  amountFlash: number;
}> = ({ bill, width, dateIn, amountFlash }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width,
        height: ROW_H,
        borderRadius: 26,
        background: p.white,
        boxShadow: "0 12px 30px rgba(0, 20, 120, 0.22)",
        display: "flex",
        alignItems: "center",
        padding: "0 26px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        color: p.ink,
        gap: 18 * dateIn,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 150 * dateIn,
          height: 70,
          borderRadius: 18,
          background: p.blue,
          color: p.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          opacity: dateIn,
          flexShrink: 0,
        }}
      >
        {bill.due}
      </div>
      <div style={{ flex: 1, fontSize: 32, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden" }}>{bill.sender}</div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: p.blue,
          whiteSpace: "nowrap",
          padding: "6px 12px",
          borderRadius: 14,
          background: `rgba(255, 206, 49, ${0.9 * amountFlash})`,
        }}
      >
        {bill.amount}
      </div>
    </div>
  );
};

export const Chip: React.FC<{ text: string; bg: string; color: string; style?: React.CSSProperties }> = ({
  text,
  bg,
  color,
  style,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: "10px 22px",
      borderRadius: 30,
      background: bg,
      color,
      fontFamily: fonts.ui,
      fontSize: 26,
      fontWeight: 600,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

/** Two-line headline whose words can each have their own entry progress. */
export const SplitHeadline: React.FC<{
  text: string;
  top: number;
  size: number;
  /** progress per word, 0..1 */
  wordIn: (index: number) => number;
  secondLine?: string;
  style?: React.CSSProperties;
}> = ({ text, top, size, wordIn, secondLine, style }) => {
  const p = usePalette();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 50,
        right: 50,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
        ...style,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const s = wordIn(wi++);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: li === 0 ? p.white : (secondLine ?? p.white),
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                    filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                  }}
                >
                  {w}
                </span>{" "}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
