import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// A board-game path of 12 day squares, three rows of four, snaking:
// row 1 left→right, row 2 right→left, row 3 left→right.
export const SQ_W = 190;
export const SQ_H = 196;
export const SQ_GAP = 22;
export const BOARD_PAD = 30;
export const COLS = 4;
export const ROWS = 3;
export const BOARD_W = COLS * SQ_W + (COLS - 1) * SQ_GAP + BOARD_PAD * 2; // 886
export const BOARD_H = ROWS * SQ_H + (ROWS - 1) * SQ_GAP + BOARD_PAD * 2; // 554

/** Top-left of square i, relative to the board. */
export const squarePos = (i: number) => {
  const row = Math.floor(i / COLS);
  const k = i % COLS;
  const col = row % 2 === 0 ? k : COLS - 1 - k;
  return { x: BOARD_PAD + col * (SQ_W + SQ_GAP), y: BOARD_PAD + row * (SQ_H + SQ_GAP) };
};

/** Centre of square i, relative to the board. */
export const squareCenter = (i: number) => {
  const p = squarePos(i);
  return { x: p.x + SQ_W / 2, y: p.y + SQ_H / 2 };
};

export type SquareLook = {
  /** Background colour of the square. */
  bg?: string;
  /** Text colour. */
  fg?: string;
  /** Outline colour (drawn inside, 6 px). */
  ring?: string;
  /** Small tag under the number, e.g. "Vervalt". */
  tag?: string;
  /** Scale bump. */
  scale?: number;
  /** Diagonal strike-through, 0..1. */
  strike?: number;
  opacity?: number;
};

export const Board: React.FC<{
  days: string[];
  looks?: Record<number, SquareLook>;
  /** Board background. */
  bg: string;
  /** Default square colour. */
  square: string;
  /** Path line between squares. */
  track: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ days, looks = {}, bg, square, track, style, children }) => {
  const p = usePalette();
  // Path through all square centres.
  const pts = days.map((_, i) => squareCenter(i));
  const d = pts.map((q, i) => `${i === 0 ? "M" : "L"}${q.x},${q.y}`).join(" ");

  return (
    <div
      style={{
        position: "absolute",
        width: BOARD_W,
        height: BOARD_H,
        borderRadius: 54,
        background: bg,
        boxShadow: "0 30px 80px rgba(1, 40, 160, 0.14)",
        ...style,
      }}
    >
      <svg width={BOARD_W} height={BOARD_H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={d} fill="none" stroke={track} strokeWidth={26} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {days.map((label, i) => {
        const pos = squarePos(i);
        const look = looks[i] ?? {};
        const [wd, ...rest] = label.split(" ");
        const num = rest.join(" ");
        const fg = look.fg ?? p.blue;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              width: SQ_W,
              height: SQ_H,
              borderRadius: 30,
              background: look.bg ?? square,
              boxShadow: look.ring ? `inset 0 0 0 6px ${look.ring}` : undefined,
              transform: `scale(${look.scale ?? 1})`,
              opacity: look.opacity ?? 1,
              fontFamily: fonts.display,
              color: fg,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: "0.02em", opacity: 0.75, lineHeight: 1 }}>{wd}</div>
            <div style={{ fontSize: 80, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 1.0 }}>{num}</div>
            {look.tag ? (
              <div style={{ fontFamily: fonts.ui, fontSize: 27, fontWeight: 650, marginTop: 6, lineHeight: 1 }}>{look.tag}</div>
            ) : null}
            {look.strike ? (
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  top: SQ_H / 2 - 4,
                  width: (SQ_W - 40) * look.strike,
                  height: 8,
                  borderRadius: 4,
                  background: fg,
                  transform: "rotate(-14deg)",
                  transformOrigin: "0 50%",
                }}
              />
            ) : null}
          </div>
        );
      })}
      {children}
    </div>
  );
};
