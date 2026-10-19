import React from "react";
import { dec, decFonts } from "../../theme";

// Rooster van 24 deurtjes (6 × 4) in het 1080 × 900 Stage-vak.
export const COLS = 6;
export const DW = 150;
export const DH = 185;
export const GAP = 14;
export const GX = 55;
export const GY = 10;

export const doorPos = (n: number) => ({
  x: GX + ((n - 1) % COLS) * (DW + GAP),
  y: GY + Math.floor((n - 1) / COLS) * (DH + GAP),
});

/** Inhoud van een geopend deurtje. */
export type DoorContent =
  | { kind: "choc" }
  | { kind: "bill"; label: string; amount: string };

export type DoorState = {
  /** 0 = dicht, 1 = open */
  open: number;
  /** 0..1: het deurtje krijgt de aandacht (groter). */
  focus: number;
  content?: DoorContent;
  /** Kleine wiebel (px) van het blad, voor een "kijk hier"-moment. */
  wobble?: number;
};

export const Chocolate: React.FC<{ size: number; color?: string; groove?: string }> = ({
  size,
  color = dec.ink,
  groove = "#475569",
}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" style={{ display: "block", overflow: "visible" }}>
    <g transform="rotate(-8 50 40)">
      {/* de reep: 3 × 2 blokjes met een lichte rand */}
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <g key={`${c}${r}`}>
            <rect x={8 + c * 28} y={8 + r * 32} width="26" height="30" rx="5" fill={color} />
            <path
              d={`M${11 + c * 28} ${35 + r * 32} V${13 + r * 32} Q${11 + c * 28} ${11 + r * 32} ${13 + c * 28 + 2} ${11 + r * 32} H${30 + c * 28}`}
              fill="none"
              stroke={groove}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>
        )),
      )}
      {/* half uitgepakt: folie over de onderste rij */}
      <path d="M4 52 L96 46 L96 74 L4 74Z" fill="#c7d2fe" />
      <path d="M4 52 L12 56 L20 51 L28 57 L36 50 L44 56 L52 50 L60 56 L68 49 L76 55 L84 48 L96 53 V46 L4 52Z" fill="#e0e7ff" />
      <path d="M14 64 H80" stroke="#a5b4fc" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);

const DoorFace: React.FC<{
  n: number;
  state: DoorState;
  leaf: string;
  cavity: string;
  numberColor: string;
  textColor: string;
  accent: string;
}> = ({ n, state, leaf, cavity, numberColor, textColor, accent }) => {
  const open = state.open;
  const angle = -open * 116 + (state.wobble ?? 0);
  const scale = 1 + 0.5 * state.focus;
  const c = state.content;
  return (
    <div
      style={{
        position: "absolute",
        left: doorPos(n).x,
        top: doorPos(n).y,
        width: DW,
        height: DH,
        perspective: 700,
        perspectiveOrigin: "0% 50%",
        zIndex: Math.round(state.focus * 10) + (open > 0 ? 1 : 0),
        transform: `scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          background: cavity,
          boxShadow: state.focus > 0 ? "0 24px 50px rgba(0, 20, 120, 0.3)" : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          overflow: "hidden",
        }}
      >
        {c?.kind === "choc" ? <Chocolate size={118} /> : null}
        {c?.kind === "bill" ? (
          <>
            <div
              style={{
                fontFamily: decFonts.text,
                fontWeight: 600,
                fontSize: 21,
                lineHeight: 1.1,
                textAlign: "center",
                color: textColor,
                padding: "0 8px",
              }}
            >
              {c.label}
            </div>
            <div
              style={{
                fontFamily: decFonts.display,
                fontSize: Math.min(38, 128 / (c.amount.length * 0.64)),
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: accent,
              }}
            >
              {c.amount}
            </div>
          </>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          background: leaf,
          transformOrigin: "0% 50%",
          transform: `rotateY(${angle}deg)`,
          backfaceVisibility: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 0 0 4px rgba(255,255,255,0.14)",
        }}
      >
        <span
          style={{
            fontFamily: decFonts.display,
            fontSize: 64,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: numberColor,
          }}
        >
          {n}
        </span>
      </div>
    </div>
  );
};

export const AdventCalendar: React.FC<{
  states: Record<number, DoorState>;
  leaf: string;
  cavity: string;
  numberColor: string;
  textColor: string;
  accent: string;
  /** Per deurtje een pop-in (0..1); ontbrekend = 1. */
  appear?: (n: number) => number;
}> = ({ states, leaf, cavity, numberColor, textColor, accent, appear }) => (
  <>
    {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => {
      const a = appear ? appear(n) : 1;
      const s = states[n] ?? { open: 0, focus: 0 };
      return (
        <div key={n} style={{ opacity: Math.min(1, a * 1.6), transform: `scale(${0.85 + 0.15 * a})`, transformOrigin: `${doorPos(n).x + DW / 2}px ${doorPos(n).y + DH / 2}px` }}>
          <DoorFace n={n} state={s} leaf={leaf} cavity={cavity} numberColor={numberColor} textColor={textColor} accent={accent} />
        </div>
      );
    })}
  </>
);

/** Vlaggetje met paal en wimpel; (x, y) is de voet van de paal. */
export const Flag: React.FC<{
  x: number;
  y: number;
  label: string;
  pennant: string;
  ink: string;
  scale?: number;
  rotate?: number;
  wave?: number;
}> = ({ x, y, label, pennant, ink, scale = 1, rotate = 0, wave = 0 }) => (
  <svg
    width={110}
    height={106}
    viewBox="0 0 110 106"
    style={{
      position: "absolute",
      left: x - 14.5,
      top: y - 106,
      overflow: "visible",
      transform: `rotate(${rotate}deg) scale(${scale * 1.3})`,
      transformOrigin: "14.5px 106px",
      zIndex: 40,
    }}
  >
    <rect x="11" y="6" width="7" height="100" rx="3.5" fill={pennant} />
    <path d={`M18 8 L${98 + wave} 26 L18 52Z`} fill={pennant} />
    <text x="43" y="38" fontFamily="Archivo Black, sans-serif" fontSize="23" fill={ink} textAnchor="middle">
      {label}
    </text>
  </svg>
);
