import React from "react";
import { Headline } from "../../components/Text";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import type { EenplekProps } from "../schema";

type Bill = EenplekProps["bills"][number];

export const PANEL_W = 900;
export const PANEL_HEAD = 110;
export const ROW_H = 102;

/** Loose paper slip on the "zonder Buddy" side. */
export const SLIP_W = 330;
export const SLIP_H = 150;
export const Slip: React.FC<{ bill: Bill; style?: React.CSSProperties }> = ({ bill, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: SLIP_W,
        height: SLIP_H,
        background: p.white,
        borderRadius: 22,
        boxShadow: "0 18px 40px rgba(10, 30, 120, 0.16)",
        padding: "22px 28px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 28, color: p.ink }}>{bill.sender}</div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 44, color: p.blue, letterSpacing: "-0.03em" }}>
          {bill.amount}
        </span>
        <span style={{ fontFamily: fonts.ui, fontSize: 22, color: p.greyText }}>{bill.due}</span>
      </div>
    </div>
  );
};

/** Headline drawn twice and clipped at the divider: blue on light, white on blue. */
export const SplitHeadline: React.FC<{
  text: string;
  divider: number;
  delay: number;
  stagger?: number;
  sizeFactor?: number;
  opacity?: number;
}> = ({ text, divider, delay, stagger = 2, sizeFactor = 1, opacity = 1 }) => {
  const p = usePalette();
  const W = 1080;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {divider > 0 ? (
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${W - divider}px 0 0)` }}>
          <Headline text={text} color={p.blue} delay={delay} stagger={stagger} sizeFactor={sizeFactor} />
        </div>
      ) : null}
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${Math.max(0, divider)}px)` }}>
        <Headline text={text} color={p.white} delay={delay} stagger={stagger} sizeFactor={sizeFactor} />
      </div>
    </div>
  );
};

/** One overview row. `fill` 0..1 = content shown, `flash` 0..1 = arrival pulse. */
export const Row: React.FC<{
  bill: Bill | null;
  y: number;
  fill: number;
  flash: number;
  scale?: number;
  shadow?: number;
}> = ({ bill, y, fill, flash, scale = 1, shadow = 0 }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: PANEL_W,
        height: ROW_H,
        background: `rgba(182, 199, 255, ${0.45 * flash})`,
        borderTop: `2px solid ${p.grey}`,
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        transformOrigin: "50% 0%",
        boxShadow: shadow > 0 ? `0 ${-10 * shadow}px ${24 * shadow}px rgba(10,30,120,${0.12 * shadow})` : undefined,
      }}
    >
      {/* Skeleton while empty */}
      <div style={{ position: "absolute", left: 40, top: 38, width: 300, height: 26, borderRadius: 13, background: p.grey, opacity: 1 - fill }} />
      <div style={{ position: "absolute", right: 40, top: 38, width: 140, height: 26, borderRadius: 13, background: p.grey, opacity: 1 - fill }} />
      {bill ? (
        <div style={{ position: "absolute", inset: 0, opacity: fill }}>
          <div style={{ position: "absolute", left: 40, top: 30, fontFamily: fonts.ui, fontWeight: 600, fontSize: 34, color: p.ink }}>
            {bill.sender}
          </div>
          <div style={{ position: "absolute", left: 520, width: 130, top: 32, textAlign: "center", fontFamily: fonts.ui, fontWeight: 500, fontSize: 31, color: p.blueMascot }}>
            {bill.due}
          </div>
          <div
            style={{
              position: "absolute",
              right: 40,
              top: 26,
              fontFamily: fonts.display,
              fontWeight: 600,
              fontSize: 38,
              color: p.ink,
              letterSpacing: "-0.03em",
            }}
          >
            {bill.amount}
          </div>
        </div>
      ) : null}
    </div>
  );
};

/** Small download glyph for the export chips. */
export const Download: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
    <path d="M20 6v20M11 18l9 9 9-9M8 33h24" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
