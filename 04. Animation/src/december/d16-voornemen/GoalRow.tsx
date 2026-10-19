import React from "react";
import { Checkmark } from "../../components/Checkmark";
import { dec, decFonts } from "../theme";

export const GOAL_ROW_H = 118;

/** Eén voortgangsbalk: label, percentage en een balk. `shown` en `fill` lopen 0 t/m 100; `k` schaalt alles. */
export const GoalRow: React.FC<{
  label: string;
  shown: number;
  fill: number;
  width: number;
  highlight?: boolean;
  /** 0..1: tekent een vinkje achter het percentage. */
  check?: number;
  opacity?: number;
  k?: number;
}> = ({ label, shown, fill, width, highlight = false, check = 0, opacity = 1, k = 1 }) => (
  <div
    style={{
      width,
      height: GOAL_ROW_H * k,
      boxSizing: "border-box",
      padding: highlight ? `${10 * k}px ${22 * k}px 0` : `${10 * k}px 0 0`,
      margin: highlight ? `0 ${-22 * k}px` : 0,
      borderRadius: 30 * k,
      background: highlight ? dec.ice : "transparent",
      opacity,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 * k }}>
      <span style={{ fontFamily: decFonts.text, fontWeight: 600, fontSize: 40 * k, color: dec.ink }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 14 * k, fontFamily: decFonts.display, fontSize: 48 * k, color: dec.blue }}>
        {check > 0 ? <Checkmark size={44 * k} color={dec.blue} progress={check} strokeWidth={16} /> : null}
        {Math.round(shown)} %
      </span>
    </div>
    <div style={{ height: 26 * k, borderRadius: 13 * k, background: highlight ? dec.white : dec.ice, overflow: "hidden", marginTop: 4 * k }}>
      <div style={{ width: `${Math.max(0, Math.min(100, fill))}%`, height: "100%", background: dec.blue, borderRadius: 13 * k }} />
    </div>
  </div>
);

/** Witte kaart met afgeronde hoeken voor de balken. */
export const GoalCard: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties; k?: number }> = ({
  width,
  children,
  style,
  k = 1,
}) => (
  <div
    style={{
      width,
      borderRadius: 48,
      background: dec.white,
      boxShadow: "0 24px 60px rgba(1, 40, 160, 0.16)",
      padding: `${28 * k}px ${40 * k}px ${22 * k}px`,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Hoogte van een GoalCard met `n` rijen. */
export const goalCardHeight = (n: number, k: number) => (28 + 22) * k + n * GOAL_ROW_H * k;
